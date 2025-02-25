<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{


    public function index()
    {
        $currentDate = now();
        $promotions = Promotion::orderBy('id', 'desc')
            ->get()
            ->map(function ($promotion) use ($currentDate) {
                $startDate = \Carbon\Carbon::parse($promotion->start_date);
                $endDate = \Carbon\Carbon::parse($promotion->end_date);

                if (!$promotion->is_active) {
                    $promotion->status = 'inactive';
                } else if ($currentDate->gt($endDate)) {
                    $promotion->status = 'expired';
                } else if ($currentDate->lt($startDate)) {
                    $promotion->status = 'inactive';
                } else {
                    $promotion->status = 'active';
                }

                return $promotion;
            });

        return Inertia::render('Admin/promotions/index', compact('promotions'));
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Admin/promotions/create', compact('categories'));
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|min:3|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'description' => 'required|string',
            'type' => 'required|in:PERCENTAGE,FIXED,BUY_X_GET_Y,CATEGORY_DISCOUNT',
            'percentage' => 'required_if:type,PERCENTAGE|nullable|numeric|min:0|max:100',
            'fixed' => 'required_if:type,FIXED|nullable|numeric|min:0',
            'buyXGetY.buy' => 'required_if:type,BUY_X_GET_Y|integer|nullable',
            'buyXGetY.get' => 'required_if:type,BUY_X_GET_Y|integer|nullable',
            'category.category_id' => 'required_if:type,CATEGORY_DISCOUNT|nullable|exists:categories,id',
            'category.discount_type' => 'required_if:type,CATEGORY_DISCOUNT|nullable|in:PERCENTAGE,FIXED',
            'category.discount_value' => 'required_if:type,CATEGORY_DISCOUNT|nullable|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ];

        $messages = [

            'category.category_id.exists' => 'ไม่พบหมวดหมู่ที่เลือก',
            'category.discount_type.in' => 'ประเภทส่วนลดต้องเป็น PERCENTAGE หรือ FIXED เท่านั้น',
            'category.discount_value.numeric' => 'ส่วนลดต้องเป็นตัวเลข',
            'category.discount_value.min' => 'ส่วนลดต้องมีค่าอย่างน้อย 0',
            'image.image' => 'ไฟล์ที่อัปโหลดต้องเป็นรูปภาพ',
            'image.mimes' => 'ไฟล์ที่อัปโหลดต้องเป็นรูปภาพ JPEG, PNG, JPG, GIF หรือ SVG',
            'image.required' => 'กรุณาอัปโหลดรูปภาพ',
            'image.max' => 'ไฟล์ที่อัปโหลดต้องมีขนาดไม่เกิน 5MB',
            'name.required' => 'กรุณากรอกชื่อโปรโมชั่น',
            'name.min' => 'ชื่อโปรโมชั่นต้องไม่น้อยกว่า 3 ตัวอักษร',
            'name.max' => 'ชื่อโปรโมชั่นต้องไม่เกิน 255 ตัวอักษร',
            'description.required' => 'กรุณากรอกรายละเอียดโปรโมชั่น',
            'type.required' => 'กรุณาเลือกประเภทโปรโมชั่น',
            'type.in' => 'ประเภทโปรโมชั่นไม่ถูกต้อง',
            'percentage.min' => 'ส่วนลดต้องมีค่าอย่างน้อย 0',
            'percentage.max' => 'ส่วนลดต้องมีค่าอย่างมาก 100',
            'fixed.min' => 'ส่วนลดต้องมีค่าอย่างน้อย 0',
            'buyXGetY.buy.integer' => 'จำนวนที่ต้องการต้องเป็นตัวเลขเต็ม',
            'buyXGetY.get.integer' => 'จำนวนที่ได้รับต้องเป็นตัวเลขเต็ม',
            'start_date.required' => 'กรุณาเลือกวันที่เริ่มโปรโมชั่น',
            'start_date.date' => 'วันที่เริ่มโปรโมชั่นต้องเป็นวันที่',
            'end_date.required' => 'กรุณาเลือกวันที่สิ้นสุดโปรโมชั่น',
            'end_date.date' => 'วันที่สิ้นสุดโปรโมชั่นต้องเป็นวันที่',
            'end_date.after_or_equal' => 'วันที่สิ้นสุดโปรโมชั่นต้องเป็นวันที่หลังจากวันที่เริ่มโปรโมชั่น',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif,svg|max:5120';
        }

        $validated = $request->validate($rules, $messages);
        $imageName = "/images/defaults/default-promotion.jpg";
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/images/promotions/');
            $image->move($destinationPath, $name);
            $validated['image'] = $name;
            $imageName = "/images/promotions/" . $name;
        }

        $promotion = new Promotion();
        $promotion->name = $validated['name'];
        $promotion->description = $validated['description'];
        $promotion->type = $validated['type'];
        $promotion->start_date = $validated['start_date'];
        $promotion->end_date = $validated['end_date'];

        if ($request->hasFile('image')) {
            $promotion->image = $imageName;
        }

        switch ($validated['type']) {
            case 'PERCENTAGE':
                $promotion->percentage = $validated['percentage'];
                $promotion->buy_x_get_y = json_encode([]);
                $promotion->category = json_encode([]);
                break;
            case 'FIXED':
                $promotion->fixed = $validated['fixed'];
                $promotion->buy_x_get_y = json_encode([]);
                $promotion->category = json_encode([]);
                break;
            case 'BUY_X_GET_Y':
                $promotion->buy_x_get_y = $validated['buyXGetY'];
                $promotion->category = json_encode([]);
                break;
            case 'CATEGORY_DISCOUNT':
                $promotion->category = $validated['category'];
                $promotion->buy_x_get_y = json_encode([]);
                break;
        }

        $promotion->save();

        return redirect()->route('admin.promotions.index')
            ->with('message', 'โปรโมชั่นถูกสร้างเรียบร้อยแล้ว');
    }

    public function edit(Promotion $promotion)
    {
        $categories = Category::all();
        return Inertia::render('Admin/promotions/edit', [
            'promotion' => $promotion,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Promotion $promotion)
    {
        $rules = [
            'name' => 'required|string|min:3|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'description' => 'required|string',
            'type' => 'required|in:PERCENTAGE,FIXED,BUY_X_GET_Y,CATEGORY_DISCOUNT',
            'percentage' => 'required_if:type,PERCENTAGE|nullable|numeric|min:0|max:100',
            'fixed' => 'required_if:type,FIXED|nullable|numeric|min:0',
            'buyXGetY.buy' => 'required_if:type,BUY_X_GET_Y|integer|nullable',
            'buyXGetY.get' => 'required_if:type,BUY_X_GET_Y|integer|nullable',
            'category.category_id' => 'required_if:type,CATEGORY_DISCOUNT|nullable|exists:categories,id',
            'category.discount_type' => 'required_if:type,CATEGORY_DISCOUNT|nullable|in:PERCENTAGE,FIXED',
            'category.discount_value' => 'required_if:type,CATEGORY_DISCOUNT|nullable|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ];

        $messages = [
            'category.category_id.exists' => 'ไม่พบหมวดหมู่ที่เลือก',
            'category.discount_type.in' => 'ประเภทส่วนลดต้องเป็น PERCENTAGE หรือ FIXED เท่านั้น',
            'category.discount_value.numeric' => 'ส่วนลดต้องเป็นตัวเลข',
            'category.discount_value.min' => 'ส่วนลดต้องมีค่าอย่างน้อย 0',
            'name.required' => 'กรุณากรอกชื่อโปรโมชั่น',
            'name.min' => 'ชื่อโปรโมชั่นต้องไม่น้อยกว่า 3 ตัวอักษร',
            'name.max' => 'ชื่อโปรโมชั่นต้องไม่เกิน 255 ตัวอักษร',
            'description.required' => 'กรุณากรอกรายละเอียดโปรโมชั่น',
            'type.required' => 'กรุณาเลือกประเภทโปรโมชั่น',
            'type.in' => 'ประเภทโปรโมชั่นไม่ถูกต้อง',
            'start_date.required' => 'กรุณาเลือกวันที่เริ่มโปรโมชั่น',
            'start_date.date' => 'วันที่เริ่มโปรโมชั่นต้องเป็นวันที่',
            'end_date.required' => 'กรุณาเลือกวันที่สิ้นสุดโปรโมชั่น',
            'end_date.date' => 'วันที่สิ้นสุดโปรโมชั่นต้องเป็นวันที่',
            'end_date.after_or_equal' => 'วันที่สิ้นสุดโปรโมชั่นต้องมีวันที่มากกว่าหรือเท่ากับวันที่เริ่มโปรโมชั่น',
        ];

        $validated = $request->validate($rules, $messages);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/images/promotions/');
            $image->move($destinationPath, $name);
            $promotion->image = "/images/promotions/" . $name;
        }

        $promotion->name = $validated['name'];
        $promotion->description = $validated['description'];
        $promotion->type = $validated['type'];
        $promotion->start_date = $validated['start_date'];
        $promotion->end_date = $validated['end_date'];

        // Reset all discount fields with default values
        $promotion->percentage = 0;
        $promotion->fixed = 0;
        $promotion->buy_x_get_y = json_encode([]);
        $promotion->category = json_encode([]);

        switch ($validated['type']) {
            case 'PERCENTAGE':
                $promotion->percentage = $validated['percentage'];
                break;
            case 'FIXED':
                $promotion->fixed = $validated['fixed'];
                break;
            case 'BUY_X_GET_Y':
                $promotion->buy_x_get_y = $validated['buyXGetY'];
                break;
            case 'CATEGORY_DISCOUNT':
                $promotion->category = $validated['category'];
                break;
        }

        $promotion->save();

        return redirect()->route('admin.promotions.index')
            ->with('message', 'โปรโมชั่นถูกอัพเดทเรียบร้อยแล้ว');
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();
        return redirect()->route('admin.promotions.index')
            ->with('message', 'โปรโมชั่นถูกลบเรียบร้อยแล้ว');
    }
}
