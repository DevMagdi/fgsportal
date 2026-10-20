export enum transportaionApprovalCycle{
    Finished = 3 ,
    PendingOnManager = 2,
    PendingOnFinance = 1,
    PendingOnPM = 0,
}

export enum transportaionFinalStatus{
    Pending = '1' ,
    Approved = '2' ,
    Done = '3',
    Rejected = '4'
    // Approved = 2 ,
    // Pending = 1,
    // rejected = 0,
}


export interface TransportationHistory{
    user_id:string;
    user_name:string;
    status_name:string;
    comment:string;
    action_date:string;
}

export interface Transportations {
    key?:string;
    empKey:string;
    empName:string;
    empImgUrl?:string;
    fromLocation:string;
    toLocation:string;
    purpose:string;
    date:Date | string;
    amountByEGP:number;
    comment?:string;
    attachedFileUrl?:string;
    
    createdAt?:Date | string;

    projectKey?:string;
    projectName?:string;
    
    processKey?:string;
    processName?:string;


    trans_status_id?:string;
    trans_status_name?:string;

    manager_approve_id?:string;
    manager_approve_name?:string;


    finalStatus?:transportaionFinalStatus;
    history?:TransportationHistory[];

    pmToApproveKey:string;
    pmToApproveName:string;
    
    pmDissision?:boolean;
    pmDissisionKey?:string;
    pmDissisionName?:string;
    pmDissisionComment?:string;
    pmDissisionAt?:Date | string;

    financeToApproveKey?:string;
    financeToApproveName?:string;

    financeDissision?:boolean;
    financeDissisionKey?:string;
    financeDissisionName?:string;
    financeDissisionComment?:string;
    financeDissisionAt?:Date | string;

    managerToApproveKey?:string;
    managerToApproveName?:string;

    managerDissision?:boolean;
    managerDissisionKey?:string;
    managerDissisionName?:string;
    managerDissisionComment?:string;
    managerDissisionAt?:Date | string;


    approvalCycle?:transportaionApprovalCycle;

}

