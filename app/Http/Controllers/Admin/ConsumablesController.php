<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Consumable;
use App\Models\Unit;

class ConsumablesController extends Controller
{

    public function index()
    {
        $consumables = Consumable::with('unit')->orderBy('created_at')->paginate(10);
        return Inertia::render('Admin/consumables/index', compact('consumables'));
    }

    public function create()
    {
        $units = Unit::where('type', 'consumable')->get();
        return Inertia::render('Admin/consumables/create', compact('units'));
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => ['required', 'string', 'max:255','min:3'],
            'unit_id' => ['required', 'exists:units,id,type,consumable'],
            'quantity' => ['required', 'numeric'],
            'is_depend_on_sale' => ['required', 'boolean'],
        ];

        $message = [
            'name.required' => 'กรุณากรอกชื่อวัตถุดิบสิ้นเปลือง',
            'name.string' => 'กรุณากรอกชื่อวัตถุดิบสิ้นเปลืองให้ถูกต้อง',
            'name.max' => 'กรุณากรอกชื่อวัตถุดิบสิ้นเปลืองไม่เกิน 255 ตัวอักษร',
            'name.min' => 'กรุณากรอกชื่อวัตถุดิบสิ้นเปลืองไม่น้อยกว่า 3 ตัวอักษร',
            'unit_id.required' => 'กรุณาเลือกหน่วยวัด',
            'unit_id.exists' => 'หน่วยวัดไม่ถูกต้อง',
            'unit_id.type' => 'หน่วยวัดไม่ถูกต้อง',
            'quantity.required' => 'กรุณากรอกจำนวน',
            'quantity.numeric' => 'กรุณากรอกจำนวนให้ถูกต้อง',
            'is_depend_on_sale.required' => 'กรุณาเลือกว่าใช่หรือไม่',
            'is_depend_on_sale.boolean' => 'กรุณาเลือกว่าใช่หรือไม่',
        ];

        $request->validate($rules, $message);
        Consumable::create($request->all());
        return redirect()->route('admin.consumables.index')->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }

    public function edit($id)
    {
        $consumable = Consumable::with('unit')->find($id);
        $units = Unit::where('type', 'consumable')->get();
        return Inertia::render('Admin/consumables/edit', compact('consumable', 'units'));
    }

    public function update(Request $request, $id)
    {
        $rules = [
            'name' => ['required', 'string', 'max:255','min:3'],
            'unit_id' => ['required', 'exists:units,id,type,consumable'],
            'quantity' => ['required', 'numeric'],
            'is_depend_on_sale' => ['required', 'boolean'],
        ];

        $message = [
            'name.required' => 'กรุณากรอกชื่อวัตถุดิบสิ้นเปลือง',
            'name.string' => 'กรุณากรอกชื่อวัตถุดิบสิ้นเปลืองให้ถูกต้อง',
            'name.max' => 'กรุณากรอกชื่อวัตถุดิบสิ้นเปลืองไม่เกิน 255 ตัวอักษร',
            'name.min' => 'กรุณากรอกชื่อวัตถุดิบสิ้นเปลืองไม่น้อยกว่า 3 ตัวอักษร',
            'unit_id.required' => 'กรุณาเลือกหน่วยวัด',
            'unit_id.exists' => 'หน่วยวัดไม่ถูกต้อง',
            'unit_id.type' => 'หน่วยวัดไม่ถูกต้อง',
            'quantity.required' => 'กรุณากรอกจำนวน',
            'quantity.numeric' => 'กรุณากรอกจำนวนให้ถูกต้อง',
            'is_depend_on_sale.required' => 'กรุณาเลือกว่าใช่หรือไม่',
            'is_depend_on_sale.boolean' => 'กรุณาเลือกว่าใช่หรือไม่',
        ];

        $request->validate($rules, $message);

        $consumable = Consumable::find($id);
        $consumable->update($request->all());

        return redirect()->route('admin.consumables.index')->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }

    public function destroy($id)
    {
        $consumable = Consumable::find($id);
        $consumable->delete();
        return redirect()->route('admin.consumables.index');
    }
}
