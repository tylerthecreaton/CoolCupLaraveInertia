<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Ingredient;
use App\Models\UnitConversion;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'abbreviation',
        'type'
    ];

    public function ingredients()
    {
        return $this->hasMany(Ingredient::class);
    }

    /**
     * Get all conversions where this unit is the source unit
     */
    public function fromConversions()
    {
        return $this->hasMany(UnitConversion::class, 'from_unit_id');
    }

    /**
     * Get all conversions where this unit is the target unit
     */
    public function toConversions()
    {
        return $this->hasMany(UnitConversion::class, 'to_unit_id');
    }

    /**
     * Get all units that this unit can be converted to
     */
    public function convertibleTo()
    {
        return $this->belongsToMany(Unit::class, 'unit_conversions', 'from_unit_id', 'to_unit_id')
            ->withPivot('conversion_factor', 'notes');
    }

    /**
     * Get all units that can be converted to this unit
     */
    public function convertibleFrom()
    {
        return $this->belongsToMany(Unit::class, 'unit_conversions', 'to_unit_id', 'from_unit_id')
            ->withPivot('conversion_factor', 'notes');
    }
}
