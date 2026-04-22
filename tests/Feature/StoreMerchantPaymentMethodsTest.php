<?php

namespace Tests\Feature;

use App\Constants\subscription_model;
use App\Models\InvoiceType;
use App\Models\Merchant;
use App\Models\MerchantSetting;
use App\Models\MerchantStatus;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Psp;
use App\Models\PspPaymentMethod;
use App\Models\PspStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class StoreMerchantPaymentMethodsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_merchant_payment_method_rows_for_selected_invoice_types(): void
    {
        $this->actingAs($this->createVerifiedUser());

        [$merchant, $invoiceTypes] = $this->createMerchantWithInvoiceTypes(2);
        $sourcePaymentMethod = $this->createSourcePaymentMethod();

        $response = $this->post(
            route('merchants.payment_methods.store', $merchant),
            $this->buildPayload(
                $sourcePaymentMethod,
                $invoiceTypes->pluck('id')->all(),
                [
                    'subscription_model' => subscription_model::LICENCE,
                    'min_allowed_amount' => 120,
                    'max_allowed_amount' => 900,
                    'is_active' => false,
                    'post_fees_to_psp' => true,
                    'config' => ['api_key' => 'merchant-key'],
                    'test_config' => ['api_key' => 'merchant-test-key'],
                ],
            ),
        );

        $response->assertRedirect(route('merchants.show', $merchant));
        $response->assertSessionHas('success');

        $storedRows = PspPaymentMethod::query()
            ->where('merchant_id', $merchant->id)
            ->whereIn('invoice_type_id', $invoiceTypes->pluck('id'))
            ->orderBy('invoice_type_id')
            ->get();

        $this->assertCount(2, $storedRows);

        foreach ($storedRows as $storedRow) {
            $this->assertSame($sourcePaymentMethod->psp_id, $storedRow->psp_id);
            $this->assertSame($sourcePaymentMethod->payment_method_id, $storedRow->payment_method_id);
            $this->assertSame($sourcePaymentMethod->refund_option_id, $storedRow->refund_option_id);
            $this->assertSame($sourcePaymentMethod->payout_model_id, $storedRow->payout_model_id);
            $this->assertSame($sourcePaymentMethod->support_tokenization, $storedRow->support_tokenization);
            $this->assertSame(subscription_model::LICENCE, $storedRow->subscription_model);
            $this->assertFalse($storedRow->is_active);
            $this->assertSame($sourcePaymentMethod->shown_in_checkout, $storedRow->shown_in_checkout);
            $this->assertSame($sourcePaymentMethod->support_international_payment, $storedRow->support_international_payment);
            $this->assertTrue($storedRow->post_fees_to_psp);
            $this->assertSame($sourcePaymentMethod->fees_type, $storedRow->fees_type);
            $this->assertSame($sourcePaymentMethod->priority, $storedRow->priority);
            $this->assertSame(120, $storedRow->min_allowed_amount);
            $this->assertSame(900, $storedRow->max_allowed_amount);
            $this->assertSame(
                ['api_key' => 'merchant-key', 'shared' => 'base-shared'],
                $storedRow->config,
            );
            $this->assertSame(
                ['api_key' => 'merchant-test-key', 'shared' => 'test-shared'],
                $storedRow->test_config,
            );
        }
    }

    public function test_it_propagates_selected_payment_methods_to_child_merchants(): void
    {
        $this->actingAs($this->createVerifiedUser());

        [$merchant, $invoiceTypes] = $this->createMerchantWithInvoiceTypes(1);
        $childMerchant = $this->createMerchant(parentMerchantId: $merchant->id);
        $sourcePaymentMethod = $this->createSourcePaymentMethod();

        $response = $this->post(
            route('merchants.payment_methods.store', $merchant),
            $this->buildPayload(
                $sourcePaymentMethod,
                $invoiceTypes->pluck('id')->all(),
                [
                    'subscription_model' => subscription_model::REVENUE_SHARING,
                    'min_allowed_amount' => 50,
                    'max_allowed_amount' => 500,
                    'is_active' => true,
                    'post_fees_to_psp' => false,
                ],
                [$childMerchant->id],
            ),
        );

        $response->assertRedirect(route('merchants.show', $merchant));

        $rows = PspPaymentMethod::query()
            ->whereIn('merchant_id', [$merchant->id, $childMerchant->id])
            ->where('invoice_type_id', $invoiceTypes->first()->id)
            ->orderBy('merchant_id')
            ->get();

        $this->assertCount(2, $rows);
        $this->assertSame([$merchant->id, $childMerchant->id], $rows->pluck('merchant_id')->all());
    }

    public function test_it_updates_existing_rows_instead_of_creating_duplicates_on_resubmit(): void
    {
        $this->actingAs($this->createVerifiedUser());

        [$merchant, $invoiceTypes] = $this->createMerchantWithInvoiceTypes(1);
        $sourcePaymentMethod = $this->createSourcePaymentMethod();
        $invoiceTypeId = $invoiceTypes->first()->id;

        $this->post(
            route('merchants.payment_methods.store', $merchant),
            $this->buildPayload(
                $sourcePaymentMethod,
                [$invoiceTypeId],
                [
                    'subscription_model' => subscription_model::REVENUE_SHARING,
                    'min_allowed_amount' => 10,
                    'max_allowed_amount' => 100,
                    'is_active' => true,
                    'post_fees_to_psp' => false,
                ],
            ),
        )->assertRedirect(route('merchants.show', $merchant));

        $this->post(
            route('merchants.payment_methods.store', $merchant),
            $this->buildPayload(
                $sourcePaymentMethod,
                [$invoiceTypeId],
                [
                    'subscription_model' => subscription_model::LICENCE,
                    'min_allowed_amount' => 20,
                    'max_allowed_amount' => 200,
                    'is_active' => false,
                    'post_fees_to_psp' => true,
                ],
            ),
        )->assertRedirect(route('merchants.show', $merchant));

        $storedRows = PspPaymentMethod::query()
            ->where('merchant_id', $merchant->id)
            ->where('invoice_type_id', $invoiceTypeId)
            ->get();

        $this->assertCount(1, $storedRows);

        $storedRow = $storedRows->sole();
        $this->assertSame(subscription_model::LICENCE, $storedRow->subscription_model);
        $this->assertSame(20, $storedRow->min_allowed_amount);
        $this->assertSame(200, $storedRow->max_allowed_amount);
        $this->assertFalse($storedRow->is_active);
        $this->assertTrue($storedRow->post_fees_to_psp);
    }

    public function test_it_rejects_unsupported_payment_methods(): void
    {
        $this->actingAs($this->createVerifiedUser());

        [$merchant, $invoiceTypes] = $this->createMerchantWithInvoiceTypes(1);
        $unsupportedPaymentMethod = $this->createSourcePaymentMethod(pspStatusId: PspStatus::INACTIVE);

        $response = $this->from(route('merchants.show', $merchant))->post(
            route('merchants.payment_methods.store', $merchant),
            $this->buildPayload(
                $unsupportedPaymentMethod,
                $invoiceTypes->pluck('id')->all(),
                [
                    'subscription_model' => subscription_model::LICENCE,
                    'min_allowed_amount' => 40,
                    'max_allowed_amount' => 400,
                    'is_active' => true,
                    'post_fees_to_psp' => false,
                ],
            ),
        );

        $response->assertSessionHasErrors('psp_payment_method_ids');

        $this->assertDatabaseMissing('psp_payment_methods', [
            'merchant_id' => $merchant->id,
            'invoice_type_id' => $invoiceTypes->first()->id,
            'payment_method_id' => $unsupportedPaymentMethod->payment_method_id,
        ]);
    }

    public function test_it_rejects_mismatched_payment_method_payload_ids(): void
    {
        $this->actingAs($this->createVerifiedUser());

        [$merchant, $invoiceTypes] = $this->createMerchantWithInvoiceTypes(1);
        $selectedPaymentMethod = $this->createSourcePaymentMethod();
        $otherPaymentMethod = $this->createSourcePaymentMethod();

        $payload = $this->buildPayload(
            $otherPaymentMethod,
            $invoiceTypes->pluck('id')->all(),
            [
                'subscription_model' => subscription_model::REVENUE_SHARING,
                'min_allowed_amount' => 25,
                'max_allowed_amount' => 250,
                'is_active' => true,
                'post_fees_to_psp' => false,
            ],
        );
        $payload['psp_payment_method_ids'] = [$selectedPaymentMethod->id];

        $response = $this->from(route('merchants.show', $merchant))->post(
            route('merchants.payment_methods.store', $merchant),
            $payload,
        );

        $response->assertSessionHasErrors('payment_methods');

        $this->assertDatabaseMissing('psp_payment_methods', [
            'merchant_id' => $merchant->id,
            'invoice_type_id' => $invoiceTypes->first()->id,
        ]);
    }

    public function test_it_rejects_mismatched_original_payment_method_ids(): void
    {
        $this->actingAs($this->createVerifiedUser());

        [$merchant, $invoiceTypes] = $this->createMerchantWithInvoiceTypes(1);
        $selectedPaymentMethod = $this->createSourcePaymentMethod();
        $otherPaymentMethod = $this->createSourcePaymentMethod();

        $payload = $this->buildPayload(
            $selectedPaymentMethod,
            $invoiceTypes->pluck('id')->all(),
            [
                'subscription_model' => subscription_model::REVENUE_SHARING,
                'min_allowed_amount' => 25,
                'max_allowed_amount' => 250,
                'is_active' => true,
                'post_fees_to_psp' => false,
            ],
        );
        $payload['payment_methods'][0]['original']['id'] = $otherPaymentMethod->id;

        $response = $this->from(route('merchants.show', $merchant))->post(
            route('merchants.payment_methods.store', $merchant),
            $payload,
        );

        $response->assertSessionHasErrors('payment_methods.0.original.id');

        $this->assertDatabaseMissing('psp_payment_methods', [
            'merchant_id' => $merchant->id,
            'invoice_type_id' => $invoiceTypes->first()->id,
        ]);
    }

    public function test_it_requires_edited_is_active_to_be_present(): void
    {
        $this->actingAs($this->createVerifiedUser());

        [$merchant, $invoiceTypes] = $this->createMerchantWithInvoiceTypes(1);
        $selectedPaymentMethod = $this->createSourcePaymentMethod();

        $payload = $this->buildPayload(
            $selectedPaymentMethod,
            $invoiceTypes->pluck('id')->all(),
            [
                'subscription_model' => subscription_model::REVENUE_SHARING,
                'min_allowed_amount' => 25,
                'max_allowed_amount' => 250,
                'is_active' => true,
                'post_fees_to_psp' => false,
            ],
        );
        unset($payload['payment_methods'][0]['edited']['is_active']);

        $response = $this->from(route('merchants.show', $merchant))->post(
            route('merchants.payment_methods.store', $merchant),
            $payload,
        );

        $response->assertSessionHasErrors('payment_methods.0.edited.is_active');

        $this->assertDatabaseMissing('psp_payment_methods', [
            'merchant_id' => $merchant->id,
            'invoice_type_id' => $invoiceTypes->first()->id,
        ]);
    }

    public function test_it_rejects_invalid_edited_post_fees_to_psp_values(): void
    {
        $this->actingAs($this->createVerifiedUser());

        [$merchant, $invoiceTypes] = $this->createMerchantWithInvoiceTypes(1);
        $selectedPaymentMethod = $this->createSourcePaymentMethod();

        $payload = $this->buildPayload(
            $selectedPaymentMethod,
            $invoiceTypes->pluck('id')->all(),
            [
                'subscription_model' => subscription_model::REVENUE_SHARING,
                'min_allowed_amount' => 25,
                'max_allowed_amount' => 250,
                'is_active' => true,
                'post_fees_to_psp' => false,
            ],
        );
        $payload['payment_methods'][0]['edited']['post_fees_to_psp'] = 'not-a-bool';

        $response = $this->from(route('merchants.show', $merchant))->post(
            route('merchants.payment_methods.store', $merchant),
            $payload,
        );

        $response->assertSessionHasErrors('payment_methods.0.edited.post_fees_to_psp');

        $this->assertDatabaseMissing('psp_payment_methods', [
            'merchant_id' => $merchant->id,
            'invoice_type_id' => $invoiceTypes->first()->id,
        ]);
    }

    private function buildPayload(
        PspPaymentMethod $sourcePaymentMethod,
        array $invoiceTypeIds,
        array $editedOverrides,
        array $childMerchantIds = [],
    ): array {
        return [
            'invoice_type_ids' => $invoiceTypeIds,
            'child_merchant_ids' => $childMerchantIds,
            'psp_payment_method_ids' => [$sourcePaymentMethod->id],
            'payment_methods' => [
                [
                    'source_psp_payment_method_id' => $sourcePaymentMethod->id,
                    'original' => $this->originalSnapshot($sourcePaymentMethod),
                    'edited' => array_replace(
                        [
                            'subscription_model' => $sourcePaymentMethod->subscription_model,
                            'min_allowed_amount' => $sourcePaymentMethod->min_allowed_amount,
                            'max_allowed_amount' => $sourcePaymentMethod->max_allowed_amount,
                            'is_active' => $sourcePaymentMethod->is_active,
                            'post_fees_to_psp' => $sourcePaymentMethod->post_fees_to_psp,
                            'config' => is_array($sourcePaymentMethod->config)
                                ? $sourcePaymentMethod->config
                                : [],
                            'test_config' => is_array($sourcePaymentMethod->test_config)
                                ? $sourcePaymentMethod->test_config
                                : [],
                        ],
                        $editedOverrides,
                    ),
                ],
            ],
        ];
    }

    private function originalSnapshot(PspPaymentMethod $sourcePaymentMethod): array
    {
        $sourcePaymentMethod->loadMissing(['paymentMethod', 'psp']);

        return [
            'id' => $sourcePaymentMethod->id,
            'psp_id' => $sourcePaymentMethod->psp_id,
            'payment_method_id' => $sourcePaymentMethod->payment_method_id,
            'payment_method' => [
                'id' => $sourcePaymentMethod->paymentMethod->id,
                'description' => $sourcePaymentMethod->paymentMethod->description,
                'code' => $sourcePaymentMethod->paymentMethod->code,
                'logo_url' => $sourcePaymentMethod->paymentMethod->logo_url,
            ],
            'merchant_id' => $sourcePaymentMethod->merchant_id,
            'invoice_type_id' => $sourcePaymentMethod->invoice_type_id,
            'refund_option_id' => $sourcePaymentMethod->refund_option_id,
            'payout_model_id' => $sourcePaymentMethod->payout_model_id,
            'support_tokenization' => $sourcePaymentMethod->support_tokenization,
            'subscription_model' => $sourcePaymentMethod->subscription_model,
            'is_active' => $sourcePaymentMethod->is_active,
            'shown_in_checkout' => $sourcePaymentMethod->shown_in_checkout,
            'support_international_payment' => $sourcePaymentMethod->support_international_payment,
            'post_fees_to_psp' => $sourcePaymentMethod->post_fees_to_psp,
            'fees_type' => $sourcePaymentMethod->fees_type,
            'priority' => $sourcePaymentMethod->priority,
            'max_allowed_amount' => $sourcePaymentMethod->max_allowed_amount,
            'min_allowed_amount' => $sourcePaymentMethod->min_allowed_amount,
            'config' => $sourcePaymentMethod->config,
            'test_config' => $sourcePaymentMethod->test_config,
            'name' => $sourcePaymentMethod->psp->name,
        ];
    }

    private function createVerifiedUser(): User
    {
        $countryCode = DB::table('countries')->value('iso2');

        $this->assertNotNull($countryCode, 'The countries table must contain at least one row for this test.');

        DB::table('user_statuses')->updateOrInsert(
            ['id' => 1],
            [
                'description' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );

        $user = User::query()->create([
            'name' => 'Test User',
            'email' => 'merchant-payment-' . Str::lower(Str::random(10)) . '@example.com',
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

    private function createMerchantWithInvoiceTypes(int $invoiceTypeCount): array
    {
        $merchant = $this->createMerchant();
        $invoiceTypes = collect(range(1, $invoiceTypeCount))
            ->map(fn (int $index) => InvoiceType::query()->create([
                'code' => 'INV-' . Str::upper(Str::random(6)) . '-' . $index,
                'description' => 'Invoice Type ' . $index,
            ]));

        $merchant->invoiceTypes()->attach($invoiceTypes->pluck('id')->all());

        return [$merchant, $invoiceTypes];
    }

    private function createMerchant(?int $parentMerchantId = null): Merchant
    {
        $countryCode = DB::table('countries')->value('iso2');
        $currencyCode = DB::table('currencies')->value('code');

        $this->assertNotNull($countryCode, 'The countries table must contain at least one row for this test.');
        $this->assertNotNull($currencyCode, 'The currencies table must contain at least one row for this test.');

        DB::table('merchant_statuses')->updateOrInsert(
            ['id' => MerchantStatus::ACTIVE],
            [
                'description' => 'Active',
                'code' => MerchantStatus::ACTIVE,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );

        $product = Product::query()->create([
            'en_name' => 'Product ' . Str::upper(Str::random(6)),
            'ar_name' => 'Arabic Product',
            'signing_active' => false,
            'secret_key' => Str::random(32),
            'invoice_creation_api' => 'https://example.com/invoice/create/' . Str::lower(Str::random(6)),
        ]);

        $merchant = Merchant::query()->create([
            'en_name' => 'Merchant ' . Str::upper(Str::random(6)),
            'ar_name' => 'Arabic Merchant',
            'commercial_registry_name' => 'Registry ' . Str::upper(Str::random(4)),
            'product_id' => $product->id,
            'referral_id' => random_int(1000, 999999),
            'parent_merchant_id' => $parentMerchantId,
            'status_id' => MerchantStatus::ACTIVE,
            'is_live' => true,
        ]);

        $termsAndConditionId = DB::table('terms_and_conditions')->insertGetId([
            'version' => random_int(1, 9999),
            'description' => 'Terms ' . Str::upper(Str::random(5)),
            'country_code' => $countryCode,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        MerchantSetting::query()->create([
            'merchant_id' => $merchant->id,
            'payout_model' => 1,
            'supported_order_type' => 1,
            'has_custom_urls' => false,
            'terms_and_condition_id' => $termsAndConditionId,
            'is_enable_sms_notification' => false,
            'monthly_sms' => 0,
            'monthly_sms_counter' => 0,
            'daily_sms' => 0,
            'daily_sms_counter' => 0,
            'is_enable_email_notification' => false,
            'is_enable_auto_redirect' => false,
            'country_code' => $countryCode,
            'currency_code' => $currencyCode,
        ]);

        return $merchant;
    }

    private function createSourcePaymentMethod(int $pspStatusId = PspStatus::ACTIVE): PspPaymentMethod
    {
        $countryCode = DB::table('countries')->value('iso2');
        $currencyCode = DB::table('currencies')->value('code');

        $this->assertNotNull($countryCode, 'The countries table must contain at least one row for this test.');
        $this->assertNotNull($currencyCode, 'The currencies table must contain at least one row for this test.');

        DB::table('psp_statuses')->updateOrInsert(
            ['id' => PspStatus::ACTIVE],
            [
                'code' => 'active',
                'description' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );
        DB::table('psp_statuses')->updateOrInsert(
            ['id' => PspStatus::INACTIVE],
            [
                'code' => 'inactive',
                'description' => 'Inactive',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );
        DB::table('refund_options')->updateOrInsert(
            ['id' => 1],
            [
                'code' => 1,
                'description' => 'No Refund',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );
        DB::table('payout_models')->updateOrInsert(
            ['id' => 1],
            [
                'code' => 'manual',
                'description' => 'Manual',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );

        $psp = Psp::query()->create([
            'name' => 'PSP ' . Str::upper(Str::random(6)),
            'code' => 'PSP-' . Str::upper(Str::random(8)),
            'country_code' => $countryCode,
            'settlement_currency_code' => $currencyCode,
            'monthly_fees' => 0,
            'psp_status_id' => $pspStatusId,
        ]);

        $paymentMethod = PaymentMethod::query()->create([
            'description' => 'Payment Method ' . Str::upper(Str::random(6)),
            'code' => 'PM-' . Str::upper(Str::random(8)),
            'info' => 'Test payment method',
            'is_one_time_payment' => true,
        ]);

        return PspPaymentMethod::query()->create([
            'psp_id' => $psp->id,
            'payment_method_id' => $paymentMethod->id,
            'refund_option_id' => 1,
            'payout_model_id' => 1,
            'support_tokenization' => true,
            'subscription_model' => subscription_model::REVENUE_SHARING,
            'is_active' => true,
            'shown_in_checkout' => true,
            'support_international_payment' => false,
            'post_fees_to_psp' => false,
            'fees_type' => 0,
            'priority' => 8,
            'max_allowed_amount' => 800,
            'min_allowed_amount' => 80,
            'config' => [
                'api_key' => 'source-key',
                'shared' => 'base-shared',
            ],
            'test_config' => [
                'api_key' => 'source-test-key',
                'shared' => 'test-shared',
            ],
        ]);
    }
}
