import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { License, LicenseStatus, licenseType, LicenseUpdates } from 'src/app/interfaces/license';
import { Products } from 'src/app/interfaces/products';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Department, Partner, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-license-details',
  templateUrl: './license-details.component.html',
  styleUrls: ['./license-details.component.scss']
})
export class LicenseDetailsComponent implements OnInit {
  @ViewChild('mymodal') modal; 
  @ViewChild('historyModal') historyModal; 

  licenseDetails:License;
  currentUser:User;
  AccountRolesEnum = AccountRoles;
  DepartmentEnum = Department;
  AccPositionEnum = AccountPositions;
  closeResult:string;
  allClients:Partner[] = [];
  // licenseTypeEnum = licenseType;
  licenseTypes:licenseType[] = []
  products:Products[] = []

  licenseImage: File | null;
  uploading:boolean = false;
  // licenseProductEnum = licenseProduct;
  licenseUpdates:LicenseUpdates[] = [];
  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    ['clean']                                         // remove formatting button
  ];

  quillOPT ={
    toolbar: this.toolbarOptions
  }
  editLicenseForm:FormGroup = new FormGroup({
    // 'accountName' : new FormControl(null , Validators.required),
    'type' : new FormControl(null , Validators.required),
    'start' : new FormControl(null , Validators.required),
    'end' : new FormControl(null , Validators.required),
    'product' : new FormControl(null , Validators.required),
    'client' : new FormControl(null),
    'comment' : new FormControl(null),
    'imgURL' : new FormControl(null)
  })

  editLicenseHistoryForm:FormGroup = new FormGroup({
    'history':new FormControl(null),
    'start' : new FormControl(null , Validators.required),
    'end' : new FormControl(null , Validators.required)
  })
  newServerApi = environment.newServerApi;
  constructor(private route: ActivatedRoute,
              private modalService: NgbModal,
              private router:Router,
              private _notify:NotificationService,
              private _auth:AuthApiService,
              private _db:DatabaseService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(u=>{
      this.currentUser = u;
      this.getCurrentLicense()
    })
  }

  getAllClient(){
    this._db.getAllPartners(false).subscribe(clients=>{
      if(clients['status'] == ResStatus.CRUD){
        this.allClients = clients['data'];
      }else{
        this.allClients = [];
      }
    },err=>{
      console.log(err);
      this.allClients = [];
    })
  }

  // editLicenseHistory(history:LicenseUpdates){
  //   this.editLicenseHistoryForm.patchValue({
  //     'history' : history,
  //     'start' : new Date(history.startDate),
  //     'end' : new Date(history.endDate),
  //   })
  // }

  // submitEditHistory(){
  //   const historyToEdit = this.editLicenseHistoryForm.get(['history'])?.value
  //   historyToEdit.startDate = `${new Date(this.editLicenseHistoryForm.get(['start'])?.value).getMonth()+1}/${new Date(this.editLicenseHistoryForm.get(['start'])?.value).getDate()}/${new Date(this.editLicenseHistoryForm.get(['start'])?.value).getFullYear()}`
  //   historyToEdit.endDate = `${new Date(this.editLicenseHistoryForm.get(['end'])?.value).getMonth()+1}/${new Date(this.editLicenseHistoryForm.get(['end'])?.value).getDate()}/${new Date(this.editLicenseHistoryForm.get(['end'])?.value).getFullYear()}`
  //   this.db.updateLicenseUpdates(historyToEdit).then(()=>{
  //     this.editLicenseHistoryForm.reset();
  //     this.modalService.dismissAll(this.historyModal)
  //   })
  // }

  getDateFormatted(date){
    const day = `${new Date(date).getDate()}`;
    const month = `${new Date(date).getMonth() + 1}`;
    const year = `${new Date(date).getFullYear()}`;
    return `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year}`
  }
  
  renewLicense(){
    this._notify.openDialog(
      'Renew License?',
      `Are you sure you want to Renew this License?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          if(!!this.licenseDetails.endDate){
            const newStartDate = new Date(new Date(new Date(this.licenseDetails.endDate).setDate(new Date(this.licenseDetails.endDate).getDate() + 1)))
            const newEndDate = this.getDateAfterYear(newStartDate)
            const fd : FormData = new FormData()
            fd.append('license_start_date' , this.getDateFormatted(newStartDate))
            fd.append('license_end_date' , this.getDateFormatted(newEndDate))
            fd.append('license_id' , this.licenseDetails.key || '')
            this._db.renewLicense(fd).subscribe(res=>{
              if(res['status'] == ResStatus.CRUD){
                console.log(res);
                this.getCurrentLicense();
              }
            })
          }


        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

  getDateAfterYear(date?:Date){
    if(!!date){
      const currentDate = new Date(date)
      const yestrdayDate = new Date(new Date(currentDate).setDate(currentDate.getDate() - 1))
      const dateAfterYear = new Date(new Date(yestrdayDate).setFullYear(yestrdayDate.getFullYear() + 1))
      const dateAfterYear_STR = `${dateAfterYear.getMonth()+1}/${dateAfterYear.getDate()}/${dateAfterYear.getFullYear()}`
      return dateAfterYear_STR
    }else{
      const currentDate = new Date(this.editLicenseForm.get(['start'])?.value)
      const yestrdayDate = new Date(new Date(currentDate).setDate(currentDate.getDate() - 1))
      const dateAfterYear = new Date(new Date(yestrdayDate).setFullYear(yestrdayDate.getFullYear() + 1))
      const dateAfterYear_STR = `${dateAfterYear.getMonth()+1}/${dateAfterYear.getDate()}/${dateAfterYear.getFullYear()}`
      return dateAfterYear_STR
    }
    // const currentDate = new Date(date)
    // const dateAfterYear = `${new Date(new Date(date).setDate(new Date(date).getDate() - 1)).getMonth()+1}/${new Date(new Date(date).setDate(new Date(date).getDate() - 1)).getDate()}/${new Date(new Date(date).setFullYear(new Date(date).getFullYear() + 1)).getFullYear()}`  

  }


  deleteLicense(){
    this._notify.openDialog(
      'Delete License?',
      `Are you sure you want to Delete this License?`,
      false,
      '*By clicking yes this License will be deleted forever',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deleteLicense(this.licenseDetails.key || '').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this._notify.openSnackbar(`Deleted` , SnackBarState.Success)
              this.router.navigate(['/manager/license'])
            }
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

  editLicense(){
    // this.getAllClient();
    this.getLicenstType();
    this.getProduct();
    this.getAllClient();
    this.editLicenseForm.patchValue({
      // 'accountName' : this.licenseDetails.accountName,
      'type' : this.licenseDetails.type,
      'client' : this.licenseDetails.clientKey,
      'comment' : this.licenseDetails.comment,
      'product':this.licenseDetails.product,
    })

    if(this.licenseDetails.fileURL){
      this.editLicenseForm.patchValue({
        'imgURL' : `${this.newServerApi}${this.licenseDetails.fileURL}`,
      })
    }
    if(this.licenseDetails.startDate){
      this.editLicenseForm.patchValue({
        'start' : new Date(this.licenseDetails.startDate),
      })
    }
    if(this.licenseDetails.endDate){
      this.editLicenseForm.patchValue({
        'end' : new Date(this.licenseDetails.endDate),
      })
    }
  }

  submitEditLicense(){
    this.uploading = true;
    const fd : FormData = new FormData()
    fd.append('partner_id' , this.editLicenseForm.get(['client'])?.value)
    fd.append('product_id' , this.editLicenseForm.get(['product'])?.value)
    fd.append('license_type_id' , this.editLicenseForm.get(['type'])?.value)
    fd.append('license_start_date' , this.getDateFormatted(this.editLicenseForm.get(['start'])?.value))
    fd.append('license_end_date' , this.getDateFormatted(this.editLicenseForm.get(['end'])?.value))
    fd.append('license_comment' , this.editLicenseForm.get(['comment'])?.value)
    fd.append('license_status_id' , LicenseStatus.Active)
    fd.append('license_id' , this.licenseDetails.key || '')

    if(this.licenseImage){
      fd.append('license_attach' , this.licenseImage);
    }
    console.log(fd);

    this._db.updateLicense(fd).subscribe(res=>{
      console.log(res);      
      if(res['status']==ResStatus.CRUD){
        this._notify.openSnackbar('License Updated', SnackBarState.Success)
        this.editLicenseForm.reset();
        this.licenseImage = null;
        this.uploading = false;
        this.getCurrentLicense();
        this.modalService.dismissAll(this.modal)
      }
    },err=>{
      console.log(err);
      this._notify.openSnackbar("Error , Please Contact System Adminstration" ,SnackBarState.Error)
    })
  }


  open(content) {
    this.modalService.open(content, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
  getCurrentLicense() {
    const licenseID = this.route.snapshot.params.id
    this._db.getLicenseByID(licenseID).subscribe(license => {
      console.log(license);
      if(license['status'] == ResStatus.CRUD){
        this.licenseDetails = license['data'];
        if(!!this.licenseDetails.license_history){
          this.licenseUpdates = this.licenseDetails.license_history.reverse();
        }
        // this.db.getUpdatesByLicenseKey(this.licenseDetails.key || '').subscribe(updates=>{
        //   this.licenseUpdates = updates.reverse();       
        // })
      }
    })
  }

  // getType(type:licenseType){
  //   if(type == licenseType.Perpetual){
  //     return 'Perpetual'
  //   }else{
  //     return 'Subscription'
  //   }
  // }

  getLicenstType(){
    this._db.getLicenseTypes().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.licenseTypes = res['data']
      }
    })
  }


  getProduct(){
    this._db.getAllProducts().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.products = res['data']
      }
    })
  }


  getRunningUpdate(isStart:boolean){
    const runningUpdate = this.licenseUpdates.find(u=>u.status == LicenseStatus.Active)    
    if(!!runningUpdate){
      if(isStart == true){
        return runningUpdate.startDate
      }else{
        return runningUpdate.endDate
      }
    }else{
      const lastExpired  = this.licenseUpdates.map(function(e) { return e }).sort().reverse()[0]
      if(!!lastExpired){
        if(isStart == true){
          return lastExpired.startDate
        }else{
          return lastExpired.endDate
        }
      }
    }return ""
  }

  // getStatus(status:LicenseStatus){
  //   if(status == LicenseStatus.Active){
  //     return 'Active'
  //   }else{
  //     return 'Expired'
  //   }
  // }

  imagesupload(event: any) {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.licenseImage = event.target.files[i]
        var reader = new FileReader()
        reader.readAsDataURL(event.target.files[i])
        reader.onload = (event: any) => {
          this.editLicenseForm.patchValue({
            'imgURL' : event.target.result
          })
        }
      }
    }
  }
}
