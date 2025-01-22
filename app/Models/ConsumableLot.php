<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsumableLot extends Model
{
    use HasFactory;

    protected $fillable = [
        'lot_number',
        'note',
        'user_id',
    ];

    protected $casts = [
        'lot_number' => 'integer',
        'note' => 'string',
        'user_id' => 'integer',
    ];

    public function details()
    {
        return $this->hasMany(ConsumableLotDetail::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
