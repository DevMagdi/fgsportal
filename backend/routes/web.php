<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use App\Http\Controllers\ApiMessage\MessageController;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/cron', function(){
    $a= App\Models\PhoneType::create(['phone_type'=>'ahmed']);
    return 'da';
});   
   
Route::get('/cleareverything', function () {
    
    $clearcache = Artisan::call('cache:clear');
    echo "Cache cleared<br>";

    $clearview = Artisan::call('view:clear');
    echo "View cleared<br>";

    $clearconfig = Artisan::call('config:cache');
    echo "Config cleared<br>";

});

Route::get('/startserver', function () {
    
    $clearcache = Artisan::call('clear-compiled');
    echo "Cache cleared<br>";


});
 