<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\Auth\AuthController;
use App\Http\Controllers\User\OpenToWork\UserOpenToWorkController;
use App\Http\Controllers\User\Auth\UserViolenceController;
use App\Http\Controllers\Settings\Department\DepartmentController;
use App\Http\Controllers\Settings\Department\SubDepartmentController;
use App\Http\Controllers\Settings\Product\ProductController;
use App\Http\Controllers\Settings\Product\SubProductController;
use App\Http\Controllers\Settings\DeveloperDivision\DeveloperDivisionController;
use App\Http\Controllers\Settings\WorkDegree\WorkDegreeController;
use App\Http\Controllers\Tools\PhoneTypeController;
use App\Http\Controllers\Project\Tools\ProjectTypeController;
use App\Http\Controllers\Project\Tools\ProjectStructureController;
use App\Http\Controllers\Project\Tools\ProjectStatusController;
use App\Http\Controllers\Project\Tools\ProjectCommentController;
use App\Http\Controllers\Project\Tools\ProjectTeamController;
use App\Http\Controllers\Client\Partner\PartnerController;
use App\Http\Controllers\Project\Project\ProjectController;
use App\Http\Controllers\Project\Project\CloneProjectController;
use App\Http\Controllers\Project\Process\ProcessController;
use App\Http\Controllers\Project\Task\TaskController;
use App\Http\Controllers\Settings\Permission\PermissionController;
use App\Http\Controllers\Settings\Permission\PermissionGroupController;
use App\Http\Controllers\Project\Tools\ProcessStatusController;
use App\Http\Controllers\Project\Tools\ProcessTeamController;
use App\Http\Controllers\Project\Tools\ProcessCommentController;
use App\Http\Controllers\Project\Tools\TaskStatusController;
use App\Http\Controllers\Project\Tools\TaskTypeController;
use App\Http\Controllers\Project\Tools\TaskStructureController;
use App\Http\Controllers\Project\Tools\TaskCommentController;
use App\Http\Controllers\Project\Tools\ProcessAttachController;
use App\Http\Controllers\Settings\License\LicenseTypeController;
use App\Http\Controllers\Settings\License\LicenseStatusController;
use App\Http\Controllers\Settings\License\LicenseController;
use App\Http\Controllers\Settings\PublicRequest\PublicRequestTypeController;
use App\Http\Controllers\Settings\PublicRequest\PublicRequestStatusController;
use App\Http\Controllers\Settings\PublicRequest\PublicRequestController;
use App\Http\Controllers\Settings\Logs\LogController;
use App\Http\Controllers\Settings\TransportationRequest\TransportationRequestStatusController;
use App\Http\Controllers\Settings\TransportationRequest\TransportationRequestController;
use App\Http\Controllers\User\FamilyInformation\FamilyInformationController;
use App\Http\Controllers\Report\ReportStatusController;
use App\Http\Controllers\Report\ReportTypeController;
use App\Http\Controllers\Report\ReportController;
use App\Http\Controllers\Settings\Incentive\IncentiveStatusController;
use App\Http\Controllers\Settings\Incentive\IncentiveRequestController;
use App\Http\Controllers\User\Profile\UserDetailController;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Http\Controllers\Settings\Annual\AnnualTypeController;
use App\Http\Controllers\Settings\Annual\AnnualStatusController;
use App\Http\Controllers\Settings\Annual\PermissionBalanceController;
use App\Http\Controllers\Settings\Annual\UserAnnualController;
use App\Http\Controllers\Settings\Annual\AnnualRequestController;
use App\Http\Controllers\User\Manager\ManagerReportController;
use App\Http\Controllers\Project\ProjectCost\ProjectCostController;
use App\Http\Controllers\Project\ProjectCost\CostTypeController;
use App\Http\Controllers\Project\ProjectCost\ProjectCostManualController;
use App\Http\Controllers\Client\TicketingSystem\Ticket\TicketTypeController;
use App\Http\Controllers\Client\TicketingSystem\Ticket\TicketPriorityController;
use App\Http\Controllers\Client\TicketingSystem\Ticket\TicketTagController;
use App\Http\Controllers\Client\TicketingSystem\ContractSupport\ContractTypeController;
use App\Http\Controllers\Client\TicketingSystem\ContractSupport\ContractStatusController;
use App\Http\Controllers\Client\TicketingSystem\ContractSupport\ContractSupportController;
use App\Http\Controllers\Client\TicketingSystem\ContractSupport\ClientAccountController;
use App\Http\Controllers\Client\TicketingSystem\Ticket\ClientTicketUpdateController;

use App\Http\Controllers\Client\Auth\AuthClientController;
use App\Http\Controllers\Client\TicketingSystem\Ticket\TicketController;
use App\Http\Controllers\Client\TicketingSystem\Ticket\DeveloperTicketActionController;

use App\Http\Controllers\Settings\WorkHours\WorkHoursConfigController;

use App\Http\Controllers\Client\TicketingSystem\Ticket\ManagerTicketUpdateController;
use App\Http\Controllers\User\PermissionGroup\UserPermissionGroupController;

use App\Http\Controllers\Settings\Announce\AnnounceController;


use App\Http\Controllers\DatabaseConvertSecondController;
use App\Http\Controllers\DatabaseConvertController;

//crm
use App\Http\Controllers\User\Business\Settings\LabelColor\LabelColorController;
use App\Http\Controllers\User\Business\Settings\AdsPlatform\AdsPlatformController;
use App\Http\Controllers\User\Business\Settings\ContactLeadType\ContactLeadTypeController;
use App\Http\Controllers\User\Business\Settings\ContactLeadSubStatus\ContactLeadSubStatusController;
use App\Http\Controllers\User\Business\Settings\ContactLeadStatus\ContactLeadStatusController;
use App\Http\Controllers\User\Business\ActivityandLead\ContactLeadController;
use App\Http\Controllers\User\Business\ActivityandLead\ContactController;
use App\Http\Controllers\User\Business\ActivityandLead\ContactLeadActivityController;
use App\Http\Controllers\User\Business\Settings\ActivityType\ActivityTypeController;
use App\Http\Controllers\User\Business\Settings\ActivityStatus\ActivityStatusController;
use App\Http\Controllers\User\Business\ActivityandLead\ContactLeadAttachController;
use App\Http\Controllers\User\Business\ActivityandLead\RequestPOCStatusController;
use App\Http\Controllers\User\Business\ActivityandLead\RequestPOCPriorityController;
use App\Http\Controllers\User\Business\ActivityandLead\RequestPocController;
use App\Http\Controllers\User\Business\ActivityandLead\ContactLeadCostTypeController;

use  App\Http\Controllers\User\Business\Settings\PartnerIndustry\PartnerIndustryController;
use App\Http\Controllers\Client\Partner\OrganizationTypeController;

//rating 
use App\Http\Controllers\Rating\QuestionGroupController;
use App\Http\Controllers\Rating\QuestionController;
use App\Http\Controllers\Rating\AskForRateController;
use App\Http\Controllers\Rating\RatingController;
use App\Http\Controllers\Rating\QuestionGroupTypeController;
use App\Http\Controllers\Rating\QuestionTypeController;
use App\Http\Controllers\Rating\QuestionGroupSubTypeController;




//campagin
use App\Http\Controllers\User\Business\Campagin\CampaginController;


//Request RFP 
use App\Http\Controllers\User\Business\RFPRequest\RequestRFPStatusController;
use App\Http\Controllers\User\Business\RFPRequest\RequestRFPController;

//dashboard
use App\Http\Controllers\User\Dashboard\AdminDashboardController;
use App\Http\Controllers\User\Dashboard\DashboardController;


//To DO
use App\Http\Controllers\ToDo\KeepNoteStatusController;
use App\Http\Controllers\ToDo\ToDoListController;
use App\Http\Controllers\ToDo\KeepNoteController;


//Salary
use App\Http\Controllers\User\Salary\UserSalaryController;
use App\Http\Controllers\User\Salary\SalaryTypeController;
use App\Http\Controllers\User\Salary\SalaryGrossController;

//admin Report
use App\Http\Controllers\AdminReport\AdminReportController;
use App\Http\Controllers\AdminReport\AdminTaskController;


// installment Feature 
use App\Http\Controllers\InstallmentFeature\InstallmentStatusController;
use App\Http\Controllers\InstallmentFeature\InstallmentTypeController;
use App\Http\Controllers\InstallmentFeature\InstallmentController;

// Team Request From PM to CEO
use App\Http\Controllers\Project\PMTeamRequest\PMTeamRequestStatusController;
use App\Http\Controllers\Project\PMTeamRequest\PMTeamRequestController;

//php artisan migrate --path=/database/migrations/
// HR Module
use App\Http\Controllers\HRModule\Statuses\InterviewStatusController;
use App\Http\Controllers\HRModule\Statuses\GlobalStatusController;
use App\Http\Controllers\HRModule\TypesAndPhases\OnboardingRequirementController;
use App\Http\Controllers\HRModule\TypesAndPhases\InterviewPhaseController;
use App\Http\Controllers\HRModule\TypesAndPhases\JobTitleController;
use App\Http\Controllers\HRModule\TypesAndPhases\AttachmentTypeController;
use App\Http\Controllers\HRModule\TypesAndPhases\RecruitmentEmailTypeController;
use App\Http\Controllers\HRModule\TypesAndPhases\CompanyPolicyController;
use App\Http\Controllers\HRModule\CV\RecruitmentRequestCvController;
use App\Http\Controllers\HRModule\CV\RecruitmentRequestHistoryController;
use  App\Http\Controllers\HRModule\OnBoarding\RequestOnboardingController;
use  App\Http\Controllers\HRModule\OnBoarding\RecruitmentEmailController;
use  App\Http\Controllers\HRModule\OnBoarding\RecruitmentAttachmentController;
use App\Http\Controllers\HRModule\TypesAndPhases\JobSkillController;

//Contract Support Cost 

use App\Http\Controllers\Client\TicketingSystem\ContractSupport\ContractSupportCostController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
  Route::get('/GetTimeDate', [LogController::class, 'GetTimeDate']);    

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['middleware' => [ 'cors','api'],'prefix' => 'clients'], function ($router) {

  #################################### User Auth#########################################
  Route::post('/logout', [AuthClientController::class, 'logout'])->middleware(['jwt.verify']);
  Route::post('/login', [AuthClientController::class, 'login']);
  Route::post('/ForgetPasswordClient', [AuthClientController::class, 'ForgetPasswordClient']);
  Route::post('/NewPasswordClient', [AuthClientController::class, 'NewPasswordClient']);
  Route::get('/GetTimeDate', [LogController::class, 'GetTimeDate']);    


});
Route::group(['middleware' => [ 'cors','api'],'prefix' => 'users'], function ($router) {

  #################################### User Auth#########################################
  Route::post('/logout', [AuthController::class, 'logout'])->middleware(['jwt.verify']);
  Route::post('/login', [AuthController::class, 'login']);
  Route::post('/ForgetPasswordUser', [AuthController::class, 'ForgetPasswordUser']);
  Route::post('/NewPasswordUser', [AuthController::class, 'NewPasswordUser']);
  
  Route::get('/NotificationTest', [PartnerController::class, 'NotificationTest']);
  Route::get('/GetTimeDate', [LogController::class, 'GetTimeDate']);    
  Route::post('/notificationSend', [MessageController::class, 'notificationSend']);   
  
  
  Route::post('/hello', [MessageController::class, 'hello']);   
  Route::post('/updatedatafirebase', [MessageController::class, 'updatedatafirebase']);   
  Route::post('/CreateResetBalance', [UserAnnualController::class, 'CreateResetBalance']);    
  Route::post('/yearlyPendingBalance', [UserAnnualController::class, 'yearlyPendingBalance']);    
  Route::post('/DiscountFromPending', [UserAnnualController::class, 'DiscountFromPending']);    

  
  Route::post('/ClosePreviousReport', [AuthController::class, 'ClosePreviousReport']);
  Route::post('/ExpiredLicense', [LicenseController::class, 'ExpiredLicense']);
  Route::post('/ActivityNotification', [ContactLeadActivityController::class, 'ActivityNotification']);

  
  Route::post('/ExpiredSupport', [ContractSupportController::class, 'ExpiredSupport']);
    Route::post('/DeactivateAllActiveOpenToWork', [UserOpenToWorkController::class, 'DeactivateAllActiveOpenToWork']);
    Route::post('/ExpiredUserContact', [UserDetailController::class, 'ExpiredUserContact']);    

  

});
// Modular system: the bare "module" middleware resolves the required module from
// the controller handling each route via config('modules.controller_map').
// Core (Users/Auth/Permissions) controllers are unmapped and always allowed.
Route::group(['middleware' => [ 'cors','jwt.verify','module'],'prefix' => 'clients'], function ($router) {
  Route::get('/me', [AuthClientController::class, 'me']);
 Route::post('/GetMyOpenTicket', [TicketController::class, 'GetMyOpenTicket']);  
  Route::post('/GetMyClosedTicket', [TicketController::class, 'GetMyClosedTicket']);  
  Route::post('/CreateTicket', [TicketController::class, 'CreateTicket']);    
  Route::post('/GetPrimaryAccountContractSupport', [ContractSupportController::class, 'GetPrimaryAccountContractSupport']);
  Route::post('/CreateLogs', [LogController::class, 'CreateLogs']);    
  
    Route::post('/GetSpecificTicket', [TicketController::class, 'GetSpecificTicket']);  
  Route::post('/ClientUpdateTicket', [ClientTicketUpdateController::class, 'ClientUpdateTicket']);  
  Route::post('/GetTicketTimeline', [ClientTicketUpdateController::class, 'GetTicketTimeline']);  

 
  Route::post('/EscalateTicket', [DeveloperTicketActionController::class, 'EscalateTicket']);  
  Route::post('/AddTicketComment', [DeveloperTicketActionController::class, 'AddTicketComment']);  
  
    Route::post('/SeenMyAnnounceClient', [AnnounceController::class, 'SeenMyAnnounceClient']);  
               Route::post('/ClientSeenAnnounce', [AnnounceController::class, 'ClientSeenAnnounce']);  
                Route::post('/ShowMyAnnounceClient', [AnnounceController::class, 'ShowMyAnnounceClient']);  
                            ##################################### Ticket Tag ###########################################################
            Route::get('/GetAllTicketTag', [TicketTagController::class, 'GetAllTicketTag']);    
            Route::get('/GetMyTicketTag', [TicketTagController::class, 'GetMyTicketTag']);
            Route::get('/GetMyTicketTagsInsights', [TicketTagController::class, 'GetMyTicketTagsInsights']);
            Route::get('/GetMyTicketInsights', [TicketController::class, 'GetMyTicketInsights']);

            Route::post('/CreateTicketTag', [TicketTagController::class, 'CreateTicketTag']);    
            Route::post('/UpdateTicketTag', [TicketTagController::class, 'UpdateTicketTag']);    
            Route::post('/DeleteTicketTag', [TicketTagController::class, 'DeleteTicketTag']);

            Route::post('/CreateTicketRateClient', [RatingController::class, 'CreateTicketRateClient']);
            Route::post('/GetClientPendingRate', [RatingController::class, 'GetClientPendingRate']);

            Route::post('/GetSpecificQuestions', [QuestionController::class, 'GetSpecificQuestions']);    

            
});

Route::group(['middleware' => [ 'cors','jwt.verify','module'],'prefix' => 'users'], function ($router) {
    #################################### User Settings #########################################
    Route::post('/UserResetPassword', [AuthController::class, 'UserResetPassword']);
    #################################### Create user #########################################
    Route::post('/createAccount', [AuthController::class, 'store']);
    Route::get('/me', [AuthController::class, 'me']);


    ####################################  USER API's #########################################
    Route::post('/DeactivateAccount', [AuthController::class, 'DeactivateAccount']);
    Route::post('/ActivateAccount', [AuthController::class, 'ActivateAccount']);
    Route::post('/RefreshAll', [AuthController::class, 'RefreshAll']);
    Route::post('/UserRefreshed', [AuthController::class, 'UserRefreshed']);
    Route::post('/BlockAccountViolence', [UserViolenceController::class, 'BlockAccountViolence']);
    Route::get('/GetBlockAccountViolence', [UserViolenceController::class, 'GetBlockAccountViolence']);
    Route::get('/getAllUser', [AuthController::class, 'getAllUser']);
    Route::get('/getDeactivatedUser', [AuthController::class, 'getDeactivatedUser']);
    Route::post('/EditUser', [AuthController::class, 'EditUser']);
    Route::post('/FilterUser', [AuthController::class, 'FilterUser']);
    Route::post('/OpentoWork', [AuthController::class, 'OpentoWork']);
    Route::post('/GetAllOpentoWork', [AuthController::class, 'GetAllOpentoWork']);
    
    Route::post('/CreateNewOpenToWork', [UserOpenToWorkController::class, 'CreateNewOpenToWork']);
    Route::post('/UpdateOpenToWork', [UserOpenToWorkController::class, 'UpdateOpenToWork']);
    Route::post('/GetActiveOpenToWork', [UserOpenToWorkController::class, 'GetActiveOpenToWork']);

    Route::post('/Ticketmanagment', [TicketController::class, 'Ticketmanagment']);


    
  ###################################### Profile ###########################################################
  Route::post('/GetUserProfileData', [UserDetailController::class, 'GetUserProfileData']);    
    Route::get('/getAllUserData', [UserDetailController::class, 'getAllUserData']);

  Route::post('/CanAddPreviousReport', [UserDetailController::class, 'CanAddPreviousReport']);    
  Route::post('/UploadProfilePhoto', [UserDetailController::class, 'UploadProfilePhoto']);    
  Route::post('/UploadProfileData', [UserDetailController::class, 'UploadProfileData']);    
  
    
  

  
     ################################# Department ######################################################
     Route::get('/GetAllDepartment', [DepartmentController::class, 'GetAllDepartment']);    
     Route::post('/CreateDepartment', [DepartmentController::class, 'CreateDepartment']);    
     Route::post('/UpdateDepartmentName', [DepartmentController::class, 'UpdateDepartmentName']);    
     Route::post('/DeleteDepartment', [DepartmentController::class, 'DeleteDepartment']);    


     ################################# Sub Department ######################################################
     Route::get('/GetAllSubDepartment', [SubDepartmentController::class, 'GetAllSubDepartment']);    
     Route::get('/GetSubDepartmentWithDepartment', [SubDepartmentController::class, 'GetSubDepartmentWithDepartment']);    
     Route::post('/GetSubDepartmentForSpecificDepartment', [SubDepartmentController::class, 'GetSubDepartmentForSpecificDepartment']);    

     Route::post('/CreateSubDepartment', [SubDepartmentController::class, 'CreateSubDepartment']);    
     Route::post('/UpdateSubDepartmentName', [SubDepartmentController::class, 'UpdateSubDepartmentName']);    
     Route::post('/DeleteSubDepartment', [SubDepartmentController::class, 'DeleteSubDepartment']);    



     ###################################### Product ###########################################################
     Route::get('/GetAllProduct', [ProductController::class, 'GetAllProduct']);    
     Route::post('/CreateProduct', [ProductController::class, 'CreateProduct']);    
     Route::post('/UpdateProductName', [ProductController::class, 'UpdateProductName']);    
     Route::post('/DeleteProduct', [ProductController::class, 'DeleteProduct']);    

     
    ###################################### Sub Product ###########################################################
    Route::get('/GetAllSubProduct', [SubProductController::class, 'GetAllSubProduct']);    
    Route::get('/GetSubProductWithProduct', [SubProductController::class, 'GetSubProductWithProduct']);    
    Route::post('/GetSubProductForSpecificProduct', [SubProductController::class, 'GetSubProductForSpecificProduct']);    
    Route::post('/CreateSubProduct', [SubProductController::class, 'CreateSubProduct']);    
    Route::post('/UpdateSubProductName', [SubProductController::class, 'UpdateSubProductName']);    
    Route::post('/DeleteSubProduct', [SubProductController::class, 'DeleteSubProduct']);    

    ##################################### Phone Type ###########################################################
    Route::get('/GetAllPhoneType', [PhoneTypeController::class, 'GetAllPhoneType']);    
    Route::post('/CreatePhoneType', [PhoneTypeController::class, 'CreatePhoneType']);    
    Route::post('/UpdatePhoneType', [PhoneTypeController::class, 'UpdatePhoneType']);    
    Route::post('/DeletePhoneType', [PhoneTypeController::class, 'DeletePhoneType']);    

    
     ###################################### Divisions ###########################################################
     Route::get('/GetAllDivision', [DeveloperDivisionController::class, 'GetAllDivision']);    
     Route::post('/CreateDivision', [DeveloperDivisionController::class, 'CreateDivision']);    
     Route::post('/UpdateDivisionSubProduct', [DeveloperDivisionController::class, 'UpdateDivisionSubProduct']);    
     Route::post('/UpdateDivisionUser', [DeveloperDivisionController::class, 'UpdateDivisionUser']);    
     Route::post('/DeleteDivision', [DeveloperDivisionController::class, 'DeleteDivision']);    
     
    
      ################################# WorkDegree ######################################################
      Route::get('/GetAllWorkDegree', [WorkDegreeController::class, 'GetAllWorkDegree']);    
      Route::post('/CreateWorkDegree', [WorkDegreeController::class, 'CreateWorkDegree']);    
      Route::post('/UpdateWorkDegreeName', [WorkDegreeController::class, 'UpdateWorkDegreeName']);    
      Route::post('/DeleteWorkDegree', [WorkDegreeController::class, 'DeleteWorkDegree']);    

     ##################################### Project Type ###########################################################
      Route::get('/GetAllProjectType', [ProjectTypeController::class, 'GetAllProjectType']);    
      Route::post('/CreateProjectType', [ProjectTypeController::class, 'CreateProjectType']);    
      Route::post('/UpdateProjectType', [ProjectTypeController::class, 'UpdateProjectType']);    
      Route::post('/DeleteProjectType', [ProjectTypeController::class, 'DeleteProjectType']);    

      ##################################### Project Structure ###########################################################
      Route::get('/GetAllProjectStructure', [ProjectStructureController::class, 'GetAllProjectStructure']);    
      Route::post('/CreateProjectStructure', [ProjectStructureController::class, 'CreateProjectStructure']);    
      Route::post('/UpdateProjectStructure', [ProjectStructureController::class, 'UpdateProjectStructure']);    
      Route::post('/DeleteProjectStructure', [ProjectStructureController::class, 'DeleteProjectStructure']);    


      ##################################### Project Status ###########################################################
      Route::get('/GetAllProjectStatus', [ProjectStatusController::class, 'GetAllProjectStatus']);    
      Route::post('/CreateProjectStatus', [ProjectStatusController::class, 'CreateProjectStatus']);    
      Route::post('/UpdateProjectStatus', [ProjectStatusController::class, 'UpdateProjectStatus']);    
      Route::post('/DeleteProjectStatus', [ProjectStatusController::class, 'DeleteProjectStatus']);  


     ##################################### Partner  ###########################################################
     Route::get('/GetAllPartner', [PartnerController::class, 'GetAllPartner']);    
     Route::get('/GetMyPartner', [PartnerController::class, 'GetMyPartner']);    
     Route::post('/CreatePartner', [PartnerController::class, 'CreatePartner']);    
     Route::post('/UpdatePartner', [PartnerController::class, 'UpdatePartner']);    
     Route::post('/DeletePartner', [PartnerController::class, 'DeletePartner']);   
     Route::post('/GetSpecifciPartner', [PartnerController::class, 'GetSpecifciPartner']);   

     

     ##################################### Permission ###########################################################
     Route::get('/GetAllPermission', [PermissionController::class, 'GetAllPermission']);    
     Route::post('/CreatePermission', [PermissionController::class, 'CreatePermission']);    
     Route::post('/UpdatePermission', [PermissionController::class, 'UpdatePermission']);    
     Route::post('/DeletePermission', [PermissionController::class, 'DeletePermission']);  
     Route::post('/GetAllUserByPermissionID', [PermissionController::class, 'GetAllUserByPermissionID']);  


      ##################################### Permission  Group ###########################################################
    Route::post('/GetAllPermissionGroups', [PermissionGroupController::class, 'GetAllPermissionGroups']);    
    Route::post('/UpdatePermissionGroup', [PermissionGroupController::class, 'UpdatePermissionGroup']);    
    Route::post('/CreatePermissionGroup', [PermissionGroupController::class, 'CreatePermissionGroup']);    
  



     

     ##################################### Project ###########################################################
     Route::get('/GetAllProject', [ProjectController::class, 'GetAllProject']);    
     Route::post('/CreateProject', [ProjectController::class, 'CreateProject']);    
      Route::post('/DeleteProject', [ProjectController::class, 'DeleteProject']);  
     Route::post('/UpdateProjectStatus', [ProjectController::class, 'UpdateProjectStatus']);  
     Route::post('/UpdateProject', [ProjectController::class, 'UpdateProject']);  
     Route::post('/UpdateProjectBudget', [ProjectController::class, 'UpdateProjectBudget']);  
     Route::post('/ConvertProjectToNormal', [ProjectController::class, 'ConvertProjectToNormal']);  
     Route::get('/GetConvertedProject', [ProjectController::class, 'GetConvertedProject']);  
     Route::post('/GetProjectForSpecificStatus', [ProjectController::class, 'GetProjectForSpecificStatus']);  
     Route::get('/GetProjectAfterConverted', [ProjectController::class, 'GetProjectAfterConverted']);  
     Route::get('/GetDeleteProject', [ProjectController::class, 'GetDeleteProject']);  
     Route::get('/GetSpecificProject', [ProjectController::class, 'GetSpecificProject']);  
     Route::post('/GetUserProject', [ProjectController::class, 'GetUserProject']);  
     Route::post('/GetClosedProject', [ProjectController::class, 'GetClosedProject']);  
     Route::post('/GetallProjectWithClosed', [ProjectController::class, 'GetallProjectWithClosed']);  
     Route::post('/GetAllProjectWithPM', [ProjectController::class, 'GetAllProjectWithPM']);
     Route::post('/ReturnReportToPending', [ReportController::class, 'ReturnReportToPending']);


    #################################### Clone Project ################################################
    
    Route::post('/CloneOldProject', [CloneProjectController::class, 'CloneOldProject']);
    Route::post('/GetProjectForClone', [CloneProjectController::class, 'GetProjectForClone']);


    
    ##################################### Project Comment ###########################################################
    Route::post('/GetProjectComment', [ProjectCommentController::class, 'GetProjectComment']);    
    Route::post('/CreateProjectComment', [ProjectCommentController::class, 'CreateProjectComment']);    
    Route::post('/UpdateProjectComment', [ProjectCommentController::class, 'UpdateProjectComment']);    
    Route::post('/DeleteProjectComment', [ProjectCommentController::class, 'DeleteProjectComment']);  

    ##################################### Project Team ###########################################################
    Route::post('/GetProjectTeam', [ProjectTeamController::class, 'GetProjectTeam']);    
    Route::post('/CreateProjectTeam', [ProjectTeamController::class, 'CreateProjectTeam']);    
    Route::post('/UpdateProjectTeamMember', [ProjectTeamController::class, 'UpdateProjectTeamMember']);    
    Route::post('/DeleteProjectTeamMember', [ProjectTeamController::class, 'DeleteProjectTeamMember']);  



    ##################################### Process Status ###########################################################
    Route::get('/GetAllProcessStatus', [ProcessStatusController::class, 'GetAllProcessStatus']);    
    Route::post('/CreateProcessStatus', [ProcessStatusController::class, 'CreateProcessStatus']);    
    Route::post('/UpdateProcessStatus', [ProcessStatusController::class, 'UpdateProcessStatus']);    
    Route::post('/DeleteProcessStatus', [ProcessStatusController::class, 'DeleteProcessStatus']); 


    ##################################### Process ###########################################################
    Route::get('/GetAllProcess', [ProcessController::class, 'GetAllProcess']);    
    Route::post('/CreateProcess', [ProcessController::class, 'CreateProcess']);    
     Route::post('/DeleteProcess', [ProcessController::class, 'DeleteProcess']);  
    Route::post('/UpdateProcessStatus', [ProcessController::class, 'UpdateProcessStatus']);  
    Route::post('/UpdateProcessDescription', [ProcessController::class, 'UpdateProcessDescription']);  
    Route::post('/UpdateProcess', [ProcessController::class, 'UpdateProcess']);  
    Route::post('/GetProcessForSpecificStatus', [ProcessController::class, 'GetProcessForSpecificStatus']);  
    Route::post('/GetProcessForSpecificProject', [ProcessController::class, 'GetProcessForSpecificProject']);  
    Route::post('/GetSpecificProcess', [ProcessController::class, 'GetSpecificProcess']);  
    Route::post('/GetUserProcess', [ProcessController::class, 'GetUserProcess']);  
    Route::post('/GetProjectProcess', [ProcessController::class, 'GetProjectProcess']);  
    Route::get('/GetDeleteProcess', [ProcessController::class, 'GetDeleteProcess']);  
    
     
     
    ##################################### Process Comment ###########################################################
    Route::post('/GetProcessComment', [ProcessCommentController::class, 'GetProcessComment']);    
    Route::post('/CreateProcessComment', [ProcessCommentController::class, 'CreateProcessComment']);    
    Route::post('/UpdateProcessComment', [ProcessCommentController::class, 'UpdateProcessComment']);    
    Route::post('/DeleteProcessComment', [ProcessCommentController::class, 'DeleteProcessComment']);  

    ##################################### Process Team ###########################################################
    Route::post('/GetProcessTeam', [ProcessTeamController::class, 'GetProcessTeam']);    
    Route::post('/CreateProcessTeam', [ProcessTeamController::class, 'CreateProcessTeam']);    
    Route::post('/DeleteProcessTeamMember', [ProcessTeamController::class, 'DeleteProcessTeamMember']);


    ##################################### Process Attach ###########################################################
    Route::post('/GetProcessAttach', [ProcessAttachController::class, 'GetProcessAttach']);    
    Route::post('/GetTaskAttaches', [ProcessAttachController::class, 'GetTaskAttaches']);    
    Route::post('/CreateProcessAttach', [ProcessAttachController::class, 'CreateProcessAttach']);    
    Route::post('/DeleteProcessAttach', [ProcessAttachController::class, 'DeleteProcessAttach']);  
    Route::post('/GetProcessAttaches', [ProcessAttachController::class, 'GetProcessAttaches']);    



    ##################################### Task Status ###########################################################
    Route::get('/GetAllTaskStatus', [TaskStatusController::class, 'GetAllTaskStatus']);    
    Route::post('/CreateTaskStatus', [TaskStatusController::class, 'CreateTaskStatus']);    
    Route::post('/UpdateTaskStatus', [TaskStatusController::class, 'UpdateTaskStatus']);    
    Route::post('/DeleteTaskStatus', [TaskStatusController::class, 'DeleteTaskStatus']);  

    ##################################### Task Type ###########################################################
    Route::get('/GetAllTaskType', [TaskTypeController::class, 'GetAllTaskType']);    
    Route::post('/CreateTaskType', [TaskTypeController::class, 'CreateTaskType']);    
    Route::post('/UpdateTaskType', [TaskTypeController::class, 'UpdateTaskType']);    
    Route::post('/DeleteTaskType', [TaskTypeController::class, 'DeleteTaskType']);    

     ##################################### Task Structure ###########################################################
     Route::get('/GetAllTaskStructure', [TaskStructureController::class, 'GetAllTaskStructure']);    
     Route::post('/CreateTaskStructure', [TaskStructureController::class, 'CreateTaskStructure']);    
     Route::post('/UpdateTaskStructure', [TaskStructureController::class, 'UpdateTaskStructure']);    
     Route::post('/DeleteTaskStructure', [TaskStructureController::class, 'DeleteTaskStructure']);    


     ######################################### Task ###########################################################
      Route::get('/GetAllTask', [TaskController::class, 'GetAllTask']);    
      Route::post('/CreateTask', [TaskController::class, 'CreateTask']);    
      Route::post('/DeleteTask', [TaskController::class, 'DeleteTask']);  
      Route::post('/UpdateTaskStatus', [TaskController::class, 'UpdateTaskStatus']);  
      Route::post('/UpdateTaskDescription', [TaskController::class, 'UpdateTaskDescription']);  
      Route::post('/GetTaskForSpecificStatus', [TaskController::class, 'GetTaskForSpecificStatus']);  
      Route::post('/GetTasksForSpecificProcess', [TaskController::class, 'GetTasksForSpecificProcess']);  
      Route::get('/GetDeleteTask', [TaskController::class, 'GetDeleteTask']);  
      Route::post('/GetDeveloperOldTasks', [TaskController::class, 'GetDeveloperOldTasks']);  
      Route::post('/UpdateTask', [TaskController::class, 'UpdateTask']);  
      Route::post('/GetDeveloperTasks', [TaskController::class, 'GetDeveloperTasks']);  
      Route::post('/GetSupportTasks', [TaskController::class, 'GetSupportTasks']);  
      Route::post('/GetDeveloperAllTask', [TaskController::class, 'GetDeveloperAllTask']);

      Route::post('/GetTaskProgress', [TaskController::class, 'GetTaskProgress']);
      Route::post('/GetDeveloperOverDueTasks', [TaskController::class, 'GetDeveloperOverDueTasks']);

      Route::post('/GetAllTasksWithProjectID', [TaskController::class, 'GetAllTasksWithProjectID']);

      
      ##################################### Task Comment ###########################################################
      Route::post('/CreateTaskComment', [TaskCommentController::class, 'CreateTaskComment']);    
      Route::post('/GetTaskComment', [TaskCommentController::class, 'GetTaskComment']);    
      Route::post('/UpdateTaskComment', [TaskCommentController::class, 'UpdateTaskComment']);    
      Route::post('/DeleteTaskComment', [TaskCommentController::class, 'DeleteTaskComment']);  

      ##################################### License Type ###########################################################
      Route::get('/GetAllLicenseType', [LicenseTypeController::class, 'GetAllLicenseType']);    
      Route::post('/CreateLicenseType', [LicenseTypeController::class, 'CreateLicenseType']);    
      Route::post('/UpdateLicenseType', [LicenseTypeController::class, 'UpdateLicenseType']);    
      Route::post('/DeleteLicenseType', [LicenseTypeController::class, 'DeleteLicenseType']);   
      
      

      ##################################### License Status ###########################################################
      Route::get('/GetAllLicenseStatus', [LicenseStatusController::class, 'GetAllLicenseStatus']);    
      Route::post('/CreateLicenseStatus', [LicenseStatusController::class, 'CreateLicenseStatus']);    
      Route::post('/UpdateLicenseStatus', [LicenseStatusController::class, 'UpdateLicenseStatus']);    
      Route::post('/DeleteLicenseStatus', [LicenseStatusController::class, 'DeleteLicenseStatus']);  

      ##################################### Process Attach ###########################################################
      Route::post('/GetProcessAttach', [ProcessAttachController::class, 'GetProcessAttach']);    
       Route::post('/CreateProcessAttach', [ProcessAttachController::class, 'CreateProcessAttach']);    
      Route::post('/DeleteProcessAttach', [ProcessAttachController::class, 'DeleteProcessAttach']);  


       ##################################### License  ###########################################################
      Route::get('/GetAllLicense', [LicenseController::class, 'GetAllLicense']);    
      Route::post('/CreateLicense', [LicenseController::class, 'CreateLicense']);    
      Route::post('/UpdateLicense', [LicenseController::class, 'UpdateLicense']);    
      Route::post('/DeleteLicense', [LicenseController::class, 'DeleteLicense']);   
      Route::post('/GetSpecificLicense', [LicenseController::class, 'GetSpecificLicense']);   
      Route::post('/RenewLicense', [LicenseController::class, 'RenewLicense']);   


       ##################################### Public Request Type ###########################################################
       Route::get('/GetPublicRequestType', [PublicRequestTypeController::class, 'GetPublicRequestType']);    
       Route::post('/CreatePublicRequestType', [PublicRequestTypeController::class, 'CreatePublicRequestType']);    
       Route::post('/UpdatePublicRequestType', [PublicRequestTypeController::class, 'UpdatePublicRequestType']);    
       Route::post('/DeletePublicRequestType', [PublicRequestTypeController::class, 'DeletePublicRequestType']);   

       ##################################### Public Request Status ###########################################################
       Route::get('/GetPublicRequestStatus', [PublicRequestStatusController::class, 'GetPublicRequestStatus']);    
       Route::post('/CreatePublicRequestStatus', [PublicRequestStatusController::class, 'CreatePublicRequestStatus']);    
       Route::post('/UpdatePublicRequestStatus', [PublicRequestStatusController::class, 'UpdatePublicRequestStatus']);    
       Route::post('/DeletePublicRequestStatus', [PublicRequestStatusController::class, 'DeletePublicRequestStatus']);   


       ##################################### Public Request  ###########################################################
       Route::post('/DeletePublicRequest', [PublicRequestController::class, 'DeletePublicRequest']);    
       Route::post('/CreatePublicRequest', [PublicRequestController::class, 'CreatePublicRequest']);    
       Route::post('/GetMyRequest', [PublicRequestController::class, 'GetMyRequest']);    
       Route::post('/GetManagerPendingRequest', [PublicRequestController::class, 'GetManagerPendingRequest']);   
       
       Route::post('/GetApprovedRequest', [PublicRequestController::class, 'GetApprovedRequest']);    
       Route::post('/GetRequestSheet', [PublicRequestController::class, 'GetRequestSheet']);    
       Route::post('/GetRequestApprovedSubDepartment', [PublicRequestController::class, 'GetRequestApprovedSubDepartment']);    
   
       Route::post('/ManagerApprovePublicRequest', [PublicRequestController::class, 'ManagerApprovePublicRequest']);    
       Route::post('/SubDonePublicRequest', [PublicRequestController::class, 'SubDonePublicRequest']);    
       Route::post('/RejectPublicRequest', [PublicRequestController::class, 'RejectPublicRequest']);    


       ##################################### Process Status ###########################################################
       Route::get('/GetAllLogs', [LogController::class, 'GetAllLogs']);    
       Route::post('/CreateLogs', [LogController::class, 'CreateLogs']);    
        


      ##################################### Public Request Status ###########################################################
       Route::get('/GetTransportationRequestStatus', [TransportationRequestStatusController::class, 'GetTransportationRequestStatus']);    
       Route::post('/CreateTransportationRequestStatus', [TransportationRequestStatusController::class, 'CreateTransportationRequestStatus']);    
       Route::post('/UpdateTransportationRequestStatus', [TransportationRequestStatusController::class, 'UpdateTransportationRequestStatus']);    
       Route::post('/DeleteTransportationRequestStatus', [TransportationRequestStatusController::class, 'DeleteTransportationRequestStatus']);   


       ##################################### Transportation Request  ###########################################################
       Route::get('/GetTransportationRequest', [TransportationRequestController::class, 'GetTransportationRequest']);    
       Route::post('/CreateTransportationRequest', [TransportationRequestController::class, 'CreateTransportationRequest']);    
       Route::post('/AssignTransportationRequest', [TransportationRequestController::class, 'AssignTransportationRequest']);    
       Route::post('/DeleteTransportationRequest', [TransportationRequestController::class, 'DeleteTransportationRequest']);   
       Route::post('/UpdateTransportationRequest', [TransportationRequestController::class, 'UpdateTransportationRequest']);   
       
       Route::post('/DoneTransportationRequest', [TransportationRequestController::class, 'DoneTransportationRequest']);    
       Route::post('/ManagerApproveTransportationRequest', [TransportationRequestController::class, 'ManagerApproveTransportationRequest']);    
       Route::post('/RejectTransportationRequest', [TransportationRequestController::class, 'RejectTransportationRequest']);    
   
       
       Route::get('/GetTransportationRequestManager', [TransportationRequestController::class, 'GetTransportationRequestManager']);    
       Route::post('/GetTransportationRequestUser', [TransportationRequestController::class, 'GetTransportationRequestUser']);    
       Route::post('/GetTransportationRequestPending', [TransportationRequestController::class, 'GetTransportationRequestPending']);    
       Route::post('/TransportationSheetReport', [TransportationRequestController::class, 'TransportationSheetReport']);    
       Route::post('/GetFinanceTransportation', [TransportationRequestController::class, 'GetFinanceTransportation']);    
           
       
          
       ##################################### FamilyInformation  ###########################################################
       Route::get('/GetAllFamilyInformation', [FamilyInformationController::class, 'GetAllFamilyInformation']);    
       Route::get('/GetFamilyInformationForUser', [FamilyInformationController::class, 'GetFamilyInformationForUser']);    
       Route::post('/CreateFamilyInformation', [FamilyInformationController::class, 'CreateFamilyInformation']);    
        Route::post('/UpdateFamilyInformation', [FamilyInformationController::class, 'UpdateFamilyInformation']);    
        Route::post('/DeleteFamilyInformation', [FamilyInformationController::class, 'DeleteFamilyInformation']);

       
       
       ##################################### UserSalary  ###########################################################
       Route::post('/GetAllUserSalary', [UserSalaryController::class, 'GetAllUserSalary']);    
       Route::post('/GetReportUserSalary', [UserSalaryController::class, 'GetReportUserSalary']);    
       Route::post('/GetSalaryForUser', [UserSalaryController::class, 'GetSalaryForUser']);    
       Route::post('/CreateUserSalary', [UserSalaryController::class, 'CreateUserSalary']);    
        Route::post('/UpdateUserSalary', [UserSalaryController::class, 'UpdateUserSalary']);    
        Route::post('/DeleteUserSalary', [UserSalaryController::class, 'DeleteUserSalary']);
        Route::post('/calculatemonthWorkDays', [UserSalaryController::class, 'calculatemonthWorkDays']);    
        Route::post('/CreateSalaryMonthlyReport', [UserSalaryController::class, 'CreateSalaryMonthlyReport']);    
        Route::post('/getSalaryMonthlyReport', [UserSalaryController::class, 'getSalaryMonthlyReport']);    
        Route::post('/FinancePaidSalaryReport', [UserSalaryController::class, 'FinancePaidSalaryReport']);    
        Route::post('/ManagerApproveSalaryReport', [UserSalaryController::class, 'ManagerApproveSalaryReport']);    
        Route::post('/HRApprovedSalaryReport', [UserSalaryController::class, 'HRApprovedSalaryReport']);    
        Route::post('/getSalaryMonthlyReportApproved', [UserSalaryController::class, 'getSalaryMonthlyReportApproved']);    

        
        
    ##################################### Report Status ###########################################################
      Route::get('/GetAllReportStatus', [ReportStatusController::class, 'GetAllReportStatus']);    
      Route::post('/CreateReportStatus', [ReportStatusController::class, 'CreateReportStatus']);    
      Route::post('/UpdateReportStatus', [ReportStatusController::class, 'UpdateReportStatus']);    
      Route::post('/DeleteReportStatus', [ReportStatusController::class, 'DeleteReportStatus']);

      ##################################### Report Type ###########################################################
      Route::get('/GetAllReportType', [ReportTypeController::class, 'GetAllReportType']);    
      Route::get('/GetTechReportType', [ReportTypeController::class, 'GetTechReportType']);    
      Route::post('/CreateReportType', [ReportTypeController::class, 'CreateReportType']);    
      Route::post('/UpdateReportType', [ReportTypeController::class, 'UpdateReportType']);    
      Route::post('/DeleteReportType', [ReportTypeController::class, 'DeleteReportType']);

       #####################################  Report ###########################################################
       Route::get('/GetAllReportType', [ReportController::class, 'GetAllReportType']);    
       Route::post('/CreateTechReport', [ReportController::class, 'CreateTechReport']);    
       Route::post('/UpdateTechReport', [ReportController::class, 'UpdateTechReport']);    
       Route::post('/DeleteTechReport', [ReportController::class, 'DeleteTechReport']);
       Route::post('/TechManagerAction', [ReportController::class, 'TechManagerAction']);
       Route::post('/GetReport', [ReportController::class, 'GetReport']);
       Route::post('/GetReportPending', [ReportController::class, 'GetReportPending']);
       Route::post('/GetMyReportPending', [ReportController::class, 'GetMyReportPending']);
       Route::post('/TechSeniorAction', [ReportController::class, 'TechSeniorAction']);
       Route::post('/GetMyReportRejectedDev', [ReportController::class, 'GetMyReportRejectedDev']);
       Route::post('/GetMyReportPendingDev', [ReportController::class, 'GetMyReportPendingDev']);
       Route::post('/GetManagerDevReport', [ReportController::class, 'GetManagerDevReport']);
       Route::post('/GetAllReportProject', [ReportController::class, 'GetAllReportProject']);

            Route::post('/ReCalculateProjectCost', [ReportController::class, 'ReCalculateProjectCost']);
            
            Route::post('/ApproveAllPendingReports', [ReportController::class, 'ApproveAllPendingReports']);
            Route::post('/ForceApproveAllPendingReports', [ReportController::class, 'ForceApproveAllPendingReports']);
            Route::post('/GetAllSupportReport', [ReportController::class, 'GetAllSupportReport']);
            Route::post('/GetSupportPendingReport', [ReportController::class, 'GetSupportPendingReport']);
            
            
            
       ##################################### Incentive Status ###########################################################
       Route::get('/GetIncentiveStatus', [IncentiveStatusController::class, 'GetIncentiveStatus']);    
        Route::post('/CreateIncentiveStatus', [IncentiveStatusController::class, 'CreateIncentiveStatus']);    
        Route::post('/UpdateIncentiveStatus', [IncentiveStatusController::class, 'UpdateIncentiveStatus']);    
        Route::post('/DeleteIncentiveStatus', [IncentiveStatusController::class, 'DeleteIncentiveStatus']);  

        ##################################### Incentive Request  ###########################################################
        Route::post('/DeleteIncentiveRequest', [IncentiveRequestController::class, 'DeleteIncentiveRequest']);    
        Route::post('/CreateIncentiveRequest', [IncentiveRequestController::class, 'CreateIncentiveRequest']);    
        Route::post('/GetMyIncentiveRequest', [IncentiveRequestController::class, 'GetMyIncentiveRequest']);    
        Route::post('/GetManagerPendingIncentive', [IncentiveRequestController::class, 'GetManagerPendingIncentive']);   
        
        Route::post('/GetApprovedIncentiveRequest', [IncentiveRequestController::class, 'GetApprovedIncentiveRequest']);    
        Route::post('/GetIncentiveRequestSheet', [IncentiveRequestController::class, 'GetIncentiveRequestSheet']);    
        Route::post('/GetIncentiveRequestApproved', [IncentiveRequestController::class, 'GetIncentiveRequestApproved']);    

        Route::post('/ManagerApproveIncentiveRequest', [IncentiveRequestController::class, 'ManagerApproveIncentiveRequest']);    
        Route::post('/SubDoneIncentiveRequest', [IncentiveRequestController::class, 'SubDoneIncentiveRequest']);    
        Route::post('/RejectIncentiveRequest', [IncentiveRequestController::class, 'RejectIncentiveRequest']);
        Route::post('/UpdateIncentiveRequest', [IncentiveRequestController::class, 'UpdateIncentiveRequest']);

         ##################################### Annual Type ###########################################################
         Route::get('/GetAllAnnualType', [AnnualTypeController::class, 'GetAllAnnualType']);    
         Route::post('/CreateAnnualType', [AnnualTypeController::class, 'CreateAnnualType']);    
         Route::post('/UpdateAnnualType', [AnnualTypeController::class, 'UpdateAnnualType']);    
         Route::post('/DeleteAnnualType', [AnnualTypeController::class, 'DeleteAnnualType']); 
         
          ##################################### Annual Status ###########################################################
          Route::get('/GetAllAnnualStatus', [AnnualStatusController::class, 'GetAllAnnualStatus']);    
          Route::post('/CreateAnnualStatus', [AnnualStatusController::class, 'CreateAnnualStatus']);    
          Route::post('/UpdateAnnualStatus', [AnnualStatusController::class, 'UpdateAnnualStatus']);    
          Route::post('/DeleteAnnualStatus', [AnnualStatusController::class, 'DeleteAnnualStatus']);  

           ##################################### Permission Balance###########################################################
           Route::get('/GetAllPermissionBalance', [PermissionBalanceController::class, 'GetAllPermissionBalance']);    
           Route::post('/CreatePermissionBalance', [PermissionBalanceController::class, 'CreatePermissionBalance']);    
           Route::post('/UpdatePermissionBalance', [PermissionBalanceController::class, 'UpdatePermissionBalance']);    
           Route::post('/DeletePermissionBalance', [PermissionBalanceController::class, 'DeletePermissionBalance']); 
           
           
          
          
         #####################################   Balance ###########################################################
          
           Route::post('/GetUserAnnual', [UserAnnualController::class, 'GetUserAnnual']);    
           Route::post('/GetAllUserAnnual', [UserAnnualController::class, 'GetAllUserAnnual']);    

           
           #####################################   Balance  Request ###########################################################
           Route::post('/CreateAnnualRequest', [AnnualRequestController::class, 'CreateAnnualRequest']);    
           Route::post('/GetMyAnnualRequest', [AnnualRequestController::class, 'GetMyAnnualRequest']);  
           Route::post('/GetUserRequests', [AnnualRequestController::class, 'GetUserRequests']);  
           Route::post('/GetManagerRequests', [AnnualRequestController::class, 'GetManagerRequests']);  
           Route::post('/GetHRRequests', [AnnualRequestController::class, 'GetHRRequests']);  
           Route::post('/DeleteAnnualRequest', [AnnualRequestController::class, 'DeleteAnnualRequest']);  
   Route::post('/ManagerActionRequests', [AnnualRequestController::class, 'ManagerActionRequests']);  
           Route::post('/HRActionRequests', [AnnualRequestController::class, 'HRActionRequests']);  
           Route::post('/GetApprovedRequests', [AnnualRequestController::class, 'GetApprovedRequests']);     


            #####################################   Manager Report ###########################################################
           Route::post('/DevelopersMonthlyReport', [ManagerReportController::class, 'DevelopersMonthlyReport']);    
           Route::post('/DevelopersVacationsReport', [ManagerReportController::class, 'DevelopersVacationsReport']);    

    Route::post('/DevelopersOverDueTasksReport', [ManagerReportController::class, 'DevelopersOverDueTasksReport']);    
           Route::post('/DevelopersRunningTasksReport', [ManagerReportController::class, 'DevelopersRunningTasksReport']);
           
                      Route::post('/DevelopersTasksReport', [ManagerReportController::class, 'DevelopersTasksReport']);    
            Route::post('/DevelopersProgressReport', [ManagerReportController::class, 'DevelopersProgressReport']);    

           ##################################### Cost Type ###########################################################
           Route::get('/GetAllCostType', [CostTypeController::class, 'GetAllCostType']);    
           Route::post('/CreateCostType', [CostTypeController::class, 'CreateCostType']);    
           Route::post('/UpdateCostType', [CostTypeController::class, 'UpdateCostType']);    
           Route::post('/DeleteCostType', [CostTypeController::class, 'DeleteCostType']); 
           
           ##################################### Project manaual Cost ###########################################################
            Route::post('/CreateProjectCostManual', [ProjectCostManualController::class, 'CreateProjectCostManual']);    
            Route::post('/DeleteProjectCostManual', [ProjectCostManualController::class, 'DeleteProjectCostManual']); 
            Route::post('/GetProjectCost', [ProjectCostController::class, 'GetProjectCost']); 
            Route::post('/ProjectTotalCost', [ProjectCostController::class, 'ProjectTotalCost']); 

            ##################################### Ticket Type ###########################################################
            Route::get('/GetAllTicketType', [TicketTypeController::class, 'GetAllTicketType']);    
            Route::post('/CreateTicketType', [TicketTypeController::class, 'CreateTicketType']);    
            Route::post('/UpdateTicketType', [TicketTypeController::class, 'UpdateTicketType']);    
            Route::post('/DeleteTicketType', [TicketTypeController::class, 'DeleteTicketType']); 

             ##################################### Contract Type ###########################################################
             Route::get('/GetAllContractType', [ContractTypeController::class, 'GetAllContractType']);    
             Route::post('/CreateContractType', [ContractTypeController::class, 'CreateContractType']);    
             Route::post('/UpdateContractType', [ContractTypeController::class, 'UpdateContractType']);    
             Route::post('/DeleteContractType', [ContractTypeController::class, 'DeleteContractType']);
             
              ##################################### Ticket Priority ###########################################################
              Route::get('/GetAllTicketPriority', [TicketPriorityController::class, 'GetAllTicketPriority']);    
              Route::post('/CreateTicketPriority', [TicketPriorityController::class, 'CreateTicketPriority']);    
              Route::post('/UpdateTicketPriority', [TicketPriorityController::class, 'UpdateTicketPriority']);    
              Route::post('/DeleteTicketPriority', [TicketPriorityController::class, 'DeleteTicketPriority']);
            ##################################### Ticket Tag ###########################################################
            Route::get('/GetAllTicketTag', [TicketTagController::class, 'GetAllTicketTag']);    
            // Route::get('/GetMyTicketTag', [TicketTagController::class, 'GetMyTicketTag']);
            // Route::post('/CreateTicketTag', [TicketTagController::class, 'CreateTicketTag']);    
            // Route::post('/UpdateTicketTag', [TicketTagController::class, 'UpdateTicketTag']);    
            // Route::post('/DeleteTicketTag', [TicketTagController::class, 'DeleteTicketTag']);

              ##################################### Contract Status  ###########################################################
              Route::get('/GetAllContractStatus', [ContractStatusController::class, 'GetAllContractStatus']);    
              Route::post('/CreateContractStatus', [ContractStatusController::class, 'CreateContractStatus']);    
              Route::post('/UpdateContractStatus', [ContractStatusController::class, 'UpdateContractStatus']);    
              Route::post('/DeleteContractStatus', [ContractStatusController::class, 'DeleteContractStatus']);

              ##################################### Contract Support  ###########################################################
              Route::post('/GetProductContractSupport', [ContractSupportController::class, 'GetProductContractSupport']);    
              Route::post('/GetProjectManagerContractSupport', [ContractSupportController::class, 'GetProjectManagerContractSupport']);    
              Route::post('/GetPartnerContractSupport', [ContractSupportController::class, 'GetPartnerContractSupport']);    
              Route::post('/GetAllContractSupport', [ContractSupportController::class, 'GetAllContractSupport']);
              Route::post('/CreateContractSupport', [ContractSupportController::class, 'CreateContractSupport']);
              Route::post('/UpdateContractSupport', [ContractSupportController::class, 'UpdateContractSupport']);
              Route::post('/DeleteContractSupport', [ContractSupportController::class, 'DeleteContractSupport']);
              Route::post('/GetSpecificContractSupport', [ContractSupportController::class, 'GetSpecificContractSupport']);
              Route::post('/GetMyContractSupport', [ContractSupportController::class, 'GetMyContractSupport']);
              Route::post('/RenewContract', [ContractSupportController::class, 'RenewContract']);
            
              ##################################### Client Account ###########################################################
              Route::post('/GetAllClientAccount', [ClientAccountController::class, 'GetAllClientAccount']);    
              Route::post('/CreateClientAccount', [ClientAccountController::class, 'CreateClientAccount']);    
              Route::post('/UpdateClientAccount', [ClientAccountController::class, 'UpdateClientAccount']);    
              Route::post('/DeleteClientAccount', [ClientAccountController::class, 'DeleteClientAccount']);
                  
                ##################################### Ticket Status ###########################################################
               Route::post('/GetAllTicketStatus', [TicketStatusController::class, 'GetAllTicketStatus']);    
               Route::post('/CreateTicketStatus', [TicketStatusController::class, 'CreateTicketStatus']);    
               Route::post('/UpdateTicketStatus', [TicketStatusController::class, 'UpdateTicketStatus']);    
               Route::post('/DeleteTicketStatus', [TicketStatusController::class, 'DeleteTicketStatus']);

                
               ##################################### Ticket  ###########################################################
               Route::post('/GetContractTicket', [TicketController::class, 'GetContractTicket']);    
               Route::post('/CreateTicket', [TicketController::class, 'CreateTicket']);    
                    Route::post('/GetSpecificTicket', [TicketController::class, 'GetSpecificTicket']);  
  Route::post('/AddTicketComment', [DeveloperTicketActionController::class, 'AddTicketComment']);  

                Route::post('/getMyTicketAll', [DeveloperTicketActionController::class, 'getMyTicketAll']);  
               Route::post('/getMyTicketDev', [DeveloperTicketActionController::class, 'getMyTicketDev']); 
              
                           Route::post('/ManagerUpdateTicket', [ManagerTicketUpdateController::class, 'ManagerUpdateTicket']);  
  Route::post('/DeleteTicket', [TicketController::class, 'DeleteTicket']);  
  Route::post('/GetTicketTimeline', [ClientTicketUpdateController::class, 'GetTicketTimeline']);  



 ##################################### Announce  ###########################################################
      Route::post('/DeleteAnnounce', [AnnounceController::class, 'DeleteAnnounce']);  
               Route::post('/CreateAnnounce', [AnnounceController::class, 'CreateAnnounce']);  
               Route::post('/GetAllAnnounce', [AnnounceController::class, 'GetAllAnnounce']);  
               Route::post('/GetMyAnnounce', [AnnounceController::class, 'GetMyAnnounce']);  
               Route::post('/UserSeenAnnounce', [AnnounceController::class, 'UserSeenAnnounce']);  
               Route::post('/UpdateAnnounce', [AnnounceController::class, 'UpdateAnnounce']);  
               Route::post('/CloseAnnounce', [AnnounceController::class, 'CloseAnnounce']);  
               Route::post('/SeenMyAnnounceUser', [AnnounceController::class, 'SeenMyAnnounceUser']);  
               Route::post('/ShowMyAnnounceUser', [AnnounceController::class, 'ShowMyAnnounceUser']);  

               
               Route::post('/SeenMyAnnounceClient', [AnnounceController::class, 'SeenMyAnnounceClient']);  
               Route::post('/ClientSeenAnnounce', [AnnounceController::class, 'ClientSeenAnnounce']);  
                Route::post('/ShowMyAnnounceClient', [AnnounceController::class, 'ShowMyAnnounceClient']);  



##################################### Announce  ###########################################################
             Route::post('/GetUserPermission', [UserPermissionGroupController::class, 'GetUserPermission']);  
             Route::post('/EditUserPermission', [UserPermissionGroupController::class, 'EditUserPermission']);  

##################################### Work Config ###########################################################
              Route::post('/GetAllWorkHoursConfig', [WorkHoursConfigController::class, 'GetAllWorkHoursConfig']);    
              Route::post('/CreateWorkHoursConfig', [WorkHoursConfigController::class, 'CreateWorkHoursConfig']);    
              Route::post('/UpdateWorkHoursConfig', [WorkHoursConfigController::class, 'UpdateWorkHoursConfig']);    
              Route::post('/DeleteWorkHoursConfig', [WorkHoursConfigController::class, 'DeleteWorkHoursConfig']);



 ####################################### HR Vacations ####################################################
              Route::post('/OfficalVacationHolidays', [AnnualRequestController::class, 'OfficalVacationHolidays']);




              
  ####################################### Business Development ####################################################
  Route::post('/OfficalVacationHolidays', [AnnualRequestController::class, 'OfficalVacationHolidays']);

  ####################################### Label Color ####################################################
  Route::post('/GetAllLabelColor', [LabelColorController::class, 'GetAllLabelColor']);    
  Route::post('/CreateLabelColor', [LabelColorController::class, 'CreateLabelColor']);    
  Route::post('/UpdateLabelColor', [LabelColorController::class, 'UpdateLabelColor']);    
  Route::post('/DeleteLabelColor', [LabelColorController::class, 'DeleteLabelColor']); 

  ####################################### Ads Platform ####################################################
  Route::post('/GetAllAdsPlatform', [AdsPlatformController::class, 'GetAllAdsPlatform']);    
  Route::post('/CreateAdsPlatform', [AdsPlatformController::class, 'CreateAdsPlatform']);    
  Route::post('/UpdateAdsPlatform', [AdsPlatformController::class, 'UpdateAdsPlatform']);    
  Route::post('/DeleteAdsPlatform', [AdsPlatformController::class, 'DeleteAdsPlatform']); 
 
  ####################################### Contact Lead Type ####################################################
  Route::post('/GetAllContactLeadType', [ContactLeadTypeController::class, 'GetAllContactLeadType']);    
  Route::post('/CreateContactLeadType', [ContactLeadTypeController::class, 'CreateContactLeadType']);    
  Route::post('/UpdateContactLeadType', [ContactLeadTypeController::class, 'UpdateContactLeadType']);    
  Route::post('/DeleteContactLeadType', [ContactLeadTypeController::class, 'DeleteContactLeadType']); 
 
    ####################################### Contact Lead Status ####################################################
    Route::post('/GetAllContactStatus', [ContactLeadStatusController::class, 'GetAllContactStatus']);    
    Route::post('/CreateContactStatus', [ContactLeadStatusController::class, 'CreateContactStatus']);    
    Route::post('/UpdateContactStatus', [ContactLeadStatusController::class, 'UpdateContactStatus']);    
    Route::post('/DeleteContactStatus', [ContactLeadStatusController::class, 'DeleteContactStatus']); 
    
    
    ####################################### Contact Lead Sub Status ####################################################
    Route::post('/GetAllContactSubStatus', [ContactLeadSubStatusController::class, 'GetAllContactSubStatus']);    
    Route::post('/CreateContactSubStatus', [ContactLeadSubStatusController::class, 'CreateContactSubStatus']);    
    Route::post('/UpdateContactSubStatus', [ContactLeadSubStatusController::class, 'UpdateContactSubStatus']);    
    Route::post('/DeleteContactSubStatus', [ContactLeadSubStatusController::class, 'DeleteContactSubStatus']); 
    Route::post('/GetContactSubStatusForContactStatus', [ContactLeadSubStatusController::class, 'GetContactSubStatusForContactStatus']); 

     ####################################### Contact Lead  ####################################################
     Route::post('/GetAllContactLead', [ContactLeadController::class, 'GetAllContactLead']);    
     Route::post('/CreateContactLead', [ContactLeadController::class, 'CreateContactLead']);    
     Route::post('/UpdateContactLead', [ContactLeadController::class, 'UpdateContactLead']);    
     Route::post('/DeleteContactLead', [ContactLeadController::class, 'DeleteContactLead']); 
     Route::post('/GetMyContactLead', [ContactLeadController::class, 'GetMyContactLead']);
     Route::post('/GetContactLeadByPartnerID', [ContactLeadController::class, 'GetContactLeadByPartnerID']);
     Route::post('/GetSpecificLead', [ContactLeadController::class, 'GetSpecificLead']);
        Route::post('/GetMyClosedContactLead', [ContactLeadController::class, 'GetMyClosedContactLead']);

     

     Route::post('/GetAllLead', [ContactLeadController::class, 'GetAllLead']);    
     Route::post('/GetMyLead', [ContactLeadController::class, 'GetMyLead']);
     Route::post('/GetSpecificLeadByStatus', [ContactLeadController::class, 'GetSpecificLeadByStatus']);

     
      ####################################### Acivity Type ####################################################
      Route::post('/GetAllActivityType', [ActivityTypeController::class, 'GetAllActivityType']);    
      Route::post('/CreateActivityType', [ActivityTypeController::class, 'CreateActivityType']);    
      Route::post('/UpdateActivityType', [ActivityTypeController::class, 'UpdateActivityType']);    
      Route::post('/DeleteActivityType', [ActivityTypeController::class, 'DeleteActivityType']);

      ####################################### Activity Status ####################################################
      Route::post('/GetAllActivityStatus', [ActivityStatusController::class, 'GetAllActivityStatus']);    
      Route::post('/CreateActivityStatus', [ActivityStatusController::class, 'CreateActivityStatus']);    
      Route::post('/UpdateActivityStatus', [ActivityStatusController::class, 'UpdateActivityStatus']);    
      Route::post('/DeleteActivityStatus', [ActivityStatusController::class, 'DeleteActivityStatus']);

      ####################################### Activity  ####################################################
      Route::post('/getActivityforLead', [ContactLeadActivityController::class, 'getActivityforLead']);    
      Route::post('/CreateActivity', [ContactLeadActivityController::class, 'CreateActivity']);    
      Route::post('/UpdateActivity', [ContactLeadActivityController::class, 'UpdateActivity']);    
      Route::post('/DeleteActivity', [ContactLeadActivityController::class, 'DeleteActivity']);
      Route::post('/GetAllPendingActivity', [ContactLeadActivityController::class, 'GetAllPendingActivity']);
      Route::post('/GetLeadActivities', [ContactLeadActivityController::class, 'GetLeadActivities']);
      Route::post('/FilterActivity', [ContactLeadActivityController::class, 'FilterActivity']);

      
      
      ####################################### Attach Lead  ####################################################
      Route::post('/GetContactLeadAttach', [ContactLeadAttachController::class, 'GetContactLeadAttach']);    
      Route::post('/CreateContactLeadAttach', [ContactLeadAttachController::class, 'CreateContactLeadAttach']);    
       Route::post('/DeleteContactLeadAttach', [ContactLeadAttachController::class, 'DeleteContactLeadAttach']);

       ####################################### Request POC Status  ####################################################
       Route::post('/GetAllRequestPOCStatus', [RequestPOCStatusController::class, 'GetAllRequestPOCStatus']);    
       Route::post('/CreateRequestPOCStatus', [RequestPOCStatusController::class, 'CreateRequestPOCStatus']);    
       Route::post('/UpdateRequestPOCStatus', [RequestPOCStatusController::class, 'UpdateRequestPOCStatus']);
       Route::post('/DeleteRequestPOCStatus', [RequestPOCStatusController::class, 'DeleteRequestPOCStatus']);
   
       ####################################### Request POC Priority  ####################################################
       Route::post('/GetAllRequestPOCPriority', [RequestPOCPriorityController::class, 'GetAllRequestPOCPriority']);    
       Route::post('/CreateRequestPOCPriority', [RequestPOCPriorityController::class, 'CreateRequestPOCPriority']);    
       Route::post('/UpdateRequestPOCPriority', [RequestPOCPriorityController::class, 'UpdateRequestPOCPriority']);
       Route::post('/DeleteRequestPOCPriority', [RequestPOCPriorityController::class, 'DeleteRequestPOCPriority']);
      
       ####################################### Request POC Create and Action  ####################################################
       Route::post('/TakeRequestPOCAction', [RequestPocController::class, 'TakeRequestPOCAction']);    
       Route::post('/CreateRequestPOC', [RequestPocController::class, 'CreateRequestPOC']);    
       Route::post('/GetAllPOCRequest', [RequestPocController::class, 'GetAllPOCRequest']);
       Route::post('/GetMyPOCRequest', [RequestPocController::class, 'GetMyPOCRequest']);
       Route::post('/GetMyPendingPocRequest', [RequestPocController::class, 'GetMyPendingPocRequest']);
       Route::post('/GetSpecificContactLeadRequest', [RequestPocController::class, 'GetSpecificContactLeadRequest']);
       Route::post('/ApproveRequestPOC', [RequestPocController::class, 'ApproveRequestPOC']);
       Route::post('/UpdatePOCRequest', [RequestPocController::class, 'UpdatePOCRequest']);    
       Route::post('/DeletePOCRequest', [RequestPocController::class, 'DeletePOCRequest']);    

       
       
     ####################################### Partner Industry ####################################################
     Route::post('/GetAllPartnerIndustry', [PartnerIndustryController::class, 'GetAllPartnerIndustry']);    
     Route::post('/CreatePartnerIndustry', [PartnerIndustryController::class, 'CreatePartnerIndustry']);    
     Route::post('/UpdatePartnerIndustry', [PartnerIndustryController::class, 'UpdatePartnerIndustry']);    
     Route::post('/DeletePartnerIndustry', [PartnerIndustryController::class, 'DeletePartnerIndustry']);



       ####################################### Contact ####################################################
       Route::post('/GetOrgContact', [ContactController::class, 'GetOrgContact']);    
       Route::post('/GetMyContact', [ContactController::class, 'GetMyContact']);    
       Route::post('/GetMyOrgContact', [ContactController::class, 'GetMyOrgContact']);    
       Route::post('/CreateContact', [ContactController::class, 'CreateContact']);    
       Route::post('/UpdateContact', [ContactController::class, 'UpdateContact']);    
       Route::post('/DeleteContact', [ContactController::class, 'DeleteContact']);
       Route::post('/GetAllContact', [ContactController::class, 'GetAllContact']);

      

     ####################################### Campagin ####################################################
     Route::post('/GetAllCampagin', [CampaginController::class, 'GetAllCampagin']);    
    
     
 ####################################### Partner Organize Type ####################################################
 Route::post('/GetAllOrganizeType', [OrganizationTypeController::class, 'GetAllOrganizeType']);    
 Route::post('/CreateOrganizeType', [OrganizationTypeController::class, 'CreateOrganizeType']);    
 Route::post('/UpdateOrganizeType', [OrganizationTypeController::class, 'UpdateOrganizeType']);    
 Route::post('/DeleteOrganizeType', [OrganizationTypeController::class, 'DeleteOrganizeType']);
 

     ####################################### Lead Cost Type ####################################################
     Route::post('/GetAllLeadCostType', [ContactLeadCostTypeController::class, 'GetAllLeadCostType']);    
     Route::post('/CreateLeadCostType', [ContactLeadCostTypeController::class, 'CreateLeadCostType']);    
     Route::post('/UpdateLeadCostType', [ContactLeadCostTypeController::class, 'UpdateLeadCostType']);    
     Route::post('/DeleteLeadCostType', [ContactLeadCostTypeController::class, 'DeleteLeadCostType']);

 ####################################### RFP Status ####################################################
 Route::post('/GetAllRequestRFPStatus', [RequestRFPStatusController::class, 'GetAllRequestRFPStatus']);    
 Route::post('/CreateRequestRFPStatus', [RequestRFPStatusController::class, 'CreateRequestRFPStatus']);    
 Route::post('/UpdateRequestRFPStatus', [RequestRFPStatusController::class, 'UpdateRequestRFPStatus']);    
 Route::post('/DeleteRequestRFPStatus', [RequestRFPStatusController::class, 'DeleteRequestRFPStatus']);

  ####################################### RFP Request ####################################################
  Route::post('/ApproveRFPRequest', [RequestRFPController::class, 'ApproveRFPRequest']);    
    Route::post('/GetSpecificContactLeadRequestRFP', [RequestRFPController::class, 'GetSpecificContactLeadRequestRFP']);    
    Route::post('/GetMyPendingRFPRequest', [RequestRFPController::class, 'GetMyPendingRFPRequest']);    
    Route::post('/GetAllRFPRequest', [RequestRFPController::class, 'GetAllRFPRequest']);
    Route::post('/DeleteRFPRequest', [RequestRFPController::class, 'DeleteRFPRequest']);
    Route::post('/UpdateRFPRequest', [RequestRFPController::class, 'UpdateRFPRequest']);
    Route::post('/CreateRFPRequest', [RequestRFPController::class, 'CreateRFPRequest']);
    Route::post('/GetMyPendingRFPRequestSales', [RequestRFPController::class, 'GetMyPendingRFPRequestSales']);
   
     ####################################### Dashboard Data Request ####################################################
  Route::post('/GetCRMDashboardData', [AdminDashboardController::class, 'GetCRMDashboardData']);
    Route::post('/GetTotalValueOfWonDealData', [AdminDashboardController::class, 'GetTotalValueOfWonDealData']);
  Route::post('/GetrevenueForCastData', [AdminDashboardController::class, 'GetrevenueForCastData']);
    Route::post('/GetrevenuePerProductData', [AdminDashboardController::class, 'GetrevenuePerProductData']);
    Route::post('/GetrevenuePerSalesData', [AdminDashboardController::class, 'GetrevenuePerSalesData']);
     Route::post('/GetNumberOfLeadsForSalesData', [AdminDashboardController::class, 'GetNumberOfLeadsForSalesData']);
     Route::post('/GetDealProgressData', [AdminDashboardController::class, 'GetDealProgressData']);
     Route::post('/FilterContactLead', [AdminDashboardController::class, 'FilterContactLead']);
  

     
     ####################################### Dashboard Details Request ####################################################

     Route::post('/GetAllDashboardDetails', [DashboardController::class, 'GetAllDashboardDetails']);




     ####################################### Question  Type####################################################
     Route::post('/GetAllQuestionType', [QuestionTypeController::class, 'GetAllQuestionType']);    
     Route::post('/CreateQuestionType', [QuestionTypeController::class, 'CreateQuestionType']);    
     Route::post('/UpdateQuestionType', [QuestionTypeController::class, 'UpdateQuestionType']);    
     Route::post('/DeleteQuestionType', [QuestionTypeController::class, 'DeleteQuestionType']);

      ####################################### Question Group Sub Type####################################################
      Route::post('/GetAllGroupSubType', [QuestionGroupSubTypeController::class, 'GetAllGroupSubType']);    
      Route::post('/CreateGroupSubType', [QuestionGroupSubTypeController::class, 'CreateGroupSubType']);    
      Route::post('/UpdateGroupSubType', [QuestionGroupSubTypeController::class, 'UpdateGroupSubType']);    
      Route::post('/DeleteGroupSubType', [QuestionGroupSubTypeController::class, 'DeleteGroupSubType']);
      Route::post('/GetGroupForSpecificType', [QuestionGroupSubTypeController::class, 'GetGroupForSpecificType']);
 

 
 ####################################### Question Group Type####################################################
 Route::post('/GetAllQuestionGroupType', [QuestionGroupTypeController::class, 'GetAllQuestionGroupType']);    
 Route::post('/CreateQuestionGroupType', [QuestionGroupTypeController::class, 'CreateQuestionGroupType']);    
 Route::post('/UpdateQuestionGroupType', [QuestionGroupTypeController::class, 'UpdateQuestionGroupType']);    
 Route::post('/DeleteQuestionGroupType', [QuestionGroupTypeController::class, 'DeleteQuestionGroupType']);

  ####################################### Question Group ####################################################
  Route::post('/GetAllQuestionGroup', [QuestionGroupController::class, 'GetAllQuestionGroup']);    
  Route::post('/CreateQuestionGroup', [QuestionGroupController::class, 'CreateQuestionGroup']);    
  Route::post('/UpdateQuestionGroup', [QuestionGroupController::class, 'UpdateQuestionGroup']);    
  Route::post('/DeleteQuestionGroup', [QuestionGroupController::class, 'DeleteQuestionGroup']);
  Route::post('/GetQuestionGroupByType', [QuestionGroupController::class, 'GetQuestionGroupByType']);
  Route::post('/GetQuestionGroupBySubType', [QuestionGroupController::class, 'GetQuestionGroupBySubType']);
  Route::post('/GetActiveGroupsInOnDemand', [QuestionGroupController::class, 'GetActiveGroupsInOnDemand']);

  
  ####################################### Question ####################################################
  Route::post('/GetSpecificQuestions', [QuestionController::class, 'GetSpecificQuestions']);    
  Route::post('/GetAllQuestions', [QuestionController::class, 'GetAllQuestions']);    
  Route::post('/CreateQuestion', [QuestionController::class, 'CreateQuestion']);    
  Route::post('/UpdateQuestion', [QuestionController::class, 'UpdateQuestion']);    
  Route::post('/DeleteQuestion', [QuestionController::class, 'DeleteQuestion']);

 ####################################### Ask For Rate ####################################################
 Route::post('/GetMyPendingAskForRate', [AskForRateController::class, 'GetMyPendingAskForRate']);    
 Route::post('/GetAllAskForRate', [AskForRateController::class, 'GetAllAskForRate']);    
 Route::post('/CreateAskforRate', [AskForRateController::class, 'CreateAskforRate']);    
 Route::post('/UpdateAskforRate', [AskForRateController::class, 'UpdateAskforRate']);    
 Route::post('/DeleteAskforRate', [AskForRateController::class, 'DeleteAskforRate']);
 Route::post('/GetAskForRateSpecificGroupID', [AskForRateController::class, 'GetAskForRateSpecificGroupID']);
 Route::post('/GetUserForRate', [AskForRateController::class, 'GetUserForRate']);

 
 
 ####################################### Rating ####################################################
 Route::post('/GetSpecificRating', [RatingController::class, 'GetSpecificRating']);    
 Route::post('/GetAllMyRating', [RatingController::class, 'GetAllMyRating']);    
 Route::post('/CreateRating', [RatingController::class, 'CreateRating']);    
 Route::post('/UpdateRating', [RatingController::class, 'UpdateRating']);    
 Route::post('/DeleteRating', [RatingController::class, 'DeleteRating']);

 Route::post('/GetMyEmployeeRating', [RatingController::class, 'GetMyEmployeeRating']);
 Route::post('/CreateTaskRate', [RatingController::class, 'CreateTaskRate']);
 Route::post('/CreateTicketRate', [RatingController::class, 'CreateTicketRate']);
 Route::post('/GetTicketPendingRate', [RatingController::class, 'GetTicketPendingRate']);
 

  
  ####################################### KeepNoteStatus ####################################################
  Route::post('/GetAllKeepNoteStatus', [KeepNoteStatusController::class, 'GetAllKeepNoteStatus']);    
    Route::post('/CreateKeepNoteStatus', [KeepNoteStatusController::class, 'CreateKeepNoteStatus']);    
    Route::post('/UpdateKeepNoteStatus', [KeepNoteStatusController::class, 'UpdateKeepNoteStatus']);    
    Route::post('/DeleteKeepNoteStatus', [KeepNoteStatusController::class, 'DeleteKeepNoteStatus']);    
  

      ####################################### KeepNote ####################################################
      Route::post('/GetAllKeepNote', [KeepNoteController::class, 'GetAllKeepNote']);    
      Route::post('/CreateKeepNote', [KeepNoteController::class, 'CreateKeepNote']);    
      Route::post('/UpdateKeepNote', [KeepNoteController::class, 'UpdateKeepNote']);    
      Route::post('/DeleteKeepNote', [KeepNoteController::class, 'DeleteKeepNote']);
      Route::post('/GetMyKeepNote', [KeepNoteController::class, 'GetMyKeepNote']);
      Route::post('/GetMyKeepNoteArchive', [KeepNoteController::class, 'GetMyKeepNoteArchive']);
      Route::post('/GetSpecificKeepNote', [KeepNoteController::class, 'GetSpecificKeepNote']);
      
       ####################################### ToDo ####################################################
       Route::post('/DeleteToDo', [ToDoListController::class, 'DeleteToDo']);    
       Route::post('/UpdateToDo', [ToDoListController::class, 'UpdateToDo']);    
       Route::post('/CreateToDo', [ToDoListController::class, 'CreateToDo']);
   
 
             ####################################### Salary Type ####################################################
             Route::post('/DeleteSalaryType', [SalaryTypeController::class, 'DeleteSalaryType']);    
             Route::post('/UpdateSalaryType', [SalaryTypeController::class, 'UpdateSalaryType']);    
             Route::post('/CreateSalaryType', [SalaryTypeController::class, 'CreateSalaryType']);
             Route::post('/GetAllSalaryType', [SalaryTypeController::class, 'GetAllSalaryType']);

              ####################################### Salary Gross ####################################################
              Route::post('/DeleteSalaryGross', [SalaryGrossController::class, 'DeleteSalaryGross']);    
              Route::post('/UpdateSalaryGross', [SalaryGrossController::class, 'UpdateSalaryGross']);    
              Route::post('/CreateSalaryGross', [SalaryGrossController::class, 'CreateSalaryGross']);
              Route::post('/GetMySalaryGross', [SalaryGrossController::class, 'GetMySalaryGross']);
              Route::post('/GetUserSalaryGross', [SalaryGrossController::class, 'GetUserSalaryGross']);
 
             

              ########################################## ADMIN Report ################################################
              Route::post('/ReturnAdminReportToPending', [AdminReportController::class, 'ReturnReportToPending']);
              Route::post('/GetAdminReportPending', [AdminReportController::class, 'GetAdminReportPending']);
              Route::post('/GetManagerAdminReport', [AdminReportController::class, 'GetManagerAdminReport']);
              Route::post('/GetAdminReport', [AdminReportController::class, 'GetAdminReport']);
              Route::post('/AdminManagerAction', [AdminReportController::class, 'AdminManagerAction']);
              Route::post('/DeleteAdminReport', [AdminReportController::class, 'DeleteAdminReport']);
              Route::post('/UpdateAdminReport', [AdminReportController::class, 'UpdateAdminReport']);
              Route::post('/CreateAdminReport', [AdminReportController::class, 'CreateAdminReport']);
                Route::post('/GetMyAdminReportPending', [AdminReportController::class, 'GetMyAdminReportPending']);
                
                ########################################## Admin Task  ################################################
                Route::post('/DeleteAdminTask', [AdminTaskController::class, 'DeleteAdminTask']);
                Route::post('/UpdateAdminTaskDescription', [AdminTaskController::class, 'UpdateAdminTaskDescription']);
                Route::post('/UpdateAdminTaskStatus', [AdminTaskController::class, 'UpdateAdminTaskStatus']);
                Route::post('/UpdateAdminTask', [AdminTaskController::class, 'UpdateAdminTask']);
                Route::post('/CreateAdminTask', [AdminTaskController::class, 'CreateAdminTask']);
                Route::post('/GetAllAdminTask', [AdminTaskController::class, 'GetAllAdminTask']);
                Route::post('/GetAdminDeleteTask', [AdminTaskController::class, 'GetAdminDeleteTask']);
                Route::post('/GetAdminTaskForSpecificStatus', [AdminTaskController::class, 'GetAdminTaskForSpecificStatus']);
                Route::post('/GetAdminAllTask', [AdminTaskController::class, 'GetAdminAllTask']);
                Route::post('/GetAdminOverDueTasks', [AdminTaskController::class, 'GetAdminOverDueTasks']);
                Route::post('/GetAdminOldTasks', [AdminTaskController::class, 'GetAdminOldTasks']);
                Route::post('/GetAdminTasks', [AdminTaskController::class, 'GetAdminTasks']);
                Route::post('/GetAdminTaskProgress', [AdminTaskController::class, 'GetAdminTaskProgress']);
                Route::post('/GetMyAdminRunningTasks', [AdminTaskController::class, 'GetMyAdminRunningTasks']);

                
           ##################################### Installment Status ###########################################################
            Route::post('/GetAllInstallmentStatus', [InstallmentStatusController::class, 'GetAllInstallmentStatus']);    
            Route::post('/CreateInstallmentStatus', [InstallmentStatusController::class, 'CreateInstallmentStatus']);    
            Route::post('/UpdateInstallmentStatus', [InstallmentStatusController::class, 'UpdateInstallmentStatus']);    
            Route::post('/DeleteInstallmentStatus', [InstallmentStatusController::class, 'DeleteInstallmentStatus']);  

             ##################################### Installment Type ###########################################################
             Route::post('/GetAllInstallmentType', [InstallmentTypeController::class, 'GetAllInstallmentType']);    
             Route::post('/CreateInstallmentType', [InstallmentTypeController::class, 'CreateInstallmentType']);    
             Route::post('/UpdateInstallmentType', [InstallmentTypeController::class, 'UpdateInstallmentType']);    
             Route::post('/DeleteInstallmentType', [InstallmentTypeController::class, 'DeleteInstallmentType']);  


             ##################################### Installment  ###########################################################
             Route::post('/DeleteInstallment', [InstallmentController::class, 'DeleteInstallment']);    
              Route::post('/UpdateInstallmentPeriod', [InstallmentController::class, 'UpdateInstallmentPeriod']);    
              Route::post('/UpdateInstallment', [InstallmentController::class, 'UpdateInstallment']);    
              Route::post('/CreateInstallment', [InstallmentController::class, 'CreateInstallment']);  
              Route::post('/GetAllInstallment', [InstallmentController::class, 'GetAllInstallment']);  
              Route::post('/GetAllPendingInstallment', [InstallmentController::class, 'GetAllPendingInstallment']);  
              Route::post('/GetAllInstallmentForSpecificStatus', [InstallmentController::class, 'GetAllInstallmentForSpecificStatus']);  
              Route::post('/GetAllInstallmentForSpecificType', [InstallmentController::class, 'GetAllInstallmentForSpecificType']);  
              Route::post('/GetAllNearestInstallment', [InstallmentController::class, 'GetAllNearestInstallment']);  
              Route::post('/DeleteInstallmentPeriod', [InstallmentController::class, 'DeleteInstallmentPeriod']);  
              Route::post('/UpdateInstallmentPeriod', [InstallmentController::class, 'UpdateInstallmentPeriod']);  
              Route::post('/CreateInstallmentPeriod', [InstallmentController::class, 'CreateInstallmentPeriod']);  
              Route::post('/GetSpecificInstallment', [InstallmentController::class, 'GetSpecificInstallment']);  
              Route::post('/GetInstallmentDashboard', [InstallmentController::class, 'GetInstallmentDashboard']);  
              Route::post('/GetInstallmentDashboardForSpecificType', [InstallmentController::class, 'GetInstallmentDashboardForSpecificType']);  
              Route::post('/GetAllPendingInstallmentForSpecificType', [InstallmentController::class, 'GetAllPendingInstallmentForSpecificType']);  



          ##################################### PM Team Reqeust ###########################################################
          ##################################### Status ###########################################################
            Route::post('/DeletePMTeamRequestStatus', [PMTeamRequestStatusController::class, 'DeletePMTeamRequestStatus']);    
            Route::post('/UpdatePMTeamRequestStatus', [PMTeamRequestStatusController::class, 'UpdatePMTeamRequestStatus']);    
            Route::post('/CreatePMTeamRequestStatus', [PMTeamRequestStatusController::class, 'CreatePMTeamRequestStatus']);    
            Route::post('/GetAllPMTeamRequestStatus', [PMTeamRequestStatusController::class, 'GetAllPMTeamRequestStatus']);
            
           ##################################### Request ###########################################################
           Route::post('/CreatePMTeamRequest', [PMTeamRequestController::class, 'CreatePMTeamRequest']);    
           Route::post('/DeletePMTeamRequest', [PMTeamRequestController::class, 'DeletePMTeamRequest']);    
           Route::post('/UpdatePMTeamRequest', [PMTeamRequestController::class, 'UpdatePMTeamRequest']);    
           Route::post('/GetAllOpenPMTeamRequest', [PMTeamRequestController::class, 'GetAllOpenPMTeamRequest']);    
           Route::post('/GetManagerPMTeamRequestProject', [PMTeamRequestController::class, 'GetManagerPMTeamRequestProject']);    
           Route::post('/GetMyPMTeamRequest', [PMTeamRequestController::class, 'GetMyPMTeamRequest']);    
           Route::post('/ChangePMTeamRequestStatus', [PMTeamRequestController::class, 'ChangePMTeamRequestStatus']);    
           Route::post('/GetAllPMTeamRequestFilter', [PMTeamRequestController::class, 'GetAllPMTeamRequestFilter']);    
           
          
        ##################################### HR Module ###########################################################
          ##################################### Job Title ###########################################################
          Route::post('/DeleteJobTitle', [JobTitleController::class, 'DeleteJobTitle'])->middleware('check.role:27');      
          Route::post('/UpdateJobTitle', [JobTitleController::class, 'UpdateJobTitle'])->middleware('check.role:26');      
          Route::post('/CreateJobTitle', [JobTitleController::class, 'CreateJobTitle'])->middleware('check.role:26');     
          Route::post('/GetAllJobTitle', [JobTitleController::class, 'GetAllJobTitle'])->middleware('check.role:28,27,26');   

           ##################################### Interview Phase ###########################################################
           Route::post('/GetAllInterviewPhase', [InterviewPhaseController::class, 'GetAllInterviewPhase']);    
           Route::post('/CreateInterviewPhase', [InterviewPhaseController::class, 'CreateInterviewPhase']);    
           Route::post('/UpdateInterviewPhase', [InterviewPhaseController::class, 'UpdateInterviewPhase']);    
           Route::post('/DeleteInterviewPhase', [InterviewPhaseController::class, 'DeleteInterviewPhase']);

           ##################################### Interview Status ###########################################################
           Route::post('/DeleteInterviewStatus', [InterviewStatusController::class, 'DeleteInterviewStatus']);    
           Route::post('/UpdateInterviewStatus', [InterviewStatusController::class, 'UpdateInterviewStatus']);    
           Route::post('/CreateInterviewStatus', [InterviewStatusController::class, 'CreateInterviewStatus']);    
           Route::post('/GetAllInterviewStatus', [InterviewStatusController::class, 'GetAllInterviewStatus']);

           ##################################### Attachment Type ###########################################################
           Route::post('/DeleteAttachmentType', [AttachmentTypeController::class, 'DeleteAttachmentType']);    
           Route::post('/UpdateAttachmentType', [AttachmentTypeController::class, 'UpdateAttachmentType']);    
           Route::post('/CreateAttachmentType', [AttachmentTypeController::class, 'CreateAttachmentType']);    
           Route::post('/GetAllAttachmentType', [AttachmentTypeController::class, 'GetAllAttachmentType']);

           ##################################### Attachment Status ###########################################################
           Route::post('/GetAllGlobalStatus', [GlobalStatusController::class, 'GetAllGlobalStatus']);    
           Route::post('/CreateGlobalStatus', [GlobalStatusController::class, 'CreateGlobalStatus']);    
           Route::post('/UpdateGlobalStatus', [GlobalStatusController::class, 'UpdateGlobalStatus']);    
           Route::post('/DeleteGlobalStatus', [GlobalStatusController::class, 'DeleteGlobalStatus']);
    

           ##################################### Recruitment Require   ###########################################################
           Route::post('/GetAllOnboardingRequirement', [OnboardingRequirementController::class, 'GetAllOnboardingRequirement']);    
           Route::post('/CreateOnboardingRequirement', [OnboardingRequirementController::class, 'CreateOnboardingRequirement']);    
           Route::post('/UpdateOnboardingRequirement', [OnboardingRequirementController::class, 'UpdateOnboardingRequirement']);    
           Route::post('/DeleteOnboardingRequirement', [OnboardingRequirementController::class, 'DeleteOnboardingRequirement']);
   
         
           ##################################### Recruitment Email Type   ###########################################################
           Route::post('/GetAllRecruitmentEmailType', [RecruitmentEmailTypeController::class, 'GetAllRecruitmentEmailType']);    
           Route::post('/CreateRecruitmentEmailType', [RecruitmentEmailTypeController::class, 'CreateRecruitmentEmailType']);    
           Route::post('/UpdateRecruitmentEmailType', [RecruitmentEmailTypeController::class, 'UpdateRecruitmentEmailType']);    
           Route::post('/DeleteRecruitmentEmailType', [RecruitmentEmailTypeController::class, 'DeleteRecruitmentEmailType']);
           
            ##################################### Company Policy   ###########################################################
            Route::post('/GetCompanyPolicy', [CompanyPolicyController::class, 'GetCompanyPolicy']);    
            Route::post('/CreateCompanyPolicy', [CompanyPolicyController::class, 'CreateCompanyPolicy']);    
            Route::post('/UpdateCompanyPolicy', [CompanyPolicyController::class, 'UpdateCompanyPolicy']);    
            Route::post('/DeleteCompanyPolicy', [CompanyPolicyController::class, 'DeleteCompanyPolicy']);


            ##################################### Recruitment Request Cv     ###########################################################
            Route::post('/UploadRecruitmentRequest', [RecruitmentRequestCvController::class, 'UploadRecruitmentRequest'])->middleware('check.role:32');      
            Route::post('/UpdateRecruitmentRequest', [RecruitmentRequestCvController::class, 'UpdateRecruitmentRequest'])->middleware('check.role:32');      
            Route::post('/GetAllRecruitmentRequest', [RecruitmentRequestCvController::class, 'GetAllRecruitmentRequest'])->middleware('check.role:34,33,35');    
            Route::post('/DeleteRecruitmentRequest', [RecruitmentRequestCvController::class, 'DeleteRecruitmentRequest'])->middleware('check.role:33');     
            Route::post('/GetMyUploadedRecruitmentRequest', [RecruitmentRequestCvController::class, 'GetMyUploadedRecruitmentRequest'])->middleware('check.role:36,32');    
            Route::post('/EmailandPhoneCheck', [RecruitmentRequestCvController::class, 'EmailandPhoneCheck']);   
            Route::post('/GetRecruitmentDetailsDuplicate', [RecruitmentRequestCvController::class, 'GetRecruitmentDetailsDuplicate']);    
            Route::post('/FilterCVRecruitment', [RecruitmentRequestCvController::class, 'FilterCVRecruitment'])->middleware('check.role:35');    

            

          ##################################### Interview Request Cv     ###########################################################
          Route::post('/CreateInterviewRequest', [RecruitmentRequestHistoryController::class, 'CreateInterviewRequest']);    
          Route::post('/UpdateInterviewRequest', [RecruitmentRequestHistoryController::class, 'UpdateInterviewRequest']);    
          Route::post('/GetDetailedRecruitmentRequest', [RecruitmentRequestHistoryController::class, 'GetDetailedRecruitmentRequest']);    
          Route::post('/GetInterviewHistorySpecificCV', [RecruitmentRequestHistoryController::class, 'GetInterviewHistorySpecificCV']);    
          Route::post('/DeleteInterviewRequest', [RecruitmentRequestHistoryController::class, 'DeleteInterviewRequest']);    
          

          ##################################### Onbaording Request    ###########################################################
          Route::post('/CreateRequestOnboarding', [RequestOnboardingController::class, 'CreateRequestOnboarding']);    
          Route::post('/GetAllRequestOnboarding', [RequestOnboardingController::class, 'GetAllRequestOnboarding']);  
          Route::post('/UpdateRequestOnboarding', [RequestOnboardingController::class, 'UpdateRequestOnboarding']);   
          Route::post('/GetStatusRequestOnboarding', [RequestOnboardingController::class, 'GetStatusRequestOnboarding']);    
          Route::post('/GetSpecificRequestOnboarding', [RequestOnboardingController::class, 'GetSpecificRequestOnboarding']);    
          Route::post('/DeleteRequestOnboarding', [RequestOnboardingController::class, 'DeleteRequestOnboarding']);    
          
          ##################################### Recruitment Email ###########################################################
          Route::post('/CreateRecruitmentEmail', [RecruitmentEmailController::class, 'CreateRecruitmentEmail']);    
          Route::post('/GetAllRecruitmentEmail', [RecruitmentEmailController::class, 'GetAllRecruitmentEmail']);    
          Route::post('/DeleteRecruitmentEmail', [RecruitmentEmailController::class, 'DeleteRecruitmentEmail']);    
          Route::post('/GetMyRecruitmentEmail', [RecruitmentEmailController::class, 'GetMyRecruitmentEmail']);    
          Route::post('/GetSpecificRecruitmentEmail', [RecruitmentEmailController::class, 'GetSpecificRecruitmentEmail']);    
           
          ##################################### Recruitment Email ###########################################################
           Route::post('/CreateRecruitmentAttachment', [RecruitmentAttachmentController::class, 'CreateRecruitmentAttachment']);    
          // Route::post('/GetAllRecruitmentEmail', [RecruitmentAttachmentController::class, 'GetAllRecruitmentEmail']);    
          // Route::post('/DeleteRecruitmentEmail', [RecruitmentAttachmentController::class, 'DeleteRecruitmentEmail']);    
          // Route::post('/GetMyRecruitmentEmail', [RecruitmentAttachmentController::class, 'GetMyRecruitmentEmail']);    
          // Route::post('/GetSpecificRecruitmentEmail', [RecruitmentAttachmentController::class, 'GetSpecificRecruitmentEmail']);    
           
          ##################################### Get Contract Support Cost ###############################################
          Route::post('/GetContractSupportCost', [ContractSupportCostController::class, 'GetContractSupportCost']);    


          ##################################### Job Skills  ###########################################################
          Route::post('/DeleteJobSkill', [JobSkillController::class, 'DeleteJobSkill'])->middleware('check.role:30');         
          Route::post('/UpdateJobSkill', [JobSkillController::class, 'UpdateJobSkill'])->middleware('check.role:29');         
          Route::post('/CreateJobSkill', [JobSkillController::class, 'CreateJobSkill'])->middleware('check.role:29');          
          Route::post('/GetAllJobSkill', [JobSkillController::class, 'GetAllJobSkill'])->middleware('check.role:31,29,30');      
          
          
});

     //php artisan migrate --path=/database/migrations/2024_02_29_014029_create_recruitment_attachments_table.php



    // Route::post('/getProject', [DatabaseConvertController::class, 'getProject']);  
    // Route::post('/getUser', [DatabaseConvertController::class, 'getUser']);  
    // Route::post('/getUserDeactivate', [DatabaseConvertController::class, 'getUserDeactivate']);  
    // Route::post('/annualrequest', [DatabaseConvertController::class, 'annualrequest']);  
    // Route::post('/pendingannualrequest', [DatabaseConvertController::class, 'pendingannualrequest']);  
    // Route::post('/getprocess', [DatabaseConvertController::class, 'getprocess']);  
    // Route::post('/gettask', [DatabaseConvertController::class, 'gettask']);  

    // Route::post('/getSalary', [DatabaseConvertSecondController::class, 'getSalary']);  
    
    
    
    //     Route::post('/getApprovedamountmonthly', [DatabaseConvertSecondController::class, 'getApprovedamountmonthly']);  
    //     Route::post('/getpendingamountmonthly', [DatabaseConvertSecondController::class, 'getpendingamountmonthly']);  
    // Route::post('/getReportDev', [DatabaseConvertSecondController::class, 'getReportDev']);  

    //     Route::post('/getLog', [DatabaseConvertSecondController::class, 'getLog']);  
    // Route::post('/getSingleUnit', [DatabaseConvertSecondController::class, 'getSingleUnit']);  
    //     Route::post('/getIncentive', [DatabaseConvertSecondController::class, 'getIncentive']);  

    //     Route::post('/getBudgetProject', [DatabaseConvertSecondController::class, 'getBudgetProject']);  

    //     Route::post('/getTransportation', [DatabaseConvertSecondController::class, 'getTransportation']);  
    // Route::post('/getPublicReqeust', [DatabaseConvertSecondController::class, 'getPublicReqeust']);  
    // Route::post('/getlicense', [DatabaseConvertSecondController::class, 'getlicense']);  

    //     Route::post('/getlicensehistory', [DatabaseConvertSecondController::class, 'getlicensehistory']);  

    
    //     Route::post('/getclientsupport', [DatabaseConvertSecondController::class, 'getclientsupport']);  

    //     Route::post('/getclientticket', [DatabaseConvertSecondController::class, 'getclientticket']);  
    // Route::post('/getclienttickettimeline', [DatabaseConvertSecondController::class, 'getclienttickettimeline']);  
    // Route::post('/getAnnounces', [DatabaseConvertSecondController::class, 'getAnnounces']);  

    
    
    
    
    


/*
|--------------------------------------------------------------------------
| Modular system — module catalogue & per-company entitlements
|--------------------------------------------------------------------------
| Management endpoints (enable/disable) are restricted to Management /
| Administration sub-departments inside ModuleController.
*/
Route::group(['middleware' => ['cors', 'jwt.verify'], 'prefix' => 'modules'], function () {
    Route::get('/', [\App\Http\Controllers\Settings\Module\ModuleController::class, 'index']);
});

Route::group(['middleware' => ['cors', 'jwt.verify'], 'prefix' => 'company/modules'], function () {
    Route::get('/', [\App\Http\Controllers\Settings\Module\ModuleController::class, 'companyModules']);
    Route::post('/enable', [\App\Http\Controllers\Settings\Module\ModuleController::class, 'enable']);
    Route::post('/disable', [\App\Http\Controllers\Settings\Module\ModuleController::class, 'disable']);
});

/*
| Example of explicit per-route module protection (also enforced globally
| through the controller map above):
|
| Route::group(['middleware' => ['jwt.verify', 'module:crm']], function () { ... });
*/
