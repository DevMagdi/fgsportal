export enum AnnounceStatus {
    RUNNING = 0,
    CLOSED = 1
}
export enum AnnounceLang {
    ARABIC = 'rtl',
    ENGLISH = 'ltr'
}
export interface AnnouncementViews {
    key?:string;
    viewedByKey:string;
    viewedByName:string;
    viewedByImgURL?:string;
    viewedAt:string;
    announceKey:string;
}


export interface AnnouncementToView {
    key?:string;
    empToviewedByKey:string;
    empToviewedByName:string;
}


export interface Announcement {
    key?:string;
    title:string;
    body:string;
    imgURL?:string;
    
    assignTo:AnnouncementToView[];
    assignToClient?:AnnouncementToView[];
    
    viewedBy:AnnouncementViews[];
    viewedByClient?:AnnouncementViews[];

    status:AnnounceStatus;
    language:AnnounceLang;

    createdByKey:string;
    createdByName:string;
    createdByImgUrl?:string;

    createdAt?:string;
}
