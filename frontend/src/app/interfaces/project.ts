// import { Task } from "./task";
// import { User } from "./user";

import { MobileNumber } from "./user";

export enum Status{
    SCHEDULED = '3',
    RUNNING = '1',
    CLOSED = '5',
    HOLD='2',
    PENDING='4',
}

export interface ProjectTypes{
    id:string;
    project_type:string;
}


export interface ProjectStatus{
    id:string|number;
    project_status_name:string;
}

export enum ProjectStructure{
    Project_Manager = "1",
    Tech_Lead = "2",
    Analysis = "3",
    Developer = "4",
    SUPPORT = '5'
}

export interface ProjectTeam{
    user_team_id:string;
    project_structure_id:ProjectStructure;
}


export interface OtherTeam{
    key:string;
    username:string;
    trash:number;
    project_structure_id:string;
    project_structure_name:string;
    photoURL:string;
}

export interface ProjectFullTeam{
    id:string;
    user_team_id:string;
    user_team_name:string;
    user_creator_name:string;
    user_creator_id:string;
    project_structure_name:string;
    project_structure_id:string;
    team_id?:string;
}

export interface Dev{
    key:string;
    username:string;
    trash:number;
    photoURL:string;
}

export interface Project {
    key?:string;
    title:string;
    desc:string;
    duration:number;
    start_date:Date;
    end_date:Date | string;
    budget:number;
    
    managerID?:string;
    managerName?:string;

    PMID?:string;
    PMName?:string;
    BAID?:string;
    BAName?:string;
    BAsTeam?:Dev[];
    Tech_leadID?:string;
    Tech_leadName?:string;
    Devs_mempers?:Dev[];

    type:string; // poc or project
    type_name?:string;

    createdAt?:Date | string;
    updatedAt?:Date | string;
    status:Status;
    status_name?:string;

    creatorID?:string;
    progress?:number;
    idelHoues?:number;

    customerKey?:string;
    customerName?:string;
    customerPhone?:MobileNumber[];
    customerEmail?:string;
    customerAddress?:string;


    partner_id?:string;
    partner_name?:string;
    partner_photoURL?:string;
    

    project_team?:ProjectTeam[];
    OtherTeam?:OtherTeam[];

    tech_leadPhotoURL?:String;
    PMPhotoURL?:String;
    
    
}
export interface OldProjectI {
    project_key?:string;
    title:string;

    
    managerID?:string;
    managerName?:string;

    type:string; // poc or project
    type_name?:string;

    creatorID?:string;
    progress?:number;
    idelHoues?:number;


    partner_id?:string;
    partner_name?:string;
    partner_photoURL?:string;
    

    PMPhotoURL?:String;
    processes?:any[];
    teams?:ProjectFullTeam[];
    
}

export interface CloneProjectI {
    project_title:string;
    project_id:string;
    project_team:CloneProjectTeamI[]| null;
    processes_id?:ClonePRocessI[];
    isConfirmed:boolean
}
export interface CloneProjectTeamI{
   
    user_team_id?:string;
    project_structure_id?:string;
}
export interface ClonePRocessI{
   
    process_id:string;
    tasks_id:number[];
}