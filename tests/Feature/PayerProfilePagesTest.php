<?php

namespace Tests\Feature;

use App\Models\Merchant;
use App\Models\PayerProfile;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PayerProfilePagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    public function test_index_displays_payer_profiles(): void
    {
        ['product' => $product, 'merchant' => $merchant] = $this->seedReferenceData();

        $this->actingAs($this->createVerifiedUser());

        $payerProfile = $this->createPayerProfile($product, $merchant, [
            'full_name' => 'Jane Payer',
            'username' => 'jane.payer',
            'email' => 'jane.payer@example.com',
        ]);

        $response = $this->get(route('payer-profiles.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('payer-profiles/index')
            ->has('payerProfiles.data', 1)
            ->where('payerProfiles.data.0.id', $payerProfile->id)
            ->where('payerProfiles.data.0.product.en_name', $product->en_name)
            ->where('payerProfiles.data.0.merchant.en_name', $merchant->en_name)
        );
    }

    public function test_index_filters_payer_profiles_by_email_and_status(): void
    {
        ['product' => $product, 'merchant' => $merchant] = $this->seedReferenceData();

        $this->actingAs($this->createVerifiedUser());

        $expected = $this->createPayerProfile($product, $merchant, [
            'full_name' => 'Expected Payer',
            'email' => 'expected@example.com',
            'status' => 1,
        ]);
        $this->createPayerProfile($product, $merchant, [
            'full_name' => 'Other Payer',
            'email' => 'other@example.com',
            'status' => 2,
        ]);

        $response = $this->get(route('payer-profiles.index', [
            'email' => 'expected',
            'status' => '1',
        ]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('payer-profiles/index')
            ->whereAll([
                'filters.email' => 'expected',
                'filters.status' => '1',
            ])
            ->has('payerProfiles.data', 1)
            ->where('payerProfiles.data', function (Collection $rows) use ($expected) {
                return $rows->pluck('id')->all() === [$expected->id]
                    && $rows->every(fn (array $row) => $row['status'] === 1);
            })
        );
    }

    public function test_show_displays_payer_profile_with_relationships(): void
    {
        ['product' => $product, 'merchant' => $merchant] = $this->seedReferenceData();

        $this->actingAs($this->createVerifiedUser());

        $payerProfile = $this->createPayerProfile($product, $merchant, [
            'full_name' => 'Detail Payer',
            'username' => 'detail.payer',
        ]);

        $response = $this->get(route('payer-profiles.show', $payerProfile));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('payer-profiles/show')
            ->where('payerProfile.id', $payerProfile->id)
            ->where('payerProfile.full_name', 'Detail Payer')
            ->where('payerProfile.product.id', $product->id)
            ->where('payerProfile.merchant.id', $merchant->id)
        );
    }

    private function seedReferenceData(): array
    {
        DB::table('user_statuses')->insert([
            'id' => 1,
            'description' => 'Active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('merchant_statuses')->insert([
            'id' => 1,
            'description' => 'Active',
            'code' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $product = Product::query()->create([
            'en_name' => 'Payer Product',
            'ar_name' => 'Arabic Payer Product',
            'signing_active' => true,
            'secret_key' => Str::random(32),
            'invoice_creation_api' => 'https://example.com/invoices',
        ]);

        $merchant = Merchant::query()->create([
            'en_name' => 'Payer Merchant',
            'ar_name' => 'Arabic Payer Merchant',
            'commercial_registry_name' => 'Payer Merchant Registry',
            'product_id' => $product->id,
            'referral_id' => 100001,
            'status_id' => 1,
            'is_live' => true,
        ]);

        return [
            'product' => $product,
            'merchant' => $merchant,
        ];
    }

    private function createVerifiedUser(): User
    {
        $user = User::query()->create([
            'name' => 'Payer Profile Test User',
            'email' => 'payer-profile-' . Str::lower(Str::random(10)) . '@example.com',
            'password' => Hash::make('password'),
            'mobile_number' => '079' . random_int(1000000, 9999999),
            'status_id' => 1,
        ]);

        $user->forceFill([
            'email_verified_at' => now(),
        ])->save();

        return $user;
    }

    private function createPayerProfile(Product $product, Merchant $merchant, array $attributes = []): PayerProfile
    {
        return PayerProfile::query()->create(array_merge([
            'full_name' => 'Test Payer',
            'username' => 'payer' . Str::lower(Str::random(6)),
            'referral_id' => random_int(1000, 999999),
            'email' => Str::lower(Str::random(8)) . '@example.com',
            'mobile_number' => '078' . random_int(1000000, 9999999),
            'product_id' => $product->id,
            'merchant_id' => $merchant->id,
            'status' => 1,
            'total_points' => 125,
            'identity_no' => 'ID' . random_int(100000, 999999),
            'identity_type_id' => 1,
        ], $attributes));
    }
}
