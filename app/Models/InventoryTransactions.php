<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryTransactions extends Model
{
    protected $fillable = ['ingredient_id', 'type', 'quantity', 'notes'];

    protected $casts = [
        'quantity' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    const TYPE_ADDED = 'Added';
    const TYPE_DEDUCTED = 'Deducted';

    public static function getTypes()
    {
        return [self::TYPE_ADDED, self::TYPE_DEDUCTED];
    }

    // Define relationship with Ingredient
    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class, 'ingredient_id');
    }
}
