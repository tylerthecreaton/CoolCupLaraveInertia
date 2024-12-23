<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CustomerController;

Route::get('/customer/loyalty-point', [CustomerController::class, 'getLoyaltyPoint']);
