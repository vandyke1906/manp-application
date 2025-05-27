<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessNature extends Model
{
    /** @use HasFactory<\Database\Factories\BusinessNatureFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];
}
