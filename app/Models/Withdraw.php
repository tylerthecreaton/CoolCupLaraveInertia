<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\WithdrawItem;
use App\Models\User;

class Withdraw extends Model
{
    use HasFactory;

    protected $table = 'withdraws';

    protected $fillable = [
        'user_id',
        'status',
        'note'
    ];

    public function items()
    {
        return $this->hasMany(WithdrawItem::class, 'withdraw_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
