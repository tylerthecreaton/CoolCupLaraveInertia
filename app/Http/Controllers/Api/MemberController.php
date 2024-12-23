<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    // public function getLoyaltyPoint(Request $request)
    // {
    //     $customer = Customer::where('phone_number', $request->phone_number)->first();

    //     if (!$customer) {
    //         return response()->json(null, 404);
    //     }

    //     return response()->json($customer->loyalty_point);
    // }
}
