export interface Ramadan {
    key?:string;
    date:string;
}
export interface WorkingHoursConfiguration{
    id?:string;
    title:string;
    start_date:string;
    end_date:string;
    config_duration:number;
    user_creator_name?:string;
    user_creator_id?:string;
}


export interface OfficialVacation{
    report_details:string;
    start_date:string;
    end_date:string;
    manager_approve_id:string;
}