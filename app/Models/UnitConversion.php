<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Unit;

class UnitConversion extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_unit_id',
        'to_unit_id',
        'conversion_factor',
        'notes'
    ];


    public function fromUnit()
    {
        return $this->belongsTo(Unit::class, 'from_unit_id');
    }


    public function toUnit()
    {
        return $this->belongsTo(Unit::class, 'to_unit_id');
    }


    public function convert($value)
    {
        return $value * $this->conversion_factor;
    }

    
    public function convertBack($value)
    {
        return $value / $this->conversion_factor;
    }
}
