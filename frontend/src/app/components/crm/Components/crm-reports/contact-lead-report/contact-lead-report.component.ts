import { Component, OnInit } from '@angular/core';
import { CurrencyModule } from 'src/app/interfaces/currency.module';
import { CloseLeadSubStatus, CRMFilterBody, CrmReportBody, EngagementLeadSubStatus, InterestedLeadSubStatus } from 'src/app/interfaces/leadsAndContacts';
import { Products } from 'src/app/interfaces/products';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountRoles, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';

@Component({
    selector: 'app-contact-lead-report',
    templateUrl: './contact-lead-report.component.html',
    styleUrls: ['./contact-lead-report.component.scss']
})
export class ContactLeadReportComponent implements OnInit {

    getToday = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;
    fileName = `${this.getToday}.xlsx`;
    filter: CRMFilterBody = {};
    reports: CrmReportBody[] = [];
    loading = false;
    dateRangeError = '';
    viewSidebarVisible = false;
    selectedReport: CrmReportBody | null = null;
    allUsers: User[] = [];
    allProducts: Products[] = [];


    leadSubStatusOptions: { label: string; value: string; }[] = [];
    countryOptions: { label: string; value: string; }[] = [];

    constructor(private _db: DatabaseService,
        private _auth: AuthApiService,
        private _excelServ: ExportExcelService) { }

    ngOnInit(): void {
        this.setStaticDropdownOptions();
        this.getAllUsers();
        this.getAllProducts();
        this.applyFilters();
    }

    applyFilters() {
        this.dateRangeError = '';

        if (!this.isValidDateRange(this.filter.start_date, this.filter.end_date)) {
            this.dateRangeError = 'Start Date cannot be after End Date.';
            return;
        }

        this.loading = true;

        const requestBody: CRMFilterBody = {
            user_creator_id: this.filter.user_creator_id,
            product_id: this.filter.product_id,
            lead_sub_status_id: this.filter.lead_sub_status_id,
            country: this.filter.country,
            start_date: this.filter.start_date,
            end_date: this.filter.end_date
        };

        this._db.getContactLeadReport(this.cleanObject(requestBody)).subscribe((res) => {
            if (res['status'] == ResStatus.CRUD) {
                this.reports = res.data || [];
            } else {
                this.reports = [];
            }

            this.loading = false;
        }, () => {
            this.reports = [];
            this.loading = false;
        });
    }

    resetFilters() {
        this.filter = {};
        this.dateRangeError = '';
        this.applyFilters();
    }

    openViewSidebar(report: CrmReportBody) {
        this.selectedReport = report;
        this.viewSidebarVisible = true;
    }

    exportAllData(): void {
        const element = document.getElementById('contactLeadReportExport');
        if (!element) {
            return;
        }

        this._excelServ.exportexcel(element, `contactLeadReport${this.fileName}`, 25);
    }

    private setStaticDropdownOptions() {
        // this.leadSubStatusOptions =
        let closeLeadSubStatus = Object.keys(CloseLeadSubStatus).map((key) => ({
            label: key.replace(/_/g, ' '),
            value: (CloseLeadSubStatus as any)[key]
        }));
        let interestedLeadSubStatus = Object.keys(InterestedLeadSubStatus).map((key) => ({
            label: key.replace(/_/g, ' '),
            value: (InterestedLeadSubStatus as any)[key]
        }));
        let engagementLeadSubStatus = Object.keys(EngagementLeadSubStatus).map((key) => ({
            label: key.replace(/_/g, ' '),
            value: (EngagementLeadSubStatus as any)[key]
        }));
        this.leadSubStatusOptions = [...closeLeadSubStatus, ...interestedLeadSubStatus, ...engagementLeadSubStatus];

        this.countryOptions = CurrencyModule.CurrencyList.map((currency) => ({
            label: `${currency.countryName} (${currency.countryCode.toUpperCase()})`,
            value: currency.countryCode
        }));
    }

    private getAllUsers() {
        this._auth.getAllUsers().subscribe((res) => {
            if (res['status'] == ResStatus.CRUD) {
                this.allUsers = this.filterUserCreatorOptions(res['data'] || []);
            } else {
                this.allUsers = [];
            }


        }, () => {
            this.allUsers = [];

        });
    }

    private filterUserCreatorOptions(users: User[]): User[] {
        return (users || []).filter((user) => {

            const isManagementCeo = user.department == Department.MANAGEMENT && user.accRole === AccountRoles.CEO;
            const isBusinessDevelopmentSales = user.department == Department.Business_Development && user.accRole == AccountRoles.SALES;
            // const isSales = user.accRole === AccountRoles.SALES;

            return isManagementCeo || isBusinessDevelopmentSales;
        });
    }

    private getAllProducts() {
        this._db.getAllProducts().subscribe((res) => {
            if (res['status'] == ResStatus.CRUD) {
                this.allProducts = res['data'] || [];
            } else {
                this.allProducts = [];
            }


        }, () => {
            this.allProducts = [];

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

    private isValidDateRange(startDate?: string | Date, endDate?: string | Date): boolean {
        if (!startDate || !endDate) {
            return true;
        }

        const start = this.dateFromUnknown(startDate);
        const end = this.dateFromUnknown(endDate);

        if (!start || !end) {
            return true;
        }

        return start.getTime() <= end.getTime();
    }

    private dateFromUnknown(value: string | Date): Date | null {
        const dateValue = typeof value === 'string' ? new Date(value) : value;
        if (isNaN(dateValue.getTime())) {
            return null;
        }

        return dateValue;
    }


}
