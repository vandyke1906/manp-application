<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zoning extends Model
{
    /** @use HasFactory<\Database\Factories\ZoningFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];
}
