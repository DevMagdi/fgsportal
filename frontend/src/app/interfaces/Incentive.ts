export enum incentiveApprovalCycle{
    Finished = 2 ,
    PendingOnFinance = 1,
    PendingOnManager = 0,
}

export enum incentiveFinalStatus{
    Pending = '1',
    Approved = '2' ,
    PAID = '3' ,
    rejected = '4',
    // PAID = 3 ,
    // Approved = 2 ,
    // Pending = 1,
    // rejected = 0,
}

export interface Incentive {
    key?:string;
    empKey:string;
    empName:string;
    incentiveAmount:number;
    projectKey:string;
    projectName:string;
    processKey:string;
    processName:string;
    date:string | Date;


    incentive_status_id?:string;
    incentive_status_name?:string;

    createdByKey:string;
    createdByName:string;
    comment?:string;

    createdAt?:string | Date;

    managerToApproveKey?:string;
    managerToApproveName?:string;
   
    managerDissision?:boolean;
    managerDissisionKey?:string;
    managerDissisionName?:string;
    managerDissisionComment?:string;
    managerDissisionAt?:Date | string;



    empAppliedKey?:string;
    empAppliedName?:string;
    empAppliedAt?:string;
    empAppliedComment?:string;


    financeToApproveKey?:string;
    financeToApproveName?:string;
    
    financeDissision?:boolean;
    financeDissisionKey?:string;
    financeDissisionName?:string;
    financeDissisionComment?:string;
    financeDissisionAt?:Date | string;
    

    finalStatus?:incentiveFinalStatus;
    approvalCycle?:incentiveApprovalCycle;

}
