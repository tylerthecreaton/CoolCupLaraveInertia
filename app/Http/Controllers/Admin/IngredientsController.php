<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\ProductIngredientUsage;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IngredientsController extends Controller
{
    public function index()
    {
        $ingredientsPaginate = Ingredient::with('unit')->paginate(10);
        return Inertia::render("Admin/ingredients/index", compact("ingredientsPaginate"));
    }
    public function create()
    {
        $units = Unit::all();
        return Inertia::render("Admin/ingredients/Create", compact('units'));
    }
    public function store(Request $request)
    {
        $rules = [
            "name" => "required|min:3|max:255|unique:ingredients",
            "quantity" => "required|numeric",
            "unit_id" => "required|exists:units,id",
            "image" => "nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048",
            'is_sweetness' => 'required|boolean',
            'expiration_date' => 'nullable|date',
        ];
        $message = [
            "name.required" => "กรุณากรอกชื่อ",
            "name.min" => "ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
            "name.max" => "ชื่อต้องมีความยาวไม่เกิน 255 ตัวอักษร",
            "name.unique" => "มีชื่อวัตถุดิบนี้อยู่แล้ว",
            "quantity.required" => "กรุณากรอกจํานวน",
            "quantity.numeric" => "กรุณากรอกจํานวนให้ถูกต้อง",
            "unit_id.required" => "กรุณาเลือกหน่วยวัด",
            "unit_id.exists" => "หน่วยวัดที่เลือกไม่ถูกต้อง",
            "image.image" => "กรุณาอัปโหลดรูปภาพให้ถูกต้อง",
            "image.mimes" => "กรุณาอัปโหลดรูปภาพให้ถูกต้อง",
            "image.max" => "กรุณาอัปโหลดรูปภาพให้ถูกต้อง",
            'is_sweetness.required' => 'กรุณาเลือกรูปแบบวัตถุดิบ',
            'is_sweetness.boolean' => 'กรุณาเลือกรูปแบบวัตถุดิบให้ถูกต้อง',
            'expiration_date.date' => 'รูปแบบวันที่ไม่ถูกต้อง',
        ];

        $request->validate($rules, $message);
        $imageName = "";

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/images/ingredients/');
            $image->move($destinationPath, $name);
            $imageName = $name;
        }
        $ingredient = new Ingredient([
            'name' => $request->name,
            'quantity' => $request->quantity,
            'unit_id' => $request->unit_id,
            'is_sweetness' => $request->is_sweetness,
            'image' => $imageName == '' ? '' : $imageName,
            'expiration_date' => $request->expiration_date,
        ]);

        $ingredient->save();


        return redirect()->route('admin.ingredients.index')->with('success', '');
    }
    public function show($id)
    {
        //
    }
    public function edit($id)
    {
        $ingredient = Ingredient::with('unit')->find($id);
        $units = Unit::all();
        return Inertia::render('Admin/ingredients/Edit', compact('ingredient', 'units'));
    }
    public function update(Request $request, String $id)
    {
        $rules = [
            'name' => 'required|min:3|max:255|unique:ingredients,name,' . $id,
            'quantity' => 'required|numeric',
            'unit_id' => 'required|exists:units,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_sweetness' => 'required|boolean',
            'expiration_date' => 'nullable|date',
        ];

        $message = [
            'name.required' => 'กรุณากรอกชื่อ',
            'name.min' => 'ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร',
            'name.max' => 'ชื่อต้องมีความยาวไม่เกิน 255 ตัวอักษร',
            'name.unique' => 'มีชื่อวัตถุดิบนี้อยู่แล้ว',
            'quantity.required' => 'กรุณากรอกจํานวน',
            'quantity.numeric' => 'กรุณากรอกจํานวนให้ถูกต้อง',
            'unit_id.required' => 'กรุณาเลือกหน่วยวัด',
            'unit_id.exists' => 'หน่วยวัดที่เลือกไม่ถูกต้อง',
            'image.image' => 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง',
            'image.mimes' => 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง',
            'image.max' => 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง',
            'is_sweetness.required' => 'กรุณาเลือกรูปแบบวัตถุดิบ',
            'is_sweetness.boolean' => 'กรุณาเลือกรูปแบบวัตถุดิบให้ถูกต้อง',
            'expiration_date.date' => 'รูปแบบวันที่ไม่ถูกต้อง',
        ];

        $request->validate($rules, $message);

        $ingredient = Ingredient::find($id);

        $imageName = $ingredient->image;
        if ($request->hasFile('image')) {
            try {
                unlink(filename: public_path('/images/ingredients/' . $imageName));
            } catch (\Throwable $th) {
            }
            $image = $request->file('image');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/images/ingredients/');
            $image->move($destinationPath, $name);
            $imageName = $name;
        }

        $ingredient->name = $request->name;
        $ingredient->image = $imageName;
        $ingredient->quantity = $request->quantity;
        $ingredient->unit_id = $request->unit_id;
        $ingredient->is_sweetness = $request->is_sweetness;
        $ingredient->expiration_date = $request->expiration_date;
        $ingredient->save();
        return redirect()->route('admin.ingredients.index')->with('success', '');
    }
    public function destroy($id)
    {
        $ingredient = Ingredient::find($id);
        $ingredient->delete();
        return redirect()->route('admin.ingredients.index')->with('success', '');
    }

    public function increaseQuantity(Request $request, Ingredient $ingredient)
    {
        $request->validate([
            'quantity' => 'required|numeric|min:0.01',
        ]);

        DB::transaction(function () use ($request, $ingredient) {
            // บันทึกการเพิ่มวัตถุดิบ
            $usage = new ProductIngredientUsage();
            $usage->ingredient_id = $ingredient->id;
            $usage->amount = $request->quantity;
            $usage->usage_type = 'ADD';
            $usage->created_by = Auth::user()->id;
            $usage->note = "เพิ่มจำนวนวัตถุดิบจากการแจ้งเตือน";
            $usage->save();

            // อัพเดทจำนวนวัตถุดิบ
            $ingredient->quantity += $request->quantity;
            $ingredient->save();
        });

        return redirect()->back()->with('success', 'เพิ่มจำนวนวัตถุดิบสำเร็จ');
    }
}
