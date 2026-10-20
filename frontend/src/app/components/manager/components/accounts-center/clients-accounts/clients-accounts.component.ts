import { Component, OnInit } from '@angular/core';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Partner } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-clients-accounts',
  templateUrl: './clients-accounts.component.html',
  styleUrls: ['./clients-accounts.component.scss']
})
export class ClientsAccountsComponent implements OnInit {
  allClients:Partner[] = [];
  constructor(private _auth:AuthApiService,private _db:DatabaseService) { }

  ngOnInit(): void {
    this._db.getAllPartners(false).subscribe(clients=>{
      if(clients['status'] == ResStatus.CRUD){
        this.allClients = clients['data'];
      }
    })
  }

}
