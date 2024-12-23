<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customersPaginate = Customer::paginate(10);
        return Inertia::render("Admin/customers/index", compact("customersPaginate"));
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Admin/customers/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            "name" => "required|min:3|max:255",
            "phone_number" => "required|min:10",
            "birthdate" => "required",
        ];
        $message = [
            "name.required" => "กรุณากรอกชื่อ",
            "name.min" => "ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
            "name.max" => "ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
            "phone_number.required" => "กรุณากรอกเบอร์โทร",
            "phone_number" => "เบอร์โทรต้องมี 10 หลัก",
            "birthdate.required" => "กรุณาเลือกวันเกิด",
            "birthdate" => "กรุณาเลือกวันเกิด",
        ];
        $request->validate($rules, $message);

        $customer = new Customer();
        $customer->name = $request->name;
        $customer->phone_number = $request->phone_number;
        $customer->birthdate = $request->birthdate;
        $customer->save();

        return redirect()->route("admin.customers.index")->with("success", "บันทึกข้อมูลเรียบร้อย");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }


    public function memberWherePhoneNumber(String $phone_number)
    {
        $customer = Customer::where('phone_number', $phone_number)->first();
        return $customer;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $customer = Customer::find($id);
        return Inertia::render("Admin/customers/Edit", compact("customer"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $rules = [
            "name" => "required|min:3|max:255",
            "phone_number" => "required|min:10",
            "birthdate" => "required",
        ];
        $message = [
            "name.required" => "กรุณากรอกชื่อ",
            "name.min" => "ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
            "name.max" => "ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
            "phone_number.required" => "กรุณากรอกเบอร์โทร",
            "phone_number" => "เบอร์โทรต้องมี 10 หลัก",
            "birthdate.required" => "กรุณาเลือกวันเกิด",
            "birthdate" => "กรุณาเลือกวันเกิด",
        ];
        $request->validate($rules, $message);

        $customer = Customer::find($id);
        $customer->name = $request->name;
        $customer->phone_number = $request->phone_number;
        $customer->birthdate = $request->birthdate;
        $customer->save();

        return redirect()->route("admin.customers.index")->with("success", "บันทึกข้อมูลเรียบร้อย");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::find($id);
        $customer->delete();
        return redirect()->route("admin.customers.index")->with("success", "ลบข้อมูลเรียบร้อย");
    }

    public function getLoyaltyPoint(Request $request)
    {
        dd($request->phone_number);
        $customer = Customer::where('phone_number', $request->phone_number)->first();

        if (!$customer) {
            return response()->json(null, 404);
        }

        return response()->json($customer->loyalty_point);
    }
}
