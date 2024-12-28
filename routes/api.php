<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ReceiptController;

Route::get('/customer/loyalty-point', [CustomerController::class, 'getLoyaltyPoint']);
Route::get('/admin/member/{phoneNumber}', [CustomerController::class, 'memberWherePhoneNumber'])->name('api.admin.member.memberWherePhoneNumber');
Route::post('/receipts/store', [ReceiptController::class, 'store']);

Route::get('/promotions', [PromotionController::class, 'promotions'])->name('api.promotions');
Route::get('/get-last-order-number', [ReceiptController::class, 'getLastOrderNumber'])->name('api.order.lastNumber');
