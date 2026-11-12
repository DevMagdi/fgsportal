import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsLanguageService } from '../bms-language.service';
import { BmsExportService } from '../bms-export.service';
import { BmsConfirmService } from '../bms-confirm.service';

@Component({selector:'app-business-units',templateUrl:'./business-units.component.html',styleUrls:['../bms-shared.scss']})
export class BusinessUnitsComponent extends BmsBaseComponent implements OnInit {
  units:any[]=[]; editing:any=null; form:FormGroup;
  constructor(api:BmsApiService,lang:BmsLanguageService,private fb:FormBuilder,private exporter:BmsExportService,private confirmDialog:BmsConfirmService){super(api,lang);this.form=fb.group({name:['',Validators.required],parent_id:[''],description:[''],key_messages:[''],servicesText:[''],director_id:[''],user_ids:[[]],is_active:[true]});}
  ngOnInit():void{super.ngOnInit();this.load();}
  load():void{this.loading=true;this.api.get<any[]>('units').subscribe({next:data=>{this.units=data;this.loading=false;},error:e=>this.showError(e)});}
  edit(unit:any):void{this.editing=unit;this.form.patchValue({...unit,servicesText:(unit.services||[]).join(', '),parent_id:unit.parent_id||'',director_id:unit.director_id||'',user_ids:(unit.users||[]).map((u:any)=>u.id)});window.scrollTo({top:0,behavior:'smooth'});}
  reset():void{this.editing=null;this.form.reset({name:'',parent_id:'',description:'',servicesText:'',director_id:'',user_ids:[],is_active:true});}
  save():void{if(this.form.invalid){this.form.markAllAsTouched();return;}const value=this.form.value;const body={...value,parent_id:value.parent_id||null,director_id:value.director_id||null,services:value.servicesText.split(',').map((v:string)=>v.trim()).filter((v:string)=>v)};delete body.servicesText;this.loading=true;const request=this.editing?this.api.put(`units/${this.editing.id}`,body):this.api.post('units',body);request.subscribe({next:()=>{this.saved();this.reset();this.load();},error:e=>this.showError(e)});}
  rows():any[]{return this.units.map(u=>({Name:u.name,Parent:u.parent?.name,Director:this.name(u.director),Members:(u.users||[]).map((m:any)=>this.name(m)).join(', '),Services:(u.services||[]).join(', '),Description:u.description,KeyMessages:u.key_messages,Active:u.is_active?'Yes':'No'}));}
  excel():void{this.exporter.excel([{name:'Business units',rows:this.rows()}],'bms-business-units');}
  pdf():void{this.exporter.pdf(this.lang.t('units'),this.rows(),'bms-business-units');}
  toggleStatus(unit:any):void{
    this.api.post(`units/${unit.id}/status`,{is_active:!unit.is_active}).subscribe({next:()=>{this.saved();this.load();},error:e=>this.showError(e)});
  }
  remove(unit:any):void{this.confirmDialog.confirm(this.lang.t('confirmDelete'),{title:this.lang.t('delete'),confirmLabel:this.lang.t('delete'),destructive:true}).subscribe(confirmed=>{if(!confirmed)return;this.api.delete(`units/${unit.id}`).subscribe({next:()=>{this.saved();this.load();},error:e=>this.showError(e)});});}
}
