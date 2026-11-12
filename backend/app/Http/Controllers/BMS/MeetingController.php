<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\Meeting;
use App\Models\BMS\MeetingAttendee;
use App\Models\BMS\Minutes;
use App\Models\User;
use App\Services\BMS\MeetingInvitations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MeetingController extends BmsController
{
    public function index(Request $request)
    {
        $filters=$request->validate(['business_unit_id'=>'nullable|exists:business_units,id','search'=>'nullable|string|max:200','from'=>'nullable|date','to'=>'nullable|date','linked_type'=>'nullable|string','linked_id'=>'nullable|integer']);
        $query=Meeting::with(['unit','creator:id,username','attendees.user:id,username,email','minutes']);
        $this->scope($query);
        if (!empty($filters['search'])) $query->where(function($q)use($filters){
            $q->where('title','like','%'.$filters['search'].'%')->orWhereHas('attendees.user',fn($a)=>$a->where('username','like','%'.$filters['search'].'%'))->orWhereHas('minutes',fn($m)=>$m->where('discussion','like','%'.$filters['search'].'%')->orWhere('decisions','like','%'.$filters['search'].'%'));
        });
        if(!empty($filters['linked_type']))$query->whereHas('minutes',fn($m)=>$m->where('linked_type',$filters['linked_type'])->where('linked_id',$filters['linked_id']??0));
        if (!empty($filters['from'])) $query->whereDate('starts_at','>=',$filters['from']);
        if (!empty($filters['to'])) $query->whereDate('starts_at','<=',$filters['to']);
        return $this->ok($query->latest('starts_at')->get());
    }

    public function availability(Request $request)
    {
        $data=$request->validate(['starts_at'=>'required|date','ends_at'=>'required|date|after:starts_at','user_ids'=>'required|array|min:1','user_ids.*'=>'exists:users,id','meeting_id'=>'nullable|exists:bms_meetings,id']);
        $users=User::whereIn('id',$data['user_ids'])->get(['id','username','firstname','lastname','email']);
        $result=$users->map(function($user)use($data){
            $conflicts=Meeting::whereHas('attendees',fn($q)=>$q->where('user_id',$user->id)->where('response','!=','declined'))
                ->where('status','!=','cancelled')->where('starts_at','<',$data['ends_at'])->where('ends_at','>',$data['starts_at'])
                ->when($data['meeting_id']??null,fn($q,$id)=>$q->where('id','!=',$id))->get(['id','title','starts_at','ends_at']);
            return ['user'=>$user,'available'=>$conflicts->isEmpty(),'conflicts'=>$conflicts];
        })->values();
        return $this->ok($result);
    }

    public function store(Request $request)
    {
        $data=$this->meetingData($request);
        if ($data['business_unit_id']??null) $this->access->authorizeUnit((int)$data['business_unit_id']);
        $attendees=$this->attendees($request);
        abort_unless(count($attendees)>0,422,'Select at least one internal or external attendee.');
        $meeting=DB::transaction(function()use($data,$attendees){
            $meeting=Meeting::create($data+['created_by'=>$this->access->user()->id]);
            foreach($attendees as $attendee) $meeting->attendees()->create($attendee);
            $this->audit->record($meeting,'meeting.created',[],$meeting->toArray());
            return $meeting;
        });
        return $this->ok($this->load($meeting),'Meeting created',201);
    }

    public function update(Request $request, Meeting $meeting, MeetingInvitations $invitations)
    {
        $this->authorizeMeeting($meeting);
        abort_if($meeting->status === 'cancelled', 422, 'A cancelled meeting cannot be changed.');
        $data = $this->meetingData($request, false);
        $changes = DB::transaction(function () use ($meeting, $data, $request) {
            $old = $meeting->only(array_keys($data));
            $meeting->fill($data);
            $rescheduled = $meeting->isDirty(['starts_at', 'ends_at', 'location']);
            if ($rescheduled) {
                $meeting->sequence = (int) $meeting->sequence + 1;
            }
            $meeting->save();

            $added = collect();
            $removed = collect();
            if ($request->has('attendees')) {
                [$added, $removed] = $this->syncAttendees($meeting, $this->attendees($request));
            }
            $this->audit->record($meeting, 'meeting.updated', $old, $meeting->fresh()->only(array_keys($data)));

            return compact('added', 'removed', 'rescheduled');
        });

        // Delivery is an external side effect: run only after all database
        // updates and the audit row have committed successfully.
        $meeting->load('attendees.user', 'creator');
        if ($changes['removed']->isNotEmpty()) {
            $invitations->send($meeting, $changes['removed'], 'CANCEL');
        }
        $notify = $changes['rescheduled'] ? $meeting->attendees : $changes['added'];
        if ($notify->isNotEmpty()) {
            $invitations->send($meeting, $notify, 'REQUEST');
        }
        return $this->ok($this->load($meeting->fresh()));
    }

    public function cancel(Meeting $meeting, MeetingInvitations $invitations)
    {
        $this->authorizeMeeting($meeting);
        abort_if($meeting->status === 'cancelled', 422, 'The meeting is already cancelled.');
        $meeting->update(['status' => 'cancelled', 'sequence' => (int) $meeting->sequence + 1]);
        $meeting->load('attendees.user', 'creator');
        $invitations->send($meeting, $meeting->attendees, 'CANCEL');
        $this->audit->record($meeting, 'meeting.cancelled', ['status' => 'scheduled'], ['status' => 'cancelled']);
        return $this->ok($this->load($meeting->fresh()), 'Meeting cancelled');
    }

    public function invite(Meeting $meeting, MeetingInvitations $invitations)
    {
        $this->authorizeMeeting($meeting);
        abort_if($meeting->status === 'cancelled', 422, 'A cancelled meeting cannot be invited.');
        $meeting->load('attendees.user', 'creator');
        $result = $invitations->send($meeting, $meeting->attendees, 'REQUEST');
        $deliveries = [];
        foreach ($result as $id => $status) {
            $deliveries[] = ['id' => $id, 'status' => $status];
        }
        $this->audit->record($meeting, 'meeting.invitations_sent', [], ['deliveries' => $deliveries]);
        return $this->ok($this->load($meeting), 'Invitation delivery completed');
    }

    /**
     * Diff-based sync: keep rows (and their responses) for people who stay,
     * add new ones, delete the ones that disappeared.
     * @return array{0:\Illuminate\Support\Collection,1:\Illuminate\Support\Collection} [added, removed]
     */
    private function syncAttendees(Meeting $meeting, array $incoming): array
    {
        $key = fn($a) => !empty($a['user_id']) ? 'u:' . $a['user_id'] : 'e:' . strtolower((string) ($a['external_email'] ?? ''));
        $existing = $meeting->attendees()->get()->keyBy(fn($a) => $key($a->only('user_id', 'external_email')));
        $wanted = collect($incoming)->keyBy($key);
        $removed = $existing->diffKeys($wanted)->values();
        foreach ($removed as $attendee) {
            $attendee->delete();
        }
        $added = collect();
        foreach ($wanted->diffKeys($existing) as $row) {
            $added->push($meeting->attendees()->create($row));
        }
        foreach ($wanted as $k => $row) {
            if (!$existing->has($k)) {
                continue;
            }

            $attributes = array_intersect_key($row, array_flip(['external_name', 'external_email', 'user_id']));
            $attendee = $existing[$k];
            $changed = false;
            foreach ($attributes as $attribute => $value) {
                $current = $attendee->getAttribute($attribute);
                $same = $attribute === 'user_id'
                    ? (($current === null && $value === null) || ($current !== null && $value !== null && (int) $current === (int) $value))
                    : $current === $value;
                if (!$same) {
                    $changed = true;
                    break;
                }
            }
            if ($changed) {
                $attendee->update($attributes);
            }
        }
        return [$added->each->load('user'), $removed->each->load('user')];
    }

    public function respond(Request $request,MeetingAttendee $attendee)
    {
        $data=$request->validate(['response'=>['required',Rule::in(['pending','accepted','declined','tentative'])]]);
        abort_unless($attendee->user_id===$this->access->user()->id,403,'You can only respond to your own invitation.');
        $old=$attendee->only('response');$attendee->update($data);
        $this->audit->record($attendee,'meeting.response_recorded',$old,$data);
        return $this->ok($attendee->load('user'));
    }

    public function saveMinutes(Request $request,Meeting $meeting)
    {
        $this->authorizeMeeting($meeting);
        $data=$request->validate(['discussion'=>'required|string','decisions'=>'nullable|string','actions'=>'nullable|array','actions.*.title'=>'required_with:actions|string|max:250','actions.*.owner_id'=>'nullable|exists:users,id','actions.*.due_date'=>'nullable|date','linked_type'=>['nullable',Rule::in(['unit','lead','opportunity','product'])],'linked_id'=>'nullable|integer|min:1']);
        $this->validateLink($data['linked_type']??null,$data['linked_id']??null);
        $minutes=$meeting->minutes()->updateOrCreate(['bms_meeting_id'=>$meeting->id],$data+['created_by'=>$this->access->user()->id]);
        $this->audit->record($minutes,'minutes.saved',[],$minutes->toArray());
        return $this->ok($this->load($meeting->fresh()),'Minutes saved and indexed');
    }

    private function meetingData(Request $request,bool $creating=true):array
    {
        return $request->validate(['title'=>($creating?'required':'sometimes').'|string|max:200','business_unit_id'=>'nullable|exists:business_units,id','starts_at'=>($creating?'required':'sometimes').'|date','ends_at'=>($creating?'required':'sometimes').'|date|after:starts_at','meeting_type'=>['sometimes',Rule::in(['internal','external'])],'location'=>'nullable|string|max:250','status'=>['sometimes',Rule::in(['scheduled','completed','cancelled'])]]);
    }
    private function attendees(Request $request):array
    {
        $rows=$request->validate(['attendees'=>'sometimes|array|max:100','attendees.*.user_id'=>'nullable|exists:users,id','attendees.*.external_name'=>'nullable|string|max:200','attendees.*.external_email'=>'nullable|email'])['attendees']??[];
        return array_map(fn($a)=>$a+['response'=>'pending','delivery_status'=>'pending'],$rows);
    }
    private function scope($query):void
    {
        $ids=$this->access->visibleUnitIds();
        if($ids!==null)$query->where(function($q)use($ids){$q->whereIn('business_unit_id',$ids)->orWhereHas('attendees',fn($a)=>$a->where('user_id',$this->access->user()->id));});
    }
    private function authorizeMeeting(Meeting $meeting):void
    {
        if($meeting->business_unit_id)$this->access->authorizeUnit($meeting->business_unit_id);
        else abort_unless($this->access->can('meetings.manage'),403);
    }
    private function load(Meeting $meeting):Meeting{return $meeting->load(['unit','creator:id,username','attendees.user:id,username,email','minutes']);}
    private function validateLink(?string $type,?int $id):void
    {
        if(!$type&&!$id)return;
        abort_unless($type&&$id,422,'Both linked type and linked record are required.');
        $map=['unit'=>\App\Models\BMS\BusinessUnit::class,'lead'=>\App\Models\BMS\Lead::class,'opportunity'=>\App\Models\BMS\Opportunity::class,'product'=>\App\Models\Product::class];
        $record=$map[$type]::whereKey($id)->first();abort_unless($record,422,'The linked record does not exist.');
        if($type==='unit')$this->access->authorizeUnit((int)$id);
        if(in_array($type,['lead','opportunity'],true)){
            if($record->business_unit_id)$this->access->authorizeUnit((int)$record->business_unit_id);
            else abort_unless($record->owner_id===$this->access->user()->id||$this->access->hasGlobalUnitScope(),403);
        }
        if($type==='product'){
            $ids=$this->access->visibleUnitIds();if($ids!==null)abort_unless($record->businessUnits()->whereIn('business_units.id',$ids)->exists(),403);
        }
    }
}
