import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BmsApiService } from './bms-api.service';
import { BmsLanguageService } from './bms-language.service';
@Component({ selector:'app-bms-shell', templateUrl:'./bms-shell.component.html', styleUrls:['./bms-shared.scss'] })
export class BmsShellComponent implements OnInit,OnDestroy {
  direction:'ltr'|'rtl' = this.lang.direction;alerts:any[]=[];notifications:any[]=[];showAlerts=false;lookups:any={can:[]};
  private subscription = this.lang.language$.subscribe(() => { this.direction = this.lang.direction; document.documentElement.dir = this.direction; });
  constructor(public lang: BmsLanguageService,private api:BmsApiService) {}
  ngOnInit():void{this.api.get<any>('lookups').subscribe({next:data=>{this.lookups=data;if((data.can||[]).includes('opportunities.view'))this.loadAlerts();this.loadNotifications();},error:()=>{}});}
  can(ability:string):boolean{return(this.lookups.can||[]).includes(ability);}
  loadAlerts():void{this.api.get<any[]>('alerts').subscribe({next:data=>this.alerts=data,error:()=>{}});}
  loadNotifications():void{this.api.get<any>('notifications').subscribe({next:data=>this.notifications=data.data||[],error:()=>{}});}
  readNotification(notification:any):void{this.api.put(`notifications/${notification.id}/read`,{}).subscribe({next:()=>{this.notifications=this.notifications.filter(item=>item.id!==notification.id);},error:()=>{}});}
  read(alert:any):void{this.api.put(`alerts/${alert.id}/read`,{}).subscribe({next:()=>{this.alerts=this.alerts.filter(a=>a.id!==alert.id);},error:()=>{}});}
  ngOnDestroy(): void { this.subscription.unsubscribe(); document.documentElement.dir = 'ltr'; }
}
