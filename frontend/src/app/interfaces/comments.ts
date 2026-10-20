export interface ProjectComments {
    key?:string;
    projectKey:string;
    projectName:string;
    commenterKey:string;
    commenterName:string;
    comment:string;
    createdAt?:Date | string | number;
    updatedAt?:Date | string | number;
    numberOfViews?:number;
}


export interface ProcessComments {
    key?:string;
    processKey:string;
    processName:string;
    commenterKey:string;
    commenterName:string;
    comment:string;
    createdAt?:Date | string | number;
    updatedAt?:Date | string | number;
    numberOfViews?:number;
}
