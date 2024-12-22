<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\Ingredient;

class ProductIngredients extends Model
{
    protected $fillable = [
        'product_id',
        'ingredient_id',
        'quantity_used'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }
}
