<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Ingredient;
use App\Models\User;
use App\Models\IngredientLotDetail;

class IngredientLot extends Model
{
    protected $fillable = [
        'user_id',
        'lot_number',
        'note'
    ];

    public function details()
    {
        return $this->hasMany(IngredientLotDetail::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }
}
