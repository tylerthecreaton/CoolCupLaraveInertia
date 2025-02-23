<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    HomeController,
    ClientController,
    DashboardController,
    MemberController,
    OrderController,
    PromotionController,
    SlipController,
    SaleDashboardController,
    ReceiptController,
    NotificationController,
    ProfileController,
    TelegramController
};
use App\Http\Controllers\Admin\{
    CategoriesController,
    CustomerController,
    IngredientsController,
    IngredientLotController,
    InventoryTransactionsController,
    ProductIngredientsController,
    ProductConsumablesController,
    ProductsController,
    PromotionController as AdminPromotionController,
    ReportController,
    SettingController,
    UnitController,
    UserController,
    ConsumablesController,
    ConsumableLotController,
    ExpenseController,
    ExpenseCategoryController,
    WithdrawController,
    TransformerController,
    ExpiredController
};

// Public Routes (Role 4)

Route::get('/client', [ClientController::class, 'showClientPage'])->name('client');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    // Member Management (Role 4)
    Route::get('/registermember', [MemberController::class, 'register'])->name('member.register');
    Route::post('/member/check-phone', [MemberController::class, 'checkPhoneNumber'])->name('member.checkPhoneNumber');
    Route::get('/member', [MemberController::class, 'index'])->name('member.index');
    Route::get('/member/search', [MemberController::class, 'search'])->name('member.search');
    Route::post('/member', [MemberController::class, 'store'])->name('member.store');
    Route::get('/member/{id}/edit', [MemberController::class, 'edit'])->name('member.edit');
    Route::put('/member/{id}', [MemberController::class, 'update'])->name('member.update');
    Route::delete('/member/{id}', [MemberController::class, 'destroy'])->name('member.destroy');

    // General Features (Role 4)
    Route::get('/promotion', [PromotionController::class, 'index'])->name('promotion.index');
    Route::get('/receipt-history', [OrderController::class, 'receiptHistory'])->name('receipt.history');
    Route::get('/sendslip', [SlipController::class, 'index'])->name('slip.index');
    Route::post('/sendslip/{orderId}/upload', [SlipController::class, 'upload'])->name('slip.upload');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('order.cancel');
    Route::get('/toppings', [ProductsController::class, 'getToppings'])->name('products.toppings');
    Route::get('/sale-dashboard', [SaleDashboardController::class, 'index'])->name('sale.dashboard');

    // Orders (Role 4)
    Route::get('/orders', [OrderController::class, 'index'])->name('order.index');
    Route::get('/orders/create', [OrderController::class, 'create'])->name('order.create');
    Route::post('/orders', [OrderController::class, 'store'])->name('order.store');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('order.show');
    Route::get('/orders/{id}/edit', [OrderController::class, 'edit'])->name('order.edit');
    Route::get('/orders/{id}/upload-slip', [OrderController::class, 'showUploadSlip'])->name('order.showUploadSlip');
    Route::post('/orders/{id}/upload-slip', [OrderController::class, 'uploadSlip'])->name('order.uploadSlip');
    Route::put('/orders/{id}', [OrderController::class, 'update'])->name('order.update');
    Route::delete('/orders/{id}', [OrderController::class, 'destroy'])->name('order.destroy');
    Route::get('/orders/last-number', [OrderController::class, 'getLastOrderNumber'])->name('order.lastNumber');

    Route::post('/receipt/store', [ReceiptController::class, 'store'])->name('receipt.store');

    // Notifications (Role 4)

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
    Route::get('/api/admin/notifications', [NotificationController::class, 'getNotifications'])->name('notifications.get');


    // Dashboard (Admin & Manager: Roles 1, 2)
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('permission:view dashboard')
        ->name('dashboard');


    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes (Roles 1 & 2 with specific permissions)
    Route::middleware(['verified'])->group(function () {
        // Users (Admin & Manager)
        Route::middleware('permission:manage users')->group(function () {
            Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
            Route::get('/admin/users/create', [UserController::class, 'create'])->name('admin.users.create');
            Route::post('/admin/users', [UserController::class, 'store'])->name('admin.users.store');
            Route::get('/admin/users/{id}', [UserController::class, 'show'])->name('admin.users.show');
            Route::get('/admin/users/{id}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
            Route::put('/admin/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
            Route::delete('/admin/users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');
        });

        // Categories (Admin & Manager)
        Route::middleware('permission:manage categories')->group(function () {
            Route::get('/admin/categories', [CategoriesController::class, 'index'])->name('admin.categories.index');
            Route::get('/admin/categories/create', [CategoriesController::class, 'create'])->name('admin.categories.create');
            Route::post('/admin/categories', [CategoriesController::class, 'store'])->name('admin.categories.store');
            Route::get('/admin/categories/{id}', [CategoriesController::class, 'show'])->name('admin.categories.show');
            Route::get('/admin/categories/{id}/edit', [CategoriesController::class, 'edit'])->name('admin.categories.edit');
            Route::put('/admin/categories/{id}', [CategoriesController::class, 'update'])->name('admin.categories.update');
            Route::delete('/admin/categories/{id}', [CategoriesController::class, 'destroy'])->name('admin.categories.destroy');
        });

        // Products (Admin, Manager, Employee)
        Route::middleware('permission:manage products')->group(function () {
            Route::get('/admin/products', [ProductsController::class, 'index'])->name('admin.products.index');
            Route::get('/admin/products/create', [ProductsController::class, 'create'])->name('admin.products.create');
            Route::post('/admin/products', [ProductsController::class, 'store'])->name('admin.products.store');
            Route::get('/admin/products/{id}', [ProductsController::class, 'show'])->name('admin.products.show');
            Route::get('/admin/products/{id}/edit', [ProductsController::class, 'edit'])->name('admin.products.edit');
            Route::put('/admin/products/{id}', [ProductsController::class, 'update'])->name('admin.products.update');
            Route::delete('/admin/products/{id}', [ProductsController::class, 'destroy'])->name('admin.products.destroy');
        });

        // Product Ingredients (Admin & Manager)
        Route::post('/admin/product-ingredients/batch-update', [ProductIngredientsController::class, 'batchUpdate'])
            ->middleware('permission:manage products')
            ->name('admin.product-ingredients.batch-update');

        // Product Consumables (Admin & Manager)
        Route::post('/admin/product-consumables/batch-update', [ProductConsumablesController::class, 'batchUpdate'])
            ->middleware('permission:manage products')
            ->name('admin.product-consumables.batch-update');

        // Ingredients (Admin & Manager)
        Route::middleware('permission:manage inventory')->group(function () {
            Route::get('/admin/ingredients', [IngredientsController::class, 'index'])->name('admin.ingredients.index');
            Route::get('/admin/ingredients/create', [IngredientsController::class, 'create'])->name('admin.ingredients.create');
            Route::post('/admin/ingredients', [IngredientsController::class, 'store'])->name('admin.ingredients.store');
            Route::get('/admin/ingredients/{id}', [IngredientsController::class, 'show'])->name('admin.ingredients.show');
            Route::get('/admin/ingredients/{id}/edit', [IngredientsController::class, 'edit'])->name('admin.ingredients.edit');
            Route::put('/admin/ingredients/{id}', [IngredientsController::class, 'update'])->name('admin.ingredients.update');
            Route::delete('/admin/ingredients/{id}', [IngredientsController::class, 'destroy'])->name('admin.ingredients.destroy');
            Route::post('/admin/ingredients/{ingredient}/increase', [IngredientsController::class, 'increaseQuantity'])->name('admin.ingredients.increase');
            Route::post('/admin/ingredients/{ingredient}/increase-quantity', [IngredientsController::class, 'increaseQuantity'])->name('admin.ingredients.increase-quantity');
        });

        // Ingredient Lots (Admin & Manager)
        Route::middleware('permission:manage inventory')->group(function () {
            Route::get('/admin/ingredient-lots', [IngredientLotController::class, 'index'])->name('admin.ingredient-lots.index');
            Route::get('/admin/ingredient-lots/create', [IngredientLotController::class, 'create'])->name('admin.ingredient-lots.create');
            Route::post('/admin/ingredient-lots', [IngredientLotController::class, 'store'])->name('admin.ingredient-lots.store');
            Route::get('/admin/ingredient-lots/expired', [ExpiredController::class, 'index'])->name('admin.ingredient-lots.expired.index');
            Route::delete('/admin/ingredient-lots/expired/{ingredientLot}', [ExpiredController::class, 'dispose'])->name('admin.ingredient-lots.expired.dispose');
            Route::get('/admin/ingredient-lots/{id}', [IngredientLotController::class, 'show'])->name('admin.ingredient-lots.show');
            Route::delete('/admin/ingredient-lots/{id}', [IngredientLotController::class, 'destroy'])->name('admin.ingredient-lots.destroy');
            Route::delete('/admin/ingredient-lots/{id}/revert', [IngredientLotController::class, 'revert'])->name('admin.ingredient-lots.revert');
        });

        // Consumables (Admin & Manager)
        Route::middleware('permission:manage inventory')->group(function () {
            Route::get('/admin/consumables', [ConsumablesController::class, 'index'])->name('admin.consumables.index');
            Route::get('/admin/consumables/create', [ConsumablesController::class, 'create'])->name('admin.consumables.create');
            Route::post('/admin/consumables', [ConsumablesController::class, 'store'])->name('admin.consumables.store');
            Route::get('/admin/consumables/{id}/edit', [ConsumablesController::class, 'edit'])->name('admin.consumables.edit');
            Route::put('/admin/consumables/{id}', [ConsumablesController::class, 'update'])->name('admin.consumables.update');
            Route::delete('/admin/consumables/{id}', [ConsumablesController::class, 'destroy'])->name('admin.consumables.destroy');
        });

        // Consumable Lots (Admin & Manager)
        Route::middleware('permission:manage inventory')->group(function () {
            Route::get('/admin/consumables/lots', [ConsumableLotController::class, 'index'])->name('admin.consumables.lots.index');
            Route::get('/admin/consumables/lots/create', [ConsumableLotController::class, 'create'])->name('admin.consumables.lots.create');
            Route::post('/admin/consumables/lots', [ConsumableLotController::class, 'store'])->name('admin.consumables.lots.store');
            Route::get('/admin/consumables/lots/{date}/details', [ConsumableLotController::class, 'getLotDetails'])->name('admin.consumables.lots.details');
            Route::delete('/admin/consumables/lots/{id}', [ConsumableLotController::class, 'destroy'])->name('admin.consumables.lots.destroy');
            Route::delete('/admin/consumables/lots/{id}/revert', [ConsumableLotController::class, 'revert'])->name('admin.consumables.lots.revert');
        });

        // Withdrawals (Role 4)
        Route::get('/admin/withdraw', [WithdrawController::class, 'index'])->name('admin.withdraw.index');
        Route::get('/admin/withdraw/create', [WithdrawController::class, 'create'])->name('admin.withdraw.create');
        Route::post('/admin/withdraw', [WithdrawController::class, 'store'])->name('admin.withdraw.store');
        Route::delete('/admin/withdraw/{id}/rollback', [WithdrawController::class, 'rollback'])->name('admin.withdraw.rollback');

        // Reports (Admin & Manager)
        Route::get('/admin/report', [ReportController::class, 'index'])
            ->middleware('permission:view reports')
            ->name('admin.report.index');

        // Settings (Admin only)
        Route::middleware('permission:manage settings')->group(function () {
            Route::get('/admin/settings', [SettingController::class, 'index'])->name('admin.settings.index');
            Route::post('/admin/settings', [SettingController::class, 'store'])->name('admin.settings.store');
            Route::put('/admin/settings/{setting}', [SettingController::class, 'update'])->name('admin.settings.update');
            Route::delete('/admin/settings/{setting}', [SettingController::class, 'destroy'])->name('admin.settings.destroy');
        });

        // Transformers (Admin & Manager)
        Route::middleware('permission:manage inventory')->group(function () {
            Route::get('/admin/transformers', [TransformerController::class, 'index'])->name('admin.transformers.index');
            Route::get('/admin/transformers/create', [TransformerController::class, 'create'])->name('admin.transformers.create');
            Route::post('/admin/transformers', [TransformerController::class, 'store'])->name('admin.transformers.store');
            Route::get('/admin/transformers/{id}', [TransformerController::class, 'show'])->name('admin.transformers.show');
            Route::get('/admin/transformers/{id}/edit', [TransformerController::class, 'edit'])->name('admin.transformers.edit');
            Route::put('/admin/transformers/{id}', [TransformerController::class, 'update'])->name('admin.transformers.update');
            Route::delete('/admin/transformers/{id}', [TransformerController::class, 'destroy'])->name('admin.transformers.destroy');
        });

        // Expenses (Admin & Manager)
        Route::middleware('permission:manage inventory')->group(function () {
            Route::get('/admin/expenses', [ExpenseController::class, 'index'])->name('admin.expenses.index');
            Route::get('/admin/expenses/create', [ExpenseController::class, 'create'])->name('admin.expenses.create');
            Route::post('/admin/expenses', [ExpenseController::class, 'store'])->name('admin.expenses.store');
            Route::get('/admin/expenses/{id}', [ExpenseController::class, 'show'])->name('admin.expenses.show');
            Route::get('/admin/expenses/{id}/edit', [ExpenseController::class, 'edit'])->name('admin.expenses.edit');
            Route::put('/admin/expenses/{id}', [ExpenseController::class, 'update'])->name('admin.expenses.update');
            Route::delete('/admin/expenses/{id}', [ExpenseController::class, 'destroy'])->name('admin.expenses.destroy');
        });

        // Expense Categories (Admin & Manager)
        Route::middleware('permission:manage inventory')->group(function () {
            Route::get('/admin/expense-categories', [ExpenseCategoryController::class, 'index'])->name('admin.expense-categories.index');
            Route::get('/admin/expense-categories/create', [ExpenseCategoryController::class, 'create'])->name('admin.expense-categories.create');
            Route::post('/admin/expense-categories', [ExpenseCategoryController::class, 'store'])->name('admin.expense-categories.store');
            Route::get('/admin/expense-categories/{id}/edit', [ExpenseCategoryController::class, 'edit'])->name('admin.expense-categories.edit');
            Route::put('/admin/expense-categories/{id}', [ExpenseCategoryController::class, 'update'])->name('admin.expense-categories.update');
            Route::delete('/admin/expense-categories/{id}', [ExpenseCategoryController::class, 'destroy'])->name('admin.expense-categories.destroy');
        });

        // Units (Admin & Manager)
        Route::middleware('permission:manage inventory')->group(function () {
            Route::get('/admin/units', [UnitController::class, 'index'])->name('admin.units.index');
            Route::get('/admin/units/create', [UnitController::class, 'create'])->name('admin.units.create');
            Route::post('/admin/units', [UnitController::class, 'store'])->name('admin.units.store');
            Route::get('/admin/units/{id}', [UnitController::class, 'show'])->name('admin.units.show');
            Route::get('/admin/units/{id}/edit', [UnitController::class, 'edit'])->name('admin.units.edit');
            Route::put('/admin/units/{id}', [UnitController::class, 'update'])->name('admin.units.update');
            Route::delete('/admin/units/{id}', [UnitController::class, 'destroy'])->name('admin.units.destroy');
        });

        // Customers (Admin & Manager)
        Route::middleware('permission:manage inventory')->group(function () {
            Route::get('/admin/customers', [CustomerController::class, 'index'])->name('admin.customers.index');
            Route::get('/admin/customers/create', [CustomerController::class, 'create'])->name('admin.customers.create');
            Route::post('/admin/customers', [CustomerController::class, 'store'])->name('admin.customers.store');
            Route::get('/admin/customers/{id}', [CustomerController::class, 'show'])->name('admin.customers.show');
            Route::get('/admin/customers/{id}/edit', [CustomerController::class, 'edit'])->name('admin.customers.edit');
            Route::put('/admin/customers/{id}', [CustomerController::class, 'update'])->name('admin.customers.update');
            Route::delete('/admin/customers/{id}', [CustomerController::class, 'destroy'])->name('admin.customers.destroy');
        });

        // Promotions (Admin & Manager)
        Route::middleware('permission:manage products')->group(function () {
            Route::get('/admin/promotions', [AdminPromotionController::class, 'index'])->name('admin.promotions.index');
            Route::get('/admin/promotions/create', [AdminPromotionController::class, 'create'])->name('admin.promotions.create');
            Route::post('/admin/promotions', [AdminPromotionController::class, 'store'])->name('admin.promotions.store');
            Route::get('/admin/promotions/{promotion}', [AdminPromotionController::class, 'show'])->name('admin.promotions.show');
            Route::get('/admin/promotions/{promotion}/edit', [AdminPromotionController::class, 'edit'])->name('admin.promotions.edit');
            Route::put('/admin/promotions/{promotion}', [AdminPromotionController::class, 'update'])->name('admin.promotions.update');
            Route::delete('/admin/promotions/{promotion}', [AdminPromotionController::class, 'destroy'])->name('admin.promotions.destroy');
        });

        // Transactions (Admin & Manager)

        Route::get('/admin/transactions', [InventoryTransactionsController::class, 'index'])->name('admin.transactions.index');
        Route::get('/admin/transactions/create', [InventoryTransactionsController::class, 'create'])->name('admin.transactions.create');
        Route::post('/admin/transactions', [InventoryTransactionsController::class, 'store'])->name('admin.transactions.store');
        Route::get('/admin/transactions/{id}', [InventoryTransactionsController::class, 'show'])->name('admin.transactions.show');
        Route::get('/admin/transactions/{id}/edit', [InventoryTransactionsController::class, 'edit'])->name('admin.transactions.edit');
        Route::put('/admin/transactions/{id}', [InventoryTransactionsController::class, 'update'])->name('admin.transactions.update');
        Route::delete('/admin/transactions/{id}', [InventoryTransactionsController::class, 'destroy'])->name('admin.transactions.destroy');
    });
});

// Telegram Routes (Admin & Manager)
Route::middleware('permission:view dashboard')->group(function () {
    Route::post('/telegram/webhook', [TelegramController::class, 'handleWebhook']);
    Route::get('/telegram/send-message/{message}', [TelegramController::class, 'sendMessage']);
});

require __DIR__ . '/auth.php';
