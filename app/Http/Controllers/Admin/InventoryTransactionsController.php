<?php

namespace App\Http\Controllers\Admin;

use App\Models\Ingredient;
use App\Http\Controllers\Controller;
use App\Models\InventoryTransactions;
use App\Models\ProductIngredientUsage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class InventoryTransactionsController extends Controller
{
    // Display all inventory transactions
    public function index()
    {
        // Get all transactions with ingredient details and user details
        $transactions = ProductIngredientUsage::with(['ingredient'])->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Admin/transactions/index', [
            'transactions' => $transactions
        ]);
    }

    // Show form to create a new transaction
    public function create()
    {
        $ingredients = Ingredient::all();
        return Inertia::render('Admin/transactions/create', compact('ingredients'));
    }

    // Store a new transaction
    public function store(Request $request)
    {
        $rules = [
            'ingredient_id' => 'required|exists:ingredients,id',
            'amount' => 'required|numeric|min:0.01',
            'note' => 'nullable|string|max:255',
        ];

        $messages = [
            'ingredient_id.required' => 'กรุณาเลือกวัตถุดิบ',
            'ingredient_id.exists' => 'วัตถุดิบที่เลือกไม่ถูกต้อง',
            'amount.required' => 'กรุณาระบุจำนวน',
            'amount.numeric' => 'จำนวนต้องเป็นตัวเลข',
            'amount.min' => 'จำนวนต้องมากกว่า 0',
            'note.max' => 'หมายเหตุต้องไม่เกิน 255 ตัวอักษร',
        ];

        $validated = $request->validate($rules, $messages);

        DB::transaction(function () use ($validated, $request) {
            // Update ingredient quantity
            $ingredient = Ingredient::findOrFail($validated['ingredient_id']);
            $ingredient->quantity += $validated['amount'];
            $ingredient->save();

            // Create transaction record
            $usage = new ProductIngredientUsage();
            $usage->ingredient_id = $validated['ingredient_id'];
            $usage->amount = $validated['amount'];
            $usage->usage_type = 'ADD';
            $usage->created_by = Auth::user()->id;
            $usage->note = $validated['note'] ?? null;
            $usage->save();
        });

        return redirect()->route('admin.transactions.index')->with('success', 'เพิ่มวัตถุดิบสำเร็จ');
    }

    // Show a single transaction
    public function show($id)
    {
        //
    }

    // Show form to edit a transaction
    public function edit($id)
    {
        $transaction = InventoryTransactions::findOrFail($id);
        $ingredients = Ingredient::all();
        return view('inventory_transactions.edit', compact('transaction', 'ingredients'));
    }

    // Update a transaction
    public function update(Request $request, $id)
    {
        $request->validate([
            'ingredient_id' => 'required|exists:ingredients,id',
            'type' => 'required|in:Added,Deducted',
            'quantity' => 'required|integer|min:1',
        ]);

        $transaction = InventoryTransactions::findOrFail($id);
        $transaction->update($request->all());

        return redirect()->route('inventory_transactions.index')->with('success', 'Transaction updated successfully.');
    }

    // Delete a transaction
    public function destroy($id)
    {
        $transaction = InventoryTransactions::findOrFail($id);
        $transaction->delete();

        return redirect()->route('inventory_transactions.index')->with('success', 'Transaction deleted successfully.');
    }

    public static function getTypes()
    {
        return ['ADD', 'USE'];
    }
}
