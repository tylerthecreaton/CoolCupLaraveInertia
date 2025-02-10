<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SlipController extends Controller
{
    public function index()
    {
        $pendingSlips = Order::where('payment_method', 'qr_code')
            ->whereNull('payment_slip')
            ->orderBy('created_at', 'desc')
            ->with(['orderDetails.product', 'customer'])
            ->get()
            ->map(function ($order) {
                return $this->formatOrderData($order);
            });

        $uploadedSlips = Order::where('payment_method', 'qr_code')
            ->whereNotNull('payment_slip')
            ->orderBy('created_at', 'desc')
            ->with(['orderDetails.product', 'customer'])
            ->get()
            ->map(function ($order) {
                $data = $this->formatOrderData($order);
                $data['slip_url'] = asset('images/slip/' . $order->payment_slip);
                $data['confirmed_at'] = $order->payment_confirmed_at;
                return $data;
            });

        return Inertia::render('SlipUpload/Index', [
            'pendingSlips' => $pendingSlips,
            'uploadedSlips' => $uploadedSlips
        ]);
    }

    private function formatOrderData($order)
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'total' => $order->final_amount,
            'created_at' => $order->created_at,
            'customer_name' => $order->customer ? $order->customer->name : 'Walk-in Customer',
            'items' => $order->orderDetails->map(function ($item) {
                return [
                    'name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'price' => (float)$item->price,
                ];
            })
        ];
    }

    public function upload(Request $request, $orderId)
    {
        $request->validate([
            'slip' => 'required|image|max:2048'
        ]);

        $order = Order::findOrFail($orderId);

        if ($request->hasFile('slip')) {
            $image = $request->file('slip');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/images/slip/');
            $image->move($destinationPath, $name);
            $order->payment_slip = $name;
            $order->payment_confirmed_at = now();
            $order->save();
        }

        return response()->json(['success' => true]);
    }
}
