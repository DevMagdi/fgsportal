import { Component, OnInit } from '@angular/core';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';
@Component({selector:'app-bms-meetings',templateUrl:'./meetings.component.html',styleUrls:['../bms-shared.scss']})
export class MeetingsComponent extends BmsBaseComponent implements OnInit {
  meetings:any[]=[];selected:any=null;availability:any[]=[];external={name:'',email:''};search='';from='';to='';
  form:any={title:'',business_unit_id:'',starts_at:'',ends_at:'',meeting_type:'internal',location:'',user_ids:[],external:[]};
  minutes:any={discussion:'',decisions:'',actionsText:'',linked_type:'',linked_id:''};
  constructor(api:BmsApiService,lang:BmsLanguageService,private exporter:BmsExportService){super(api,lang);}
  ngOnInit():void{super.ngOnInit();this.load();}
  load():void{this.loading=true;this.api.get<any[]>('meetings',{search:this.search,from:this.from,to:this.to}).subscribe({next:data=>{this.meetings=data;this.selected=this.selected?data.find(m=>m.id===this.selected.id)||null:null;this.loading=false;},error:e=>this.showError(e)});}
  checkAvailability():void{if(!this.form.starts_at||!this.form.ends_at||!this.form.user_ids.length)return;this.api.post<any[]>('meetings/availability',{starts_at:this.form.starts_at,ends_at:this.form.ends_at,user_ids:this.form.user_ids}).subscribe({next:data=>this.availability=data,error:e=>this.showError(e)});}
  addExternal():void{if(!this.external.name||!this.external.email)return;this.form.external.push({external_name:this.external.name,external_email:this.external.email});this.external={name:'',email:''};}
  create():void{if(!this.form.title||!this.form.starts_at||!this.form.ends_at)return;const body={...this.form,attendees:[...this.form.user_ids.map((id:any)=>({user_id:Number(id)})),...this.form.external]};delete body.user_ids;delete body.external;this.api.post<any>('meetings',body).subscribe({next:meeting=>{this.saved();this.selected=meeting;this.form={title:'',business_unit_id:'',starts_at:'',ends_at:'',meeting_type:'internal',location:'',user_ids:[],external:[]};this.availability=[];this.load();},error:e=>this.showError(e)});}
  select(meeting:any):void{this.selected=meeting;const m=meeting.minutes;this.minutes={discussion:m?.discussion||'',decisions:m?.decisions||'',actionsText:(m?.actions||[]).map((a:any)=>a.title).join('\n'),linked_type:m?.linked_type||'',linked_id:m?.linked_id||''};}
  invite():void{this.api.post<any>(`meetings/${this.selected.id}/invite`).subscribe({next:data=>{this.selected=data;this.saved();this.load();},error:e=>this.showError(e)});}
  respond(attendee:any,response:string):void{this.api.put(`meeting-attendees/${attendee.id}/response`,{response}).subscribe({next:()=>{attendee.response=response;this.saved();},error:e=>this.showError(e)});}
  saveMinutes():void{if(!this.minutes.discussion)return;const body={...this.minutes,actions:this.minutes.actionsText.split('\n').map((title:string)=>title.trim()).filter(Boolean).map((title:string)=>({title})),linked_id:this.minutes.linked_id||null,linked_type:this.minutes.linked_type||null};delete body.actionsText;this.api.post<any>(`meetings/${this.selected.id}/minutes`,body).subscribe({next:data=>{this.selected=data;this.saved();this.load();},error:e=>this.showError(e)});}
  linkedRecords():any[]{return this.lookups[this.minutes.linked_type==='opportunity'?'opportunities':this.minutes.linked_type==='lead'?'leads':this.minutes.linked_type==='unit'?'units':'products']||[];}
  linkedName(item:any):string{return item.name||item.title||item.product_name||item.reference;}
  exportExcel():void{this.exporter.excel([{name:'Meetings',rows:this.rows()}],`bms-meetings`);}
  exportPdf():void{this.exporter.pdf(this.lang.t('meetings'),this.rows(),'bms-meetings');}
  private rows():any[]{return this.meetings.map(m=>({Title:m.title,Unit:m.unit?.name,Start:m.starts_at,End:m.ends_at,Type:m.meeting_type,Status:m.status,Attendees:(m.attendees||[]).map((a:any)=>a.user?.username||a.external_name).join(', '),Minutes:m.minutes?'Yes':'No'}));}
}
