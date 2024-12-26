<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promotion extends Model
{
    protected $guarded = [];

    protected $casts = [
        'buy_x_get_y' => 'json',
        'category' => 'json',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'percentage' => 'decimal:2',
        'fixed' => 'decimal:2'
    ];

    public function usages(): HasMany
    {
        return $this->hasMany(PromotionUsage::class);
    }
}
