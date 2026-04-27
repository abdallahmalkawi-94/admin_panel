<?php

namespace App\Services;

use App\Repositories\PayerProfileRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class PayerProfileService
{
    protected PayerProfileRepository $payerProfileRepository;

    public function __construct(PayerProfileRepository $payerProfileRepository)
    {
        $this->payerProfileRepository = $payerProfileRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->payerProfileRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->payerProfileRepository->findById($id);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        return $this->payerProfileRepository->create($data);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        return $this->payerProfileRepository->update($data, $id);
    }

    public function delete($id, $force = false): bool
    {
        return $this->payerProfileRepository->delete($id, $force);
    }
}