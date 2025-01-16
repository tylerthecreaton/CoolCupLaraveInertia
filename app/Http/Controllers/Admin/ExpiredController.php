<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IngredientLot;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExpiredController extends Controller
{
    public function index()
    {
        try {
            $expiredIngredients = IngredientLot::with(['ingredient', 'user'])
                ->whereDate('expiration_date', '<', Carbon::now())
                ->orderBy('expiration_date', 'asc')
                ->get();

            return Inertia::render('Admin/ingredientLot/Expired', [
                'expired_ingredients' => $expiredIngredients
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching expired ingredients: ' . $e->getMessage());
            return redirect()->back()->with('error', 'เกิดข้อผิดพลาดในการดึงข้อมูลวัตถุดิบที่หมดอายุ');
        }
    }

    public function dispose(IngredientLot $ingredientLot)
    {
        try {
            DB::beginTransaction();

            // Log the disposal
            Log::info('Disposing expired ingredient lot', [
                'lot_id' => $ingredientLot->id,
                'ingredient_name' => $ingredientLot->ingredient->name,
                'quantity' => $ingredientLot->quantity,
                'expiration_date' => $ingredientLot->expiration_date,
                'user_id' => auth()->id()
            ]);

            // update ingredient quantity
            $ingredient = $ingredientLot->ingredient;
            $ingredient->quantity -= $ingredientLot->quantity;
            $ingredient->save();

            // Delete the expired ingredient lot
            $ingredientLot->delete();

            DB::commit();
            return redirect()->back()->with('success', 'วัตถุดิบถูกจำหน่ายออกเรียบร้อยแล้ว');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error disposing expired ingredient: ' . $e->getMessage());
            return redirect()->back()->with('error', 'เกิดข้อผิดพลาดในการจำหน่ายวัตถุดิบ');
        }
    }
}
