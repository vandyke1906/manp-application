<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        //return $next($request);
        // Handle preflight OPTIONS request
        if ($request->isMethod('OPTIONS')) {
            return response()->json([], 200, [
                'Access-Control-Allow-Origin' => 'http://localhost:5173',
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, X-XSRF-TOKEN, Authorization',
                'Access-Control-Allow-Credentials' => 'true',
            ]);
        }

        // Set CORS headers in all responses
        $response = $next($request);
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-XSRF-TOKEN, Authorization');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;

    }
}
