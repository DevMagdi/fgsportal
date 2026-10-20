<?php

namespace App\Http\Controllers\User\Dashboard;
use App\Http\Controllers\Controller;
use App\Models\UserSalary;
use Illuminate\Http\Request;
use App\Models\UserSalaryHistory;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Carbon\Carbon;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\UserDetail;
use App\Models\UserViolence;
use Illuminate\Support\Str;
use File;
use App\Models\Rating;
 use App\Models\ContactLead;
use App\Models\ContactLeadActivity;
use App\Models\ContactLeadDublicate;
 use App\Models\ContactLeadStatus;
use App\Models\ContactLeadSubStatus;
use App\Models\ContactLeadType;
use App\Models\Product;

use App\Models\TransportationRequest;
use App\Models\RequestRFP;
use App\Models\RequestRFPToApprove;
use App\Models\RequestPoc;
use App\Models\Report;
use App\Models\PublicRequest;
use App\Models\AnnualRequest;

use App\Models\IncentiveRequest;
use App\Models\AdminReport;
use App\Models\AdminTask;
use App\Models\Ticket;


use DatePeriod;
use DateInterval;
use DB;
use App\Models\ActivityStatus;
use App\Models\ActivityType;


class DashboardController extends Controller
{
    public function CastArrayTransportation(TransportationRequest $transportation){
        $array_reponse = [
            "RequestType"=>"Transportation",
            "Employee" => !empty( $transportation->user_creator_id_fun->id)?$transportation->user_creator_id_fun->username :null,
            "Department"=>!empty($transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun)?$transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun->department_name:null,
            "Project"=>!empty( $transportation->process_id_fun->project_id_fun)?$transportation->process_id_fun->project_id_fun->project_title:null,
            "Status"=>!empty( $transportation->transportation_request_status_id_fun)?$transportation->transportation_request_status_id_fun->transportation_request_status_name:null,
            "AssignedTo"=>!empty( $transportation->manager_approve_id_fun)?$transportation->manager_approve_id_fun->username:null,
            "RequestDetails"=>$transportation->transportation_request_amount."-". $transportation->transportation_request_comment,
            "CreatedAt"=>$transportation->created_at
        ];

        return $array_reponse;
    }
    public function CastArrayRequestRFP(RequestRFPToApprove $transportation){
        $array_reponse = [
            "RequestType"=>"RFP",
            "Employee" => !empty( $transportation->user_creator_id_fun->id)?$transportation->user_creator_id_fun->username :null,
            "Department"=>!empty($transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun)?$transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun->department_name:null,
            "Project"=>!empty( $transportation->request_rfp_id_fun->contact_lead_id_fun->contact_id_fun)?$transportation->request_rfp_id_fun->contact_lead_id_fun->contact_id_fun->name:null,
            "Status"=>!empty( $transportation->request_rfp_id_fun->request_rfp_status_id_fun)?$transportation->request_rfp_id_fun->request_rfp_status_id_fun->request_rfp_status:null,
            "AssignedTo"=>!empty( $transportation->manager_approve_id_fun)?$transportation->manager_approve_id_fun->username:null,
            "RequestDetails"=>!empty( $transportation->request_rfp_id_fun)?$transportation->request_rfp_id_fun->comment:null,
            "CreatedAt"=>$transportation->created_at
        ];

        return $array_reponse;
    }
    public function CastArrayRequestPOC(RequestPoc $transportation){
        $array_reponse = [
            "RequestType"=>"POC",
            "Employee" => !empty( $transportation->user_creator_id_fun->id)?$transportation->user_creator_id_fun->username :null,
            "Department"=>!empty($transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun)?$transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun->department_name:null,
            "Project"=>!empty( $transportation->process_id_fun->project_id_fun)?$transportation->process_id_fun->project_id_fun->project_title:null,
            "Status"=>!empty( $transportation->transportation_request_status_id_fun)?$transportation->transportation_request_status_id_fun->transportation_request_status_name:null,
            "AssignedTo"=>!empty( $transportation->manager_approve_id_fun)?$transportation->manager_approve_id_fun->username:null,
            "RequestDetails"=>$transportation->description,
            "CreatedAt"=>$transportation->created_at
        ];

        return $array_reponse;

    }
    public function CastArrayReport(Report $transportation){
        $array_reponse = [
            "RequestType"=>"Report",
            "Employee" => !empty( $transportation->user_creator_id_fun->id)?$transportation->user_creator_id_fun->username :null,
            "Department"=>!empty($transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun)?$transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun->department_name:null,
            "Project"=>!empty( $transportation->process_id_fun->project_id_fun)?$transportation->process_id_fun->project_id_fun->project_title:null,
            "Status"=>!empty( $transportation->report_status_id)?$transportation->report_status_id_fun->report_status_name:null,
            "AssignedTo"=>!empty( $transportation->manager_approve_id_fun)?$transportation->manager_approve_id_fun->username:null,
            "RequestDetails"=>$transportation->report_details,
            "CreatedAt"=>$transportation->created_at
        ];

        return $array_reponse;
    }
    public function CastArrayPublicRequest(PublicRequest $transportation){
        $array_reponse = [
            "RequestType"=>"Public Request",
            "Employee" => !empty( $transportation->user_creator_id_fun->id)?$transportation->user_creator_id_fun->username :null,
            "Department"=>!empty($transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun)?$transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun->department_name:null,
            "Project"=>!empty( $transportation->process_id_fun->project_id_fun)?$transportation->process_id_fun->project_id_fun->project_title:null,
            "Status"=>!empty( $transportation->public_request_status_id)?$transportation->public_request_status_id_fun->public_request_status_name:null,
            "AssignedTo"=>!empty( $transportation->manager_approve_id_fun)?$transportation->manager_approve_id_fun->username:null,
            "RequestDetails"=>$transportation->public_request_amount."-".$transportation->public_request_details,
            "CreatedAt"=>$transportation->created_at
        ];

        return $array_reponse;
    }
    public function CastArrayAnnualRequest(AnnualRequest $transportation){
        $array_reponse = [
            "RequestType"=>"Vacation",
            "Employee" => !empty( $transportation->user_id_fun->id)?$transportation->user_id_fun->username :null,
            "Department"=>!empty($transportation->user_id_fun->sub_departments_id_fun->departments_id_fun)?$transportation->user_id_fun->sub_departments_id_fun->departments_id_fun->department_name:null,
            "Project"=>null,
            "Status"=>!empty( $transportation->annual_status_id_fun)?$transportation->annual_status_id_fun->annual_status_name:null,
            "AssignedTo"=>!empty( $transportation->manager_approve_id_fun)?$transportation->manager_approve_id_fun->username:null,
            "RequestDetails"=>$transportation->reason,
            "CreatedAt"=>$transportation->created_at
        ];

        return $array_reponse;
    }
    public function CastArrayIncentiveRequest(IncentiveRequest $transportation){
        $array_reponse = [
            "RequestType"=>"Incentive",
            "Employee" => !empty( $transportation->user_creator_id_fun->id)?$transportation->user_creator_id_fun->username :null,
            "Department"=>!empty($transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun)?$transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun->department_name:null,
            "Project"=>!empty( $transportation->process_id_fun->project_id_fun)?$transportation->process_id_fun->project_id_fun->project_title:null,
            "Status"=>!empty( $transportation->incentive_status_id_fun)?$transportation->incentive_status_id_fun->incentive_status_name:null,
            "AssignedTo"=>!empty( $transportation->manager_approve_id_fun)?$transportation->manager_approve_id_fun->username:null,
            "RequestDetails"=>$transportation->incentive_amount ."-". $transportation->incentive_comment,
            "CreatedAt"=>$transportation->created_at
        ];

        return $array_reponse;
    }
    public function CastArrayAdminReport(AdminReport $transportation){
        $array_reponse = [
            "RequestType"=>"Report",
            "Employee" => !empty( $transportation->user_creator_id_fun->id)?$transportation->user_creator_id_fun->username :null,
            "Department"=>!empty($transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun)?$transportation->user_creator_id_fun->sub_departments_id_fun->departments_id_fun->department_name:null,
            "Project"=>!empty( $transportation->process_id_fun->project_id_fun)?$transportation->process_id_fun->project_id_fun->project_title:null,
            "Status"=>!empty( $transportation->report_status_id)?$transportation->report_status_id_fun->report_status_name:null,
            "AssignedTo"=>!empty( $transportation->manager_approve_id_fun)?$transportation->manager_approve_id_fun->username:null,
            "RequestDetails"=>$transportation->report_details,
            "CreatedAt"=>$transportation->created_at
        ];

        return $array_reponse;
    }
   
   
    public function GetAllDashboardDetails(Request $request){
     //   try{
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',   
            ]);
            if ($validator->fails()) {
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
            if(Auth::guard('user_api')->user()->work_degrees_id==5||(Auth::guard('user_api')->user()->sub_departments_id!=null &&Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id==1)){
                $admin_tasks =0;
                if(Auth::guard('user_api')->user()->sub_departments_id!=null &&Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id==1){
                    $admin_tasks = AdminTask::where('task_status_id',1)->count();
                    $tickets =Ticket::where('ticket_status_id',1)->count();
                }else{
                    $tickets =  Ticket::where('ticket_status_id',1)->where('project_manager_id',Auth::guard('user_api')->user()->id)->count();
                }

                $array_reponse= [];
                $annual_user =AnnualRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('annual_status_id',2)->get();
                foreach($annual_user as $dep){
                    $array_reponse[] =$this->CastArrayAnnualRequest($dep);
                }
                $incentiveRequest = IncentiveRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('incentive_status_id',1)->get();
                foreach($incentiveRequest as $dep){
                    $array_reponse[] =$this->CastArrayIncentiveRequest($dep);
                }
                $techReport= AdminReport::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('report_status_id',1)->orWhere('report_status_id',4)->where('manager_approve_id',Auth::guard('user_api')->user()->id)->get();
                foreach($techReport as $dep){
                    $array_reponse[] =$this->CastArrayAdminReport($dep);
                }
                $Report= Report::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('report_status_id',1)->orWhere('report_status_id',4)->where('manager_approve_id',Auth::guard('user_api')->user()->id)->get();
                foreach($Report as $dep){
                    $array_reponse[] =$this->CastArrayReport($dep);
                }
                $request_rfp =RequestRFPToApprove::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('status',0)->get();
                foreach($request_rfp as $dep){
                    $array_reponse[] =$this->CastArrayRequestRFP($dep);
                }
                $publicRequest = PublicRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('public_request_status_id',1)->get();
                foreach($publicRequest as $dep){
                    $array_reponse[] =$this->CastArrayPublicRequest($dep);
                }
                $transportationRequest = TransportationRequest::where('transportation_request_status_id',1)->where('manager_approve_id',Auth::guard('user_api')->user()->id)->get();
                foreach($transportationRequest as $dep){
                    $array_reponse[] =$this->CastArrayTransportation($dep);
                }
                if(Auth::guard('user_api')->user()->sub_departments_id==5){
                    $ticketStatus = RequestPoc::where('request_poc_status_id',2)->where('manager_approve_id',Auth::guard('user_api')->user()->id)->get();
                     foreach($ticketStatus as $dep){
                        $array_reponse[] =$this->CastArrayRequestPOC($dep);
                        }
                }elseif(Auth::guard('user_api')->user()->sub_departments_id==6){
                    $ticketStatus = RequestPoc::where('request_poc_status_id',3)->where('manager_approve_id',Auth::guard('user_api')->user()->id)->get();
                     foreach($ticketStatus as $dep){
                        $array_reponse[] =$this->CastArrayRequestPOC($dep);
                        }
                }
                $array_reponse = collect($array_reponse)->sortBy(function ($temp, $key) {
                    return $temp['CreatedAt']->getTimestamp(); // if $temp['date'] is still a Carbon instance
                //otherwise, if it is not:
                // return Carbon::parse($temp['date'])->getTimestamp(); 
                });
                $array_reponse= $array_reponse->toArray();
                $array_reponse =[
                    "pending_reports"=>$Report->count()+$techReport->count(),
                    "admin_tasks"=>$admin_tasks ,
                    "open_tickets"=>$tickets,
                    "public_request"=>$publicRequest->count(),
                    "latest_request"=>$array_reponse
                ];
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            }else{
                return ResponseApi::badMethodErrorResponse(["message"=>"you cant proceed with this action because you are not a manager"],"Validator Errors",400);

            }


 
        // }catch(\Exception $e){
        //   return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
        // }
    }
    

}

