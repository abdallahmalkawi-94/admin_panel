<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    protected ProductRepository $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->productRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->productRepository->findById($id);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        // TODO should be check if creation api not set, will be get from system setting
        $data["invoice_creation_api"] = "https://malkawi-portal,classera.com/invoice/create";
        // TODO Add webhook events
        return $this->productRepository->create($data);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        return $this->productRepository->update($data, $id);
    }

    public function delete($id, $force = false): bool
    {
        return $this->productRepository->delete($id, $force);
    }
}
