export enum TicketPendingOn{
    FGS = 'fgs',
    CLIENT = 'client'
}

export enum TicketStatus{
    STARTED = 'started',
    INPROGRESS = 'inprogress',
    CLOSED = 'closed',
}

export interface Ticket {
    key?:string;
    title:string;
    desc:string;
    imagesURls?:string[];
    empKey:string;
    empName:string;
    empImgUrl?:string;
    projectKey:string;
    projectName:string;
    processKey?:string;
    processName?:string;
    taskKey?:string;
    taskName?:string;
    createdAt?:Date | string;
    updatedAt?:Date | string;

    pendingOn:TicketPendingOn;
    status:TicketStatus;

    startDate?:Date | string;
    closureDate?:Date | string;

    assignedToKey?:string;
    assignedToName?:string;


}


export interface TicketAnswer {
    key?:string;
    answer:string;
    empKey:string;
    empName:string;
    ticketKey:string;
    ticketTitle:string;
    createdAt?:Date | string;
    imagesURls?:string[];
}
