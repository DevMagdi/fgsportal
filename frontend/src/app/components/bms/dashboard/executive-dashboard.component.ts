import { hasAbility } from '../bms-abilities.util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BmsApiService } from '../bms-api.service';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';
import {
  dashboardQuery,
  dashboardScope,
  dateLabel,
  hasDashboardFilters,
  hasNonUnitDashboardFilters,
  kpiSeriesKey,
  kpiSeriesLabel,
  latestKpiSeriesKey,
  numberLabel,
  opportunityStages,
  trendChartPoints,
  unitProgressRows,
} from './executive-dashboard.util';

@Component({
  selector: 'app-executive-dashboard',
  templateUrl: './executive-dashboard.component.html',
  styleUrls: ['../bms-shared.scss', './executive-dashboard.component.scss'],
})
export class ExecutiveDashboardComponent implements OnInit {
  data: any = null;
  lookups: any = { can: [], units: [], products: [], opportunities: [] };
  filters: FormGroup;
  appliedFilters: Record<string, any> = {};
  loadingLookups = true;
  loading = false;
  loadingTrend = false;
  lookupError = '';
  error = '';
  trendError = '';
  kpiHistory: any[] = [];
  selectedTrendKey = '';

  constructor(
    public api: BmsApiService,
    public lang: BmsLanguageService,
    private fb: FormBuilder,
    private exporter: BmsExportService,
  ) {
    this.filters = fb.group({ business_unit_id: [''], product_id: [''], opportunity_id: [''], week_start: [''] });
  }

  ngOnInit(): void {
    this.loadLookups();
  }

  loadLookups(): void {
    this.loadingLookups = true;
    this.lookupError = '';
    this.api.get<any>('lookups').subscribe({
      next: lookups => {
        this.lookups = { ...lookups, can: lookups?.can || [], units: lookups?.units || [], products: lookups?.products || [], opportunities: lookups?.opportunities || [] };
        this.loadingLookups = false;
        this.load();
      },
      error: error => {
        this.loadingLookups = false;
        this.lookupError = error?.error?.message || error?.message || this.lang.t('error');
      },
    });
  }

  load(): void {
    const filters = dashboardQuery(this.filters.value);
    this.appliedFilters = { ...filters };
    this.loading = true;
    this.error = '';
    this.data = null;
    this.api.get<any>('executive-dashboard', filters).subscribe({
      next: data => {
        this.data = data || { summary: {}, tenders: {}, procurement: {}, unit_progress: [], opportunities: [], products: [], meetings: [], recent_activity: [] };
        this.loading = false;
      },
      error: error => {
        this.data = null;
        this.loading = false;
        this.error = error?.error?.message || error?.message || this.lang.t('error');
      },
    });
    this.loadKpiHistory(filters.business_unit_id);
  }

  retry(): void {
    if (this.lookupError) this.loadLookups();
    else this.load();
  }

  clearFilters(): void {
    this.filters.reset({ business_unit_id: '', product_id: '', opportunity_id: '', week_start: '' });
    this.load();
  }

  can(ability: string): boolean {
    return hasAbility(this.lookups.can, ability);
  }

  get showUnitFilter(): boolean { return this.can('units.view') && this.lookups.units.length > 1; }
  get showProductFilter(): boolean { return this.can('products.view') && this.lookups.products.length > 0; }
  get showOpportunityFilter(): boolean { return this.can('opportunities.view') && this.lookups.opportunities.length > 0; }
  get showPlanWeekFilter(): boolean { return this.can('plans.view'); }
  get showKpiTrend(): boolean { return this.can('reports.view'); }
  get showExports(): boolean { return this.can('dashboard.export'); }
  get showOpportunityData(): boolean { return this.can('opportunities.view'); }
  get showUnitData(): boolean { return this.can('units.view'); }
  get showTaskData(): boolean { return this.can('plans.view'); }
  get showProductData(): boolean { return this.can('products.view'); }
  get showProcurementData(): boolean { return this.can('procurement.view'); }
  get showMeetingData(): boolean { return this.can('meetings.view'); }
  get hasFilters(): boolean { return hasDashboardFilters(this.filters.value); }
  get showRecentActivity(): boolean { return !hasNonUnitDashboardFilters(this.appliedFilters); }
  get scope(): { kind: 'organization' | 'unit'; label: string } {
    return dashboardScope(this.appliedFilters.business_unit_id, this.lookups.units);
  }
  get isOrganizationView(): boolean { return this.scope.kind === 'organization'; }

  openUnitDashboard(unitId: string | number): void {
    // Unit options come from the permission-filtered lookup; the API still
    // independently authorizes the selected id on every request.
    this.filters.patchValue({ business_unit_id: String(unitId), product_id: '', opportunity_id: '', week_start: '' });
    this.load();
  }

  isSelectedUnit(unitId: string | number): boolean {
    return String(this.appliedFilters.business_unit_id || '') === String(unitId);
  }

  get progressRows(): any[] { return unitProgressRows(this.data?.unit_progress || []); }
  get meetingRows(): any[] { return this.data?.meetings || []; }
  get activityRows(): any[] { return this.data?.recent_activity || []; }
  get stageRows(): any[] {
    return opportunityStages(this.data?.opportunities || [], key => {
      const translated = this.lang.t(key);
      return translated === key ? key.replace(/_/g, ' ') : translated;
    });
  }
  get trendSeries(): any[] { return this.kpiHistory; }
  get selectedTrend(): any {
    return this.kpiHistory.find(series => kpiSeriesKey(series) === this.selectedTrendKey) || null;
  }
  get trendLabel(): string { return this.selectedTrend ? kpiSeriesLabel(this.selectedTrend) : ''; }
  get trendPoints(): any[] { return trendChartPoints(this.selectedTrend?.points || []); }
  get trendActualLine(): string { return this.trendPoints.map(point => `${point.x},${point.actualY}`).join(' '); }
  get trendTargetSegments(): any[] {
    const segments: any[] = [];
    for (let i = 1; i < this.trendPoints.length; i++) {
      const previous = this.trendPoints[i - 1];
      const current = this.trendPoints[i];
      if (previous.targetY !== null && current.targetY !== null) {
        segments.push({ x1: previous.x, y1: previous.targetY, x2: current.x, y2: current.targetY });
      }
    }
    return segments;
  }
  get hasTrendLine(): boolean { return this.trendPoints.length >= 2; }

  retryKpiHistory(): void {
    this.loadKpiHistory(this.appliedFilters.business_unit_id);
  }

  number(value: unknown): string { return numberLabel(value, this.lang.current); }
  date(value: unknown, format: 'date' | 'time' | 'datetime' | 'month' = 'date'): string { return dateLabel(value, this.lang.current, format); }
  seriesKey(series: any): string { return kpiSeriesKey(series); }
  seriesLabel(series: any): string { return kpiSeriesLabel(series); }
  trackById(_index: number, item: any): string | number { return item.id ?? item.key ?? _index; }

  private loadKpiHistory(unitId?: string | number): void {
    if (!this.showKpiTrend) {
      this.kpiHistory = [];
      this.selectedTrendKey = '';
      this.trendError = '';
      this.loadingTrend = false;
      return;
    }
    this.loadingTrend = true;
    this.trendError = '';
    const filters = unitId ? { business_unit_id: unitId } : {};
    this.api.get<any>('reports/kpis', filters).subscribe({
      next: response => {
        this.kpiHistory = Array.isArray(response?.history) ? response.history : [];
        if (!this.kpiHistory.some(series => kpiSeriesKey(series) === this.selectedTrendKey)) {
          this.selectedTrendKey = latestKpiSeriesKey(this.kpiHistory);
        }
        this.loadingTrend = false;
      },
      error: error => {
        this.kpiHistory = [];
        this.loadingTrend = false;
        this.trendError = error?.error?.message || error?.message || this.lang.t('error');
      },
    });
  }

  unitRows(): any[] {
    if (!this.showUnitData || !this.showTaskData) return [];
    return (this.data?.unit_progress || []).map((unit: any) => ({
      Unit: unit.name, Director: unit.director?.username, Tasks: unit.total,
      Achieved: unit.achieved, InProgress: unit.in_progress, NotDone: unit.not_done,
      Blockers: unit.blocked, Progress: `${unit.progress}%`,
    }));
  }

  opportunityRows(): any[] {
    if (!this.showOpportunityData) return [];
    return (this.data?.opportunities || []).map((opportunity: any) => ({
      Reference: opportunity.reference, Title: opportunity.title, Client: opportunity.client_name,
      Unit: opportunity.unit?.name, Product: opportunity.product?.product_name,
      Stage: opportunity.stage, Decision: opportunity.go_no_go,
      Delayed: opportunity.is_delayed ? 'Yes' : 'No', NoUpdate: opportunity.has_no_update ? 'Yes' : 'No',
      Submission: opportunity.submission_date,
    }));
  }

  productRows(): any[] {
    if (!this.showProductData) return [];
    return (this.data?.products || []).map((product: any) => ({
      Product: product.product_name, Units: (product.business_units || []).map((unit: any) => unit.name).join(', '),
      CurrentPhase: product.current_phase?.name, Status: product.current_phase?.status,
      Blockers: product.current_phase?.blockers, DataNeeds: product.current_phase?.data_needs,
      SupportNeeds: product.current_phase?.support_needs,
    }));
  }

  excel(): void {
    this.exporter.excel([
      { name: 'Units', rows: this.unitRows() },
      { name: 'Opportunities', rows: this.opportunityRows() },
      { name: 'Products', rows: this.productRows() },
    ], `executive-dashboard-${new Date().toISOString().slice(0, 10)}`);
  }

  pdf(): void {
    this.exporter.pdf(
      'Alphaiota - Unified Executive Dashboard',
      [...this.unitRows(), ...this.opportunityRows(), ...this.productRows()],
      `executive-dashboard-${new Date().toISOString().slice(0, 10)}`,
    );
  }
}
