<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsumableLot extends Model
{
    use HasFactory;

    protected $fillable = [
        'consumable_id',
        'quantity',
        'cost_per_unit',
        'per_pack',
        'price',
        'note',
        'supplier',
        'user_id',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'cost_per_unit' => 'decimal:2',
        'per_pack' => 'decimal:2',
        'price' => 'decimal:2',
        'note' => 'string',
        'supplier' => 'string',
        'user_id' => 'integer',
    ];

    public function consumable()
    {
        return $this->belongsTo(Consumable::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function calculateRemainingQuantity()
    {
        if ($this->consumable->is_depend_on_sale) {
            // If depends on sale, we need to calculate based on sales
            // This is a placeholder - you'll need to implement the actual calculation
            // based on your sales tracking system
            $usedInSales = 0; // Calculate from sales records
            $this->remaining_quantity = $this->quantity - $usedInSales;
        } else {
            // For non-sale dependent items, remaining quantity is managed manually
            $this->remaining_quantity = $this->quantity;
        }
        return $this->remaining_quantity;
    }
}
