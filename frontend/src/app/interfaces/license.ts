// export enum licenseType{
//     Subscription = '0',
//     Perpetual  = '1'
// }
export interface licenseType{
    license_type:string;
    id:string;
}

// export enum licenseProduct{
//     IBM = '0',
//     AA  = '1'
// }

export enum LicenseStatus{
    Active='1',
    Expired='2'
}



export interface LicenseUpdates{
    key?:string;
    licenseKey:string;
    startDate:string;
    endDate:string;

    createdAt?:string;
    updatedAt?:string;
    
    createdByKey:string;
    createdByName:string;

    status:string;
    status_name?:string;
}

export interface License {
    key?:string;
    accountName?:string;
    type:string;
    type_name?:string;

    product:string;
    product_name?:string;
    
    status?:string;
    status_name?:string;

    clientKey?:string;
    clientName?:string;
    clientLogo?:string;
    
    
    startDate?:string | Date;
    endDate?:string | Date;

    
    comment?:string;

    fileURL?:string;
    fileName?:string;
    
    createdAt?:string;
    updatedAt?:string;
    
    createdByKey:string;
    createdByName:string;

    license_history?:LicenseUpdates[];
}
