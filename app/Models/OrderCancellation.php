<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderCancellation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_id',
        'user_id',
        'cancellation_reason',
        'is_restock_possible',
        'refunded_amount',
        'refunded_discount',
        'refunded_points',
        'expense_amount',
        'restored_ingredients',
        'restored_consumables',
    ];

    protected $casts = [
        'is_restock_possible' => 'boolean',
        'refunded_discount' => 'boolean',
        'refunded_amount' => 'decimal:2',
        'refunded_points' => 'decimal:2',
        'expense_amount' => 'decimal:2',
        'restored_ingredients' => 'array',
        'restored_consumables' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
