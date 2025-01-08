<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SaleDashboardController extends Controller
{
    public function index()
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();

        $currentMonthStats = Order::where('created_at', '>=', $currentMonth)
            ->selectRaw('COUNT(*) as total_orders')
            ->selectRaw('SUM(total_amount) as total_sales')
            ->first();

        $lastMonthStats = Order::where('created_at', '>=', $lastMonth)
            ->where('created_at', '<', $currentMonth)
            ->selectRaw('COUNT(*) as total_orders')
            ->selectRaw('SUM(total_amount) as total_sales')
            ->first();

        $currentMonthCustomers = Customer::where('created_at', '>=', $currentMonth)->count();

        $lastMonthCustomers = Customer::where('created_at', '>=', $lastMonth)
            ->where('created_at', '<', $currentMonth)
            ->count();

        $salesChange = $this->calculatePercentageChange(
            $lastMonthStats->total_sales ?? 0,
            $currentMonthStats->total_sales ?? 0
        );

        $ordersChange = $this->calculatePercentageChange(
            $lastMonthStats->total_orders ?? 0,
            $currentMonthStats->total_orders ?? 0
        );

        $customersChange = $this->calculatePercentageChange(
            $lastMonthCustomers,
            $currentMonthCustomers
        );

        $averageOrderValue = $currentMonthStats->total_orders > 0
            ? $currentMonthStats->total_sales / $currentMonthStats->total_orders
            : 0;

        $lastMonthAverage = $lastMonthStats->total_orders > 0
            ? $lastMonthStats->total_sales / $lastMonthStats->total_orders
            : 0;

        $averageOrderChange = $this->calculatePercentageChange($lastMonthAverage, $averageOrderValue);

        // Get daily sales data for the current month
        $dailySales = Order::where('created_at', '>=', $currentMonth)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as total_sales'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('j M'),
                    'total' => (float)$item->total_sales
                ];
            });

        $topProducts = Product::with(['category'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->sale_price,
                    'category' => $product->category,
                    'image' => $product->image
                ];
            });

        return Inertia::render('SaleDashboard', [
            'topProducts' => $topProducts,
            'statistics' => [
                'totalSales' => $currentMonthStats->total_sales ?? 0,
                'salesChange' => $salesChange,
                'totalOrders' => $currentMonthStats->total_orders ?? 0,
                'ordersChange' => $ordersChange,
                'averageOrderValue' => $averageOrderValue,
                'averageOrderChange' => $averageOrderChange,
                'totalCustomers' => $currentMonthCustomers,
                'customersChange' => $customersChange,
            ],
            'dailySales' => $dailySales
        ]);
    }

    private function calculatePercentageChange($oldValue, $newValue)
    {
        if ($oldValue == 0) {
            return $newValue > 0 ? 100 : 0;
        }
        return round((($newValue - $oldValue) / $oldValue) * 100);
    }
}
