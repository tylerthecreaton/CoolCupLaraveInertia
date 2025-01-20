<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Withdraws extends Model
{
    protected $table = 'withdraws';

    protected $fillable = [
        'user_id',
        'consumable_lot_id',
        'ingredient_lot_id',
        'quantity',
        'unit',
        'note',
        'status'
    ];
}
