import { Component, OnInit } from '@angular/core';
import {TreeNode} from 'primeng/api';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss']
})
export class OrgChartComponent implements OnInit {
  data1: TreeNode[];
  selectedNode: TreeNode;
  allUsers:User[] = [];
  constructor(private _auth:AuthApiService) { }

  ngOnInit(): void {
    this._auth.getAllUsers().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.restructionOrg()
      }
    })
  }


  restructionOrg(){
    this.data1 = [{
      label: 'FGS',
      type: 'person',
      styleClass: 'p-person',
      expanded: true,
      data: {name:'Walter White', 'avatar': 'walter.jpg'},
      children: [
          {
              label: 'CFO',
              type: 'person',
              styleClass: 'p-person',
              expanded: true,
              data: {name:'Saul Goodman', 'avatar': 'saul.jpg'},
              children:[{
                  label: 'Tax',
                  styleClass: 'department-cfo'
              },
              {
                  label: 'Legal',
                  styleClass: 'department-cfo'
              }],
          },
          {
              label: 'COO',
              type: 'person',
              styleClass: 'p-person',
              expanded: true,
              data: {name:'Mike E.', 'avatar': 'mike.jpg'},
              children:[{
                  label: 'Operations',
                  styleClass: 'department-coo'
              }]
          },
          {
              label: 'CTO',
              type: 'person',
              styleClass: 'p-person',
              expanded: true,
              data: {name:'Jesse Pinkman', 'avatar': 'jesse.jpg'},
              children:[{
                  label: 'Development',
                  styleClass: 'department-cto',
                  expanded: true,
                  children:[{
                      label: 'Analysis',
                      styleClass: 'department-cto'
                  },
                  {
                      label: 'Front End',
                      styleClass: 'department-cto'
                  },
                  {
                      label: 'Back End',
                      styleClass: 'department-cto'
                  }]
              },
              {
                  label: 'QA',
                  styleClass: 'department-cto'
              },
              {
                  label: 'R&D',
                  styleClass: 'department-cto'
              }]
          }
      ]
    }];
  }
  onNodeSelect(event) {
    // this.messageService.add({severity: 'success', summary: 'Node Selected', detail: event.node.label});
  } 
}

