<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Consumable;
use App\Models\ConsumableLot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConsumableLotController extends Controller
{
    public function index()
    {
        $lots = ConsumableLot::with('user')
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
        }

        return redirect()->route('admin.consumables.lots.index')
            ->with('success', 'บันทึกข้อมูล Lot สำเร็จ');
    }

    public function destroy($consumableId, $id)
    {
        $lot = ConsumableLot::findOrFail($id);
        $lot->delete();

        // Update total quantity in consumable
        $totalQuantity = ConsumableLot::where('consumable_id', $consumableId)
            ->sum('remaining_quantity');
        Consumable::where('id', $consumableId)
            ->update(['quantity' => $totalQuantity]);

        return redirect()->route('admin.consumables.lots.index', $consumableId)
            ->with('success', 'ลบข้อมูล Lot เรียบร้อย');
    }
}
