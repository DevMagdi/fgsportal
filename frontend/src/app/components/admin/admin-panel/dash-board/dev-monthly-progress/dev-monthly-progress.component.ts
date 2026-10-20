import { Component, OnInit } from '@angular/core';
// import { DurationCalculationService } from 'src/app/services/duration-calculation.service';

@Component({
  selector: 'app-dev-monthly-progress',
  templateUrl: './dev-monthly-progress.component.html',
  styleUrls: ['./dev-monthly-progress.component.scss']
})
export class DevMonthlyProgressComponent implements OnInit {
  pageLoaded:boolean = false;

  public monthDevProgressChartType: string = 'bar';
  public monthDevProgressChartDatasets: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'This Month Devs Progress' }
  ];
  public monthDevProgressChartLabels: Array<any> = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
  public monthDevProgressChartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];
  public monthDevProgressChartOptions: any = {
    responsive: true
  };

  public monthDevProgressChartClicked(e: any): void { }
  public monthDevProgressChartHovered(e: any): void { }

  constructor() { }

  ngOnInit(): void {
    // this.getMonthDevsProgressAnalysis()
  }


    
  // getMonthDevsProgressAnalysis(){
  //   this.getMonth()
    
  // }


  // getMonth(){
  //   return this._durationCalc.getMonthDates()
  // }

}
