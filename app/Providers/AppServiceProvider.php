<?php

namespace App\Providers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Vite;
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
        Vite::prefetch(concurrency: 3);
        
        // Add custom validation rule for alpha_spaces
        Validator::extend('alpha_spaces', function ($attribute, $value, $parameters, $validator) {
            // Allow alphabetic characters, spaces, and some special characters commonly used in names
            return preg_match('/^[\pL\s\'\-\.]+$/u', $value);
        });
        
        // Add custom error message for alpha_spaces
        Validator::replacer('alpha_spaces', function ($message, $attribute, $rule, $parameters) {
            // Check if a custom message is provided in the validation
            if ($message !== "validation.alpha_spaces") {
                return $message;
            }
            // Default message in English
            return str_replace(':attribute', $attribute, 'The :attribute may only contain letters and spaces.');
        });
    }
}
