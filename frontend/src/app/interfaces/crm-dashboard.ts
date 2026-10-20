export const DashboardColors = [
    '#66BB6A',
    '#FFA726',
    '#42A5F5',
    '#09c',
    '#2E7D32',
    '#f4831f',
    '#513982',
    '#707070',
    '#0825fc',
    '#370045',
    '#b361c8',
    '#f361c8'
]
export const DashboardColorsRGB = [
    '102,187,106',
    '255, 167, 38',
    '66, 165, 245',
    '0, 153, 204',
    '46, 125, 50',
    '244, 131, 31',
    '81, 57, 130',
    '112, 112, 112',
    '8, 37, 252',
    '55, 0, 69',
    '179, 97, 200',
    '243, 97, 200'
]

export interface Dataset{
    data:string[]|number[];
    label:string;
    type?:string;
    fill?:boolean;
    backgroundColor?:string|string[];
    hoverBackgroundColor?:string|string[];
}

export interface DealProgressData {
    labels:string[];
    datasets:Dataset[];
}

export interface RevenueforcastData {
    labels:string[];
    datasets:Dataset[];
    totalValueOfWonDeals:TotalValueOfWonDeals;
    revenueOverProduct:RevenueOverProduct;
    revenueOverSales:RevenueOverSales;
}

export interface LeadsForSalesData {
    labels:string[];
    datasets:Dataset[];
    data?:number[];
}

export interface RevenueOverProduct {
    labels:string[];
    datasets:Dataset[];
    data?:number[];
}

export interface RevenueOverSales {
    labels:string[];
    datasets:Dataset[];
    data?:number[];
}

export interface ActivitesData {
    labels:string[];
    datasets:Dataset[];
}

export interface TotalValueOfWonDeals {
    currentValue:number;
    lastValue:number;
    upOrDown:string; // up, down, eq
}


export interface CRMDashboardData {
    dealProgressData:DealProgressData;
    revenueforcastData:RevenueforcastData;
    leadsForSalesData:LeadsForSalesData;
    activitesData:ActivitesData;
    // totalValueOfWonDeals:TotalValueOfWonDeals;
    // revenueOverProduct:RevenueOverProduct;
}

