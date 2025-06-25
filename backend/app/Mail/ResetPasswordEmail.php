<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $link;

    public function __construct($link)
    {
        $this->link = $link;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Password',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.resetpassword',
            with: ['link' => $this->link]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}