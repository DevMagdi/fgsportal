export enum AccountType{
    Client="Client",
    Emp="Employee"
}

export enum Department{
    MANAGEMENT="1",
    TECHNICAL_TEAM="2",
    Business_Development="3", // Sales & Marketing
    ADMINSTRATION="4" // Admin & Finance & HR
}

export enum AccountRoles{
    MARKITING="1",
    SALES="2",
    Automation_Engineer="3",
    IT="4",
    CEO="5",
    CTO = "6",
    Branch_Manager="7",
    SUPER_USER="8",
    FINANCE="9",
    HUMAN_RESOURCE="10",
    ADMIN="11",
    SUPPORT="12",
}

export enum AccountPositions{
    UNDER_TRAINING = "1",
    Fresh="2",
    JUNIOR="3",
    SENIOR="4",
    MANAGER="5",
    Team_Leader="6",
    Intermediate_level="7",
    Solution_Architect="8",
    SENIOR_L2="9",
}

export enum Gender{
    MALE = 'male',
    FEMALE = 'female',
}   

export enum Relationship{
    wife= "wife",
    child ="child",
    husband = 'husband'
}

export enum MaritalStatus{
    Single = 'single',
    Married = 'married',
    Widowed = 'widowed',
    Divorced = 'divorced'
}

export interface Relative{
    key?:string;
    name:string;
    gender:Gender;
    relation:Relationship;
    birthDate:string;
    user_id?:string;
    user_name?:string;
}




export interface MobileNumber{
    phone:string;
    phone_type:string;
    country_code?:string;
    extend?:string;
}

export interface OpenToWork{
    id?:string;
    from_date_time:string | Date;
    to_date_time:string | Date;
    
    active?:boolean | string;
    user_id?:string;
    username?:string;
    email?:string;
    photoURL?:string;
    gender?:string;
}
    
export interface User {
    key?:string;
    token?:string;
    index?:number | null;
    username:string;
    email:string;
    password?:string;
    firstname:string;
    lastname:string;

    accType:AccountType; 

    department:Department; // == Depart 
    accRole:AccountRoles; // == Sub_Depart
    accPosition:AccountPositions; // == Position
    
    department_name?:string;
    accRole_name?:string;
    accPosition_name?:string;
    
    photoURL?:string;
    createdAt?:Date;
    updatedAt?:Date;
    
    CreatorID?:string;
    CreatorName?:string;

    canAddPreviousReports?:boolean;
    canAddPreviousReportsDate?:string | Date;

    gender?:Gender;
    salary?:number;
    myCurrentSalary?:number;

    birthDate?:Date | string;
    
    mobileNumber?:MobileNumber[];
    secondMobileNumber?:string;

    address?:string;
    maritalStatus?:MaritalStatus;
    
    hiringDate?:Date | string ;
    contractStartDate?:Date | string;
    contractEndDate?:Date | string;
    emergancyPhoneNumber?:string;
    emergancyPhoneNumberRelation?:string;
    emergancyPhoneNumberName?:string;
    socialSecureityNumber?:string;
    IDImgUrl?:string;
    relatives?:Relative[];
    
    pendingBalance?:number;
    monthlyBalance?:number;
    annualLeaveBalance?:number;
    currentLeaveBalance?:number;
    
    annualPermissionBalance?:number;
    currentPermissionBalance?:number;
    
    supervisorKey?:string;
    supervisorName?:string;
    refreshRequired?:boolean;
    
    open_to_work?:boolean | string;
    notify?:boolean|string;

    my_total_rate?:number;

}



/* ========================================================= Client Section =============================== */

export interface Partner{
    partner_name:string;
    partner_address?:string;
    partner_description?:string;
    email?:string;
    phone?:string;
    contact?:number;
    lead?:number;
    person_contact?:number;
    won?:number;
    lost?:number;
    archive?:number;
    partner_photoURL?:string;
    user_creator_id?: string;
    user_creator_name?: string;
    partner_industry_id?:string;
    partner_industry_name?:string;
    id?: string;
    is_org?:boolean|string;
    
    sales_id?:string;
    sales_name?:string;
    
    country?:string;
    organize_type_id?:string;
    organize_type_name?:string;
    website?:string;
}

export interface OrganizationTypes{
    id: string;
    organize_type:string;
}

export interface PartnerIndustry{
    id: string;
    partner_industry_name:string;
}


export interface Client{
    key?:string;
    email:string;
    password?:string;
    fullname:string;
    partner_id?: string;
    partner_name?: string;
    partnerPhotoUrl?: string;
    phone?:MobileNumber[];
    token?: string;
    refreshRequired?: boolean;
    active?: boolean;
    primary: boolean;
    accType?:AccountType;
    hamada?:boolean; // send while creating account => true if created from our company and false if client created it
}



export interface UserNavParams{
    user_id:string;
    user_Name:string;
    refresh_required:boolean;
    pendingReport?:number;
    devPendingReports?:number;
    rejectedReport?:number;
    pendingVacationsRequest?:number;
    pendingTransportationRequest?:number;
    pendingIncentiveRequest?:number;
    pendingPublicRequest?:number;
    myPendingPOCRequest?:number;
    myPendingRFPRequest?:number;
    open_to_work_counter?:number;
    pending_rating_counter?:number;
    project_manager_reports?:number;
}

export interface ClientNavParams{
    user_id:string;
    user_Name:string;
    refresh_required:boolean;
}