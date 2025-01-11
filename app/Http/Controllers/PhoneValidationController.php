<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PhoneValidationController extends Controller
{
    public function checkPhone(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string|size:10'
        ]);

        $exists = Customer::where('phone_number', $request->phone_number)->exists();

        return back()->with([
            'phoneCheck' => [
                'exists' => $exists,
                'phone' => $request->phone_number
            ]
        ]);
    }
}
