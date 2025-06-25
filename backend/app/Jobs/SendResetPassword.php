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
use App\Mail\ResetPasswordEmail;
use Illuminate\Support\Facades\Log;

class SendResetPassword implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $email;

    public function __construct($email,)
    {        
        $this->email = $email;
    }

    public function handle(): void
    {
        // Generate signed verification URL
        $signedUrl = URL::temporarySignedRoute(
            'password.reset.verify', // Make sure this named route exists
            Carbon::now()->addMinutes(5), // Link expires in 5 minutes
            [
                'email' => $this->email,
                'hash' => sha1($this->email), // Or use a secure token if stored
            ]
        );

        $url = env('FRONTEND_URL') . "/reset-password?redirect=" . urlencode($signedUrl);
        Log::info("Reset Password for $this->email is: $url");
        Mail::to($this->email)->send(new ResetPasswordEmail($url));
    }
}