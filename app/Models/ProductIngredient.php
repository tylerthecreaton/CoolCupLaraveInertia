<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductIngredient extends Model
{
    protected $fillable = [
        'product_id',
        'ingredient_id',
        'quantity_used',
        'quantity_size_s',
        'quantity_size_m',
        'quantity_size_l',
    ];

    protected $casts = [
        'quantity_used' => 'float',
        'quantity_size_s' => 'float',
        'quantity_size_m' => 'float',
        'quantity_size_l' => 'float',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }
}
