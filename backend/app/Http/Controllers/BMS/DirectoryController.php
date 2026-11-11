<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\EmployeeCertificate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DirectoryController extends BmsController
{
    public function index(Request $request)
    {
        $query=User::with(['work_degrees_id_fun','businessUnits:id,name','user_details_id_fun'])->where('active',1)->orderBy('firstname')->orderBy('username');
        if($request->filled('business_unit_id'))$query->whereHas('businessUnits',fn($q)=>$q->where('business_units.id',$request->business_unit_id));
        if($request->filled('search'))$query->where(function($q)use($request){$term='%'.$request->search.'%';$q->where('username','like',$term)->orWhere('firstname','like',$term)->orWhere('lastname','like',$term)->orWhere('email','like',$term);});
        $visibleUnitIds=$this->access->visibleUnitIds();
        $employees=$query->get(['id','username','firstname','lastname','email','photoURL','work_degrees_id','user_details_id','active'])->map(function($user)use($visibleUnitIds){
            $certificates=EmployeeCertificate::with('unit:id,name')->where('user_id',$user->id)
                ->when($visibleUnitIds!==null,fn($q)=>$q->whereIn('business_unit_id',$visibleUnitIds))->get();
            return ['id'=>$user->id,'name'=>trim($user->firstname.' '.$user->lastname)?:$user->username,'username'=>$user->username,'email'=>$user->email,'job_title'=>$user->work_degrees_id_fun->work_degree_name??null,'photo_url'=>$user->photoURL,'units'=>$user->businessUnits,'hiring_date'=>$user->user_details_id_fun->hiringDate??null,'certificates'=>$certificates];
        })->values();
        return $this->ok($employees);
    }
    public function certificate(Request $request)
    {
        $data=$request->validate(['user_id'=>'required|exists:users,id','business_unit_id'=>'nullable|exists:business_units,id','name'=>'required|string|max:200','issuer'=>'nullable|string|max:200','issued_at'=>'nullable|date','expires_at'=>'nullable|date|after_or_equal:issued_at','file'=>'required|file|mimes:pdf,png,jpg,jpeg|max:10240']);
        if(!empty($data['business_unit_id']))$this->access->authorizeUnit((int)$data['business_unit_id']);else abort_unless($this->access->hasGlobalUnitScope(),403,'Select a unit within your access scope.');
        $file=$request->file('file');$certificate=EmployeeCertificate::create(['user_id'=>$data['user_id'],'business_unit_id'=>$data['business_unit_id']??null,'name'=>$data['name'],'issuer'=>$data['issuer']??null,'issued_at'=>$data['issued_at']??null,'expires_at'=>$data['expires_at']??null,'original_name'=>$file->getClientOriginalName(),'file_path'=>$file->store('bms/certificates','local'),'uploaded_by'=>$this->access->user()->id]);
        $this->audit->record($certificate,'employee.certificate_added',[],$certificate->toArray());
        return $this->ok($certificate->load(['employee:id,username','unit:id,name']),'Certificate attached',201);
    }
    public function download(EmployeeCertificate $certificate)
    {
        if($certificate->business_unit_id)$this->access->authorizeUnit((int)$certificate->business_unit_id);
        abort_unless(Storage::disk('local')->exists($certificate->file_path),404);return Storage::disk('local')->download($certificate->file_path,\App\Services\BMS\SafeFilename::forDownload($certificate->original_name));
    }
}
