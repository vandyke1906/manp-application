<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // 'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    // 'allowed_origins' => ['http://mountapo-app.netlify.app', 'https://mountapo-app.netlify.app', 'http://localhost:5173'], // Allow React frontend
    'allowed_origins' => ["https://mountapo-app.netlify.app", "*"], // Allow React frontend
    'allowed_origins_patterns' => [],
    'exposed_headers' => ['Authorization'], // So frontend can access token headers (optional)
    'max_age' => 0,
    'supports_credentials' => false, //default is false
];
