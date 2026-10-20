export interface DashboardStatisticsI{
    admin_tasks:number;
    latest_request?:LatestRequestI[];
    open_tickets:number;
    pending_reports:number;
    public_request:number;

}
export interface LatestRequestI{
    AssignedTo:string;
    Department?:string;
    Employee:string;
    Project:string;
    RequestDetails:string;
    RequestType:string;
    Status:string;

}