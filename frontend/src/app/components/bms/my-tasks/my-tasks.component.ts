import { Component, OnInit } from '@angular/core';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';

/**
 * "My Tasks" (BRD section 8): every task assigned to the signed-in employee,
 * with progress / blocker update in place. The backend refuses updates on
 * tasks the user neither owns nor manages.
 */
@Component({ selector: 'app-my-tasks', templateUrl: './my-tasks.component.html', styleUrls: ['../bms-shared.scss'] })
export class MyTasksComponent extends BmsBaseComponent implements OnInit {
  tasks: any[] = [];
  summary: any = {};
  status = '';

  constructor(api: BmsApiService, lang: BmsLanguageService, private exporter: BmsExportService) { super(api, lang); }

  ngOnInit(): void { super.ngOnInit(); this.load(); }

  load(): void {
    this.loading = true;
    this.api.get<any>('my-tasks', this.status ? { status: this.status } : {}).subscribe({
      next: result => { this.tasks = result.data || []; this.summary = result.summary || {}; this.loading = false; },
      error: error => this.showError(error),
    });
  }

  update(task: any): void {
    this.api.put(`tasks/${task.id}`, {
      status: task.status, progress: Number(task.progress), blockers: task.blockers, title: task.title, description: task.description,
    }).subscribe({ next: () => { this.saved(); this.load(); }, error: error => this.showError(error) });
  }

  /** Direct edit permission is decided server-side; hide it when team tasks are not allowed. */
  canUpdate(task: any): boolean {
    return this.can('tasks.manage') || this.canViewTeam();
  }

  private canViewTeam(): boolean {
    return this.can('plans.manage');
  }

  isOverdue(task: any): boolean {
    return task.status !== 'achieved' && !!task.due_date && new Date(task.due_date) < new Date(new Date().toDateString());
  }

  rows(): any[] {
    return this.tasks.map(task => ({
      Title: task.title, Unit: task.unit?.name, Week: task.plan?.week_start, Status: task.status,
      Progress: task.progress, Blockers: task.blockers, DueDate: task.due_date,
    }));
  }
  excel(): void { this.exporter.excel([{ name: 'My tasks', rows: this.rows() }], 'bms-my-tasks'); }
  pdf(): void { this.exporter.pdf(this.lang.t('myTasks'), this.rows(), 'bms-my-tasks'); }
}
