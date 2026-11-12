import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';

@Component({selector:'app-product-tracking',templateUrl:'./product-tracking.component.html',styleUrls:['../bms-shared.scss']})
export class ProductTrackingComponent extends BmsBaseComponent implements OnInit {
  products:any[]=[];productForm:FormGroup;phaseForm:FormGroup;phaseProduct:any=null;
  constructor(api:BmsApiService,lang:BmsLanguageService,private fb:FormBuilder,private exporter:BmsExportService){super(api,lang);this.productForm=fb.group({product_name:['',Validators.required],description:[''],owner_id:[''],business_unit_ids:[[],Validators.required]});this.phaseForm=fb.group({name:['',Validators.required],sequence:[1,[Validators.required,Validators.min(1)]],status:['not_started'],blockers:[''],data_needs:[''],support_needs:[''],start_date:[''],end_date:['']});}
  ngOnInit():void{super.ngOnInit();this.load();}
  load():void{this.loading=true;this.api.get<any[]>('products').subscribe({next:data=>{this.products=data;this.loading=false;},error:e=>this.showError(e)});}
  addProduct():void{if(this.productForm.invalid){this.productForm.markAllAsTouched();return;}this.api.post('products',this.productForm.value).subscribe({next:()=>{this.saved();this.productForm.reset({product_name:'',description:'',owner_id:'',business_unit_ids:[]});this.load();},error:e=>this.showError(e)});}
  saveUnits(product:any):void{this.api.put(`products/${product.id}`,{business_unit_ids:(product.business_units||[]).map((u:any)=>u.id)}).subscribe({next:()=>{this.saved();this.load();},error:e=>this.showError(e)});}
  hasUnit(product:any,unitId:number):boolean{return (product.business_units||[]).some((unit:any)=>unit.id===unitId);}
  unitChange(product:any,event:any):void{const ids=Array.from(event.target.selectedOptions).map((option:any)=>Number(option.value));this.api.put(`products/${product.id}`,{business_unit_ids:ids}).subscribe({next:()=>{this.saved();this.load();},error:e=>this.showError(e)});}
  movePhase(product:any,index:number,direction:number):void{
    const phases=[...(product.phases||[])];
    const target=index+direction;
    if(target<0||target>=phases.length)return;
    const ordered=[...phases];
    const [moved]=ordered.splice(index,1);
    ordered.splice(target,0,moved);
    this.api.post(`products/${product.id}/phases/reorder`,{phase_ids:ordered.map((phase:any)=>phase.id)}).subscribe({next:()=>{this.saved();this.load();},error:e=>this.showError(e)});
  }
  openPhase(product:any):void{this.phaseProduct=product;this.phaseForm.reset({name:'',sequence:(product.phases?.length||0)+1,status:'not_started',blockers:'',data_needs:'',support_needs:'',start_date:'',end_date:''});}
  addPhase():void{if(this.phaseForm.invalid){this.phaseForm.markAllAsTouched();return;}const value=this.phaseForm.value;value.start_date=value.start_date||null;value.end_date=value.end_date||null;this.api.post(`products/${this.phaseProduct.id}/phases`,value).subscribe({next:()=>{this.saved();this.phaseProduct=null;this.load();},error:e=>this.showError(e)});}
  updatePhase(phase:any):void{this.api.put(`product-phases/${phase.id}`,{name:phase.name,sequence:Number(phase.sequence),status:phase.status,blockers:phase.blockers,data_needs:phase.data_needs,support_needs:phase.support_needs,start_date:phase.start_date,end_date:phase.end_date}).subscribe({next:()=>{this.saved();this.load();},error:e=>this.showError(e)});}
  archive(product:any):void{
    if(!confirm(this.lang.t('archiveProduct')+' — '+product.product_name))return;
    this.api.post(`products/${product.id}/archive`,{}).subscribe({next:()=>{this.saved();this.load();},error:e=>this.showError(e)});
  }
  rows():any[]{const rows:any[]=[];this.products.forEach(p=>(p.phases||[]).forEach((phase:any)=>rows.push({Product:p.product_name,Units:(p.business_units||[]).map((u:any)=>u.name).join(', '),Phase:phase.name,Sequence:phase.sequence,Status:phase.status,Blockers:phase.blockers,DataNeeds:phase.data_needs,SupportNeeds:phase.support_needs})));return rows;}
  excel():void{this.exporter.excel([{name:'Product phases',rows:this.rows()}],'product-tracking');}
  pdf():void{this.exporter.pdf('Product Tracking',this.rows(),'product-tracking');}
}
