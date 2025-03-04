<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ReceiptHistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['customer', 'order_details']);

        // Apply date filters
        $filterType = $request->input('filterType', 'today');
        
        switch ($filterType) {
            case 'today':
                $query->whereDate('created_at', now());
                break;
            case 'week':
                $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'month':
                $year = (int)$request->input('year', now()->year);
                $month = (int)$request->input('month', now()->month);
                $query->whereYear('created_at', $year)
                      ->whereMonth('created_at', $month);
                break;
            case 'year':
                $year = (int)$request->input('year', now()->year);
                $query->whereYear('created_at', $year);
                break;
            case 'custom':
                if ($request->input('startDate') && $request->input('endDate')) {
                    $query->whereBetween('created_at', [$request->input('startDate'), $request->input('endDate')]);
                }
                break;
            case 'all':
                // ไม่ต้องใส่เงื่อนไขเพิ่มเติม แสดงทั้งหมด
                break;
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($order) {
                $orderDetails = $order->order_details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'product_name' => $detail->product_name,
                        'product_image' => $detail->product_image,
                        'size' => $detail->size,
                        'sweetness' => $detail->sweetness,
                        'quantity' => $detail->quantity,
                        'price' => $detail->price,
                        'toppings' => $detail->toppings->map(function ($topping) {
                            return [
                                'id' => $topping->id,
                                'name' => $topping->name,
                                'price' => $topping->price
                            ];
                        })
                    ];
                });

                // ตรวจสอบว่าไฟล์ใบเสร็จมีอยู่จริง
                $receiptPath = $order->receipt_path;
                $hasReceipt = $receiptPath && file_exists(public_path('images/receipt/' . $receiptPath));

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'created_at' => $order->created_at,
                    'customer' => $order->customer,
                    'order_details' => $orderDetails,
                    'total_amount' => $order->total_amount,
                    'payment_method' => $order->payment_method,
                    'receipt_path' => $hasReceipt ? $receiptPath : null,
                ];
            });

        return Inertia::render('ReceiptHistory', [
            'orders' => $orders,
            'filters' => [
                'type' => $filterType,
                'year' => (int)$request->input('year', now()->year),
                'month' => (int)$request->input('month', now()->month),
                'startDate' => $request->input('startDate'),
                'endDate' => $request->input('endDate'),
            ]
        ]);
    }
}
