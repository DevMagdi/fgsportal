<?php
namespace App\Http\Controllers\BMS;

use App\Http\Controllers\Controller;
use App\Services\BMS\BmsAccess;
use App\Services\BMS\BmsAudit;

abstract class BmsController extends Controller
{
    protected BmsAccess $access;
    protected BmsAudit $audit;

    public function __construct(BmsAccess $access, BmsAudit $audit)
    {
        $this->access = $access;
        $this->audit = $audit;
    }

    protected function ok($data, string $message = 'Success', int $status = 200)
    {
        return response()->json(['data'=>$data,'message'=>$message,'status'=>$status], $status);
    }
}
