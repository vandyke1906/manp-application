<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL; // Added import for URL
use Illuminate\Support\Carbon; // Added import for Carbon
use Illuminate\Support\Facades\Config; // Added import for Config
use App\Mail\VerificationEmailLink;

class SendVerificationLink implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $email;
    protected $user;

    public function __construct($email, $user)
    {        
        $this->email = $email;
        $this->user = $user;
    }

    public function handle(): void
    {
        // Generate signed verification URL
        $signedVerificationUrl = URL::temporarySignedRoute(
            'verification.verify', // Ensure this route exists in web.php/api.php
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)), // Link expires in 60 minutes
            ['id' => $this->user->id, 'hash' => sha1($this->user->email)]
        );
        $verificationUrl = env('FRONTEND_URL') . "/verification?redirect=" . urlencode($signedVerificationUrl);
        Mail::to($this->email)->send(new VerificationEmailLink($verificationUrl));
    }
}