import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';

@Component({selector:'app-weekly-plans',templateUrl:'./weekly-plans.component.html',styleUrls:['../bms-shared.scss']})
export class WeeklyPlansComponent extends BmsBaseComponent implements OnInit {
  plans:any[]=[];selected:any=null;report:any=null;planForm:FormGroup;taskForm:FormGroup;supportForm:FormGroup;
  constructor(api:BmsApiService,lang:BmsLanguageService,private fb:FormBuilder,private exporter:BmsExportService){super(api,lang);
    const sunday=new Date();sunday.setDate(sunday.getDate()-sunday.getDay());
    this.planForm=fb.group({business_unit_id:['',Validators.required],week_start:[sunday.toISOString().slice(0,10),Validators.required],objectives:[''],next_week_plan:['']});
    this.taskForm=fb.group({title:['',Validators.required],description:[''],owner_id:[''],status:['in_progress'],progress:[0],blockers:[''],due_date:['']});
    this.supportForm=fb.group({department_id:['',Validators.required],title:['',Validators.required],details:['',Validators.required]});
  }
  ngOnInit():void{super.ngOnInit();this.load();}
  load():void{this.loading=true;this.api.get<any[]>('weekly-plans').subscribe({next:data=>{this.plans=data;if(this.selected)this.selected=data.find(p=>p.id===this.selected.id)||null;this.loading=false;},error:e=>this.showError(e)});}
  createPlan():void{if(this.planForm.invalid){this.planForm.markAllAsTouched();return;}this.api.post<any>('weekly-plans',this.planForm.value).subscribe({next:plan=>{this.saved();this.selected=plan;this.load();},error:e=>this.showError(e)});}
  select(plan:any):void{this.selected=plan;this.report=null;this.taskForm.reset({title:'',description:'',owner_id:'',status:'in_progress',progress:0,blockers:'',due_date:''});this.supportForm.reset({department_id:'',title:'',details:''});}
  savePlan():void{this.api.put(`weekly-plans/${this.selected.id}`,{objectives:this.selected.objectives,next_week_plan:this.selected.next_week_plan}).subscribe({next:()=>{this.saved();this.load();},error:e=>this.showError(e)});}
  addTask():void{if(this.taskForm.invalid){this.taskForm.markAllAsTouched();return;}const value=this.taskForm.value;value.owner_id=value.owner_id||null;value.due_date=value.due_date||null;this.api.post(`weekly-plans/${this.selected.id}/tasks`,value).subscribe({next:()=>{this.saved();this.select(this.selected);this.load();},error:e=>this.showError(e)});}
  updateTask(task:any):void{this.api.put(`tasks/${task.id}`,{title:task.title,description:task.description,owner_id:task.owner_id,status:task.status,progress:Number(task.progress),blockers:task.blockers,due_date:task.due_date}).subscribe({next:()=>this.saved(),error:e=>this.showError(e)});}
  addSupport():void{if(this.supportForm.invalid){this.supportForm.markAllAsTouched();return;}this.api.post(`weekly-plans/${this.selected.id}/support-requests`,this.supportForm.value).subscribe({next:()=>{this.saved();this.select(this.selected);this.load();},error:e=>this.showError(e)});}
  updateSupport(support:any):void{this.api.put(`support-requests/${support.id}`,{status:support.status,response:support.response}).subscribe({next:()=>this.saved(),error:e=>this.showError(e)});}
  submit():void{this.api.post<any>(`weekly-plans/${this.selected.id}/submit`).subscribe({next:data=>{this.report=data;this.saved();this.load();},error:e=>this.showError(e)});}
  generateReport():void{this.api.get<any>(`weekly-plans/${this.selected.id}/sunday-report`).subscribe({next:data=>this.report=data,error:e=>this.showError(e)});}
  exportPlansExcel():void{this.exporter.excel([{name:'Weekly plans',rows:this.planRows()}],'bms-weekly-plans');}
  exportPlansPdf():void{this.exporter.pdf(this.lang.t('plans'),this.planRows(),'bms-weekly-plans');}
  private planRows():any[]{return this.plans.map(p=>({Unit:p.unit?.name,WeekStart:p.week_start,Status:p.status,Objectives:p.objectives,NextWeekPlan:p.next_week_plan,Tasks:p.tasks?.length||0,SupportRequests:p.support_requests?.length||0,SubmittedAt:p.submitted_at}));}
  private rows():any[]{return (this.report?.tasks||[]).map((t:any)=>({Task:t.title,Owner:t.owner?.username,Status:t.status,Progress:`${t.progress}%`,Blockers:t.blockers,DueDate:t.due_date,CompletionDate:t.completion_date}));}
  exportExcel():void{this.exporter.excel([{name:'Sunday tasks',rows:this.rows()},{name:'Support requests',rows:(this.report?.support_requests||[]).map((s:any)=>({Title:s.title,Department:s.department?.department_name,Status:s.status,Details:s.details,Response:s.response}))}],`sunday-report-${this.report.unit.slug}-${String(this.report.week_start).slice(0,10)}`);}
  exportPdf():void{this.exporter.pdf(`Sunday report - ${this.report.unit.name} - ${String(this.report.week_start).slice(0,10)}`,this.rows(),`sunday-report-${this.report.unit.slug}`);}
}
