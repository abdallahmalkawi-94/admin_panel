<?php

namespace App\Services;

use App\Models\PspPaymentMethod;
use App\Repositories\FeesCollectionModelRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class FeesCollectionModelService
{
    protected FeesCollectionModelRepository $feesCollectionModelRepository;

    public function __construct(FeesCollectionModelRepository $feesCollectionModelRepository)
    {
        $this->feesCollectionModelRepository = $feesCollectionModelRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->feesCollectionModelRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->feesCollectionModelRepository->findById($id);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        return $this->feesCollectionModelRepository->create($data);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        return $this->feesCollectionModelRepository->update($data, $id);
    }

    public function delete($id, $force = false): bool
    {
        return $this->feesCollectionModelRepository->delete($id, $force);
    }

    public function getForPspPaymentMethod(PspPaymentMethod $pspPaymentMethod): \Illuminate\Support\Collection
    {
        return $pspPaymentMethod->feesCollectionModel()
            ->get()
            ->sort(function (Model $left, Model $right) {
                $leftFrom = (float) $left->getAttribute('from');
                $rightFrom = (float) $right->getAttribute('from');

                if ($leftFrom === $rightFrom) {
                    $leftTo = $left->getAttribute('to');
                    $rightTo = $right->getAttribute('to');

                    if ($leftTo === null && $rightTo === null) {
                        return 0;
                    }

                    if ($leftTo === null) {
                        return 1;
                    }

                    if ($rightTo === null) {
                        return -1;
                    }

                    return (float) $leftTo <=> (float) $rightTo;
                }

                return $leftFrom <=> $rightFrom;
            })
            ->values();
    }

    /**
     * @throws Exception
     */
    public function syncForPspPaymentMethod(PspPaymentMethod $pspPaymentMethod, array $slices, ?int $userId = null): \Illuminate\Support\Collection
    {
        // TODO Need enhancement
        DB::transaction(function () use ($pspPaymentMethod, $slices, $userId) {
            $existingSlices = $pspPaymentMethod->feesCollectionModel()->get()->keyBy('id');
            $retainedIds = [];

            foreach ($slices as $slice) {
                $attributes = [
                    'psp_payment_method_id' => $pspPaymentMethod->getAttribute('id'),
                    'merchant_id' => $pspPaymentMethod->getAttribute("merchant_id"),
                    'invoice_type_id' => $pspPaymentMethod->getAttribute("invoice_type_id"),
                    'from' => $slice['from'],
                    'to' => $slice['to'],
                    'foc_fixed' => $slice['foc_fixed'],
                    'fom_fixed' => $slice['fom_fixed'],
                    'foc_percentage' => $slice['foc_percentage'],
                    'fom_percentage' => $slice['fom_percentage'],
                    'foc_psp_cost_fixed' => $slice['foc_psp_cost_fixed'],
                    'fom_psp_cost_fixed' => $slice['fom_psp_cost_fixed'],
                    'fom_psp_cost_percentage' => $slice['fom_psp_cost_percentage'],
                    'foc_psp_cost_percentage' => $slice['foc_psp_cost_percentage'],
                    'installment_fom_fixed' => $slice['installment_fom_fixed'],
                    'installment_fom_percentage' => $slice['installment_fom_percentage'],
                    'installment_foc_fixed' => $slice['installment_foc_fixed'],
                    'installment_foc_percentage' => $slice['installment_foc_percentage'],
                    'is_default' => $slice['is_default'],
                    'updated_by' => $userId,
                ];

                $sliceId = $slice['id'] ?? null;

                if ($sliceId !== null) {
                    $feeSlice = $existingSlices->get($sliceId);

                    if ($feeSlice !== null) {
                        $feeSlice->fill($attributes);
                        $feeSlice->save();
                        $retainedIds[] = $feeSlice->id;
                    }

                    continue;
                }

                if ($userId !== null) {
                    $attributes['created_by'] = $userId;
                }

                $newSlice = $this->feesCollectionModelRepository->create($attributes);
                $retainedIds[] = $newSlice->id;
            }

            $deleteQuery = $pspPaymentMethod->feesCollectionModel();

            if ($retainedIds !== []) {
                $deleteQuery->whereNotIn('id', $retainedIds);
            }

            $deleteQuery->delete();
        });

        return $this->getForPspPaymentMethod($pspPaymentMethod->fresh());
    }
}
