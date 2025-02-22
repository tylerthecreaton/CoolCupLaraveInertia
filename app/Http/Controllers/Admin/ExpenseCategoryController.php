<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseCategoryController extends Controller
{
    public function index()
    {
        $categories = ExpenseCategory::orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Admin/expenseCategory/index', ['categories' => $categories]);
    }

    public function create()
    {
        return Inertia::render('Admin/expenseCategory/create');
    }

    public function store(Request $request)
    {
        $rules = [
            "name" => "required|min:3",
        ];
        $message = [
            "name.required" => "กรุณากรอกชื่อ",
            "name.min" => "ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
        ];
        $request->validate($rules, $message);

        ExpenseCategory::create($request->all());
        return redirect()->route('admin.expense-categories.index')->with('success', 'Expense category created successfully.');

    }

    public function edit($id)
    {
        $category = ExpenseCategory::findOrFail($id);
        return Inertia::render('Admin/expenseCategory/edit', ['category' => $category]);
    }

    public function update(Request $request, $id)
    {
        $rules = [
            "name" => "required|min:3",
        ];
        $message = [
            "name.required" => "กรุณากรอกชื่อ",
            "name.min" => "ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
        ];
        $request->validate($rules, $message);
        $category = ExpenseCategory::findOrFail($id);
        $category->update($request->all());
        return redirect()->route('admin.expense-categories.index')->with('success', 'Expense category updated successfully.');
    }

    public function destroy($id)
    {
        $category = ExpenseCategory::findOrFail($id);
        $category->delete();
        return redirect()->route('admin.expense-categories.index')->with('success', 'Expense category deleted successfully.');
    }
}
