import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PublicRequests, publicRequestsDepartment, publicRequestsFinalStatus } from 'src/app/interfaces/public-requests';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';

@Component({
  selector: 'app-requests-history',
  templateUrl: './requests-history.component.html',
  styleUrls: ['./requests-history.component.scss']
})
export class RequestsHistoryComponent implements OnInit {
  @Input() currentUser:User;
  
  requests:PublicRequests[] = [];
  publicRequestsDepartmentEnum = publicRequestsDepartment;
  publicRequestsFinalStatusEnum = publicRequestsFinalStatus;
  allDevs:User[] = [];
  filterForm:FormGroup;
  reqToReview:PublicRequests;
  approvedModal:boolean = false;
  DepartmentEnum = Department;
  constructor(private _excelServ:ExportExcelService,
              private _db:DatabaseService,
              private _auth:AuthApiService) { }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      'dept' : new FormControl(null),
      'from' : new FormControl(null),
      'to' : new FormControl(null),
      'empKey' : new FormControl(null)
    })

    if(!!this.currentUser && this.currentUser.department == Department.MANAGEMENT){
      this._auth.getAllUsers().subscribe(allUsers=>{
        if(allUsers['status'] == ResStatus.CRUD){
          this.allDevs = allUsers['data'].filter(u=>u.department != Department.MANAGEMENT);
        }
      })
    }
  }


  openModalToReview(request:PublicRequests){
    this.reqToReview = request;
    this.approvedModal = true;
  }


  filterRequestsHistory(){
    this.requests = [];
    const empKey = this.filterForm.get(['empKey'])?.value;
    const dept = this.filterForm.get(['dept'])?.value;
    const from = this.filterForm.get(['from'])?.value;
    const to = this.filterForm.get(['to'])?.value;
    this._db.publicRequestFilter(from,to,empKey,dept).subscribe(res=>{      
      if(res['status'] == ResStatus.CRUD){
        this.requests = res['data'];
      }
    })
  }

  resetFilter(){
    this.filterForm.reset();
    this.requests = [];
  }
  exportRequestsHistory():void{
    let element = document.getElementById('reqsHistory'); 
    this._excelServ.exportexcel(element , `Public Requests History${new Date().getFullYear()}-${new Date().getMonth() + 1}.xlsx`)
  }
}
