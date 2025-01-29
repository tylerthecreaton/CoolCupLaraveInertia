<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductConsumableUsage extends Model
{
    protected $fillable = [
        'consumable_id',
        'quantity_used',
        'order_detail_id',
        'usage_type',
        'reference_no',
        'note',
        'created_by',
    ];

    public function consumable()
    {
        return $this->belongsTo(Consumable::class);
    }

    public function orderDetail()
    {
        return $this->belongsTo(OrderDetail::class);
    }
}
