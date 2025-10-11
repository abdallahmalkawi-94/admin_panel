<?php

namespace App\Services;

use App\Http\Constants\UserStatusConstants;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->userRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->userRepository->findById($id);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        return $this->userRepository->create($data);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        return $this->userRepository->update($data, $id);
    }

    public function delete($id, $force = false): bool
    {
        return $this->userRepository->delete($id, $force);
    }

    /**
     * Get all user statuses
     */
    public function getAllStatuses(): array
    {
        return $this->userRepository->getAllStatuses();
    }

    /**
     * Get distinct countries from users
     */
    public function getDistinctCountries(): array
    {
        return $this->userRepository->getDistinctCountries();
    }
}
