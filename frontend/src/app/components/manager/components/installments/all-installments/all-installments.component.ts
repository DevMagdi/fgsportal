import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { CurrencyModule } from 'src/app/interfaces/currency.module';
import { InstallmentType, Installments, investmentDashboard } from 'src/app/interfaces/installments';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FinanceService } from 'src/app/services/finance.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-all-installments',
  templateUrl: './all-installments.component.html',
  styleUrls: ['./all-installments.component.scss']
})
export class AllInstallmentsComponent implements OnInit {
  CurrencyList = CurrencyModule.CurrencyList;
  currentUser:User;
  installmentLoader:boolean = false;
  pendingInstallments:Installments[] = [];
  installmentTypesEnum = InstallmentType;
  investmentDashboard:investmentDashboard = {
    paid_amount:0,
    pending_amount:0,
    total_amount:0,
    insterest_amount:0
  };

  pageType:string;
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private _fin:FinanceService,
              private _router:Router,
              private _notify:NotificationService,
              private _route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.installmentLoader = true;
    this._auth.user.subscribe(res=>{
      if(!!res){
        this.currentUser = res;
        // let perm:boolean = false;
        this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
          if(perms['status'] == ResStatus.CRUD){
            const userPerms = perms['data'];               
            const checking = userPerms.find(p=>p.permission_id == 18)
            if(!!checking){
              this._route.params.subscribe(p=>{
                this.pageType = this._route.snapshot.params.type;
                if(this.pageType != 't' && this.pageType != 'v'){
                  history.back();
                }else{
                  this.installmentLoader = true;
                  this.investmentDashboard = {
                    paid_amount:0,
                    pending_amount:0,
                    total_amount:0,
                    insterest_amount:0
                  }
                  this.pendingInstallments = [];
                  this.getAllInstallments();
                  this.getDashboard();
                }
              })
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
  goBack(){
    history.back();
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

  // checkPerm():any{
  //   this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
  //     if(perms['status'] == ResStatus.CRUD){
  //       const userPerms = perms['data'];               
  //       const checking = userPerms.find(p=>p.permission_id == 18)
  //       if(!!checking){
  //         return true;
  //       }else{
  //         return false;
  //       }
  //     }else{
  //       return false;
  //     }
  //   },err=>{
  //     console.log(err); 
  //     return false;
  //   })
  // }

  getDashboard(){
    let getType =''
    if(this.pageType == 't'){
      getType = InstallmentType.Installment
    }else if(this.pageType == 'v'){
      getType = InstallmentType.Investment
    }
    this._fin.getInstallmentDashboardByType(getType).subscribe(res=>{
      this.installmentLoader = false;
      if(res['status'] == ResStatus.CRUD){
        this.investmentDashboard = res['data'];
        if(!!this.investmentDashboard['exchange_rates']){
          const rates = this.investmentDashboard['exchange_rates'];
          for (let i in rates){     
            const myi = this.CurrencyList.findIndex(c=>c.currencyCode == i);                   
            if(myi != undefined && myi != null){
              this.CurrencyList[myi].exchangeRate = rates[i];//rates['EGP'] /  rates[i]
            }
          }
        }
      }
    })
  }


  getAllInstallments(){
    let getType =''
    if(this.pageType == 't'){
      getType = InstallmentType.Installment
    }else if(this.pageType == 'v'){
      getType = InstallmentType.Investment
    }
    this._fin.getAllInstallmentByType(getType).subscribe(res=>{
      this.installmentLoader = false;
      if(res['status'] == ResStatus.CRUD){
        console.log(res['data']);
        this.pendingInstallments = res['data'];
      }
    })
  }

  clear(table: Table) {
    table.clear();
  }
}
