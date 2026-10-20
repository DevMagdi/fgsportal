<?php


namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  int  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$role)
    {
        $userRoleId = auth()->user()->id; // Adjust this according to your user role structure

        $hasPermission = DB::table('user_permission_groups')
            ->where('users_id', $userRoleId)
            ->where('permissions_id', $role)
            ->exists();

        if (!$hasPermission) {
            $array=[
                'data' =>  ['message' => 'Forbidden'],
                'message'=> 'Forbidden',
                'status'=>403
              ];
              return response($array);
         }

        return $next($request);
    }
}
