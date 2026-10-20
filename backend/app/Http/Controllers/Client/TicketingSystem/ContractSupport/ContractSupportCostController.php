<?php

namespace App\Http\Controllers\Client\TicketingSystem\ContractSupport;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ReportStatus;
use App\Models\ReportType;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Report;
use App\Models\User;
use App\Models\Ticket;
use App\Models\ContractSupport;
use App\Models\ClientAccount;

use App\Http\Controllers\ApiMessage\MessageController;
 
 use DatePeriod;
use DateInterval;
 

class ContractSupportCostController extends Controller
{
  public $ContractCost=0;
   public function CastArraySupport(ContractSupport $contractSupport,$cost_array){
         
          $client_account = ClientAccount::where('client_account_id',null)->where('partner_id',$contractSupport->partner_id)->first();
          $ticket_number = Ticket::where('contract_support_id',$contractSupport->id)->sum('id');
          $ticket_developers = Ticket::where('contract_support_id',$contractSupport->id)->get()->unique('developer_id');
          $ticket_projectManagers = Ticket::where('contract_support_id',$contractSupport->id)->get()->unique('project_manager_id');
          $developers=[];
          $project_managers=[];
          foreach ($ticket_developers as $value) {
            if(empty($value->developer_id)){
              continue;
            }
            $value = User::where('id',$value->developer_id)->withTrashed()->first();
            $developers[]=[
              'developer_id'=>$value->id,    
              'developer_image'=>!empty($value->photoURL)?'/Attachments/User/'.$value->id.'/profile'.'/'.$value->photoURL:null,
              'developer_name'=>!empty($value->id)?$value->username:null,
              'isDeleted'=>empty($value->deleted_at)?0:1,
              ];
          }
          foreach ($ticket_projectManagers as $value) {
            if(empty($value->project_manager_id)){
              continue;
            }
            $value = User::where('id',$value->project_manager_id)->withTrashed()->first();
            $project_managers[]=
            [
              'project_manager_id'=>$value->id,    
              'project_manager_image'=>!empty($value->photoURL)?'/Attachments/User/'.$value->id.'/profile'.'/'.$value->photoURL:null,
              'project_manager_username'=>!empty($value->id)?$value->username:null,
              'isDeleted'=>empty($value->deleted_at)?0:1,
              ];
              
          }
          $array_reponse=[
              'key'=>$contractSupport->id,
              'notes'=>$contractSupport->notes,
              'createdByKey'=>$contractSupport->user_creator_id?$contractSupport->user_creator_id:null,
              'createdByName'=>$contractSupport->user_creator_id?$contractSupport->user_creator_id_fun->username:null,
              'PMID'=>$contractSupport->project_manager_id?$contractSupport->project_manager_id:null,
              'PMName'=>$contractSupport->project_manager_id?$contractSupport->project_manager_id_fun->username:null,
              'managerID'=>$contractSupport->manager_id?$contractSupport->manager_id:null,
              'managerName'=>$contractSupport->manager_id?$contractSupport->manager_id_fun->username:null,
              'periority'=>$contractSupport->contract_type_id?$contractSupport->contract_type_id:null,
              'periority_name'=>$contractSupport->contract_type_id?$contractSupport->contract_type_id_fun->contract_type:null,
              'customerKey'=>$contractSupport->partner_id?$contractSupport->partner_id:null,
              'customerName'=>$contractSupport->partner_id?$contractSupport->partner_id_fun->partner_name:null,
              'product_id'=>$contractSupport->product_id?$contractSupport->product_id:null,
              'product_name'=>$contractSupport->product_id?$contractSupport->product_id_fun->product_name:null,
              'status'=>$contractSupport->contract_status_id?$contractSupport->contract_status_id:null,
              'status_name'=>$contractSupport->contract_status_id?$contractSupport->contract_status_id_fun->contract_statuses_name:null,
              'endDate'=>Carbon::parse( $contractSupport->contract_end_date)->format('m/d/Y') ,
              'startDate'=>Carbon::parse( $contractSupport->contract_start_date)->format('m/d/Y') ,
              'createdAt'=>$contractSupport->created_at,
              'updatedAt'=>$contractSupport->updated_at,
              'customerImgUrl' => $contractSupport->partner_id?($contractSupport->partner_id_fun->partner_photoURL?"/Attachments/Client/Partner/" .  $contractSupport->partner_id . '/' .$contractSupport->partner_id_fun->partner_photoURL:null):null,
              'primary_contact_fullname'=> !empty($client_account)?$client_account->fullname:null,
              'primary_contact_email'=> !empty($client_account)?$client_account->email:null,
              'primary_contact_phone'=> !empty($client_account)?$client_account->phone:null,
               'customerAddress'=>$contractSupport->partner_id?$contractSupport->partner_id_fun->partner_address:null,
               'primary_contact_id'=>!empty($client_account)?$client_account->id:null,
               'contract_cost'=>$cost_array,
               'contract_total_cost'=>$this->ContractCost,
               'total_number_ticket'=>$ticket_number,
               'developers'=>$developers,
               'project_managers'=>$project_managers
   
              ];
          return $array_reponse;
      }
    public function CastCostarrayReport(Report $report){
        $this->ContractCost +=(float)($report->report_cost?$report->report_cost:0);

          $array_reponse =[
            'key'=>$report->id,         
            'activity_key'=>$report->id,
            'ticket_id'=>$report->ticket_id,
            'ticket_title'=>!empty($report->ticket_id_fun)?$report->ticket_id_fun->title:null,
            'notes'=>$report->report_details,
            'costDate'=> Carbon::parse( $report->report_date)->format('m/d/Y'),
            'createdAt'=>$report->updated_at,
            'createdByKey'=>$report->manager_approve_id,
            'createdByName'=>$report->manager_approve_id?$report->manager_approve_id_fun->username:null,
            'empKey'=>$report->user_creator_id,
            'empName'=>$report->user_creator_id?$report->user_creator_id_fun->username:null,
            'costAmount'=>(float)($report->report_cost?$report->report_cost:0),     
            'isManual' =>false,        
        ];
        return $array_reponse;
    }
    public function GetContractSupportCost(Request $request){
     try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'contract_support_id'=>'required|numeric|exists:contract_supports,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $array_reponse =[];
            $array_response_with_contract_details=null;
            $report = Report::where('report_status_id',2)->where('report_type_id',8)->get();
            foreach($report as $rep){
                $array_reponse[]=$this->CastCostarrayReport($rep);
            }
            $contract = ContractSupport::where('id',$request->contract_support_id)->first();
           $array_response_with_contract_details = $this->CastArraySupport($contract,$array_reponse);
          if(!empty($array_reponse[0])){
        
            return ResponseApi::acceptedResponseApi($array_response_with_contract_details,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Empty Cost"],"Empty Cost",200);

          }
            
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }
    
    
    
}
