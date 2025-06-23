<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            background-color: #f9f9f9;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .note {
            margin-top: 20px;
            font-size: 14px;
            color: #e55353;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <p>Hello,</p>
        <p>Thank you for registering with us. To complete your account setup, please verify your email address by visiting the link below:</p>

        <p>
            <a href="{{ $verificationLink }}" style="color: inherit; text-decoration: underline; font-weight: bold;">
                Click here to verify your account
            </a>
        </p>

        <p class="note">Note: This verification link is valid for <strong>1 hour</strong>. If it expires, you’ll need to request a new one.</p>

        <p>If you did not initiate this request, you may safely disregard this message.</p>

        <p class="footer">
            &mdash;<br />
            Mount Apo Natural Park – Protected Area Management Office
        </p>
    </div>
</body>
</html>