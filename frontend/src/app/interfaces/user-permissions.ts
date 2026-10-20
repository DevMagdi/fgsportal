// export enum RoutePermissions{
//     reportsPage = 0,
//     pendingReports=1,
//     projectsPage=2,
//     community=3,
// }

// export interface RoutesPermissions {
//    routeName:boolean;
// }


export enum PermissionStatus {
    Active = 1,
    Deactive = 0
}


export interface Permission {
    id: number | string;
    permission_name: string;
    description: string;
    permission_group_id:number;
    permission_group_name:string;
}



export interface UserPermissions {
    userKey: string;
    username: string;
    permission_id: number | string;
    permission_name?: string;
    status: PermissionStatus;
    department_name?: string;
    email?: string;
    permission_group_id:number;
    permission_group_name:string;
    //routes
    // reportsPage?:boolean;
    // pendingReports?:boolean;
    // managerProjectsPage?:boolean;
    // salariesPage?:boolean;
    // FollowTickets?:boolean;
}

export interface FormattedPermissions {
   
    group_id:number;
    group_name:string;
    permissions:UserPermissions[];
    //routes
    // reportsPage?:boolean;
    // pendingReports?:boolean;
    // managerProjectsPage?:boolean;
    // salariesPage?:boolean;
    // FollowTickets?:boolean;
}