import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss'],
  animations: [
    trigger('detailExpand', [

      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),

      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('openClose', [
      state('void', style({ height: 0, opacity: 0 })),
      transition('void <=> *', [
        animate('300ms ease-in-out')
      ])
    ])
  ],
})
export class CampaignsComponent implements OnInit {
  newCampaignForm:FormGroup = new FormGroup({
    'start_date':new FormControl(null , Validators.required),
    'end_date':new FormControl(null , Validators.required),
    'product_id':new FormControl(null , Validators.required),
    'platform_id':new FormControl(null , Validators.required),
    'status_id':new FormControl(null , Validators.required),
    'name':new FormControl(null , Validators.required),
    'title':new FormControl(null , Validators.required),
    'desc':new FormControl(null , Validators.required),
    'cost':new FormControl(null , Validators.required),
    'expectedNumberOFLeads':new FormControl(null , Validators.required),
  })


  isNewCampIsopened:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  addCampaign(){
    
  }

  togglePanel(){
    this.isNewCampIsopened = !this.isNewCampIsopened;
  }
}
