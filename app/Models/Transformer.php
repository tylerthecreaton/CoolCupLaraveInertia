<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transformer extends Model
{
    protected $table = 'transformers';

    protected $fillable = [
        'name',
        'description',
        'ingredient_lot_id',
        'consumable_lot_id',
        'multiplier'
    ];

    public function ingredientLot()
    {
        return $this->belongsTo(IngredientLot::class);
    }

    public function consumableLot()
    {
        return $this->belongsTo(ConsumableLot::class);
    }
}
