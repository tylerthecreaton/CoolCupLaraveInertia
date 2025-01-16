<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\IngredientLot;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class IngredientLotController extends Controller
{
    public function index()
    {
        $lots = IngredientLot::with(['ingredient.unit', 'user'])
            ->select('created_at', DB::raw('COUNT(*) as total_items'))
            ->groupBy('created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/ingredientLot/index', [
            'lots' => $lots
        ]);
    }

    public function getLotDetails($date)
    {
        $lots = IngredientLot::with(['ingredient.unit', 'user'])
            ->whereDate('created_at', $date)
            ->get();

        return response()->json($lots);
    }

    public function create()
    {
        $ingredients = Ingredient::with('unit')->get();
        return Inertia::render('Admin/ingredientLot/create', [
            'ingredients' => $ingredients,
        ]);
    }

    public function store(Request $request)
    {
        // Validate each item in the array
        $validator = Validator::make($request->all(), [
            '*.ingredient_id' => 'required|exists:ingredients,id',
            '*.quantity' => 'required|numeric|min:0',
            '*.expire_date' => 'required|date|after:today',
            '*.notes' => 'nullable|string|max:255',
        ], [
            '*.ingredient_id.required' => 'กรุณาเลือกวัตถุดิบ',
            '*.ingredient_id.exists' => 'วัตถุดิบที่เลือกไม่มีในระบบ',
            '*.quantity.required' => 'กรุณาระบุจำนวน',
            '*.quantity.numeric' => 'จำนวนต้องเป็นตัวเลข',
            '*.quantity.min' => 'จำนวนต้องมากกว่า 0',
            '*.expire_date.required' => 'กรุณาระบุวันหมดอายุ',
            '*.expire_date.date' => 'รูปแบบวันที่ไม่ถูกต้อง',
            '*.expire_date.after' => 'วันหมดอายุต้องเป็นวันในอนาคต',
            '*.notes.max' => 'หมายเหตุต้องไม่เกิน 255 ตัวอักษร',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator->errors());
        }

        try {
            DB::beginTransaction();

            // Create ingredient lots
            foreach ($request->all() as $item) {
                IngredientLot::create([
                    'ingredient_id' => $item['ingredient_id'],
                    'quantity' => $item['quantity'],
                    'expiration_date' => $item['expire_date'],
                    'notes' => $item['notes'] ?? null,
                    'user_id' => Auth::id(),
                ]);

                // Update ingredient quantity
                $ingredient = Ingredient::find($item['ingredient_id']);
                $ingredient->quantity += $item['quantity'];
                $ingredient->save();
            }

            DB::commit();
            return redirect()->route('admin.ingredient-lots.index')->with('success', 'บันทึกข้อมูล Lot วัตถุดิบเรียบร้อยแล้ว');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' . $e->getMessage());
        }
    }

    public function revert($id)
    {
        try {
            DB::beginTransaction();

            $lot = IngredientLot::findOrFail($id);

            // Subtract the quantity from the ingredient
            $ingredient = $lot->ingredient;
            if ($ingredient->quantity < $lot->quantity) {
                throw new \Exception('ไม่สามารถคืนค่าได้เนื่องจากจำนวนวัตถุดิบคงเหลือไม่เพียงพอ');
            }

            $ingredient->quantity -= $lot->quantity;
            $ingredient->save();

            // Delete the lot
            $lot->delete();

            DB::commit();
            return redirect()->back()->with('success', 'คืนค่า Lot วัตถุดิบเรียบร้อยแล้ว');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
