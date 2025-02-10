<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SlipController extends Controller
{
    public function index()
    {
        $pendingSlips = Order::where('payment_method', 'qr')
            ->whereNull('payment_slip')
            ->orderBy('created_at', 'desc')
            ->with(['orderItems.product', 'customer'])
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total' => $order->total,
                    'created_at' => $order->created_at,
                    'customer_name' => $order->customer ? $order->customer->name : 'Walk-in Customer',
                    'items' => $order->orderItems->map(function ($item) {
                        return [
                            'name' => $item->product->name,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                        ];
                    })
                ];
            });

        return Inertia::render('SlipUpload/Index', [
            'pendingSlips' => $pendingSlips
        ]);
    }

    public function upload(Request $request, $orderId)
    {
        $request->validate([
            'slip' => 'required|image|max:2048'
        ]);

        $order = Order::findOrFail($orderId);

        if ($request->hasFile('slip')) {
            $path = $request->file('slip')->store('slips', 'public');
            $order->payment_slip = $path;
            $order->payment_confirmed_at = now();
            $order->save();
        }

        return response()->json(['success' => true]);
    }
}
