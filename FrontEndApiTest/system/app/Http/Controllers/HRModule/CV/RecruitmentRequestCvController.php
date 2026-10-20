<?php

namespace App\Http\Controllers\HRModule\CV;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\GlobalStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use File;
use App\Models\JobTitle;
use App\Models\JobSkill;
use Illuminate\Support\Facades\DB;

use App\Models\RecruitmentRequestCv;
class RecruitmentRequestCvController extends Controller
{
    public function ParseRecruitmentRequest(RecruitmentRequestCv $dep){  
         $job_titles =[];
         $jobTitleIdString = $dep->job_title_id;
                    
         // Decode the JSON string to an array
         $jobTitleIds = json_decode($jobTitleIdString, true);
        foreach ($jobTitleIds as  $value) {
            $job_title = JobTitle::where('id',$value)->withTrashed()->first();

           
            $job_titles[]=[
                'job_title_id'=>$job_title->id,
                'hr_job_title'=>$job_title->hr_job_title,
                'description'=>$job_title->description,
                'job_status'=>$job_title->job_status==1?True:False,
                'deleted'=>empty($job_title->deleted_at)?False:True,


            ];
        }

        $job_skills =[];
        if(!empty($dep->job_skills_id)){
            $jobSkillIdString = $dep->job_skills_id;
            try{
                $job_skill_ID = json_decode($jobSkillIdString, true);
            }catch(\Exception $e){
     
                $job_skill_ID =  $dep->job_skills_id;
            }
           
           
            foreach ($job_skill_ID as  $value2) {
                $job_skill = JobSkill::where('id',$value2)->withTrashed()->first();
                $job_skills[]=[
                    'job_skill_id'=>$job_skill->id,
                    'hr_job_title'=>$job_skill->job_skill,
                    'deleted'=>empty($job_skill->deleted_at)?false:true,
                ];
            }
        }


        $array_reponse = [ 
            'id'=>$dep->id."",
            'first_name'=>$dep->first_name,
            'last_name'=>$dep->last_name,
            'phone_number'=>$dep->phone_number,
            'email'=>$dep->email,
            'file_name'=>$dep->file_name,
            'file_path' =>'/Attachments/CV/'.$dep->id.'/CV'.'/'.$dep->file_name,
            'Job_title'=> $job_titles,
            'note'=>$dep->note,
            'graduated_year'=>$dep->graduated_year,
            'experience'=>$dep->experience,
            'address'=>$dep->address,
           // 'Job_title_name'=>!empty($dep->Job_title_id_fun)?$dep->Job_title_id_fun->hr_job_title : null,
            'uploaded_by_id'=>$dep->uploaded_by_id,
            'uploaded_by_name'=>!empty($dep->uploaded_by_id_fun)?$dep->uploaded_by_id_fun->username:null,
            'uploaded_photoURL' =>$dep->uploaded_by_id_fun->photoURL? '/Attachments/User/'.$dep->uploaded_by_id_fun->id.'/profile'.'/'.$dep->uploaded_by_id_fun->photoURL:null,
             'createdAt'=>$dep->created_at,
            'updatedAt'=>$dep->updated_at,
            'job_skills_id'=>$job_skills

    
        ];
        return $array_reponse;
    }
   
    public function DeleteRecruitmentRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'string',
                'id'=>'required|numeric|exists:recruitment_request_cvs,id'
            ]);
            if ($validator->fails()) {

                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $last_cv_record = RecruitmentRequestCv::where('id',$request->id)->first();
            

               $directory = 'Attachments/CV/' . $last_cv_record->id . '/CV/'.$last_cv_record->file_name;
                if(File::exists($directory)) {
                    File::delete($directory);
                    $directory = 'Attachments/CV/' . $last_cv_record->id ;
                    File::deleteDirectory($directory);

                  }
               
               
            $last_cv_record->forceDelete();
            $last_cv_record = RecruitmentRequestCv::where('id',$request->id)->first();

                if(empty($last_cv_record->id)){
                    return ResponseApi::acceptedResponseApi(["message"=>"Deleted Successfully"],"success",201);

            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

            }
            

        }catch(\Exception $e){
     
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }

    }



    public function UploadRecruitmentRequest(Request $request){
            try{
                $currentYear = date('Y');
                $validator = Validator::make($request->all(), [
                     'token'=>'required|string',
                    'first_name'=>'required|string',
                    'last_name'=>'required|string',
                    'phone_number'=>'required|regex:/^[0-9]{11,11}$/|string|unique:recruitment_request_cvs',
                    'email' => 'required|email|unique:recruitment_request_cvs',
                    'graduated_year' => 'date_format:Y',
                    'experience'=>'numeric'

                ]);
                if ($validator->fails()) {

                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                if($request->has('graduated_year')){
                    if($request->graduated_year<1960 || $request->graduated_year>$currentYear+4){
                        return ResponseApi::badMethodErrorResponse(['message'=>'The graduated year must be between 1960 and'.$currentYear],"Validator Errors",400);

                    }
                }
                $emailPattern = '/^[\w\.-]+@[^\d]+\.com$/';

                // Check if the email matches the pattern
                if (!preg_match($emailPattern, $request->email)) {
                    return ResponseApi::badMethodErrorResponse(["message"=>"Email not Correct"],"Validator Errors",400);
                } 

                $fileArray = array('file_name' => $request->file_name);

                $rules = array(
                'file_name' => 'mimes:pdf,docx|required|max:10000' 
                );
            
                $validator = Validator::make($fileArray, $rules);
            
                if ($validator->fails())
                {
                
                    return ResponseApi::acceptedResponseApi($validator->errors()->all(),"Faild Format",400);
                    }
                if($request->has('job_title_id')){
                     // Get the job_title_id from the request
                    $jobTitleIdString = $request->input('job_title_id');
                    
                    // Decode the JSON string to an array
                    $jobTitleIds = json_decode($jobTitleIdString, true);

                    foreach ($jobTitleIds as $job_title_id) {
                        $check_existance =JobTitle::where('id',$job_title_id)->first();
                        if(empty($check_existance->id)){
                            return ResponseApi::badMethodErrorResponse(['message'=>"There is no Job Title for ID ".$job_title_id],"Validator Errors",400);
                        }
                                    
                    }
                   
                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Job Title ID is Required"],"Validator Errors",400);

                }
                if($request->has('job_skills_id')){
          
                    $jobSkillIdString = $request->input('job_skills_id');
                    $jobSkillIds = json_decode($jobSkillIdString, true);
    
                    foreach ($jobSkillIds as $job_skill_id) {
                        $check_existance =JobSkill::where('id',$job_skill_id)->first();
                        if(empty($check_existance->id)){
                            return ResponseApi::badMethodErrorResponse(['message'=>"There is no Job SKILL for ID ".$job_skill_id],"Validator Errors",400);
                        }
                                    
                    }
                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Job Skills ID is Required"],"Validator Errors",400);

                }
               

                $fileArray = array('file_name' => $request->file_name);

                $rules = array(
                'file_name' => 'mimes:pdf,docx|required|max:10000' 
                );
            
                $validator = Validator::make($fileArray, $rules);
            
                if ($validator->fails())
                {
                
                    return ResponseApi::acceptedResponseApi($validator->errors()->all(),"Faild Format",400);
                    }

                if ($request->hasFile('file_name'))  {
                    $cvFile = $request->file('file_name');
                    $file_name = $cvFile->getClientOriginalName();
 
                    $upload_CV = RecruitmentRequestCv::create([
                        'first_name'=>$request->first_name,
                        'last_name'=>$request->last_name,
                        'phone_number'=>$request->phone_number,
                        'email'=>$request->email,
                        'file_name'=>$file_name,
                        'job_title_id'=>$request->job_title_id,
                        'uploaded_by_id'=>Auth::guard('user_api')->user()->id,
                        'note'=>$request->note,
                        'graduated_year'=>$request->graduated_year,
                        'experience'=>$request->experience,
                        'address'=>$request->address,
                        'job_skills_id'=>$jobSkillIds
                    ]);

                    if(!empty($upload_CV->id)){
                        $cvFile->move(('Attachments/CV/'.$upload_CV->id.'/CV/'), $file_name);
                        $upload_CV = $this->ParseRecruitmentRequest($upload_CV);
                        return ResponseApi::acceptedResponseApi($upload_CV,"success",201);
                    }else{
                        return ResponseApi::badMethodErrorResponse(["message"=>"Unable to Create New Record"],"server Error",500);
                    }
                

                }else{
                    return ResponseApi::badMethodErrorResponse(["message"=>"CV File Must Be Exist"],"Validator Errors",400);

                }
                

            }catch(\Exception $e){
                return $e;
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

            }

    }


    public function UpdateRecruitmentRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'string',

                'id'=>'required|numeric|exists:recruitment_request_cvs,id',
                'graduated_year' => 'date_format:Y',
                'experience'=>'numeric'

            ]);
            if ($validator->fails()) {

                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            if($request->has('job_title_id')){
                // Get the job_title_id from the request
               $jobTitleIdString = $request->input('job_title_id');
               
               // Decode the JSON string to an array
               $jobTitleIds = json_decode($jobTitleIdString, true);

               foreach ($jobTitleIds as $job_title_id) {
                   $check_existance =JobTitle::where('id',$job_title_id)->first();
                   if(empty($check_existance->id)){
                       return ResponseApi::badMethodErrorResponse(['message'=>"There is no Job Title for ID ".$job_title_id],"Validator Errors",400);
                   }
                               
               }
              
           }
           if($request->has('job_skills_id')){
          
            $jobSkillIdString = $request->input('job_skills_id');
            $jobSkillIds = json_decode($jobSkillIdString, true);

            foreach ($jobSkillIds as $job_skill_id) {
                $check_existance =JobSkill::where('id',$job_skill_id)->first();
                if(empty($check_existance->id)){
                    return ResponseApi::badMethodErrorResponse(['message'=>"There is no Job SKILL for ID ".$job_skill_id],"Validator Errors",400);
                }
                            
            }
        }


            //Validate for Email and Phone number
            $last_cv_record = RecruitmentRequestCv::where('id',$request->id)->first();
            if(empty($last_cv_record->id)){
                return ResponseApi::notFoundResponse(['message'=>"Empty Recruitment Request"],"Empty",200);

            }
            if($request->has('email')&& $last_cv_record->email != $request->email){
                $validator = Validator::make($request->all(), [
                    'email' => 'required|email|unique:recruitment_request_cvs',
                ]);
                if ($validator->fails()) {

                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                $emailPattern = '/^[\w\.-]+@[^\d]+\.com$/';

                // Check if the email matches the pattern
                if (!preg_match($emailPattern, $request->email)) {
                    return ResponseApi::badMethodErrorResponse(["message"=>"Email not Correct"],"Validator Errors",400);
                }

            }
            if($request->has('phone_number')&& $last_cv_record->phone_number != $request->phone_number){
                $validator = Validator::make($request->all(), [
                    'phone_number'=>'required|regex:/^[0-9]{11,11}$/|string|unique:recruitment_request_cvs',
                ]);
                if ($validator->fails()) {

                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
            }
            
            $updateData = $request->except('file_name');
            if($request->has('file_name')){

                $fileArray = array('file_name' => $request->file_name);

                $rules = array(
                'file_name' => 'mimes:pdf,docx|required|max:10000' 
                );
                $validator = Validator::make($fileArray, $rules);
            
                if ($validator->fails())
                {
                    return ResponseApi::acceptedResponseApi($validator->errors()->all(),"Faild Format",400);
                }
                $cvFile = $request->file('file_name');
                $file_name = $cvFile->getClientOriginalName();
                $directory = 'Attachments/CV/' . $last_cv_record->id . '/CV/'.$last_cv_record->file_name;
                if(File::exists($directory)) {
                    File::delete($directory);
                  }
               
                $cvFile->move(('Attachments/CV/'.$last_cv_record->id.'/CV/'), $file_name);
       
                $updateData['file_name'] = $file_name;


            }
            $last_cv_record->update($updateData);
            $last_cv_record = RecruitmentRequestCv::where('id',$request->id)->first();

                if(!empty($last_cv_record->id)){
                    $last_cv_record = $this->ParseRecruitmentRequest($last_cv_record);
                    return ResponseApi::acceptedResponseApi($last_cv_record,"success",201);

            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

            }
            

        }catch(\Exception $e){
            return $e;
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }

    }


    public function GetAllRecruitmentRequest(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
          $reportStatus = RecruitmentRequestCv::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = $this->ParseRecruitmentRequest($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Recruitment Request"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }  

    public function GetMyUploadedRecruitmentRequest(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
          $reportStatus = RecruitmentRequestCv::where('uploaded_by_id',Auth::guard('user_api')->user()->id)->get();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = $this->ParseRecruitmentRequest($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Recruitment Request"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }  

    public function EmailandPhoneCheck(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'email' => 'email',
                    'phone_number' => 'string',
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }

                if($request->has('email')&& $request->has('phone_number')){
                    $reportStatus = RecruitmentRequestCv::where('email',$request->email)->where('phone_number',$request->phone_number)->first();
                    if(!empty($reportStatus->id)){
                        return ResponseApi::notFoundResponse(['phone_number'=>"This Phone Number Exists before",
                                                              'email'=>"This Email ID  Exists before"],"Validator Errors",400);
                     }
                  }
                  if($request->has('phone_number')){
                    $reportStatus = RecruitmentRequestCv::where('phone_number',$request->phone_number)->first();
                    if(!empty($reportStatus->id)){
                        return ResponseApi::notFoundResponse(['phone_number'=>"This Phone Number Exists before"],"Validator Errors",400);
        
                       
                    }
                  }
                  if($request->has('email')){
                    $reportStatus = RecruitmentRequestCv::where('email',$request->email)->first();
                    if(!empty($reportStatus->id)){
                        return ResponseApi::notFoundResponse(['email'=>"This Email ID Exists before"],"Validator Errors",400);
            
                    }
               
                }
                if(!$request->has('email')&& !$request->has('phone_number')){

                    return ResponseApi::badMethodErrorResponse(["message"=>"Phone Number or Email Address Required"],"Validator Errors",400);
             }
           
            return ResponseApi::acceptedResponseApi(['message'=>"Valid Data"],"success",201);

             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }  
    
    public function GetRecruitmentDetailsDuplicate(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'email' => 'email',
                    'phone_number' => 'string',

                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
                if(!$request->has('email')&&!$request->has('phone_number')){
              
                    return ResponseApi::badMethodErrorResponse(['message'=>'Empty Phone Number or Email'],"Validator Errors",400);
        
                }


        $array_reponse =[];
        if($request->has('email')){
           
                $reportStatus = RecruitmentRequestCv::where('email',$request->email)->first();

                if(!empty($reportStatus->id)){
                  
                        $array_reponse = $this->ParseRecruitmentRequest($reportStatus);
                 
 
                }
            
 

         }
         if($request->has('phone_number')&& empty($array_reponse)){
            $reportStatus = RecruitmentRequestCv::where('phone_number',$request->phone_number)->first();
            if(!empty($reportStatus->id)){
                $array_reponse = $this->ParseRecruitmentRequest($reportStatus);
                 

            }
        }
    
          if(!empty($array_reponse)){
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else if($request->has('email')){
            return ResponseApi::notFoundResponse(['email'=>"This Email ID not Exists before"],"Validator Errors",400);
        
         }else if($request->has('phone_number')){
            return ResponseApi::notFoundResponse(['phone_number'=>"This Phone Number not Exists before"],"Validator Errors",400);
         }
             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }  


    public function FilterCVRecruitment(Request $request){
        try{

            $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'first_name' => 'string',
                    'last_name' => 'string',
                    'phone_number' => 'string',
                    'email' => 'string',
                    'file_name' => 'string',
                    'uploaded_by_id'=>'numeric|exists:users,id',
                    'note' => 'string',
                    'graduated_year' => 'date_format:Y',
                    'experience' => 'numeric',
                    'address' => 'string',

                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
                $array_reponse =[];

                $filters = $request->all();
                
                // Start building the query
                $query = RecruitmentRequestCv::query(); // Replace with your actual model
        
               // Exclude the token column from the filtering
                $excludedColumns = ['token','job_skills_id','job_title_id','experience','graduated_year'];
                
               
                // Apply filters to the query
                foreach ($filters as $key => $value) {
                    if (!empty($value) && !in_array($key, $excludedColumns)) {
                        $query->where($key, $value);
                    }
                }
                if($request->has('experience')){
                    $query-> where('experience','>=',$request->experience);
                }
                if($request->has('graduated_year')){
                    $query-> where('graduated_year','>=',$request->graduated_year);
                }

                $idsToMatch = [];
                if($request->has('job_skills_id')){

                    $idsToMatch = $request->input('job_skills_id');
                    $idsToMatch = json_decode($idsToMatch, true);
                }else if ($request->has('job_title_id')){
                    $job_Title_ids = $request->input('job_title_id');
                    $job_Title_array = json_decode($job_Title_ids, true);
                    foreach ($job_Title_array as $value) {
                        $job_Skills = JobTitle::where('id',$value)->withTrashed()->first();
                        if(!empty($job_Skills->job_skills_id)){
                            $jobSkillIdString = $job_Skills->job_skills_id;
                            try{
                                $job_skill_ID = json_decode($jobSkillIdString, true);
                                 $idsToMatch = array_merge($idsToMatch, $job_skill_ID );

                            }catch(\Exception $e){
                      
                                $idsToMatch = array_merge($idsToMatch, $job_Skills->job_skills_id );
                            }
                        }
                    }
                }
         
                $query->orderBy('experience','desc');
                // Execute the query and get the results
                $results = $query->get();
                  // Calculate match percentage for each result
                // Calculate match percentage for each result
                $results->transform(function ($item) use ($idsToMatch) {
                    // Check if job_skills_id is already an array
                    $storedArray = is_array($item->job_skills_id) ? $item->job_skills_id : json_decode($item->job_skills_id, true);
                    
                    if (!is_array($storedArray)) {
                        $storedArray = [];
                    }
                     $matchPercentage = $this->calculateMatchPercentage($idsToMatch, $storedArray);
                     $item->match_percentage = round($matchPercentage, 2);
                    return $item;
                });

                // Filter results where match_percentage key exists
                $filteredResults = $results->filter(function ($item) {
                    return isset($item->match_percentage);
                });

                // Sort filtered results by match percentage in descending order
                $sortedResults = $filteredResults->sortByDesc('match_percentage')->values();
                if(!empty($idsToMatch)){

                    $sortedResults= $sortedResults->where('match_percentage','<>',0);
                }

                // Job TITLE CHECK 
                if($request->has('job_title_id')){
                    $job_Title_ids = $request->input('job_title_id');
                    $job_Title_array = json_decode($job_Title_ids, true);

                    $sortedResults->transform(function ($item) use ($job_Title_array) {
                        // Check if job_skills_id is already an array
                        $storedArray = is_array($item->job_title_id) ? $item->job_title_id : json_decode($item->job_title_id, true);
                        
                        if (!is_array($storedArray)) {
                            $storedArray = [];
                        }
                         $matchPercentageJobTitle = $this->calculateMatchPercentage($job_Title_array, $storedArray);
                         $item->matchPercentageJobTitle = round($matchPercentageJobTitle, 2);
                        return $item;
                    });
                    $sortedResults = $filteredResults->sortByDesc('matchPercentageJobTitle')->values();
                    if(!empty($job_Title_array)){

                        $sortedResults= $sortedResults->where('matchPercentageJobTitle','<>',0);
                    }
                 }
                


                        
                foreach ($sortedResults as $dep) {
                    $temp['match_percentage'] = $dep->match_percentage;
                    $array_reponse[] = $this->ParseRecruitmentRequest($dep)+$temp;
                    $temp = [];
                }

                
            
                if(!empty($array_reponse)){
                    return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
                 }else{
                    return ResponseApi::notFoundResponse(['message'=>"Empty Data Found"],"Empty Data",200);
                 }
                     
                }catch(\Exception $e){
                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                }
        
    }  


    public function calculateMatchPercentage(array $array1, array $array2): float
    {
        // Ensure unique elements in both arrays
        $uniqueArray1 = array_unique($array1);
        $uniqueArray2 = array_unique($array2);

        // Calculate the intersection count
        $intersectionCount = count(array_intersect($uniqueArray1, $uniqueArray2));

        // Calculate the percentage of matching elements
        if(count($uniqueArray1) != 0){

            $matchPercentage = ($intersectionCount / count($uniqueArray1)) * 100;
        }else{
            $matchPercentage = 0;
        }

        return $matchPercentage;
    }


    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RecruitmentRequest  $recruitmentRequest
     * @return \Illuminate\Http\Response
     */
    public function show(RecruitmentRequest $recruitmentRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RecruitmentRequest  $recruitmentRequest
     * @return \Illuminate\Http\Response
     */
    public function edit(RecruitmentRequest $recruitmentRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RecruitmentRequest  $recruitmentRequest
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RecruitmentRequest $recruitmentRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RecruitmentRequest  $recruitmentRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(RecruitmentRequest $recruitmentRequest)
    {
        //
    }
}
