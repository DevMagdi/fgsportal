<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\Candidate;
use App\Models\BMS\BmsAuditLog;
use App\Models\BMS\HiringRequest;
use App\Models\BMS\OnboardingItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RecruitmentController extends BmsController
{
    public function index(Request $request)
    {
        $query=HiringRequest::with(['unit','requester:id,username','candidates','onboarding.owner:id,username','onboarding.employee:id,username'])->latest();
        $ids=$this->access->visibleUnitIds();if($ids!==null)$query->whereIn('business_unit_id',$ids);
        if($request->filled('status'))$query->where('status',$request->status);
        return $this->ok($query->get()->map(fn($hiring)=>$this->load($hiring))->values());
    }
    public function store(Request $request)
    {
        $data=$request->validate(['business_unit_id'=>'required|exists:business_units,id','job_title'=>'required|string|max:200','specification'=>'required|string']);
        $this->access->authorizeUnit((int)$data['business_unit_id']);
        $hiring=HiringRequest::create($data+['requested_by'=>$this->access->user()->id,'status'=>'submitted']);
        $this->audit->record($hiring,'hiring.submitted',[],$hiring->toArray());
        app(\App\Services\BMS\BmsNotifier::class)->notifyRoles(['coordinator'],'recruitment.created','New hiring request',$hiring->job_title);
        return $this->ok($this->load($hiring),'Hiring request routed to Coordinator',201);
    }
    public function update(Request $request,HiringRequest $hiring)
    {
        $this->access->authorizeUnit($hiring->business_unit_id);
        $data=$request->validate(['job_title'=>'sometimes|string|max:200','specification'=>'sometimes|string','status'=>['sometimes',Rule::in(['submitted','with_hr','cv_received','interviewing','selected','hired','closed','rejected'])],'hr_owner_id'=>'nullable|exists:users,id','first_working_day'=>'nullable|date']);
        abort_if(($data['status']??null)==='hired',422,'Use the candidate hiring action to create onboarding tasks.');
        $old=$hiring->only(array_keys($data));$hiring->update($data);$this->audit->record($hiring,'hiring.updated',$old,$hiring->only(array_keys($data)));
        return $this->ok($this->load($hiring));
    }
    public function addCandidate(Request $request,HiringRequest $hiring)
    {
        $this->access->authorizeUnit($hiring->business_unit_id);
        $data=$request->validate(['name'=>'required|string|max:200','email'=>'nullable|email','cv'=>'nullable|file|mimes:pdf,doc,docx|max:10240']);
        if($request->hasFile('cv')){$file=$request->file('cv');$data['cv_path']=$file->storeAs('bms/cvs',uniqid('cv_').'.'.$file->getClientOriginalExtension(),'local');}
        unset($data['cv']);$candidate=$hiring->candidates()->create($data);$hiring->update(['status'=>'cv_received']);
        $this->audit->record($candidate,'candidate.cv_received',[],$candidate->toArray());
        return $this->ok($this->load($hiring->fresh()),'Candidate CV attached',201);
    }
    public function downloadCv(Candidate $candidate)
    {
        $this->access->authorizeUnit($candidate->hiringRequest->business_unit_id);
        abort_unless($candidate->cv_path&&\Illuminate\Support\Facades\Storage::disk('local')->exists($candidate->cv_path),404);
        return \Illuminate\Support\Facades\Storage::disk('local')->download($candidate->cv_path,\App\Services\BMS\SafeFilename::forDownload($candidate->name.'-CV.'.pathinfo($candidate->cv_path,PATHINFO_EXTENSION)));
    }
    public function interview(Request $request,Candidate $candidate)
    {
        $hiring=$candidate->hiringRequest;$this->access->authorizeUnit($hiring->business_unit_id);
        $data=$request->validate(['interview_at'=>'nullable|date','interview_notes'=>'nullable|string','interview_decision'=>['nullable',Rule::in(['pending','pass','reject'])],'status'=>['sometimes',Rule::in(['cv_received','interview_scheduled','interviewed','selected','rejected','hired'])]]);
        $old=$candidate->only(array_keys($data));$candidate->update($data);
        if(!empty($data['interview_at']))$candidate->update(['status'=>'interview_scheduled']);
        $hiring->update(['status'=>$candidate->status==='selected'?'selected':'interviewing']);
        $this->audit->record($candidate,'candidate.interview_recorded',$old,$candidate->only(array_keys($data)));
        return $this->ok($this->load($hiring),'Interview details saved');
    }
    public function hire(Request $request,Candidate $candidate)
    {
        $hiring=$candidate->hiringRequest;$this->access->authorizeUnit($hiring->business_unit_id);
        abort_if($candidate->status==='hired',422,'Onboarding has already been created for this candidate.');
        abort_unless($candidate->interview_decision==='pass'||$candidate->status==='selected',422,'The candidate must pass the interview before hiring.');
        $data=$request->validate(['first_working_day'=>'required|date','employee_id'=>'required|exists:users,id']);
        abort_if($hiring->onboarding()->exists(),422,'Onboarding tasks already exist for this hiring request.');
        DB::transaction(function()use($candidate,$hiring,$data){
            $candidate->update(['status'=>'hired']);
            \App\Models\User::findOrFail($data['employee_id'])->businessUnits()->syncWithoutDetaching([$hiring->business_unit_id]);
            $hiring->update(['status'=>'hired','first_working_day'=>$data['first_working_day']]);
            $this->startOnboarding($candidate,$hiring,\App\Models\User::findOrFail($data['employee_id']),'existing');
            $this->audit->record($hiring,'candidate.hired',[],$hiring->toArray());
        });
        return $this->ok($this->load($hiring->fresh()),'Hiring completed; onboarding started');
    }
    /**
     * Hire a candidate by creating a new employee account in the same
     * transaction (BRD section 5 "Recruitment integration"). No duplicate
     * account is created: usernames/emails are validated as unique, and the
     * endpoint refuses to run when onboarding already exists.
     */
    public function hireNewEmployee(Request $request,Candidate $candidate)
    {
        $hiring=$candidate->hiringRequest;$this->access->authorizeUnit($hiring->business_unit_id);
        abort_if($candidate->status==='hired',422,'Onboarding has already been created for this candidate.');
        abort_unless($candidate->interview_decision==='pass'||$candidate->status==='selected',422,'The candidate must pass the interview before hiring.');
        $data=$request->validate([
            'first_working_day'=>'required|date',
            'username'=>'required|string|max:50|unique:users,username',
            'email'=>'required|email|max:50|unique:users,email',
            'firstname'=>'required|string|max:20',
            'lastname'=>'required|string|max:20',
            'password'=>'required|string|min:8',
            'work_degrees_id'=>'nullable|exists:work_degrees,id',
            'role_id'=>'nullable|exists:bms_roles,id',
        ]);
        abort_if($hiring->onboarding()->exists(),422,'Onboarding tasks already exist for this hiring request.');
        $employee=DB::transaction(function()use($candidate,$hiring,$data){
            $detail=\App\Models\UserDetail::create(['hiringDate'=>$data['first_working_day']]);
            $columns=\Schema::getColumnListing('users');
            $attributes=array_filter([
                'username'=>$data['username'],'email'=>$data['email'],
                'firstname'=>$data['firstname'],'lastname'=>$data['lastname'],
                'password'=>\Illuminate\Support\Facades\Hash::make($data['password']),
                'active'=>true,'user_creator_id'=>$this->access->user()->id,
                'user_details_id'=>$detail->id,'work_degrees_id'=>$data['work_degrees_id']??null,
                'company_id'=>$this->access->user()->company_id,
            ],fn($key)=>in_array($key,$columns,true),ARRAY_FILTER_USE_KEY);
            $employee=\App\Models\User::create($attributes);
            $employee->businessUnits()->syncWithoutDetaching([$hiring->business_unit_id]);
            if(!empty($data['role_id']))$employee->bmsRoles()->syncWithoutDetaching([$data['role_id']=>['business_unit_id'=>$hiring->business_unit_id]]);
            $this->startOnboarding($candidate,$hiring,$employee,'new');
            $this->audit->record($employee,'employee.created_from_hiring',[],['hiring_request_id'=>$hiring->id,'candidate_id'=>$candidate->id]);
            return $employee;
        });
        return $this->ok($this->load($hiring->fresh())->setAttribute('created_employee',$employee->only(['id','username','email'])),'Hiring completed; employee created and onboarding started',201);
    }

    public function updateOnboarding(Request $request,OnboardingItem $item)
    {
        $data=$request->validate(['status'=>['required',Rule::in(['pending','in_progress','completed'])],'owner_id'=>'nullable|exists:users,id','notes'=>'nullable|string']);
        $hiring=$item->hiringRequest;
        if(!$this->access->can('recruitment.manage')) {
            $this->access->authorize('onboarding.respond');
            abort_unless(strcasecmp($item->department,$this->departmentName())===0,403,'This checklist item belongs to another service department.');
        } else $this->access->authorizeUnit($hiring->business_unit_id);
        $old=$item->only(array_keys($data));if($data['status']==='completed')$data['completed_at']=now();else $data['completed_at']=null;
        $item->update($data);$this->audit->record($item,'onboarding.updated',$old,$item->only(array_keys($data)));
        return $this->ok($this->load($hiring));
    }
    /** Creates the IT/PR/HR checklist exactly once (guarded by the caller). */
    private function startOnboarding(Candidate $candidate,HiringRequest $hiring,\App\Models\User $employee,string $mode): void
    {
        $candidate->update(['status'=>'hired']);
        $employee->businessUnits()->syncWithoutDetaching([$hiring->business_unit_id]);
        $hiring->update(['status'=>'hired']);
        $items=[['department'=>'IT','title'=>'Create official email'],['department'=>'IT','title'=>'Prepare laptop'],['department'=>'PR','title'=>'Create employee directory entry'],['department'=>'HR','title'=>'Complete employee records']];
        foreach($items as $item){
            $hiring->onboarding()->create($item+['employee_id'=>$employee->id]);
            $department=\App\Models\SubDepartment::whereHas('departments_id_fun',function($query)use($item){
                $query->where('department_name','like','%'.$item['department'].'%');
            })->value('departments_id');
            if($department)app(\App\Services\BMS\BmsNotifier::class)->notifyDepartment((int)$department,'onboarding.created','New onboarding task: '.$item['title'],$hiring->job_title);
        }
    }

    private function departmentName():string
    {
        $roles=$this->access->roles()->pluck('slug');
        if($roles->contains('hr'))return 'HR';
        if($roles->contains('it'))return 'IT';
        if($roles->contains('pr_marketing'))return 'PR';
        $sub=$this->access->user()->sub_departments_id_fun;
        $name=$sub&&$sub->departments_id_fun?$sub->departments_id_fun->department_name:'';
        return stripos($name,'human')!==false?'HR':(stripos($name,'information')!==false?'IT':(stripos($name,'marketing')!==false?'PR':$name));
    }
    private function load(HiringRequest $hiring):HiringRequest
    {
        $hiring->load(['unit','requester:id,username','candidates','onboarding.owner:id,username','onboarding.employee:id,username']);
        $candidateIds=$hiring->candidates->pluck('id');$onboardingIds=$hiring->onboarding->pluck('id');
        $timeline=BmsAuditLog::with('user:id,username')->where(function($q)use($hiring,$candidateIds,$onboardingIds){
            $q->where(fn($a)=>$a->where('auditable_type',HiringRequest::class)->where('auditable_id',$hiring->id))
              ->orWhere(fn($a)=>$a->where('auditable_type',Candidate::class)->whereIn('auditable_id',$candidateIds))
              ->orWhere(fn($a)=>$a->where('auditable_type',OnboardingItem::class)->whereIn('auditable_id',$onboardingIds));
        })->oldest()->get();$hiring->setAttribute('timeline',$timeline);return $hiring;
    }
}
