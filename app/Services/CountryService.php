<?php

namespace App\Services;

use App\Models\Country;
use App\Repositories\CountryRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class CountryService
{
    protected CountryRepository $countryRepository;

    public function __construct(CountryRepository $countryRepository)
    {
        $this->countryRepository = $countryRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->countryRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->countryRepository->findById($id);
    }

    public function findByIso2(string $iso2): ?Model
    {
        return $this->countryRepository->findByIso2($iso2);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        $country = $this->countryRepository->create($data);
        
        // Clear cache after creating a country
        Country::clearCache();
        $this->bumpIndexCacheVersion();
        
        return $country;
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        $updatedCountry = $this->countryRepository->update($data, $id);
        
        // Clear cache after updating a country
        Country::clearCache();
        $this->bumpIndexCacheVersion();
        
        return $updatedCountry;
    }

    public function delete($id, $force = false): bool
    {
        $result = $this->countryRepository->delete($id, $force);
        
        // Clear cache after deleting a country
        Country::clearCache();
        $this->bumpIndexCacheVersion();
        
        return $result;
    }

    private function bumpIndexCacheVersion(): void
    {
        $currentVersion = Cache::get('countries.index.version', 1);
        Cache::put('countries.index.version', $currentVersion + 1);
    }
}
