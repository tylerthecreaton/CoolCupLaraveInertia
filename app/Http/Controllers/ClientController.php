<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function showClientPage()
    {
        return Inertia::render('ClientPage');
    }
}
