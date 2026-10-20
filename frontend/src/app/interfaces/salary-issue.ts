export interface SalaryIssue {
    key?:string;
    empKey:string;
    empName:string;
    year:number;
    month:number;
    status:boolean;
    createdAt?:string;
    pendingOnPMkey?:string;
    pendingOnPMName?:string;
}
