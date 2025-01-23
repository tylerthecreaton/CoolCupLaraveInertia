<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consumable extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'unit',
        'quantity',
        'is_depend_on_sale',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity' => 'integer',
        'unit' => 'string',
        'name' => 'string',
        'is_depend_on_sale' => 'boolean',
    ];

    public function transformers()
    {
        return $this->hasMany(Transformer::class);
    }
}
