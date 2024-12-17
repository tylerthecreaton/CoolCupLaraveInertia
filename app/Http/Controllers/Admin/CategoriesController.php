<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriesController extends Controller
{

    public function index()
    {
        $categoriesPaginate = Category::paginate(10);
        return Inertia::render('Admin/categories/index', compact('categoriesPaginate'));
    }

    public function create()
    {
        return Inertia::render('Admin/categories/Create');
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|unique:categories|max:255',
            'image' => 'required',
            'description' => 'required',
        ];
        $message = [
            'name.required' => 'กรุณากรอกชื่อหมวดหมู่',
            'name.unique' => 'ชื่อหมวดหมู่นี้ถูกใช้ไปแล้ว',
            'name.max' => 'ชื่อหมวดหมู่ต้องไม่เกิน 255 ตัวอักษร',
            'image.required' => 'กรุณาอัปโหลดรูปภาพ',
            'description.required' => 'กรุณากรอกรายละเอียด',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif,svg|max:2048';
            $message['image.image'] = 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง';
            $message['image.mimes'] = 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง';
            $message['image.max'] = 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง';
        }

        $request->validate($rules, $message);
        $imageName = "";

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/images/categories/');
            $image->move($destinationPath, $name);
            $imageName = $name;
        }
        $category = new Category([
            'name' => $request->name,
            'image' => $imageName == '' ? '' : $imageName,
            'description' => $request->description,

        ]);

        $category->save();

        return redirect()->route('admin.categories.index')->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }

    public function edit(string $id)
    {
        $category = Category::find($id);
        return Inertia::render('Admin/categories/Edit', compact('category'));
    }

    public function update(Request $request, string $id)
    {
        $rules = [
            'name' => 'required|min:3|max:255|unique:categories,name,' . $id,

            'description' => 'required',
        ];

        $message = [
            'name.required' => 'กรุณากรอกชื่อหมวดหมู่',
            'name.unique' => 'ชื่อหมวดหมู่นี้ถูกใช้ไปแล้ว',
            'description.required' => 'กรุณากรอกรายละเอียด',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif,svg|max:2048';
            $message['image.image'] = 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง';
            $message['image.mimes'] = 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง';
            $message['image.max'] = 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง';
        }

        $request->validate($rules, $message);



        $category = Category::find($id);

        $imageName = $category->image;
        if ($request->hasFile('image')) {
            try {
                unlink(filename: public_path('/images/categories/' . $imageName));
            } catch (\Throwable $th) {
            }
            $image = $request->file('image');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/images/categories/');
            $image->move($destinationPath, $name);
            $imageName = $name;
        }

        $category->name = $request->name;
        $category->image = $request->image;
        $category->description = $request->description;
        $category->image = $imageName;

        $category->save();

        return redirect()->route('admin.categories.index')->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }

    public function destroy(string $id)
    {
        $category = Category::find($id);
        $category->delete();
        return redirect()->route('admin.categories.index')->with('success', 'ลบข้อมูลเรียบร้อย');
    }
}
