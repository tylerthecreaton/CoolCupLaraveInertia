<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CustomerController;

Route::get('/customer/loyalty-point', [CustomerController::class, 'getLoyaltyPoint']);
Route::get('/admin/member/{phoneNumber}', [CustomerController::class, 'memberWherePhoneNumber'])->name('api.admin.member.memberWherePhoneNumber');
