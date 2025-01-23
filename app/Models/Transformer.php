<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transformer extends Model
{
    protected $table = 'transformers';

    protected $fillable = [
        'name',
        'description',
        'ingredient_id',
        'consumable_id',
        'multiplier'
    ];

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }

    public function consumable()
    {
        return $this->belongsTo(Consumable::class);
    }
}
