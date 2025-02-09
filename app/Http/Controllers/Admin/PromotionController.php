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
            'name' => 'required|string|max:255',
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

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif,svg|max:2048';
        }

        $validated = $request->validate($rules);
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:PERCENTAGE,FIXED,BUY_X_GET_Y,CATEGORY_DISCOUNT',
            'percentage' => 'required_if:type,PERCENTAGE|nullable|numeric|min:0|max:100',
            'fixed' => 'required_if:type,FIXED|nullable|numeric|min:0',
            'buyXGetY.buy' => 'required_if:type,BUY_X_GET_Y|nullable|integer|min:1',
            'buyXGetY.get' => 'required_if:type,BUY_X_GET_Y|nullable|integer|min:1',
            'category.category_id' => 'required_if:type,CATEGORY_DISCOUNT|nullable|exists:categories,id',
            'category.discount_type' => 'required_if:type,CATEGORY_DISCOUNT|nullable|in:PERCENTAGE,FIXED',
            'category.discount_value' => 'required_if:type,CATEGORY_DISCOUNT|nullable|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $promotion->name = $validated['name'];
        $promotion->description = $validated['description'];
        $promotion->type = $validated['type'];
        $promotion->start_date = $validated['start_date'];
        $promotion->end_date = $validated['end_date'];

        // Reset all discount fields
        $promotion->percentage = null;
        $promotion->fixed = null;
        $promotion->buy_x_get_y = null;
        $promotion->category = null;

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
