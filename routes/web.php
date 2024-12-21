<?php

use App\Http\Controllers\Admin\CategoriesController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\ProductsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegisterMemberController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index']);

Route::get('/dashboard', function () {
    $customers = \App\Models\Customer::count();
    $products = \App\Models\Product::count();
    $popularProducts = \App\Models\Product::with('category')
        ->select('products.*')
        ->limit(5)
        ->get()
        ->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category->name,
                'total_sales' => rand(50, 100), // Mock sales data
                'image_url' => $product->image_url
            ];
        });

    return Inertia::render('Dashboard', [
        'stats' => [
            'customers' => $customers,
            'products' => $products,
            'orders' => 289, // Mock data
            'revenue' => 158900, // Mock data
            'popularProducts' => $popularProducts
        ]
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// ---------------------------RegisterMember---------------------------
Route::get('/registermember', [RegisterMemberController::class, 'index'])->name('registermember');


// ---------------------------Member---------------------------
Route::get('/member', [MemberController::class, 'index'])->name('member');

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

        // ---------------------------Customers---------------------------
        Route::get('/customers', [CustomerController::class, 'index'])->name('admin.customers.index');
        Route::get('/customers/create', [CustomerController::class, 'create'])->name('admin.customers.create');
        Route::post('/customers', [CustomerController::class, 'store'])->name('admin.customers.store');
        Route::get('/customers/{id}', [CustomerController::class, 'show'])->name('admin.customers.show');
        Route::get('/customers/{id}/edit', [CustomerController::class, 'edit'])->name('admin.customers.edit');
        Route::put('/customers/{id}', [CustomerController::class, 'update'])->name('admin.customers.update');
        Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])->name('admin.customers.destroy');

        // ---------------------------Orders---------------------------
        Route::get('/orders', [OrderController::class,'index'])->name('admin.orders.index');
        Route::get('/orders/create', [OrderController::class,'create'])->name('admin.orders.create');
        Route::post('/orders', [OrderController::class,'store'])->name('admin.orders.store');
        Route::get('/orders/{id}', [OrderController::class,'show'])->name('admin.orders.show');
        Route::get('/orders/{id}/edit', [OrderController::class,'edit'])->name('admin.orders.edit');
        Route::put('/orders/{id}', [OrderController::class,'update'])->name('admin.orders.update');
        Route::delete('/orders/{id}', [OrderController::class,'destroy'])->name('admin.orders.destroy');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
