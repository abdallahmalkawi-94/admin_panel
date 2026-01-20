<?php

namespace App\Providers;

use App\Listeners\UpdateUserStatusOnEmailVerified;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\DB;
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

        // TODO should be log to database or logging service
        if (env('DB_SLOW_QUERY_LOG', false)) {
            $thresholdMs = (int) env('DB_SLOW_QUERY_MS', 100);

            DB::listen(function ($query) use ($thresholdMs) {
                if ($query->time >= $thresholdMs) {
                    logger()->warning('Slow query', [
                        'sql' => $query->sql,
                        'bindings' => $query->bindings,
                        'time_ms' => $query->time,
                    ]);
                }
            });
        }
    }
}
