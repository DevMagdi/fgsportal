<?php

namespace App\Http\Middleware;

    use Closure;
    use JWTAuth;
    use Exception;
    use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;
    use App\Http\Controllers\ResponseTrait\ResponseApi;
    class JwtMiddleware extends BaseMiddleware
    {

        /**
         * Handle an incoming request.
         *
         * @param  \Illuminate\Http\Request  $request
         * @param  \Closure  $next
         * @return mixed
         */
        public function handle($request, Closure $next)
        {
            try {
                $user = JWTAuth::parseToken()->authenticate();
            } catch (Exception $e) {
                if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                    return  ResponseApi::tokenBadResponse(['status' => 'Token is Invalid'],"Token is Invalid",402);
             
                }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                     return  ResponseApi::tokenBadResponse(['status' => 'Token is Expired'],"Token is Expired",403);

                }else{
                     return  ResponseApi::tokenBadResponse(['status' => 'Authorization Token not found'],"Authorization Token not found",404);

                }
            }
            return $next($request);
        }
    }