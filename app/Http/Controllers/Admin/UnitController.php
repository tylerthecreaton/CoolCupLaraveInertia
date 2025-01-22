<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index(){
        $units = Unit::all();
        return response()->json(['units' => $units]);
    }
    public function create(){
        return Inertia::render('admin.unit.create');
    }
    public function store(Request $request){
        $rules = [
            'name' => 'required|unique:units',
            'abbreviation'=> 'nullable|unique:units',
            'type' => 'required|in:ingredient,consumable',
        ];
        $message = [
            'name.required' => 'กรุณากรอกชื่อหน่วย',
            'name.unique' => 'ชื่อหน่วยนี้ถูกใช้ไปแล้ว',
            'abbreviation.unique' => 'คำย่อหน่วยนี้ถูกใช้ไปแล้ว',
            'type.required' => 'กรุณาเลือกประเภทหน่วย',
            'type.in' => 'ประเภทหน่วยไม่ถูกต้อง',
        ];
        $request->validate($rules, $message);
        $unit = new Unit();
        $unit->name = $request->name;
        $unit->abbreviation = $request->abbreviation;
        $unit->type = $request->type;
        $unit->save();

        return redirect()->route('admin.ingredients.index')->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }
    public function show($id){
        //
    }
    public function edit($id){
        $unit = Unit::find($id);
        return Inertia::render('admin.ingredients.index', compact('unit'));
    }
    public function update(Request $request,String $id){
        $unit = Unit::find($id);
        
        $rules = [
            'name' => 'required|unique:units,name,' . $id,
            'abbreviation'=> 'nullable|unique:units,abbreviation,' . $id,
            'type' => 'required|in:ingredient,consumable',
        ];
        $message = [
            'name.required' => 'กรุณากรอกชื่อหน่วย',
            'name.unique' => 'ชื่อหน่วยนี้ถูกใช้ไปแล้ว',
            'abbreviation.unique' => 'คำย่อหน่วยนี้ถูกใช้ไปแล้ว',
            'type.required' => 'กรุณาเลือกประเภทหน่วย',
            'type.in' => 'ประเภทหน่วยไม่ถูกต้อง',
        ];
        $request->validate($rules, $message);
        
        $unit->name = $request->name;
        $unit->abbreviation = $request->abbreviation;
        $unit->type = $request->type;
        $unit->save();
        
        return redirect()->route('admin.ingredients.index')->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }
    public function destroy($id){
        $unit = Unit::find($id);
        $unit->delete();
        return redirect()->route('admin.ingredients.index')->with('success', 'ลบข้อมูลเรียบร้อย');
    }

}
