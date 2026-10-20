import { MobileNumber } from "./user";

export enum CloseLeadSubStatus {
    WON = '9',
    LOST = '10',
    Archive = '11',
    Not_Interested = '12',
    Disqualified = '14',
}

export enum InterestedLeadSubStatus {
    Qualified = '5',
    Request_For_POC = '6',
    RFP = '7',
    Proposal = '8',
    Negotiation_Started = '13',
}
export enum EngagementLeadSubStatus {
    Engagement = '4',
}

export interface Currency {
    currencyName: string;
    currencyCode: string;
    countryCode: string;
    countryName: string;
    symbol: string;
    exchangeRate?: number;
}



export interface Labels {
    id: string;
    label_name: string;
    label_color: string;
}


export interface LeadsAndContactsStatus {
    id: string;
    contact_status_name: string;
}

export interface LeadsAndContactsSubStatus {
    id: string;
    contact_sub_status_name: string;
    contact_status_name?: string;
}

export interface LeadsAndContactsTypes {
    id: string;
    lead_type_name: string;
}


export interface Contacts {
    id?: string;
    partner_id: string;
    partner_name?: string;
    name: string;
    notes?: string;
    email?: string;
    address?: string;
    phone?: MobileNumber[];

    title?: string;


    user_creator_id?: string;
    user_creator_name?: string;
}

export interface LeadsAndContacts {
    id?: string;

    campagin_id?: string;
    campagin_name?: string;

    sales_id?: string;
    sales_name?: string;

    user_creator_id?: string;
    user_creator_name?: string;

    status_id?: string;
    status_name?: string

    lead_sub_status_id?: string;
    lead_sub_status_name?: string


    prev_lead_sub_status_id?: string;

    lead_type_id: string;
    lead_type_name?: string;

    product_id?: string;
    product_name?: string;


    label?: Labels[];

    title: string;
    address?: string;
    email?: string;
    phone?: MobileNumber[];
    contact_id?: string;
    contact_name?: string;

    cost?: number;
    cost_details?: CostDetails[];

    currency?: string;

    notes?: string;

    transfer?: boolean;
    seen?: boolean;
    isLead?: boolean | string;

    partner_id?: string;
    partner_name?: string;

    created_at?: string;

    next_action?: string;
    next_action_id?: string;
    next_action_type_id?: string;
    next_action_date?: string | Date;

    expected_close_date?: string;
    actual_closing_date?: string;
}


export enum ActivityStatus {
    Done = '1',
    Pending = '2',
    Answered = '3',
    NotAnswered = '4',
    Completed = '5',
    Rescheduled = '6',
    Cancelled = '7',
    Scheduled = '8'
}

export enum ActivityTypes {
    Call = '1',
    Meeting = '2',
    Task = '3',
    Deadline = '4',
    SendEmail = '5',
    Lunch = '6',
    Notes = '8',
    Other = '7',
}

export interface CostDetails {
    cost: number;
    cost_type: string;
    cost_type_name?: string;
}

export interface LeadCostTypes {
    id: string;
    lead_cost_type: string;
}

export interface LeadsAndContactsActivity {
    id?: string;

    contact_lead_id: string;
    contact_lead_name?: string;

    lead_sub_status_id?: string;
    lead_sub_status_name?: string;

    activity_type_id: ActivityTypes;
    activity_type_name?: string;

    activity_status_id: ActivityStatus;
    activity_status_name?: string;

    comment: string;
    from_date: string;
    to_date: string | Date;

    created_at?: string;

    createdBy_id?: string;
    createdBy_name?: string;


    partner_id?: string;
    partner_name?: string;
    person_contact_id?: string;
    person_contact_name?: string;
    email?: string;
    phone?: MobileNumber[];
    product?: string;


    activity_start_date?: string | Date;
    activity_end_date?: string | Date;
    duration?: string;
    description?: string;
}

export interface RequestForPocStatus {
    id?: string;
    reqeust_poc_status_name: string;
}

export interface RequestForPocPriority {
    id?: string;
    reqeust_poc_priority_name: string;
}


export enum PocRequestStatus {
    Approved = '1',
    Pending_On_CEO = '2',
    Pending_On_CTO = '3',
    Re_Edit = '4',
    Rejected = '5'
}


export interface RequestAttach {
    request_poc_attach_link: string;
    request_poc_attach_name: string;

    user_creator_id: string;
    user_creator_name: string;

    created_at: string;
}

export interface PocRequestHistory {
    request_poc_id: string;

    request_poc_status_id: string;
    request_poc_status_name?: string;

    request_poc_priority_id: string;
    request_poc_priority_name?: string;

    comment?: string;

    poc_action_attach: RequestAttach[];

    user_creator_id?: string;
    user_creator_name?: string;
    user_creator_photo_url?: string;

    created_at?: string;

}


export interface ProcessDetails {
    process_title: string;
    process_description: string;
    process_department: string;
}


export interface PocRequests {
    id?: string;
    contact_lead_id: string;
    contact_lead_name?: string;

    request_poc_title: string;
    description?: string;

    product_id?: string;
    product_name?: string;

    project_id?: string;
    project_name?: string;

    request_poc_status_id?: string;
    request_poc_status_name?: string;

    request_poc_priority_id?: string;
    request_poc_priority_name?: string;

    request_poc_attach: RequestAttach[];

    user_creator_id?: string;
    user_creator_name?: string;
    user_creator_photo_url?: string;

    created_at?: string;

    manager_approve_id?: string;
    manager_approve_name?: string;
    history?: PocRequestHistory[];

    request_poc_process?: ProcessDetails[];

}


export interface POCRequestAction {
    request_poc_id: string;
    request_poc_status_id: string;
    request_poc_priority_id: string;
    comment?: string;
    poc_action_attach?: RequestAttach[];
}


export interface RFPRequests {
    id?: string;
    contact_lead_id: string;
    contact_lead_name?: string;

    request_rfp_title: string;
    comment?: string;

    request_rfp_status_id?: string;
    request_rfp_status_name?: string;

    approval_ids?: string[];
    approval_names?: string[];

    // request_rfp_attach?:string;
    request_rfp_attach: RequestRFPAttach[];


    user_creator_id?: string;
    user_creator_name?: string;
    user_creator_photo_url?: string;

    created_at?: string;
    history?: RFPRequestHistory[];

    pending?: string[];
    pending_name?: string[];

    product_id?: string;
    product_name?: string;

    request_rfp_priority_id?: string;
    request_rfp_priority_name?: string;
}


export interface RFPRequestHistory {
    request_rfp_id: string;

    request_rfp_status_id: string;
    request_rfp_status_name?: string;

    comment?: string;

    user_creator_id?: string;
    user_creator_name?: string;
    user_creator_photo_url?: string;

    manager_approve_id?: string;
    manager_approve_name?: string;
    manager_approve_photo_url?: string;

    created_at?: string;

}

export interface RequestRFPAttach {
    request_rfp_attach_link: string;
    request_rfp_attach: string;

    user_creator_id: string;
    user_creator_name: string;

    created_at: string;
}


export enum RFPRequestStatus {
    Approved = '1',
    Pending = '2',
    Rejected = '3'
}


export interface CRMFilterBody {
    lead_sub_status_id?: number;
    user_creator_id?: number;
    product_id?: number;
    country?: string;
    start_date?: string;
    end_date?: string;
}
export interface CrmReportBody {
    id: string;
    campagin_id: number;
    campagin_name: string;
    sales_id: number;
    sales_name: string;
    user_creator_id: number;
    user_creator_name: string;
    status_id: number;
    status_name: string;
    lead_sub_status_id: number;
    lead_sub_status_name: string;
    lead_type_id: number;
    lead_type_name: string;
    product_id: number;
    product_name: string;
    label: Label[];
    prev_lead_sub_status_id: number;
    partner_id: number;
    partner_name: string;
    country: string | null;
    expected_close_date: string;
    actual_closing_date: string | null;
    currency: string;
    title: string;
    contact_id: number;
    notes: string;
    contact_name: string;
    email: string;
    phone: Phone[];
    address: string | null;
    cost_details: string | null;
    cost: string;
    seen: boolean;
    isLead: boolean;
    transfer: boolean;
    created_at: string;
    next_action: string;
    next_action_date: string;
    next_action_type_id: number;
    next_action_id: string;
    updated_at: string;
}

interface Phone {
    phone: string;
    phone_type: string;
    country_code: string;
}

interface Label {
    label_name: string;
    label_color: string;
    id: string;
}


export interface ActivitiesFilterBody {
    sales_id?: number;
    contact_lead_id?: number;
    lead_sub_status_id?: number;
    activity_type_id?: number;
    activity_status_id?: number;
    from_date?: string;
    to_date?: string;
    activity_start_date?: string;
    activity_end_date?: string;
}
export interface ActivityFilterBody {
    id: string;
    createdBy_id: number;
    createdBy_name: string;
    contact_lead_id: number;
    contact_lead_name: string;
    lead_sub_status_id: number;
    lead_sub_status_name: string;
    activity_type_id: number;
    activity_type_name: string;
    activity_status_name: string;
    activity_status_id: number;
    comment: string;
    person_contact_id: number;
    person_contact_name: string;
    partner_id: number;
    partner_name: string;
    phone: string;
    email: string;
    product_id: number;
    product_name: string;
    from_date: string;
    to_date: string;
    activity_start_date: string;
    activity_end_date: string;
    duration: string;
    description: string;
    created_at: string;
}