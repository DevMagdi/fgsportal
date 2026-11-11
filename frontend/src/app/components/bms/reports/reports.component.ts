import { Component, OnInit } from '@angular/core';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';
@Component({selector:'app-bms-reports',templateUrl:'./reports.component.html',styleUrls:['../bms-shared.scss']})
export class ReportsComponent extends BmsBaseComponent implements OnInit {
  tab:'monthly'|'quarterly'|'social'='monthly';monthly:any=null;quarterly:any=null;social:any=null;month=new Date().toISOString().slice(0,7);unitId='';
  kpi:any={business_unit_id:'',name:'',target:null,actual:0,unit_label:'',period_start:'',period_end:''};
  metric:any={platform:'LinkedIn',followers:0,posts:0,engagement:0,period_start:'',period_end:''};
  constructor(api:BmsApiService,lang:BmsLanguageService,private exporter:BmsExportService){super(api,lang);}
  ngOnInit():void{super.ngOnInit();const end=new Date(),start=new Date();start.setMonth(start.getMonth()-6);this.metric.period_start=start.toISOString().slice(0,10);this.metric.period_end=end.toISOString().slice(0,10);this.kpi.period_end=this.metric.period_end;start.setDate(end.getDate()-89);this.kpi.period_start=start.toISOString().slice(0,10);this.loadMonthly();}
  setTab(tab:any):void{this.tab=tab;if(tab==='monthly')this.loadMonthly();if(tab==='quarterly')this.loadQuarterly();if(tab==='social')this.loadSocial();}
  loadMonthly():void{this.loading=true;this.api.get('reports/monthly',{month:this.month,business_unit_id:this.unitId}).subscribe({next:data=>{this.monthly=data;this.loading=false;},error:e=>this.showError(e)});}
  loadQuarterly():void{this.loading=true;this.api.get<any>('reports/quarterly',{business_unit_id:this.unitId,period_start:this.kpi.period_start,period_end:this.kpi.period_end}).subscribe({next:data=>{this.quarterly=data;if(!this.kpi.business_unit_id)this.kpi.business_unit_id=data.unit?.id||'';this.loading=false;},error:e=>this.showError(e)});}
  loadSocial():void{this.loading=true;this.api.get('reports/social',{period_start:this.metric.period_start,period_end:this.metric.period_end}).subscribe({next:data=>{this.social=data;this.loading=false;},error:e=>this.showError(e)});}
  saveKpi():void{if(!this.kpi.business_unit_id||!this.kpi.name)return;this.api.post('reports/kpis',this.kpi).subscribe({next:()=>{this.saved();this.kpi.name='';this.loadQuarterly();},error:e=>this.showError(e)});}
  saveSocial():void{if(!this.metric.platform)return;this.api.post('reports/social',this.metric).subscribe({next:()=>{this.saved();this.loadSocial();},error:e=>this.showError(e)});}
  exportExcel():void{const sheets=this.tab==='monthly'?[{name:'Unit performance',rows:this.rows()},{name:'Products',rows:this.productRows()},{name:'Opportunities',rows:this.opportunityRows()}]:[{name:this.tab,rows:this.rows()}];this.exporter.excel(sheets,`bms-${this.tab}-report`);}
  exportPdf():void{const rows=this.tab==='monthly'?this.monthlyPdfRows():this.rows();this.exporter.pdf(this.lang.t(this.tab+'Report'),rows,`bms-${this.tab}-report`);}
  private productRows():any[]{return(this.monthly?.products||[]).map((p:any)=>({Product:p.product_name,CurrentPhase:p.current_phase?.name,Status:p.current_phase?.status,Blockers:p.current_phase?.blockers,DataNeeds:p.current_phase?.data_needs,SupportNeeds:p.current_phase?.support_needs,Units:(p.business_units||[]).map((u:any)=>u.name).join(', ')}));}
  private opportunityRows():any[]{return(this.monthly?.opportunities||[]).map((o:any)=>({Reference:o.reference,Opportunity:o.title,Client:o.client_name,Unit:o.unit?.name,Product:o.product?.product_name,Stage:o.stage,Deadline:o.expected_close_date,LastUpdate:o.last_update_at}));}
  private monthlyPdfRows():any[]{return[...this.rows().map((r:any)=>({Section:'Unit',Item:r.Unit,Status:`${r.Achievements} achieved / ${r.InProgress} in progress`,Progress:r.AverageProgress,Details:`${r.SupportNeeds} support needs`})),...this.productRows().map((r:any)=>({Section:'Product',Item:r.Product,Status:r.Status,Progress:r.CurrentPhase,Details:`${r.Blockers||''} ${r.SupportNeeds||''}`})),...this.opportunityRows().map((r:any)=>({Section:'Opportunity',Item:r.Opportunity,Status:r.Stage,Progress:r.Deadline,Details:`${r.Client} / ${r.Unit||''}`}))];}
  private rows():any[]{if(this.tab==='monthly')return(this.monthly?.units||[]).map((u:any)=>({Unit:u.unit.name,Tasks:u.tasks_total,Achievements:u.achievements.length,InProgress:u.in_progress,NotDone:u.not_done,AverageProgress:u.average_progress+'%',SupportNeeds:u.support_needs.length}));if(this.tab==='quarterly')return(this.quarterly?.kpis||[]).map((k:any)=>({KPI:k.name,Target:k.target,Actual:k.actual,Unit:k.unit_label,Attainment:k.attainment===null?'-':k.attainment+'%',Start:k.period_start,End:k.period_end}));return(this.social?.metrics||[]).map((m:any)=>({Platform:m.platform,Followers:m.followers,Posts:m.posts,Engagement:m.engagement,Start:m.period_start,End:m.period_end}));}
}
