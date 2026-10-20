import { Component, OnInit } from '@angular/core';
import { ActivityTypes, CloseLeadSubStatus, LeadsAndContacts } from 'src/app/interfaces/leadsAndContacts';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Table } from 'primeng/table';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';

@Component({
  selector: 'app-closed-leads',
  templateUrl: './closed-leads.component.html',
  styleUrls: ['./closed-leads.component.scss']
})
export class ClosedLeadsComponent implements OnInit {
  currentUser:User;
  myContacts:LeadsAndContacts[] = [];
  closedLeadsLoader:boolean = false;
  CloseLeadSubStatusEnum = CloseLeadSubStatus;
  ActivityTypesEnum = ActivityTypes;
  constructor(private _db:DatabaseService,
              private _auth:AuthApiService,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      this.getMyContacts();
    })
  }

  getMyContacts(){
    this.closedLeadsLoader = true;
    this._db.getClosedContactLead().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.myContacts = res['data'] 
        this.myContacts.forEach(a => a.next_action_date = new Date(a.next_action_date?a.next_action_date:new Date()));
        this.closedLeadsLoader = false;
      }else{
        this.myContacts = [];
        this.closedLeadsLoader = false;
      }
    },err=>{
      console.log(err);
      this.closedLeadsLoader = false;
      this.myContacts = [];
    })    
  }

  reopen(contact:LeadsAndContacts){
    this.closedLeadsLoader = true;
    let editParams:{[k:string]:any } = {}
    editParams.lead_sub_status_id = contact.prev_lead_sub_status_id;
    this._db.updateContactLead(contact.id || '', editParams).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.getMyContacts();
        this.closedLeadsLoader = false;
      }else{
        this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`,SnackBarState.Warning, 5000)
        this.closedLeadsLoader = false;
      }
    },err=>{
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`,SnackBarState.Error, 5000)
      this.closedLeadsLoader = false;

    })
  }


  clear(table: Table) {
    table.clear();
  }
}
