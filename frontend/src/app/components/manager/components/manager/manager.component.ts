import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  // sideStatus:boolean = false ;
  constructor(private router: Router) { 

  }

  

  ngOnInit(): void {
  }

  btnUsers = () => {
    this.router.navigateByUrl('/manager/addusers');
  }

  btnProjects = () => {
    this.router.navigateByUrl('/manager/projects')
  }

  // sidebar(){
  //   this.sideStatus = !this.sideStatus
  // }
}