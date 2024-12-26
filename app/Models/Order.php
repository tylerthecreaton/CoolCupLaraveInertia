<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'total_amount',
        'payment_method',
        'customer_id',
        'receipt_path',
        'discount',
        'grand_total',
        'status',
    ];


    public static function generateOrderNumber()
    {
        $lastOrder = self::orderBy('order_number', 'desc')->first();
        return $lastOrder ? $lastOrder->order_number + 1 : 1;
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
