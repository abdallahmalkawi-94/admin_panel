<?php

namespace App\Services;

use App\Repositories\InvoiceTypeRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class InvoiceTypeService
{
    protected InvoiceTypeRepository $invoiceTypeRepository;

    public function __construct(InvoiceTypeRepository $invoiceTypeRepository)
    {
        $this->invoiceTypeRepository = $invoiceTypeRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->invoiceTypeRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->invoiceTypeRepository->findById($id);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        return $this->invoiceTypeRepository->create($data);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        return $this->invoiceTypeRepository->update($data, $id);
    }

    public function delete($id, $force = false): bool
    {
        return $this->invoiceTypeRepository->delete($id, $force);
    }
}