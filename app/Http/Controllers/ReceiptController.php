<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Promotions;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{
    function index() {
        return Inertia::render('Reciept');
    }
}