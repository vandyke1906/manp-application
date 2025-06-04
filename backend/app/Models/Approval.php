<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Approval extends Model
{
    /** @use HasFactory<\Database\Factories\ApprovalFactory> */
    use HasFactory;

    protected $fillable = [
        'application_id',
        'user_id',
        'approving_role',
        'comment',
        'status',
        'approved_at',
    ];

    public function approver()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function approver_name()
    {
        return $this->belongsTo(User::class, 'user_id')->select('id', 'first_name', 'middle_name', 'last_name', 'suffix');
    }


}
