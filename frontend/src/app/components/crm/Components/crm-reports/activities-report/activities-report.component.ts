import { Component, OnInit } from '@angular/core';
import { ActivitiesFilterBody, ActivityFilterBody, ActivityStatus, ActivityTypes, CloseLeadSubStatus, LeadsAndContacts } from 'src/app/interfaces/leadsAndContacts';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountRoles, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';

@Component({
    selector: 'app-activities-report',
    templateUrl: './activities-report.component.html',
    styleUrls: ['./activities-report.component.scss']
})
export class ActivitiesReportComponent implements OnInit {

    CloseLeadSubStatusEnum = CloseLeadSubStatus;
    ActivityTypesEnum = ActivityTypes;
    ActivityStatusEnum = ActivityStatus;

    allSales: User[] = [];
    allContactLeads: LeadsAndContacts[] = [];
    getToday = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;
    fileName = `${this.getToday}.xlsx`;

    filter: ActivitiesFilterBody = {};
    report: ActivityFilterBody[] = [];
    loading = false;
    dateRangeError = '';
    viewSidebarVisible = false;
    selectedActivity: ActivityFilterBody | null = null;

    constructor(private _db: DatabaseService,
        private _auth: AuthApiService,
        private _excelServ: ExportExcelService) { }

    ngOnInit(): void {
        this.getAllSales();
        this.getAllContacts();
        this.applyFilters();
    }

    applyFilters() {
        this.dateRangeError = '';

        if (!this.isValidDateRange(this.filter.from_date, this.filter.to_date)) {
            this.dateRangeError = 'From Date cannot be after To Date.';
            return;
        }

        if (!this.isValidDateRange(this.filter.activity_start_date, this.filter.activity_end_date)) {
            this.dateRangeError = 'Activity Start Date cannot be after Activity End Date.';
            return;
        }

        this.loading = true;

        const requestBody: ActivitiesFilterBody = {
            sales_id: this.filter.sales_id,
            contact_lead_id: this.filter.contact_lead_id,
            lead_sub_status_id: this.filter.lead_sub_status_id,
            activity_type_id: this.filter.activity_type_id,
            activity_status_id: this.filter.activity_status_id,
            from_date: this.toDateStringOrUndefined(this.filter.from_date),
            to_date: this.toDateStringOrUndefined(this.filter.to_date),
            activity_start_date: this.toDateStringOrUndefined(this.filter.activity_start_date),
            activity_end_date: this.toDateStringOrUndefined(this.filter.activity_end_date)
        };

        this._db.getActivitesReport(this.cleanObject(requestBody)).subscribe((res) => {
            if (res['status'] == ResStatus.CRUD) {
                this.report = res.data || [];
            } else {
                this.report = [];
            }

            this.loading = false;
        }, () => {
            this.report = [];
            this.loading = false;
        });
    }

    resetFilters() {
        this.filter = {};
        this.dateRangeError = '';
        this.applyFilters();
    }

    openViewSidebar(activity: ActivityFilterBody) {
        this.selectedActivity = activity;
        this.viewSidebarVisible = true;
    }

    exportAllData(): void {
        const element = document.getElementById('activitiesReportExport');
        if (!element) {
            return;
        }

        this._excelServ.exportexcel(element, `activitiesReport${this.fileName}`, 15);
    }

    getAllSales() {
        this._auth.getUserByFilter(Department.Business_Development, AccountRoles.SALES).subscribe(res => {
            this.allSales = res?.['data'] || [];
        }, err => {
            this.allSales = [];
        })

    }

    getAllContacts() {
        this._db.getAllContacts().subscribe((res) => {
            if (res['status'] == ResStatus.CRUD) {
                this.allContactLeads = res['data'] || [];
            } else {
                this.allContactLeads = [];
            }

        }, () => {
            this.allContactLeads = [];
        });
    }


    private cleanObject<T extends object>(obj: T): T {
        const cleaned: any = {};

        Object.keys(obj || {}).forEach((key) => {
            const value = (obj as any)[key];
            if (value !== undefined && value !== null && value !== '') {
                cleaned[key] = value;
            }
        });

        return cleaned;
    }

    private isValidDateRange(fromDate?: string | Date, toDate?: string | Date): boolean {
        if (!fromDate || !toDate) {
            return true;
        }

        const from = this.dateFromUnknown(fromDate);
        const to = this.dateFromUnknown(toDate);

        if (!from || !to) {
            return true;
        }

        return from.getTime() <= to.getTime();
    }

    private toDateStringOrUndefined(value: string | Date | undefined): string | undefined {
        if (!value) {
            return undefined;
        }

        if (typeof value === 'string') {
            return value;
        }

        return this._db.getDateFormattedYearMonthDay(value);
    }

    private dateFromUnknown(value: string | Date): Date | null {
        const dateValue = typeof value === 'string' ? new Date(value) : value;
        if (isNaN(dateValue.getTime())) {
            return null;
        }

        return dateValue;
    }





}
