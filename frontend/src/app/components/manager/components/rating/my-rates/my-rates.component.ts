import { Component, OnInit } from '@angular/core';
import { RateHistory } from 'src/app/interfaces/rating';
import { ResStatus } from 'src/app/interfaces/res-status';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-my-rates',
  templateUrl: './my-rates.component.html',
  styleUrls: ['./my-rates.component.scss']
})
export class MyRatesComponent implements OnInit {
  myPrevRates:RateHistory[]=[];
  constructor(private _db:DatabaseService) { }

  ngOnInit(): void {
    this._db.getMyRateHistory().subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.myPrevRates = res['data'];
      }
    })
  }

}
