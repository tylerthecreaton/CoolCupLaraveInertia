<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\PhoneValidationController;

Route::get('/customer/loyalty-point', [CustomerController::class, 'getLoyaltyPoint']);
Route::get('/admin/member/{phoneNumber}', [CustomerController::class, 'memberWherePhoneNumber'])->name('api.admin.member.memberWherePhoneNumber');
Route::post('/receipts/store', [ReceiptController::class, 'store']);
Route::get('/promotions', [PromotionController::class, 'promotions'])->name('api.promotions');
Route::get('/get-last-order-number', [ReceiptController::class, 'getLastOrderNumber'])->name('api.order.lastNumber');

// Notification
Route::get('/admin/notifications', [NotificationController::class, 'index'])->name('api.admin.notifications');

# Settings
Route::get('/settings', [SettingController::class, 'settings'])->name('api.settings');
Route::group(['middleware' => ['role:admin']], function () {
    Route::post('/settings', [SettingController::class, 'store'])->name('api.settings.store');
    Route::put('/settings/{setting}', [SettingController::class, 'update'])->name('api.settings.update');
    Route::delete('/settings/{setting}', [SettingController::class, 'destroy'])->name('api.settings.destroy');
});

Route::post('/check-phone', [PhoneValidationController::class, 'checkPhone']);
