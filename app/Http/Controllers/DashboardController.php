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

            case 'yesterday':
                // เปรียบเทียบกับเมื่อวานซืน
                $previousStartDate = now()->subDays(2)->startOfDay();
                $previousEndDate = now()->subDays(2)->endOfDay();
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

            case 'thisYear':
                // เปรียบเทียบกับปีที่แล้ว
                $previousStartDate = now()->subYear()->startOfYear();
                $previousEndDate = now()->subYear()->endOfYear();
                break;

            default:
                // สำหรับช่วงเวลาที่กำหนดเอง ใช้ช่วงเวลาเท่ากันย้อนหลังไป
                $periodDiff = $endDate->diffInSeconds($startDate);
                $previousEndDate = (clone $startDate)->subSecond();
                $previousStartDate = (clone $previousEndDate)->subSeconds($periodDiff);
        }

        // Get VAT rate and tax rate from settings with proper type casting
        $vatRate = (float) (Setting::where('key', 'vat_rate')->value('value') ?? 7);
        $taxRate = (float) (Setting::where('key', 'tax_rate')->value('value') ?? 7);

        // Validate tax rate is within reasonable bounds
        $taxRate = max(0, min(100, $taxRate));

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

        // Previous period sales data with cost of goods sold
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

        // Get other expenses for the period
        $currentExpenses = Expense::whereBetween('created_at', [$startDate, $endDate])
            ->sum('amount') ?? 0;

        $previousExpenses = Expense::whereBetween('created_at', [$previousStartDate, $previousEndDate])
            ->sum('amount') ?? 0;

        // แปลงค่าให้เป็นตัวเลขและป้องกันค่า null
        $currentSales = (float) $currentSalesData->total_sales;
        $previousSales = (float) $previousSalesData->total_sales;
        $currentOrders = (int) $currentSalesData->total_orders;
        $previousOrders = (int) $previousSalesData->total_orders;
        $currentAvg = (float) $currentSalesData->average_order_value;
        $previousAvg = (float) $previousSalesData->average_order_value;
        $currentCostOfGoodsSold = (float) $currentSalesData->cost_of_goods_sold;
        $previousCostOfGoodsSold = (float) $previousSalesData->cost_of_goods_sold;

        // Cast expenses to float to ensure proper calculation
        $currentExpenses = (float) $currentExpenses;
        $previousExpenses = (float) $previousExpenses;

        // Calculate current and previous net profit
        // กำไรสุทธิ = (รายได้จากการขาย - ต้นทุนสินค้าที่ขาย - ค่าใช้จ่ายอื่น) × (1 - อัตราภาษี/100)
        $currentGrossProfit = $currentSales - $currentCostOfGoodsSold;
        $currentProfitBeforeTax = $currentGrossProfit - $currentExpenses;
        $currentNetProfit = $currentProfitBeforeTax > 0 
            ? $currentProfitBeforeTax * (1 - ($taxRate / 100))
            : $currentProfitBeforeTax;

        $previousGrossProfit = $previousSales - $previousCostOfGoodsSold;
        $previousProfitBeforeTax = $previousGrossProfit - $previousExpenses;
        $previousNetProfit = $previousProfitBeforeTax > 0
            ? $previousProfitBeforeTax * (1 - ($taxRate / 100))
            : $previousProfitBeforeTax;

        // Debug logging for profit calculation with more detail
        Log::info('Net Profit Calculation', [
            'Current Period' => [
                'Sales' => $currentSales,
                'Cost of Goods' => $currentCostOfGoodsSold,
                'Gross Profit' => $currentGrossProfit,
                'Expenses' => $currentExpenses,
                'Profit Before Tax' => $currentProfitBeforeTax,
                'Tax Rate' => $taxRate,
                'Net Profit' => $currentNetProfit
            ],
            'Previous Period' => [
                'Sales' => $previousSales,
                'Cost of Goods' => $previousCostOfGoodsSold,
                'Gross Profit' => $previousGrossProfit,
                'Expenses' => $previousExpenses,
                'Profit Before Tax' => $previousProfitBeforeTax,
                'Net Profit' => $previousNetProfit
            ]
        ]);

        // Calculate trends
        $calculateTrend = function($current, $previous) {
            // ถ้าทั้งค่าปัจจุบันและค่าก่อนหน้าเป็น 0 ให้คืนค่า 0
            if ($current == 0 && $previous == 0) return 0;
            
            // คำนวณเปอร์เซ็นต์การเปลี่ยนแปลง
            if ($previous != 0) {
                // ถ้าค่าก่อนหน้าไม่เป็น 0 ใช้สูตรปกติ
                $percentDiff = (($current - $previous) / abs($previous)) * 100;
            } else {
                // ถ้าค่าก่อนหน้าเป็น 0
                if ($current > 0) {
                    $percentDiff = 100; // เพิ่มขึ้น 100%
                } else {
                    $percentDiff = 0; // ไม่มีการเปลี่ยนแปลง
                }
            }

            // Debug logging
            Log::info('Trend Calculation', [
                'Current' => $current,
                'Previous' => $previous,
                'Percent Diff' => $percentDiff
            ]);

            return round($percentDiff, 1);
        };

        $salesTrend = $calculateTrend($currentSales, $previousSales);
        $ordersTrend = $calculateTrend($currentOrders, $previousOrders);
        $avgTrend = $calculateTrend($currentAvg, $previousAvg);
        $profitTrend = $calculateTrend($currentNetProfit, $previousNetProfit);

        // Debug logging
        Log::info('Final Trends', [
            'Sales Trend' => $salesTrend,
            'Orders Trend' => $ordersTrend,
            'Average Trend' => $avgTrend,
            'Profit Trend' => $profitTrend
        ]);

        $salesData = [
            'total_sales' => $currentSales,
            'total_orders' => $currentOrders,
            'average_order_value' => $currentAvg,
            'cost_of_goods_sold' => $currentCostOfGoodsSold,
            'other_expenses' => $currentExpenses,
            'net_profit' => $currentNetProfit,
            'sales_trend' => $salesTrend,
            'orders_trend' => $ordersTrend,
            'avg_order_trend' => $avgTrend,
            'profit_trend' => $profitTrend,
            'settings' => [
                'vat_rate' => $vatRate,
                'tax_rate' => $taxRate
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
                'roles' => $request->user() ? $request->user()->roles->pluck('name')->toArray() : [],
                'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name')->toArray() : [],
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
            return Carbon::parse($customStartDate);
        }

        return match ($dateRange) {
            'today' => Carbon::today(),
            'yesterday' => Carbon::yesterday(),
            'thisWeek' => Carbon::now()->startOfWeek(),
            'thisMonth' => Carbon::now()->startOfMonth(),
            'thisYear' => Carbon::now()->startOfYear(),
            default => Carbon::today(),
        };
    }

    private function getEndDate($dateRange, $customEndDate = null)
    {
        if ($customEndDate) {
            return Carbon::parse($customEndDate);
        }

        return match ($dateRange) {
            'today' => Carbon::today()->endOfDay(),
            'yesterday' => Carbon::yesterday()->endOfDay(),
            'thisWeek' => Carbon::now()->endOfWeek(),
            'thisMonth' => Carbon::now()->endOfMonth(),
            'thisYear' => Carbon::now()->endOfYear(),
            default => Carbon::today()->endOfDay(),
        };
    }
}
