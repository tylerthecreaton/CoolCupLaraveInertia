<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Ingredient;
use App\Models\Consumable;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $dateRange = $request->input('dateRange', 'today');
        $startDate = $this->getStartDate($dateRange, $request->input('startDate'));
        $endDate = $this->getEndDate($dateRange, $request->input('endDate'));
        
        // Sales Summary
        $salesData = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->select(
                DB::raw('SUM(total_amount) as total_sales'),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('AVG(total_amount) as average_order_value')
            )
            ->first();

        // Top Products
        $topProducts = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('orders.status', 'completed')
            ->select(
                'products.name',
                DB::raw('SUM(order_details.quantity) as total_quantity'),
                DB::raw('SUM(order_details.subtotal) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_quantity', 'desc')
            ->limit(5)
            ->get();

        // Inventory Status
        $ingredients = Ingredient::with(['lots' => function($query) {
            $query->where('expiration_date', '>', now())
                  ->where('quantity', '>', 0)
                  ->where('type', 'in');
        }])
        ->get()
        ->map(function($ingredient) {
            $totalQuantity = $ingredient->lots->sum('quantity');
            return [
                'name' => $ingredient->name,
                'total_quantity' => $totalQuantity,
                'unit' => $ingredient->unit->name,
                'status' => $totalQuantity < ($ingredient->minimum_stock ?? 10) ? 'low' : 'normal'
            ];
        });

        // Expenses Summary
        $expenses = Expense::join('expense_categories', 'expenses.expense_category_id', '=', 'expense_categories.id')
            ->whereBetween('expenses.created_at', [$startDate, $endDate])
            ->select(
                'expense_categories.name as category',
                DB::raw('SUM(expenses.amount) as total_amount')
            )
            ->groupBy('expense_categories.id', 'expense_categories.name')
            ->get();

        // Hourly Sales Distribution
        $hourlySales = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->select(
                DB::raw('HOUR(created_at) as hour'),
                DB::raw('COUNT(*) as order_count'),
                DB::raw('SUM(total_amount) as total_sales')
            )
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        return Inertia::render('Dashboard', [
            'salesData' => $salesData,
            'topProducts' => $topProducts,
            'ingredients' => $ingredients,
            'expenses' => $expenses,
            'hourlySales' => $hourlySales,
            'filters' => [
                'dateRange' => $dateRange,
                'startDate' => $startDate,
                'endDate' => $endDate
            ]
        ]);
    }

    private function getStartDate($dateRange, $customStartDate = null)
    {
        if ($customStartDate) {
            return Carbon::parse($customStartDate)->startOfDay();
        }

        return match($dateRange) {
            'today' => Carbon::today(),
            'yesterday' => Carbon::yesterday(),
            'thisWeek' => Carbon::now()->startOfWeek(),
            'thisMonth' => Carbon::now()->startOfMonth(),
            default => Carbon::today(),
        };
    }

    private function getEndDate($dateRange, $customEndDate = null)
    {
        if ($customEndDate) {
            return Carbon::parse($customEndDate)->endOfDay();
        }

        return match($dateRange) {
            'today' => Carbon::today()->endOfDay(),
            'yesterday' => Carbon::yesterday()->endOfDay(),
            'thisWeek' => Carbon::now()->endOfWeek(),
            'thisMonth' => Carbon::now()->endOfMonth(),
            default => Carbon::today()->endOfDay(),
        };
    }
}
