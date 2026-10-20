export interface AdminReports {
    id?:string;
    report_type_id?:string;
    report_type_name?:string;

    manager_approve_id:string;
    manager_approve_name?:string;
    report_details:string;
    report_date:Date|String;

    report_status_id?:string;
    report_status_name?:string;

    duration:number;
    report_progress?:number;
    task_id?:string;
    task_name?:string;


    devID?:string;
    devName?:string;
    devImgURL?:string;
    createdAt?:Date | string;
    updatedAt?:Date | string;
    
    reject_reason?:string;
    approved?:boolean;
    rejected?:boolean;


    approvedByKey?:string;
    approvedByName?:string;

}
