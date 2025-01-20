<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsumablesLot extends Model
{

    protected $fillable = [
        'consumable_id',
        'lot_number',
        'quantity',
        'expiry_date',
    ];
}
