<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ReceiptHistoryController extends Controller
{
    public function index()
    {
        $orders = Order::with(['customer', 'order_details'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                $orderDetails = $order->order_details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'product_name' => $detail->product_name,
                        'product_image' => $detail->product_image,
                        'size' => $detail->size,
                        'sweetness' => $detail->sweetness,
                        'quantity' => $detail->quantity,
                        'price' => $detail->price,
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
            'orders' => $orders
        ]);
    }
}
