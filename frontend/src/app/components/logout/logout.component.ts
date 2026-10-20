import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private _auth:AuthApiService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this._auth.logout()      
    this.router.navigate(['/']);
  }

}
