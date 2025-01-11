<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // Get daily stats
        $dailyOrders = Order::whereDate('created_at', $today);

        // Get sales by time for chart
        $salesByTime = DB::table('orders')
            ->select(DB::raw('
                CASE
                    WHEN HOUR(created_at) BETWEEN 6 AND 11 THEN "เช้า"
                    WHEN HOUR(created_at) BETWEEN 12 AND 16 THEN "กลางวัน"
                    WHEN HOUR(created_at) BETWEEN 17 AND 21 THEN "เย็น"
                    ELSE "กลางคืน"
                END as period
            '), DB::raw('SUM(total_amount) as total'))
            ->whereDate('created_at', $today)
            ->groupBy('period')
            ->orderByRaw('MIN(HOUR(created_at))')
            ->get();

        // Get top drinks for chart
        $topDrinks = DB::table('order_details')
            ->join('orders', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'products.id', '=', 'order_details.product_id')
            ->select('products.name', DB::raw('COUNT(*) as count'))
            ->whereDate('orders.created_at', $today)
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // Get payment methods for chart
        $paymentMethods = DB::table('orders')
            ->select('payment_method', DB::raw('COUNT(*) as count'))
            ->whereDate('created_at', $today)
            ->groupBy('payment_method')
            ->orderByDesc('count')
            ->get();

        $stats = [
            // ข้อมูลการขาย
            'totalSales' => $dailyOrders->sum('total_amount'),
            'totalProfit' => $dailyOrders->sum('total_amount'),
            'totalOrders' => $dailyOrders->count(),
            
            // Chart Data
            'salesByTimeChart' => [
                'labels' => $salesByTime->pluck('period'),
                'data' => $salesByTime->pluck('total'),
            ],
            
            'topDrinksChart' => [
                'labels' => $topDrinks->pluck('name'),
                'data' => $topDrinks->pluck('count'),
            ],

            'paymentMethodsChart' => [
                'labels' => $paymentMethods->pluck('payment_method'),
                'data' => $paymentMethods->pluck('count'),
            ],

            // ข้อมูลสินค้า
            'topDrinks' => $topDrinks->pluck('name')->implode(', '),
            'topSizes' => DB::table('order_details')
                ->join('orders', 'orders.id', '=', 'order_details.order_id')
                ->select('size', DB::raw('COUNT(*) as count'))
                ->whereDate('orders.created_at', $today)
                ->groupBy('size')
                ->orderByDesc('count')
                ->limit(3)
                ->pluck('size')
                ->implode(', '),

            // ข้อมูลลูกค้า
            'memberPercentage' => $dailyOrders->whereNotNull('customer_name')->count() > 0
                ? round(($dailyOrders->whereNotNull('customer_name')->count() /
                    $dailyOrders->count()) * 100)
                : 0,

            'paymentMethods' => $paymentMethods
                ->map(function ($item) {
                    return $item->payment_method . ': ' . $item->count;
                })
                ->implode(', '),
        ];

        return Inertia::render('Admin/report/DailyReport', [
            'stats' => $stats
        ]);
    }
}
