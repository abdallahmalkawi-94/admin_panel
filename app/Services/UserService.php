<?php

namespace App\Services;

use App\Http\Constants\UserStatusConstants;
use App\Notifications\UserCreatedNotification;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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

        $this->bumpIndexCacheVersion();

        return $user;
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        $user = $this->userRepository->update($data, $id);
        $this->bumpIndexCacheVersion();
        return $user;
    }

    public function delete($id, $force = false): bool
    {
        $deleted = $this->userRepository->delete($id, $force);
        $this->bumpIndexCacheVersion();
        return $deleted;
    }

    private function bumpIndexCacheVersion(): void
    {
        $currentVersion = Cache::get('users.index.version', 1);
        Cache::put('users.index.version', $currentVersion + 1);
    }

}
