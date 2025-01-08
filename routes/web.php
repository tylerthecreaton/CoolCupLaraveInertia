<?php

use App\Http\Controllers\Admin\CategoriesController as AdminCategoriesController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\IngredientsController as AdminIngredientsController;
use App\Http\Controllers\Admin\InventoryTransactionsController as AdminInventoryTransactionsController;
use App\Http\Controllers\Admin\ProductIngredientsController as AdminProductIngredientsController;
use App\Http\Controllers\Admin\ProductsController as AdminProductsController;
use App\Http\Controllers\Admin\PromotionController as AdminPromotionController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\UnitController as AdminUnitController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\RegisterMemberController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\SaleDashboardController;
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
Route::get('/member/search', [MemberController::class, 'search'])->name('member.search');

// ---------------------------ReceiptHistory---------------------------
Route::middleware('auth')->group(function () {
    Route::get('/receipt-history', [OrderController::class, 'receiptHistory'])->name('receipt.history');

// ---------------------------Sale Dashboard---------------------------
Route::get('/sale-dashboard', [SaleDashboardController::class, 'index'])->name('sale.dashboard');
    // ---------------------------Promotions---------------------------
    Route::get('/promotions', [PromotionController::class, 'index'])->name('promotion.index');

    // ---------------------------Orders---------------------------
    Route::get('/orders', [OrderController::class, 'index'])->name('order.index');
    Route::get('/orders/create', [OrderController::class, 'create'])->name('order.create');
    Route::post('/orders', [OrderController::class, 'store'])->name('order.store');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('order.show');
    Route::get('/orders/{id}/edit', [OrderController::class, 'edit'])->name('order.edit');
    Route::put('/orders/{id}', [OrderController::class, 'update'])->name('order.update');
    Route::delete('/orders/{id}', [OrderController::class, 'destroy'])->name('order.destroy');
    Route::get('/get-last-order-number', [OrderController::class, 'getLastOrderNumber'])->name('order.lastNumber');
    Route::post('/receipt/store', [ReceiptController::class, 'store'])->name('receipt.store');

    Route::group(['prefix' => '/admin'], function () {
        // ---------------------------Users---------------------------
        Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
        Route::get('/users/create', [AdminUserController::class, 'create'])->name('admin.users.create');
        Route::post('/users', [AdminUserController::class, 'store'])->name('admin.users.store');
        Route::get('/users/{id}', [AdminUserController::class, 'show'])->name('admin.user');
        Route::get('/users/{id}/edit', [AdminUserController::class, 'edit'])->name('admin.users.edit');
        Route::put('/users/{id}', [AdminUserController::class, 'update'])->name('admin.users.update');
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');

        // ---------------------------Categories---------------------------
        Route::get('/categories', [AdminCategoriesController::class, 'index'])->name('admin.categories.index');
        Route::get('/categories/create', [AdminCategoriesController::class, 'create'])->name('admin.categories.create');
        Route::post('/categories', [AdminCategoriesController::class, 'store'])->name('admin.categories.store');
        Route::get('/categories/{id}', [AdminCategoriesController::class, 'show'])->name('admin.categories.show');
        Route::get('/categories/{id}/edit', [AdminCategoriesController::class, 'edit'])->name('admin.categories.edit');
        Route::put('/categories/{id}', [AdminCategoriesController::class, 'update'])->name('admin.categories.update');
        Route::delete('/categories/{id}', [AdminCategoriesController::class, 'destroy'])->name('admin.categories.destroy');

        // ---------------------------Products---------------------------
        Route::get('/products', [AdminProductsController::class, 'index'])->name('admin.products.index');
        Route::get('/products/create', [AdminProductsController::class, 'create'])->name('admin.products.create');
        Route::post('/products', [AdminProductsController::class, 'store'])->name('admin.products.store');
        Route::get('/products/{id}', [AdminProductsController::class, 'show'])->name('admin.products.show');
        Route::get('/products/{id}/edit', [AdminProductsController::class, 'edit'])->name('admin.products.edit');
        Route::put('/products/{id}', [AdminProductsController::class, 'update'])->name('admin.products.update');
        Route::delete('/products/{id}', [AdminProductsController::class, 'destroy'])->name('admin.products.destroy');

        // ---------------------------Product Ingredients---------------------------
        Route::post('/product-ingredients/batch-update', [AdminProductIngredientsController::class, 'batchUpdate'])
            ->name('admin.product-ingredients.batch-update');

        // ---------------------------Customers---------------------------
        Route::get('/customers', [AdminCustomerController::class, 'index'])->name('admin.customers.index');
        Route::get('/customers/create', [AdminCustomerController::class, 'create'])->name('admin.customers.create');
        Route::post('/customers', [AdminCustomerController::class, 'store'])->name('admin.customers.store');
        Route::get('/customers/{id}', [AdminCustomerController::class, 'show'])->name('admin.customers.show');
        Route::get('/customers/{id}/edit', [AdminCustomerController::class, 'edit'])->name('admin.customers.edit');
        Route::put('/customers/{id}', [AdminCustomerController::class, 'update'])->name('admin.customers.update');
        Route::delete('/customers/{id}', [AdminCustomerController::class, 'destroy'])->name('admin.customers.destroy');

        // ---------------------------Ingredients---------------------------
        Route::get('/ingredients', [AdminIngredientsController::class, 'index'])->name('admin.ingredients.index');
        Route::get('/ingredients/create', [AdminIngredientsController::class, 'create'])->name('admin.ingredients.create');
        Route::post('/ingredients', [AdminIngredientsController::class, 'store'])->name('admin.ingredients.store');
        Route::get('/ingredients/{id}', [AdminIngredientsController::class, 'show'])->name('admin.ingredients.show');
        Route::get('/ingredients/{id}/edit', [AdminIngredientsController::class, 'edit'])->name('admin.ingredients.edit');
        Route::put('/ingredients/{id}', [AdminIngredientsController::class, 'update'])->name('admin.ingredients.update');
        Route::delete('/ingredients/{id}', [AdminIngredientsController::class, 'destroy'])->name('admin.ingredients.destroy');
        Route::post('/ingredients/{ingredient}/increase', [AdminIngredientsController::class, 'increaseQuantity'])->name('admin.ingredients.increase');
        Route::post('/ingredients/{ingredient}/increase-quantity', [AdminIngredientsController::class, 'increaseQuantity'])
            ->name('admin.ingredients.increase-quantity');

        // ---------------------------Units---------------------------
        Route::get('/units', [AdminUnitController::class, 'index'])->name('admin.units.index');
        Route::get('/units/create', [AdminUnitController::class, 'create'])->name('admin.units.create');
        Route::post('/units', [AdminUnitController::class, 'store'])->name('admin.units.store');
        Route::get('/units/{id}', [AdminUnitController::class, 'show'])->name('admin.units.show');
        Route::get('/units/{id}/edit', [AdminUnitController::class, 'edit'])->name('admin.units.edit');
        Route::put('/units/{id}', [AdminUnitController::class, 'update'])->name('admin.units.update');
        Route::delete('/units/{id}', [AdminUnitController::class, 'destroy'])->name('admin.units.destroy');

        // ---------------------------Inventory Transactions---------------------------
        Route::get('/transactions', [AdminInventoryTransactionsController::class, 'index'])->name('admin.transactions.index');
        Route::get('/transactions/create', [AdminInventoryTransactionsController::class, 'create'])->name('admin.transactions.create');
        Route::post('/transactions', [AdminInventoryTransactionsController::class, 'store'])->name('admin.transactions.store');
        Route::get('/transactions/{id}', [AdminInventoryTransactionsController::class, 'show'])->name('admin.transactions.show');
        Route::get('/transactions/{id}/edit', [AdminInventoryTransactionsController::class, 'edit'])->name('admin.transactions.edit');
        Route::put('/transactions/{id}', [AdminInventoryTransactionsController::class, 'update'])->name('admin.transactions.update');
        Route::delete('/transactions/{id}', [AdminInventoryTransactionsController::class, 'destroy'])->name('admin.transactions.destroy');

        // ---------------------------Settings---------------------------
        Route::get('/settings', [AdminSettingController::class, 'index'])->name('admin.settings.index');
        Route::post('/settings', [AdminSettingController::class, 'store'])->name('admin.settings.store');
        Route::put('/settings/{setting}', [AdminSettingController::class, 'update'])->name('admin.settings.update');
        Route::delete('/settings/{setting}', [AdminSettingController::class, 'destroy'])->name('admin.settings.destroy');

        // ---------------------------Promotions---------------------------
        Route::get('/promotions', [AdminPromotionController::class, 'index'])->name('admin.promotions.index');
        Route::get('/promotions/create', [AdminPromotionController::class, 'create'])->name('admin.promotions.create');
        Route::post('/promotions', [AdminPromotionController::class, 'store'])->name('admin.promotions.store');
        Route::get('/promotions/{id}', [AdminPromotionController::class, 'show'])->name('admin.promotions.show');
        Route::get('/promotions/{id}/edit', [AdminPromotionController::class, 'edit'])->name('admin.promotions.edit');
        Route::put('/promotions/{id}', [AdminPromotionController::class, 'update'])->name('admin.promotions.update');
        Route::delete('/promotions/{id}', [AdminPromotionController::class, 'destroy'])->name('admin.promotions.destroy');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
