import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Incentive, incentiveFinalStatus } from 'src/app/interfaces/Incentive';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Department, User } from 'src/app/interfaces/user';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { FinanceService } from 'src/app/services/finance.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-incentive-approved',
  templateUrl: './incentive-approved.component.html',
  styleUrls: ['./incentive-approved.component.scss']
})
export class IncentiveApprovedComponent implements OnInit {
  closeResult: string;
  date:Date = new Date();
  @Input() currentUser:User;
  incentiveForReview:Incentive;
  unPaidIncentive:Incentive[] = [];
  DepartmentEnum = Department;
  openForReview=false;
  constructor(private modalService: NgbModal,
              private _finance:FinanceService,
              private _excelServ:ExportExcelService,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    // this._salary.getUnPaidIncentive().subscribe(inc=>{
    //   this.unPaidIncentive = inc;
    // })
    this._finance.getUnPaidIncentive().subscribe(inc=>{
      if(inc['status'] == ResStatus.CRUD){
        this.unPaidIncentive = inc['data'];
      }
    })
  }

  openDialogForReview(content , incentive:Incentive) {
    this.openForReview=true;
    this.incentiveForReview = incentive;

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



  markAsDone(){ 
    this._notify.openDialog(
      'Mark As Done?',
      `Are you sure you want to Mark this as done?`,
      false,
      '* if you marked it as done you will never be able to download it as an excel anymore',
      true,
      false).subscribe(response => {
        if (response) {
          this.incentiveForReview.finalStatus = incentiveFinalStatus.PAID;
          this._finance.incentiveMarkAsDone(this.incentiveForReview.key || '').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              const i = this.unPaidIncentive.findIndex(pr => pr.key == this.incentiveForReview.key)
              this.unPaidIncentive.splice(i,1)
            }
          })
          // this._salary.updateFinishedIncentive(this.incentiveForReview).then(()=>{
          //   const newMessage:Notifying = {
          //     receverKey: this.incentiveForReview.empKey || '',
          //     receverName:this.incentiveForReview.empName,
          //     senderKey:this.incentiveForReview.financeDissisionKey || '',
          //     senderName:this.incentiveForReview.financeDissisionName || '',
          //     title:'incentive',
          //     body : `Incentive For Project ${this.incentiveForReview.projectName} Has Been Paid For You Please Check Your Bank Account`,
          //     redirection:`/`,
          //     senderImg : ''
          //   }
          //   this._message.createnotification(newMessage)
          // })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }



  exportUnpaidIncentive():void{
    let element = document.getElementById('unpaidIncentive'); 
    this._excelServ.exportexcel(element , `Unpaid Incentive${this.date.getFullYear()}-${this.date.getMonth() + 1}.xlsx`)
 }
}
