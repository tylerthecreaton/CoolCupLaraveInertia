<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Ingredient;
use App\Models\IngredientLot;

class IngredientLotDetail extends Model
{
    protected $fillable = [
        'ingredient_lot_id',
        'lot_number',
        'ingredient_id',
        'type',
        'quantity',
        'expiration_date',
        'price',
        'cost_per_unit',
        'per_pack',
        'supplier',
        'note'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'cost_per_unit' => 'decimal:2',
        'per_pack' => 'integer',
        'expiration_date' => 'date'
    ];

    public function lot()
    {
        return $this->belongsTo(IngredientLot::class, 'ingredient_lot_id');
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }
}
