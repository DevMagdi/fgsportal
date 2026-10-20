import { Time } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationStatus, Notifying } from 'src/app/interfaces/notification';
import { AccountPositions, AccountRoles, AccountType, Client, Department, OpenToWork, User, UserNavParams } from 'src/app/interfaces/user';
import { MessagingService } from 'src/app/services/messaging.service';
import * as moment from 'moment'
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Announcement } from 'src/app/interfaces/announcement';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { ModuleService } from 'src/app/services/module.service';
import { environment } from 'src/environments/environment';
import { ResStatus } from 'src/app/interfaces/res-status';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from '../snackbar/snackbar.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private userSub: Subscription;
  navLoading:boolean = false;

  isLoggedIn:boolean = false;
  username:string;
  currentUserKey:string;
  isManager:boolean = false;
  isAdmin:boolean = false;
  date:any;
  // time:Time;
  myNotifications:Notifying[]=[];
  // lastNotificationCount:number = 0 ;
  displayAnnounce:boolean = false;
  runningAnnounces:Announcement[]= [];
  announceToDisplay:Announcement;

  currentUser:User;

  currentClient:Client;
  
  userPerms:UserPermissions[] = [];
  DepartmentEnum = Department;
  AccountRolesEnum = AccountRoles;
  AccountPositionEnum = AccountPositions;
  AccountTypeEnum = AccountType;
  drawerClose=false;

  totalReports=0
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );
  drawer:boolean = true;

  newServerApi = environment.newServerApi;
  hasPermTOFollowTicket:boolean = false;
  hasPermTOShowSalaries:boolean = false;
  myNavParams:UserNavParams;
  totalAdminCounter:number = 0;
  totalManageCounter:number = 0;
  totalRequestsCounter:number = 0;
  totalCRMReqsCounter:number = 0;
  hrCounter:number = 0;
  pmOpened:boolean = false;
  SupportOpened:boolean = false;
  adminOpened:boolean = false;
  crmOpened:boolean = false;
  iconSideBarVisible:boolean = false;
  requestsOpened:boolean = false;
  financeOpened:boolean = false;
  hrOpened:boolean = false;
  
  myOpenToWork:OpenToWork[]=[];
  myOpenToWorkLoading:boolean = false;
  newOpenToWorkForm:FormGroup = new FormGroup({
    'from':new FormControl(null,Validators.required),
    'to':new FormControl(null,Validators.required),
  })
  constructor(private _auth:AuthApiService,
              private router:Router,
              private _db:DatabaseService,
              private _notify:NotificationService,
              private message:MessagingService,
              private changeDetectorRef: ChangeDetectorRef,
              private breakpointObserver: BreakpointObserver,
              private moduleService: ModuleService,
              ) {}

  /** Whether a sellable module is enabled for the current user's company. */
  isModuleEnabled(slug: string): boolean {
    return this.moduleService.isModuleEnabled(slug);
  }

  ngOnInit(): void {
  //  this.date =  this.db.gettime()
  //  console.log(this.date.time);
  this.onResize()
   
    // setInterval(() => {
    //   this.date = new Date(); 
    // }, 1000);

    this.userSub = this._auth.user.subscribe(
      (data)=>{      
        if(!!data){
          this.isLoggedIn = true;
          this.currentUser = data;
          this.username = this.currentUser.username;
          this.currentUserKey = this.currentUser.key ||'';
          this._auth.getCurrentLoggedInUser()?.subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.currentUser = res['data'];
            }else if(res['status'] == ResStatus.Forbidden && res['message'] == 'Token is Expired'){
              this._notify.openSnackbar("Session Expired , Please Relogin" , SnackBarState.Warning)
              this.logout();
            }
          },err=>{
            console.log(err);
            if(err['error']['status'] == ResStatus.Forbidden && err['error']['message'] == 'Token is Expired'){
              this._notify.openSnackbar("Session Expired , Please Relogin" , SnackBarState.Warning)
              this.logout();
            }
          }) 

          if(!localStorage.getItem('userData')){
            window.location.reload()
          }
          this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
            console.log(perms['status'] == ResStatus.Forbidden);
            console.log(perms['message'] == 'Token is Expired');
            
            if(perms['status'] == ResStatus.CRUD){
              this.userPerms = perms['data'];
              const perFound =  this.userPerms.find(p=>p.permission_id == 2)
              if(!!perFound){
                this.hasPermTOFollowTicket = true;
              }else{
                this.hasPermTOFollowTicket = false;
              }

              
              const salPerFound =  this.userPerms.find(p=>p.permission_id == 1)
              if(!!salPerFound){
                this.hasPermTOShowSalaries = true;
              }else{
                this.hasPermTOShowSalaries = false;
              }

            }else if(perms['status'] == ResStatus.Forbidden && perms['message'] == 'Token is Expired'){
              this._notify.openSnackbar("Session Expired , Please Relogin" , SnackBarState.Warning)

              this.logout();
            }else{
              this.userPerms = []
              this.hasPermTOFollowTicket = false;
              this.hasPermTOShowSalaries = false
    
            }
          },err=>{
            console.log(err);
            this.userPerms = []
            this.hasPermTOFollowTicket = false;
            this.hasPermTOShowSalaries = false
            if(err['error']['status'] == ResStatus.Forbidden && err['error']['message'] == 'Token is Expired'){
              this._notify.openSnackbar("Session Expired , Please Relogin" , SnackBarState.Warning)
              this.logout();
            }

          })
          this.getMyAnnounces();
          
          this._auth.getNavPermsByUserID(this.currentUser.key || '').subscribe(res=>{
            if(!!res.refresh_required){
              res.refresh_required = false;
              this._auth.updateNavPerms(res).finally(()=>{
                window.location.reload()
              })
            }else{
              this.myNavParams = res;



              if(!this.myNavParams.open_to_work_counter){
                this.myNavParams.open_to_work_counter = 0;
              }

              if(!this.myNavParams.pendingReport){
                this.myNavParams.pendingReport = 0;
              }


              // Count Management Section 

              this.totalManageCounter = this.myNavParams.open_to_work_counter + this.myNavParams.pendingReport + 
              (this.myNavParams.project_manager_reports? this.myNavParams.project_manager_reports : 0) //this.myNavParams.pendingIncentiveRequest + this.myNavParams.pendingTransportationRequest + this.myNavParams.open_to_work_counter


              // Count HR Section 

              if(!this.myNavParams.pendingVacationsRequest){
                this.myNavParams.pendingVacationsRequest = 0;
              }
             
              this.hrCounter = this.myNavParams.pendingVacationsRequest 

              // Count Requests Section 

              if(!this.myNavParams.pendingPublicRequest){
                this.myNavParams.pendingPublicRequest = 0;
              }
              if(!this.myNavParams.pendingIncentiveRequest){
                this.myNavParams.pendingIncentiveRequest = 0;
              }


              if(!this.myNavParams.pendingTransportationRequest){
                this.myNavParams.pendingTransportationRequest = 0;
              }

              
              this.totalRequestsCounter = this.myNavParams.pendingPublicRequest + this.myNavParams.pendingTransportationRequest;


              // Count POC & RFP Section 
              if(!this.myNavParams.myPendingPOCRequest){
                this.myNavParams.myPendingPOCRequest = 0;
              }

              if(!this.myNavParams.myPendingRFPRequest){
                this.myNavParams.myPendingRFPRequest = 0;
              }

              this.totalCRMReqsCounter = this.myNavParams.myPendingRFPRequest + this.myNavParams.myPendingPOCRequest;

              this.totalReports = (this.myNavParams?.rejectedReport ||0) + (this.myNavParams?.devPendingReports ||0);
            }
          })

          this.message.getNotificationByUser(this.currentUser.key || '' , 0).subscribe(
            (notifications)=>{             
              this.myNotifications = notifications; 
            }
          )


       
          

          if(data.department == Department.MANAGEMENT || (data.department == Department.TECHNICAL_TEAM && data.accPosition == AccountPositions.MANAGER)){
            this.isManager = true;
            this.isAdmin = false;
          }else if(data.department == Department.ADMINSTRATION){
            this.isAdmin = true;
            this.isManager = false;
          }else{
            this.isManager = false
            this.isAdmin = false;
          }
        }
      },
      (err)=>console.log(err)
      
    )

    

  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }



  checkIfHasPerm(perm_id){
    const checking = this.userPerms.find(p=>p.permission_id == perm_id)
    if(!!checking){
      return true;
    }else{
      return false;
    }
  }


  getMyAnnounces(){
    this._db.getMyAnnounceToView().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.runningAnnounces = res['data'];
        this.displayNewAnnounce()
      }else{
        this.runningAnnounces = [];
      }
    },err=>{
      this.runningAnnounces = [];
    })
  }

  displayNewAnnounce(){
    this.displayAnnounce= true;
    const myAnnouncesInde = this.getRandomInt(this.runningAnnounces.length)    
    this.announceToDisplay  = this.runningAnnounces[myAnnouncesInde]
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }


  markAsView(){
    console.log(this.announceToDisplay);
    
    this._db.announceMarkAsView(this.announceToDisplay.key || '').subscribe()
  }

  getunreadnotification(){
    return this.myNotifications.filter(notify=>notify.status == NotificationStatus.unSeen)
  }

  readThisNotify(notify){
    notify.status = NotificationStatus.Seen;
    this.message.updateNotification(notify).then(
      ()=>{
        this.router.navigateByUrl(notify.redirection);
      }
    )
  }

  btnUsers = () => {
    this.router.navigateByUrl('/manager/addusers');
  }

  btnProjects = () => {
    this.router.navigateByUrl('/manager/projects');
  }

  btnReports = () => {
    this.router.navigateByUrl('/manager/reports');
  }

  
  logout(){
    this._auth.logout()      
    this.router.navigate(['/']);
    this.isLoggedIn = false;
  }


  getTime(dateString) {
    const timestampPositive = Date.parse(dateString)
    return moment(moment.unix(timestampPositive  / 1000)).startOf('minute').fromNow();
  }

  // isOpenedToWork() {
  //   if(!!this.currentUser.open_to_work && this.currentUser.open_to_work == '1'){
  //     return true;
  //   }else{
  //     return false;
  //   }
  // }

  // checkopenToWork(){
    // if(this.isOpenedToWork()){
    //   this.disableOpenToWork()
    // }else{
    //   this.openToWork()
    // }
  // }

  getMyOpenToWork(){
    this.myOpenToWorkLoading = true;
    this._auth.getAllOpenToWork().subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.myOpenToWork = res['data'];
        this.myOpenToWorkLoading = false;
      }else{
        this.myOpenToWork = [];
        this.myOpenToWorkLoading = false;
      }
    },err=>{
      this.myOpenToWork = [];
      this.myOpenToWorkLoading = false;
    })
  }

  createOpenToWork(){   
    this.myOpenToWorkLoading = true;
    const newOpenToWork:OpenToWork={
      from_date_time:this._db.getDateTimeFormatted(this.newOpenToWorkForm.get(['from'])?.value),
      to_date_time:this._db.getDateTimeFormatted(this.newOpenToWorkForm.get(['to'])?.value),
    }
    this._auth.openToWork(newOpenToWork.from_date_time,newOpenToWork.to_date_time).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.getMyOpenToWork();
        this.myOpenToWorkLoading = false;
      }
    },err=>{
      this.myOpenToWorkLoading = false;
    })
  }

  deactivateOpenToWork(open:OpenToWork){   
    this.myOpenToWorkLoading = true;
    this._auth.updateToWork(open.id||'','0').subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.getMyOpenToWork();
        this.myOpenToWorkLoading = false;
      }
    },err=>{
      this.myOpenToWorkLoading = false;
    })
  }
  // disableOpenToWork(){
  //   this._notify.openDialog(
  //     'Not Available To work?',
  //     `Are you sure to remove yourself from open  to work!`,
  //     false,
  //     '',
  //     true,
  //     false).subscribe(response => {
  //       if (response) {
  //         this.currentUser.open_to_work = false;
  //         this.changeOpenToWorkStatus();
  //       } else {
  //         this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  //         if(this.currentUser.open_to_work == true){
  //           this.currentUser.open_to_work= false;
  //           this.changeDetectorRef.detectChanges();
  //           this.currentUser.open_to_work= true;
  //           this.changeDetectorRef.detectChanges();
  //         }else{
  //           this.currentUser.open_to_work= true;
  //           this.changeDetectorRef.detectChanges();
  //           this.currentUser.open_to_work= false;
  //           this.changeDetectorRef.detectChanges();            
  //         }
  //       }
  //   });
  // }
  
  // changeOpenToWorkStatus(){
  //   this.navLoading = true;
  //   this._auth.openToWork(this.currentUser.open_to_work as boolean).subscribe(res=>{
  //     if(res['status'] == ResStatus.CRUD){
  //       this._notify.openSnackbar('Success!', SnackBarState.Success);
  //       this.navLoading = false;
  //     }else{
  //       this.navLoading = false;
  //       this._notify.openSnackbar('Error!', SnackBarState.Warning);
  //       this._db.createSystemLogs(
  //         `${this.currentUser.username} Has Status ${JSON.stringify(res['status'])} =>  Error ${JSON.stringify(res['data'])} while OPen TO Work`,
  //         `${this.currentUser.key} Has Error while Open To Work`,
  //         this.currentUser.key || '',
  //         this.currentUser.username,
  //         'Faild'
  //       ).subscribe()
  //     }
  //   },err=>{
  //     console.log(err);
  //     this.navLoading = false;
  //     this._notify.openSnackbar('Error!', SnackBarState.Error);
  //     this._db.createSystemLogs(
  //       `${this.currentUser.username} Has Status ${JSON.stringify(err['error']['data'])} =>  Error ${JSON.stringify(err['error']['data'])} while Open TO Work`,
  //       `${this.currentUser.key} Has Error while Open To Work`,
  //       this.currentUser.key || '',
  //       this.currentUser.username,
  //       'Faild'
  //     ).subscribe()
  //   })
  // }

  // openToWork(){
  //   this._notify.openDialog(
  //     'Available To work?',
  //     `If you marked yourself as available to work you will notify managers with that till you disable it again!`,
  //     false,
  //     '',
  //     true,
  //     false).subscribe(response => {
  //       if (response) {
  //         this.currentUser.open_to_work = true;
  //         this.changeOpenToWorkStatus()
  //       } else {
  //         this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  //         if(this.currentUser.open_to_work == true){
  //           this.currentUser.open_to_work= false;
  //           this.changeDetectorRef.detectChanges();
  //           this.currentUser.open_to_work= true;
  //           this.changeDetectorRef.detectChanges();
  //         }else{
  //           this.currentUser.open_to_work= true;
  //           this.changeDetectorRef.detectChanges();
  //           this.currentUser.open_to_work= false;
  //           this.changeDetectorRef.detectChanges();            
  //         }
  //       }
  //   });
  // }
  @HostListener('window:resize', ['$event'])
onResize() {
  if (window.innerWidth<=600) {
    this.drawerClose=true;
  }else{
    this.drawerClose=false;
  }
  
  // event.target.innerWidth;
}
}
