export enum NotificationStatus{
    Seen = 1,
    unSeen = 0,
}
export interface Notifying{
    key?:string;
    senderKey:string; 
    senderName:string;
    senderImg?:string;
    receverKey:string;
    receverName:string;
    title:string;
    body:string;
    createdAt?:String | Date;
    updatedAt?:String | Date;
    status?:NotificationStatus;
    redirection?:string; 
}
