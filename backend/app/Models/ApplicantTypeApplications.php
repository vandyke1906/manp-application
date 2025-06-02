<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicantTypeApplications extends Model
{
    /** @use HasFactory<\Database\Factories\ApplicantApplicantTypesFactory> */
    use HasFactory;

    protected $fillable = [
        'application_id',
        'applicant_type_id',
    ];
}
