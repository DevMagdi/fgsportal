import { Component, Input } from '@angular/core';
import { ActivityFilterBody } from 'src/app/interfaces/leadsAndContacts';

interface DetailEntry {
    key: string;
    label: string;
    value: any;
}

interface ActivityDisplayField {
    key: string;
    label: string;
}

@Component({
    selector: 'app-activity-details-view',
    templateUrl: './activity-details-view.component.html',
    styleUrls: ['./activity-details-view.component.scss']
})
export class ActivityDetailsViewComponent {
    private _activity: ActivityFilterBody | null = null;
    detailEntries: DetailEntry[] = [];

    private readonly displayOrder: ActivityDisplayField[] = [
        { key: 'contact_lead_name', label: 'Contact Lead' },
        { key: 'person_contact_name', label: 'Person Contact' },
        { key: 'partner_name', label: 'Partner' },
        { key: 'product_name', label: 'Product' },
        { key: 'activity_type_name', label: 'Activity Type' },
        { key: 'activity_status_name', label: 'Activity Status' },
        { key: 'lead_sub_status_name', label: 'Lead Sub Status' },
        { key: 'comment', label: 'Comment' },
        { key: 'description', label: 'Description' },
        { key: 'duration', label: 'Duration' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'from_date', label: 'From Date' },
        { key: 'to_date', label: 'To Date' },
        { key: 'activity_start_date', label: 'Activity Start Date' },
        { key: 'activity_end_date', label: 'Activity End Date' },
        { key: 'next_action', label: 'Next Action' },
        { key: 'next_action_date', label: 'Next Action Date' },
        { key: 'created_at', label: 'Created At' },
        { key: 'createdBy_name', label: 'Created By' }
    ];

    @Input() set activity(value: ActivityFilterBody | null) {
        this._activity = value;
        this.detailEntries = this.buildDetailEntries(value);
    }

    get activity(): ActivityFilterBody | null {
        return this._activity;
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
            return value.map((item) => {
                if (typeof item === 'object') {
                    return JSON.stringify(item);
                }
                return `${item}`;
            }).join(' | ');
        }

        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        return `${value}`;
    }

    private buildDetailEntries(activity: ActivityFilterBody | null): DetailEntry[] {
        if (!activity) {
            return [];
        }

        return this.displayOrder.map((field) => ({
            key: field.key,
            label: field.label,
            value: (activity as any)[field.key]
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
