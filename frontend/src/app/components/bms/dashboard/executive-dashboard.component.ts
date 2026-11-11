import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';

@Component({ selector:'app-executive-dashboard', templateUrl:'./executive-dashboard.component.html', styleUrls:['../bms-shared.scss'] })
export class ExecutiveDashboardComponent extends BmsBaseComponent implements OnInit {
  data: any = { summary:{}, tenders:{}, unit_progress:[], opportunities:[], products:[] };
  filters: FormGroup;
  constructor(api:BmsApiService, lang:BmsLanguageService, private fb:FormBuilder, private exporter:BmsExportService) {
    super(api,lang);
    this.filters = fb.group({ business_unit_id:[''], product_id:[''], opportunity_id:[''], week_start:[''] });
  }
  ngOnInit(): void { super.ngOnInit(); this.load(); this.api.get<any[]>('opportunities').subscribe(data => this.lookups.opportunities = data); }
  load(): void { this.loading=true; this.error=''; this.api.get<any>('executive-dashboard',this.filters.value).subscribe({ next:data=>{this.data=data;this.loading=false;},error:error=>this.showError(error) }); }
  opportunityRows(): any[] { return (this.data.opportunities||[]).map((o:any)=>({Reference:o.reference,Title:o.title,Client:o.client_name,Unit:o.unit?.name,Product:o.product?.product_name,Stage:o.stage,Decision:o.go_no_go,Delayed:o.is_delayed?'Yes':'No',NoUpdate:o.has_no_update?'Yes':'No',Submission:o.submission_date})); }
  unitRows(): any[] { return (this.data.unit_progress||[]).map((u:any)=>({Unit:u.name,Director:u.director?.username,Tasks:u.total,Achieved:u.achieved,InProgress:u.in_progress,NotDone:u.not_done,Blocked:u.blocked,Progress:`${u.progress}%`})); }
  productRows(): any[] { return (this.data.products||[]).map((p:any)=>({Product:p.product_name,Units:(p.business_units||[]).map((u:any)=>u.name).join(', '),CurrentPhase:p.current_phase?.name,Status:p.current_phase?.status,Blockers:p.current_phase?.blockers,DataNeeds:p.current_phase?.data_needs,SupportNeeds:p.current_phase?.support_needs})); }
  excel(): void { this.exporter.excel([{name:'Units',rows:this.unitRows()},{name:'Opportunities',rows:this.opportunityRows()},{name:'Products',rows:this.productRows()}],`executive-dashboard-${new Date().toISOString().slice(0,10)}`); }
  pdf(): void { this.exporter.pdf('Alphaiota - Unified Executive Dashboard',[...this.unitRows(),...this.opportunityRows(),...this.productRows()],`executive-dashboard-${new Date().toISOString().slice(0,10)}`); }
}
