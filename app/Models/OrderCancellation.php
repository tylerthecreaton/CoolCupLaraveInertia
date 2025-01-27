<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderCancellation extends Model
{
    protected $fillable = [
        'order_id',
        'cancellation_reason',
        'is_restock_possible',
        'restocked_items',
        'refunded_amount',
        'refunded_discount',
        'refunded_points',
        'processed_by',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
