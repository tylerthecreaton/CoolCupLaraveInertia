<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'name',
        'description',
        'cost_price',
        'sale_price',
        'image',
        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function ingredients()
    {
        return $this->hasMany(ProductIngredients::class);
    }

    public function getIngredients()
    {
        return $this->belongsToMany(Ingredient::class, 'product_ingredients')
            ->withPivot('quantity_used')
            ->withTimestamps();
    }

    public function consumables()
    {
        return $this->hasMany(ProductConsumables::class);
    }

    public function getConsumables()
    {
        return $this->belongsToMany(Consumable::class, 'product_consumables')
            ->withPivot('quantity_used')
            ->withTimestamps();
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
}
