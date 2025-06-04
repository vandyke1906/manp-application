<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationFiles extends Model
{
    /** @use HasFactory<\Database\Factories\ApplicationFilesFactory> */
    use HasFactory;

    protected $fillable = [
        'application_id',
        'name',
        'file_type',
        'file_size',
        'file_name',
        'file_path',
    ];
}
