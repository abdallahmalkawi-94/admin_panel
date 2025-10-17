<?php

namespace App\Services;

use App\Repositories\CountryRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

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
     * Get all countries (cached)
     */
    public function getAllCountries(): Collection
    {
        return $this->countryRepository->getAllCountries();
    }

    /**
     * Get countries list for dropdowns (cached)
     */
    public function getCountriesForDropdown(): array
    {
        return $this->countryRepository->getCountriesForDropdown();
    }

    /**
     * Get distinct regions from countries (cached)
     */
    public function getDistinctRegions(): array
    {
        return $this->countryRepository->getDistinctRegions();
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        $country = $this->countryRepository->create($data);
        
        // Clear cache after creating a country
        $this->countryRepository->clearCache();
        
        return $country;
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        $country = $this->countryRepository->findById($id);
        $oldIso2 = $country?->iso2;
        
        $updatedCountry = $this->countryRepository->update($data, $id);
        
        // Clear cache after updating a country
        if ($oldIso2) {
            $this->countryRepository->clearCountryCache($oldIso2);
        }
        if ($updatedCountry && $updatedCountry->iso2 !== $oldIso2) {
            $this->countryRepository->clearCountryCache($updatedCountry->iso2);
        }
        
        return $updatedCountry;
    }

    public function delete($id, $force = false): bool
    {
        $country = $this->countryRepository->findById($id);
        $iso2 = $country?->iso2;
        
        $result = $this->countryRepository->delete($id, $force);
        
        // Clear cache after deleting a country
        if ($iso2) {
            $this->countryRepository->clearCountryCache($iso2);
        }
        
        return $result;
    }

    /**
     * Clear all country caches
     */
    public function clearCache(): void
    {
        $this->countryRepository->clearCache();
    }
}

