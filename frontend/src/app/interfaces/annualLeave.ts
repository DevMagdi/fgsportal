export enum annualLeaveApprovalCycle{
    Finished = 2 ,
    PendingOnHR = 1,
    PendingOnManager = 0,
}
export interface AnnualLeaveMonthlyAutoSet {
    key?:string;
    date:string;
}



export interface PermissionAndLeavesConfig {
    permission_balance_id:string;
    monthly_balance?:number;
    bereavement?:number;
    marriage?:number;
    birth?:number;
    birth_f?:number;
}


export enum leaveFinalStatus{
    Approved = '1' ,
    PendingOnManager = '2',
    PendingOnHR = '3',
    rejected = '4',

    // Approved = 2 ,
    // Pending = 1,
    // rejected = 0,
}


export enum LeaveType{
    AnnualLeave = '1',
    SICK = '2',
    UNPAID = '3',
    EXAMLEAVE='4',
    PERMISSION = '5',
    Bereavement_Leave='6',
    Marriage_Leave = '7',
    Birth_Leave = '8',
    Birth_Leave_F = '9',

    
    // AnnualLeave = 'AnnualLeave',
    // SICK = 'sickLeave',
    // UNPAID = 'unpaid',
    // EXAMLEAVE='examLeave',
    // PERMISSION = 'permission'
}

export interface LeavesReport{
    empKey:string;
    empName:string;
    hiringDate:string;
    totalBalance:number;
    currentBalance:number;
    annualLeave:number;
    SickLeave:number;
    examLeave:number;
    permission:number;
    unpaid:number;
    total:number;
}

export interface AnnualLeave {
    key?:string;
    empKey:string;
    empName:string;
    empImgUrl?:string;

    from:Date | string;
    to:Date | string;
    
    leaveType:LeaveType;
    leaveType_name?:string;

    attach?:string;
    attachName?:string;
    
    reason?:string;
    duration?:number;
    
    approvalCycle?:annualLeaveApprovalCycle;
    
    managerToApproveKey?:string;
    managerToApproveName?:string;
    
    managerDissision?:boolean;
    managerDissisionKey?:string;
    managerDissisionName?:string;
    managerDissisionComment?:string;
    managerDissisionAt?:Date | string;

    hrToApproveKey?:string;
    hrToApproveName?:string;

    hrDissision?:boolean;
    hrDissisionKey?:string;
    hrDissisionName?:string;
    hrDissisionComment?:string;
    hrDissisionAt?:Date | string;

    finalStatus?:leaveFinalStatus;
    finalStatus_name?:string;
    
    createdAt?:Date | string;

}



