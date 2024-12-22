<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductIngredients;
use App\Models\Setting;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {

        //         array:7 [▼ // app\Http\Controllers\OrderController.php:11
        //   "selectedMethod" => "cash"
        //   "cashReceived" => "100"
        //   "showQR" => false
        //   "paymentFile" => null
        //   "paymentNote" => null
        //   "cart" => array:7 [▼
        //     "key" => 52
        //     "items" => array:2 [▼
        //       0 => array:9 [▼
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
        //       1 => array:9 []
        //     ]
        //     "total" => 100
        //     "totalItems" => 2
        //     "discount" => 0
        //     "finalTotal" => 100
        //     "currentOrderNumber" => 28
        //   ]
        //   "memberPhone" => null
        // ]
    }

    private function addPointToCustomer(float $total, string $customer_id)
    {
        $customer = Customer::find($customer_id);
        $customer->point += $this->calculatePoint($total);
        $customer->save();
    }

    private function calculatePoint(float $total)
    {
        $settings = Setting::where('key', 'point_rate')->first();
        $point = $total * $settings->value;
        return $point;
    }

    private function calculateIngredients(String $productId)
    {
        $productIngredients = ProductIngredients::where('product_id', $productId)->get();
    }
}
