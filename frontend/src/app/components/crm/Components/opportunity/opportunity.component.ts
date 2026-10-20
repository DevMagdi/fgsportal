// import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivityTypes, Contacts, Labels, LeadsAndContacts, LeadsAndContactsSubStatus, LeadsAndContactsTypes, PocRequests, PocRequestStatus, ProcessDetails, RequestForPocPriority, RequestForPocStatus } from 'src/app/interfaces/leadsAndContacts';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Department, MobileNumber, OrganizationTypes, Partner, PartnerIndustry, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Products } from 'src/app/interfaces/products';
import { Table } from 'primeng/table';
import { CurrencyModule } from 'src/app/interfaces/currency.module';
import { Campaign } from 'src/app/interfaces/campaign';
@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.scss']
})
export class OpportunityComponent implements OnInit {
  CurrencyList = CurrencyModule.CurrencyList;
  allSales:User[] = [];

  leadsSubStatus:LeadsAndContactsSubStatus[] = [];
  myLeads:LeadsAndContacts[] = []; 
  currentUser:User;
  selectedLeads:LeadsAndContacts[] = [];
  draggedLead: LeadsAndContacts | null;
  convertLoading:boolean = false;
  pipeView:boolean = true;
  listView:boolean = false;
  ActivityTypesEnum = ActivityTypes;
  viewOptions = [
    {'icon':'pi pi-align-list coloredIcon','view': 'pipe'},
    {'icon':'pi pi-align-table coloredIcon','view': 'list'},
  ];
  allPartners: Partner[] = [];
  allCampaign:Campaign[]=[];

  filteredOptions: Observable<Partner[]> | undefined;
  newLeadForm:FormGroup = new FormGroup({
    'lead_sub_status_id':new FormControl(null),
    'contact_lead_id':new FormControl(null),
    'partner_id':new FormControl(null),
    'contact_id':new FormControl(null),
    'campaign_id':new FormControl(null),
    'sales_id':new FormControl(null),
    'type_id':new FormControl(null , Validators.required),
    'product_id':new FormControl(null),
    'title':new FormControl(null , Validators.required),
    // 'address':new FormControl(null),
    // 'phone':new FormControl(null),
    'notes':new FormControl(null , Validators.required),
    'cost':new FormControl(null),
    // 'Email':new FormControl(null),
    'labels':new FormControl(null),
    'expected_close_date':new FormControl(new Date()),
    'selectedCurrency':new FormControl(this.CurrencyList[0]),
  })

  addNewOrgnization:boolean = false;
  subStatusLoading:boolean = false;
  contactSubStatus:LeadsAndContactsSubStatus[] = [];
  salesTeam:User[] = [];
  products:Products[] = [];
  contactTypes:LeadsAndContactsTypes[] = [];
  lables:Labels[] = [];
  departmentEnum = Department;
  AccountPositionsEnum = AccountPositions;
  // contactPhones:MobileNumber[] = [{phone:'',phone_type:'Work'}];
  /* request POC Section */
  addLead=false;
  requestPOCForm:FormGroup = new FormGroup({
    'product_id':new FormControl(null,Validators.required),
    'title':new FormControl(null,Validators.required),
    'description':new FormControl(null),
    'contact_lead_id':new FormControl(null),
    'request_poc_status_id':new FormControl(null),
    'request_poc_priority_id':new FormControl(null,Validators.required),
    'process':new FormArray([
      new FormGroup({
        process_title: new FormControl('',Validators.required),
        process_description: new FormControl(''),
        process_department: new FormControl('',Validators.required)
      })
    ]),
  })

  process = this.requestPOCForm.get('process') as FormArray;

  requestForPocStatus:RequestForPocStatus[] = [];
  requestForPocPriority:RequestForPocPriority[] = [];

  pocRequests:PocRequests[]=[];
  activeIndex: number = 0;
  requestForPOCAttaches:File[]=[];

  selectedElement:LeadsAndContacts;

  newOrgAdded:boolean = false;

  partnerIndustry:PartnerIndustry[] = [];

  newPartnerForm:FormGroup = new FormGroup({
    'partner_name' : new FormControl(null , Validators.required),
    'partner_address' : new FormControl(null),
    'partner_description' : new FormControl(null),
    'partner_photoURL' : new FormControl(null),
    'industry' : new FormControl(null,Validators.required),
    'email' : new FormControl(null),
    'phone' : new FormControl(null),
    'country' : new FormControl(this.CurrencyList[0].countryCode),
    'organize_type_id' : new FormControl(null),
    'website' : new FormControl(null),
    'sales_id' : new FormControl(null),

  })
  newPartnerFormopened:boolean = false;
  contactLoading:boolean = false;
  myPersonContacts:Contacts[] = [];
  newContactFormopened:boolean=false;

  newPersonContactForm:FormGroup = new FormGroup({
    'name':new FormControl(null, Validators.required),
    'partner_id':new FormControl(null, Validators.required),
    'email':new FormControl(null),
    'address':new FormControl(null),
    'title':new FormControl(null),
    'phones':new FormArray([
      new FormGroup({
        'phone':new FormControl(null,Validators.required),
        'phone_type':new FormControl(null,Validators.required),
        'extend':new FormControl(null),

      })
    ])
  })
  phones = this.newPersonContactForm.get('phones') as FormArray;
  filteredContacts: any[];
  activeLeadCurrency:string[]=[];
  organizationTypes:OrganizationTypes[]=[];


   /* request RFP Section */

   requestRFPForm:FormGroup = new FormGroup({
    'title':new FormControl(null,Validators.required),
    'comment':new FormControl(null),
    'approval_ids':new FormControl(null,Validators.required)
  })

  requestForRFPAttaches:File[]=[];
  myRFPConfigList:User[] = [];

  constructor(private _db:DatabaseService,
              private _auth:AuthApiService,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      this.getLeadSubstatusByStatusid();
      this.getAllProducts();
    })
  }

  changeView(viewOpt:string){
    this.convertLoading = true;
    if(viewOpt == 'pipe'){
      this.pipeView = true;
      this.listView = false;
      document.getElementById('pipeView')?.classList.add('viewActive')
      document.getElementById('listView')?.classList.remove('viewActive')
      this.convertLoading = false;
    }else if(viewOpt == 'list'){
      this.listView = true;
      this.pipeView = false;
      document.getElementById('listView')?.classList.add('viewActive')
      document.getElementById('pipeView')?.classList.remove('viewActive')
      this.convertLoading = false;
    }
  }

  getLeadSubstatusByStatusid(){
    this._db.getLeadAndContactSubStatus('3').subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.leadsSubStatus = res['data']
        this.getMyLeads();
      }
    })
  }

  getAllSales(){
    this._auth.getUserByFilter(Department.Business_Development,AccountRoles.SALES).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.allSales = res['data']
      }else{
        this.allSales =[];
      }
    },err=>{
      this.allSales =[];
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

  getLeadCurrecny(){
    for(let i in this.myLeads){
      if(!!this.myLeads[i].currency){
        if(this.activeLeadCurrency.length ==0){
          this.activeLeadCurrency.push(this.myLeads[i].currency||'')
        }else{
          if(!this.activeLeadCurrency.includes(this.myLeads[i].currency||'')){
            this.activeLeadCurrency.push(this.myLeads[i].currency||'')
          }
        }
      }
    }
    let c_string = '';

    for (let i in this.activeLeadCurrency){
      if(i == '0'){
        c_string = this.activeLeadCurrency[i];
      }else{
        c_string = `${c_string},${this.activeLeadCurrency[i]}`;
      }
    }    
    let url = document.location.hostname;
    if(url !='localhost'){
      this._db.getCurrencyExchangeRate(c_string).subscribe(res=>{
        if(!!res['rates']){
          
          const rates = res['rates'];
          for (let i in rates){     
            const myi = this.CurrencyList.findIndex(c=>c.currencyCode == i);                   
            if(myi != undefined && myi != null){
              this.CurrencyList[myi].exchangeRate = rates[i];//rates['EGP'] /  rates[i]
            }
          }
        }
        
      })
    }
  }
  getMyLeads(){
    if(this.currentUser.department == Department.MANAGEMENT|| this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER){
      this._db.getAllLeads().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myLeads = res['data']
          this.myLeads.forEach(l => l.next_action_date = new Date(l.next_action_date?l.next_action_date:new Date()));
          this.getLeadCurrecny()
        }else{
          this.myLeads = [];
        }
      })
    }else if(this.currentUser.department == Department.Business_Development && this.currentUser.accRole == AccountRoles.SALES){
      this._db.getMyLeads().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myLeads = res['data']
          this.getLeadCurrecny()

        }else{
          this.myLeads = [];
        }
      })
    }else if(this.currentUser.department == Department.Business_Development && this.currentUser.accRole == AccountRoles.MARKITING){
      this._db.getMyLeads().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myLeads = res['data']
          this.getLeadCurrecny()

        }else{
          this.myLeads = [];
        }
      })
    }else{
      this._auth.getUserPermissionsByKey(this.currentUser.key||'').subscribe(perms=>{
        if(perms['status'] == ResStatus.CRUD){
          const userPerms = perms['data'];               
          const checking = userPerms.find(p=>p.permission_id == 15)
          if(!!checking){
            this._db.getAllLeads().subscribe(res=>{
              if(res['status'] == ResStatus.CRUD){
                this.myLeads = res['data']
                this.myLeads.forEach(l => l.next_action_date = new Date(l.next_action_date?l.next_action_date:new Date()));
                this.getLeadCurrecny()
              }else{
                this.myLeads = [];
              }
            })
          }
        }
      },err=>{
        console.log(err); 
      }) 
    }
  }

  drop(event: CdkDragDrop<LeadsAndContacts[]>) {
    this.convertLoading = true;
    let newList = parseInt(event.container.id.replace('cdk-drop-list-',''))
    const oldList = parseInt(event.previousContainer.id.replace('cdk-drop-list-',''))
    const element = parseInt(event.item.element.nativeElement.id.replace('mylead',''))
    if(!this.leadsSubStatus[newList]){
      newList = newList - this.leadsSubStatus.length;
    }    
    if(newList != oldList){
      this.myLeads[element].lead_sub_status_id = this.leadsSubStatus[newList].id
      if(this.myLeads[element].lead_sub_status_id == '6'){
        this.selectedElement = this.myLeads[element]; 
        this.openRequestForPOCModal();
        document.getElementById('openPocReqBTN')?.click();
      }else if(this.myLeads[element].lead_sub_status_id == '7'){
        this.selectedElement = this.myLeads[element]; 
        document.getElementById('openRFPReqBTN')?.click();
      }

      let editParams:{[k:string]:any } = {}
      editParams.lead_sub_status_id = this.myLeads[element].lead_sub_status_id;
      this._db.updateContactLead(this.myLeads[element].id || '', editParams).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.getMyLeads();
          this.convertLoading = false;
        }else{
          this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`,SnackBarState.Warning, 5000)
          this.convertLoading = false;
        }
      },err=>{
        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`,SnackBarState.Error, 5000)
        this.convertLoading = false;
      })
      // else{
        
      // }
    }else{
      this.convertLoading = false;
    }
  } 

  getElemWidth(){    
    return `${100 / this.leadsSubStatus.length}%`
  }
  getNumOfLeads(status_id:string){
    const l = this.myLeads.filter(l=>l.lead_sub_status_id == status_id)
    return l ? l.length : 0
  }
  getTotalCost(status_id:string){
    const l = this.myLeads.filter(l=>l.lead_sub_status_id == status_id)
    let totalCost:number = 0;
    if(l.length > 0){
      l.map(le=>{
        if(!!le.cost){
          if(!!le.currency){
            const myi = this.CurrencyList.findIndex(c=>c.currencyCode == le.currency);
            if(myi != undefined && myi != null){
              let er = 1;
              if(!!this.CurrencyList[myi].exchangeRate){
                er = this.CurrencyList[myi].exchangeRate as number;
              }
  
              if(typeof(le.cost) ==='string'){
                return totalCost += parseInt(le.cost)/er;
              }else{
                return totalCost += le.cost/er;
              }
            }else{
              if(typeof(le.cost) ==='string'){
                return totalCost += parseInt(le.cost);
              }else{
                return totalCost +=le.cost;
              }
            } 
          }else{
            if(typeof(le.cost) ==='string'){
              return totalCost += parseInt(le.cost);
            }else{
              return totalCost +=le.cost;
            }
          }
        }else{
          return 0;
        }
      })
    }
    return totalCost
  }


  openAddLeadForm(){
    this.convertLoading = true;
    this.getLeadSubStatusByStatus('3')
    this.getAllPartners()
    this.openSalesEdit();
    this.getAllProducts();
    this.openEditLabel();
    this.getAllTypes();
    this.getAllCampaigns();


    this.convertLoading = false;
   
  }
  
  openAddLeadFormFromIcon(index){
    this.openAddLeadForm();
    setTimeout(() => {
      this.selectSteps(index)
    }, 1000);
  }

  createNewLead(){
    const newContact:LeadsAndContacts={
      title : this.newLeadForm.get(['title'])?.value,
      lead_type_id:this.newLeadForm.get(['type_id'])?.value,
      notes:this.newLeadForm.get(['notes'])?.value,
      isLead:true,
      contact_id:this.newLeadForm.get(['contact_id'])?.value.id,
    }

    if(!!this.newLeadForm.get(['campaign_id'])?.value){
      newContact['campaign_id'] = this.newLeadForm.get(['campaign_id'])?.value;
    }
    if(!!this.newLeadForm.get(['product_id'])?.value){
      newContact['product_id'] = this.newLeadForm.get(['product_id'])?.value;
    }


    if(!!this.newLeadForm.get(['lead_sub_status_id'])?.value){
      newContact['lead_sub_status_id'] = this.newLeadForm.get(['lead_sub_status_id'])?.value;
    }

    if(!!this.newLeadForm.get(['sales_id'])?.value){
      newContact['sales_id'] = this.newLeadForm.get(['sales_id'])?.value;
    }

    if(!!this.newLeadForm.get(['partner_id'])?.value){
      newContact['partner_id'] = this.newLeadForm.get(['partner_id'])?.value.id;
    }

    // if(!!this.newLeadForm.get(['address'])?.value){
    //   newContact['address'] = this.newLeadForm.get(['address'])?.value;
    // }

    if(!!this.newLeadForm.get(['cost'])?.value){
      newContact['cost'] = this.newLeadForm.get(['cost'])?.value;
    }

    if(!!this.newLeadForm.get(['selectedCurrency'])?.value){
      newContact['currency'] = this.newLeadForm.get(['selectedCurrency'])?.value.currencyCode;
    }

    // if(!!this.newLeadForm.get(['Email'])?.value){
    //   newContact['email'] = this.newLeadForm.get(['Email'])?.value;
    // }

    if(!!this.newLeadForm.get(['labels'])?.value){
      newContact['label'] = this.newLeadForm.get(['labels'])?.value;
    }

    if(!!this.newLeadForm.get(['expected_close_date'])?.value){
      newContact['expected_close_date'] = this._db.getDateFormatted(this.newLeadForm.get(['expected_close_date'])?.value);
    }

    
    // if(!!this.contactPhones && this.contactPhones.length > 0){
    //   for (let i=0;i < this.contactPhones.length ; i++){
    //     if(this.contactPhones[i].phone.length < 8){
    //       this.contactPhones.splice(i,1)
    //     }
    //   }
      
    //   newContact['phone'] = this.contactPhones;
    // }

    if(this.currentUser.accRole == AccountRoles.SALES || this.currentUser.accRole == AccountRoles.MARKITING){
      newContact.sales_id = this.currentUser.key
    }

    this._db.createNewContact(newContact).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.newLeadForm.reset();
        // this.contactPhones= [{phone:'',phone_type:'Work'}];
        this.addNewOrgnization = false;
        this.subStatusLoading = false;
        this.getMyLeads();
      }else{
        this._notify.openSnackbar(`Error, ${JSON.stringify(res['data'])}` , SnackBarState.Warning , 5000)
      }
    },err=>{
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}` , SnackBarState.Error , 5000)

    })
  
    
  }

  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.label === o2.label : o2 === o2;
  }

  getAllTypes(){
    this._db.getAllContactAndLeadTypes().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.contactTypes = res['data']
      }
    })
  }

  openEditLabel(){
    this._db.getAllLables().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.lables = res['data']
      }
    })
  }
  getAllProducts(){
    this._db.getAllProducts().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.products = res['data']
      }
    })
  }


  openSalesEdit(){
    this._auth.getUserByFilter(Department.Business_Development , AccountRoles.SALES).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.salesTeam = res['data']
      }
    })
  }

  getLeadSubStatusByStatus(status_id:string){
    this.subStatusLoading = true;
    this._db.getLeadAndContactSubStatus(status_id).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.contactSubStatus = res['data']
        this.newLeadForm.patchValue({
          'lead_sub_status_id':this.contactSubStatus[0].id
        })
        this.subStatusLoading = false;

      }else{
        this.contactSubStatus = [];
        this.subStatusLoading = false;

      }
    },err=>{
      this.subStatusLoading = false;
    })
  }


  getAllPartners(){
    if(this.currentUser.department == Department.MANAGEMENT || this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER){
      this._db.getAllPartners(true).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.allPartners = res['data']
          this.filteredOptions = this.newLeadForm.get(['partner_id'])?.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' || typeof value === 'undefined' ? value : value.partner_name),
            map(partner_name =>partner_name? this._filter(partner_name) : this.allPartners.slice())
          );
        }
      })
    }else{
      this._db.getMyPartners().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.allPartners = res['data']
          this.filteredOptions = this.newLeadForm.get(['partner_id'])?.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' || typeof value === 'undefined' ? value : value.partner_name),
            map(partner_name =>partner_name? this._filter(partner_name) : this.allPartners.slice())
          );
        }
      })
    }
  }


  private _filter(title: string): Partner[] {
    const filterValue = title.toLowerCase();
    const filteredData = this.allPartners.filter(option => option.partner_name.toLowerCase().includes(filterValue));
    if(filteredData.length == 0){
      this.addNewOrgnization = true;
    }else{
      this.addNewOrgnization = false;
    }
    return this.allPartners.filter(option => option.partner_name.toLowerCase().includes(filterValue));
  }

  getDateAfter(addHours:string){    
    let mydate = new Date()
    switch (addHours){
      case 'hour':
        mydate = new Date(mydate.setHours(mydate.getHours() + 1))
        break;
      case 'hours':
        mydate = new Date(mydate.setHours(mydate.getHours() + 3))
        break;
      case 'tomorrow':
        mydate = new Date(mydate.setDate(mydate.getDate() + 1))
        break;
      case 'week':
        mydate = new Date(mydate.setDate(mydate.getDate() + 7))
        break;
    }
    return mydate;
  }

  getTimeColor(date){
    if(new Date(date) < new Date()){
      return 'rgb(249, 72, 57)';
    }else if(this._db.getDateTimeFormatted(this.getDateAfter('hours')) >= this._db.getDateTimeFormatted(new Date(date))){
      return 'rgb(1, 119, 55)';
    }else if(new Date(date) > new Date()){
      return 'rgb(101, 110, 122)';
    }else{
      return '#000'
    }
  }

  selectSteps(index){
    const cont = document.getElementById('stepsContainer')    
    if(!!cont){
      for (let i = 0 ; i < cont.children.length ; i++){
        if(i <= index){
          cont.children[i].classList.add('active')
        }else{
          cont.children[i].classList.remove('active')
        }
      }
    }
    this.newLeadForm.patchValue({
      'lead_sub_status_id':this.contactSubStatus[index].id
    })
  }

  // addPhone(){
  //   this.contactPhones.push({phone:'',phone_type:'Work'})
  // }

  // deletePhone(index){
  //   this.contactPhones.splice(index,1)
  // }

    /* ======================================= Request For POC Section ======================================== */

    addProcess(){
      const newG = new FormGroup({
        process_title: new FormControl('',Validators.required),
        process_description: new FormControl(''),
        process_department: new FormControl('',Validators.required)
      })
      this.process.push(newG);
    }
  
    delProcess(i){
      this.process.removeAt(i);
    }

    openRequestForPOCModal(){
      this.convertLoading = true;
      this.getRequestForPOCStatus();
      this.getRequestForPOCPriority();
      this.getAllProducts();
      
    }
  
    getRequestForPOCStatus(){
      this._db.getRequestForPOCStatus().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.requestForPocStatus = res['data']
        }else{
          this.requestForPocStatus = []
        }
      },err=>{
        console.log(err);
        this.requestForPocStatus = []
      })
    }
  
    getRequestForPOCPriority(){
      this._db.getRequestForPOCPriority().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.requestForPocPriority = res['data']
          this.convertLoading = false;
        }else{
          this.requestForPocStatus = []
          this.convertLoading = false;
        }
      },err=>{
        console.log(err);
        this.requestForPocStatus = []
        this.convertLoading = false;
  
      })
  
    }
  
    imagesupload(event: any) {
      this.requestForPOCAttaches = [];
      if (event.target.files) {
        // this.urls = [];
        for (let i = 0; i < event.target.files.length; i++) {
          this.requestForPOCAttaches.push(event.target.files[i])
          var reader = new FileReader()
          reader.readAsDataURL(event.target.files[i])
          // reader.onload = (event: any) => {
          //   // this.urls.push(event.target.result);
          // }
        }
      }
    }
  
    deleteIMG(i){
      this.requestForPOCAttaches.splice(i,1)
    }
  
    requestForPOC(){
      this.convertLoading = true;
  
      const fd : FormData = new FormData()
      
      fd.append('contact_lead_id', this.selectedElement.id || '');
      fd.append('request_poc_title', this.requestPOCForm.get(['title'])?.value);
      fd.append('description', this.requestPOCForm.get(['description'])?.value);
      fd.append('product_id', this.requestPOCForm.get(['product_id'])?.value);
      fd.append('request_poc_status_id', PocRequestStatus.Pending_On_CEO);
      fd.append('request_poc_priority_id', this.requestPOCForm.get(['request_poc_priority_id'])?.value);
      
  
      if (!!this.requestForPOCAttaches && this.requestForPOCAttaches.length > 0) {
        for (let file of this.requestForPOCAttaches) {
          fd.append('request_poc_attach[]', file);
        }
      }

      if (!!this.requestPOCForm.get(['process'])?.value && this.requestPOCForm.get(['process'])?.value.length > 0) {
        for (let poc of this.requestPOCForm.get(['process'])?.value) {
          const newP:ProcessDetails= {
            'process_title':poc.process_title,
            'process_description':poc.process_description,
            'process_department':poc.process_department,
          }
          fd.append('request_poc_process[]', JSON.stringify(newP));
        }
      }
      
      this._db.createRequestForPOC(fd).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.requestPOCForm.reset();
          this.requestForPOCAttaches = [];
          // this.urls = [];
          this.convertLoading = false;
          
          
          let editParams:{[k:string]:any } = {}
          editParams.lead_sub_status_id = this.selectedElement.lead_sub_status_id;
          this._db.updateContactLead(this.selectedElement.id || '', editParams).subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.getMyLeads();
              this.convertLoading = false;
            }else{
              this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`,SnackBarState.Warning, 5000)
              this.convertLoading = false;
            }
          },err=>{
            this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`,SnackBarState.Error, 5000)
            this.convertLoading = false;
          })

          
        }else{
          this._notify.openSnackbar('Error',SnackBarState.Error)
          this.convertLoading = false;
        }
      },err=>{
        console.log(err);
        this._notify.openSnackbar('Error',SnackBarState.Error)
        this.convertLoading = false;
      })
    }




  getLeadName(name:string){
    if(name.length > 10){
      return `${name.substring(0,10)}...`
    }else{
      return name;
    }
  }


  displayFn(partner: Partner): string {
    return partner && partner.partner_name ? partner.partner_name : '';
  }

  getFromHTML(e){    
    if(!!e.option.value){
      this.newLeadForm.patchValue({
        'partner_id':e.option.value
      })
      this.getMyOrgContacts();
    }

  }


  getAllPartnerIndustry(){
    this._db.getPartnersIndustry().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.partnerIndustry = res['data']
      }
    })
  }

  getAllCampaigns(){
    this._db.getAllCampaigns().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.allCampaign = res['data']
      }
    })
  }


  openAddPartnerForm(partner_name){
    this.getAllPartnerIndustry();
    this.getAllOrganizationTypes();
    if(this.currentUser.department == Department.MANAGEMENT|| (this.currentUser.department == Department.Business_Development && this.currentUser.accPosition== AccountPositions.MANAGER)){
      this.getAllSales();
    }
    this.newPartnerForm.patchValue({
      'partner_name':partner_name
    });
  }

  getMyOrgContacts(){
    this.contactLoading= true;
    if(this.currentUser.department == Department.MANAGEMENT|| this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER){
      this._db.getOrgContact(this.newLeadForm.get(['partner_id'])?.value.id).subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          this.myPersonContacts = res['data'];
          this.contactLoading= false;
        }else{
          this.myPersonContacts = []
          this.contactLoading= false;
        }
      },err=>{
        this.myPersonContacts = []
        this.contactLoading= false;
      })
    }else{
      this._db.getMyOrgContact(this.newLeadForm.get(['partner_id'])?.value.id).subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          this.myPersonContacts = res['data'];
          this.contactLoading= false;
        }else{
          this.myPersonContacts = []
          this.contactLoading= false;
        }
      },err=>{
        this.myPersonContacts = []
        this.contactLoading= false;
      })
    }
  }

  addPartner(){
    // const part:Partner = {
    //   'partner_name':this.newPartnerForm.get(['partner_name'])?.value,
    //   'partner_industry_id':this.newPartnerForm.get(['industry'])?.value,
    //   'partner_address':this.newPartnerForm.get(['address'])?.value,
    //   'partner_description':this.newPartnerForm.get(['description'])?.value,
    //   'is_org':true,
    // }
    const newPartner:Partner = {
      partner_name:this.newPartnerForm.get(['partner_name'])?.value,
      is_org:true
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
    if(!!this.newPartnerForm.get(['email'])?.value){
      newPartner.email = this.newPartnerForm.get(['email'])?.value
    }
    if(!!this.newPartnerForm.get(['phone'])?.value){
      newPartner.phone = this.newPartnerForm.get(['phone'])?.value
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


    if(this.currentUser.department == Department.MANAGEMENT || (this.currentUser.department == Department.Business_Development && this.currentUser.accPosition== AccountPositions.MANAGER)){
      if(!!this.newPartnerForm.get(['sales_id'])?.value){
        newPartner.sales_id = this.newPartnerForm.get(['sales_id'])?.value
      }
    }else{
      newPartner.sales_id = this.currentUser.key
    }


    this._db.createPartner(newPartner).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this._db.getAllPartners(true).subscribe(allRes=>{
          if(allRes['status'] == ResStatus.CRUD){
            this.allPartners = allRes['data']
            this.newLeadForm.patchValue({
              'partner_id':res['data']
            })
            this.newOrgAdded = true;
            this.addNewOrgnization = false;
            this.newPartnerFormopened = false;
          }
        })
      }
    })
  }


  filterContacts(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.myPersonContacts.length; i++) {
      let country = this.myPersonContacts[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
    }

    this.filteredContacts = filtered;
  }

  addPhone(){
    const newG = new FormGroup({
      'phone':new FormControl(null,Validators.required),
      'phone_type': new FormControl(null,Validators.required),
      'extend':new FormControl(null),
    })
    this.phones.push(newG);
  }

  delPhone(i){
    this.phones.removeAt(i);
  }


  openNewContactForm(){
    this.newPersonContactForm.patchValue({
      'partner_id':this.newLeadForm.get(['partner_id'])?.value.id
    })
  }

  createNewContact(){
    this.convertLoading = true;
    const newPersonContact:Contacts={
      partner_id:this.newPersonContactForm.get(['partner_id'])?.value,
      name:this.newPersonContactForm.get(['name'])?.value,
    }

    if(this.newPersonContactForm.get(['email'])?.value){
      newPersonContact.email = this.newPersonContactForm.get(['email'])?.value
    }

    if(this.newPersonContactForm.get(['address'])?.value){
      newPersonContact.address = this.newPersonContactForm.get(['address'])?.value
    }

    if(this.newPersonContactForm.get(['title'])?.value){
      newPersonContact.title = this.newPersonContactForm.get(['title'])?.value
    }

    if (!!this.newPersonContactForm.get(['phones'])?.value && this.newPersonContactForm.get(['phones'])?.value.length > 0) {
      const myphones:MobileNumber[] = [];
      for (let phone of this.newPersonContactForm.get(['phones'])?.value) {
        const newP:MobileNumber= {
          phone:phone.phone,        
          phone_type:phone.phone_type,        
        }
        if(!!phone.extend){
          newP.extend = phone.extend;
        }
        myphones.push(newP)
      }
      newPersonContact.phone = myphones;
    }

    this._db.createNewPersonContact(newPersonContact).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this._notify.openSnackbar(`success`,SnackBarState.Success)
        this.newContactFormopened = false;
        this.getMyOrgContacts();
        this.newLeadForm.patchValue({
          'contact_id':res['data']['id']
        })
        this.newPersonContactForm.reset()
        this.convertLoading = false;
      }else{
        this._notify.openSnackbar(`something wrong!`,SnackBarState.Warning,7000)
        this.convertLoading = false;
      }
    },err=>{
      this._notify.openSnackbar(`Error! ${JSON.stringify(err['error']['data'])}`,SnackBarState.Error,7000)
      this.convertLoading = false;
    })
    
  }

  clear(table: Table) {
    table.clear();
  }


  getMyRFPConfigList(){
    if(this.currentUser.department == Department.Business_Development && this.currentUser.accPosition != AccountPositions.MANAGER){
      this._auth.getUserByFilter(Department.Business_Development ,undefined, AccountPositions.MANAGER).subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          this.myRFPConfigList = res['data'];
        }else{
          this.myRFPConfigList = []
        }
      },err=>{
        this.myRFPConfigList = []
      })
    }else if(this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER){
      this._auth.getUserByFilter(Department.MANAGEMENT , AccountRoles.CEO).subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          this.myRFPConfigList = res['data'];
        }else{
          this.myRFPConfigList = []
        }
      },err=>{
        this.myRFPConfigList = []
      })
    }else if(this.currentUser.department == Department.MANAGEMENT){
      this._auth.getUserByFilter(Department.Business_Development).subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          this.myRFPConfigList = res['data'];
          this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(res2=>{
            if(res2['status']==ResStatus.CRUD){
              const myres2 = res2['data'];
              myres2.map(r=>this.myRFPConfigList.push(r))
            }else{
              this.myRFPConfigList = []
            }
          },err2=>{
            this.myRFPConfigList = []
          })
        }else{
          this.myRFPConfigList = []
        }
      },err=>{
        this.myRFPConfigList = []
      })
    }
    
  }


  requestForRFP(){
    this.convertLoading = true;

    const fd : FormData = new FormData()
    fd.append('contact_lead_id', this.selectedElement.id || '');
    fd.append('request_rfp_title', this.requestRFPForm.get(['title'])?.value);
    // fd.append('request_rfp_status_id', this.requestRFPForm.get(['comment'])?.value);
    
    
    fd.append('approval_ids', this.requestRFPForm.get(['approval_ids'])?.value);
    

    if(!!this.requestRFPForm.get(['comment'])?.value){
      fd.append('comment', this.requestRFPForm.get(['comment'])?.value);
    }

    // if(!!this.requestRFPForm.get(['approval_ids'])?.value){
    //   const approvalARR = this.requestRFPForm.get(['approval_ids'])?.value;
    //   for (let u of approvalARR) {
    //     fd.append('approval_ids[]', u);
    //   }
    // }

    if (!!this.requestForRFPAttaches && this.requestForRFPAttaches.length > 0) {
      for (let file of this.requestForRFPAttaches) {
        fd.append('request_rfp_attach[]', file);
      }
    }

    this._db.createRFPRequest(fd).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.convertLoading = false;
        this.requestRFPForm.reset();
        this.requestForRFPAttaches = [];
        let editParams:{[k:string]:any } = {}
        editParams.lead_sub_status_id = this.selectedElement.lead_sub_status_id;
        this._db.updateContactLead(this.selectedElement.id || '', editParams).subscribe(res=>{
          if(res['status'] == ResStatus.CRUD){
            this.getMyLeads();
            this.convertLoading = false;
          }else{
            this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`,SnackBarState.Warning, 5000)
            this.convertLoading = false;
          }
        },err=>{
          this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`,SnackBarState.Error, 5000)
          this.convertLoading = false;
        })
      }else{
        this._notify.openSnackbar('Error',SnackBarState.Error)
        this.convertLoading = false;
      }
    },err=>{
      console.log(err);
      this._notify.openSnackbar('Error',SnackBarState.Error)
      this.convertLoading = false;
    })
  }


  RFPimagesupload(event: any) {
    this.requestForRFPAttaches = [];
    if (event.target.files) {
      // this.urls = [];
      for (let i = 0; i < event.target.files.length; i++) {
        this.requestForRFPAttaches.push(event.target.files[i])
        var reader = new FileReader()
        reader.readAsDataURL(event.target.files[i])
      }
    }
  }

  RFPdeleteIMG(i){
    this.requestForRFPAttaches.splice(i,1)
  }

}
