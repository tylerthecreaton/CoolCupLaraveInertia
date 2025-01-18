<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Consumable;

class ConsumablesController extends Controller
{

    public function index()
    {
        $consumables = Consumable::orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Admin/consumables/index', compact('consumables'));
    }

    public function create()
    {
        return Inertia::render('Admin/consumables/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'numeric'],
            'is_depend_on_sale' => ['required', 'boolean'],
        ]);

        Consumable::create($request->all());

        return redirect()->route('admin.consumables.index')->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }

    public function edit($id)
    {
        $consumable = Consumable::find($id);
        return Inertia::render('Admin/consumables/edit', compact('consumable'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'numeric'],
            'is_depend_on_sale' => ['required', 'boolean'],
        ]);

        $consumable = Consumable::find($id);
        $consumable->update($request->all());

        return redirect()->route('admin.consumables.index')->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }

    public function destroy($id)
    {
        $consumable = Consumable::find($id);
        $consumable->delete();
        return redirect()->route('admin.consumables.index');
    }
}
