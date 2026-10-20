export enum TypeOfCost{
    INCENTIVE = 1,
    TRANSPORTATION = 2,
    SALARY = 3,
    MOBILE = 4,
    IDLE_HOURS = 5,
    INTERNET= 6,
    OTHER = 7,
    Part_Time = 8,
    Public_Request = 9,
    // INCENTIVE = 0,
    // TRANSPORTATION = 1,
    // SALARY = 2,
    // MOBILE = 3,
    // IDLE_HOURS = 4,
    // INTERNET= 5,
    // OTHER = 6,
    // Public_Request = 7,
}


export interface CostType{
    id?:string;
    cost_type?:string;
}

export interface singleProjectCost {
    key?:string;

    projectKey?:string;
    projectTitle?:string;
    processKey?:string;
    processTitle?:string;
    
    empKey:string;
    empName:string;
    
    costType:TypeOfCost;
    costType_name?:string;
    activity_key?:string;
    isManual?:boolean;

    costComment?:string;
    

    costDate:string | Date;
    createdAt:string | Date;
    createdByKey:string;
    createdByName:string;

    costAmount:number;
    notes?:string;

}


export interface ProjectTotalCost {
    key?:string;

    projectKey:string;
    projectTitle:string;
    projectStartDate:string | Date;
    projectExpectedDuration:number;
    projectExpectedEndDate:string | Date;
    projectProgress:number;
    
    pmKey?:string;
    pmName?:string;
    pmImgUrl?:string;

    managerKey:string;
    managerName:string;
    managerImgUrl?:string;

    contractValue?:number;
    budgetryCost?:number;

    incentive:number;
    transportation:number;
    salaries:number;
    mobile:number;
    idleHours:number;
    interNet:number;
    other:number;
    
    actualCost:number;

    projectCostKeys:string[];
    
}




// export interface ProjectMonthlyCost {
//     key?:string;

//     projectKey:string;
//     projectTitle:string;
//     processKey:string;
//     processTitle:string;
    
    
//     singleProjectCostKey:string[];

// }
