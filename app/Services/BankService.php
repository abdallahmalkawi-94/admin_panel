<?php

namespace App\Services;

use App\Repositories\BankRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class BankService
{
    protected BankRepository $bankRepository;

    public function __construct(BankRepository $bankRepository)
    {
        $this->bankRepository = $bankRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->bankRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->bankRepository->findById($id);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        // Handle logo upload if present
        if (isset($data['logo']) && $data['logo']) {
            $data['logo_url'] = $data['logo']->store('banks/logos', 'public');
            unset($data['logo']);
        }

        return $this->bankRepository->create($data);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        $bank = $this->bankRepository->findById($id);

        if (!$bank) {
            throw new Exception('Bank not found');
        }

        // Handle logo upload if present
        if (isset($data['logo']) && $data['logo']) {
            // Delete old logo
            if ($bank->logo_url) {
                Storage::disk('public')->delete($bank->logo_url);
            }
            $data['logo_url'] = $data['logo']->store('banks/logos', 'public');
            unset($data['logo']);
        }

        return $this->bankRepository->update($data, $id);
    }

    public function delete($id, $force = false): bool
    {
        $bank = $this->bankRepository->findById($id);
        
        if ($bank && $bank->logo_url) {
            Storage::disk('public')->delete($bank->logo_url);
        }

        return $this->bankRepository->delete($id, $force);
    }
}

