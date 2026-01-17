<?php

namespace App\Services;

use App\Repositories\MessageTypeRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class MessageTypeService
{
    protected MessageTypeRepository $messageTypeRepository;

    public function __construct(MessageTypeRepository $messageTypeRepository)
    {
        $this->messageTypeRepository = $messageTypeRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->messageTypeRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->messageTypeRepository->findById($id);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        return $this->messageTypeRepository->create($data);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        return $this->messageTypeRepository->update($data, $id);
    }

    public function delete($id, $force = false): bool
    {
        return $this->messageTypeRepository->delete($id, $force);
    }
}