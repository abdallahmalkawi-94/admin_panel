<?php

namespace Tests\Feature;

use App\Constants\fees_type;
use App\Constants\payout_models;
use App\Constants\refund_option;
use App\Constants\subscription_model;
use App\Models\FeesCollectionModel;
use App\Models\PaymentMethod;
use App\Models\Psp;
use App\Models\PspPaymentMethod;
use App\Models\PspStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FeesCollectionModelTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seedReferenceData();
        $this->user = $this->createVerifiedUser();
        $this->actingAs($this->user);
    }

    public function test_it_renders_the_fee_slices_page_with_sorted_rows(): void
    {
        $pspPaymentMethod = $this->createPspPaymentMethod();

        $firstSlice = $this->createFeeSlice($pspPaymentMethod, [
            'from' => 501,
            'to' => 1000,
            'is_default' => false,
        ]);
        $secondSlice = $this->createFeeSlice($pspPaymentMethod, [
            'from' => 0,
            'to' => 500,
            'is_default' => false,
        ]);
        $thirdSlice = $this->createFeeSlice($pspPaymentMethod, [
            'from' => 1001,
            'to' => 5000,
            'is_default' => true,
        ]);

        $response = $this->get(route('fees-collection-model.create', $pspPaymentMethod));

        $response->assertOk();

        $response->assertInertia(fn (Assert $page) => $page
            ->component('psp-payment-methods/fees-collection-model/create')
            ->where('pspPaymentMethod.id', $pspPaymentMethod->id)
            ->where('feeSlices', function (array $feeSlices) use ($secondSlice, $firstSlice, $thirdSlice) {
                return count($feeSlices) === 3
                    && $feeSlices[0]['id'] === $secondSlice->id
                    && $feeSlices[1]['id'] === $firstSlice->id
                    && $feeSlices[2]['id'] === $thirdSlice->id
                    && (float) $feeSlices[2]['to'] === 5000.0;
            })
        );
    }

    public function test_it_saves_fee_slices_and_soft_deletes_omitted_rows(): void
    {
        $pspPaymentMethod = $this->createPspPaymentMethod();

        $retainedSlice = $this->createFeeSlice($pspPaymentMethod, [
            'from' => 0,
            'to' => 100,
            'is_default' => false,
        ]);
        $removedSlice = $this->createFeeSlice($pspPaymentMethod, [
            'from' => 101,
            'to' => 200,
            'is_default' => true,
        ]);

        $payload = [
            'slices' => [
                [
                    'id' => $retainedSlice->id,
                    'from' => '0',
                    'to' => '250',
                    'foc_fixed' => '2.5',
                    'fom_fixed' => '5',
                    'foc_percentage' => '0.5',
                    'fom_percentage' => '1.25',
                    'foc_psp_cost_fixed' => '0.10',
                    'fom_psp_cost_fixed' => '1',
                    'fom_psp_cost_percentage' => '0.05',
                    'foc_psp_cost_percentage' => '0.25',
                    'installment_fom_fixed' => '1.5',
                    'installment_fom_percentage' => '0.55',
                    'installment_foc_fixed' => '0.5',
                    'installment_foc_percentage' => '0.2',
                    'is_default' => false,
                ],
                [
                    'from' => '251',
                    'to' => '9999',
                    'foc_fixed' => '7.5',
                    'fom_fixed' => '10',
                    'foc_percentage' => '0.35',
                    'fom_percentage' => '0.95',
                    'foc_psp_cost_fixed' => '0.15',
                    'fom_psp_cost_fixed' => '2',
                    'fom_psp_cost_percentage' => '0.08',
                    'foc_psp_cost_percentage' => '0.4',
                    'installment_fom_fixed' => '2.5',
                    'installment_fom_percentage' => '0.8',
                    'installment_foc_fixed' => '0.75',
                    'installment_foc_percentage' => '0.3',
                    'is_default' => true,
                ],
            ],
        ];

        $response = $this->post(route('fees-collection-model.store', $pspPaymentMethod), $payload);

        $response->assertRedirect(route('fees-collection-model.create', $pspPaymentMethod));
        $response->assertSessionHas('success');

        $activeSlices = FeesCollectionModel::query()
            ->where('psp_payment_method_id', $pspPaymentMethod->id)
            ->orderBy('from')
            ->get();

        $this->assertCount(2, $activeSlices);
        $this->assertSame($retainedSlice->id, $activeSlices[0]->id);
        $this->assertEquals(250.0, (float) $activeSlices[0]->to);
        $this->assertFalse($activeSlices[0]->is_default);
        $this->assertSame($this->user->id, $activeSlices[0]->updated_by);

        $this->assertEquals(9999.0, (float) $activeSlices[1]->to);
        $this->assertTrue($activeSlices[1]->is_default);
        $this->assertSame($this->user->id, $activeSlices[1]->created_by);
        $this->assertSame($this->user->id, $activeSlices[1]->updated_by);

        $this->assertSoftDeleted('fees_collection_models', [
            'id' => $removedSlice->id,
        ]);
    }

    public function test_it_requires_exactly_one_default_slice(): void
    {
        $pspPaymentMethod = $this->createPspPaymentMethod();
        $payload = ['slices' => $this->validSlicesPayload()];

        $payload['slices'][0]['is_default'] = false;
        $payload['slices'][1]['is_default'] = false;

        $response = $this
            ->from(route('fees-collection-model.create', $pspPaymentMethod))
            ->post(route('fees-collection-model.store', $pspPaymentMethod), $payload);

        $response->assertSessionHasErrors('slices');
    }

    public function test_it_rejects_multiple_default_slices(): void
    {
        $pspPaymentMethod = $this->createPspPaymentMethod();
        $payload = ['slices' => $this->validSlicesPayload()];

        $payload['slices'][0]['is_default'] = true;
        $payload['slices'][1]['is_default'] = true;

        $response = $this
            ->from(route('fees-collection-model.create', $pspPaymentMethod))
            ->post(route('fees-collection-model.store', $pspPaymentMethod), $payload);

        $response->assertSessionHasErrors('slices');
    }

    public function test_it_rejects_overlapping_ranges(): void
    {
        $pspPaymentMethod = $this->createPspPaymentMethod();
        $payload = ['slices' => $this->validSlicesPayload()];

        $payload['slices'][1]['from'] = '500';
        $payload['slices'][1]['to'] = '900';

        $response = $this
            ->from(route('fees-collection-model.create', $pspPaymentMethod))
            ->post(route('fees-collection-model.store', $pspPaymentMethod), $payload);

        $response->assertSessionHasErrors('slices.1.from');
    }

    public function test_it_rejects_a_range_where_upper_bound_is_less_than_lower_bound(): void
    {
        $pspPaymentMethod = $this->createPspPaymentMethod();
        $payload = ['slices' => $this->validSlicesPayload()];

        $payload['slices'][0]['from'] = '100';
        $payload['slices'][0]['to'] = '50';

        $response = $this
            ->from(route('fees-collection-model.create', $pspPaymentMethod))
            ->post(route('fees-collection-model.store', $pspPaymentMethod), $payload);

        $response->assertSessionHasErrors('slices.0.to');
    }

    public function test_it_requires_the_upper_bound_for_every_slice(): void
    {
        $pspPaymentMethod = $this->createPspPaymentMethod();
        $payload = ['slices' => $this->validSlicesPayload()];

        $payload['slices'][0]['to'] = null;

        $response = $this
            ->from(route('fees-collection-model.create', $pspPaymentMethod))
            ->post(route('fees-collection-model.store', $pspPaymentMethod), $payload);

        $response->assertSessionHasErrors('slices.0.to');
    }

    public function test_it_requires_each_next_slice_to_start_from_previous_to_plus_one(): void
    {
        $pspPaymentMethod = $this->createPspPaymentMethod();
        $payload = ['slices' => $this->validSlicesPayload()];

        $payload['slices'][1]['from'] = '550';

        $response = $this
            ->from(route('fees-collection-model.create', $pspPaymentMethod))
            ->post(route('fees-collection-model.store', $pspPaymentMethod), $payload);

        $response->assertSessionHasErrors('slices.1.from');
    }

    public function test_it_rejects_slice_ids_from_another_psp_payment_method(): void
    {
        $pspPaymentMethod = $this->createPspPaymentMethod();
        $otherPspPaymentMethod = $this->createPspPaymentMethod();
        $foreignSlice = $this->createFeeSlice($otherPspPaymentMethod, [
            'from' => 0,
            'to' => 100,
            'is_default' => false,
        ]);

        $payload = ['slices' => $this->validSlicesPayload()];
        $payload['slices'][0]['id'] = $foreignSlice->id;

        $response = $this
            ->from(route('fees-collection-model.create', $pspPaymentMethod))
            ->post(route('fees-collection-model.store', $pspPaymentMethod), $payload);

        $response->assertSessionHasErrors('slices.0.id');
    }

    private function seedReferenceData(): void
    {
        $countryId = DB::table('countries')->insertGetId([
            'iso2' => 'JO',
            'name' => 'Jordan',
            'status' => 1,
            'phone_code' => '962',
            'iso3' => 'JOR',
            'region' => 'Asia',
            'subregion' => 'Western Asia',
        ]);

        DB::table('currencies')->insert([
            'country_id' => $countryId,
            'name' => 'Jordanian Dinar',
            'code' => 'JOD',
            'precision' => 2,
            'symbol' => 'JD',
            'symbol_native' => 'JD',
            'symbol_first' => 1,
            'decimal_mark' => '.',
            'thousands_separator' => ',',
        ]);

        DB::table('user_statuses')->insert([
            'id' => 1,
            'description' => 'Active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('psp_statuses')->insert([
            'id' => PspStatus::ACTIVE,
            'code' => 'active',
            'description' => 'Active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('refund_options')->insert([
            'id' => refund_option::NO_REFUND,
            'code' => refund_option::NO_REFUND,
            'description' => 'No Refund',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('payout_models')->insert([
            'id' => payout_models::WEEKLY,
            'code' => 'weekly',
            'description' => 'Weekly',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function createVerifiedUser(): User
    {
        $user = User::query()->create([
            'name' => 'Fees Test User',
            'email' => 'fees-'.Str::lower(Str::random(10)).'@example.com',
            'password' => Hash::make('password'),
            'country_code' => 'JO',
            'mobile_number' => '079'.random_int(1000000, 9999999),
            'status_id' => 1,
        ]);

        $user->forceFill([
            'email_verified_at' => now(),
        ])->save();

        return $user;
    }

    private function createPspPaymentMethod(): PspPaymentMethod
    {
        $psp = Psp::query()->create([
            'name' => 'PSP '.Str::upper(Str::random(6)),
            'code' => 'PSP-'.Str::upper(Str::random(8)),
            'country_code' => 'JO',
            'settlement_currency_code' => 'JOD',
            'monthly_fees' => 0,
            'psp_status_id' => PspStatus::ACTIVE,
        ]);

        $paymentMethod = PaymentMethod::query()->create([
            'description' => 'Card '.Str::upper(Str::random(4)),
            'code' => 'PM-'.Str::upper(Str::random(8)),
            'info' => 'Payment method info',
            'is_one_time_payment' => true,
        ]);

        return PspPaymentMethod::query()->create([
            'psp_id' => $psp->id,
            'payment_method_id' => $paymentMethod->id,
            'refund_option_id' => refund_option::NO_REFUND,
            'payout_model_id' => payout_models::WEEKLY,
            'support_tokenization' => true,
            'subscription_model' => subscription_model::REVENUE_SHARING,
            'is_active' => true,
            'shown_in_checkout' => true,
            'support_international_payment' => true,
            'post_fees_to_psp' => false,
            'fees_type' => fees_type::ON_MERCHANT,
            'priority' => 1,
            'max_allowed_amount' => 100000,
            'min_allowed_amount' => 0,
            'config' => ['api_key' => 'live-key'],
            'test_config' => ['api_key' => 'test-key'],
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);
    }

    private function createFeeSlice(PspPaymentMethod $pspPaymentMethod, array $overrides = []): FeesCollectionModel
    {
        return FeesCollectionModel::query()->create([
            'psp_payment_method_id' => $pspPaymentMethod->id,
            'merchant_id' => null,
            'invoice_type_id' => null,
            'from' => 0,
            'to' => 100,
            'foc_fixed' => 1,
            'fom_fixed' => 2,
            'foc_percentage' => 0.5,
            'fom_percentage' => 1.25,
            'foc_psp_cost_fixed' => 0.1,
            'fom_psp_cost_fixed' => 1,
            'fom_psp_cost_percentage' => 0.05,
            'foc_psp_cost_percentage' => 0.25,
            'installment_fom_fixed' => 1.5,
            'installment_fom_percentage' => 0.55,
            'installment_foc_fixed' => 0.5,
            'installment_foc_percentage' => 0.2,
            'is_default' => false,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
            ...$overrides,
        ]);
    }

    private function validSlicesPayload(): array
    {
        return [
            [
                'from' => '0',
                'to' => '500',
                'foc_fixed' => '2.5',
                'fom_fixed' => '5',
                'foc_percentage' => '0.5',
                'fom_percentage' => '1.25',
                'foc_psp_cost_fixed' => '0.10',
                'fom_psp_cost_fixed' => '1',
                'fom_psp_cost_percentage' => '0.05',
                'foc_psp_cost_percentage' => '0.25',
                'installment_fom_fixed' => '1.5',
                'installment_fom_percentage' => '0.55',
                'installment_foc_fixed' => '0.5',
                'installment_foc_percentage' => '0.2',
                'is_default' => false,
            ],
            [
                'from' => '501',
                'to' => '1000',
                'foc_fixed' => '5',
                'fom_fixed' => '10',
                'foc_percentage' => '0.45',
                'fom_percentage' => '1.1',
                'foc_psp_cost_fixed' => '0.15',
                'fom_psp_cost_fixed' => '2',
                'fom_psp_cost_percentage' => '0.08',
                'foc_psp_cost_percentage' => '0.4',
                'installment_fom_fixed' => '2',
                'installment_fom_percentage' => '0.8',
                'installment_foc_fixed' => '0.65',
                'installment_foc_percentage' => '0.3',
                'is_default' => true,
            ],
        ];
    }
}
