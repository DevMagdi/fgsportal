<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    public function handle(Request $request, Closure $next): Response
    {
        $isBms = $request->is('api/bms', 'api/bms/*', 'bms/meeting-response/*');
        if (!$isBms) {
            $response = $request->isMethod('OPTIONS') ? response('', 204) : $next($request);
            return $response
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        }

        $origin = $request->headers->get('Origin');
        $allowedOrigins = config('bms.cors_allowed_origins', []);
        $allowed = $origin && in_array($origin, $allowedOrigins, true);
        $response = $request->isMethod('OPTIONS')
            ? response('', 204)
            : $next($request);

        $response->headers->set('Vary', 'Origin');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        if ($allowed) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set(
                'Access-Control-Allow-Headers',
                'Authorization, Content-Type, Accept, X-Requested-With'
            );
        }

        return $response;
    }
}
