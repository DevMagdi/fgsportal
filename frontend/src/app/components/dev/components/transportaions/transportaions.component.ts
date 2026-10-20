import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { transportaionFinalStatus, Transportations } from 'src/app/interfaces/transportations';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Project } from 'src/app/interfaces/project';
import { SUB_TASk } from 'src/app/interfaces/task';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { ResStatus } from 'src/app/interfaces/res-status';

@Component({
  selector: 'app-transportaions',
  templateUrl: './transportaions.component.html',
  styleUrls: ['./transportaions.component.scss'],
  animations: [
    trigger('detailExpand', [

      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),

      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('openClose', [
      state('void', style({ height: 0, opacity: 0 })),
      transition('void <=> *', [
        animate('300ms ease-in-out')
      ])
    ])
  ],
})
export class TransportaionsComponent implements OnInit {
  isNewTransIsopened:boolean = false;
  newTransRequestForm:FormGroup;
  currentLoggedInUser:User;
  allPmsAndManagers:User[] = [];

  myProjects:Project[]=[];
  displayedColumns: string[] = ['Date', 'From', 'To', 'Purpose', 'Project', 'Amount' , 'Status'];

  myRequests:Transportations[] = [];

  myProcess:SUB_TASk[] = [];
  // excelFile:File;
  // excelUrl:string = '';
  // uploadProgress:number;

  constructor(private _db:DatabaseService,
              private _auth:AuthApiService,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentLoggedInUser = user;
      // this._db.getMyTransportationsFromPending(this.currentLoggedInUser.key|| '').subscribe(transportations=>{
      //   if(transportations['status'] == ResStatus.CRUD){
      //     this.myRequests = transportations['data'];
      //   }
      // })
      this.getMyTransportation()
      this._db.getDevProjects(this.currentLoggedInUser.key || '').subscribe(projects=>{
        if(projects['status'] == ResStatus.CRUD){
          this.myProjects = projects['data'];
        }
      })
    })


    this._auth.getUserByFilter(Department.TECHNICAL_TEAM , AccountRoles.Automation_Engineer , AccountPositions.MANAGER).subscribe(pms=>{      
      if(pms['status'] == ResStatus.CRUD){
        this.allPmsAndManagers = pms['data']
      }
      this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(managers=>{      
        if(managers['status'] == ResStatus.CRUD){
          managers['data'].map((man)=>this.allPmsAndManagers.push(man))
        }
      })
    })
    // const getCurrentUserSubscription:Subscription = this.auth.user.subscribe(
    //   (user)=>{
    //     getCurrentUserSubscription.unsubscribe()
    //     this.currentLoggedInUser = user;

    //     this.db.getMyTransportationsFromPending(this.currentLoggedInUser.key|| '').subscribe(
    //       (transportations)=>{
    //         this.myRequests = [];
    //         this.myRequests = transportations;
    //         console.log(transportations);
    //         this.db.getMyTransportationsFromFinished(this.currentLoggedInUser.key|| '').subscribe(
    //           (trans)=>{
    //             this.myRequests = this.myRequests.concat(trans)
    //           }
    //         )
    //       }
    //     )


    //     this.db.getDevProjects(this.currentLoggedInUser.key || '' , this.currentLoggedInUser.username).subscribe(
    //       (projects)=>{
    //         this.myProjects = projects;
    //       }
    //     )
    //   }
    // )

    // const getPMSSubscription:Subscription = this.auth.getMyPMs().subscribe(
    //   (pms)=>{
    //     getPMSSubscription.unsubscribe();
    //     this.allPmsAndManagers = pms;
    //     const getManagersSubscription:Subscription = this.auth.getMymanagers().subscribe(
    //       (managers)=>{
    //         getManagersSubscription.unsubscribe();
    //         managers.map((man)=>{
    //           if(man.key != 'jjuyajnYK6clqnD7PIMEuQesyiy2'){
    //             this.allPmsAndManagers.push(man)
    //           }
    //         });
    //       }
    //     )
    //   }
    // )
    this.newTransRequestForm = new FormGroup({
      'date':new FormControl(null , Validators.required),
      'from':new FormControl(null , Validators.required),
      'to':new FormControl(null , Validators.required),
      'purpose':new FormControl(null , Validators.required),
      'amountByEGP':new FormControl(null , Validators.required),
      'pmToApproveKey':new FormControl(null , Validators.required),
      'projectkey':new FormControl(null , Validators.required),
      'processkey':new FormControl(null , Validators.required),
      'comment':new FormControl(null)
    })
  }



  getMyTransportation(){
    this._db.getMyTransportations(this.currentLoggedInUser.key|| '').subscribe(transportations=>{
      if(transportations['status'] == ResStatus.CRUD){
        this.myRequests = transportations['data'];
        // console.log(this.myRequests);
      }
    })
  }

  createTransRequest(){
    const managerName = this.allPmsAndManagers.find(man=>man.key == this.newTransRequestForm.get(['pmToApproveKey'])?.value)?.username   
    const newRequest:Transportations= {
      date: this.newTransRequestForm.value['date'],
      fromLocation :this.newTransRequestForm.value['from'],
      toLocation : this.newTransRequestForm.value['to'],
      purpose : this.newTransRequestForm.value['purpose'],
      amountByEGP : this.newTransRequestForm.value['amountByEGP'],
      empKey:this.currentLoggedInUser.key || '',
      empName:this.currentLoggedInUser.username,
      empImgUrl:this.currentLoggedInUser.photoURL || '',
      pmToApproveKey:this.newTransRequestForm.value['pmToApproveKey'],
      pmToApproveName:managerName || '',
      finalStatus:transportaionFinalStatus.Pending
    }

    if(!!this.newTransRequestForm.value['projectkey']){
      newRequest.projectKey = this.newTransRequestForm.value['projectkey'];
      newRequest.projectName = this.myProjects.find(pro=>pro.key == this.newTransRequestForm.value['projectkey'])?.title
    }
    
    if(!!this.newTransRequestForm.value['processkey']){
      newRequest.processKey = this.newTransRequestForm.value['processkey'];
      newRequest.processName = this.myProcess.find(pro=>pro.key == this.newTransRequestForm.value['processkey'])?.title
    }

    if(!!this.newTransRequestForm.value['comment']){
      newRequest.comment = this.newTransRequestForm.value['comment'];
    }

    this._db.createtransportationRequest(newRequest).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.newTransRequestForm.reset();
        this.isNewTransIsopened = false;
        this._notify.openSnackbar('Your Request Sent Successfully' , SnackBarState.Success);
        this.getMyTransportation();
      }else{
        this._notify.openSnackbar(`Error, ${JSON.stringify(res['data'])}`, SnackBarState.Warning)
        this._db.createSystemLogs(
          `${this.currentLoggedInUser.username} Has Error ${JSON.stringify(res['data'])} while creating his Transportation Request ${JSON.stringify(newRequest)}`,
          `${this.currentLoggedInUser.key} Has Error while creating his report`,
          this.currentLoggedInUser.key || '',
          this.currentLoggedInUser.username,
          'Faild'
        ).subscribe()
      }
    },err=>{
      console.log(err);
      // this._notify.openSnackbar('Error, Please Contact System Adminstrator' , SnackBarState.Error);
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error)
      this._db.createSystemLogs(
        `${this.currentLoggedInUser.username} Has Error ${JSON.stringify(err['error']['data'])} while creating his Transportation Request ${JSON.stringify(newRequest)}`,
        `${this.currentLoggedInUser.key} Has Error while creating his report`,
        this.currentLoggedInUser.key || '',
        this.currentLoggedInUser.username,
        'Faild'
      ).subscribe()
    })
    
    // .then(
    //   ()=>{
    //     this.newTransRequestForm.reset();
    //     this.isNewTransIsopened = false;
    //     this._notify.openSnackbar('Your Request Sent Successfully' , SnackBarState.Success);
    //   }
    // )

    // this.db.createtransportationRequest(newRequest).then(
    //   ()=>{
    //     this.newTransRequestForm.reset();
    //     this.isNewTransIsopened = false;
    //     this._notify.openSnackbar('Your Request Sent Successfully' , SnackBarState.Success);
    //   }
    // )
    
  }

  togglePanel(){
    this.isNewTransIsopened = !this.isNewTransIsopened
  }



  getProcesses(){
    const projectKey = this.newTransRequestForm.get(['projectkey'])?.value;
    this._db.getProjectProcess(projectKey).subscribe(processes=>{
      if(processes['status'] == ResStatus.CRUD){
        this.myProcess = processes['data'];
      }
    })

    // this.db.getProjectSubTasks(projectKey).subscribe(processes=>{
    //   this.myProcess = processes;
    // })
  }

  // uploadFile(e){
    
  //   this.excelFile = e.target.files[0]
  //   if (e.target.files){
  //     var reader = new FileReader()
  //     reader.readAsDataURL(e.target.files[0])
  //     reader.onload = (event:any) =>{
  //       this.excelUrl = event.target.result
  //       // this.db.pushFileToStorage(this.excelFile)
  //       // .then((res)=>{console.log(res);})
  //       // .catch((err)=>{console.log(err);}) 

  //     }
  //   }
    
  // }

}
