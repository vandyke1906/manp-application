<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proponent extends Model
{
    /** @use HasFactory<\Database\Factories\ProponentFactory> */
    use HasFactory;

    //if you dont want to make fillable for one by one
    //protected $guarded = [];


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'contact_number',
        'email_address',
        'establishment',
        'address',
        'area_occupied',
        'capital_declaration',
        'zoning_id',
        'business_type_id',
    ];

}
