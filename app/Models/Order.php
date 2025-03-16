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
        'discount_amount',
        'discount_type',
        'manual_discount_amount',
        'final_amount',
        'received_points',
        'point_discount_amount',
        'used_points',
        'vat_rate',
        'vat_amount',
        'subtotal_before_vat',
    ];

    protected $with = ['orderDetails', 'customer'];

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

    public function cancellation()
    {
        return $this->hasOne(OrderCancellation::class);
    }

    public function pointUsages()
    {
        return $this->hasMany(PointUsage::class);
    }

    public function getCanBeCancelledAttribute()
    {
        return $this->status === 'completed';
    }
}
