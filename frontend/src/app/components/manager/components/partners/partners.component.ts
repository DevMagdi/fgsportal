import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { CurrencyModule } from 'src/app/interfaces/currency.module';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Client, Department, MobileNumber, OrganizationTypes, Partner, PartnerIndustry, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent implements OnInit {
  @ViewChild('mymodal') modal; 
  CurrencyList = CurrencyModule.CurrencyList;

  allPartners:Partner[] = [];
  currentUser:User;
  closeResult:string;
  DepartmentEnum = Department;
  partnerIndustry:PartnerIndustry[] = [];

  newPartnerForm:FormGroup = new FormGroup({
    'partner_name' : new FormControl(null , Validators.required),
    'partner_address' : new FormControl(null),
    'partner_description' : new FormControl(null),
    'partner_photoURL' : new FormControl(null),
    'industry' : new FormControl(null,Validators.required),
    'partner_email' : new FormControl(null),
    'partner_phone' : new FormControl(null),
    'country' : new FormControl(this.CurrencyList[0].countryCode),
    'organize_type_id' : new FormControl(null),
    'website' : new FormControl(null),


    'email' : new FormControl(null),
    'password' : new FormControl(null),
    'fullname' : new FormControl(null),
    'phone' : new FormControl(null),
    'isActive' : new FormControl(true),
    'addPrimaryContactWithPartner' : new FormControl(false, Validators.required),
  })

  newServerApi = environment.newServerApi;
  organizationTypes:OrganizationTypes[]=[];

  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private modalService: NgbModal,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      this.getAllPartners();
    })


    
  }


  getAllPartnerIndustry(){
    this._db.getPartnersIndustry().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.partnerIndustry = res['data']
      }
    })
  }

  getAllOrganizationTypes(){
    this._db.getAllOrganizationTypes().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.organizationTypes = res['data']
      }else{
        this.organizationTypes = [];
      }
    },err=>{
      this.organizationTypes = [];
    })
  }


  openCreatePartner(){
    this.getAllPartnerIndustry();
    this.getAllOrganizationTypes();
    this.newPartnerForm.get('addPrimaryContactWithPartner')?.valueChanges
      .subscribe(value => {
        if(value == true) {
          this.newPartnerForm.get('email')?.setValidators(Validators.required)
          this.newPartnerForm.get('password')?.setValidators(Validators.required)
          this.newPartnerForm.get('fullname')?.setValidators(Validators.required)
          this.newPartnerForm.get('isActive')?.setValidators(Validators.required)
        } else {
          this.newPartnerForm.get('email')?.clearValidators();
          this.newPartnerForm.get('email')?.setErrors(null);

          this.newPartnerForm.get('password')?.clearValidators();
          this.newPartnerForm.get('password')?.setErrors(null);

          this.newPartnerForm.get('fullname')?.clearValidators();
          this.newPartnerForm.get('fullname')?.setErrors(null);

          this.newPartnerForm.get('isActive')?.clearValidators();
          this.newPartnerForm.get('isActive')?.setErrors(null);
          
          this.newPartnerForm.updateValueAndValidity();
        }
      }
    );
  }
  

  getAllPartners(){
    this._db.getAllPartners(false).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.allPartners = res['data']
      }
    })
  }

  addPartner(){
    const newPartner:Partner = {
      partner_name:this.newPartnerForm.get(['partner_name'])?.value,
      is_org:false
    }
    if(!!this.newPartnerForm.get(['partner_address'])?.value){
      newPartner.partner_address = this.newPartnerForm.get(['partner_address'])?.value
    }

    if(!!this.newPartnerForm.get(['partner_description'])?.value){
      newPartner.partner_description = this.newPartnerForm.get(['partner_description'])?.value
    }

    if(!!this.newPartnerForm.get(['partner_photoURL'])?.value){
      newPartner.partner_photoURL = this.newPartnerForm.get(['partner_photoURL'])?.value
    }

    if(!!this.newPartnerForm.get(['industry'])?.value){
      newPartner.partner_industry_id = this.newPartnerForm.get(['industry'])?.value
    }


    if(!!this.newPartnerForm.get(['partner_email'])?.value){
      newPartner.email = this.newPartnerForm.get(['partner_email'])?.value
    }
    if(!!this.newPartnerForm.get(['partner_phone'])?.value){
      newPartner.phone = this.newPartnerForm.get(['partner_phone'])?.value
    }
    
    if(!!this.newPartnerForm.get(['country'])?.value){
      newPartner.country = this.newPartnerForm.get(['country'])?.value
    }
    
    if(!!this.newPartnerForm.get(['organize_type_id'])?.value){
      newPartner.organize_type_id = this.newPartnerForm.get(['organize_type_id'])?.value
    }
    if(!!this.newPartnerForm.get(['website'])?.value){
      newPartner.website = this.newPartnerForm.get(['website'])?.value
    }

    this._db.createPartner(newPartner).subscribe(res=>{
      console.log(res);
      if(res['status'] == ResStatus.CRUD){ 
        this._db.createSystemLogs(`${this.currentUser.username} Created New Partnert / ${newPartner.partner_name}` , `${this.currentUser.key} Created New Partnert / ${newPartner.partner_name}`, this.currentUser.key || '', this.currentUser.username , 'Success').subscribe(res=>{
        },console.log)

        if(this.newPartnerForm.get('addPrimaryContactWithPartner')?.value == true){
          const newPrimaryContact:Client = {
            email:this.newPartnerForm.get(['email'])?.value,
            password:this.newPartnerForm.get(['password'])?.value,
            fullname:this.newPartnerForm.get(['fullname'])?.value,
            active:this.newPartnerForm.get(['isActive'])?.value,
            primary : true,
            partner_id:res['data'].id,
            hamada:true
          }
          if(!!this.newPartnerForm.get(['phone'])?.value){
            const newPhone:MobileNumber = {
              phone:this.newPartnerForm.get(['phone'])?.value,
              phone_type:'phone'
            }
            newPrimaryContact.phone = [newPhone];
          }
          this._db.createPrimaryContact(newPrimaryContact).subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.getAllPartners()
              this.newPartnerForm.reset();
              this.modalService.dismissAll(this.modal)
              this._notify.openSnackbar('Success' , SnackBarState.Success)
            }else{        
              this._notify.openSnackbar(`Error ${res['data']}`, SnackBarState.Error)
            }
          },err=>{
            if(err['status']==ResStatus.ValidationError){
              this._notify.openSnackbar(`Error ${err['error']['data']}`, SnackBarState.Error)
            }
          })
        }else{
          this._notify.openSnackbar('Success' , SnackBarState.Success)
          this.getAllPartners()
          this.newPartnerForm.reset();
          this.modalService.dismissAll(this.modal)
        }


      }else{        
        this._notify.openSnackbar(`Error ${res['data']}`, SnackBarState.Error)
      }
    },err=>{
      if(err['status']==ResStatus.ValidationError){
        this._notify.openSnackbar(`Error ${err['error']['data']}`, SnackBarState.Error)
      }

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
}
