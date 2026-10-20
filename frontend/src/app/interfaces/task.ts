import { Dev, Status } from "./project";

export enum TaskType{
    TASK = 'task',
    BA = 'business_analysis',
    UAT = 'testing',
    Presales='Presales',
    Others='Others'
}


export interface TaskTypeFromDB{
    id:string;
    task_type:string;
}


export interface TaskStatus{
    id:string|number;
    task_status_name:string;
}


export interface TaskTeam{
    process_team_id:string;
    task_structure_id:string;
}

export interface ProcessStatus{
    id:string|number;
    process_status_name:string;
}

export interface PDD {
    key: string;
    name: string;
    url: string;
    file: File;
}

export interface ProcessTeam{
    project_team_id:string;
    trash?:number;
    username?:string;
    key?:string;
}

export interface ProcessFullTeam{
    id:string;
    project_team_id:string;
    user_team_id:string;
    user_team_name:string;
    user_creator_name:string;
    user_creator_id:string;
    project_structure_name:string;
    project_structure_id:string;
}

export interface SUB_TASk{
    key?:string;
    title:string;
    desc:string;
    start_date:Date | string;
    end_date:Date | string;
    ex_duration:number;
    project_key:string;
    project_title:string;
    Devs_mempers?:Dev[];
    BAsTeam?:Dev[];
    Tech_leadID?:string;
    Tech_leadName?:string;

    status:Status;
    status_name?:string;

    createdAt?:Date | string;

    progress?:number;
    OtherTeam?:ProcessTeam[];
    user_creator_id?:string;
    user_creator_name?:string;
}


export interface Task {
    key?:string;
    title:string;
    desc:string;
    
    empID:string;
    empName:string;
    
    supportID?:string;
    supportName?:string;
    
    start_date:Date | string;
    end_date:Date | string;
    ex_duration:number;
    real_duration?:number;

    project_key:string;
    project_title:string;
    
    status:string;
    status_name?:string;
    
    type:string;
    type_name?:string;

    pddURL?:string;
    pddName?:string;

    process_key?:string;
    process_title?:string;
    
    order?:number;
    progress?:number
    
    createdAT?:string;
    updatedAT?:string;
    closedAt?:string;
    holdAt?:string;
    customerPendingAt?:string;

    task_team?:TaskTeam[];
    user_creator_id?:string;
    user_creator_name?:string;
    force_add?:number; // 0 Or 1
    seniorToApproveID?:string;
    seniorToApproveName?:string;
    seniorIsMandatory?:boolean;

    rated_before?:string;

    task_type_id?:number;
    // completedAt:boolean;
}