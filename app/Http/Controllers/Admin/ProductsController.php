<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductsController extends Controller
{
    public function index()
    {
        $productsPaginate = Product::with('category')->paginate(10);
        return Inertia::render('Admin/products/index', compact('productsPaginate'));
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Admin/products/Create', compact('categories'));
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|min:3',
            'image' => 'required',
            'category_id' => 'required',
            'description' => 'required',
            'cost_price' => 'required|numeric',
            'sale_price' => 'required|numeric',
        ];
        $message = [
            'name.required' => 'กรุณากรอกชื่อสินค้า',
            'name.min' => 'ชื่อสินค้าต้องมีความยาวอย่างน้อย :min ตัวอักษร',
            'category_id.required' => 'กรุณาเลือกหมวดหมู่สินค้า',
            'description.required' => 'กรุณากรอกรายละเอียดสินค้า',
            'cost_price.required' => 'กรุณากรอกราคาต้นทุนสินค้า',
            'cost_price.numeric' => 'กรุณากรอกราคาต้นทุนสินค้าเป็นตัวเลข',
            'sale_price.required' => 'กรุณากรอกราคาขายสินค้า',
            'sale_price.numeric' => 'กรุณากรอกราคาขายสินค้าเป็นตัวเลข',
            'image.required' => 'กรุณาอัปโหลดรูปภาพสินค้า',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif,svg|max:2048';
            $message['image.image'] = 'กรุณาอัปโหลดรูปภาพสินค้าให้ถูกต้อง';
            $message['image.mimes'] = 'กรุณาอัปโหลดรูปภาพสินค้าให้ถูกต้อง';
            $message['image.max'] = 'กรุณาอัปโหลดรูปภาพสินค้าให้ถูกต้อง';
        }

        $request->validate($rules, $message);

        $imageName = "";

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/images/products/');
            $image->move($destinationPath, $name);
            $imageName = $name;
        }

        $product = new Product([
            'name' => $request->name,
            'category_id' => $request->category_id,
            'description' => $request->description,
            'cost_price' => $request->cost_price,
            'sale_price' => $request->sale_price,
            'image' => $imageName == "" ? 'https://via.placeholder.com/150' : $imageName
        ]);


        $product->save();

        return redirect()->route('admin.products.index')->with('success', 'เพิ่มสินค้าเรียบร้อย');
    }
    public function edit($id)
    {
        $product = Product::find($id);
        $categories = Category::all();
        return Inertia::render('Admin/products/Edit', compact('product', 'categories'));
    }

    public function update(Request $request, string $id)
    {
        $rules = [
            'name' => 'required',
            'category_id' => 'required',
            'description' => 'required',
            'cost_price' => 'required',
            'sale_price' => 'required',
        ];
        $message = [
            'name.required' => 'กรุณากรอกชื่อสินค้า',
            'category_id.required' => 'กรุณาเลือกหมวดหมู่สินค้า',
            'description.required' => 'กรุณากรอกรายละเอียดสินค้า',
            'cost_price.required' => 'กรุณากรอกราคาต้นทุนสินค้า',
            'sale_price.required' => 'กรุณากรอกราคาขายสินค้า',

        ];
        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif,svg|max:2048';
            $message['image.image'] = 'กรุณาอัปโหลดรูปภาพสินค้าให้ถูกต้อง';
            $message['image.mimes'] = 'กรุณาอัปโหลดรูปภาพสินค้าให้ถูกต้อง';
            $message['image.max'] = 'กรุณาอัปโหลดรูปภาพสินค้าให้ถูกต้อง';
        }
        $request->validate($rules, $message);
        $imageName = "";

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/images/products/');
            $image->move($destinationPath, $name);
            $imageName = $name;
        }
        $product = new Product([
            'name' => $request->name,
            'category_id' => $request->category,
            'image' => $imageName == '' ? '' : $imageName,
            'description' => $request->description,
            'cost_price' => $request->cost_price,
            'sale_price' => $request->sale_price,

        ]);
        $product = Product::find($id);
        $product->name = $request->name;
        $product->category_id = $request->category_id;
        $product->description = $request->description;
        $product->cost_price = $request->cost_price;
        $product->sale_price = $request->sale_price;
        $product->image = $imageName;
        $product->save();
        return redirect()->route('admin.products.index')->with('success', 'แก้ไขสินค้าเรียบร้อย');
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'ลบสินค้าเรียบร้อย');
    }
}
