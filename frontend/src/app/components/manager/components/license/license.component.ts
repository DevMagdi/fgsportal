import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { License, LicenseStatus, licenseType, LicenseUpdates } from 'src/app/interfaces/license';
import { Partner, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Products } from 'src/app/interfaces/products';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {
  @ViewChild('mymodal') modal; 
  
  licenses: License[] = [];
  loading: boolean = true;
  allClients:Partner[] = [];
  closeResult:string;
  // licenseTypeEnum = licenseType;
  licenseTypes:licenseType[] = []
  licenseImage: File | null;
  urls: string;
  uploading:boolean = false;
  currentUser:User;
  // licenseProductEnum = licenseProduct;
  products:Products[] = []

  licenseHistory:LicenseUpdates[] = [];

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    ['clean']                                         // remove formatting button
  ];

  quillOPT ={
    toolbar: this.toolbarOptions
  }
  newLicenseForm:FormGroup = new FormGroup({
    // 'accountName' : new FormControl(null , Validators.required),
    'type' : new FormControl(null , Validators.required),
    'start' : new FormControl(null , Validators.required),
    'end' : new FormControl(null , Validators.required),
    'product' : new FormControl(null , Validators.required),
    'client' : new FormControl(null),
    'comment' : new FormControl(null),
  })

  ticketDisplay=false;
  constructor(private modalService: NgbModal,
              private _auth:AuthApiService,
              private _db:DatabaseService,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      this.getAllLicense()
    })
  }


  getAllLicense(){
    this._db.getAllLicense().subscribe(l=>{
      // console.log(l);
      
      if(l['status'] == ResStatus.CRUD){
        this.licenses = l['data'];
        // this.getRunningLicenseHistory();
      }else{
        this.licenses = [];
      }
    },err=>{
      console.log(err);
      this.licenses = [];
    })
  }


  // getRunningLicenseHistory(){
  //   this.licenses.map(l=>{      
  //     const getUpdates:Subscription = this.db.getUpdatesByLicenseKey(l.key || '').subscribe(updates=>{
  //       getUpdates.unsubscribe();
  //       const active  = updates.find(u=>u.status == LicenseStatus.Active)
  //       if(!!active){
  //         l.startDate = new Date(active.startDate);
  //         l.endDate = new Date(active.endDate);
  //         l.status = active.status;
  //         if(new Date(l.endDate) < new Date()){
  //           active.status = LicenseStatus.Expired
  //           this.db.updateLicenseUpdates(active).then(()=>{
  //             this.getRunningLicenseHistory();
  //             // const newNotificationToPM:Notifying = {
  //             //   title : `License Expired`,
  //             //   body : `${l.accountName} License Is Expired`,
  //             //   receverKey : active.createdByKey, 
  //             //   receverName : active.createdByName, 
  //             //   senderKey : this.currentUser.key || '',
  //             //   senderName: this.currentUser.username,
  //             //   senderImg: this.currentUser.photoURL ? this.currentUser.photoURL :  'https://bootdey.com/img/Content/avatar/avatar7.png',
  //             //   redirection:`/manager/license/${l.key}`
  //             // }
  //             // this._message.createnotification(newNotificationToPM)
  //           })
  //         }
  //       }else{
  //         const lastExpired  = updates.map(function(e) { return e }).sort().reverse()[0]
  //         if(!!lastExpired){
  //           l.startDate = new Date(lastExpired.startDate);
  //           l.endDate = new Date(lastExpired.endDate);
  //           l.status = lastExpired.status;
  //         }
  //       }
  //     })
  //   })
  // }

  // getRunningUpdate(isStart:boolean , key:string){
  //   const runningUpdate = this.licenseHistory.find(u=>u.licenseKey == key)    
  //   if(!!runningUpdate){
  //     if(isStart == true){
  //       this.licenseHistory.find(u=>u.licenseKey == key)
  //       return runningUpdate.startDate
  //     }else{
  //       return runningUpdate.endDate
  //     }
  //   }return ''
  // }



  getClients(){
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

  validateDate(){
    this.submitNewLicense();
  }


  getDateFormatted(date){
    const day = `${new Date(date).getDate()}`;
    const month = `${new Date(date).getMonth() + 1}`;
    const year = `${new Date(date).getFullYear()}`;
    return `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year}`
  }

  submitNewLicense(){
    const fd : FormData = new FormData()
    fd.append('partner_id' , this.newLicenseForm.get(['client'])?.value)
    fd.append('product_id' , this.newLicenseForm.get(['product'])?.value)
    fd.append('license_type_id' , this.newLicenseForm.get(['type'])?.value)
    fd.append('license_start_date' , this.getDateFormatted(this.newLicenseForm.get(['start'])?.value))
    fd.append('license_end_date' , this.getDateFormatted(this.newLicenseForm.get(['end'])?.value))
    fd.append('license_comment' , this.newLicenseForm.get(['comment'])?.value)
    fd.append('license_status_id' , LicenseStatus.Active)
    if(this.licenseImage){
      fd.append('license_attach' , this.licenseImage);
    }
    console.log(fd);

    this._db.createLicense(fd).subscribe(res=>{
      console.log(res);      
      if(res['status']==ResStatus.CRUD){
        this._notify.openSnackbar('Image Updated', SnackBarState.Success)
        this.newLicenseForm.reset();
        this.urls = '';
        this.licenseImage = null;
        this.modalService.dismissAll(this.modal)
        this.getAllLicense();  
      }
    },err=>{
      console.log(err);
      this._notify.openSnackbar("Error , Please Contact System Adminstration" ,SnackBarState.Error)
    })
  }

  submitNewLicenseold(){
    const newLicense:License={
      // accountName:this.newLicenseForm.get(['accountName'])?.value,
      type:this.newLicenseForm.get(['type'])?.value,
      // startDate:`${new Date(this.newLicenseForm.get(['start'])?.value).getMonth()+1}/${new Date(this.newLicenseForm.get(['start'])?.value).getDate()}/${new Date(this.newLicenseForm.get(['start'])?.value).getFullYear()}`,
      // endDate:`${new Date(this.newLicenseForm.get(['end'])?.value).getMonth()+1}/${new Date(this.newLicenseForm.get(['end'])?.value).getDate()}/${new Date(this.newLicenseForm.get(['end'])?.value).getFullYear()}`,
      createdByKey:this.currentUser.key||'',
      createdByName:this.currentUser.username,
      product:this.newLicenseForm.get(['product'])?.value
    }

    const client = this.allClients.find(c=>c.id == this.newLicenseForm.get(['client'])?.value)
    if(!!client){
      newLicense.clientKey = client.id
      newLicense.clientName = client.partner_name
      newLicense.clientLogo = !!client.partner_photoURL ? client.partner_photoURL :''
    }

    if(!!this.newLicenseForm.get(['comment'])?.value){
      newLicense.comment = this.newLicenseForm.get(['comment'])?.value;

    }
    
    
    // this.db.createNewLicense(newLicense).then(l=>{
    //   console.log(l.key);
    //   newLicense.key = l.key;
    //   this.db.updateLicense(newLicense , this.licenseImage).then(()=>{

    //     const licenseUpdate:LicenseUpdates ={
    //       licenseKey:newLicense.key || '',
    //       startDate:`${new Date(this.newLicenseForm.get(['start'])?.value).getMonth()+1}/${new Date(this.newLicenseForm.get(['start'])?.value).getDate()}/${new Date(this.newLicenseForm.get(['start'])?.value).getFullYear()}`,
    //       endDate:`${new Date(this.newLicenseForm.get(['end'])?.value).getMonth()+1}/${new Date(this.newLicenseForm.get(['end'])?.value).getDate()}/${new Date(this.newLicenseForm.get(['end'])?.value).getFullYear()}`,
    //       createdByKey:newLicense.createdByKey ,
    //       createdByName:newLicense.createdByName,
    //       status:LicenseStatus.Active,
    //       notifiedByEnding:false
    //     }

    //     this.db.createNewLicenseUpdate(licenseUpdate).then(()=>{
    //       this.newLicenseForm.reset();
    //       this.urls;
    //       this.licenseImage;
    //       this.modalService.dismissAll(this.modal)
    //     })

        
    //   })
     

    // })


    // if(!!this.licenseImage){
    //   this.loading = true;
    //   this.db.createNewLicense(newLicense , this.licenseImage).then(l=>{
    //     console.log(l.subscribe(u=>{
    //       console.log(u);
    //     }));

    //     this.newLicenseForm.reset();
    //     this.urls;
    //     this.licenseImage;
    //     this.loading = false;
    //     this.modalService.dismissAll(this.modal)
    //   })
    // }else{
    //   this.db.createNewLicense(newLicense).then(l=>{
    //     console.log(l);
    //     this.newLicenseForm.reset();
    //     this.urls;
    //     this.licenseImage;
    //     this.modalService.dismissAll(this.modal)
  
    //   })
    // }

    
  }


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


  imagesupload(event: any) {
    if (event.target.files) {
      this.urls;
      for (let i = 0; i < event.target.files.length; i++) {
        this.licenseImage = event.target.files[i]
        var reader = new FileReader()
        reader.readAsDataURL(event.target.files[i])
        reader.onload = (event: any) => {
          this.urls = event.target.result;
        }
      }
    }
  }


  getDateAfterYear(){
    // const dateAfterYear = `${new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 1)).getMonth()+1}/${new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 1)).getDate()}/${new Date(new Date(currentDate).setFullYear(new Date(currentDate).getFullYear() + 1)).getFullYear()}`  
    const currentDate = new Date(this.newLicenseForm.get(['start'])?.value)
    const yestrdayDate = new Date(new Date(currentDate).setDate(currentDate.getDate() - 1))
    const dateAfterYear = new Date(new Date(yestrdayDate).setFullYear(yestrdayDate.getFullYear() + 1))
    const dateAfterYear_STR = `${dateAfterYear.getMonth()+1}/${dateAfterYear.getDate()}/${dateAfterYear.getFullYear()}`   
    this.newLicenseForm.patchValue({
      'end': dateAfterYear_STR
    })
  }

  // getStatus(status:LicenseStatus){
  //   if(status == LicenseStatus.Expired){
  //     return 'Expired'
  //   }else{
  //     return 'Active'
  //   }
  // }

}
