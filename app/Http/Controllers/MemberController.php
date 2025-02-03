<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class MemberController extends Controller
{
    public function index()
    {
        if (request()->has('id')) {
            $customer = Customer::findOrFail(request()->id);
            return Inertia::render('Member', ['customer' => $customer]);
        }
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

    public function register()
    {
        return Inertia::render('RegisterMember');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|size:10',
            'birthdate' => 'required|date',
        ]);

        $data = $request->all();
        $data['birthdate'] = Carbon::parse($request->birthdate)->format('Y-m-d');

        $customer = Customer::create($data);
        return redirect()->route('member.index', ['id' => $customer->id])->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }

    public function edit($id)
    {
        $customer = Customer::findOrFail($id);
        return Inertia::render('EditMember', ['customer' => $customer]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|size:10',
            'birthdate' => 'required|date',
        ]);

        $customer = Customer::findOrFail($id);

        $customer->update($request->all());
        return redirect()->route('member.index')->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();
        return redirect()->route('member.index')->with('success', 'ลบข้อมูลเรียบร้อย');
    }


    public function checkPhoneNumber(Request $request)
    {
        $exists = Customer::where('phone_number', $request->phone_number)->exists();
        return response()->json(['exists' => $exists]);
    }
}
