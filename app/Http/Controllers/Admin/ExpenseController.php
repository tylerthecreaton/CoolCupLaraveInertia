<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::with(['expenseCategory', 'user'])->orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Admin/expense/index', [
            'expenses' => $expenses,
        ]);
    }

    public function create()
    {
        $expenseCategories = ExpenseCategory::all();
        return Inertia::render('Admin/expense/create', [
            'expenseCategories' => $expenseCategories,
        ]);
    }

    public function store(Request $request)
    {
        // Validation logic here
        $expense = Expense::create(array_merge($request->all(), ['user_id' => Auth::user()->id]));
        return redirect()->route('admin.expenses.index')->with('success', 'Expense created successfully.');
    }

    public function show($id)
    {
        $expense = Expense::findOrFail($id);
        return Inertia::render('Admin/expense/show', [
            'expense' => $expense,
        ]);
    }

    public function edit($id)
    {
        $expense = Expense::findOrFail($id);
        return Inertia::render('Admin/expense/edit', [
            'expense' => $expense,
        ]);
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);
        // Validation logic here
        $expense->update($request->all());
        return redirect()->route('expenses.index')->with('success', 'Expense updated successfully.');
    }

    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();
        return redirect()->route('expenses.index')->with('success', 'Expense deleted successfully.');
    }
}
