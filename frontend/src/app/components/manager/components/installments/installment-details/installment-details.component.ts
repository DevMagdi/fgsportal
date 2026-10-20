import { Component, OnInit ,EventEmitter,Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { CurrencyModule } from 'src/app/interfaces/currency.module';
import { Debit, InstallmentType, Installments } from 'src/app/interfaces/installments';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FinanceService } from 'src/app/services/finance.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-installment-details',
  templateUrl: './installment-details.component.html',
  styleUrls: ['./installment-details.component.scss']
})
export class InstallmentDetailsComponent implements OnInit {
  @Output() dropRow = new EventEmitter<any>();
  pageType:string;

  CurrencyList = CurrencyModule.CurrencyList;
  debitDetails:Debit;
  debitDetailsLoader:boolean = false;
  currentUser:User;
  nextPayment:Installments;
  paid:number = 0;
  newValue:string|number|Date = '';
  insInEditMode:boolean = false;
  instToEdit:Installments | undefined;
  instIndexToEdit:number | undefined;


  InstallmentTypeEnum = InstallmentType;
  debitOnEditMode:boolean = false;
  constructor(private _route: ActivatedRoute,
              private _auth :AuthApiService,
              private _fin:FinanceService,
              private _db:DatabaseService,
              private _router:Router,
              private _notify:NotificationService
              ) { }

  ngOnInit(): void {
    this.pageType = this._route.snapshot.params.type
    this.debitDetailsLoader = true;
    this._auth.user.subscribe(res=>{
      if(!!res){
        this.currentUser = res;
        // let perm:boolean = false;
        this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
          if(perms['status'] == ResStatus.CRUD){
            const userPerms = perms['data'];               
            const checking = userPerms.find(p=>p.permission_id == 18)
            if(!!checking){
              this.getDebitDetails();
            }else{
              this.notHavePermission();
            }
          }else{
            this.notHavePermission();
          }
        },err=>{
          console.log(err); 
          this.notHavePermission();
        })
      }else{
        this.notHavePermission();
      }
    })
  }

  notHavePermission(){
    this._db.createSystemLogs(
      `${this.currentUser.username} Tried To Access Installemtnts page At ${new Date().toLocaleString()}`,
      `${this.currentUser.key} Tried To Access Installemtnts page At ${new Date().toLocaleString()}`,
      this.currentUser.key || '',
      this.currentUser.username,
      'Faild'
    ).subscribe(res=>{
      this._notify.openSnackbar(`You Don't Have Permission To Access This Page ,please contact system Administration` , SnackBarState.Warning , 10000)
      this._router.navigate(['/']) 
    })
  }


  getDebitDetails(){
    this.debitDetailsLoader = true;
    const debit_id =  this._route.snapshot.params.id;
    this._fin.getDebitDetails(debit_id).subscribe(res=>{
      this.debitDetailsLoader = false;
      if(res['status']==ResStatus.CRUD){
        this.debitDetails = res['data'][0];
        if(!!this.debitDetails && this.debitDetails.installment_period_array.length > 0){
          this.debitDetails.installment_period_array.map(i=>i.is_paid == 0? i.is_paid = false : i.is_paid = true)
          this.debitDetails.installment_period_array.sort((a,b)=>{
            return compare(a.rowIndex || 0, b.rowIndex || 0, true);
          })
        }
        this.getNextPayment();
        this.getPaid();
      }
    },err=>{
      console.log(err);
      this.debitDetailsLoader = false;
    })
  }


  getPaid(){
    const t:any = this.debitDetails.total_amount
    const r = this.debitDetails.remaining ? this.debitDetails.remaining : 0
    this.paid = t-r; 
  }


  getNextPayment(){   
    let unpaid =  this.debitDetails.installment_period_array.filter(p=>p.is_paid == 0)
    unpaid.sort((a, b) => new Date(a.incoming_date).getTime() - new Date(b.incoming_date).getTime());
    // return unpaid[0]
    this.nextPayment = unpaid[0]
  }


  deleteInstallment(ins_id:string){
    this._notify.openDialog(
      'Delete Installment?',
      `Are you sure you want to Delete Installment?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this._fin.deleteInstallment(ins_id).subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.getDebitDetails();
              this._notify.openSnackbar('Deleted')
            }
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }
  
  addInstallment(){
    const newIns:Installments = {
      incoming_date:this._db.getDateFormattedYearMonthDay(new Date()),
      installment_amount:0
    }
    this.debitDetails.installment_period_array.push(newIns)
    this.editInst(newIns, this.debitDetails.installment_period_array.length - 1)
  }
  cancelEdit(){   
    if(!!this.instToEdit && !!this.instToEdit.id){
      this.insInEditMode = false;
      this.instToEdit = undefined;
      this.instIndexToEdit = undefined;
    }else{
      this.debitDetails.installment_period_array.splice(this.instIndexToEdit||this.debitDetails.installment_period_array.length-1,1)
      this.insInEditMode = false;
      this.instToEdit = undefined;
      this.instIndexToEdit = undefined;
    }

  }

  editInst(ins:Installments,i:number){
    this.insInEditMode = true;
    this.instToEdit = ins;
    this.instIndexToEdit = i;
  }

  changePaidStatus(ins:Installments){
    this.instToEdit = ins;
    ins.is_paid = !ins.is_paid
    this.updateInstallments(ins)
  }

  saveEdit(ins:Installments){
    if(!!ins.id){
      this.updateInstallments(ins)
    }else{
      this.createNewInstallment(ins)
    }
  }

  saveEditResorting(){
    for (let i in this.debitDetails.installment_period_array){
      this.debitDetails.installment_period_array[i].rowIndex = parseInt(i);
    }
    this.updateDebit();    
  }

  createNewInstallment(ins:Installments){
    console.log(ins);
    ins.installment_id = this.debitDetails.id;
    ins.incoming_date = this._db.getDateFormatted(ins.incoming_date)
    this.debitDetailsLoader = true;    
    this._fin.createInstallment(ins).subscribe(res=>{
      this.debitDetailsLoader = false;
      if(res['status'] == ResStatus.CRUD){
        this._notify.openSnackbar(`Done` , SnackBarState.Success, 5000)
        this.cancelEdit();
        // this.getNextPayment();
        this.getDebitDetails();
      }else{
        this._notify.openSnackbar(`Something Wrong` , SnackBarState.Warning, 5000)
      }
    },err=>{
      this.debitDetailsLoader = false;
      this._notify.openSnackbar(`Error` , SnackBarState.Error, 5000)
      console.log(err);
    })
  }

  updateInstallments(ins:Installments){
    this.debitDetailsLoader = true;    
    this._fin.UpdateInstallment(ins).subscribe(res=>{
      this.debitDetailsLoader = false;
      if(res['status'] == ResStatus.CRUD){
        this._notify.openSnackbar(`Done` , SnackBarState.Success, 5000)
        this.cancelEdit();
        // this.getNextPayment();
        this.getDebitDetails();
      }else{
        this._notify.openSnackbar(`Something Wrong` , SnackBarState.Warning, 5000)
      }
    },err=>{
      this.debitDetailsLoader = false;
      this._notify.openSnackbar(`Error` , SnackBarState.Error, 5000)
    })
  }

  // updateInstallments(ins:Installments ,editedField:string ){
  //   this.debitDetailsLoader = true;
  //   let editParams:{[k:string]:any } = {}
  //   switch (editedField){
  //     case 'in_status':
  //       editParams.is_paid = ins.is_paid;
  //       break;
  //     case 'in_amount':
  //       editParams.installment_amount = ins.installment_amount;
  //       break;
  //     case 'in_date':
  //       editParams.incoming_date = ins.incoming_date;
  //       break;
  //     case 'in_desc':
  //       editParams.installment_description = ins.installment_description;
  //       break;
  //   }
    
  //   this._fin.UpdateInstallment(ins.id ||'', editParams).subscribe(res=>{
  //     this.debitDetailsLoader = false;
  //     if(res['status'] == ResStatus.CRUD){
  //       this._notify.openSnackbar(`Done` , SnackBarState.Success, 5000)
  //       this.getNextPayment();
  //     }else{
  //       this._notify.openSnackbar(`Something Wrong` , SnackBarState.Warning, 5000)
  //     }
  //   },err=>{
  //     this.debitDetailsLoader = false;
  //     this._notify.openSnackbar(`Error` , SnackBarState.Error, 5000)
  //   })
  // }

  updateDebit(){
    this.debitDetailsLoader = true;
    // Get Type Name 
    const indexOfS = Object.values(InstallmentType).indexOf(this.debitDetails.installment_type_id as unknown as InstallmentType);
    this.debitDetails.installment_type_name = Object.keys(InstallmentType)[indexOfS];
    
    this._fin.UpdateDebit(this.debitDetails).subscribe(res=>{
      this.debitDetailsLoader = false;
      if(res['status'] == ResStatus.CRUD){
        this._notify.openSnackbar(`Done` , SnackBarState.Success, 5000)
        // this.debitDetails = res['data'];
        this.debitOnEditMode = false;
        this.getNextPayment();
        this.getPaid();
      }else{
        this._notify.openSnackbar(`Something Wrong` , SnackBarState.Warning, 5000)
      }
    },err=>{
      this.debitDetailsLoader = false;
      this._notify.openSnackbar(`Error` , SnackBarState.Error, 5000)
    })
  }


  deletDebit(){
    this._notify.openDialog(
      'Delete?',
      `Are you sure you want to Delete?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this._fin.deleteDebit(this.debitDetails.id || '').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this._notify.openSnackbar('Deleted')
              this._router.navigate(['/manager/installments'])
            }
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }


  goBack(){
    history.back()
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}