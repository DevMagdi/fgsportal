import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-new-installment',
  templateUrl: './new-installment.component.html',
  styleUrls: ['./new-installment.component.scss']
})
export class NewInstallmentComponent implements OnInit {  
  CurrencyList = CurrencyModule.CurrencyList;
  pageType:string;
  currentUser:User;
  newInstallmentLoader:boolean = false;
  InstallmentTypeEnum = InstallmentType;
  newDebitForm:FormGroup = new FormGroup({
    'title':new FormControl(null, Validators.required),
    'main_description':new FormControl(null),
    'installment_type_id':new FormControl(null, Validators.required),
    'total_amount':new FormControl(null, Validators.required),
    'payment_bank':new FormControl(null),
    'interest_amount':new FormControl(null),
    'down_payment_amount':new FormControl(null),
    'currency':new FormControl(this.CurrencyList[0].currencyCode, Validators.required),
    'installment_period_array':new FormArray([
      new FormGroup({
        'incoming_date':new FormControl(null,Validators.required),
        'installment_amount':new FormControl(null,Validators.required),
        'installment_description':new FormControl(null),
        'rowIndex':new FormControl(null),
      })
    ])
  })
  installment_period_array = this.newDebitForm.get('installment_period_array') as FormArray;

  loanCalculatorForm:FormGroup = new FormGroup({
    'amount':new FormControl(null ,Validators.required),
    'down_payment_amount':new FormControl(null),
    'interest_amount':new FormControl(null),
    'start_date':new FormControl(this._db.getDateFormattedYearMonthDay(new Date(new Date())),Validators.required),
    'type':new FormControl('3',Validators.required),
    'payment_type':new FormControl('period'),
    'payment_amount':new FormControl(null),
    'payment_period':new FormControl(null),
  })
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private _fin:FinanceService,
              private _router:Router,
              private _notify:NotificationService,
              private _route:ActivatedRoute) {}

  ngOnInit(): void {
    this.currentUser = history.state;
    // this._auth.user.subscribe(res=>{
    //   this.currentUser = res
    // })
    if(!this.currentUser.key){
      this.goBack();
    }else{
      this.pageType = this._route.snapshot.params.type
      if(this.pageType == 't'){
        this.newDebitForm.patchValue({
          'installment_type_id':InstallmentType.Installment
        })
      }else if(this.pageType == 'v'){
        this.newDebitForm.patchValue({
          'installment_type_id':InstallmentType.Investment
        })
        this.loanCalculatorForm.patchValue({
          'type':'0'
        })
      }
    }
  }
  
  goBack(){
    history.back();
  }


  // validateSum(amount,interest,downpayment,insts:Installments[]){
  //   this._notify.openDialog(
  //     'Invalid Sum?',
  //     `The Sum of installments not equal to total amount + Maintenance do you want to continue ?`,
  //     false,
  //     '',
  //     true,
  //     false).subscribe(response => {
  //       if (response) {
          
  //       } else {
  //         return this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  //       }
  //   });

  // }

  submitNewDebitForm(){
    this.newInstallmentLoader = true;
    const newdebit:Debit = {
      title:this.newDebitForm.get(['title'])?.value,
      main_description:this.newDebitForm.get(['main_description'])?.value,
      installment_type_id:this.newDebitForm.get(['installment_type_id'])?.value,
      total_amount:this.newDebitForm.get(['total_amount'])?.value,
      payment_bank:this.newDebitForm.get(['payment_bank'])?.value,
      interest_amount:this.newDebitForm.get(['interest_amount'])?.value,
      installment_period_array:this.newDebitForm.get(['installment_period_array'])?.value,
      currency:this.newDebitForm.get(['currency'])?.value,
      down_payment_amount:this.newDebitForm.get(['down_payment_amount'])?.value,
    };

    newdebit.installment_period_array.map(i=>i.incoming_date = this._db.getDateFormatted(i.incoming_date));

    this._fin.createDebit(newdebit).subscribe(res=>{
      this.newInstallmentLoader = false;
      if(res['status'] == ResStatus.CRUD){
        this._notify.openSnackbar('Success' , SnackBarState.Success,5000);
        this._router.navigate([`/manager/installments/${this.pageType}/${res['data']['id']}`]) 
      }else{
        this._notify.openSnackbar('Somethins wrong' , SnackBarState.Warning,5000);
      }
    },err=>{
      this.newInstallmentLoader = false;
      this._notify.openSnackbar('Error' , SnackBarState.Error,5000);
      console.log("error", err);
    })    
  }
  


  calculateLoanInstallments(){
    let amount = this.loanCalculatorForm.get(['amount'])?.value;
    let start_date = this.loanCalculatorForm.get(['start_date'])?.value;
    let type = this.loanCalculatorForm.get(['type'])?.value;
    let payment_type = this.loanCalculatorForm.get(['payment_type'])?.value;
    let payment_amount = this.loanCalculatorForm.get(['payment_amount'])?.value;
    let payment_period = this.loanCalculatorForm.get(['payment_period'])?.value;
    let interest_amount = this.loanCalculatorForm.get(['interest_amount'])?.value;
    let down_payment_amount = this.loanCalculatorForm.get(['down_payment_amount'])?.value;


    if(!!down_payment_amount && down_payment_amount>0){
      amount = amount - down_payment_amount;
    }



    // get number of installments;
    let numberOfInstallments = 0;
    if(type != '0'){
      if(payment_type == 'period'){
        numberOfInstallments = parseFloat((payment_period / type).toFixed(2));
      }else if(payment_type == 'amount'){
        numberOfInstallments = parseFloat((amount / payment_amount).toFixed(2));
      }
    }
    
    // get value for each installment;
    let valueOfEachInstallment:number = amount;

    if (numberOfInstallments != 0){
      valueOfEachInstallment  = parseFloat((amount / numberOfInstallments).toFixed(2));
    }

    // get installments;
    let inst :Installments[] = [];
    let nextDate = new Date(start_date);
    this.installment_period_array.clear();



    if(type == '0'){

      // Check if there is Down Payment amount;
      if(!!down_payment_amount && down_payment_amount > 0){
        const DownPaymentIns:Installments = {
          incoming_date:this._db.getDateFormattedYearMonthDay(nextDate),
          installment_amount:down_payment_amount,
          installment_description:'Down Payment Amount'
        }
        inst.push(DownPaymentIns)
        const newG = new FormGroup({
          'incoming_date':new FormControl(null,Validators.required),
          'installment_amount':new FormControl(null,Validators.required),
          'installment_description':new FormControl(null),
        })
        this.installment_period_array.push(newG);
      }
      

      // Push Installment;
      const ins:Installments = {
        incoming_date:this._db.getDateFormattedYearMonthDay(nextDate),
        installment_amount:valueOfEachInstallment,
      }
      inst.push(ins)
      const newG = new FormGroup({
        'incoming_date':new FormControl(null,Validators.required),
        'installment_amount':new FormControl(null,Validators.required),
        'installment_description':new FormControl(null),
      })
      this.installment_period_array.push(newG);

      
      // Check if there is interest amount;
      if(!!interest_amount && interest_amount > 0){
        const MaintenanceIns:Installments = {
          incoming_date:this._db.getDateFormattedYearMonthDay(nextDate),
          installment_amount:interest_amount,
          installment_description:'Maintenance Amount'
        }
        inst.push(MaintenanceIns)
        const newG = new FormGroup({
          'incoming_date':new FormControl(null,Validators.required),
          'installment_amount':new FormControl(null,Validators.required),
          'installment_description':new FormControl(null),
        })
        this.installment_period_array.push(newG);
      }
      
      // Finalize Installment;
      this.newDebitForm.patchValue({
        'installment_period_array':inst
      })
      console.log(inst,'What Happened',this.newDebitForm.get('installment_period_array')?.value);
      
      console.log(this.newDebitForm.get('installment_period_array')?.value);
      console.log('What Happened');
      
      
      this.installment_period_array = this.newDebitForm.get('installment_period_array') as FormArray;    

    }else{
      // Check if there is Down Payment amount;
      if(!!down_payment_amount && down_payment_amount > 0){
        const DownPaymentIns:Installments = {
          incoming_date:this._db.getDateFormattedYearMonthDay(nextDate),
          installment_amount:down_payment_amount,
          installment_description:'Down Payment Amount'
        }
        inst.push(DownPaymentIns)
        const newG = new FormGroup({
          'incoming_date':new FormControl(null,Validators.required),
          'installment_amount':new FormControl(null,Validators.required),
          'installment_description':new FormControl(null),
        })
        this.installment_period_array.push(newG);
      }
      for (let i= 0 ;i < numberOfInstallments;i++){
        if(i != 0 ){
          if(type == '1'){
            nextDate = new Date(nextDate.setMonth(nextDate.getMonth() + 1));
          }else if(type == '3'){
            nextDate = new Date(nextDate.setMonth(nextDate.getMonth() + 3));
          }else if(type == '6'){
            nextDate = new Date(nextDate.setMonth(nextDate.getMonth() + 6));
          }else if(type == '12'){
            nextDate = new Date(nextDate.setMonth(nextDate.getMonth() + 12));
          }
        }else{
          nextDate = new Date(start_date);
        }
        const ins:Installments = {
          incoming_date:this._db.getDateFormattedYearMonthDay(nextDate),
          installment_amount:valueOfEachInstallment,
        }
        inst.push(ins)
        const newG = new FormGroup({
          'incoming_date':new FormControl(null,Validators.required),
          'installment_amount':new FormControl(null,Validators.required),
          'installment_description':new FormControl(null),
        })
        this.installment_period_array.push(newG);   
      }

      // Check if there is interest amount;
      if(!!interest_amount && interest_amount > 0){
        const MaintenanceIns:Installments = {
          incoming_date:this._db.getDateFormattedYearMonthDay(nextDate),
          installment_amount:interest_amount,
          installment_description:'Maintenance Amount'
        }
        inst.push(MaintenanceIns)
        const newG = new FormGroup({
          'incoming_date':new FormControl(null,Validators.required),
          'installment_amount':new FormControl(null,Validators.required),
          'installment_description':new FormControl(null),
        })
        this.installment_period_array.push(newG);
      }

      this.newDebitForm.patchValue({
        'installment_period_array':inst
      })
      this.installment_period_array = this.newDebitForm.get('installment_period_array') as FormArray;    
    }   
  }


  delInstallment(i){
    this.installment_period_array.removeAt(i);
  }

  addInstallment(){
    const newG = new FormGroup({
      'incoming_date':new FormControl(null,Validators.required),
      'installment_amount':new FormControl(null,Validators.required),
      'installment_description':new FormControl(null),
    })
    this.installment_period_array.push(newG);
  }

  syncAmount(){
    this.loanCalculatorForm.patchValue({
      'amount':this.newDebitForm.get(['total_amount'])?.value,
      'down_payment_amount':this.newDebitForm.get(['down_payment_amount'])?.value,
      'interest_amount':this.newDebitForm.get(['interest_amount'])?.value
    })
  }


  reorder(){
    for(let i in this.installment_period_array.controls){
      this.installment_period_array.controls[i].patchValue({
        'rowIndex':parseInt(i)
      })
    }
  }
}
