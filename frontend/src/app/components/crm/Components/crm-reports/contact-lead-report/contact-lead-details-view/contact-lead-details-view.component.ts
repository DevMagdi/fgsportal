import { Component, Input } from '@angular/core';
import { CrmReportBody } from 'src/app/interfaces/leadsAndContacts';

interface ContactLeadDetailEntry {
    key: string;
    label: string;
    value: any;
}

interface ContactLeadDisplayField {
    key: string;
    label: string;
}

@Component({
    selector: 'app-contact-lead-details-view',
    templateUrl: './contact-lead-details-view.component.html',
    styleUrls: ['./contact-lead-details-view.component.scss']
})
export class ContactLeadDetailsViewComponent {
    private _report: CrmReportBody | null = null;
    detailEntries: ContactLeadDetailEntry[] = [];

    private readonly displayOrder: ContactLeadDisplayField[] = [
        { key: 'title', label: 'Title' },
        { key: 'user_creator_name', label: 'Creator' },
        { key: 'product_name', label: 'Product' },
        { key: 'country', label: 'Country' },

        { key: 'lead_sub_status_name', label: 'Lead Sub Status' },
        { key: 'lead_type_name', label: 'Lead Type' },

        { key: 'partner_name', label: 'Partner' },
        { key: 'contact_name', label: 'Contact Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },

        { key: 'status_name', label: 'Status' },
        { key: 'campagin_name', label: 'Campaign Name' },

        { key: 'cost', label: 'Cost' },
        { key: 'currency', label: 'Currency' },

        { key: 'sales_name', label: 'Sales' },
        { key: 'cost_details', label: 'Cost Details' },

        { key: 'next_action', label: 'Next Action' },
        { key: 'next_action_date', label: 'Next Action Date' },

        { key: 'seen', label: 'Seen' },
        { key: 'transfer', label: 'Transfer' },

        { key: 'isLead', label: 'Is Lead' },
        { key: 'notes', label: 'Notes' },
        
        { key: 'expected_close_date', label: 'Expected Close Date' },
        { key: 'actual_closing_date', label: 'Actual Closing Date' },
    ];

    @Input() set report(value: CrmReportBody | null) {
        this._report = value;
        this.detailEntries = this.buildDetailEntries(value);
    }

    get report(): CrmReportBody | null {
        return this._report;
    }

    formatDetailValue(value: any): string {
        if (value === undefined || value === null || value === '') {
            return '--';
        }

        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }

        if (typeof value === 'string' && this.isDateLike(value)) {
            return this.formatDateValue(value);
        }

        if (Array.isArray(value)) {
            return value.map((item) => this.formatArrayItem(item)).filter((item) => !!item).join(' | ');
        }

        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        return `${value}`;
    }

    private formatArrayItem(item: any): string {
        if (item === undefined || item === null || item === '') {
            return '';
        }

        if (typeof item === 'string') {
            return item;
        }

        if (typeof item === 'object' && item.phone) {
            return `${item.country_code ? item.country_code : ''}${item.phone}`;
        }

        if (typeof item === 'object') {
            return JSON.stringify(item);
        }

        return `${item}`;
    }

    private buildDetailEntries(report: CrmReportBody | null): ContactLeadDetailEntry[] {
        if (!report) {
            return [];
        }

        return this.displayOrder.map((field) => ({
            key: field.key,
            label: field.label,
            value: (report as any)[field.key]
        }));
    }

    private isDateLike(value: string): boolean {
        if (!value) {
            return false;
        }

        const hasDateParts = /\d{4}-\d{2}-\d{2}|\d{4}-\d{2}-\d{2}T/.test(value);
        if (!hasDateParts) {
            return false;
        }

        const date = new Date(value);
        return !isNaN(date.getTime());
    }

    private formatDateValue(value: string): string {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return value;
        }

        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
}
