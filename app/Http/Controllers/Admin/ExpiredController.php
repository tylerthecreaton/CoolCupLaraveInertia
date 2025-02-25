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
        $now = now();

        // ดึง lots ที่มีอย่างน้อย 1 รายการหมดอายุ
        $expiredLots = IngredientLot::with(['details.ingredient.unit', 'details.transformer', 'user'])
            ->whereHas('details', function ($query) use ($now) {
                $query->where('expiration_date', '<=', $now);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // กรองและแปลงข้อมูล
        $expiredLots->through(function ($lot) use ($now) {
            // กรองเฉพาะรายการที่หมดอายุแล้ว และตั้งค่า collection ใหม่
            $expiredDetails = $lot->details->filter(function ($detail) use ($now) {
                return Carbon::parse($detail->expiration_date)->lte($now);
            })->values();

            // แทนที่ details collection เดิมด้วย collection ที่กรองแล้ว
            $lot->setRelation('details', $expiredDetails);

            // แปลงข้อมูลสำหรับรายการที่หมดอายุ
            $lot->details->transform(function ($detail) use ($now) {
                $expirationDate = Carbon::parse($detail->expiration_date);
                $detail->is_expired = true;
                $detail->days_until_expiry = $now->diffInDays($expirationDate, false);
                $detail->formatted_expiration_date = $expirationDate->format('d/m/Y');
                $detail->expiration_status = 'หมดอายุ';

                // คำนวณจำนวนรวม (quantity * transformer multiplier)
                if ($detail->transformer) {
                    $detail->total_quantity = $detail->quantity * $detail->transformer->multiplier;
                } else {
                    $detail->total_quantity = $detail->quantity * ($detail->per_pack ?? 1);
                }

                return $detail;
            });

            return $lot;
        });

        // กรอง lots ที่ไม่มีรายการหมดอายุออก
        $expiredLots->setCollection(
            $expiredLots->getCollection()->filter(function ($lot) {
                return $lot->details->isNotEmpty();
            })
        );

        return Inertia::render('Admin/ingredients/lots/Expired', [
            'expired_lots' => $expiredLots
        ]);
    }

    public function dispose(Request $request, $id)
    {
        Log::info('Starting disposal process', ['detail_id' => $id]);
        
        $ingredientLotDetail = IngredientLotDetail::findOrFail($id);
        Log::info('Found ingredient lot detail', [
            'detail_id' => $id,
            'ingredient_id' => $ingredientLotDetail->ingredient_id,
            'lot_id' => $ingredientLotDetail->ingredient_lot_id
        ]);

        try {
            DB::beginTransaction();
            Log::info('Started database transaction');

            // Calculate multiplier safely
            $multiplier = $ingredientLotDetail->transformer ? $ingredientLotDetail->transformer->multiplier : 1;
            $totalQuantity = $ingredientLotDetail->quantity * $multiplier;

            // Log the disposal details
            Log::info('Disposing expired ingredient lot', [
                'lot_detail_id' => $ingredientLotDetail->id,
                'ingredient_name' => $ingredientLotDetail->ingredient->name,
                'quantity' => $ingredientLotDetail->quantity,
                'transformer_multiplier' => $multiplier,
                'total_quantity' => $totalQuantity,
                'expiration_date' => $ingredientLotDetail->expiration_date,
                'user_id' => auth()->id(),
                'disposed_at' => now()->toDateTimeString()
            ]);

            $ingredient = Ingredient::findOrFail($ingredientLotDetail->ingredient_id);
            // $ingredient->quantity -= $ingredientLotDetail->quantity * $ingredientLotDetail->transformer->multiplier;
            // $ingredient->save();

            $productIngredientUsage = new ProductIngredientUsage();
            $productIngredientUsage->ingredient_id = $ingredient->id;
            $productIngredientUsage->amount = $ingredientLotDetail->quantity * $multiplier;
            $productIngredientUsage->usage_type = 'DISPOSE';
            $productIngredientUsage->created_by = auth()->id();
            $productIngredientUsage->note = "จำหน่ายวัตถุดิบหมดอายุ (" . $ingredient->name . ") จาก Lot วัตถุดิบที่ " . $ingredientLotDetail->id;
            $productIngredientUsage->save();
            $ingredientLotDetail->delete();

            DB::commit();
            Log::info('Disposal process completed successfully', ['detail_id' => $id]);
            return redirect()->back()->with('success', 'วัตถุดิบถูกจำหน่ายออกเรียบร้อยแล้ว');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error disposing expired ingredient: ' . $e->getMessage(), ['detail_id' => $id]);
            return redirect()->back()->with('error', 'เกิดข้อผิดพลาดในการจำหน่ายวัตถุดิบ');
        }
    }
}
