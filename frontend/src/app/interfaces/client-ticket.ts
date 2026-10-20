import { Dev } from "./project";
import { MobileNumber } from "./user";

export enum ClientTicketPendingOn{
    PROJECT_MANAGER = '0',
    DEV_TEAM = '1',
    CLIENT = '2',
}

export enum ClientTicketStatus{
    STARTED = '1',
    CLOSED = '2'
    // INPROGRESS = '1',
    // HOLD = '2',
}

export enum ClientTicketPeriority{
    High  = '1',
    Normal  = '2',
    Critical = '3',
}

export enum SupportStatus{
    RUNNING = '1',
    CLOSED = '2',
}

export enum ticketTypes{
    General_Issue = '1',
    System_Issue = '2',
    Process_Issue = '3',
}


export interface TicketAttach{
    attach_link:string;
    attach_name:string;
    created_at:string;
}

export interface ClientTicket {
    key?:string;
    
    title:string;
    desc:string;
    imagesURls?:TicketAttach[];
    priority:ClientTicketPeriority;
    priority_name?:string;
    
    ticketType:ticketTypes;
    ticketType_name?:ticketTypes;
    
    clientKey:string;
    clientName:string;
    clientImgUrl?:string;
    
    projectKey?:string;
    projectName?:string;
   

    productKey?:string;
    productName?:string;

    createdByKey?:string;
    createdByName?:string;

    createdAt?:string;
    updatedAt?:string;

    status:ClientTicketStatus;
    status_name?:string;

    startDate?:Date | string;
    closureDate?:Date | string;

    assignedToPMKey?:string;
    assignedToPMName?:string;

    assignedToDevKey?:string;
    assignedToDevName?:string;

    escalated?:boolean;
    lastEscalat?:string;

    primaryContactName?:string;
    primaryContactPhoneNumber?:string;


    ticket_number?:string;
    
    rated_before?:string;

}


export interface ClientTicketTimeLine {
    key?:string;
    action:string;
    actionComment?:string;
    actionByKey:string;
    actionByName:string;
    ticketKey:string;
    ticketTitle:string;
    createdAt?:Date | string;
    showForClient:boolean;
}

export enum SupportPeriority{
    GOLD = '1', // 24/7
    SILVER = '2',// 8H / 5 D
}


export interface ContractTypes{
    id?:string;
    contract_type:string;
}


export interface ContractStatus{
    id?:string;
    contract_statuses_name:string;
}

export interface ProjectSupportHistory{
    contract_start_date:string;
    contract_end_date:string;
    contract_support_id:string;
    contract_status_name?:string;
}

export interface ProjectSupport{
    key?:string;

    startDate:string;
    endDate:string;
    periority:SupportPeriority;
    periority_name?:string;

    notes?:string;

    // partner_id:string;
    // partner_name?:string;

    product_id:string;
    product_name?:string;

    managerID?:string;
    managerName?:string;

    PMID?:string;
    PMName?:string;
    
    createdAt?:Date | string;
    updatedAt?:Date | string;

    status:SupportStatus;
    status_name?:string;

    createdByKey?:string;
    createdByName?:string;
    
    customerKey:string;
    customerName?:string;
    customerImgUrl?:string;
    customerAddress?:string;

    primary_contact_id?:string;
    primary_contact_fullname?:string;
    primary_contact_email?:string;
    primary_contact_phone?:MobileNumber[];
    history?:ProjectSupportHistory[];
}

export interface ContractSupportCost{
    key?:string;

    PMID?:string;  
    PMName?:string;
    contract_total_cost:number;
  
    customerKey:string;
    customerName?:string;
    customerImgUrl?:string;
    customerAddress?:string;
   

    startDate:string;
    endDate:string;

    periority:SupportPeriority;
    periority_name?:string;

    notes?:string;

    product_id:string;
    product_name?:string;

    managerID?:string;
    managerName?:string;
    
    status:SupportStatus;
    status_name?:string;
    
    
    primary_contact_id?:string;
    primary_contact_fullname?:string;
    primary_contact_email?:string;
    primary_contact_phone?:MobileNumber[];

    total_number_ticket:number;

    developers:DeveloperSupport[];
    project_managers:ProjectManagerSupport[];
    contract_cost:ContractCost[];

    createdAt?:Date | string;
    updatedAt?:Date | string;
    createdByKey?:string;
    createdByName?:string;
}
export interface ProjectManagerSupport{
    isDeleted:number;
    project_manager_id:number;
    project_manager_image:string;
    project_manager_username:string;
}
export interface ContractCost{
    activity_key:number;
costAmount:number;
costDate:Date | string;
createdAt:Date | string;
createdByKey:number
createdByName:string;
empKey:number;
empName:string;
isManual:boolean
key:number;
notes:string;
ticket_id:number;
ticket_title:string;
}

export interface DeveloperSupport{
    
developer_id:number;
developer_image:string;
developer_name:string;
isDeleted:number;
}

// export interface ProcessSupport{
//     key?:string;
//     processKey:string;
//     processTitle:string;

//     start_date:Date;
//     end_date:Date | string;

//     project_key:string;
//     project_title:string;

//     status:SupportStatus;

//     managerID?:string;
//     managerName?:string;

//     PMID?:string;
//     PMName?:string;

//     createdByKey?:string;
//     createdByName?:string;
    
//     customerKey?:string;
//     customerName?:string;
    
//     createdAt?:Date | string;
//     updatedAt?:Date | string;
// }