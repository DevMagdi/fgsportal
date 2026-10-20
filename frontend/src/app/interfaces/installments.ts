export interface Debit {
    id?:string;
    title:string;
    main_description:string;
    installment_type_id:string;
    installment_type_name?:string;
    total_amount:number | string;
    down_payment_amount?:number | string;
    payment_bank:string;
    installment_status_id?:string;
    installment_status_name?:string;
    remaining?:number;
    interest_amount?:number;
    currency?:string;
    installment_period_array:Installments[];
    user_creator?:string;
    user_creator_name?:string;
    created_at?:string;
    updated_at?:string;
}

export interface Installments {
    id?:string;
    installment_id?:string;
    is_paid?:boolean | number;
    incoming_date:Date | string;
    installment_amount:number | string;
    installment_description?:string;
    user_creator_name?:string;
    user_creator?:string;
    created_at?:string;
    updated_at?:string;
    rowIndex?:number;
}

export interface investmentDashboard{
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    insterest_amount: number;
}


export enum InstallmentType{
    Installment='1',
    Investment='2'
}

export enum InstallmentStatus{
    Running='1',
    Closed='2'
}


// Title
// Desc
// DebitDate
// Type => investment - installments
// Amount = 10000
// Remaining = 9000
// InresetAmount = 1000 if (investment)
// Bank


// * 1/10 = 11000 * //
// Foreign ID
// Amount 11000
// isPaid
// InstallmentDate


// investment  ============================= installments
// just amount and ROI ===================== Quarters
// ................... ===================== 
// 
// 
// 
// 
// 
// 
// 