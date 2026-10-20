export enum Activity {
    DAILY_TASK = '1',
    SUPPORT = '2',
    TRAINING = '3',
    CLIENT_MEETING = '4',
    IDEAL_HOURS = '5',
    OFFICIAL_VACATION = '6',
    UNPAID_VACATION = '7',
    TICKET_SUPPORT = '8'
}

export interface ReportType {
    report_type: string;
    key: string;
}


export enum ReportStatus {
    Pending_On_Manager = '1',
    Approved = '2',
    Rejected = '3',
    Pending_On_Senior = '4'
}




export interface DevDailyReport {
    key?: string;
    devID: string;
    devName: string;
    devImgURL?: string;

    reportDate: string;
    durationByHours: number;

    time_activity: Activity;
    time_activity_name?: string;

    taskID?: string | null;
    taskTitle?: string | null;
    projectID?: string | null;
    projectName?: string | null;
    processID?: string | null;
    processName?: string | null;
    details?: string;
    progress?: number;

    approved?: boolean;
    rejected?: boolean;

    approvedByKey?: string;
    approvedByName?: string;


    rejectionReason?: string;

    report_status_id?: string;
    report_status_name?: string;

    createdAt?: Date | string;
    updatedAt?: Date | string;

    preApprovedDuration: number;
    managerChangeDurationComment?: string;



    managerApprovalKey?: string;
    managerApprovalname?: string;


    seniorToApproveKey?: string | null;
    seniorToApproveName?: string | null;

    seniorDecision?: boolean;
    seniorDecisionKey?: string;
    seniorDecisionName?: string;
    seniorDecisionAt?: string;
    seniorDecisionComment?: string;
    ticket_id?: string;
    ticket_number?: string;

    outSourceTasksDate?: Date[];


}


export interface Reminder {
    key?: string;
    date: string;
}

// export interface monthlyReport {
//     devKey?:string;
//     devName:string;
//     actualWorkingHours : number ;
//     idealHours:number; 
//     officalVacations:number;
//     unpaidVacations:number;
//     total:number
// }

export interface monthlyReport {
    dev_Key: string;
    dev_name: string;
    actual_working_hours: number;
    idle_hours: number;
    official_vacations: number;
    unpaid_vacations: number;
    total: number;
}

export interface projectReport {
    devKey: string;
    devName: string;
    totalWorkingHours: number;
    progress: number;
    idelHours?: number;
}

export interface projectsReports {
    projectKey: string;
    projectName: string;
    projectReports: projectReport[];
    remainingTime: number;
    progress: number;
    totalIdelHours: number;
}

export interface ReportDetailsTasks {
    taskID: string;
    taskName: string;
    task_working_hours: number;
}
export interface ReportDetailsProcess {
    processID: string;
    processName: string;
    process_working_hours: number;
    tasks: ReportDetailsTasks[];
}
export interface ReportDetails {
    projectID: string;
    projectName: string;
    total_working_hours: number;
    processes: ReportDetailsProcess[];
}



export interface DevProgressReport {
    total_working_hours: number;
    idle_hours: number;
    offical_vacation: number;
    unpaid_vacation: number;
    total_rate: number;
    reports_arr: DevDailyReport[];
    tasks_data: ReportDetails[];
    photoURL?: string;
    username?: string;
    accRole_name?: string;
}