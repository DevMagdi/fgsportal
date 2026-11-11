import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';

@Component({selector:'app-bms-opportunities',templateUrl:'./opportunities.component.html',styleUrls:['../bms-shared.scss']})
export class OpportunitiesComponent extends BmsBaseComponent implements OnInit {
  items:any[]=[];editing:any=null;form:FormGroup;decisionForm:FormGroup;importResult:any=null;alert='';
  constructor(api:BmsApiService,lang:BmsLanguageService,private fb:FormBuilder,private exporter:BmsExportService){super(api,lang);
    this.form=fb.group({reference:[''],title:['',Validators.required],client_name:['',Validators.required],type:['opportunity'],business_unit_id:[''],product_id:[''],owner_id:[''],stage:['qualification'],value:[null],currency:['EGP'],submission_date:[''],expected_close_date:[''],stage_note:['']});
    this.decisionForm=fb.group({decision:['go',Validators.required],reason:['',[Validators.required,Validators.minLength(3)]]});
  }
  ngOnInit():void{super.ngOnInit();this.load();}
  load():void{this.loading=true;this.api.get<any[]>('opportunities',{alert:this.alert}).subscribe({next:data=>{this.items=data;this.loading=false;},error:e=>this.showError(e)});}
  edit(item:any):void{this.editing=item;this.form.patchValue({...item,business_unit_id:item.business_unit_id||'',product_id:item.product_id||'',owner_id:item.owner_id||'',submission_date:item.submission_date?String(item.submission_date).slice(0,10):'',expected_close_date:item.expected_close_date?String(item.expected_close_date).slice(0,10):''});this.decisionForm.reset({decision:item.go_no_go==='no_go'?'no_go':'go',reason:''});window.scrollTo({top:0,behavior:'smooth'});}
  reset():void{this.editing=null;this.form.reset({reference:'',title:'',client_name:'',type:'opportunity',business_unit_id:'',product_id:'',owner_id:'',stage:'qualification',value:null,currency:'EGP',submission_date:'',expected_close_date:'',stage_note:''});}
  save():void{if(this.form.invalid){this.form.markAllAsTouched();return;}const v=this.form.value;['business_unit_id','product_id','owner_id','submission_date','expected_close_date','reference'].forEach(k=>v[k]=v[k]||null);this.loading=true;(this.editing?this.api.put(`opportunities/${this.editing.id}`,v):this.api.post('opportunities',v)).subscribe({next:()=>{this.saved();this.reset();this.load();},error:e=>this.showError(e)});}
  decide():void{if(this.decisionForm.invalid){this.decisionForm.markAllAsTouched();return;}this.api.post(`opportunities/${this.editing.id}/decision`,this.decisionForm.value).subscribe({next:()=>{this.saved();this.reset();this.load();},error:e=>this.showError(e)});}
  importExcel(event:any):void{const file=event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const book=XLSX.read(reader.result,{type:'array',cellDates:true});const sheet=book.Sheets[book.SheetNames[0]];const rows=XLSX.utils.sheet_to_json(sheet,{defval:''}).map((row:any)=>{Object.keys(row).forEach(k=>{if(row[k]instanceof Date)row[k]=row[k].toISOString().slice(0,10);});return row;});this.api.post<any>('opportunities/import',{rows}).subscribe({next:data=>{this.importResult=data;this.saved();this.load();},error:e=>this.showError(e)});}catch(e){this.showError(e);}event.target.value='';};reader.readAsArrayBuffer(file);}
  rows():any[]{return this.items.map(o=>({Reference:o.reference,Title:o.title,Client:o.client_name,Type:o.type,Unit:o.unit?.name,Product:o.product?.product_name,Stage:o.stage,Decision:o.go_no_go,Reason:o.decision_reason,Delayed:o.is_delayed?'Yes':'No',NoUpdate:o.has_no_update?'Yes':'No',LastUpdate:o.last_update_at}));}
  excel():void{this.exporter.excel([{name:'Opportunities',rows:this.rows()}],'opportunities-tenders');}
  pdf():void{this.exporter.pdf('Opportunities & Tenders',this.rows(),'opportunities-tenders');}
}
