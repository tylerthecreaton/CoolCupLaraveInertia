<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Consumable;

class ConsumablesController extends Controller
{

    public function index()
    {
        $consumables = Consumable::all();
        return Inertia::render('Consumables/Index', compact('consumables'));
    }

    public function create()
    {
        return Inertia::render('Consumables/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric'],
            'stock' => ['required', 'numeric'],
        ]);

        Consumable::create($request->all());

        return redirect()->route('consumables.index');
    }

    public function edit(Consumable $consumable)
    {
        return Inertia::render('Consumables/Edit', compact('consumable'));
    }

    public function update(Request $request, Consumable $consumable)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric'],
            'stock' => ['required', 'numeric'],
        ]);

        $consumable->update($request->all());

        return redirect()->route('consumables.index');
    }

    public function destroy(Consumable $consumable)
    {
        $consumable->delete();
        return redirect()->route('consumables.index');
    }
    
}
