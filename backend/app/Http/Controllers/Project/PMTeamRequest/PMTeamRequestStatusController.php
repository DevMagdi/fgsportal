<?php


namespace App\Http\Controllers\Project\PMTeamRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\PMTeamRequestStatus;
 
class PMTeamRequestStatusController extends Controller
{  


    public function DeletePMTeamRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'pm_team_reqeust_status_id'=>'required|numeric|exists:p_m_team_request_statuses,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  PMTeamRequestStatus::where('id',$request->pm_team_reqeust_status_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"PM Team Request Status not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdatePMTeamRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'pm_team_request_status' => 'required|string|unique:p_m_team_request_statuses',
                'token'=>'required|string',
                'pm_team_reqeust_status_id'=>'required|numeric|exists:p_m_team_request_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  PMTeamRequestStatus::where('id',$request->pm_team_reqeust_status_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update([
                'pm_team_request_status' =>$request->pm_team_request_status,
            ]);

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"PM Team Request Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreatePMTeamRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'pm_team_request_status' => 'required|string|unique:p_m_team_request_statuses',
                'token'=>'required|string'
            ]);
             if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  PMTeamRequestStatus::create([
            'pm_team_request_status' =>$request->pm_team_request_status,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllPMTeamRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string'
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus = PMTeamRequestStatus::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = [ 
                'pm_team_request_status' =>$dep->pm_team_request_status,
                'key'=>$dep->id.""

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"PM Team Request Status not found"],"Validator Errors",400);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
}
