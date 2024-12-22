<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'description',
        'type',
        'comment'
    ];

    public const TYPES = [
        'general' => 'ทั่วไป',
        'email' => 'อีเมล',
        'payment' => 'การชำระเงิน',
        'system' => 'ระบบ',
        'other' => 'อื่นๆ'
    ];
}
