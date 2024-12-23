<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\ProductIngredients;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $lastOrder = Order::latest()->first();

        $order = new Order();
        $order->user_id = Auth::user()->id;
        if ($request->get("memberPhone")) {
            $order->customer_id = $this->findCustomerIdFromPhoneNumber($request->get("memberPhone"));
        }
        $cart = $request->get("cart");
        $order->order_number = $cart['currentOrderNumber'] ?? $lastOrder->order_number + 1;
        $order->total_amount = $cart['total'];
        $order->discount_amount = $cart['discount'];
        $order->final_amount = $cart['finalTotal'];
        $order->payment_method = $request->get("selectedMethod");
        $order->cash = $request->get("cashReceived");
        $order->file_name = '';
        $order->payment_note = $request->get("paymentNote");
        $order->received_points = $this->calculatePoint(total: $cart['total']);
        $order->total_Items = $this->calculateTotalItems($cart['items']);
        $order->save();
        if ($request->get("memberPhone")) {
            $this->addPointToCustomer($cart['total'], $request->get("memberPhone"));
        }
        //TODO: หาเบอร์ลูกค้าก่อนบันทึก

        $this->saveOrderDetails($cart['items'], $order->id);

        return Order::with([
            'orderDetails',
            'user',
            'customer',
        ])->find($order->id);
    }

    public function receiptHistory()
    {
        $orders = Order::with(['orderDetails', 'customer'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('ReceiptHistory', [
            'orders' => $orders
        ]);
    }

    private function findCustomerIdFromPhoneNumber(string $phoneNumber): ?string
    {
        $customer = Customer::where('phone_number', $phoneNumber)->first();
        return $customer ? $customer->id : null;
    }

    private function addPointToCustomer(float $total, string $phoneNumber)
    {
        $customer = Customer::where('phone_number', $phoneNumber)->first();
        if ($customer) {
            $customer->loyalty_points += $this->calculatePoint(total: $total);
            $customer->save();
        }
    }


    private function calculatePoint(float $total)
    {
        $settings = Setting::where('key', 'point_rate')->first();
        $point = $total * $settings->value;
        return $point ?? 0;
    }

    private function calculateIngredients(String $productId)
    {
        $productIngredients = ProductIngredients::where('product_id', $productId)->get();
        dd($productIngredients);
    }


    private function saveOrderDetails(array $items, int $orderId)
    {

        //         "id" => 1734874136638
        //         "productId" => 4
        //         "name" => "เอสเปรสโซ่"
        //         "image" => "/images/products/1734445766.jpg"
        //         "price" => 50
        //         "quantity" => 1
        //         "size" => "S"
        //         "sweetness" => "100%"
        //         "toppings" => []
        //       ]
        foreach ($items as $item) {
            $orderDetail = new OrderDetail();
            $orderDetail->order_id = $orderId;
            $orderDetail->product_id = $item['productId'];
            $orderDetail->line_item_id = $item['id'];
            $orderDetail->product_name = $item['name'];
            $orderDetail->product_image = $item['image'];
            $orderDetail->price = $item['price'];
            $orderDetail->size = $item['size'];
            $orderDetail->sweetness = $item['sweetness'];
            $orderDetail->toppings = json_encode($item['toppings']);
            $orderDetail->quantity = $item['quantity'];
            $orderDetail->subtotal = $item['quantity'] * $item['price']; // TODO: Calculate subtotal
            $orderDetail->save();
        }
    }

    private function calculateTotalItems(array $items)
    {
        $totalItems = 0;
        foreach ($items as $item) {
            $totalItems += $item['quantity'];
        }
        return $totalItems;
    }
}
