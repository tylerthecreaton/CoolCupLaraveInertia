<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Ingredient;
use App\Models\User;

class IngredientLot extends Model
{
    protected $fillable = [
        'ingredient_id',
        'user_id',
        'quantity',
        'expiration_date',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'expiration_date' => 'date',
    ];

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
