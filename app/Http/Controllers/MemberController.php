<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MemberController extends Controller
{
    public function index()
    {
        return Inertia::render('Member');
    }

    public function search(Request $request)
    {
        if ($request->has('phone_number')) {
            $customer = Customer::where('phone_number', $request->phone_number)->first();

            if ($customer) {
                // แปลงวันที่เป็นรูปแบบที่ต้องการ
                $birthdate = $customer->birthdate ? Carbon::parse($customer->birthdate)->format('Y-m-d') : null;
                $created_at = $customer->created_at ? Carbon::parse($customer->created_at)->format('Y-m-d') : null;

                return response()->json([
                    'customer' => [
                        'name' => $customer->name,
                        'birthdate' => $birthdate,
                        'created_at' => $created_at,
                        'phone_number' => $customer->phone_number,
                        'points' => $customer->loyalty_points ?? 0,
                        'status' => $customer->status ?? 'active'
                    ]
                ]);
            }
        }

        return response()->json(['customer' => null]);
    }
}
