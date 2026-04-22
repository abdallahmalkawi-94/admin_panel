<?php

namespace Tests\Feature;

use App\Constants\fees_type;
use App\Constants\payout_models;
use App\Constants\refund_option;
use App\Constants\subscription_model;
use App\Models\InvoiceType;
use App\Models\Merchant;
use App\Models\MerchantStatus;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Psp;
use App\Models\PspPaymentMethod;
use App\Models\PspStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PspPaymentMethodIndexTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    public function test_it_filters_psp_payment_methods_by_invoice_type_id(): void
    {
        ['country_code' => $countryCode, 'currency_code' => $currencyCode, 'product' => $product] = $this->seedReferenceData();

        $this->actingAs($this->createVerifiedUser($countryCode));

        $merchantOne = $this->createMerchant($product, 'Merchant One');
        $merchantTwo = $this->createMerchant($product, 'Merchant Two');
        $invoiceTypeOne = $this->createInvoiceType('Retail');
        $invoiceTypeTwo = $this->createInvoiceType('Subscription');

        $psp = $this->createPsp($countryCode, $currencyCode);
        $paymentMethod = $this->createPaymentMethod();

        $firstMatch = $this->createPspPaymentMethod($psp, $paymentMethod, $merchantOne, $invoiceTypeOne, true);
        $this->createPspPaymentMethod($psp, $paymentMethod, $merchantOne, $invoiceTypeTwo, false);
        $secondMatch = $this->createPspPaymentMethod($psp, $paymentMethod, $merchantTwo, $invoiceTypeOne, true);

        $response = $this->get(route('psp-payment-methods.index', [
            'invoice_type_id' => (string) $invoiceTypeOne->id,
        ]));

        $response->assertOk();

        $response->assertInertia(fn (Assert $page) => $page
            ->component('psp-payment-methods/index')
            ->where('filters.invoice_type_id', (string) $invoiceTypeOne->id)
            ->has('pspPaymentMethods.data', 2)
            ->where('pspPaymentMethods.data', function (Collection $rows) use ($firstMatch, $secondMatch, $invoiceTypeOne) {
                return $rows->pluck('id')->sort()->values()->all() === collect([$firstMatch->id, $secondMatch->id])->sort()->values()->all()
                    && $rows->every(fn (array $row) => $row['invoice_type_id'] === $invoiceTypeOne->id);
            })
        );
    }

    public function test_it_combines_invoice_type_and_merchant_filters(): void
    {
        ['country_code' => $countryCode, 'currency_code' => $currencyCode, 'product' => $product] = $this->seedReferenceData();

        $this->actingAs($this->createVerifiedUser($countryCode));

        $merchantOne = $this->createMerchant($product, 'Merchant One');
        $merchantTwo = $this->createMerchant($product, 'Merchant Two');
        $invoiceType = $this->createInvoiceType('Retail');

        $psp = $this->createPsp($countryCode, $currencyCode);
        $paymentMethod = $this->createPaymentMethod();

        $expectedRow = $this->createPspPaymentMethod($psp, $paymentMethod, $merchantOne, $invoiceType, true);
        $this->createPspPaymentMethod($psp, $paymentMethod, $merchantTwo, $invoiceType, true);

        $response = $this->get(route('psp-payment-methods.index', [
            'merchant_id' => (string) $merchantOne->id,
            'invoice_type_id' => (string) $invoiceType->id,
        ]));

        $response->assertOk();

        $response->assertInertia(fn (Assert $page) => $page
            ->component('psp-payment-methods/index')
            ->whereAll([
                'filters.merchant_id' => (string) $merchantOne->id,
                'filters.invoice_type_id' => (string) $invoiceType->id,
            ])
            ->has('pspPaymentMethods.data', 1)
            ->where('pspPaymentMethods.data', function (Collection $rows) use ($expectedRow, $invoiceType, $merchantOne) {
                return $rows->pluck('id')->all() === [$expectedRow->id]
                    && $rows->every(fn (array $row) => $row['invoice_type_id'] === $invoiceType->id)
                    && $rows->every(fn (array $row) => $row['merchant_id'] === $merchantOne->id);
            })
        );
    }

    private function seedReferenceData(): array
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

        DB::table('merchant_statuses')->insert([
            'id' => MerchantStatus::ACTIVE,
            'description' => 'Active',
            'code' => MerchantStatus::ACTIVE,
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

        $product = Product::query()->create([
            'en_name' => 'Product ' . Str::upper(Str::random(6)),
            'ar_name' => 'Arabic Product',
            'signing_active' => false,
            'secret_key' => Str::random(32),
            'invoice_creation_api' => 'https://example.com/invoices/' . Str::lower(Str::random(6)),
        ]);

        return [
            'country_code' => 'JO',
            'currency_code' => 'JOD',
            'product' => $product,
        ];
    }

    private function createVerifiedUser(string $countryCode): User
    {
        $user = User::query()->create([
            'name' => 'Index Test User',
            'email' => 'psp-index-' . Str::lower(Str::random(10)) . '@example.com',
            'password' => Hash::make('password'),
            'country_code' => $countryCode,
            'mobile_number' => '079' . random_int(1000000, 9999999),
            'status_id' => 1,
        ]);

        $user->forceFill([
            'email_verified_at' => now(),
        ])->save();

        return $user;
    }

    private function createMerchant(Product $product, string $name): Merchant
    {
        return Merchant::query()->create([
            'en_name' => $name,
            'ar_name' => 'Arabic ' . $name,
            'commercial_registry_name' => 'Registry ' . Str::upper(Str::random(4)),
            'product_id' => $product->id,
            'referral_id' => random_int(1000, 999999),
            'status_id' => MerchantStatus::ACTIVE,
            'is_live' => true,
        ]);
    }

    private function createInvoiceType(string $description): InvoiceType
    {
        return InvoiceType::query()->create([
            'code' => 'INV-' . Str::upper(Str::random(6)),
            'description' => $description,
        ]);
    }

    private function createPsp(string $countryCode, string $currencyCode): Psp
    {
        return Psp::query()->create([
            'name' => 'PSP ' . Str::upper(Str::random(6)),
            'code' => 'PSP-' . Str::upper(Str::random(8)),
            'country_code' => $countryCode,
            'settlement_currency_code' => $currencyCode,
            'monthly_fees' => 0,
            'psp_status_id' => PspStatus::ACTIVE,
        ]);
    }

    private function createPaymentMethod(): PaymentMethod
    {
        return PaymentMethod::query()->create([
            'description' => 'Payment Method ' . Str::upper(Str::random(6)),
            'code' => 'PM-' . Str::upper(Str::random(8)),
            'info' => 'Test payment method',
            'is_one_time_payment' => true,
        ]);
    }

    private function createPspPaymentMethod(
        Psp $psp,
        PaymentMethod $paymentMethod,
        Merchant $merchant,
        InvoiceType $invoiceType,
        bool $isActive,
    ): PspPaymentMethod {
        return PspPaymentMethod::query()->create([
            'psp_id' => $psp->id,
            'payment_method_id' => $paymentMethod->id,
            'merchant_id' => $merchant->id,
            'invoice_type_id' => $invoiceType->id,
            'refund_option_id' => refund_option::NO_REFUND,
            'payout_model_id' => payout_models::WEEKLY,
            'support_tokenization' => true,
            'subscription_model' => subscription_model::REVENUE_SHARING,
            'is_active' => $isActive,
            'shown_in_checkout' => true,
            'support_international_payment' => false,
            'post_fees_to_psp' => false,
            'fees_type' => fees_type::ON_MERCHANT,
            'priority' => 10,
            'max_allowed_amount' => 1000,
            'min_allowed_amount' => 100,
            'config' => [
                'api_key' => 'live-key',
            ],
            'test_config' => [
                'api_key' => 'test-key',
            ],
        ]);
    }
}
