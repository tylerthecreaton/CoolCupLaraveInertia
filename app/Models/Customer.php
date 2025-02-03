<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'customers';

    protected $fillable = [
        'name',
        'phone_number',
        'birthdate',
    ];

    public function pointUsages()
    {
        return $this->hasMany(PointUsage::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
