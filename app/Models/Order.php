<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'customer_id',
        'payment_method',
        'total',
        'discount',
        'grand_total',
        'status',
        'order_number'
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
