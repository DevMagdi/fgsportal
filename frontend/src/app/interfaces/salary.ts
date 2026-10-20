export enum MonthSalaryApprovalCycle{
    Finished = 4 ,
    // PendingOnPM = 3 ,
    // PendingOnEmp = 2 ,
    PendingOnManager = 1,
    PendingOnHR = 0
}

export enum MonthSalaryFinalStatus{
    PAID = '5' ,
    Approved = '3' ,
    PendingOnManager = '1',
    PendingOnHR = '2',
    rejected = '4'
    // PAID = 3 ,
    // Approved = 2 ,
    // Pending = 1,
    // rejected = 0,
}

export interface EmpMonthlySalary {
    key?:string;
    empKey:string;
    empName:string;
    ActualWorkingHours:number;
    IdealHours:number;
    OfficalVacations:number;
    UnpaidVacations:number;
    Total:number;
    totalInHours:number;
    thisMonthWorkingHours:number;
    date:string | Date;
    
    salary_status_id?:string;
    salary_status_name?:string;

    createdAt:string | Date;
    createdByKey:string;
    createdByName:string;
    hrComment?:string;

    managerToApproveKey?:string;
    managerToApproveName?:string;

    managerDissision?:boolean;
    managerDissisionKey?:string;
    managerDissisionName?:string;
    managerDissisionComment?:string;
    managerDissisionAt?:Date | string;



    paidByKey?:string;
    paidByName?:string;
    paidByAt?:string;
    
    // empReply?:string;
    // empReplyAt?:Date | string;

    // pmToReplyKey?:string;
    // pmToReplyName?:string;

    // pmReply?:string;
    // pmReplyKey?:string;
    // pmReplyName?:string;
    // pmReplyAt?:Date | string;


    monthSalaryApprovalCycle:MonthSalaryApprovalCycle;
    MonthSalaryFinalStatus:MonthSalaryFinalStatus;

}

export interface Salary {
    key?:string;
    empKey:string;
    empName:string;
    salary:number;
    applyfrom:string | Date;
    endedAt?:string | Date;
    isActive?:boolean;
    createdAt?:Date | string;
    createdByKey:string;
    createdByName:string;
}


