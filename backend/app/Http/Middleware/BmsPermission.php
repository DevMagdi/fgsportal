<?php
namespace App\Http\Middleware;

use App\Services\BMS\BmsAccess;
use Closure;
use Illuminate\Http\Request;

class BmsPermission
{
    public function handle(Request $request, Closure $next, string $ability)
    {
        app(BmsAccess::class)->authorize($ability);
        return $next($request);
    }
}
