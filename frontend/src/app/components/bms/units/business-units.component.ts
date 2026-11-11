import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsLanguageService } from '../bms-language.service';

@Component({selector:'app-business-units',templateUrl:'./business-units.component.html',styleUrls:['../bms-shared.scss']})
export class BusinessUnitsComponent extends BmsBaseComponent implements OnInit {
  units:any[]=[]; editing:any=null; form:FormGroup; roleForm:FormGroup;
  constructor(api:BmsApiService,lang:BmsLanguageService,private fb:FormBuilder){super(api,lang);this.form=fb.group({name:['',Validators.required],parent_id:[''],description:[''],servicesText:[''],director_id:[''],user_ids:[[]],is_active:[true]});this.roleForm=fb.group({user_id:['',Validators.required],role_id:['',Validators.required],business_unit_id:['']});}
  ngOnInit():void{super.ngOnInit();this.load();}
  load():void{this.loading=true;this.api.get<any[]>('units').subscribe({next:data=>{this.units=data;this.loading=false;},error:e=>this.showError(e)});}
  edit(unit:any):void{this.editing=unit;this.form.patchValue({...unit,servicesText:(unit.services||[]).join(', '),parent_id:unit.parent_id||'',director_id:unit.director_id||'',user_ids:(unit.users||[]).map((u:any)=>u.id)});window.scrollTo({top:0,behavior:'smooth'});}
  reset():void{this.editing=null;this.form.reset({name:'',parent_id:'',description:'',servicesText:'',director_id:'',user_ids:[],is_active:true});}
  save():void{if(this.form.invalid){this.form.markAllAsTouched();return;}const value=this.form.value;const body={...value,parent_id:value.parent_id||null,director_id:value.director_id||null,services:value.servicesText.split(',').map((v:string)=>v.trim()).filter((v:string)=>v)};delete body.servicesText;this.loading=true;const request=this.editing?this.api.put(`units/${this.editing.id}`,body):this.api.post('units',body);request.subscribe({next:()=>{this.saved();this.reset();this.load();},error:e=>this.showError(e)});}
  remove(unit:any):void{if(!confirm(this.lang.t('confirmDelete')))return;this.api.delete(`units/${unit.id}`).subscribe({next:()=>{this.saved();this.load();},error:e=>this.showError(e)});}
  assignRole():void{if(this.roleForm.invalid){this.roleForm.markAllAsTouched();return;}const value=this.roleForm.value;value.business_unit_id=value.business_unit_id||null;this.api.post('roles/assign',value).subscribe({next:()=>{this.saved('Role assigned successfully');this.roleForm.reset({user_id:'',role_id:'',business_unit_id:''});},error:e=>this.showError(e)});}
}
