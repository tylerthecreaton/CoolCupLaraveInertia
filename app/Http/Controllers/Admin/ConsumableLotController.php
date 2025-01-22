<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Consumable;
use App\Models\ConsumableLot;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ConsumableLotController extends Controller
{
    public function index()
    {
        $lots = ConsumableLot::with(['details.consumable', 'user'])
            ->select('consumable_lots.*')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Transform data for frontend
        $lots->through(function ($lot) {
            return [
                'id' => $lot->id,
                'lot_number' => $lot->lot_number,
                'created_at' => $lot->created_at,
                'note' => $lot->note,
                'user' => $lot->user,
                'details' => $lot->details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'consumable' => $detail->consumable,
                        'quantity' => $detail->quantity,
                        'price' => $detail->price,
                        'cost_per_unit' => $detail->cost_per_unit,
                        'per_pack' => $detail->per_pack,
                        'supplier' => $detail->supplier,
                        'note' => $detail->note,
                        'type' => $detail->type
                    ];
                })
            ];
        });

        return Inertia::render('Admin/consumables/lots/index', [
            'lots' => $lots
        ]);
    }

    public function create()
    {
        $consumables = Consumable::all();
        return Inertia::render('Admin/consumables/lots/create', [
            'consumables' => $consumables
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            '*.consumable_id' => 'required|exists:consumables,id',
            '*.cost_per_unit' => 'required|numeric|min:0',
            '*.quantity' => 'required|numeric|min:0',
            '*.per_pack' => 'required|numeric|min:0',
            '*.price' => 'required|numeric|min:0',
            '*.supplier' => 'required|string',
            '*.note' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            // สร้าง ConsumableLot
            $lot = ConsumableLot::create([
                'user_id' => Auth::user()->id,
                'lot_number' => $this->generateLotNumber(),
                'note' => collect($request->all())->pluck('note')->filter()->join(', ')
            ]);

            Log::info('Created ConsumableLot', [
                'lot_id' => $lot->id,
                'lot_number' => $lot->lot_number
            ]);

            // สร้าง ConsumableLotDetail สำหรับแต่ละรายการ
            foreach ($request->all() as $lotData) {
                $detail = $lot->details()->create([
                    'consumable_id' => $lotData['consumable_id'],
                    'quantity' => $lotData['quantity'],
                    'type' => 'in',
                    'price' => $lotData['price'],
                    'per_pack' => $lotData['per_pack'],
                    'cost_per_unit' => $lotData['cost_per_unit'],
                    'supplier' => $lotData['supplier'],
                    'note' => $lotData['note'] ?? null,
                ]);

                Log::info('Created ConsumableLotDetail', [
                    'detail_id' => $detail->id,
                    'lot_id' => $lot->id,
                    'consumable_id' => $lotData['consumable_id']
                ]);

                // อัพเดทจำนวน Consumable
                $consumable = Consumable::find($lotData['consumable_id']);
                $oldQuantity = $consumable->quantity;
                $newQuantity = $lotData['quantity'] * $lotData['per_pack'];
                $consumable->increment('quantity', $newQuantity);
                
                Log::info('Updating Consumable quantity', [
                    'consumable_id' => $lotData['consumable_id'],
                    'old_quantity' => $oldQuantity,
                    'added_quantity' => $newQuantity,
                    'new_quantity' => $consumable->fresh()->quantity
                ]);
            }

            $this->updateExpenses([$lot]);
        });

        return redirect()->route('admin.consumables.lots.index')
            ->with('success', 'บันทึกข้อมูล Lot สำเร็จ');
    }

    private function generateLotNumber()
    {
        $latestLot = ConsumableLot::latest()->first();
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
                    $detail->consumable->name,
                    $detail->quantity * $detail->per_pack,
                    $detail->consumable->unit,
                    number_format($detail->price, 2),
                    $detail->supplier
                );
            });
        })->join("\n");

        $totalAmount = collect($lots)->sum(function ($lot) {
            return $lot->details->sum('price');
        });

        $category = ExpenseCategory::firstOrCreate(
            ['name' => 'วัตถุดิบสิ้นเปลือง'],
            ['description' => 'รายจ่ายจากการซื้อวัตถุดิบสิ้นเปลือง']
        );

        Expense::create([
            'name' => sprintf('ซื้อวัตถุดิบสิ้นเปลือง (%d รายการ)', 
                collect($lots)->sum(function ($lot) {
                    return $lot->details->count();
                })
            ),
            'amount' => $totalAmount,
            'description' => $descriptions,
            'expense_category_id' => $category->id,
            'user_id' => Auth::user()->id,
            'source_type' => 'consumable_lot',
            'source_date' => now(),
        ]);
    }

    public function getLotDetails($date)
    {
        $lots = ConsumableLot::with(['details.consumable', 'user'])
            ->whereDate('created_at', $date)
            ->get();

        return response()->json($lots);
    }

    public function destroy($consumableId, $id)
    {
        DB::transaction(function () use ($consumableId, $id) {
            $lot = ConsumableLot::findOrFail($id);
            
            // ลดจำนวน Consumable ตาม details ที่จะลบ
            foreach ($lot->details as $detail) {
                $quantity = $detail->quantity * $detail->per_pack;
                $detail->consumable->decrement('quantity', $quantity);
            }
            
            $lot->delete();
        });

        return redirect()->route('admin.consumables.lots.index')
            ->with('success', 'ลบข้อมูล Lot เรียบร้อย');
    }
}
