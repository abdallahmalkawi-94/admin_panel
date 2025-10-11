<?php

namespace App\Providers;

use App\Listeners\UpdateUserStatusOnEmailVerified;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Update user status to ACTIVE when email is verified
        Event::listen(
            Verified::class,
            UpdateUserStatusOnEmailVerified::class,
        );
    }
}
