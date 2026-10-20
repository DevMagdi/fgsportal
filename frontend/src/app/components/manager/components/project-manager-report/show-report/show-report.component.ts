import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-report',
  templateUrl: './show-report.component.html',
  styleUrls: ['./show-report.component.scss']
})
export class ShowReportComponent implements OnInit {

  @Input() report:any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.report);
    
  }

}
