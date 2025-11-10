<?php

namespace App\Repositories;

use App\Models\Merchant;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class MerchantRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(Merchant $merchant) {
        parent::__construct($merchant);
    }

    /**
     * Get all merchants with pagination and eager load relationships.
     */
    public function paginate(int $perPage = 15, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->getModel()->newQuery()
            ->with(['status', 'product', 'parentMerchant', 'settings'])
            ->applyFilters($filters)
            ->paginate($perPage);
    }

    /**
     * Get all merchant statuses (cached)
     */
    public function getAllStatuses(): array
    {
        return \App\Models\MerchantStatus::dropdown();
    }

    /**
     * Get parent merchants by product ID
     */
    public function getParentMerchantsByProduct(int $productId): Collection
    {
        return $this->getModel()->newQuery()
            ->where('product_id', $productId)
            ->whereNull('parent_merchant_id')
            ->get(['id', 'en_name', 'ar_name']);
    }
}

