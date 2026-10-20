import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountRoles, Department, User } from 'src/app/interfaces/user';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-salaries',
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.scss']
})
export class SalariesComponent implements OnInit {
  currentUser:User;
  showForHr:boolean = false;
  showForFinance:boolean = false;
  DepartmentEnum = Department;
  userPerms:UserPermissions[] = [];
  hasPermTOShowSalaries:boolean = false

  salarySession:number = 60000;
  sessionCounter:number = 30;
  sessionInterval;
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private router:Router) { }

  ngOnInit(): void {
    this.startRedirectCounter();
    this._auth.user.subscribe(user=>{
      this.currentUser = user;

      if(this.currentUser.department == Department.MANAGEMENT){
        
      }else{
        this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
          if(perms['status'] == ResStatus.CRUD){
            this.userPerms = perms['data'];
            const ticketPerFound =  this.userPerms.find(p=>p.permission_id == 1)
            if(!!ticketPerFound){
              this.hasPermTOShowSalaries = true;
              if(this.currentUser.accRole == AccountRoles.FINANCE){
                this.showForFinance = true;
                this.showForHr = false;
              }else if(this.currentUser.accRole == AccountRoles.HUMAN_RESOURCE){
                this.showForFinance = false;
                this.showForHr = true;
              }
            }else{
              this.hasPermTOShowSalaries = false;
              console.log('Access Denied');
              this._db.createSystemLogs(
                `${user.username} Tried To Access Salaries Page At ${new Date().toLocaleString()}`,
                `${user.key} Tried To Access Salaries Page At ${new Date().toLocaleString()}`,
                user.key,
                user.username,
                'Faild'
              ).subscribe(res=>{
                this.router.navigate(['/']) 
              })
            }
          }else{
            this.userPerms = []
            this.hasPermTOShowSalaries = false;

            console.log('Access Denied');
            this._db.createSystemLogs(
              `${user.username} Tried To Access Salaries Page At ${new Date().toLocaleString()}`,
              `${user.key} Tried To Access Salaries Page At ${new Date().toLocaleString()}`,
              user.key,
              user.username,
              'Faild'
            ).subscribe(res=>{
              this.router.navigate(['/']) 
            })
          }
        },err=>{
          console.log(err);
          this.userPerms = []
          this.hasPermTOShowSalaries = false;
          console.log('Access Denied');
          this._db.createSystemLogs(
            `${user.username} Tried To Access Salaries Page At ${new Date().toLocaleString()}`,
            `${user.key} Tried To Access Salaries Page At ${new Date().toLocaleString()}`,
            user.key,
            user.username,
            'Faild'
          ).subscribe(res=>{
            this.router.navigate(['/']) 
          })
        })
      }
      
      
    })
    // this.auth.user.subscribe(user=>{
    //   this.currentUser = user;
    //   if(user.key == 'jjuyajnYK6clqnD7PIMEuQesyiy2' || user.key == 'XzPuQE1WyOeTvu30KUkTwQqLcYa2' || user.key == '76CzIqtHHGNqPTcxUwC5IYTPAAC3' || user.key == 'eC325vPgT2SsY2QaAYhrCMFoUBH3' || user.key == 'LkbxN2PlvbPh4Jq53dULfQ1AGEr2' || user.key == 'AYBjDkidDOgFiGfB585Fl4HZ2up1' ||user.key == 'RYART21ZBRTC4GWxFVrqmjwdqKZ2'){
    //     console.log('Access Granted');
    //     if(user.key == 'XzPuQE1WyOeTvu30KUkTwQqLcYa2' || user.key == 'eC325vPgT2SsY2QaAYhrCMFoUBH3' || user.key == 'LkbxN2PlvbPh4Jq53dULfQ1AGEr2'){
    //       this.showForHr = true;
    //       this.showForFinance = false;
    //     }else if(user.key == 'RYART21ZBRTC4GWxFVrqmjwdqKZ2' || user.key == 'eC325vPgT2SsY2QaAYhrCMFoUBH3'  || user.key == 'AYBjDkidDOgFiGfB585Fl4HZ2up1'){
    //       this.showForFinance = true;
    //       this.showForHr = false;
    //     }
    //   }else{
    //     console.log('Access Denied');
    //     this.db.createSystemLog(
    //       `${user.username} Tried To Access Salaries Page At ${new Date().toLocaleString()}`,
    //       `${user.key} Tried To Access Salaries Page At ${new Date().toLocaleString()}`,
    //       user.key,
    //       user.username,
    //       'Success'
    //     ).then(()=>{
    //       this.router.navigate(['/'])          
    //     })
    //   }
    // })
  }



  extendSession(){
    document.getElementById('closeForm')?.click();
    clearInterval(this.sessionInterval)
    this.sessionCounter = 10;
    this.startRedirectCounter();
  }
  endSession(){
    document.getElementById('closeForm')?.click();
    window.location.reload();
  }

  checkIfRedirect(){    
    document.getElementById('showsalarysessionmodal')?.click();
    this.sessionInterval = setInterval(() => {
      if(this.sessionCounter > 0){
        this.sessionCounter--
      }else{
        window.location.reload();
      }
    }, 1000);
  }

  startRedirectCounter(){
    setTimeout(() => {
      this.checkIfRedirect()
    }, this.salarySession);
  }


}
