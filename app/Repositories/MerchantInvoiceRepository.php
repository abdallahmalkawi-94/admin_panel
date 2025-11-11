<?php

namespace App\Repositories;

use App\Models\MerchantInvoice;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class MerchantInvoiceRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(MerchantInvoice $model)
    {
        parent::__construct($model);
    }

    public function Upsert(array $merchantInvoice): void
    {
        $this->model->query()->upsert($merchantInvoice, ['merchant_id', 'invoice_type_id']);
    }

    public function DeleteBulk(array $ids, int|array $merchantId): void
    {
        if (empty($merchantId)) {
            return; // prevent accidental global delete
        }

        $query = $this->model->newQuery();

        if (is_array($merchantId)) {
            $query->whereIn('merchant_id', $merchantId);
        } else {
            $query->where('merchant_id', $merchantId);
        }

        // Only delete types NOT in the new list (skip if ids empty)
        if (!empty($ids)) {
            $query->whereNotIn('invoice_type_id', $ids);
        }

        $query->chunkById(1000, fn($chunk) => $this->model->newQuery()->whereIn('id', $chunk->pluck('id'))->delete());
    }

    public function GetByMerchantId(int $merchantId): Collection
    {
        return $this->model->newQuery()->where('merchant_id', $merchantId)->get(['id', 'invoice_type_id', 'merchant_id']);
    }
}
