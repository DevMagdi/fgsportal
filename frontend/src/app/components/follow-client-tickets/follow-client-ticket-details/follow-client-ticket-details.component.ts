import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ClientTicket, ClientTicketPeriority, ClientTicketStatus, ClientTicketTimeLine, ProjectSupport } from 'src/app/interfaces/client-ticket';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/interfaces/project';
import { SUB_TASk } from 'src/app/interfaces/task';
import { Notifying } from 'src/app/interfaces/notification';
import { MessagingService } from 'src/app/services/messaging.service';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { SendEmailService } from 'src/app/services/send-email.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { environment } from 'src/environments/environment';
import { Question, RateAnswers } from 'src/app/interfaces/rating';

@Component({
  selector: 'app-follow-client-ticket-details',
  templateUrl: './follow-client-ticket-details.component.html',
  styleUrls: ['./follow-client-ticket-details.component.scss']
})
export class FollowClientTicketDetailsComponent implements OnInit {
  currentClientTicket:ClientTicket;
  currentuser:User;

  ticketTimeLine:ClientTicketTimeLine[]= [];
  
  editMode:boolean = false;
  clientTicketStatusEnum = ClientTicketStatus;
  clientTicketperiorityENUM = ClientTicketPeriority;

  responsiveOptions:any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
  ];
  displayCustom: boolean;

  activeIndex: number = 0;

  accRoleENum = AccountRoles;

  display: boolean = false;

  clientProjects:ProjectSupport[];
  // clientProcess:ProcessSupport[];

  projectManagres:User[] = [];
  devs:User[] = [];
  DepartmentEnum = Department;
  accPositionEnum = AccountPositions;
  editTicketForm:FormGroup = new FormGroup({
    'projectKey': new FormControl(null),
    'processKey': new FormControl(null),
    'pmKey': new FormControl(null),
    'devKey': new FormControl(null),
    'status': new FormControl(null),
    'periority': new FormControl(null),
  });


  newTimeLineForm:FormGroup = new FormGroup({
    'title': new FormControl(null , Validators.required),
    'comment': new FormControl(null , Validators.required),
    'forClient':new FormControl(true,Validators.required)
  })
  userPerms:UserPermissions[] = [];
  newServerApi = environment.newServerApi
  hasPermTOFollowTicket:boolean = false;
  ticketDetailsLoading:boolean = false;

  questions:Question[] = [];
  displayRateForm:boolean = false;

  constructor(private _db:DatabaseService,
              private _activerouter:ActivatedRoute,
              private _auth:AuthApiService,
              private router:Router,
              private _notify:NotificationService,
              private _message:MessagingService,
              private _emailing:SendEmailService) { }

  ngOnInit(): void {
    this._auth.user.subscribe((user)=>{
      this.currentuser = user;
      this.getClientCurrentIssue();
      this._auth.getUserPermissionsByKey(this.currentuser.key || '').subscribe(perms=>{
        if(perms['status'] == ResStatus.CRUD){
          this.userPerms = perms['data'];
          const ticketPerFound =  this.userPerms.find(p=>p.permission_id == 2)
          if(!!ticketPerFound){
            this.hasPermTOFollowTicket = true;
          }else{
            this.hasPermTOFollowTicket = false;
          }
        }else{
          this.userPerms = []
          this.hasPermTOFollowTicket = false;
        }
      },err=>{
        console.log(err);
        this.userPerms = []
        this.hasPermTOFollowTicket = false;
      })
    })
  }

  getPMs(){
    this._auth.getUserByFilter(Department.TECHNICAL_TEAM , AccountRoles.Automation_Engineer , AccountPositions.MANAGER).subscribe(pms=>{
      if(pms['status'] == ResStatus.CRUD){
        this.projectManagres = pms['data'];
      }
    })
  }
  checkIfHasPerm(perm_id){
    const checking = this.userPerms.find(p=>p.permission_id == perm_id)
    if(!!checking){
      return true;
    }else{
      return false;
    }
  }
  getDevs(){
    this._auth.getUserByFilter(Department.TECHNICAL_TEAM , AccountRoles.SUPPORT).subscribe(support=>{
      this.devs = [];
      if(support['status'] == ResStatus.CRUD){
        const mySupport:User[] = support['data']
        this.devs = mySupport.filter(d=>d.accPosition != AccountPositions.MANAGER);  
      }
      this._auth.getUserByFilter(Department.TECHNICAL_TEAM , AccountRoles.Automation_Engineer).subscribe(devs=>{
        if(devs['status'] == ResStatus.CRUD){
          const myDevs:User[] = devs['data']
          this.devs = this.devs.concat(myDevs.filter(d=>d.accPosition != AccountPositions.MANAGER));
          this.devs = this.devs.sort((a,b)=>{
            return compare(a.username, b.username, true);
          })
        }
      })
    })
    // const getdevsSUb:Subscription = this._auth.getMyDevs().subscribe(devs=>{
    //   getdevsSUb.unsubscribe();
    //   this.devs = devs;
    //   const getBAs:Subscription = this._auth.getMyBAnalysis().subscribe(bas=>{
    //     getBAs.unsubscribe();
    //     bas.map(ba=>this.devs.push(ba))
    //     const getTchs:Subscription = this._auth.getMytechLeads().subscribe(techs=>{
    //       getTchs.unsubscribe();
    //       techs.map(tech=>this.devs.push(tech))
    //     })
    //   })
    // })
  }

  getClientCurrentIssue(){
    this.ticketDetailsLoading=true;
    this._activerouter.params.subscribe(parameter => {
      const ticketKey = parameter['id']
      this._db.getTicketByID(ticketKey).subscribe(
        (ticket)=>{
          if(ticket['status'] == ResStatus.CRUD){
            this.currentClientTicket = ticket['data'];
            this.getClientTicketTimeLine();
          }
        },
        (err)=>{
          console.log(err);
        }
      )
    })
  }

  getClientTicketTimeLine(){
    this.ticketDetailsLoading=true;
    this._db.getTicketTimeLine(this.currentClientTicket.key || '').subscribe((answers)=>{
      if(answers['status'] == ResStatus.CRUD){
        this.ticketTimeLine = answers['data'].reverse();
      }
      this.ticketDetailsLoading=false;
    })
  }
  
  getStatusColor(status: ClientTicketStatus){
    if(status == ClientTicketStatus.STARTED){
      return '#1CCC6D'
    }else if(status == ClientTicketStatus.CLOSED){
      return '#fff'
    }else{
      return '#000'
    }
  }
  getStatusBG(status: ClientTicketStatus){
    if(status == ClientTicketStatus.STARTED){
      return '#E3FCEF'
    }else if(status == ClientTicketStatus.CLOSED){
      return '#CC1C52'
    }else{
      return '#000'
    }
  }
  getPriority(priority: ClientTicketPeriority){
    if(priority == ClientTicketPeriority.Normal){
      return '#1CCC6D'
    }else if(priority == ClientTicketPeriority.High){
      return '#513982'
    }else if(priority == ClientTicketPeriority.Critical){
      return '#CC1C52'
    }else{
      return '#CC1C52'
    }
  }

  getTime(dateString) {
    const timestampPositive = Date.parse(dateString)
    return moment(moment.unix(timestampPositive  / 1000)).startOf('minute').fromNow();
  }
  
  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }


  // editClientTicketStatus(){
  //   this._notify.openDialog(
  //     'Change Status?',
  //     `Are you sure you want to Change Status?`,
  //     false,
  //     '',
  //     true,
  //     false).subscribe(response => {
  //       if (response) {
  //         if(this.currentClientTicket.status == ClientTicketStatus.CLOSED){
  //           this.currentClientTicket.closureDate = new Date().toLocaleString();
  //         }
  //         this._db.editClientTicket(this.currentClientTicket)
  //       } else {
  //         this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  //         this.getClientCurrentIssue()
  //       }
  //   });
  // }

  deleteTicket(ticket:ClientTicket){
    this._notify.openDialog(
      'Delete Issue?',
      `Are you sure you want to delete This Issue?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deleteClientTicket(ticket.key  || '').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this._notify.openSnackbar('Ticket Deleted Successfully', SnackBarState.Success)
              this.router.navigate(['/tickets'])
            }
          })          
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

  
  showDialog() {
    this.display = true;
  }

  // getClientProjects(){
  //   const clientProjectsSub:Subscription = this._db.getProjectByClientKey(this.currentClientTicket.clientKey).subscribe(projects=>{
  //     clientProjectsSub.unsubscribe();
  //     this.clientProjects = projects;
  //   })
  // }

  // getProjectProcesses(){
  //   this.clientProcess = [];
  //   this._db.getProcessSupportByProjectKey(this.editTicketForm.get('projectKey')?.value).subscribe((processes)=>{     
  //     this.clientProcess = processes;
  //   })
  // }

  editClientTicket(){
    
    this.showDialog();
    // this.getClientProjects()
    if(this.currentuser.accRole == AccountRoles.SUPER_USER || this.currentuser.accRole == AccountRoles.CEO || this.currentuser.accRole == AccountRoles.CTO){
      this.getPMs();
      this.getDevs();
    }else if (this.currentuser.accPosition == AccountPositions.MANAGER){
      this.getDevs();
    }else if(!!this.userPerms && !!this.hasPermTOFollowTicket){
      this.getDevs();
      this.getPMs();
    }

    if(!!this.currentClientTicket.projectKey){
      this.editTicketForm.patchValue({
        'projectKey' : this.currentClientTicket.projectKey,
      })
      // this.getProjectProcesses();
    }

    // if(!!this.currentClientTicket.processKey){
    //   this.editTicketForm.patchValue({
    //     'processKey' : this.currentClientTicket.processKey,
    //   })
    // }

    if(!!this.currentClientTicket.assignedToPMKey){
      this.editTicketForm.patchValue({
        'pmKey' : this.currentClientTicket.assignedToPMKey,
      })
    }
    
    if(!!this.currentClientTicket.assignedToDevKey){
      this.editTicketForm.patchValue({
        'devKey' : this.currentClientTicket.assignedToDevKey,
      })
    }

    if(!!this.currentClientTicket.priority){
      this.editTicketForm.patchValue({
        'periority' : this.currentClientTicket.priority,
      })
    }

    if(!!this.currentClientTicket.status){
      this.editTicketForm.patchValue({
        'status' : this.currentClientTicket.status,
      })
    }

  }

  sendNotificationToPm(issue:ClientTicket){
    const newNotificationToPM:Notifying = {
      title : `Client Ticket Assigned To YOU`,
      body : `${this.currentuser.username} Assigned a client Ticket On ${issue.projectName} To YOu`,
      receverKey : issue.assignedToPMKey || '', 
      receverName : issue.assignedToPMName || '', 
      senderKey : this.currentuser.key || '',
      senderName: this.currentuser.username,
      senderImg: this.currentuser.photoURL ? this.currentuser.photoURL :  'https://bootdey.com/img/Content/avatar/avatar7.png',
      redirection:`/tickets/${issue.key}`
    }
    this._message.createnotification(newNotificationToPM)
  }

  sendNotificationToDEv(issue:ClientTicket){
    const newNotificationToPM:Notifying = {
      title : `Client Ticket Assigned To YOU`,
      body : `${this.currentuser.username} Assigned a client Ticket On ${issue.projectName} To You`,
      receverKey : issue.assignedToDevKey || '', 
      receverName : issue.assignedToDevName || '', 
      senderKey : this.currentuser.key || '',
      senderName: this.currentuser.username,
      senderImg: this.currentuser.photoURL ? this.currentuser.photoURL :  'https://bootdey.com/img/Content/avatar/avatar7.png',
      redirection:`/tickets/${issue.key}`
    }
    this._message.createnotification(newNotificationToPM)
  }

  sendNotificationToClient(issue:ClientTicket){
    const newNotificationToPM:Notifying = {
      title : `Ticket Updated`,
      body : `${this.currentuser.username} Updated The Ticket Status`,
      receverKey : issue.clientKey || '', 
      receverName : issue.clientName || '', 
      senderKey : this.currentuser.key || '',
      senderName: this.currentuser.username,
      senderImg: this.currentuser.photoURL ? this.currentuser.photoURL :  'https://bootdey.com/img/Content/avatar/avatar7.png',
      redirection:`/support/tickets/${issue.key}`
    }
    this._message.createnotification(newNotificationToPM)
  }


  checkIfNeedRate(){
    if(!!this.currentClientTicket.assignedToDevKey){
      this.display = false;
      if(this.editTicketForm.get(['status'])?.value == ClientTicketStatus.CLOSED){
        if(this.currentClientTicket.rated_before == '1'){
          this.GetRateForm();
  
          let actionTitle = 'Ticket Updated';
          let actionComment = '';
          if(this.currentClientTicket.status != this.editTicketForm.get(['status'])?.value){ 
            actionComment = actionComment += `Ticket Status Updated from ${this.currentClientTicket.status_name},`;
            this.currentClientTicket.status = this.editTicketForm.get(['status'])?.value;
          }
  
          this._db.updateTicket(this.currentClientTicket ,actionTitle , actionComment ).subscribe(res=>{
            if(res['status']==ResStatus.CRUD){
              this.ticketDetailsLoading = false;
              this.getClientCurrentIssue();
              this._notify.openSnackbar('success' , SnackBarState.Success);
              this.editTicketForm.reset();
              this.clientProjects = [];
              this.display = false;
            }else{
              this.ticketDetailsLoading = false;
            }
          },err=>{
            this.ticketDetailsLoading = false;
          })
        }else{
          this.GetRateForm();
        }
      }else{
        this.submitEditTicket();
      }
    }else{
      this.submitEditTicket();
    }
  }

  GetRateForm(){
    this._db.getQuestionsByQuestionGroup('3').subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.questions = res['data']
        this.displayRateForm = true;
      }
    })
  }

  submitRate(rateAnswers:Question[]){
    this.ticketDetailsLoading = true;
    const finalRateObj:RateAnswers = {
      question_group_id:'1',
      user_to_rate_id : this.currentClientTicket.assignedToDevKey,
      ticket_id:this.currentClientTicket.key || '',
      questions:[]
    }

    rateAnswers.map(q=>{
      if(!!q.anss){
        if(!Array.isArray(q.anss.answer)){
          if(q.isMulti == '0' && q.question_type_id == '2'){
            const a:any = []
            a.push(q.anss.answer)
            q.anss.answer = a
          }
        }
        finalRateObj.questions.push(q.anss)
      }
    })

    if(this.currentClientTicket.rated_before != '1'){
      this._db.createTicketRate(finalRateObj).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.submitEditTicket();
          this.ticketDetailsLoading = false;
        }else{
          this.ticketDetailsLoading = false;
        }
      },err=>{
        this.ticketDetailsLoading = false;
      }) 
    }else{
      this._db.createTicketRate(finalRateObj).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          // this.submitEditTicket();
          this.displayRateForm = false;
          this.ticketDetailsLoading = false;
        }else{
          this.ticketDetailsLoading = false;
        }
      },err=>{
        this.ticketDetailsLoading = false;
      }) 
    }
  }


  submitEditTicket(){
    this.ticketDetailsLoading = true;

    let actionTitle = 'Ticket Updated';
    let actionComment = '';

    if(this.currentClientTicket.status != this.editTicketForm.get(['status'])?.value){ 
      actionComment = actionComment += `Ticket Status Updated from ${this.currentClientTicket.status_name},`;
      this.currentClientTicket.status = this.editTicketForm.get(['status'])?.value;
    }

    

    if(this.currentClientTicket.priority != this.editTicketForm.get(['periority'])?.value){
      actionComment = actionComment += `Ticket Periority Updated from ${this.currentClientTicket.priority_name}`;
      this.currentClientTicket.priority = this.editTicketForm.get(['periority'])?.value;
    }

    if(!!this.editTicketForm.get(['pmKey'])?.value){
      if(this.currentClientTicket.assignedToPMKey != this.editTicketForm.get(['pmKey'])?.value){
        const PMNAme = this.projectManagres.find(pm=>pm.key == this.editTicketForm.get(['pmKey'])?.value)?.username || '';
        actionComment = actionComment += `Ticket Assigned To Project Manager ${PMNAme},`;
        this.currentClientTicket.assignedToPMKey = this.editTicketForm.get(['pmKey'])?.value;
        this.currentClientTicket.assignedToPMName = PMNAme;
      }
    }

    if(!!this.editTicketForm.get(['devKey'])?.value){
      if(this.currentClientTicket.assignedToDevKey != this.editTicketForm.get(['devKey'])?.value){
        const devName = this.devs.find(dev=>dev.key == this.editTicketForm.get(['devKey'])?.value)?.username || '';
        const devEmail = this.devs.find(dev=>dev.key == this.editTicketForm.get(['devKey'])?.value)?.email || '';
        actionComment = actionComment += `Ticket Assigned To ${devName}, Email: ${devEmail}`;
        this.currentClientTicket.assignedToDevKey = this.editTicketForm.get(['devKey'])?.value;
        this.currentClientTicket.assignedToDevName = devName;
      }
    }

    // if(this.currentClientTicket.processKey != this.editTicketForm.get(['processKey'])?.value){
    //   actionComment = actionComment += `Process Changed From ${this.currentClientTicket.processName},`;
    //   this.currentClientTicket.processKey = this.editTicketForm.get(['processKey'])?.value;
    //   // this.currentClientTicket.processName = this.clientProcess.find(pr=>pr.key == this.editTicketForm.get(['processKey'])?.value)?.processTitle || '';
    // }

    // const newTimeline:ClientTicketTimeLine= {
    //   action: actionTitle,
    //   actionComment: actionComment,
    //   actionByKey:this.currentuser.key || '',
    //   actionByName:this.currentuser.username,
    //   ticketKey:this.currentClientTicket.key || '',
    //   ticketTitle : this.currentClientTicket.title,
    //   createdAt : new Date().toLocaleString(),
    //   showForClient:true
    // }

    this._db.updateTicket(this.currentClientTicket ,actionTitle , actionComment ).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.ticketDetailsLoading = false;
        this.getClientCurrentIssue();
        this._notify.openSnackbar('success' , SnackBarState.Success);
        this.editTicketForm.reset();
        this.clientProjects = [];
        // this.clientProcess = [];
        this.display = false;
        this.displayRateForm = false;
      }else{
        this.ticketDetailsLoading = false;
      }
    },err=>{
      this.ticketDetailsLoading = false;
    })
    
    // .then(()=>{
    //   this._db.createNewClientTicketTimeline(newTimeline);
      
    //   if(notifyPM){
    //     this.sendNotificationToPm(this.currentClientTicket)
    //     this._auth.getUserByKey(this.currentClientTicket.assignedToPMKey || '').subscribe(user=>{
    //       if(!!user){
    //         const message = `
    //         Hello ${user.username},
    //         <br>
    //         <br>
    //         Client Ticket Updated.<br>
    //         <br>
    //         <br>
    //         There Is An Update On <a href="https://connect.firstgulfsolutions.com/#/tickets/${this.currentClientTicket.key}">Ticket ${this.currentClientTicket.key}</a>.
    //         <br>
    //         <br>
    //         Best Regards,
    //         <br>
    //         <a href="https://connect.firstgulfsolutions.com/">First Gulf Solutions</a>
    //         <br>
    //         <br>
    //         <a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
    //         `
    //         this._emailing.supportCenter(user.email , 'FGS Support', message)
    //       }
          
    //     })
    //   }

    //   if(notifydev){
    //     this.sendNotificationToDEv(this.currentClientTicket)
    //     this._auth.getUserByKey(this.currentClientTicket.assignedToDevKey || '').subscribe(user=>{
    //       if(!!user){
    //         const message = `
    //         Hello ${user.username},
    //         <br>
    //         <br>
    //         Client Ticket Assigned To YOU.<br>
    //         <br>
    //         <br>
    //         There Is An Update On <a href="https://connect.firstgulfsolutions.com/#/tickets/${this.currentClientTicket.key}">Ticket ${this.currentClientTicket.key}</a>.
    //         <br>
    //         <br>
    //         Best Regards,
    //         <br>
    //         <a href="https://connect.firstgulfsolutions.com/">First Gulf Solutions</a>
    //         <br>
    //         <br>
    //         <a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
    //         `
    //         this._emailing.supportCenter(user.email , 'FGS Support', message)
    //       }
          
    //     })
    //   }

    //   if(notifyClientWithClouserMail){
    //     const gettingClientMail:Subscription = this._auth.getUserByKey(this.currentClientTicket.clientKey).subscribe(client=>{
    //       gettingClientMail.unsubscribe();
    //       const messageToClient = `
    //       Hello ${client.username},
    //       <br>
    //       <br>
    //       Thank you for contacting First Gulf Solutions Technical Support.<br>
    //       <br>
    //       <br>
    //       There Is An Update On <a href="https://connect.firstgulfsolutions.com/#/support/tickets/">Ticket ${this.currentClientTicket.key}</a>.
    //       <br>
    //       <br>
    //       We marked the issue as closed. If you need further assistance with this case, please feel free to reopen the case within the next 14 days and we will be happy to assist you further.
    //       <br>
    //       <br>
    //       Within the next day or so,
    //       you might receive a Customer Satisfaction survey from First Gulf Solutions.
    //       It is our commitment to deliver world-class support to our Customers and Partners.
    //       We greatly appreciate your feedback in advance,
    //       as your feedback will help improve our services.
    //       <br>
    //       <br>
    //       Thank you again and have a great day!,
    //       <br>
    //       <br>
    //       Best Regards,
    //       <br>
    //       <a href="https://connect.firstgulfsolutions.com/#/">First Gulf Solutions</a>
    //       <br>
    //       <br>
    //       <a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
    //       `
    //       this._emailing.supportCenter(client.email , `FGS Support Case ${this.currentClientTicket.key}`, messageToClient)
    //     })
    //   }else{
    //     const gettingClientMail:Subscription = this._auth.getUserByKey(this.currentClientTicket.clientKey).subscribe(user=>{
    //       gettingClientMail.unsubscribe();
    //       const messageToClient = `
    //       Hello ${user.username},
    //       <br>
    //       <br>
    //       Thank you for contacting First Gulf Solutions Technical Support.<br>
    //       <br>
    //       <br>
    //       There Is An Update On <a href="https://connect.firstgulfsolutions.com/#/support/tickets/${this.currentClientTicket.key}">Ticket ${this.currentClientTicket.key}</a>.
    //       <br>
    //       <br>
    //       Best Regards,
    //       <br>
    //       <a href="https://connect.firstgulfsolutions.com/#/">First Gulf Solutions</a>
    //       <br>
    //       <br>
    //       <a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
    //       `
    //       this._emailing.supportCenter(user.email , `FGS Support Case ${this.currentClientTicket.key}`, messageToClient)
    //     })
    //   }

     
    // })
    
  }




  submitNewTimeLine(){
    this.ticketDetailsLoading = true;
    const newTimeline:ClientTicketTimeLine= {
      action: this.newTimeLineForm.get(['title'])?.value,
      actionComment: this.newTimeLineForm.get(['comment'])?.value,
      actionByKey:this.currentuser.key || '',
      actionByName:this.currentuser.username,
      ticketKey:this.currentClientTicket.key || '',
      ticketTitle : this.currentClientTicket.title,
      createdAt : new Date().toLocaleString(),
      showForClient:this.newTimeLineForm.get(['forClient'])?.value
    }
    this._db.createticketTimeLine(newTimeline).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.getClientTicketTimeLine();
        this.newTimeLineForm.reset();
        this.newTimeLineForm.patchValue({
          'forClient':true
        })
        this.ticketDetailsLoading = false;
      }else{
        this.ticketDetailsLoading = false;
      }
    },err=>{
      this.ticketDetailsLoading = false;
    })
    
    // .then(()=>{
    //   this.newTimeLineForm.reset();
    //   this.newTimeLineForm.patchValue({
    //     'forClient':true
    //   })
    //   if(newTimeline.showForClient == true){
    //     this.sendNotificationToClient(this.currentClientTicket);   
    //     this._auth.getUserByKey(this.currentClientTicket.clientKey).subscribe(user=>{
    //       const messageToClient = `
    //       Hello ${user.username},
    //       <br>
    //       <br>
    //       Thank you for contacting First Gulf Solutions Technical Support.<br>
    //       <br>
    //       <br>
    //       There Is An Update On <a href="https://connect.firstgulfsolutions.com/#/support/tickets/${this.currentClientTicket.key}">Ticket ${this.currentClientTicket.key}</a>.
    //       <br>
    //       <br>
    //       Best Regards,
    //       <br>
    //       <a href="https://connect.firstgulfsolutions.com/#/">First Gulf Solutions</a>
    //       <br>
    //       <br>
    //       <a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
    //       `
    //       this._emailing.supportCenter(user.email , 'FGS Support', messageToClient)
    //     })     
    //   }

      
     
    // });
  }

  zoomout(){
    document.getElementById('tDetailsPage')?.setAttribute('style','zoom:0.7')
  }
  zoomin(){
    document.getElementById('tDetailsPage')?.removeAttribute('style')
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}