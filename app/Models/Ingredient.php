<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Unit;

class Ingredient extends Model
{
    protected $fillable = [
        'name',
        'quantity',
        'unit_id',
        'expiration_date',
        'is_sweetness',
        'image',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_ingredients')
            ->withPivot('quantity_used')
            ->withTimestamps();
    }

    public function lots()
    {
        return $this->hasMany(IngredientLot::class);
    }
}
