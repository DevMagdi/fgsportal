<?php

namespace Tests\Modular\Stubs;

use App\Http\Controllers\Controller;

/**
 * Fake controller used only by the modular tests. It is mapped to the
 * "crm" module through config('modules.controller_map') inside the test.
 */
class CrmStubController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => ['ok' => true],
            'message' => 'crm endpoint reached',
            'status' => 200,
        ], 200);
    }
}
