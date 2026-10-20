import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ClientTicket, ClientTicketPeriority, ClientTicketStatus } from 'src/app/interfaces/client-ticket';
import { Notifying } from 'src/app/interfaces/notification';
import { Project } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { SUB_TASk } from 'src/app/interfaces/task';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-follow-client-tickets',
  templateUrl: './follow-client-tickets.component.html',
  styleUrls: ['./follow-client-tickets.component.scss']
})
export class FollowClientTicketsComponent implements OnInit {
  currentUser:User;  
  recentClientTickets:ClientTicket[] = [];
  myLimit:number = 5;
  searchKey:string = '';
  userPerms:UserPermissions[] = [];
  hasPermTOFollowTicket:boolean = false;
  getToday = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
  fileName= `${this.getToday}.xlsx`;
  
  data: any;

  options: any;
  openedTickets=0;
  closedTickets=0;
  isLoading=false;
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private router:Router,
              private excelServ:ExportExcelService,) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      if(!!user){
        this.currentUser = user;
        this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
          if(perms['status'] == ResStatus.CRUD){
            this.userPerms = perms['data'];
            const perFound =  this.userPerms.find(p=>p.permission_id == 2)
            if(!!perFound){
              this.hasPermTOFollowTicket = true;
            }else{
              this.hasPermTOFollowTicket = false;
            }
          }else{
            this.userPerms = []
            this.hasPermTOFollowTicket = false;
  
          }
          this.getClientRecentTikets();

        },err=>{
          console.log(err);
          this.userPerms = []
          this.hasPermTOFollowTicket = false;
        })
      }
    })   




  }

  chartData(tickets:ClientTicket[]){
    

    let total=tickets.length;
    this.openedTickets= tickets.filter(x=>x.status == ClientTicketStatus.STARTED).length;
    this.closedTickets= tickets.filter(x=>x.status == ClientTicketStatus.CLOSED).length;
    
    this.data = {
      labels: ['Normal ', 'High' ,'Critical'],
      // labels: ['closed', 'opened'],
      datasets: [
          {
              // data: [(this.closedTickets/total), (this.openedTickets/total)],
              // backgroundColor: [  '#B5179E','#7209B7'],
              // hoverBackgroundColor: [ '#B5179E', '#7209B7'],

              data: [ this.recentClientTickets.filter(t=>t.priority == ClientTicketPeriority.Normal).length, this.recentClientTickets.filter(t=>t.priority == ClientTicketPeriority.High).length , this.recentClientTickets.filter(t=>t.priority == ClientTicketPeriority.Critical).length],
               backgroundColor: [  this.getPriority(ClientTicketPeriority.Normal),this.getPriority(ClientTicketPeriority.High) , this.getPriority(ClientTicketPeriority.Critical)],
               hoverBackgroundColor: [ this.getPriority(ClientTicketPeriority.Normal), this.getPriority(ClientTicketPeriority.High),this.getPriority(ClientTicketPeriority.Critical)],
          }
      ]
  };

  this.options = {
      plugins: {
          legend: {
            position:'bottom' ,
              labels: {
                  usePointStyle: true,
                  
              }
          },
          position:'bottom' , 

      }
  };
  }
  getClientRecentTikets(){
    this.isLoading=true;
    
    if(this.currentUser.department == Department.MANAGEMENT){  
      this._db.getAllTickets().subscribe((tickets)=>{
        this.isLoading=false;
        if(tickets['status'] == ResStatus.CRUD){
          this.recentClientTickets = tickets['data'];
          let openTickets:Boolean = false;
          for(let i in this.recentClientTickets){
            if(this.recentClientTickets[i].status == ClientTicketStatus.STARTED){
              openTickets = true;
              break;
            }
          }
          if(openTickets == true){
            this.recentClientTickets = this.recentClientTickets.sort((a,b)=>{
              return compare(a.status, b.status, true);
            })
          }else{
            this.recentClientTickets = this.recentClientTickets.reverse()
          }
          this.chartData(this.recentClientTickets);
        }
      })    
    }else if(this.currentUser.department == Department.TECHNICAL_TEAM){
      this._db.getMyTickets().subscribe((tickets)=>{
        
        this.isLoading=false;
        if(tickets['status'] == ResStatus.CRUD){
          this.recentClientTickets = tickets['data'];
          let openTickets:Boolean = false;
          for(let i in this.recentClientTickets){
            if(this.recentClientTickets[i].status == ClientTicketStatus.STARTED){
              openTickets = true;
              break;
            }
          }
          
          if(openTickets == true){
            this.recentClientTickets = this.recentClientTickets.sort((a,b)=>{
              return compare(a.status, b.status, true);
            })
          }else{            
            this.recentClientTickets = this.recentClientTickets.reverse()
          }
          this.chartData(this.recentClientTickets);
        }
      }) 
    }
    else if(this.currentUser.department == Department.ADMINSTRATION && (!!this.userPerms && !!this.hasPermTOFollowTicket)){
      this._db.getAllTickets().subscribe((tickets)=>{
        this.isLoading=false;
        if(tickets['status'] == ResStatus.CRUD){
          this.recentClientTickets = tickets['data'];
          let openTickets:Boolean = false;
          for(let i in this.recentClientTickets){
            if(this.recentClientTickets[i].status == ClientTicketStatus.STARTED){
              openTickets = true;
              break;
            }
          }
          
          if(openTickets == true){
            this.recentClientTickets = this.recentClientTickets.sort((a,b)=>{
              return compare(a.status, b.status, true);
            })
          }else{            
            this.recentClientTickets = this.recentClientTickets.reverse()
          }
          this.chartData(this.recentClientTickets);
        }
      }) 
   

    }
    else{
    this.isLoading=true;

    this.router.navigate(['/'])
    }
    
  }

  loadMore(){
    this.myLimit += 5;
    this.getClientRecentTikets();
  }

  getTime(dateString) {
    const timestampPositive = Date.parse(dateString)
    return moment(moment.unix(timestampPositive  / 1000)).startOf('minute').fromNow();
  }
  
  getStatusBg(status: ClientTicketStatus){
    if(status == ClientTicketStatus.STARTED){
      return '#E3FCEF'
    }else if(status == ClientTicketStatus.CLOSED){
      return '#FFEBE6'
    }else{
      return '#000'
    }
  }
  getStatusCl(status: ClientTicketStatus){
    if(status == ClientTicketStatus.STARTED){
      return '#008464'
    }else if(status == ClientTicketStatus.CLOSED){
      return '#BC0000'
    }else{
      return '#000'
    }
  }
  getPriority(priority: ClientTicketPeriority){
    if(priority == ClientTicketPeriority.Normal){
      return '#36B37E'
    }else if(priority == ClientTicketPeriority.High){
      return '#513982'
    }else if(priority == ClientTicketPeriority.Critical){
      return '#CC1C52'
    }else{
      return '#CC1C52'
    }
  }

  sortData(sort: Sort) {
    const data = this.recentClientTickets.slice();
    if (!sort.active || sort.direction === '') {
      this.recentClientTickets = data;
      return;
    }

    this.recentClientTickets = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'clientName': return compare(a.clientName, b.clientName, isAsc);
        case 'status': return compare(a.status ?a.status : '' , b.status ? b.status : '' , isAsc);
        case 'projectTitle': return compare(a.projectName ? a.projectName : '' , b.projectName ? b.projectName : '', isAsc);
        case 'lastReplied': return compare(this.getTime(a.createdAt) ? this.getTime(a.createdAt) : '', this.getTime(b.createdAt) ? this.getTime(b.createdAt) : '', isAsc);
        default: return 0;
      }
    });
  }

  // searchTicket(){
  //   if(!!this.searchKey && this.searchKey.length > 0){
  //     this._db.getRecentTickets(0).subscribe(tickets=>{
  //       this.recentTickets =  tickets.filter(ticket=> ticket.projectName.toLowerCase().includes(this.searchKey.toLowerCase()))
  //     })  
  //   }else{
  //     this.getRecentTikets();
  //   }
  // }

  exportTicketsDataReport():void{
    let element = document.getElementById('ticketsDataReport'); 
    this.excelServ.exportexcel(element , `Tickets Data Report ${this.fileName}`)
    
  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}