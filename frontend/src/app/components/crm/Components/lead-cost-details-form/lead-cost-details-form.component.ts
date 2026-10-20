import { Component, OnInit ,Input,EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { LeadCostTypes, LeadsAndContacts } from 'src/app/interfaces/leadsAndContacts';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-lead-cost-details-form',
  templateUrl: './lead-cost-details-form.component.html',
  styleUrls: ['./lead-cost-details-form.component.scss']
})
export class LeadCostDetailsFormComponent implements OnInit {
  @Input() leadData:LeadsAndContacts;
  @Output() dataEvent = new EventEmitter<LeadsAndContacts>();

  costDetailsForm:FormGroup = new FormGroup({
    'costs':new FormArray([])
  })
  costs = this.costDetailsForm.get('costs') as FormArray;
  allCostTypes:LeadCostTypes[]=[];
  filteredCosts:LeadCostTypes[]=[];

  typesLoader:boolean = false;
  costDetailsLoading:boolean = false;
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService) { }

  ngOnInit(): void {
    this.typesLoader = true;
    this._db.getAllCostType().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.allCostTypes = res['data'];
        this.getCostDetails();
        this.typesLoader = false;
      }else{
        this.allCostTypes = [];
        this.typesLoader = false;
      }
    },err=>{
      this.allCostTypes = [];
      this.typesLoader = false;
    })
  }

  getCostDetails(){
    if(!!this.leadData.cost_details && this.leadData.cost_details.length > 0){
      for(let i in this.leadData.cost_details){
        const newG = new FormGroup({
          'cost': new FormControl(this.leadData.cost_details[i].cost,Validators.required),
          'cost_type': new FormControl(this.leadData.cost_details[i].cost_type,Validators.required),
        })
        this.costs.push(newG);
      }
    }else{
      this.addCost();
    }
  }


  createCostDetails(){
    this.costDetailsLoading = true;
    let editParams:{[k:string]:any } = {}
    editParams.cost_details = this.costDetailsForm.get(['costs'])?.value;
    this._db.updateContactLead(this.leadData.id || '',editParams).subscribe(res=>{
      this.dataEvent.emit(this.leadData);
      this.costDetailsLoading = false;
      if(res['status'] == ResStatus.CRUD){
        this.leadData.cost_details = this.costDetailsForm.get(['costs'])?.value;
      }
    })

  }

  delCost(i){
    this.costs.removeAt(i);
  }

  addCost(){
    const newG = new FormGroup({
      'cost': new FormControl('',Validators.required),
      'cost_type': new FormControl('',Validators.required),
    })
    this.costs.push(newG);
  }
}
