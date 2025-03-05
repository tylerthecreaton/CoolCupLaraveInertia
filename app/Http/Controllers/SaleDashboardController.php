<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SaleDashboardController extends Controller
{
    public function index(Request $request)
    {
        $dateRange = $request->input('dateRange', 'today');
        $startDate = $this->getStartDate($dateRange, $request->input('startDate'));
        $endDate = $this->getEndDate($dateRange, $request->input('endDate'));

        // คำนวณช่วงเวลาเปรียบเทียบตาม dateRange
        switch ($dateRange) {
            case 'today':
                $previousStartDate = now()->subDay()->startOfDay();
                $previousEndDate = now()->subDay()->endOfDay();
                break;
            case 'yesterday':
                $previousStartDate = now()->subDays(2)->startOfDay();
                $previousEndDate = now()->subDays(2)->endOfDay();
                break;
            case 'thisWeek':
                $previousStartDate = now()->subWeek()->startOfWeek();
                $previousEndDate = now()->subWeek()->endOfWeek();
                break;
            case 'thisMonth':
                $previousStartDate = now()->subMonth()->startOfMonth();
                $previousEndDate = now()->subMonth()->endOfMonth();
                break;
            case 'thisYear':
                $previousStartDate = now()->subYear()->startOfYear();
                $previousEndDate = now()->subYear()->endOfYear();
                break;
            default:
                $periodDiff = $endDate->diffInSeconds($startDate);
                $previousEndDate = (clone $startDate)->subSecond();
                $previousStartDate = (clone $previousEndDate)->subSeconds($periodDiff);
        }

        // Get VAT rate from settings
        $vatRate = (float) (Setting::where('key', 'vat_rate')->value('value') ?? 7);

        // Current period sales data with cost of goods sold
        $currentSalesData = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('orders.status', 'completed')
            ->select(
                DB::raw('COALESCE(SUM(order_details.price * order_details.quantity), 0) as total_sales'),
                DB::raw('COALESCE(SUM(products.cost_price * order_details.quantity), 0) as cost_of_goods_sold'),
                DB::raw('COUNT(DISTINCT orders.id) as total_orders'),
                DB::raw('COALESCE(AVG(order_details.price * order_details.quantity), 0) as average_order_value')
            )
            ->first();

        // Previous period sales data
        $previousSalesData = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->whereBetween('orders.created_at', [$previousStartDate, $previousEndDate])
            ->where('orders.status', 'completed')
            ->select(
                DB::raw('COALESCE(SUM(order_details.price * order_details.quantity), 0) as total_sales'),
                DB::raw('COALESCE(SUM(products.cost_price * order_details.quantity), 0) as cost_of_goods_sold'),
                DB::raw('COUNT(DISTINCT orders.id) as total_orders'),
                DB::raw('COALESCE(AVG(order_details.price * order_details.quantity), 0) as average_order_value')
            )
            ->first();

        // Current period customers
        $currentCustomers = Customer::whereBetween('created_at', [$startDate, $endDate])->count();
        $previousCustomers = Customer::whereBetween('created_at', [$previousStartDate, $previousEndDate])->count();

        // แปลงค่าให้เป็นตัวเลขและป้องกันค่า null
        $currentSales = (float) $currentSalesData->total_sales;
        $previousSales = (float) $previousSalesData->total_sales;
        $currentOrders = (int) $currentSalesData->total_orders;
        $previousOrders = (int) $previousSalesData->total_orders;
        $currentAvg = (float) $currentSalesData->average_order_value;
        $previousAvg = (float) $previousSalesData->average_order_value;
        $currentCostOfGoodsSold = (float) $currentSalesData->cost_of_goods_sold;
        $previousCostOfGoodsSold = (float) $previousSalesData->cost_of_goods_sold;

        // Calculate trends
        $calculateTrend = function($current, $previous) {
            if ($current == 0 && $previous == 0) return 0;
            if ($previous != 0) {
                $percentDiff = (($current - $previous) / abs($previous)) * 100;
            } else {
                $percentDiff = $current > 0 ? 100 : 0;
            }
            return round($percentDiff, 1);
        };

        $salesTrend = $calculateTrend($currentSales, $previousSales);
        $ordersTrend = $calculateTrend($currentOrders, $previousOrders);
        $avgTrend = $calculateTrend($currentAvg, $previousAvg);
        $customersTrend = $calculateTrend($currentCustomers, $previousCustomers);

        // Get daily sales data for chart
        $dailySales = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
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

        // Get top selling products
        $topProducts = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('orders.status', 'completed')
            ->select(
                'products.id',
                'products.name',
                'products.sale_price as price',
                'products.image',
                DB::raw('SUM(order_details.quantity) as total_quantity'),
                DB::raw('SUM(order_details.price * order_details.quantity) as total_sales')
            )
            ->groupBy('products.id', 'products.name', 'products.sale_price', 'products.image')
            ->orderByDesc('total_sales')
            ->limit(5)
            ->get();

        return Inertia::render('SaleDashboard', [
            'dateRange' => $dateRange,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
            'topProducts' => $topProducts,
            'statistics' => [
                'totalSales' => $currentSales,
                'salesTrend' => $salesTrend,
                'totalOrders' => $currentOrders,
                'ordersTrend' => $ordersTrend,
                'averageOrderValue' => $currentAvg,
                'averageOrderTrend' => $avgTrend,
                'totalCustomers' => $currentCustomers,
                'customersTrend' => $customersTrend,
                'costOfGoodsSold' => $currentCostOfGoodsSold,
                'grossProfit' => $currentSales - $currentCostOfGoodsSold,
            ],
            'dailySales' => $dailySales,
            'vatRate' => $vatRate
        ]);
    }

    private function getStartDate($dateRange, $customStartDate = null)
    {
        if ($customStartDate) {
            return Carbon::parse($customStartDate)->startOfDay();
        }

        return match($dateRange) {
            'today' => now()->startOfDay(),
            'yesterday' => now()->subDay()->startOfDay(),
            'thisWeek' => now()->startOfWeek(),
            'thisMonth' => now()->startOfMonth(),
            'thisYear' => now()->startOfYear(),
            default => now()->startOfDay()
        };
    }

    private function getEndDate($dateRange, $customEndDate = null)
    {
        if ($customEndDate) {
            return Carbon::parse($customEndDate)->endOfDay();
        }

        return match($dateRange) {
            'today' => now()->endOfDay(),
            'yesterday' => now()->subDay()->endOfDay(),
            'thisWeek' => now()->endOfWeek(),
            'thisMonth' => now()->endOfMonth(),
            'thisYear' => now()->endOfYear(),
            default => now()->endOfDay()
        };
    }
}
