<?php

namespace App\Services;

use App\Repositories\MerchantInvoiceRepository;
use App\Repositories\MerchantRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MerchantService
{
    protected MerchantRepository $merchantRepository;
    protected MerchantInvoiceRepository $merchantInvoiceRepository;

    public function __construct(MerchantRepository $merchantRepository, MerchantInvoiceRepository $merchantInvoiceRepository)
    {
        $this->merchantRepository = $merchantRepository;
        $this->merchantInvoiceRepository = $merchantInvoiceRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->merchantRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->merchantRepository->findById($id);
    }

    /**
     * Get parent merchants by product ID
     */
    public function getParentMerchantsByProduct(int $productId): Collection
    {
        return $this->merchantRepository->getParentMerchantsByProduct($productId);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        try {
            DB::beginTransaction();

            $merchant = $this->merchantRepository->findById($id);

            if (!$merchant) {
                throw new Exception('Merchant not found');
            }

            // Handle logo upload if present
            if (isset($data['logo']) && $data['logo']) {
                // Delete old logo
                if ($merchant->logo_url) {
                    Storage::disk('public')->delete($merchant->logo_url);
                }
                $data['logo_url'] = $data['logo']->store('merchants/logos', 'public');
                unset($data['logo']);
            }

            // Handle attachment upload if present
            if (isset($data['attachment']) && $data['attachment']) {
                // Delete old attachment if it exists
                if ($merchant->settings && $merchant->settings->attachment) {
                    Storage::disk('public')->delete($merchant->settings->attachment);
                }
                $data['attachment'] = $data['attachment']->store('merchants/attachments', 'public');
            }

            // Separate merchant settings from merchant data
            $settingsData = $this->extractSettingsData($data);

            // Update merchant
            $merchant = $this->merchantRepository->update($data, $id);

            // Update or create merchant settings
            if (!empty($settingsData)) {
                if ($merchant->settings) {
                    $merchant->settings()->update($settingsData);
                } else {
                    $settingsData['merchant_id'] = $merchant->id;
                    $merchant->settings()->create($settingsData);
                }
            }

            // Sync invoice types if provided
            if (isset($data['invoice_type_ids']) && is_array($data['invoice_type_ids'])) {
                $this->syncInvoiceTypes($merchant, $data['invoice_type_ids']);
            }

            DB::commit();
            $this->bumpIndexCacheVersion();
            return $merchant->load(['settings', 'status', 'product', 'invoiceTypes']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete($id, $force = false): bool
    {
        $merchant = $this->merchantRepository->findById($id);

        if ($merchant) {
            // Soft delete all invoice types relationships
            $this->merchantInvoiceRepository->DeleteBulk([], $merchant->id);
            DB::table('merchant_invoices')
                ->where('merchant_id', $id)
                ->whereNull('deleted_at')
                ->update([
                    'deleted_at' => now(),
                    'updated_at' => now(),
                ]);

            if ($merchant->logo_url) {
                Storage::disk('public')->delete($merchant->logo_url);
            }
        }

        $deleted = $this->merchantRepository->delete($id, $force);
        $this->bumpIndexCacheVersion();
        return $deleted;
    }

    /**
     * Extract settings data from the main data array
     */
    private function extractSettingsData(array $data): array
    {
        $hasCustomUrls = isset($data['settings']['has_custom_urls']) && $data['settings']['has_custom_urls'];
        $isEnableSmsNotification = isset($data['settings']['is_enable_sms_notification']) && $data['settings']['is_enable_sms_notification'];
        return [
            'has_custom_urls' => $hasCustomUrls,
            'payout_model' => $data['settings']['payout_model'],
            'bank_id' => $data['settings']['bank_id'],
            'iban' => $data['settings']['iban'],
            'bank_account_no' => $data['settings']['bank_account_no'],
            'supported_order_type' => $data['settings']['supported_order_type'],
            'urls_settings' => $hasCustomUrls ? $data['settings']['urls_settings'] : null,
            'terms_and_condition_id' => $data['settings']['terms_and_condition_id'],
            'is_enable_sms_notification' => $isEnableSmsNotification,
            'monthly_sms' => $isEnableSmsNotification ? $data['settings']['monthly_sms'] : 0,
            'monthly_sms_counter' => $isEnableSmsNotification ? $data['settings']['monthly_sms_counter'] : 0,
            'daily_sms' => $isEnableSmsNotification ? $data['settings']['daily_sms'] : 0,
            'daily_sms_counter' => $isEnableSmsNotification ? $data['settings']['daily_sms_counter'] : 0,
            'is_enable_email_notification' => $data['settings']['is_enable_email_notification'],
            'is_enable_auto_redirect' => $data['settings']['is_enable_auto_redirect'],
            'country_code' => $data['settings']['country_code'],
            'currency_code' => $data['settings']['currency_code'],
        ];
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        try {
            DB::beginTransaction();

            // Handle logo upload if present
            if (isset($data['logo']) && $data['logo']) {
                $data['logo_url'] = $data['logo']->store('merchants/logos', 'public');
                unset($data['logo']);
            }

            // Handle attachment upload if present
            if (isset($data['attachment']) && $data['attachment']) {
                $data['attachment'] = $data['attachment']->store('merchants/attachments', 'public');
            }


            $merchantData = [
                "en_name" => $data['en_name'],
                "ar_name" => $data['ar_name'],
                "commercial_registry_name" => $data['commercial_registry_name'],
                "product_id" => $data['product_id'],
                "referral_id" => $data['referral_id'],
                "parent_merchant_id" => $data['parent_merchant_id'],
                "status_id" => $data['status_id'],
                "is_live" => $data['is_live'],
                "logo_url" => $data['logo'],
                "attachment" => $data['attachment'],
            ];

            // Separate merchant settings from merchant data
            $settingsData = $this->extractSettingsData($data);

            // Create merchant
            $merchant = $this->merchantRepository->create($merchantData);

            // Create merchant settings
            $settingsData['merchant_id'] = $merchant->id;
            $merchant->settings()->create($settingsData);

            // Sync invoice types if provided
            $this->syncInvoiceTypes($merchant, $data['invoice_type_ids']);

            DB::commit();
            $this->bumpIndexCacheVersion();
            return $merchant->load(['settings', 'status', 'product', 'invoiceTypes']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Sync invoice types with soft delete support
     */
    private function syncMerchantInvoices(array $merchantInvoices, array $invoiceTypeIds,  int|array $merchantIds): void
    {
        $this->merchantInvoiceRepository->Upsert($merchantInvoices);
        $this->merchantInvoiceRepository->DeleteBulk($invoiceTypeIds, $merchantIds);
    }


    private function syncInvoiceTypes($merchant, array $invoiceTypeIds): void
    {
        DB::transaction(function () use ($merchant, $invoiceTypeIds) {
            $merchantInvoices = [];
            $allMerchants = [];

            if (!isset($merchant->parent_merchant_id)) {
                // Parent merchant → sync to itself + children
                $merchant->load(['childMerchants']);
                $allMerchants = $merchant->childMerchants->pluck('id')->toArray();
                $allMerchants[] = $merchant->id; // include parent

                foreach ($allMerchants as $merchantId) {
                    foreach ($invoiceTypeIds as $invoiceTypeId) {
                        $merchantInvoices[] = [
                            'merchant_id' => $merchantId,
                            'invoice_type_id' => $invoiceTypeId,
                            'deleted_at' => null,
                        ];
                    }
                }
            } else {
                // Child merchant → copy from parent
                $parentId = $merchant->parent_merchant_id;
                $invoiceTypeIds = $this->merchantInvoiceRepository->GetByMerchantId($parentId)->pluck('invoice_type_id')->toArray();

                foreach ($invoiceTypeIds as $invoiceTypeId) {
                    $merchantInvoices[] = [
                        'merchant_id' => $merchant->id,
                        'invoice_type_id' => $invoiceTypeId,
                        'deleted_at' => null,
                    ];
                }

                $allMerchants[] = $merchant->id;
            }
            $this->syncMerchantInvoices($merchantInvoices, $invoiceTypeIds, $allMerchants);
        });
    }

    private function bumpIndexCacheVersion(): void
    {
        $currentVersion = Cache::get('merchants.index.version', 1);
        Cache::put('merchants.index.version', $currentVersion + 1);
    }
}
