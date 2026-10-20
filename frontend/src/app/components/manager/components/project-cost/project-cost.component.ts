import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable} from 'rxjs';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Project } from 'src/app/interfaces/project';
import { CostType, ProjectTotalCost, singleProjectCost, TypeOfCost } from 'src/app/interfaces/project-cost';
import { SUB_TASk } from 'src/app/interfaces/task';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { NotificationService } from 'src/app/services/notification.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { map, startWith, throwIfEmpty } from 'rxjs/operators';
import { ProjectCostApiService } from 'src/app/services/project-cost-api.service';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ResStatus } from 'src/app/interfaces/res-status';
import { UserPermissions } from 'src/app/interfaces/user-permissions';

export enum Months{
  JAN = 0,
  FEB = 1,
  MAR = 2,
  APR = 3,
  MAY = 4 , 
  JUN = 5 , 
  JUL = 6 , 
  AUG = 7 , 
  SEP = 8 , 
  OCT = 9 , 
  NOV = 10 , 
  DEC = 11
}

interface SingleProjectCostOverTime{
  date:string;
  salaries:number;
  Incentive:number;
  Idle_Hours:number;
  Transportation:number;
  Mobile:number;
  Internet:number;
  PublicRequest:number;
  Other:number;
  Total:number;
}
@Component({
  selector: 'app-project-cost',
  templateUrl: './project-cost.component.html',
  styleUrls: ['./project-cost.component.scss']
})
export class ProjectCostComponent implements OnInit {
  @ViewChild('htmlData') htmlData:ElementRef;

  closeResult:string;
  getProjectCostForm:FormGroup;
  myProjects:Project[] = [];
  currentUser:User;
  projectTotalCost:ProjectTotalCost;

  newSingleProjectCostForm:FormGroup;
  selectedProject:Project;
  projectSubTasks:SUB_TASk[] = [];

  projectTeam:any[] = [];
  
  projectCostWithEmpOverTime: any;
  projectCostWithProcessOverTime:any;
  basicOptions: any;
  selectedProjectMonthsLable:string[] = [];
  projectCostOverTime:SingleProjectCostOverTime[] = []; 
  projectSingleCosts:singleProjectCost[] = [];
  numberOfProcess:number = 0;
  progress:number = 0;
  budgetryCost:number = 0;
  actualCost:number = 0;

  TypeOfCostEnum = TypeOfCost;
  editMode:boolean = false;

  filteredOptions: Observable<Project[]>;
  myControl = new FormControl();

  costOnEditMode:boolean = false;
  DepartmentEnum = Department;


  costTypes:CostType[] = [];
  AccountRolesEnum = AccountRoles;
  getDataLoader:boolean = false;
  userPerms:UserPermissions[] = [];
  getProjectsLoading:boolean = false;
  @Input() projectKey:any =0;

sidebarVisible1=false;

  constructor(private _notify:NotificationService,
              private _projectCost:ProjectCostApiService,
              private _auth:AuthApiService,
              private _db:DatabaseService,
              private modalService:NgbModal,
              private excelServ:ExportExcelService) {

              }
              
    ngOnInit(): void {
      this.basicOptions={
        plugins: {
          position:'bottom' , 

          legend: {
           position:'bottom'  
          }
      }
    }
    this.getProjectCostForm = new FormGroup({
      'projectKey' : new FormControl(null , Validators.required)
    })

    this.newSingleProjectCostForm = new FormGroup({
      'processKey' :new FormControl(null , Validators.required),
      'empKey' :new FormControl(null , Validators.required),
      'costType' :new FormControl(null , Validators.required),
      'costComment' :new FormControl(null , Validators.required),
      'costDate' :new FormControl(null , Validators.required),
      'costAmount' :new FormControl(null , Validators.required)
    })
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
        if(perms['status'] == ResStatus.CRUD){
          this.userPerms = perms['data'];
          if (this.projectKey) {
            this.getProjectCostForm?.patchValue({
              'projectKey':Number(this.projectKey)
            }) 
            this.getSingleProjectCost()
            this._db.getProjectByID(this.projectKey).subscribe(res=>{
              this.myProjects = [res['data']]
            })
            
          }else{
            
            this.getMyProjects();
          }
          
          this.getCostTypes();
        }else{
          this.userPerms = []
          // this.getMyProjects();
          this.getProjectCostForm?.patchValue({
            'projectKey':Number(this.projectKey)
          }) 
          this.getSingleProjectCost()
          this.getCostTypes();
        }
      },err=>{
        this.userPerms = []
        this.getMyProjects();
        this.getCostTypes();
      })
      
    })
  
   
  }



  getCostTypes(){
    this._projectCost.getgetCostTypes().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.costTypes = res['data']
      }
    })
  }


  startCounter(){
    this.numberOfProcess = 0;
    this.progress = 0;
    this.budgetryCost = 0;
    this.actualCost = 0;
    const myProcessInterval = setInterval(() => {
      if(this.numberOfProcess < this.projectSubTasks.length){
        this.numberOfProcess+= 1
      }else{
        clearInterval(myProcessInterval)
      }
    }, 10);

    const myProgressInterval = setInterval(() => {
      if(!!this.projectTotalCost.projectProgress){
        if(this.progress < this.projectTotalCost.projectProgress){
          this.progress+= 5
        }else{
          this.progress = this.projectTotalCost.projectProgress
          clearInterval(myProgressInterval)
        }
      }else{
        clearInterval(myProgressInterval)
      }
    }, 10);

    const myBudjetInterval = setInterval(() => {
      if(!!this.projectTotalCost.budgetryCost){
        if(this.budgetryCost < this.projectTotalCost.budgetryCost){
          this.budgetryCost+= 500
        }else{
          this.budgetryCost = this.projectTotalCost.budgetryCost
          clearInterval(myBudjetInterval)
        }
      }else{
        this.budgetryCost = 0;
        clearInterval(myBudjetInterval)
      }
    }, 1);  
    
    const myActualInterval = setInterval(() => {
      // console.log(this.projectTotalCost.actualCost);
      
      if(this.actualCost < this.projectTotalCost.actualCost){
        this.actualCost+= 500
      }else{
        this.actualCost = this.projectTotalCost.actualCost
        clearInterval(myActualInterval)
      }
    },20);

  }


  recalculate(){
    this.getDataLoader = true;
    this._projectCost.recalculateCost(this.projectTotalCost.key || '').subscribe(res=>{
      console.log(res);
      this.getProjectCostForm.patchValue({
        'projectKey':this.projectTotalCost.key
      })
      this.getSingleProjectCost();
    },err=>{
      console.log(err);
      this.getProjectCostForm.patchValue({
        'projectKey':this.projectTotalCost.key
      })
      this.getSingleProjectCost();
    })
    // this._notify.openDialog(
    //   'Recalculate Cost?',
    //   `Are you sure you want to Recalculate This Cost?`,
    //   false,
    //   '',
    //   true,
    //   false).subscribe(response => {
    //     if (response) {
    //       this._projectCost.recalculateCost(this.projectTotalCost.key || '').subscribe(res=>{
    //         console.log(res);
    //         this.getProjectCostForm.patchValue({
    //           'projectKey':this.projectTotalCost.key
    //         })
    //         this.getSingleProjectCost();
    //       },err=>{
    //         console.log(err);
    //         this.getProjectCostForm.patchValue({
    //           'projectKey':this.projectTotalCost.key
    //         })
    //         this.getSingleProjectCost();
    //       })
    //     } else {
    //       this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
    //     }
    // });
    
  }

  checkIfHasPerm(perm_id){
    const checking = this.userPerms.find(p=>p.permission_id == perm_id)
    if(!!checking){
      return true;
    }else{
      return false;
    }
  }

  getMyProjects(){    
    this.getProjectsLoading = true;
    if(this.currentUser.department == Department.MANAGEMENT || (this.currentUser.department == Department.ADMINSTRATION && !!this.checkIfHasPerm(3))){
      this._db.getAllProjectsIncludeClosed().subscribe(projects=>{                        
        if(projects['status'] == ResStatus.CRUD){
          this.myProjects = projects['data'];
          if (this.projectKey !=0) {
            console.log(this.projectKey);
            
            this.getProjectCostForm?.patchValue({
              'projectKey':Number(this.projectKey)
              }) 
              this.getSingleProjectCost()
            } 
          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.myProjects.slice())
          );
          this.getProjectsLoading = false;
        }else{
          this.myProjects = [];
          this.getProjectsLoading = false;
        }
      },err=>{
        this._notify.openSnackbar('Error , Please Contact System Admistrator' , SnackBarState.Error , 3000)
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Error ${JSON.stringify(err['Error']['data'])} while Calling function getAllProjectWithClosed`,
          `${this.currentUser.key} Has Error while Calling function getAllProjectWithClosed`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Faild'
        ).subscribe()
      })
    }else if (this.currentUser.department == Department.TECHNICAL_TEAM && this.currentUser.accPosition == AccountPositions.MANAGER){
      this._db.getPMMyProjectsIncludeClosed(this.currentUser.key || '').subscribe(projects=>{        
        if(projects['status'] == ResStatus.CRUD){
          this.myProjects = projects['data'];
          this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.myProjects.slice())
          );
          this.getProjectsLoading = false;
        }else{
          this.myProjects = [];
          this.getProjectsLoading = false;
        }
      },err=>{
        this._notify.openSnackbar('Error , Please Contact System Admistrator' , SnackBarState.Error , 3000)
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Error ${JSON.stringify(err['Error']['data'])} while Calling function getAllProjectWithPM`,
          `${this.currentUser.key} Has Error while Calling function getAllProjectWithPM`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Faild'
        ).subscribe()
      })
    }
  }

  private _filter(title: string): Project[] {
    const filterValue = title.toLowerCase();

    return this.myProjects.filter(option => option.title.toLowerCase().includes(filterValue));
  }
  
  displayFn(project: Project): string {
    return project && project.title ? project.title : '';
  }


  getProjectTeam(){
    this._db.getProjectTeam(this.selectedProject.key).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.projectTeam = res['data']
        this.projectTeam = this.projectTeam.sort((a,b)=>{
          return compare(a.username, b.username, true);
        })
      }
    })
  }

  getFromHTML(e){  
    console.log(e.option.value.key);
    console.log(this.projectKey);
    
     
    this.getProjectCostForm.patchValue({
      'projectKey':e.option.value.key
    })
    this.getSingleProjectCost();
  }


  getProjectCostData(){
    const projcetKey = this.getProjectCostForm.get(['projectKey'])?.value;

    console.log(projcetKey);
    
    const myProject = this.myProjects.find(project=>project.key == projcetKey)
    console.log(myProject);
    if(!!myProject){
      this.selectedProject = myProject;
      
      this._db.getProjectProcess(this.selectedProject.key || '').subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.projectSubTasks = res['data'];
        }else{
          this.projectSubTasks = []
        }
      })
      this.getProjectTeam();
    }
    this._projectCost.getTotalProjectCost(projcetKey).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.projectTotalCost = res['data'];
        this.getDataLoader = false;
        this.selectedProject.progress ? (this.projectTotalCost.projectProgress = Math.round(this.selectedProject.progress ? this.selectedProject.progress : 0)):0
        this.startCounter();
        
      }else{
        this.getDataLoader = false;
      }
    },err=>{
      this.getDataLoader = false;
    })
  }


  getSingleProjectCost(){
    
    this.getDataLoader = true;
    const projcetKey = this.getProjectCostForm.get(['projectKey'])?.value;
    console.log(projcetKey);
    this._projectCost.getSingleProjectCost(projcetKey).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        
        const myCosts = res['data'] as singleProjectCost[];
        this.projectSingleCosts = myCosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.getChartOverEmps(this.projectSingleCosts );
        this.getChartOverProcess(this.projectSingleCosts ); 
        this.getProjectCostData();
      }
    })
    console.log(this.projectSingleCosts);
  }

  getChartOverEmps(costs:singleProjectCost[]){
    let labels:Date[] = [];
    let labelsInStr:string[] = [];
    let myDatasets:any = [];
    let empsKeys:string[] = [];
    let empsNames:string[] = [];
    for(let i in costs){
      const costMonth = new Date(costs[i].costDate).getMonth();
      const IfMonthExists = labels.find(month => month.getMonth() == costMonth)
      if(!IfMonthExists){
        labels.push(new Date(costs[i].costDate))
      }

      const IfEmpKeyExists = empsKeys.find(emp => emp == costs[i].empKey)
      if(!IfEmpKeyExists){
        empsKeys.push(costs[i].empKey)
        empsNames.push(costs[i].empName)
      }

    }
    labels = labels.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())    
    labels.map(lable=>labelsInStr.push(`${Months[new Date(lable).getMonth()]} ${new Date(lable).getFullYear()}`))
    this.getFinalProjectCostOverTime(costs , labels);

    for (let i in empsNames){
      const empLable = empsNames[i];
      const backgroundColor = this.getRandomColor(i)
      const data = costs.filter(cost => cost.empKey == empsKeys[i])
      let finalData:any = [];
      for (let d in labels){
        let monthAmount = 0;
        for (let e in data){
          if(new Date(data[e].costDate).getMonth() == new Date(labels[d]).getMonth()){
            monthAmount += data[e].costAmount;
          }
        }
        finalData.push(monthAmount)
      }
      myDatasets.push({
        label: empLable,
        backgroundColor: backgroundColor,
        data: finalData
      })
    }

    this.projectCostWithEmpOverTime = {
      labels: labelsInStr,
      datasets:myDatasets
    };
  }


  getFinalProjectCostOverTime(costs:singleProjectCost[] , dates:Date[]){    
    this.projectCostOverTime = [];
    for (let i in dates){
      const myCosts = costs.filter(cost=> `${new Date(cost.costDate).getMonth() - new Date(cost.costDate).getFullYear()}` == `${new Date(dates[i]).getMonth() - new Date(dates[i]).getFullYear()}`);      
      if(myCosts.length > 0){        
        let Idle_Hours:number = 0;
        let Incentive:number = 0;
        let Internet:number = 0;
        let Mobile:number = 0;
        let PublicRequest:number = 0;
        let Other:number = 0;
        let Transportation:number = 0;
        let salaries:number = 0;
        for (let r in myCosts){
          switch(myCosts[r].costType){
            case TypeOfCost.TRANSPORTATION:
              Transportation += myCosts[r].costAmount;
              break;
            case TypeOfCost.IDLE_HOURS:
              Idle_Hours += myCosts[r].costAmount;
              break;
            case TypeOfCost.INCENTIVE:
              Incentive += myCosts[r].costAmount;
              break;
            case TypeOfCost.INTERNET:
              console.log(myCosts[r]);
                            
              Internet += myCosts[r].costAmount;
              break;
            case TypeOfCost.MOBILE:
              Mobile += myCosts[r].costAmount;
              break;
            case TypeOfCost.SALARY:
              salaries += myCosts[r].costAmount;
              break;
            case TypeOfCost.OTHER:
              Other += myCosts[r].costAmount;
              break;
            case TypeOfCost.Public_Request:
              PublicRequest += myCosts[r].costAmount;
              break;
            default:
              break;
          }
        }
        const newSingleCost:SingleProjectCostOverTime ={
          date : `${Months[new Date(dates[i]).getMonth()]} ${new Date(dates[i]).getFullYear()}`,
          Idle_Hours : Idle_Hours,
          Incentive : Incentive,
          Internet : Internet, 
          Mobile : Mobile,
          Other : Other,
          Transportation:Transportation,
          PublicRequest:PublicRequest,
          salaries :salaries,
          Total : Idle_Hours + Incentive + Internet + Mobile + Other + Transportation + PublicRequest + salaries
        }
        this.projectCostOverTime.push(newSingleCost)

      }else{
        const newSingleCost:SingleProjectCostOverTime ={
          date : `${Months[new Date(dates[i]).getMonth()]} ${new Date(dates[i]).getFullYear()}`,
          Idle_Hours : 0,
          Incentive : 0,
          Internet : 0, 
          Mobile : 0,
          Other : 0,
          Transportation:0,
          PublicRequest:0,
          salaries :0,
          Total : 0
        }
        this.projectCostOverTime.push(newSingleCost)

      }

    }
  } 

  calcualteTotalCost(costType){
    let costs:number[] = [];
    switch(costType){
      case 'total':
        this.projectCostOverTime.map(cost => costs.push(cost.Total));
        break;
      case 'salaries':
        this.projectCostOverTime.map(cost => costs.push(cost.salaries));
        break;
      case 'Incentive':
        this.projectCostOverTime.map(cost => costs.push(cost.Incentive));
        break;
      case 'Idle_Hours':
        this.projectCostOverTime.map(cost => costs.push(cost.Idle_Hours));
        break;
      case 'Transportation':
        this.projectCostOverTime.map(cost => costs.push(cost.Transportation));
        break;
      case 'Mobile':
        this.projectCostOverTime.map(cost => costs.push(cost.Mobile));
        break;
      case 'Internet':
        this.projectCostOverTime.map(cost => costs.push(cost.Internet));
        break;
      case 'PublicRequest':
        this.projectCostOverTime.map(cost => costs.push(cost.PublicRequest));
        break;
      default:
        this.projectCostOverTime.map(cost => costs.push(cost.Other));
        break;
    }
    if(costs.length > 0){
      return costs.reduce((a, b) => a + b);
    }else{
      return 0;
    }
  }

  getChartOverProcess(costs:singleProjectCost[]){
    let labels:Date[] = [];
    let labelsInStr:string[] = [];
    let myDatasets:any = [];
    let processKeys:string[] = [];
    let processNames:string[] = [];
    for(let i in costs){
      const costMonth = new Date(costs[i].costDate).getMonth();
      const IfMonthExists = labels.find(month => month.getMonth() == costMonth)
      if(!IfMonthExists){
        labels.push(new Date(costs[i].costDate))
      }
      
   
      const IfProcessExists = processKeys.find(process => process == costs[i].processKey);
      if(!IfProcessExists){
        if(!!costs[i].processKey && !!costs[i].processTitle){
          processKeys.push(costs[i].processKey || '');
          processNames.push(costs[i].processTitle || '');
        }
      }
    }
    labels = labels.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())    
    labels.map(lable=>labelsInStr.push(`${Months[new Date(lable).getMonth()]} ${new Date(lable).getFullYear()}`))
    for (let i in processNames){      
      const processLable = processNames[i];
      const backgroundColor = this.getRandomColor(i)
      const data = costs.filter(cost => cost.processKey == processKeys[i])
      let finalData:any = [];
      for (let d in labels){
        let monthAmount = 0;
        for (let e in data){
          if(new Date(data[e].costDate).getMonth() == new Date(labels[d]).getMonth()){
            monthAmount += data[e].costAmount;
          }
        }
        finalData.push(monthAmount)
      }
      myDatasets.push({
        label: processLable,
        backgroundColor: backgroundColor,
        data: finalData
      })
    }

    this.projectCostWithProcessOverTime = {
      labels: labelsInStr,
      datasets:myDatasets
    };
    
  }
  addNewProjectCost(){
    const incentiveDate = `${new Date(this.newSingleProjectCostForm.get(['costDate'])?.value).getMonth() + 1 }/${new Date(this.newSingleProjectCostForm.get(['costDate'])?.value).getDate()}/${new Date(this.newSingleProjectCostForm.get(['costDate'])?.value).getFullYear()}`
    const newSinglePC:singleProjectCost = {
      empKey: this.newSingleProjectCostForm.get(['empKey'])?.value,
      empName: '',
      projectKey : this.selectedProject.key,
      processKey : this.newSingleProjectCostForm.get(['processKey'])?.value,
      costType: this.newSingleProjectCostForm.get(['costType'])?.value, //this.newSingleProjectCostForm.get(['costType'])?.value == 'partTime' ? 2 :  this.newSingleProjectCostForm.get(['costType'])?.value,
      costComment: this.newSingleProjectCostForm.get(['costComment'])?.value ,
      costDate: incentiveDate ,
      createdAt: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}` ,
      createdByKey: this.currentUser.key || '',
      createdByName: this.currentUser.username ,
      costAmount: this.newSingleProjectCostForm.get(['costAmount'])?.value,
    }
    this._projectCost.createNewSingleCost(newSinglePC).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.newSingleProjectCostForm.reset();
        this._notify.openSnackbar(`Cost Created Successfully` , SnackBarState.Success)
        this.getSingleProjectCost();
      }
    })
  }

  open(content) {    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',scrollable:true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  getRandomColor(index) {
    var colors = [
      '#513982',
      '#f4831f',
      '#707070',
      '#2c0d69',
      '#905017',
      '#1f1531',
      '#faa75e',
      '#9b6cf3',
      '#2b2a2a',
      '#5a0aee'
      ]
    if(!!colors[index]){
      return colors[index];
    }else{
      return colors[index - colors.length];
    }
  }


  editCost(){
    this.editMode = true;
  }

  getSumOfArrOfNums(arr:number[]){
    return arr.reduce((a, b) => a + b);
  }

  saveTotalCost(){
    this._db.updateProjectBudget(this.projectTotalCost.key  || '', this.projectTotalCost.budgetryCost || 0).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.editMode = false;
        this.startCounter()
      }
    })
  }
  cancelEditTotalCost(){
    this.editMode = false;
    this.projectTotalCost.budgetryCost = this.budgetryCost
    this.startCounter();
  }

  exportDevelopmentCost():void{
    let element = document.getElementById('developmentCost'); 
    this.excelServ.exportexcel(element , `Development Cost ${new Date().getFullYear()}-${new Date().getMonth() + 1}.xlsx`)
  }

  exportProcessCost():void{
    let element = document.getElementById('processCost'); 
    this.excelServ.exportexcel(element , `Process Cost ${new Date().getFullYear()}-${new Date().getMonth() + 1}.xlsx`)
  }
  

  exportCostLogs():void{
    let element = document.getElementById('costLogs'); 
    this.excelServ.exportexcel(element , `Cost Logs ${new Date().getFullYear()}-${new Date().getMonth() + 1}.xlsx`)
  }

  public openPDF():void {
    let DATA = document.getElementById('htmlData') as HTMLElement;
    console.log(DATA);
    
    html2canvas(DATA).then(canvas => {
        console.log(canvas);
        
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;
        
        const FILEURI = canvas.toDataURL('image/png')
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
        
        PDF.save(`Project ${this.selectedProject.title} Cost At ${new Date().toLocaleString()}.pdf`);
    });     
  }


  getColor(){
    const green = '#197900';
    const warning = '#cf0101';
    const moderate = '#f4831f';
    const exceeded = '#8a0000'
    
    if(!!this.projectTotalCost.budgetryCost){
      if(this.projectTotalCost.budgetryCost <= this.projectTotalCost.actualCost){
        return exceeded;
      }else{
        if((this.projectTotalCost.actualCost / this.projectTotalCost.budgetryCost) * 100 >= 90){
          return warning;
        }else if((this.projectTotalCost.actualCost / this.projectTotalCost.budgetryCost) * 100 < 90 && (this.projectTotalCost.actualCost / this.projectTotalCost.budgetryCost) * 100 >= 50){
          return moderate;
        }else{
          return green;
        }
      }
    }else{
      return moderate;
    }
    
  }

  deleteCost(cost:singleProjectCost){
    this._notify.openDialog(
      'Delete Cost?',
      `Are you sure you want to delete This Cost?`,
      false,
      '*By Deleting this cost you will affect on project cost',
      true,
      false).subscribe(response => {
        if (response) {
          this._projectCost.deleteSingleProjectCost(cost).subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.getSingleProjectCost();
              this._notify.openSnackbar(`Cost Deleted Successfully` , SnackBarState.Success)
            }
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
    
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}