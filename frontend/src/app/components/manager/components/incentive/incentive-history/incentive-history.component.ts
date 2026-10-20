import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Incentive, incentiveFinalStatus } from 'src/app/interfaces/Incentive';
import { Project } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-incentive-history',
  templateUrl: './incentive-history.component.html',
  styleUrls: ['./incentive-history.component.scss']
})
export class IncentiveHistoryComponent implements OnInit {
  closeResult: string;

  @Input() currentUser:User;
  incentiveHistory:Incentive[] = [];
  filterForm:FormGroup;

  myProjects:Project[] = [];
  allDevs:User[] = [];
  date:Date = new Date();
  incentiveForReview:Incentive;
  DepartmentEnum = Department;
  incentiveStatusEnum = incentiveFinalStatus;
  openForReview=false;
  constructor(private _excelServ:ExportExcelService,
              private _auth:AuthApiService,
              private _db:DatabaseService,
              private _finance:FinanceService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      'projectKey' : new FormControl(null),
      'from' : new FormControl(null),
      'to' : new FormControl(null),
      'empKey' : new FormControl(null),
      'status' : new FormControl(null)
    })


    if(this.currentUser.department == Department.MANAGEMENT || this.currentUser.department == Department.ADMINSTRATION){

      this._db.getAllProjects().subscribe(projects=>{
        if(projects['status'] == ResStatus.CRUD){
          this.myProjects = projects['data'];
        }
      })

      this._auth.getUserByFilter(Department.TECHNICAL_TEAM).subscribe(devs=>{
        if(devs['status'] == ResStatus.CRUD){
          this.allDevs = devs['data'];
        }
      })

      // this.db.getAllProjects().subscribe(projects=>{
      //   this.myProjects = projects;
      // })

      // this.auth.getMyDevs().subscribe(devs=>{
      //   this.allDevs = devs;
      //   this.auth.getMyBAnalysis().subscribe(bas=>{
      //     bas.map(ba=>this.allDevs.push(ba));
      //   })
      // })
    }else if(this.currentUser.accPosition == AccountPositions.MANAGER){
      // this.db.getPMProjects(this.currentUser.key || '').subscribe(projects=>{
      //   this.myProjects = projects;
      // })

      this._db.getPMMyProjects(this.currentUser.key || '').subscribe(projects=>{
        if(projects['status'] == ResStatus.CRUD){
          this.myProjects = projects['data'];
        }
      })

      this._auth.getUserByFilter(Department.TECHNICAL_TEAM).subscribe(devs=>{
        if(devs['status'] == ResStatus.CRUD){
          this.allDevs = devs['data'];
        }
      })

      // this.auth.getMyDevs().subscribe(devs=>{
      //   this.allDevs = devs;
      //   this.auth.getMyBAnalysis().subscribe(bas=>{
      //     bas.map(ba=>this.allDevs.push(ba));
      //   })
      // })
    }
  }



  

  openDatePicker(picker) {
    picker.open();
  }

  closeDatePicker(eventData: any, from:boolean , picker?:any) {
    if(from){
      this.filterForm.patchValue({
        'from' : eventData
      })
    }else{
      this.filterForm.patchValue({
        'to' : eventData
      })
    }
    picker.close();    
  }

  filterIncentiveHistory(){
    this.incentiveHistory = [];
    const from = this.filterForm.get(['from'])?.value
    const to = this.filterForm.get(['to'])?.value
    const projectKey = this.filterForm.get(['projectKey'])?.value
    const empKey = this.filterForm.get(['empKey'])?.value
    const status = this.filterForm.get(['status'])?.value
    this._finance.getIncentiveHistory(empKey , projectKey , from , to ,status).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.incentiveHistory = res['data'];
      }
    })
  }
  // filterIncentiveHistory(){
  //   const empKey = this.filterForm.get(['empKey'])?.value;
  //   const projectKey = this.filterForm.get(['projectKey'])?.value;
  //   let from;
  //   let to;
  //   if(!!this.filterForm.get(['from'])?.value){
  //     from = `${new Date(this.filterForm.get(['from'])?.value).getMonth() + 1}/${new Date(this.filterForm.get(['from'])?.value).getDate()}/${new Date(this.filterForm.get(['from'])?.value).getFullYear()}`;
  //   }

  //   if(!!this.filterForm.get(['to'])?.value){
  //     to = `${new Date(this.filterForm.get(['to'])?.value).getMonth() + 1}/${new Date(this.filterForm.get(['to'])?.value).getDate()}/${new Date(this.filterForm.get(['to'])?.value).getFullYear()}`;
  //   }    
    
  //   if(!!empKey){
  //     this._salary.getIncentiveHistoryByEmp(empKey).subscribe(incs=>{ 
  //       let filterdIncentive:Incentive[] = [];
  //       if(!!from || !!to){
  //         if(!!from && !!to){
  //           filterdIncentive =  incs.filter(inc=>new Date(inc.date) >= new Date(from) && new Date(inc.date) <= new Date(to));
  //         }else if((!!from && !to) || (!from && !!to)){
  //           if(!!from && !to){
  //             filterdIncentive =  incs.filter(inc=>new Date(inc.date) >= new Date(from));
  //           }else if(!from && !!to){
  //             filterdIncentive =  incs.filter(inc=>new Date(inc.date) <= new Date(to));
  //           }
  //         }
  //       }else{
  //         filterdIncentive = incs;
  //       }
  //       if(!!projectKey){
  //         filterdIncentive = filterdIncentive.filter(inc=> inc.projectKey == projectKey);
  //       }
        
  //       this.incentiveHistory = filterdIncentive;
  //     })
  //   }else if(!!from || !!to){
  //     if(!!from && !!to){
  //       this._salary.getIncentiveHistoryByDate(from , to).subscribe(incs=>{ 
  //         if(!!projectKey){
  //           this.incentiveHistory =  incs.filter(inc=>inc.projectKey == projectKey);
  //         }else{
  //           this.incentiveHistory = incs;
  //         }
  //       })
  //     }else if((!!from && !to) || (!from && !!to)){
  //       if(!!from && !to){
  //         this._salary.getIncentiveHistoryByOneDate(from , true).subscribe(incs=>{ 
  //           if(!!projectKey){
  //             this.incentiveHistory =  incs.filter(inc=>inc.projectKey == projectKey);
  //           }else{
  //             this.incentiveHistory = incs;
  //           }
  //         })
  //       }else if(!from && !!to){
  //         this._salary.getIncentiveHistoryByOneDate(to , false).subscribe(incs=>{ 
  //           if(!!projectKey){
  //             this.incentiveHistory =  incs.filter(inc=>inc.projectKey == projectKey);
  //           }else{
  //             this.incentiveHistory = incs;
  //           }
  //         })
  //       }
  //     }
  //   }else if(!!projectKey){
  //     this._salary.getIncentiveHistoryByProject(projectKey).subscribe(incs=>{
  //       this.incentiveHistory = incs;
  //     })
  //   }else if(!empKey && !projectKey && !from && !to){
  //     if(this.currentUser.department == Department.MANAGEMENT || this.currentUser.department == Department.ADMINSTRATION){
  //       this._salary.getAllIncentiveHistory().subscribe(incs=>{
  //         this.incentiveHistory = incs;
  //       })
  //     }else if(this.currentUser.accPosition == AccountPositions.MANAGER){
  //       this._salary.getIncentiveHistoryByCreator(this.currentUser.key).subscribe(incs=>{
  //         this.incentiveHistory = incs;
  //       })
  //     }
  //   }

    
  // }

  resetFilter(){
    this.filterForm.reset();
    this.incentiveHistory = [];
  }

  exportincentiveHistory():void{
    let element = document.getElementById('incentiveHistory'); 
    this._excelServ.exportexcel(element , `Incentive History${this.date.getFullYear()}-${this.date.getMonth() + 1}.xlsx`)
  }


  openDialogForReview(content , incentive:Incentive) {
    this.incentiveForReview = incentive;
    this.openForReview=true
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
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

}
