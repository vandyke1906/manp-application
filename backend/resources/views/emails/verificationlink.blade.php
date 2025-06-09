<!DOCTYPE html>
<html>
<head>
    <title>Account Verification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .button {
            display: inline-block;
            padding: 10px 15px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
        .note { color: red; font-size: 14px; }
    </style>
</head>
<body>
    <p>Hi,</p>
    <p>Please click the button below to verify your account:</p>
    <p>
        <a href="{{ $verificationLink }}" class="button">Verify My Account</a>
    </p>
    <p class="note">This link is valid only for <strong>1 hour</strong>. After that, you will need to request a new verification email.</p>
    <p>If you didn't request this, please ignore this email.</p>
</body>
</html>