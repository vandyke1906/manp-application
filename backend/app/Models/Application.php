<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    /** @use HasFactory<\Database\Factories\ApplicationFactory> */
    use HasFactory;

    protected $fillable = [
        'application_date',
        'application_type_id',
        'user_id',
        'business_name',
        'business_nature_id',
        'applicant_type_id',
        'business_address',
        'business_status_id',
        'capitalization_id',
        'status',
        'application_number',
    ];
}
