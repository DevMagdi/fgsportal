export interface CampaignStatus{
    id:string;
    name:string;
}


export interface Campaign {
    id?:string;
    campagin_name:string;

    
    product_id:string;
    product_name?:string;

    platform_id:string;
    platform_name?:string;

    status:string;


    title:string;
    desc:string;
    createdBy_name?:string;
    cost:number;
    expectedNumberOfLeads:number;
    start_date:string;
    end_date:string;
}
