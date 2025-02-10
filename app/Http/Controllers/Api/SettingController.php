<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{

    public function index()
    {
        $settings = Setting::all();
        return response()->json($settings);
    }
}
