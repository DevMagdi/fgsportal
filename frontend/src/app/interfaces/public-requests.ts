import { AccountRoles } from "./user";

export enum publicRequestsApprovalCycle{
    Finished = 1 ,
    PendingOnManager = 0
}

export enum publicRequestsFinalStatus{
    Pending = '1' ,
    Approved = '2' ,
    Done = '3',
    Rejected = '4'
    // Done = 3 ,
    // Approved = 2 ,
    // Pending = 1,
    // rejected = 0
}

export enum publicRequestsDepartment{
    ADMIN = 1,
    Finance = 0
}

// export enum publicRequestsTypes{
//     // Freelancing = 1,
//     OTHER = 0
// }

export interface PublicRequests {
    key?:string;
    empKey:string;
    empName:string;
    empImgUrl?:string;
    
    dept:AccountRoles;
    dept_name?:string;

    type:string; //publicRequestsTypes;
    details:string;

    amountByEGP:number;
    
    createdAt?:Date | string;

    projectKey?:string;
    projectName?:string;
    
    processKey?:string;
    processName?:string;

    managerToApproveKey?:string;
    managerToApproveName?:string;

    managerDissision?:boolean;
    managerDissisionKey?:string;
    managerDissisionName?:string;
    managerDissisionComment?:string;
    managerDissisionAt?:Date | string;

    empToApplyKey?:string;
    empToApplyName?:string;
    empAppliedAt?:string;
    empAppliedComment?:string;

    req_status_id?:string;
    req_status_name?:string;

    finalStatus:publicRequestsFinalStatus;
    approvalCycle?:publicRequestsApprovalCycle;
}

