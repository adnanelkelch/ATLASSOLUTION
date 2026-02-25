<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

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
        RateLimiter::for('auth-login', function (Request $request) {
            $email = (string) $request->input('email', '');
            $key = Str::lower($email).'|'.$request->ip();

            return [
                Limit::perMinute(5)->by($key),
                Limit::perMinute(30)->by($request->ip()),
            ];
        });

        RateLimiter::for('auth-register', function (Request $request) {
            return [
                Limit::perMinute(5)->by($request->ip()),
                Limit::perDay(50)->by($request->ip()),
            ];
        });

        RateLimiter::for('contact-submit', function (Request $request) {
            return [
                Limit::perMinute(3)->by($request->ip()),
                Limit::perDay(30)->by($request->ip()),
            ];
        });

        RateLimiter::for('order-create', function (Request $request) {
            $userId = (string) optional($request->user())->id;

            return [
                Limit::perMinute(6)->by($userId ?: $request->ip()),
                Limit::perHour(40)->by($userId ?: $request->ip()),
            ];
        });
    }
}
