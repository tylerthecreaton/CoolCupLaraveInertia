<?php

use App\Http\Controllers\Admin\CategoriesController;
use App\Http\Controllers\Admin\ProductsController;
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
        // ---------------------------Users---------------------------
        Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('admin.users.create');
        Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
        Route::get('/users/{id}', [UserController::class, 'show'])->name('admin.user');
        Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
        Route::put('/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');

        // ---------------------------Categories---------------------------
        Route::get('/categories', [CategoriesController::class, 'index'])->name('admin.categories.index');
        Route::get('/categories/create', [CategoriesController::class, 'create'])->name('admin.categories.create');
        Route::post('/categories', [CategoriesController::class, 'store'])->name('admin.categories.store');
        Route::get('/categories/{id}', [CategoriesController::class, 'show'])->name('admin.categories.show');
        Route::get('/categories/{id}/edit', [CategoriesController::class, 'edit'])->name('admin.categories.edit');
        Route::put('/categories/{id}', [CategoriesController::class, 'update'])->name('admin.categories.update');
        Route::delete('/categories/{id}', [CategoriesController::class, 'destroy'])->name('admin.categories.destroy');

        // ---------------------------Products---------------------------
        Route::get('/products', [ProductsController::class, 'index'])->name('admin.products.index');
        Route::get('/products/create', [ProductsController::class, 'create'])->name('admin.products.create');
        Route::post('/products', [ProductsController::class, 'store'])->name('admin.products.store');
        Route::get('/products/{id}', [ProductsController::class, 'show'])->name('admin.products.show');
        Route::get('/products/{id}/edit', [ProductsController::class, 'edit'])->name('admin.products.edit');
        Route::put('/products/{id}', [ProductsController::class, 'update'])->name('admin.products.update');
        Route::delete('/products/{id}', [ProductsController::class, 'destroy'])->name('admin.products.destroy');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
