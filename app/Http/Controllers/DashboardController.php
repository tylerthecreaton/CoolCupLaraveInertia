<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Ingredient;
use App\Models\Consumable;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $dateRange = $request->input('dateRange', 'today');
        $startDate = $this->getStartDate($dateRange, $request->input('startDate'));
        $endDate = $this->getEndDate($dateRange, $request->input('endDate'));

        // คำนวณช่วงเวลาเปรียบเทียบตาม dateRange
        switch ($dateRange) {
            case 'today':
                // เปรียบเทียบกับเมื่อวาน
                $previousStartDate = now()->subDay()->startOfDay();
                $previousEndDate = now()->subDay()->endOfDay();
                break;
            
            case 'thisWeek':
                // เปรียบเทียบกับสัปดาห์ที่แล้ว
                $previousStartDate = now()->subWeek()->startOfWeek();
                $previousEndDate = now()->subWeek()->endOfWeek();
                break;
            
            case 'thisMonth':
                // เปรียบเทียบกับเดือนที่แล้ว
                $previousStartDate = now()->subMonth()->startOfMonth();
                $previousEndDate = now()->subMonth()->endOfMonth();
                break;
            
            default:
                // สำหรับช่วงเวลาที่กำหนดเอง ใช้ช่วงเวลาเท่ากันย้อนหลังไป
                $periodDiff = $endDate->diffInSeconds($startDate);
                $previousEndDate = (clone $startDate)->subSecond();
                $previousStartDate = (clone $previousEndDate)->subSeconds($periodDiff);
        }

        // Get VAT rate from settings
        $vatRate = Setting::where('key', 'vat_rate')->value('value') ?? 7;

        // Current period sales data
        $currentSalesData = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->select(
                DB::raw('COALESCE(SUM(total_amount), 0) as total_sales'),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('COALESCE(AVG(total_amount), 0) as average_order_value')
            )
            ->first();

        // Previous period sales data
        $previousSalesData = Order::whereBetween('created_at', [$previousStartDate, $previousEndDate])
            ->where('status', 'completed')
            ->select(
                DB::raw('COALESCE(SUM(total_amount), 0) as total_sales'),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('COALESCE(AVG(total_amount), 0) as average_order_value')
            )
            ->first();

        // แปลงค่าให้เป็นตัวเลขและป้องกันค่า null
        $currentSales = (float) $currentSalesData->total_sales;
        $previousSales = (float) $previousSalesData->total_sales;
        $currentOrders = (int) $currentSalesData->total_orders;
        $previousOrders = (int) $previousSalesData->total_orders;
        $currentAvg = (float) $currentSalesData->average_order_value;
        $previousAvg = (float) $previousSalesData->average_order_value;

        // Debug logging
        Log::info('Sales Trend Calculation', [
            'Current Sales' => $currentSales,
            'Previous Sales' => $previousSales,
            'Date Range' => $dateRange,
            'Current Date' => [
                'Start' => $startDate->format('Y-m-d H:i:s'),
                'End' => $endDate->format('Y-m-d H:i:s')
            ],
            'Previous Date' => [
                'Start' => $previousStartDate->format('Y-m-d H:i:s'),
                'End' => $previousEndDate->format('Y-m-d H:i:s')
            ]
        ]);

        // Calculate trends
        $calculateTrend = function($current, $previous) {
            if ($current == 0 && $previous == 0) return 0;
            
            // ใช้ค่าที่มากกว่าเป็นฐานในการคำนวณ
            $baseValue = max($current, $previous);
            
            // คำนวณความแตกต่าง
            $difference = $current - $previous;
            
            // คำนวณ % ความแตกต่าง
            $percentDiff = ($difference / $baseValue) * 100;

            // Debug logging
            Log::info('Trend Calculation', [
                'Current' => $current,
                'Previous' => $previous,
                'Base Value' => $baseValue,
                'Difference' => $difference,
                'Percent Diff' => $percentDiff
            ]);
            
            return round($percentDiff, 1);
        };

        $salesTrend = $calculateTrend($currentSales, $previousSales);
        $ordersTrend = $calculateTrend($currentOrders, $previousOrders);
        $avgTrend = $calculateTrend($currentAvg, $previousAvg);

        // Debug logging
        Log::info('Final Trends', [
            'Sales Trend' => $salesTrend,
            'Orders Trend' => $ordersTrend,
            'Average Trend' => $avgTrend
        ]);

        $salesData = [
            'total_sales' => $currentSales,
            'total_orders' => $currentOrders,
            'average_order_value' => $currentAvg,
            'sales_trend' => $salesTrend,
            'orders_trend' => $ordersTrend,
            'avg_order_trend' => $avgTrend,
            'settings' => [
                'vat_rate' => $vatRate
            ]
        ];

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

        // Product Sales Data for Bar Chart
        $productSales = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('orders.status', 'completed')
            ->select(
                'products.id',
                'products.name as product_name',
                DB::raw('COALESCE(SUM(order_details.quantity), 0) as quantity_sold')
            )
            ->groupBy('products.id', 'products.name')
            ->orderBy('quantity_sold', 'asc') // เรียงจากน้อยไปมาก
            ->get()
            ->toArray();

        // Ingredient Usage Data
        $ingredientUsage = DB::table('product_ingredient_usages')
            ->join('ingredients', 'product_ingredient_usages.ingredient_id', '=', 'ingredients.id')
            ->join('units', 'ingredients.unit_id', '=', 'units.id')
            ->whereBetween('product_ingredient_usages.created_at', [$startDate, $endDate])
            ->where('product_ingredient_usages.usage_type', 'USE')
            ->select(
                'ingredients.name',
                DB::raw('SUM(product_ingredient_usages.amount) as total_amount'),
                'units.name as unit'
            )
            ->groupBy('ingredients.id', 'ingredients.name', 'units.name')
            ->orderBy('total_amount', 'desc')
            ->limit(10)
            ->get()
            ->toArray();

        // Inventory Status
        Log::info('Starting inventory status calculation');

        $ingredients = Ingredient::with('unit')
            ->select('ingredients.*')
            ->get()
            ->map(function($ingredient) {
                Log::info("Ingredient: {$ingredient->name}", [
                    'id' => $ingredient->id,
                    'quantity' => $ingredient->quantity,
                    'minimum_stock' => $ingredient->minimum_stock ?? 10
                ]);

                return [
                    'name' => $ingredient->name,
                    'total_quantity' => $ingredient->quantity ?? 0,
                    'unit' => $ingredient->unit->name ?? 'หน่วย',
                    'status' => ($ingredient->quantity ?? 0) < ($ingredient->minimum_stock ?? 10) ? 'low' : 'normal',
                    'minimum_stock' => $ingredient->minimum_stock ?? 10
                ];
            });

        Log::info('Finished inventory status calculation', [
            'total_ingredients' => $ingredients->count(),
            'low_stock_count' => $ingredients->where('status', 'low')->count()
        ]);

        // Expenses Summary
        $expenses = Expense::join('expense_categories', 'expenses.expense_category_id', '=', 'expense_categories.id')
            ->whereBetween('expenses.created_at', [$startDate, $endDate])
            ->select(
                'expense_categories.name as category',
                DB::raw('SUM(expenses.amount) as total_amount')
            )
            ->groupBy('expense_categories.id', 'expense_categories.name')
            ->get();

        // Calculate total expenses
        $totalExpenses = $expenses->sum('total_amount');
        
        // Calculate percentages
        $expenses = $expenses->map(function($expense) use ($totalExpenses) {
            return [
                'category' => $expense->category,
                'total_amount' => $expense->total_amount,
                'percentage' => $totalExpenses > 0 ? round(($expense->total_amount / $totalExpenses) * 100, 2) : 0
            ];
        });

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
            'auth' => [
                'user' => $request->user(),
            ],
            'salesData' => $salesData,
            'topProducts' => $topProducts,
            'ingredients' => $ingredients,
            'expenses' => $expenses,
            'hourlySales' => $hourlySales,
            'filters' => [
                'dateRange' => $dateRange,
                'startDate' => $startDate->format('Y-m-d'),
                'endDate' => $endDate->format('Y-m-d'),
            ],
            'ingredientUsage' => $ingredientUsage,
            'productSales' => $productSales,
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
