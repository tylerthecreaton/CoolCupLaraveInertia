<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Ingredient;
use App\Models\User;

class ProductIngredientUsage extends Model
{
    protected $fillable = [
        'ingredient_id',
        'amount',
        'usage_type',
        'created_by',
        'note'
    ];

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }
}
