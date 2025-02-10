<?php

use App\Http\Controllers\Admin\CategoriesController as AdminCategoriesController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\IngredientsController as AdminIngredientsController;
use App\Http\Controllers\Admin\IngredientLotController as AdminIngredientLotController;
use App\Http\Controllers\Admin\InventoryTransactionsController as AdminInventoryTransactionsController;
use App\Http\Controllers\Admin\ProductIngredientsController as AdminProductIngredientsController;
use App\Http\Controllers\Admin\ProductConsumablesController as AdminProductConsumablesController;
use App\Http\Controllers\Admin\ProductsController as AdminProductsController;
use App\Http\Controllers\Admin\PromotionController as AdminPromotionController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\UnitController as AdminUnitController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ConsumablesController as AdminConsumablesController;
use App\Http\Controllers\Admin\ConsumableLotController as AdminConsumableLotController;
use App\Http\Controllers\Admin\ExpenseController as AdminExpenseController;
use App\Http\Controllers\Admin\ExpenseCategoryController as AdminExpenseCategoryController;
use App\Http\Controllers\Admin\WithdrawController as AdminWithdrawController;
use App\Http\Controllers\Admin\TransformerController as AdminTransformerController;
use App\Http\Controllers\Admin\ExpiredController as AdminExpiredController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\RegisterMemberController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\SaleDashboardController;
use App\Http\Controllers\SlipController;
use App\Http\Controllers\TelegramController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index']);

// ---------------------------ClientPage---------------------------
Route::get('/client', [ClientController::class, 'showClientPage'])->name('client');

// ---------------------------Member---------------------------
Route::get('/registermember', [MemberController::class, 'register'])->name('registermember');
Route::post('/checkPhoneNumber', [MemberController::class, 'checkPhoneNumber'])->name("member.checkPhoneNumber");
Route::get('/member', [MemberController::class, 'index'])->name('member.index');
Route::get('/member/search', [MemberController::class, 'search'])->name('member.search');
Route::post('/member', [MemberController::class, 'store'])->name('member.store');
Route::get('/member/edit/{id}', [MemberController::class, 'edit'])->name('member.edit');
Route::put('/member/{id}', [MemberController::class, 'update'])->name('member.update');
Route::delete('/member/{id}', [MemberController::class, 'destroy'])->name('member.destroy');

// ---------------------------ReceiptHistory---------------------------
Route::middleware('auth', 'can:view dashboard')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/receipt-history', [OrderController::class, 'receiptHistory'])->name('receipt.history');
    Route::get('/sendslip', [SlipController::class, 'index'])->name('slip.index');
    Route::post('/sendslip/{orderId}/upload', [SlipController::class, 'upload'])->name('slip.upload');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('order.cancel');
    Route::get('/toppings', [AdminProductsController::class, 'getToppings'])->name('products.toppings');

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

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
    Route::get('/api/admin/notifications', [NotificationController::class, 'getNotifications'])->name('notifications.get');

    Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
        // ---------------------------Users---------------------------
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
        Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
        Route::get('/users/{id}', [AdminUserController::class, 'show'])->name('user');
        Route::get('/users/{id}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{id}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy'])->name('users.destroy');

        // ---------------------------Categories---------------------------
        Route::get('/categories', [AdminCategoriesController::class, 'index'])->name('categories.index');
        Route::get('/categories/create', [AdminCategoriesController::class, 'create'])->name('categories.create');
        Route::post('/categories', [AdminCategoriesController::class, 'store'])->name('categories.store');
        Route::get('/categories/{id}', [AdminCategoriesController::class, 'show'])->name('categories.show');
        Route::get('/categories/{id}/edit', [AdminCategoriesController::class, 'edit'])->name('categories.edit');
        Route::put('/categories/{id}', [AdminCategoriesController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{id}', [AdminCategoriesController::class, 'destroy'])->name('categories.destroy');

        // ---------------------------Expense Categories---------------------------
        Route::get('/expense-categories', [AdminExpenseCategoryController::class, 'index'])->name('expense-categories.index');
        Route::get('/expense-categories/create', [AdminExpenseCategoryController::class, 'create'])->name('expense-categories.create');
        Route::post('/expense-categories', [AdminExpenseCategoryController::class, 'store'])->name('expense-categories.store');
        Route::get('/expense-categories/{id}/edit', [AdminExpenseCategoryController::class, 'edit'])->name('expense-categories.edit');
        Route::put('/expense-categories/{id}', [AdminExpenseCategoryController::class, 'update'])->name('expense-categories.update');
        Route::delete('/expense-categories/{id}', [AdminExpenseCategoryController::class, 'destroy'])->name('expense-categories.destroy');

        // ---------------------------Expenses---------------------------
        Route::get('/expenses', [AdminExpenseController::class, 'index'])->name('expenses.index');
        Route::get('/expenses/create', action: [AdminExpenseController::class, 'create'])->name('expenses.create');
        Route::post('/expenses', [AdminExpenseController::class, 'store'])->name('expenses.store');
        Route::get('/expenses/{id}', [AdminExpenseController::class, 'show'])->name('expenses.show');
        Route::get('/expenses/{id}/edit', [AdminExpenseController::class, 'edit'])->name('expenses.edit');
        Route::put('/expenses/{id}', [AdminExpenseController::class, 'update'])->name('expenses.update');
        Route::delete('/expenses/{id}', [AdminExpenseController::class, 'destroy'])->name('expenses.destroy');

        // ---------------------------Withdrawals---------------------------
        Route::get('/withdraw', [AdminWithdrawController::class, 'index'])->name('withdraw.index');
        Route::get('/withdraw/create', [AdminWithdrawController::class, 'create'])->name('withdraw.create');
        Route::post('/withdraw', [AdminWithdrawController::class, 'store'])->name('withdraw.store');
        Route::delete('/withdraw/{id}/rollback', [AdminWithdrawController::class, 'rollback'])->name('withdraw.rollback');

        // ---------------------------Transfomer---------------------------
        Route::get('/transformers', [AdminTransformerController::class, 'index'])->name('transformers.index');
        Route::get('/transformers/create', [AdminTransformerController::class, 'create'])->name('transformers.create');
        Route::post('/transformers', [AdminTransformerController::class, 'store'])->name('transformers.store');
        Route::get('/transformers/{id}', [AdminTransformerController::class, 'show'])->name('transformers.show');
        Route::get('/transformers/{id}/edit', [AdminTransformerController::class, 'edit'])->name('transformers.edit');
        Route::put('/transformers/{id}', [AdminTransformerController::class, 'update'])->name('transformers.update');
        Route::delete('/transformers/{id}', [AdminTransformerController::class, 'destroy'])->name('transformers.destroy');

        // ---------------------------Products---------------------------
        Route::get('/products', [AdminProductsController::class, 'index'])->name('products.index');
        Route::get('/products/create', [AdminProductsController::class, 'create'])->name('products.create');
        Route::post('/products', [AdminProductsController::class, 'store'])->name('products.store');
        Route::get('/products/{id}', [AdminProductsController::class, 'show'])->name('products.show');
        Route::get('/products/{id}/edit', [AdminProductsController::class, 'edit'])->name('products.edit');
        Route::put('/products/{id}', [AdminProductsController::class, 'update'])->name('products.update');
        Route::delete('/products/{id}', [AdminProductsController::class, 'destroy'])->name('products.destroy');

        // Product Ingredients
        Route::post('/product-ingredients/batch-update', [AdminProductIngredientsController::class, 'batchUpdate'])->name('product-ingredients.batch-update');

        // Product Consumables
        Route::post('/product-consumables/batch-update', [AdminProductConsumablesController::class, 'batchUpdate'])->name('product-consumables.batch-update');

        // ---------------------------Customers---------------------------
        Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers.index');
        Route::get('/customers/create', [AdminCustomerController::class, 'create'])->name('customers.create');
        Route::post('/customers', [AdminCustomerController::class, 'store'])->name('customers.store');
        Route::get('/customers/{id}', [AdminCustomerController::class, 'show'])->name('customers.show');
        Route::get('/customers/{id}/edit', [AdminCustomerController::class, 'edit'])->name('customers.edit');
        Route::put('/customers/{id}', [AdminCustomerController::class, 'update'])->name('customers.update');
        Route::delete('/customers/{id}', [AdminCustomerController::class, 'destroy'])->name('customers.destroy');

        // ---------------------------Consumables---------------------------
        Route::get('/consumables', [AdminConsumablesController::class, 'index'])->name('consumables.index');
        Route::get('/consumables/create', [AdminConsumablesController::class, 'create'])->name('consumables.create');
        Route::post('/consumables', [AdminConsumablesController::class, 'store'])->name('consumables.store');
        Route::get('/consumables/{id}/edit', [AdminConsumablesController::class, 'edit'])->name('consumables.edit');
        Route::put('/consumables/{id}', [AdminConsumablesController::class, 'update'])->name('consumables.update');
        Route::delete('/consumables/{id}', [AdminConsumablesController::class, 'destroy'])->name('consumables.destroy');

        // ---------------------------Consumable Lots---------------------------
        Route::get('/consumables/lots', [AdminConsumableLotController::class, 'index'])->name('consumables.lots.index');
        Route::get('/consumables/lots/create', [AdminConsumableLotController::class, 'create'])->name('consumables.lots.create');
        Route::post('/consumables/lots', [AdminConsumableLotController::class, 'store'])->name('consumables.lots.store');
        Route::get('/consumables/lots/{date}/details', [AdminConsumableLotController::class, 'getLotDetails'])->name('consumables.lots.details');
        Route::delete('/consumables/lots/{id}', [AdminConsumableLotController::class, 'destroy'])->name('consumables.lots.destroy');
        Route::delete('/consumables/lots/{id}/revert', [AdminConsumableLotController::class, 'revert'])->name('consumables.lots.revert');

        // ---------------------------Ingredients---------------------------
        Route::get('/ingredients', [AdminIngredientsController::class, 'index'])->name('ingredients.index');
        Route::get('/ingredients/create', [AdminIngredientsController::class, 'create'])->name('ingredients.create');
        Route::post('/ingredients', [AdminIngredientsController::class, 'store'])->name('ingredients.store');
        Route::get('/ingredients/{id}', [AdminIngredientsController::class, 'show'])->name('ingredients.show');
        Route::get('/ingredients/{id}/edit', [AdminIngredientsController::class, 'edit'])->name('ingredients.edit');
        Route::put('/ingredients/{id}', [AdminIngredientsController::class, 'update'])->name('ingredients.update');
        Route::delete('/ingredients/{id}', [AdminIngredientsController::class, 'destroy'])->name('ingredients.destroy');
        Route::post('/ingredients/{ingredient}/increase', [AdminIngredientsController::class, 'increaseQuantity'])->name('ingredients.increase');
        Route::post('/ingredients/{ingredient}/increase-quantity', [AdminIngredientsController::class, 'increaseQuantity'])
            ->name('ingredients.increase-quantity');

        // ---------------------------Ingredient Lots---------------------------
        Route::get('/ingredient-lots', [AdminIngredientLotController::class, 'index'])->name('ingredient-lots.index');
        Route::get('/ingredient-lots/create', [AdminIngredientLotController::class, 'create'])->name('ingredient-lots.create');
        Route::post('/ingredient-lots', [AdminIngredientLotController::class, 'store'])->name('ingredient-lots.store');
        Route::get('/ingredient-lots/{id}', [AdminIngredientLotController::class, 'show'])->name('ingredient-lots.show');
        Route::delete('/ingredient-lots/{id}', [AdminIngredientLotController::class, 'destroy'])->name('ingredient-lots.destroy');
        Route::delete('/ingredient-lots/{id}/revert', [AdminIngredientLotController::class, 'revert'])->name('ingredient-lots.revert');
        Route::get('/ingredient-lots/expired', [AdminIngredientLotController::class, 'expired'])->name('ingredient-lots.expired.index');
        Route::delete('/ingredient-lots/expired/{ingredientLot}', [AdminExpiredController::class, 'dispose'])->name('ingredient-lots.expired.dispose');

        // ---------------------------Units---------------------------
        Route::get('/units', [AdminUnitController::class, 'index'])->name('units.index');
        Route::get('/units/create', [AdminUnitController::class, 'create'])->name('units.create');
        Route::post('/units', [AdminUnitController::class, 'store'])->name('units.store');
        Route::get('/units/{id}', [AdminUnitController::class, 'show'])->name('units.show');
        Route::get('/units/{id}/edit', [AdminUnitController::class, 'edit'])->name('units.edit');
        Route::put('/units/{id}', [AdminUnitController::class, 'update'])->name('units.update');
        Route::delete('/units/{id}', [AdminUnitController::class, 'destroy'])->name('units.destroy');

        // ---------------------------Inventory Transactions---------------------------
        Route::get('/transactions', [AdminInventoryTransactionsController::class, 'index'])->name('transactions.index');
        Route::get('/transactions/create', [AdminInventoryTransactionsController::class, 'create'])->name('transactions.create');
        Route::post('/transactions', [AdminInventoryTransactionsController::class, 'store'])->name('transactions.store');
        Route::get('/transactions/{id}', [AdminInventoryTransactionsController::class, 'show'])->name('transactions.show');
        Route::get('/transactions/{id}/edit', [AdminInventoryTransactionsController::class, 'edit'])->name('transactions.edit');
        Route::put('/transactions/{id}', [AdminInventoryTransactionsController::class, 'update'])->name('transactions.update');
        Route::delete('/transactions/{id}', [AdminInventoryTransactionsController::class, 'destroy'])->name('transactions.destroy');

        // ---------------------------Settings---------------------------
        Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [AdminSettingController::class, 'store'])->name('settings.store');
        Route::put('/settings/{setting}', [AdminSettingController::class, 'update'])->name('settings.update');
        Route::delete('/settings/{setting}', [AdminSettingController::class, 'destroy'])->name('settings.destroy');

        // ---------------------------Promotions---------------------------
        Route::get('/promotions', [AdminPromotionController::class, 'index'])->name('promotions.index');
        Route::get('/promotions/create', [AdminPromotionController::class, 'create'])->name('promotions.create');
        Route::post('/promotions', [AdminPromotionController::class, 'store'])->name('promotions.store');
        Route::get('/promotions/{id}', [AdminPromotionController::class, 'show'])->name('promotions.show');
        Route::get('/promotions/{id}/edit', [AdminPromotionController::class, 'edit'])->name('promotions.edit');
        Route::put('/promotions/{id}', [AdminPromotionController::class, 'update'])->name('promotions.update');
        Route::delete('/promotions/{id}', [AdminPromotionController::class, 'destroy'])->name('promotions.destroy');

        // ---------------------------Daily Reports---------------------------
        Route::get('/report', [AdminReportController::class, 'index'])->name('report.index');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';



Route::post('/telegram/webhook', [TelegramController::class, 'handle']);
Route::get('/telegram/send-message/{message}', [TelegramController::class, 'sendMessage']);
