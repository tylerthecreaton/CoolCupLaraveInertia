<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointUsage extends Model
{

    protected $fillable = [
        'order_id',
        'point_amount',
        'point_discount_amount',
        'type',
        'user_id',
        'customer_id',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
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
