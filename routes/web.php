<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::group(['prefix' => '/admin'], function () {
        Route::get('/users', [UserController::class, 'index'])->name('admin.users');
        Route::get('/users/{id}', [UserController::class, 'show'])->name('admin.user');
        // Route::get('/products', [UserController::class, 'products'])->name('admin.products');
        // Route::get('/products/{id}', [UserController::class, 'product'])->name('admin.product');
        // Route::get('/categories', [UserController::class, 'categories'])->name('admin.categories');
        // Route::get('/categories/{id}', [UserController::class, 'category'])->name('admin.category');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
