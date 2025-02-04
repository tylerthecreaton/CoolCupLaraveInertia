<?php

namespace App\Http\Controllers;

use App\Models\Consumable;
use App\Models\Customer;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\PointUsage;
use App\Models\Product;
use App\Models\ProductConsumables;
use App\Models\ProductConsumableUsage;
use App\Models\ProductIngredients;
use App\Models\ProductIngredientUsage;
use App\Models\PromotionUsage;
use App\Models\Setting;
use App\Services\OrderCancellationService;
use Doctrine\DBAL\Logging\Middleware;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Inertia\Inertia;

class OrderController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'role_or_permission:manager|view dashboard',
        ];
    }
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

    public function receiptHistory(Request $request)
    {
        $query = Order::with(['orderDetails', 'customer'])
            ->orderBy('created_at', 'desc');

        // Apply date filters
        $filterType = $request->get('filterType', 'today');
        switch ($filterType) {
            case 'all':
                break;
            case 'today':
                $query->whereDate('created_at', now());
                break;
            case 'week':
                $query->whereBetween('created_at', [
                    now()->startOfWeek(),
                    now()->endOfWeek()
                ]);
                break;
            case 'custom':
                $startDate = $request->get('startDate');
                $endDate = $request->get('endDate');
                if ($startDate && $endDate) {
                    $query->whereBetween('created_at', [
                        $startDate . ' 00:00:00',
                        $endDate . ' 23:59:59'
                    ]);
                }
                break;
        }

        $orders = $query->paginate(10);

        return Inertia::render('ReceiptHistory', [
            'orders' => $orders,
            'filters' => [
                'type' => $filterType,
                'startDate' => $request->get('startDate'),
                'endDate' => $request->get('endDate'),
            ]
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

    private function calculateIngredients(array $item, $orderDetailId, string $sweetness)
    {
        $product = Product::find($item['id']);
        if ($product) {
            try {
                $productIngredients = ProductIngredients::where('product_id', $product->id)->get();
                foreach ($productIngredients as $productIngredient) {
                    $ingredient = Ingredient::find($productIngredient->ingredient_id);
                    if ($ingredient) {
                        $usedQuantity = $item['quantity'] * $productIngredient->quantity_used;
                        $sweetnessRate = $ingredient->is_sweetness ? -$this->calculateSweetnessUsage($usedQuantity, $sweetness) : -$usedQuantity;

                        // บันทึกการใช้วัตถุดิบ
                        $usage = new ProductIngredientUsage();
                        $usage->order_detail_id = $orderDetailId;
                        $usage->ingredient_id = $ingredient->id;
                        $usage->amount =  $sweetnessRate;
                        $usage->usage_type = 'USE';
                        $usage->created_by = Auth::user()->id;
                        $usage->note = "ใช้ในออเดอร์ดีเทล #" . $orderDetailId;
                        $usage->save();

                        // อัพเดทจำนวนวัตถุดิบ
                        $ingredient->quantity = max(0, $ingredient->quantity + $sweetnessRate);
                        $ingredient->save();
                    }
                }
            } catch (\Exception $e) {
                throw new \Exception("Error calculating ingredients: " . $e->getMessage());
            }
        }
    }

    private function calculateSweetnessUsage($usedQuantity, $sweetness): float
    {
        $sweetnessRate = (int) preg_replace('/[^0-9]/', '', $sweetness);
        $result =  $usedQuantity * $sweetnessRate / 100;

        return $result;
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
            $orderDetail = new OrderDetail();
            $orderDetail->order_id = $orderId;
            $orderDetail->product_id = $item['id'];
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

            $this->calculateIngredients($item,  $orderDetail->id, $item['sweetness']);
            $this->calculateConsumable($item, $orderDetail->id);
            $this->calculateToppings($item, $orderDetail->id);
        }
    }

    private function calculateConsumable(array $item, int $orderDetailId)
    {
        $product = Product::find($item['id']);
        if ($product) {
            try {
                // Get consumables based on product size
                $consumables = ProductConsumables::where('product_id', $product->id)
                    ->where('size', $item['size'])
                    ->get();

                if (!$consumables->count()) {
                    return;
                }

                foreach ($consumables as $consumable) {
                    $consumableUsage = new ProductConsumableUsage();
                    $consumableUsage->order_detail_id = $orderDetailId;
                    $consumableUsage->consumable_id = $consumable->consumable_id;
                    $consumableUsage->quantity_used = $item['quantity'] * $consumable->quantity_used;
                    $consumableUsage->usage_type = 'USE';
                    $consumableUsage->created_by = Auth::user()->id;
                    $consumableUsage->note = "ใช้ในออเดอร์ดีเทล #" . $orderDetailId . " (ขนาด " . strtoupper($item['size']) . ")";
                    $consumableUsage->save();

                    // อัพเดทจำนวนวัตถุดิบ
                    $consumableModel = Consumable::find($consumable->consumable_id);
                    if ($consumableModel) {
                        $consumableModel->quantity = max(0, $consumableModel->quantity - $consumableUsage->quantity_used);
                        $consumableModel->save();
                    }
                }
            } catch (\Exception $e) {
                throw new \Exception("Error calculating ingredients: " . $e->getMessage());
            }
        }
    }

    private function calculateToppings(array $item, int $orderDetailId)
    {
        if (empty($item['toppings'])) {
            return;
        }

        // ถ้า toppings เป็น string (json) ให้แปลงเป็น array
        $toppings = is_string($item['toppings'])
            ? json_decode($item['toppings'], true)
            : $item['toppings'];

        if (!is_array($toppings)) {
            return;
        }

        foreach ($toppings as $topping) {
            // คำนวณ ingredients สำหรับ topping
            $this->calculateIngredients(
                [
                    'id' => $topping['id'],
                    'quantity' => $item['quantity'],
                    'sweetness' => '100%' // topping ใช้ความหวานปกติ
                ],
                $orderDetailId,
                '100%'
            );

            // คำนวณ consumables สำหรับ topping
            $this->calculateConsumable(
                [
                    'id' => $topping['id'],
                    'quantity' => $item['quantity'],
                    'size' => 'S' // topping มักจะมีขนาดเดียว
                ],
                $orderDetailId
            );
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

    public function cancel(Request $request, Order $order)
    {
        $request->validate([
            'cancellation_reason' => 'required|string|min:3',
            'is_restock_possible' => 'required|boolean',
            'refunded_amount' => 'required|numeric|min:0',
            'refunded_discount' => 'boolean',
            'refunded_points' => 'numeric|min:0',
        ]);

        try {
            $cancellationService = new OrderCancellationService();
            $cancellation = $cancellationService->cancelOrder($order, $request->all());

            return redirect()->back()->with('success', 'ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว');
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
