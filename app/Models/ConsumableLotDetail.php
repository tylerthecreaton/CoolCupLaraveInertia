<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsumableLotDetail extends Model
{
    public $fillable = [
        'consumable_lot_id',
        'consumable_id',
        'transformer_id',
        'quantity',
        'type',
        'price',
        'per_pack',
        'cost_per_unit',
        'supplier',
        'note',
    ];
    protected $table = 'consumable_lot_details';

    public function consumableLot()
    {
        return $this->belongsTo(ConsumableLot::class);
    }

    public function consumable()
    {
        return $this->belongsTo(Consumable::class);
    }
}
