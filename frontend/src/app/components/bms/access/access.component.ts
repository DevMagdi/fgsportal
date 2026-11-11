import { Component, OnInit } from '@angular/core';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsLanguageService } from '../bms-language.service';
import { BmsExportService } from '../bms-export.service';
@Component({selector:'app-bms-access',templateUrl:'./access.component.html',styleUrls:['../bms-shared.scss']})
export class AccessComponent extends BmsBaseComponent implements OnInit {
  assignment:any={user_id:'',role_id:'',business_unit_id:''};
  constructor(api:BmsApiService,lang:BmsLanguageService,private exporter:BmsExportService){super(api,lang);}
  rows():any[]{return(this.lookups.roles||[]).map((r:any)=>({Role:r.name,Slug:r.slug,Permissions:(r.abilities||[]).join(', ')}));}
  excel():void{this.exporter.excel([{name:'BMS roles',rows:this.rows()}],'bms-role-matrix');}
  pdf():void{this.exporter.pdf(this.lang.t('roleMatrix'),this.rows(),'bms-role-matrix');}
  assign():void{if(!this.assignment.user_id||!this.assignment.role_id)return;this.api.post('roles/assign',this.assignment).subscribe({next:()=>this.saved(),error:e=>this.showError(e)});}
  revoke():void{if(!this.assignment.user_id||!this.assignment.role_id)return;this.api.post('roles/revoke',this.assignment).subscribe({next:()=>this.saved(),error:e=>this.showError(e)});}
}
