<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationEmail extends Mailable
{
    use Queueable, SerializesModels;
    public $code;

    public function __construct($code)
    {
        $this->code = $code;
    }


    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verification Email',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verification',
            with: ['code' => $this->code]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
