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
        $lots = ConsumableLot::with(['consumable', 'user'])
            ->select('created_at', DB::raw('COUNT(*) as total_items'))
            ->groupBy('created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

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

        foreach ($request->all() as $lotData) {

            ConsumableLot::create([
                'consumable_id' => $lotData['consumable_id'],
                'cost_per_unit' => $lotData['cost_per_unit'],
                'quantity' => $lotData['quantity'],
                'per_pack' => $lotData['per_pack'],
                'price' => $lotData['price'],
                'supplier' => $lotData['supplier'],
                'note' => $lotData['note'] ?? null,
                'user_id' => Auth::user()->id
            ]);

            // เพิ่มการรับ ConsumableLot ไปยัง Consumable
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

        $this->updateExpenses(ConsumableLot::where('created_at', ConsumableLot::max('created_at'))->get());

        return redirect()->route('admin.consumables.lots.index')
            ->with('success', 'บันทึกข้อมูล Lot สำเร็จ');
    }

    private function updateExpenses($latestLots)
    {
        if ($latestLots->isEmpty()) {
            return;
        }

        $descriptions = $latestLots->map(function ($lot) {
            return sprintf(
                " %s: %d %s (ราคารวม %s บาท) จาก %s",
                $lot->consumable->name,
                $lot->quantity,
                $lot->consumable->unit,
                number_format($lot->price, 2),
                $lot->supplier
            );
        })->join("\n");

        $totalAmount = $latestLots->sum('price');


        $category = ExpenseCategory::firstOrCreate(
            ['name' => 'วัตถุดิบสิ้นเปลือง'],
            ['description' => 'รายจ่ายจากการซื้อวัตถุดิบสิ้นเปลือง']
        );


        Expense::create([
            'name' => sprintf('ซื้อวัตถุดิบสิ้นเปลือง (%d รายการ)', $latestLots->count()),
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
        $lots = ConsumableLot::with(['consumable', 'user'])
            ->whereDate('created_at', $date)
            ->get();

        return response()->json($lots);
    }

    public function destroy($consumableId, $id)
    {
        $lot = ConsumableLot::findOrFail($id);
        $lot->delete();

        $totalQuantity = ConsumableLot::where('consumable_id', $consumableId)
            ->sum('remaining_quantity');
        Consumable::where('id', $consumableId)
            ->update(['quantity' => $totalQuantity]);

        return redirect()->route('admin.consumables.lots.index', $consumableId)
            ->with('success', 'ลบข้อมูล Lot เรียบร้อย');
    }
}
