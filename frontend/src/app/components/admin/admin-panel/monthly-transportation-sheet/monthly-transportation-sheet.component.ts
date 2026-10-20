import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResStatus } from 'src/app/interfaces/res-status';
import { transportaionFinalStatus, Transportations } from 'src/app/interfaces/transportations';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';

@Component({
  selector: 'app-monthly-transportation-sheet',
  templateUrl: './monthly-transportation-sheet.component.html',
  styleUrls: ['./monthly-transportation-sheet.component.scss']
})
export class MonthlyTransportationSheetComponent implements OnInit {

  getTransForm:FormGroup;
  users:User[] = [];
  transportations:Transportations[] = [];

  displayedColumns: string[] = ['Name', 'Date', 'From', 'To', 'Purpose', 'Project', 'Amount','Status' ];



  constructor(private _db:DatabaseService,
              private _auth:AuthApiService,
              private excelServ:ExportExcelService) { }

  ngOnInit(): void {
    this._auth.getAllUsers().subscribe(
      (users)=>{
        if(users['status'] == ResStatus.CRUD){
          this.users = users['data'];
        }
      }
    )
    // this.auth.getAllUsers().subscribe(
    //   (users)=>{
    //     this.users = users;
    //   }
    // )
    this.getTransForm = new FormGroup({
      'fromDate':new FormControl(null , Validators.required),
      'toDate':new FormControl(null , Validators.required),
      'devKey' : new FormControl(null , Validators.required)
    })
  }






  getTransportations(){    
    this._db.getTransportationInDuration(this.getTransForm.get('fromDate')?.value , this.getTransForm.get('toDate')?.value,this.getTransForm.get('devKey')?.value).subscribe(
      (transportations)=>{           
        if(transportations['status'] == ResStatus.CRUD){
          this.transportations = transportations['data']
        } else if(transportations['status'] == ResStatus.Success_But_Empty){
          this.transportations = []
        }   
      }
    )
    // this.db.getTransportationInDuration(this.getTransForm.get('fromDate')?.value , this.getTransForm.get('toDate')?.value).subscribe(
    //   (transportations)=>{        
    //     if(this.getTransForm.get('devKey')?.value == 'all'){
    //       this.transportations = transportations.filter(trans=>trans.finalStatus == transportaionFinalStatus.Approved);
    //     }else{
    //       this.transportations = transportations.filter(trans=>trans.finalStatus == transportaionFinalStatus.Approved && trans.empKey == this.getTransForm.get('devKey')?.value);          
    //     }        
    //   }
    // )
  }


  exportDevsMonthlyReport():void{
    let element = document.getElementById('monthlyTransportations');
    const fileName= `From ${this.getTransForm.get('fromDate')?.value} To ${this.getTransForm.get('toDate')?.value} .xlsx`;
    this.excelServ.exportexcel(element , `Monthly Transportations ${fileName}`)
  }


}
