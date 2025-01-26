<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Ingredient;
use App\Models\IngredientLot;
use App\Models\Transformer;

class IngredientLotDetail extends Model
{
    protected $fillable = [
        'ingredient_lot_id',
        'lot_number',
        'ingredient_id',
        'transformer_id',
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
        'expiration_date' => 'date',
        'price' => 'float',
        'cost_per_unit' => 'float',
        'quantity' => 'float',
        'per_pack' => 'float',
    ];

    public function lot()
    {
        return $this->belongsTo(IngredientLot::class, 'ingredient_lot_id');
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }

    public function transformer()
    {
        return $this->belongsTo(Transformer::class);
    }
}
