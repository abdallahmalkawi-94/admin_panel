<?php

namespace App\Services;

use App\Http\Constants\UserStatusConstants;
use App\Notifications\UserCreatedNotification;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserService
{
    protected UserRepository $userRepository;
    protected CountryService $countryService;

    public function __construct(UserRepository $userRepository, CountryService $countryService)
    {
        $this->userRepository = $userRepository;
        $this->countryService = $countryService;
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
        // Generate a random password
        $plainPassword = Str::password(12, true, true, false);
        $data["password"] = Hash::make($plainPassword);
        $data["status_id"] = UserStatusConstants::PENDING_VERIFICATION;

        $user = $this->userRepository->create($data);

        try {
            // Send notification with credentials
            $loginUrl = route('login');
            $user->notify(new UserCreatedNotification($plainPassword, $loginUrl));
            // Send email verification notification
            $user->sendEmailVerificationNotification();
        } catch (Exception $e) {
            logger($e->getMessage());
        }

        return $user;
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
     * Get distinct countries from users (now using cached country service)
     */
    public function getDistinctCountries(): array
    {
        return $this->countryService->getCountriesForDropdown();
    }
}
