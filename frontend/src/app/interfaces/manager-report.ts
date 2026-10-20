
export interface ManagerReport {
    key:string,
    for_date: string;
    manager_approve_id: number
    manager_approve_name: string;
    team_request_description: string;
    team_request_status: string,
    team_request_status_id: ManagerReportStatus,
    team_request_title: string,
    user_creator_id: string,
    user_creator_name: string,

    projects: ReportProject[],
}

export enum ManagerReportStatus {
    Closed = '2',
    Open = '1',

}
export interface ReportProject {
    project_id: string,
    project_title: string,
    process_details: ProcessDetail[]
}

export interface ProcessDetail {
    process_id: string,
    process_title: string
}

export interface FilterBody {
    start_date?: string,
    end_date?: string,
    team_request_status_id?: ManagerReportStatus,

}
