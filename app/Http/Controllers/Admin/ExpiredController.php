<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\IngredientLot;
use App\Models\IngredientLotDetail;
use App\Models\ProductIngredientUsage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExpiredController extends Controller
{
    public function index()
    {

        $expiryDate = now();

        $expiredLots = IngredientLot::with(['details.ingredient.unit', 'user'])
            ->whereHas('details', function ($query) use ($expiryDate) {
                $query->where('expiration_date', '<=', $expiryDate);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/ingredients/lots/Expired', [
            'expired_lots' => $expiredLots
        ]);
    }

    public function dispose(Request $request, $id)
    {
        $ingredientLotDetail = IngredientLotDetail::findOrFail($id);


        // dd($ingredientLotDetail->ingredient);
        try {
            DB::beginTransaction();



            // Log the disposal
            Log::info('Disposing expired ingredient lot', [
                'lot_id' => $ingredientLotDetail->id,
                'ingredient_name' => $ingredientLotDetail->ingredient->name,
                'quantity' => $ingredientLotDetail->quantity,
                'expiration_date' => $ingredientLotDetail->expiration_date,
                'user_id' => auth()->id()
            ]);

            $ingredient = Ingredient::findOrFail($ingredientLotDetail->ingredient_id);
            $ingredient->quantity -= $ingredientLotDetail->quantity * $ingredientLotDetail->transformer->multiplier;
            $ingredient->save();


            $productIngredientUsage = new ProductIngredientUsage();
            $productIngredientUsage->ingredient_id = $ingredient->id;
            $productIngredientUsage->amount = $ingredientLotDetail->quantity * $ingredientLotDetail->transformer->multiplier;
            $productIngredientUsage->usage_type = 'DISPOSE';
            $productIngredientUsage->created_by = auth()->id();
            $productIngredientUsage->note = "จำหน่ายวัตถุดิบหมดอายุ (" . $ingredient->name . ") จาก Lot วัตถุดิบที่ " . $ingredientLotDetail->id;
            $productIngredientUsage->save();
            $ingredientLotDetail->delete();

            DB::commit();
            return redirect()->back()->with('success', 'วัตถุดิบถูกจำหน่ายออกเรียบร้อยแล้ว');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error disposing expired ingredient: ' . $e->getMessage());
            return redirect()->back()->with('error', 'เกิดข้อผิดพลาดในการจำหน่ายวัตถุดิบ');
        }
    }
}
