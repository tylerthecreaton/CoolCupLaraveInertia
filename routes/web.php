<?php

use App\Http\Controllers\Admin\CategoriesController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\IngredientsController;
use App\Http\Controllers\Admin\InventoryTransactionsController;
use App\Http\Controllers\Admin\ProductIngredientsController;
use App\Http\Controllers\Admin\ProductsController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PromotionController;
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
// ---------------------------Promotions---------------------------
Route::get('/promotions', [PromotionController::class, 'index'])->name('promotions');

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

        // ---------------------------Product Ingredients---------------------------
        Route::post('/product-ingredients/batch-update', [ProductIngredientsController::class, 'batchUpdate'])
            ->name('admin.product-ingredients.batch-update');

        // ---------------------------Customers---------------------------
        Route::get('/customers', [CustomerController::class, 'index'])->name('admin.customers.index');
        Route::get('/customers/create', [CustomerController::class, 'create'])->name('admin.customers.create');
        Route::post('/customers', [CustomerController::class, 'store'])->name('admin.customers.store');
        Route::get('/customers/{id}', [CustomerController::class, 'show'])->name('admin.customers.show');
        Route::get('/customers/{id}/edit', [CustomerController::class, 'edit'])->name('admin.customers.edit');
        Route::put('/customers/{id}', [CustomerController::class, 'update'])->name('admin.customers.update');
        Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])->name('admin.customers.destroy');

        // ---------------------------Orders---------------------------
        Route::get('/orders', [OrderController::class, 'index'])->name('admin.orders.index');
        Route::get('/orders/create', [OrderController::class, 'create'])->name('admin.orders.create');
        Route::post('/orders', [OrderController::class, 'store'])->name('admin.orders.store');
        Route::get('/orders/{id}', [OrderController::class, 'show'])->name('admin.orders.show');
        Route::get('/orders/{id}/edit', [OrderController::class, 'edit'])->name('admin.orders.edit');
        Route::put('/orders/{id}', [OrderController::class, 'update'])->name('admin.orders.update');
        Route::delete('/orders/{id}', [OrderController::class, 'destroy'])->name('admin.orders.destroy');

        // ---------------------------Ingredients---------------------------
        Route::get('/ingredients', [IngredientsController::class, 'index'])->name('admin.ingredients.index');
        Route::get('/ingredients/create', [IngredientsController::class, 'create'])->name('admin.ingredients.create');
        Route::post('/ingredients', [IngredientsController::class, 'store'])->name('admin.ingredients.store');
        Route::get('/ingredients/{id}', [IngredientsController::class, 'show'])->name('admin.ingredients.show');
        Route::get('/ingredients/{id}/edit', [IngredientsController::class, 'edit'])->name('admin.ingredients.edit');
        Route::put('/ingredients/{id}', [IngredientsController::class, 'update'])->name('admin.ingredients.update');
        Route::delete('/ingredients/{id}', [IngredientsController::class, 'destroy'])->name('admin.ingredients.destroy');

        // ---------------------------Units---------------------------
        Route::get('/units', [UnitController::class, 'index'])->name('admin.units.index');
        Route::get('/units/create', [UnitController::class, 'create'])->name('admin.units.create');
        Route::post('/units', [UnitController::class, 'store'])->name('admin.units.store');
        Route::get('/units/{id}', [UnitController::class, 'show'])->name('admin.units.show');
        Route::get('/units/{id}/edit', [UnitController::class, 'edit'])->name('admin.units.edit');
        Route::put('/units/{id}', [UnitController::class, 'update'])->name('admin.units.update');
        Route::delete('/units/{id}', [UnitController::class, 'destroy'])->name('admin.units.destroy');

        // ---------------------------Inventory Transactions---------------------------
        Route::get('/transactions', [InventoryTransactionsController::class, 'index'])->name('admin.transactions.index');
        Route::get('/transactions/create', [InventoryTransactionsController::class, 'create'])->name('admin.transactions.create');
        Route::post('/transactions', [InventoryTransactionsController::class, 'store'])->name('admin.transactions.store');
        Route::get('/transactions/{id}', [InventoryTransactionsController::class, 'show'])->name('admin.transactions.show');
        Route::get('/transactions/{id}/edit', [InventoryTransactionsController::class, 'edit'])->name('admin.transactions.edit');
        Route::put('/transactions/{id}', [InventoryTransactionsController::class, 'update'])->name('admin.transactions.update');
        Route::delete('/transactions/{id}', [InventoryTransactionsController::class, 'destroy'])->name('admin.transactions.destroy');

        // ---------------------------Settings---------------------------
        Route::get('/settings', [SettingController::class, 'index'])->name('admin.settings.index');
        Route::post('/settings', [SettingController::class, 'store'])->name('admin.settings.store');
        Route::put('/settings/{setting}', [SettingController::class, 'update'])->name('admin.settings.update');
        Route::delete('/settings/{setting}', [SettingController::class, 'destroy'])->name('admin.settings.destroy');

        // ---------------------------Promotions---------------------------
        // Route::get('/promotions', [PromotionController::class, 'index'])->name('admin.promotions.index');
        // Route::get('/promotions/create', [PromotionController::class, 'create'])->name('admin.promotions.create');
        // Route::post('/promotions', [PromotionController::class, 'store'])->name('admin.promotions.store');
        // Route::get('/promotions/{id}', [PromotionController::class, 'show'])->name('admin.promotions.show');
        // Route::get('/promotions/{id}/edit', [PromotionController::class, 'edit'])->name('admin.promotions.edit');
        // Route::put('/promotions/{id}', [PromotionController::class, 'update'])->name('admin.promotions.update');
        // Route::delete('/promotions/{id}', [PromotionController::class, 'destroy'])->name('admin.promotions.destroy');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
