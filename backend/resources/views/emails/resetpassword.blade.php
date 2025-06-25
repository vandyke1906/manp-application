<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
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
        <p>We received a request to reset your password. If you made this request, click the link below to reset it:</p>

        <p>
            <a href="{{ $link }}" style="color: inherit; text-decoration: underline; font-weight: bold;">
                Click here to reset your password
            </a>
        </p>

        <p class="note">Note: This reset link is valid for <strong>5 minutes</strong>. If it expires, you’ll need to request a new one. Once used, the link will no longer be valid.</p>

        <p>If you did not request a password reset, please ignore this message.</p>

        <p class="footer">
            &mdash;<br />
            Mount Apo Natural Park – Protected Area Management Office
        </p>
    </div>
</body>
</html>