<?php

namespace App\Repositories;

use App\Models\PspPaymentMethod;
use App\Models\PspStatus;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class PspPaymentMethodRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(PspPaymentMethod $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all records with optional pagination.
     */
    public function paginate(int $perPage = 15, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->getModel()->newQuery()
            ->applyFilters($filters)
            ->paginate($perPage);
    }

    public function getSupportedPaymentMethods(array $conditions, array $ids = []): Collection
    {
        return $this->getModel()->newQuery()
            ->join("psps", "psps.id", "=", "psp_payment_methods.psp_id")
            ->where(function ($query) use ($conditions) {
                return $query->where($conditions)
                    ->orWhere(function ($query) use ($conditions) {
                        return $query->where([
                            "psp_payment_methods.support_international_payment" => true,
                            "psp_payment_methods.is_active" => true,
                            "psps.psp_status_id" => PspStatus::ACTIVE
                        ]);
                    });
            })
            ->when(!empty($ids), function ($query) use ($ids) {
                return $query->whereIn('psp_payment_methods.id', $ids);
            })
            ->whereNull(['psp_payment_methods.merchant_id', 'psp_payment_methods.invoice_type_id'])
            ->select([
                "psp_payment_methods.*",
                "psps.name"
            ])->get()->load(['paymentMethod']);
    }

    public function updateOrCreate(array $attributes, array $values): Model
    {
        return $this->getModel()->newQuery()->updateOrCreate($attributes, $values);
    }
}
