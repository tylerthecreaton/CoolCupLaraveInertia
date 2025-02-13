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
