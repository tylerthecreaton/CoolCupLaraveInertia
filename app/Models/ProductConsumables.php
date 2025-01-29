<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductConsumables extends Model
{
    protected $table = 'product_consumables';

    protected $fillable = [
        'product_id',
        'consumable_id',
        'quantity_used',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function consumable()
    {
        return $this->belongsTo(Consumable::class);
    }
}
