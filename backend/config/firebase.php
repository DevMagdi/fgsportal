<?php

/*
|--------------------------------------------------------------------------
| Firebase configuration
|--------------------------------------------------------------------------
|
| All Firebase credentials are loaded from environment variables so that no
| real keys are committed to source control. See .env.example for the list
| of required variables.
|
*/

return [

    // FCM legacy server key used by the push-notification controller.
    'server_key' => env('FIREBASE_SERVER_KEY'),

    // Firebase Web API key used to authenticate Realtime Database requests.
    'api_key' => env('FIREBASE_API_KEY'),

    // Primary Realtime Database base URL (fgs-connect-portal project).
    'database_url' => env(
        'FIREBASE_DATABASE_URL',
        'https://fgs-connect-portal-default-rtdb.firebaseio.com'
    ),

    // Legacy Realtime Database base URL (fgspmproduction project).
    'legacy_database_url' => env(
        'FIREBASE_LEGACY_DATABASE_URL',
        'https://fgspmproduction-default-rtdb.firebaseio.com'
    ),

    // Legacy database auth secret appended as ?auth= in migration scripts.
    'legacy_db_auth_token' => env('FIREBASE_LEGACY_DB_AUTH_TOKEN'),

];
