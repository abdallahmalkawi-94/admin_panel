<?php

namespace App\Services;

use App\Repositories\MerchantInvoiceRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class MerchantInvoiceService
{
    protected MerchantInvoiceRepository $merchantInvoiceRepository;

    public function __construct(MerchantInvoiceRepository $merchantInvoiceRepository)
    {
        $this->merchantInvoiceRepository = $merchantInvoiceRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->merchantInvoiceRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->merchantInvoiceRepository->findById($id);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        return $this->merchantInvoiceRepository->create($data);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        return $this->merchantInvoiceRepository->update($data, $id);
    }

    public function delete($id, $force = false): bool
    {
        return $this->merchantInvoiceRepository->delete($id, $force);
    }
}