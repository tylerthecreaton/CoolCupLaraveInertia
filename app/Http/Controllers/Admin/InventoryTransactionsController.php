<?php

namespace App\Http\Controllers\Admin;

use App\Models\Ingredient;
use App\Http\Controllers\Controller;
use App\Models\InventoryTransactions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class InventoryTransactionsController extends Controller
{
    // Display all inventory transactions
    public function index()
    {
        $transactions = InventoryTransactions::with('ingredient')->get();
        return Inertia::render('Admin/transactions/index', compact('transactions'));
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
            'type' => 'required|in:' . implode(',', InventoryTransactions::getTypes()),
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:255',
        ];

        $messages = [
            'ingredient_id.required' => 'Please select an ingredient.',
            'ingredient_id.exists' => 'The selected ingredient does not exist.',
            'type.required' => 'Please select a transaction type.',
            'type.in' => 'Invalid transaction type selected.',
            'quantity.required' => 'Please enter a quantity.',
            'quantity.integer' => 'Quantity must be a whole number.',
            'quantity.min' => 'Quantity must be at least 1.',
            'notes.max' => 'Notes cannot exceed 255 characters.',
        ];

        $validated = $request->validate($rules, $messages);

        try {
            DB::beginTransaction();

            $ingredient = Ingredient::lockForUpdate()->findOrFail($validated['ingredient_id']);

            if ($validated['type'] === InventoryTransactions::TYPE_DEDUCTED) {
                if ($ingredient->quantity < $validated['quantity']) {
                    throw new \Exception("Insufficient quantity of {$ingredient->name} in stock. Available: {$ingredient->quantity}");
                }
                $ingredient->quantity -= $validated['quantity'];
            } else {
                $ingredient->quantity += $validated['quantity'];
            }

            $ingredient->save();

            InventoryTransactions::create($validated);

            DB::commit();

            return redirect()->route('admin.transactions.index')
                ->with('success', 'Inventory transaction completed successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
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
}
