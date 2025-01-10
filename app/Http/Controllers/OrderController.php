<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\PointUsage;
use App\Models\Product;
use App\Models\ProductIngredients;
use App\Models\ProductIngredientUsage;
use App\Models\PromotionUsage;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $order = new Order();
        $order->user_id = Auth::user()->id;
        $order->username = Auth::user()->username;
        if ($request->get("memberPhone")) {
            $order->customer_id = $this->findCustomerIdFromPhoneNumber($request->get("memberPhone"));
        }
        $cart = $request->get("cart");
        $order->order_number = Order::generateOrderNumber();
        $order->total_amount = $cart['subtotal'];
        $order->discount_amount = $cart['totalDiscount'];
        $order->discount_type = $cart['discountType'];
        $order->manual_discount_amount = $cart['manualDiscountAmount'];
        $order->final_amount = $cart['total'];
        $order->payment_method = $request->get("selectedMethod");
        $order->cash = $request->get("cashReceived");
        $order->file_name = '';
        $order->payment_note = $request->get("paymentNote");
        $order->received_points = $this->calculatePoint(total: $cart['total']);
        $order->total_Items = $this->calculateTotalItems($cart['items']);
        $order->save();
        if ($request->get("memberPhone")) {
            $this->addPointToCustomer($cart['total'], $request->get("memberPhone"), $order->id);
        }

        $this->saveOrderDetails($cart['items'], $order->id);

        if ($cart['appliedPromotion']) {
            $onlyPromotionDiscount  = $cart['manualDiscountAmount'] + $cart['pointDiscountAmount'];
            $this->savePromotionUsage($cart['appliedPromotion'], $onlyPromotionDiscount, $order->id);
        }
        if ($cart['usedPoints']) {
            $this->saveUsedPoints($cart['usedPoints'], $cart['pointDiscountAmount'], $order->id, $order->customer_id);
        }

        return Order::with([
            'orderDetails',
            'user',
            'customer',
        ])->find($order->id);
    }

    public function getLastOrderNumber()
    {
        $lastOrder = Order::orderBy('order_number', 'desc')->first();
        return response()->json([
            'nextOrderNumber' => $lastOrder ? $lastOrder->order_number + 1 : 1
        ]);
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

    private function addPointToCustomer(float $total, string $phoneNumber, $orderId)
    {
        $customer = Customer::where('phone_number', $phoneNumber)->first();
        if ($customer) {
            $customer->loyalty_points += $this->calculatePoint(total: $total);
            $customer->save();
        }

        $this->recordPointUsage($this->calculatePoint(total: $total), $total, $orderId, $customer->id, 'plus');
    }


    private function calculatePoint(float $total)
    {
        $settings = Setting::where('key', 'point_rate')->first();
        $point = $total * $settings->value;
        return $point ?? 0;
    }

    private function calculateIngredients(array $item, $orderDetailId)
    {
        if (isset($item['isDiscount']) && $item['isDiscount']) {
            return;
        }
        $product = Product::find($item['productId']);
        if ($product) {
            $productIngredients = ProductIngredients::where('product_id', $product->id)->get();
            foreach ($productIngredients as $productIngredient) {
                $ingredient = Ingredient::find($productIngredient->ingredient_id);
                if ($ingredient) {
                    $usedQuantity = $item['quantity'] * $productIngredient->quantity_used;

                    // บันทึกการใช้วัตถุดิบ
                    $usage = new ProductIngredientUsage();
                    $usage->order_detail_id = $orderDetailId;
                    $usage->ingredient_id = $ingredient->id;
                    $usage->amount = -$usedQuantity;
                    $usage->usage_type = 'USE';
                    $usage->created_by = Auth::user()->id;
                    $usage->note = "ใช้ในออเดอร์ดีเทล #" . $orderDetailId;
                    $usage->save();

                    // อัพเดทจำนวนวัตถุดิบ
                    $ingredient->quantity = max(0, $ingredient->quantity - $usedQuantity);
                    $ingredient->save();
                }
            }
        }
    }

    public function saveToIngredientUsageTable($detail)
    {
        $ingredientUsage = new ProductIngredientUsage();
        $ingredientUsage->order_detail_id = $detail['order_detail_id'];
        $ingredientUsage->ingredient_id = $detail['ingredient_id'];
        $ingredientUsage->amount = -$detail['quantity'];
        $ingredientUsage->usage_type = 'USE';
        $ingredientUsage->created_by = Auth::user()->id;
        $ingredientUsage->save();
    }

    private function saveOrderDetails(array $items, int $orderId)
    {

        foreach ($items as $item) {
            if (isset($item['isDiscount']) && $item['isDiscount']) {
                continue;
            }
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

            $this->calculateIngredients($item,  $orderDetail->id);
        }
    }

    private function savePromotionUsage($appliedPromotion, $discountAmount, $orderId)
    {
        if ($appliedPromotion) {
            $promotionUsage = new PromotionUsage();
            $promotionUsage->promotion_id = $appliedPromotion['id'];
            $promotionUsage->user_id = Auth::user()->id;
            $promotionUsage->order_id = $orderId;
            $promotionUsage->discount_amount = $discountAmount;
            $promotionUsage->promotion_type = $appliedPromotion['type'];
            $promotionUsage->promotion_value = $discountAmount;
            $promotionUsage->promotion_details = json_encode($appliedPromotion);
            $promotionUsage->save();
        }
    }

    private function saveUsedPoints($usedPoints, $pointDiscountAmount, $orderId, $customerId)
    {
        $order = Order::find($orderId);
        $order->used_points = $usedPoints;
        $order->point_discount_amount = $pointDiscountAmount;
        $order->save();

        $this->chargeCustomerPoints($customerId, $usedPoints);

        $this->recordPointUsage($usedPoints, $pointDiscountAmount, $orderId, $customerId);
    }

    private function chargeCustomerPoints($customerId, $pointsUsed, $type = 'minus')
    {
        $customer = Customer::find($customerId);
        if ($type == 'minus') {
            $customer->loyalty_points -= $pointsUsed;
        } else {
            $customer->loyalty_points += $pointsUsed;
        }
        $customer->save();
    }

    private function recordPointUsage($pointAmount, $pointDiscountAmount, $orderId, $customerId, $type = 'minus')
    {
        $pointUsage = new PointUsage();
        $pointUsage->order_id = $orderId;
        $pointUsage->customer_id = $customerId;
        $pointUsage->point_amount = $pointAmount;
        $pointUsage->point_discount_amount = $pointDiscountAmount;
        $pointUsage->user_id = Auth::user()->id;
        $pointUsage->type = $type;
        $pointUsage->save();
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
