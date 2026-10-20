export interface AdminTasks {
    id?:string;
    task_title:string;
    task_description?:string;
    task_start_date:Date | string;
    task_end_date:Date | string;
    task_status_id:string;
    task_status_name?:string;
    task_team:AdminTaskTeam[];
    task_progress?:number;
}


export interface AdminTaskTeam{
    id?:string;
    user_id:string;
    username?:string;
}