<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Ingredient;
use App\Models\Consumable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductsController extends Controller
{
    public function index()
    {
        $productsPaginate = Product::with([
            'category',
            'ingredients.ingredient.unit',
            'consumables.consumable.unit'
        ])->paginate(10);

        return Inertia::render('Admin/products/index', [
            'productsPaginate' => $productsPaginate
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        $ingredients = Ingredient::with('unit')->get();
        $consumables = Consumable::with('unit')->get();
        return Inertia::render('Admin/products/Create', compact('categories', 'ingredients', 'consumables'));
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
        $product = Product::with(['category', 'ingredients.ingredient.unit', 'consumables.consumable.unit'])->findOrFail($id);
        $categories = Category::all();
        $ingredients = Ingredient::with('unit')->get();
        $consumables = Consumable::with('unit')->get();
        $productIngredients = $product->ingredients()->with('ingredient.unit')->get();
        $productConsumables = $product->consumables()->with('consumable.unit')->get();

        return Inertia::render('Admin/products/Edit', compact(
            'product',
            'categories',
            'ingredients',
            'consumables',
            'productIngredients',
            'productConsumables'
        ));
    }

    public function update(Request $request, string $id)
    {
        $rules = [
            'name' => 'required|min:3|max:255|unique:products,name,' . $id,
            'category_id'=> 'required',
            'description' => 'required',
            'cost_price' => 'required|numeric',
            'sale_price' => 'required|numeric',
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',

        ];

        $message = [
            'name.required' => 'กรุณากรอกชื่อสินค้า',
            'name.unique' => 'ชื่อสินค้านี้ถูกใช้ไปแล้ว',
            'description.required' => 'กรุณากรอกรายละเอียด',
            'category_id'=> 'กรุณาเลือกหมวดหมู่',
            'cost_price'=> 'กรุณากรอกราคาต้นทุน',
            'sale_price'=> 'กรุณากรอกราคาขาย',
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif,svg|max:2048';
            $message['image.image'] = 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง';
            $message['image.mimes'] = 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง';
            $message['image.max'] = 'กรุณาอัปโหลดรูปภาพให้ถูกต้อง';
        }

        $request->validate($rules, $message);



        $product = Product::find($id);

        $imageName = $product->image;
        if ($request->hasFile('image')) {
            try {
                unlink(filename: public_path('/images/products/' . $imageName));
            } catch (\Throwable $th) {
            }
            $image = $request->file('image');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/images/products/');
            $image->move($destinationPath, $name);
            $imageName = $name;
        }

        $product->name = $request->name;
        $product->category_id = $request->category_id;
        $product->description = $request->description;
        $product->cost_price = $request->cost_price;
        $product->sale_price = $request->sale_price;
        $product->image = $imageName;

        $product->save();
        return redirect()->route('admin.products.index')->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'ลบสินค้าเรียบร้อย');
    }

    public function getToppings()
    {
        $toppings = Product::where('category_id', 3)
            ->select('id', 'name', 'sale_price as price')
            ->get();

        return response()->json($toppings);
    }
}
