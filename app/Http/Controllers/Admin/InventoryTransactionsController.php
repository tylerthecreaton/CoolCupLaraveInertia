<?php

namespace App\Http\Controllers\Admin;

use App\Models\Ingredient;
use App\Http\Controllers\Controller;
use App\Models\ProductIngredientUsage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class InventoryTransactionsController extends Controller
{
    // Display all inventory transactions
    public function index(Request $request)
    {
        $query = ProductIngredientUsage::with(['ingredient.unit'])->orderBy('created_at', 'desc');

        // Apply search filter if provided
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->whereHas('ingredient', function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%");
            })->orWhere('note', 'like', "%{$searchTerm}%");
        }

        // Apply date filters
        $filterType = $request->input('filterType', 'today');
        
        switch ($filterType) {
            case 'today':
                $query->whereDate('created_at', Carbon::today());
                break;
            
            case 'week':
                $query->whereBetween('created_at', [
                    Carbon::now()->startOfWeek(),
                    Carbon::now()->endOfWeek()
                ]);
                break;
            
            case 'custom':
                if ($request->filled('startDate') && $request->filled('endDate')) {
                    $startDate = Carbon::parse($request->startDate)->startOfDay();
                    $endDate = Carbon::parse($request->endDate)->endOfDay();
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }
                break;
            
            case 'all':
                // No date filter
                break;
        }

        $transactions = $query->paginate(20);

        return Inertia::render('Admin/transactions/index', [
            'transactions' => $transactions,
            'filters' => [
                'type' => $filterType,
                'startDate' => $request->input('startDate'),
                'endDate' => $request->input('endDate'),
            ]
        ]);
    }

    public static function getTypes()
    {
        return ['ADD', 'USE'];
    }
}
