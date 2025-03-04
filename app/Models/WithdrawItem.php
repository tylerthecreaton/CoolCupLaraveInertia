<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Withdraw;
use App\Models\IngredientLot;
use App\Models\ConsumableLot;
use App\Models\Transformer;
use App\Models\IngredientLotDetail;
use App\Models\ConsumableLotDetail;

class WithdrawItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'withdraw_id',
        'type',
        'ingredient_lot_id',
        'consumable_lot_id',
        'transformer_id',
        'quantity',
        'unit',
        'ingredient_lot_detail_id',
        'consumable_lot_detail_id'
    ];

    public function withdraw()
    {
        return $this->belongsTo(Withdraw::class);
    }

    public function ingredientLot()
    {
        return $this->belongsTo(IngredientLot::class);
    }

    public function consumableLot()
    {
        return $this->belongsTo(ConsumableLot::class);
    }

    public function transformer()
    {
        return $this->belongsTo(Transformer::class);
    }

    public function ingredientLotDetail()
    {
        return $this->hasOne(IngredientLotDetail::class, 'id', 'ingredient_lot_detail_id');
    }

    public function consumableLotDetail()
    {
        return $this->hasOne(ConsumableLotDetail::class, 'id', 'consumable_lot_detail_id');
    }
}
