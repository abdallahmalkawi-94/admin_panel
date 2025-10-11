<?php

namespace App\Listeners;

use App\Http\Constants\UserStatusConstants;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateUserStatusOnEmailVerified implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Verified $event): void
    {
        /** @var User $user */
        $user = $event->user;

        // Only update status if user is currently in PENDING_VERIFICATION status
        if ($user->status_id === UserStatusConstants::PENDING_VERIFICATION) {
            $user->update([
                'status_id' => UserStatusConstants::ACTIVE,
            ]);
        }
    }
}
