import { hasAbility } from '../bms-abilities.util';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BmsApiService } from '../bms-api.service';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';
import {
  dashboardQuery,
  dateLabel,
  hasDashboardFilters,
  hasNonUnitDashboardFilters,
  kpiAchievement,
  kpiSeriesKey,
  kpiSeriesLabel,
  latestKpiSeriesKey,
  numberLabel,
  opportunityStages,
  taskStatusRows,
  trendChartPoints,
  unitProgressRows,
} from './executive-dashboard.util';

@Component({
  selector: 'app-executive-dashboard',
  templateUrl: './executive-dashboard.component.html',
  styleUrls: ['../bms-shared.scss', './executive-dashboard.component.scss'],
})
export class ExecutiveDashboardComponent implements OnInit, OnDestroy {
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
  taskStatusChartData: any = { labels: [], datasets: [] };
  taskStatusChartOptions: any = {};
  opportunityChartData: any = { labels: [], datasets: [] };
  opportunityChartOptions: any = {};
  kpiChartData: any = { labels: [], datasets: [] };
  kpiChartOptions: any = {};
  private languageSubscription?: Subscription;

  constructor(
    public api: BmsApiService,
    public lang: BmsLanguageService,
    private fb: FormBuilder,
    private exporter: BmsExportService,
  ) {
    this.filters = fb.group({ business_unit_id: [''], product_id: [''], opportunity_id: [''], week_start: [''] });
    this.languageSubscription = this.lang.language$.subscribe(() => this.refreshCharts());
  }

  ngOnInit(): void {
    this.loadLookups();
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
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
        this.refreshCharts();
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

  get progressRows(): any[] { return unitProgressRows(this.data?.unit_progress || []); }
  get taskStatusData(): any[] {
    return taskStatusRows(this.data?.unit_progress || [], key => this.lang.t(key));
  }
  get taskStatusTotal(): number {
    return (this.data?.unit_progress || []).reduce((sum: number, row: any) => sum + Math.max(0, Number(row?.total) || 0), 0);
  }
  get taskStatusChartLabel(): string {
    return `${this.lang.t('taskStatusDistribution')}: ${this.taskStatusData.map(row => `${row.label} ${this.number(row.count)}`).join(', ')}`;
  }
  get opportunityChartLabel(): string {
    return `${this.lang.t('opportunityPipeline')}: ${this.stageRows.map(row => `${row.label} ${this.number(row.count)}`).join(', ')}`;
  }
  get kpiAchievementValue(): any {
    const latest = this.trendPoints[this.trendPoints.length - 1];
    return kpiAchievement(latest?.actual, latest?.target);
  }
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
  get hasTrendLine(): boolean { return this.trendPoints.length >= 2; }

  selectTrend(key: string): void {
    this.selectedTrendKey = key;
    this.refreshTrendChart();
  }

  retryKpiHistory(): void {
    this.loadKpiHistory(this.appliedFilters.business_unit_id);
  }

  number(value: unknown): string { return numberLabel(value, this.lang.current); }
  date(value: unknown, format: 'date' | 'time' | 'datetime' | 'month' = 'date'): string { return dateLabel(value, this.lang.current, format); }
  seriesKey(series: any): string { return kpiSeriesKey(series); }
  seriesLabel(series: any): string { return kpiSeriesLabel(series); }
  trackById(_index: number, item: any): string | number { return item.id ?? item.key ?? _index; }

  private get chartAnimation(): any {
    const reduced = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduced ? false : { duration: 220 };
  }

  private refreshCharts(): void {
    const rtl = this.lang.direction === 'rtl';
    const font = this.lang.current === 'ar' ? 'Cairo, Segoe UI, sans-serif' : 'Inter, Segoe UI, sans-serif';
    const statuses = this.taskStatusData;
    this.taskStatusChartData = {
      labels: statuses.map(row => row.label),
      datasets: [{
        data: statuses.map(row => row.count),
        backgroundColor: statuses.map(row => this.taskStatusColor(row.key)),
        borderColor: this.colorToken('--bms-surface', '#ffffff'), borderWidth: 3, hoverOffset: 5, borderRadius: 4,
      }],
    };
    this.taskStatusChartOptions = {
      responsive: true, maintainAspectRatio: false, cutout: '76%',
      animation: this.chartAnimation, font: { family: font }, layout: { padding: 5 },
      plugins: {
        legend: { display: false, rtl, textDirection: rtl ? 'rtl' : 'ltr' },
        tooltip: { rtl, textDirection: rtl ? 'rtl' : 'ltr', callbacks: {
          label: (context: any) => `${context.label}: ${this.number(context.raw)}`,
        } },
      },
    };

    const stages = this.stageRows;
    this.opportunityChartData = {
      labels: stages.map(row => row.label),
      datasets: [{
        data: stages.map(row => row.count),
        backgroundColor: stages.map((_row: any, index: number) => this.stageColor(index)),
        borderRadius: 6, borderSkipped: false, barPercentage: .7, categoryPercentage: .82,
      }],
    };
    this.opportunityChartOptions = {
      responsive: true, maintainAspectRatio: false, indexAxis: 'y',
      animation: this.chartAnimation, font: { family: font },
      plugins: {
        legend: { display: false, rtl, textDirection: rtl ? 'rtl' : 'ltr' },
        tooltip: { rtl, textDirection: rtl ? 'rtl' : 'ltr', callbacks: {
          label: (context: any) => {
            const stage = stages[context.dataIndex];
            return stage ? `${this.number(stage.count)} · ${this.number(stage.percent)}%` : this.number(context.raw);
          },
        } },
      },
      scales: {
        x: { beginAtZero: true, reverse: rtl, ticks: { precision: 0, color: this.colorToken('--bms-muted', '#596579'), font: { family: font }, callback: (value: any) => this.number(value) }, grid: { color: this.colorToken('--bms-border', '#edf0f5'), drawBorder: false } },
        y: { ticks: { color: this.colorToken('--bms-ink-soft', '#34394c'), font: { family: font } }, grid: { display: false, drawBorder: false } },
      },
    };
    this.refreshTrendChart();
  }

  private refreshTrendChart(): void {
    const rtl = this.lang.direction === 'rtl';
    const font = this.lang.current === 'ar' ? 'Cairo, Segoe UI, sans-serif' : 'Inter, Segoe UI, sans-serif';
    const points = this.trendPoints;
    this.kpiChartData = {
      labels: points.map(point => this.date(point.label, 'month')),
      datasets: [
        {
          label: this.lang.t('actual'), data: points.map(point => Number(point.actual)),
          borderColor: this.colorToken('--bms-primary', '#45436e'), backgroundColor: 'transparent',
          pointBackgroundColor: this.colorToken('--bms-surface', '#ffffff'), pointBorderColor: this.colorToken('--bms-primary', '#45436e'), pointBorderWidth: 2,
          pointRadius: 3.5, pointHoverRadius: 5, borderWidth: 2.5, tension: .34, fill: false,
        },
        {
          label: this.lang.t('target'), data: points.map(point => point.targetY === null ? null : Number(point.target)),
          borderColor: this.colorToken('--bms-accent', '#247a70'), backgroundColor: 'transparent',
          pointBackgroundColor: this.colorToken('--bms-surface', '#ffffff'), pointBorderColor: this.colorToken('--bms-accent', '#247a70'), pointBorderWidth: 2,
          pointRadius: 3, pointHoverRadius: 4.5, borderWidth: 2, borderDash: [5, 4], tension: .2, fill: false,
        },
      ],
    };
    this.kpiChartOptions = {
      responsive: true, maintainAspectRatio: false,
      animation: this.chartAnimation, font: { family: font },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false, rtl, textDirection: rtl ? 'rtl' : 'ltr' },
        tooltip: { rtl, textDirection: rtl ? 'rtl' : 'ltr', callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y === null ? '—' : this.number(context.parsed.y)}`,
        } },
      },
      scales: {
        x: { reverse: rtl, ticks: { color: this.colorToken('--bms-muted', '#596579'), maxRotation: 0, autoSkip: true, maxTicksLimit: 5, font: { family: font } }, grid: { display: false, drawBorder: false } },
        y: { ticks: { color: this.colorToken('--bms-muted', '#596579'), font: { family: font } }, grid: { color: this.colorToken('--bms-border', '#edf0f5'), drawBorder: false } },
      },
    };
  }

  taskStatusColor(key: string): string {
    const tokens: Record<string, string> = { achieved: '--bms-accent', inProgress: '--bms-sky', notDone: '--bms-pink', other: '--bms-muted' };
    return this.colorToken(tokens[key] || '--bms-muted', '#727d8e');
  }

  private stageColor(index: number): string {
    const palette = ['--bms-primary', '--bms-accent', '--bms-sky', '--bms-lavender', '--bms-periwinkle', '--bms-cyan'];
    return this.colorToken(palette[index % palette.length], '#45436e');
  }

  private colorToken(name: string, fallback: string): string {
    if (typeof document === 'undefined' || typeof getComputedStyle !== 'function') return fallback;
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

  private loadKpiHistory(unitId?: string | number): void {
    if (!this.showKpiTrend) {
      this.kpiHistory = [];
      this.selectedTrendKey = '';
      this.trendError = '';
      this.loadingTrend = false;
      this.refreshTrendChart();
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
        this.refreshTrendChart();
      },
      error: error => {
        this.kpiHistory = [];
        this.loadingTrend = false;
        this.trendError = error?.error?.message || error?.message || this.lang.t('error');
        this.refreshTrendChart();
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
