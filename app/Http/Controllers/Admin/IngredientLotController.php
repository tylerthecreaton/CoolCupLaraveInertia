<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\IngredientLot;
use App\Models\IngredientLotDetail;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class IngredientLotController extends Controller
{
    public function index()
    {
        $lots = IngredientLot::with(['details.ingredient.unit', 'details.transformer', 'user'])
            ->select('ingredient_lots.*')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Transform data for frontend
        $lots->through(function ($lot) {
            return [
                'id' => $lot->id,
                'lot_number' => $lot->lot_number,
                'created_at' => $lot->created_at,
                'notes' => $lot->notes,
                'user' => $lot->user,
                'details' => $lot->details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'lot_number' => $detail->lot_number,
                        'ingredient' => [
                            'id' => $detail->ingredient->id,
                            'name' => $detail->ingredient->name,
                            'unit' => $detail->ingredient->unit ? [
                                'name' => $detail->ingredient->unit->name
                            ] : null
                        ],
                        'transformer' => $detail->transformer ? [
                            'id' => $detail->transformer->id,
                            'name' => $detail->transformer->name,
                            'multiplier' => $detail->transformer->multiplier,
                            'type' => $detail->transformer->type
                        ] : null,
                        'quantity' => $detail->quantity,
                        'price' => $detail->price,
                        'cost_per_unit' => $detail->cost_per_unit,
                        'per_pack' => $detail->per_pack,
                        'supplier' => $detail->supplier,
                        'notes' => $detail->notes,
                        'type' => $detail->type,
                        'expiration_date' => $detail->expiration_date
                    ];
                })
            ];
        });

        return Inertia::render('Admin/ingredients/lots/index', [
            'lots' => $lots
        ]);
    }

    public function create()
    {
        $ingredients = Ingredient::with(['unit', 'transformers'])
            ->select(['id', 'name', 'unit_id'])
            ->whereHas('transformers')
            ->get();
        return Inertia::render('Admin/ingredients/lots/create', [
            'ingredients' => $ingredients
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            '*.ingredient_id' => 'required|exists:ingredients,id',
            '*.transformer_id' => 'required|exists:transformers,id',
            '*.cost_per_unit' => 'required|numeric|min:0',
            '*.quantity' => 'required|numeric|min:0',
            '*.per_pack' => 'required|numeric|min:0',
            '*.price' => 'required|numeric|min:0',
            '*.supplier' => 'required|string',
            '*.expiration_date' => 'required|date',
            '*.notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            // สร้าง IngredientLot
            $lot = IngredientLot::create([
                'user_id' => Auth::user()->id,
                'lot_number' => $this->generateLotNumber(),
                'notes' => collect($request->all())->pluck('notes')->filter()->join(', ')
            ]);

            Log::info('Created IngredientLot', [
                'lot_id' => $lot->id,
                'lot_number' => $lot->lot_number
            ]);

            // สร้าง IngredientLotDetail สำหรับแต่ละรายการ
            foreach ($request->all() as $lotData) {
                $detail = $lot->details()->create([
                    'ingredient_id' => $lotData['ingredient_id'],
                    'transformer_id' => $lotData['transformer_id'],
                    'lot_number' => $lot->lot_number,
                    'quantity' => $lotData['quantity'],
                    'type' => 'in',
                    'price' => $lotData['price'],
                    'per_pack' => $lotData['per_pack'],
                    'cost_per_unit' => $lotData['cost_per_unit'],
                    'supplier' => $lotData['supplier'],
                    'expiration_date' => $lotData['expiration_date'],
                    'notes' => $lotData['notes'] ?? null,
                ]);

                Log::info('Created IngredientLotDetail', [
                    'detail_id' => $detail->id,
                    'lot_id' => $lot->id,
                    'ingredient_id' => $lotData['ingredient_id']
                ]);

                // // อัพเดทจำนวน Ingredient
                // $ingredient = Ingredient::find($lotData['ingredient_id']);
                // $oldQuantity = $ingredient->quantity;
                // $newQuantity = $lotData['quantity'] * $lotData['per_pack'];
                // $ingredient->increment('quantity', $newQuantity);

                // Log::info('Updating Ingredient quantity', [
                //     'ingredient_id' => $lotData['ingredient_id'],
                //     'old_quantity' => $oldQuantity,
                //     'added_quantity' => $newQuantity,
                //     'new_quantity' => $ingredient->fresh()->quantity
                // ]);
            }

            $this->updateExpenses([$lot]);
        });

        return redirect()->route('admin.ingredient-lots.index')
            ->with('success', 'บันทึกข้อมูล Lot สำเร็จ');
    }

    private function generateLotNumber()
    {
        $latestLot = IngredientLot::latest()->first();
        return $latestLot ? $latestLot->lot_number + 1 : 1;
    }

    private function updateExpenses($lots)
    {
        if (empty($lots)) {
            return;
        }

        $descriptions = collect($lots)->flatMap(function ($lot) {
            return $lot->details->map(function ($detail) {
                return sprintf(
                    " %s: %d %s (ราคารวม %s บาท) จาก %s",
                    $detail->ingredient->name,
                    $detail->quantity * $detail->per_pack,
                    $detail->ingredient->unit ? $detail->ingredient->unit->name : 'ไม่มีหน่วย',
                    number_format($detail->price, 2),
                    $detail->supplier
                );
            });
        })->join("\n");

        $totalAmount = collect($lots)->sum(function ($lot) {
            return $lot->details->sum('price');
        });

        $category = ExpenseCategory::firstOrCreate(
            ['name' => 'วัตถุดิบ'],
            ['description' => 'รายจ่ายจากการซื้อวัตถุดิบ']
        );

        Expense::create([
            'name' => sprintf('ซื้อวัตถุดิบ (%d รายการ)',
                collect($lots)->sum(function ($lot) {
                    return $lot->details->count();
                })
            ),
            'amount' => $totalAmount,
            'description' => $descriptions,
            'expense_category_id' => $category->id,
            'user_id' => Auth::user()->id,
            'source_type' => 'ingredient_lot',
            'source_date' => now(),
        ]);
    }

    public function destroy($id)
    {
        try {
            DB::transaction(function () use ($id) {
                $lot = IngredientLot::findOrFail($id);

                // ลดจำนวน Ingredient ตาม details ที่จะลบ
                foreach ($lot->details as $detail) {
                    $quantity = $detail->quantity * $detail->per_pack;
                    $detail->ingredient->decrement('quantity', $quantity);

                    Log::info('Decremented ingredient quantity on lot delete', [
                        'ingredient_id' => $detail->ingredient_id,
                        'quantity' => $quantity,
                        'lot_id' => $lot->id
                    ]);
                }

                $lot->delete();
            });

            return response()->json(['message' => 'ลบ Lot เรียบร้อยแล้ว']);
        } catch (\Exception $e) {
            Log::error('Error deleting lot: ' . $e->getMessage());
            return response()->json(['error' => 'ไม่สามารถลบ Lot ได้'], 500);
        }
    }

    public function revert($id)
    {
        try {
            DB::transaction(function () use ($id) {
                $lot = IngredientLot::findOrFail($id);

                // คืนค่าจำนวน Ingredient กลับไปยังค่าก่อนหน้า
                foreach ($lot->details as $detail) {
                    $quantity = $detail->quantity * $detail->per_pack;
                    $detail->ingredient->decrement('quantity', $quantity);

                    Log::info('Reverted ingredient quantity', [
                        'ingredient_id' => $detail->ingredient_id,
                        'quantity' => $quantity,
                        'lot_id' => $lot->id
                    ]);
                }

                // ลบ Lot และ details
                $lot->delete();
            });

            return response()->json(['message' => 'คืนค่า Lot เรียบร้อยแล้ว']);
        } catch (\Exception $e) {
            Log::error('Error reverting lot: ' . $e->getMessage());
            return response()->json(['error' => 'ไม่สามารถคืนค่า Lot ได้'], 500);
        }
    }

    public function show($id)
    {
        try {
            $lot = IngredientLot::with(['details.ingredient.unit', 'user'])
                ->findOrFail($id);

            return response()->json($lot);
        } catch (\Exception $e) {
            Log::error('Error showing lot: ' . $e->getMessage());
            return response()->json(['error' => 'ไม่พบข้อมูล Lot'], 404);
        }
    }

    public function expired()
    {
        $expiryDate = now();

        $expiredLots = IngredientLot::with(['details.ingredient.unit'])
            ->whereHas('details', function ($query) use ($expiryDate) {
                $query->where('expiration_date', '<=', $expiryDate);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/ingredients/lots/expired', [
            'expiredLots' => $expiredLots
        ]);
    }
}
