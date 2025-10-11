<?php

namespace App\Repositories;

use App\Http\Constants\UserStatusConstants;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class UserRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(User $user) {
        parent::__construct($user);
    }

    /**
     * Get all users with pagination and eager load relationships.
     */
    public function paginate(int $perPage = 15, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->getModel()->newQuery()
            ->with(['status', 'country'])
            ->applyFilters($filters)
            ->paginate($perPage);
    }


    /**
     * Get all user statuses
     */
    public function getAllStatuses(): array
    {
        return \App\Models\UserStatus::all(['id', 'description'])
            ->map(function ($status) {
                return [
                    'id' => $status->id,
                    'description' => $status->description,
                ];
            })
            ->toArray();
    }

    /**
     * Get distinct countries from users
     */
    public function getDistinctCountries(): array
    {
        return DB::table('countries')
            ->select(['iso2', 'name'])
            ->distinct()
            ->get()
            ->map(function ($country) {
                return [
                    'code' => $country->iso2,
                    'name' => $country->name,
                ];
            })
            ->toArray();
    }
}
