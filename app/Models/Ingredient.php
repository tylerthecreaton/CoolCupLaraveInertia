<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Unit;

class Ingredient extends Model
{
    protected $fillable = [
        'name',
        'quantity',
        'unit_id',
        'expiration_date',
        'image',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
