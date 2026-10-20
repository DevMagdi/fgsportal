import { Component, OnInit } from '@angular/core';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { CRMDashboardData, DashboardColors, DashboardColorsRGB, TotalValueOfWonDeals } from 'src/app/interfaces/crm-dashboard';
import { LeadsAndContacts } from 'src/app/interfaces/leadsAndContacts';
import { ResStatus } from 'src/app/interfaces/res-status';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  start_date = this._db.getDateFormattedYearMonthDay(new Date(new Date().getFullYear(),0,1))
  end_date = this._db.getDateFormattedYearMonthDay(new Date(new Date().getFullYear(),11,31))
  crmdashloader:boolean = false;
  crmDashboardData:CRMDashboardData;
  revenueforcastData: any;
  revenueforcastOptions: any;
  revenueOverProductOptions: any;

  revenueOverSalesData:any;
  revenueOverSalesOptions: any;

  dealProgressData: any;
  dealProgressOptions: any;
  leadsForSalesData:any;
  revenueOverProductData:any;
  numOfLeadsOptions:any;

  activitesData:any;
  activitesOptions:any;
  totalValueOfWonDeals:TotalValueOfWonDeals;
  modalTitle:string = '';
  constructor(private _db:DatabaseService,
              private _notify:NotificationService) { }

  ngOnInit(): void {

    let url = document.location.hostname;
    // this.getCRMDashboardData();

    if(url !='localhost'){
      this.getCRMDashboardData();
    }
  }


  getCRMDashboardData(){
    this.crmdashloader = true;
    const start = this._db.getDateFormatted(this.start_date);
    const end = this._db.getDateFormatted(this.end_date);
    this._db.getCRMDashBoard(start,end).subscribe(res=>{
      
      if(res['status']==ResStatus.CRUD){
        this.crmDashboardData = res['data'];        
        this.getrevenueforcast();
        this.getrevenueOverProduct();
        this.getDealProgress();
        this.getnumOfLeads();
        this.getActivites();
        this.getTotalValueOfWonDeals();
        this.getrevenueOverSales();
        this.crmdashloader = false;
      }
    },err=>{
      this._notify.openSnackbar('Sorry , Something went wrong',SnackBarState.Warning)
      this.crmdashloader = false;     
    })
  }

  getDealProgress(){    
    for (let i in this.crmDashboardData.dealProgressData.datasets){
      this.crmDashboardData.dealProgressData.datasets[i].type = 'bar';
      if(parseInt(i) < 12){
        this.crmDashboardData.dealProgressData.datasets[i].backgroundColor = DashboardColors[i];
      }else{
        this.crmDashboardData.dealProgressData.datasets[i].backgroundColor = DashboardColors[parseInt(i) - 12];
      }
    }

    this.dealProgressData = {
      labels:this.crmDashboardData.dealProgressData.labels,
      datasets:this.crmDashboardData.dealProgressData.datasets
    }

    this.dealProgressOptions = {
      plugins: {
        tooltips: {
            mode: 'index',
            intersect: false
        }
      },
      responsive: true,
      scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        }
      }
    };
  }

  getrevenueforcast(){
    for (let i in this.crmDashboardData.revenueforcastData.datasets){
      this.crmDashboardData.revenueforcastData.datasets[i].type = 'bar';
      if(this.crmDashboardData.revenueforcastData.datasets[i].label == 'Total'){
        this.crmDashboardData.revenueforcastData.datasets[i].type = 'line';
      }else{
        this.crmDashboardData.revenueforcastData.datasets[i].type = 'bar';
      }
      if(parseInt(i) < 12){
        this.crmDashboardData.revenueforcastData.datasets[i].backgroundColor = DashboardColors[i];
      }else{
        this.crmDashboardData.revenueforcastData.datasets[i].backgroundColor = DashboardColors[parseInt(i) - 12];
      }
    }
    
    this.revenueforcastData = {
      labels:this.crmDashboardData.revenueforcastData.labels,
      datasets:this.crmDashboardData.revenueforcastData.datasets
    }
    this.revenueforcastOptions = {
      plugins: {
        tooltip: {
          mode: 'x',
          intersect: true,
          // callbacks: {
          //   label: (tooltipItem) => {
          //     let tooltipEl = document.getElementById('chartjs-tooltip');
          //     if (!tooltipEl) {
          //       tooltipEl = document.createElement('div');
          //       tooltipEl.id = 'chartjs-tooltip';
          //       tooltipEl.innerHTML = '<table></table>';
          //       document.body.appendChild(tooltipEl);
          //     }
          //     const i = this.revenueforcastData.labels.findIndex(l=>l == tooltipItem.label);
          //     const total = this.revenueforcastData.datasets[0].data[i] + this.revenueforcastData.datasets[1].data[i]
          //     tooltipEl.innerHTML =  `
          //     <table>
          //         <tr>
          //             <td>Month:</td>
          //             <td>${tooltipItem.label}</td>
          //         </tr>
          //         <tr>
          //             <td>Total:</td>
          //             <td>${total}</td>
          //         </tr>
          //         <tr>
          //             <td>Won:</td>
          //             <td>${this.revenueforcastData.datasets[1].data[i]}</td>
          //         </tr>
          //         <tr>
          //             <td>Open:</td>
          //             <td>${this.revenueforcastData.datasets[0].data[i]}</td>
          //         </tr>
              
          //     </table>
              
          //     `
          //     // return tooltipEl
          //     return `Month : ${tooltipItem.label}
          //             Total : ${total}
          //             Won : ${this.revenueforcastData.datasets[1].data[i]}
          //             Open: ${this.revenueforcastData.datasets[0].data[i]}`;
          //   }
          // }
        }
      },
      responsive: true,
      scales: {
        x: {
            stacked: true,

        },
        y: {
            stacked: true,
        }
      }
    };
  }

  getnumOfLeads(){
    this.leadsForSalesData = {
      labels: this.crmDashboardData.leadsForSalesData.labels,
      datasets: [
        {
          data: this.crmDashboardData.leadsForSalesData.data,
          backgroundColor: [
            DashboardColors[0],
            DashboardColors[1],
            DashboardColors[2],
            DashboardColors[3],
            DashboardColors[4],
            DashboardColors[5],
            DashboardColors[6],
            DashboardColors[7],
            DashboardColors[8],
          ],
          hoverBackgroundColor: [
              `rgba(${DashboardColorsRGB[0]},0.8)`,
              `rgba(${DashboardColorsRGB[1]},0.8)`,
              `rgba(${DashboardColorsRGB[2]},0.8)`,
              `rgba(${DashboardColorsRGB[3]},0.8)`,
              `rgba(${DashboardColorsRGB[4]},0.8)`,
              `rgba(${DashboardColorsRGB[5]},0.8)`,
              `rgba(${DashboardColorsRGB[6]},0.8)`,
              `rgba(${DashboardColorsRGB[7]},0.8)`,
              `rgba(${DashboardColorsRGB[8]},0.8)`,
          ]
        }
    ]
    };
    this.numOfLeadsOptions = {
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      }
    };
  }

  getrevenueOverProduct(){
    this.revenueOverProductData = {
      labels: this.crmDashboardData.revenueforcastData.revenueOverProduct.labels,
      datasets: [
        {
          data: this.crmDashboardData.revenueforcastData.revenueOverProduct.data,
          backgroundColor: [
              DashboardColors[0],
              DashboardColors[1],
              DashboardColors[2],
              DashboardColors[3],
              DashboardColors[4],
              DashboardColors[5],
              DashboardColors[6],
              DashboardColors[7],
              DashboardColors[8],
          ],
          hoverBackgroundColor: [
              `rgba(${DashboardColorsRGB[0]},0.8)`,
              `rgba(${DashboardColorsRGB[1]},0.8)`,
              `rgba(${DashboardColorsRGB[2]},0.8)`,
              `rgba(${DashboardColorsRGB[3]},0.8)`,
              `rgba(${DashboardColorsRGB[4]},0.8)`,
              `rgba(${DashboardColorsRGB[5]},0.8)`,
              `rgba(${DashboardColorsRGB[6]},0.8)`,
              `rgba(${DashboardColorsRGB[7]},0.8)`,
              `rgba(${DashboardColorsRGB[8]},0.8)`,
          ]
        }
    ]
    };
    this.revenueOverProductOptions = {
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      }
    };
  }


  getrevenueOverSales(){
    this.revenueOverSalesData = {
      labels: this.crmDashboardData.revenueforcastData.revenueOverSales.labels,
      datasets: [
        {
          data: this.crmDashboardData.revenueforcastData.revenueOverSales.data,
          backgroundColor: [
              DashboardColors[0],
              DashboardColors[1],
              DashboardColors[2],
              DashboardColors[3],
              DashboardColors[4],
              DashboardColors[5],
              DashboardColors[6],
              DashboardColors[7],
              DashboardColors[8],
          ],
          hoverBackgroundColor: [
              `rgba(${DashboardColorsRGB[0]},0.8)`,
              `rgba(${DashboardColorsRGB[1]},0.8)`,
              `rgba(${DashboardColorsRGB[2]},0.8)`,
              `rgba(${DashboardColorsRGB[3]},0.8)`,
              `rgba(${DashboardColorsRGB[4]},0.8)`,
              `rgba(${DashboardColorsRGB[5]},0.8)`,
              `rgba(${DashboardColorsRGB[6]},0.8)`,
              `rgba(${DashboardColorsRGB[7]},0.8)`,
              `rgba(${DashboardColorsRGB[8]},0.8)`,
          ]
        }
    ]
    };
    this.revenueOverSalesOptions = {
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      }
    };
  }

  getActivites(){
    for (let i in this.crmDashboardData.activitesData.datasets){
      this.crmDashboardData.activitesData.datasets[i].type = 'bar';
      if(parseInt(i) < 12){
        this.crmDashboardData.activitesData.datasets[i].backgroundColor = DashboardColors[i];
      }else{
        this.crmDashboardData.activitesData.datasets[i].backgroundColor = DashboardColors[parseInt(i) - 12];
      }
    }

    this.activitesData = {
      labels:this.crmDashboardData.activitesData.labels,
      datasets:this.crmDashboardData.activitesData.datasets
    }
    this.activitesOptions = {
      plugins: {
        tooltips: {
            mode: 'index',
            intersect: false
        }
      },
      responsive: true,
      scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        }
      }
    };
  }


  getTotalValueOfWonDeals(){
    this.totalValueOfWonDeals = this.crmDashboardData.revenueforcastData.totalValueOfWonDeals;
  }

  revenueforcastDataSelect(event: any) {
    if (event.element) {
      this.crmdashloader= true;
      const labelIndex = event.element.index;
      const datasetIndex = event.element.datasetIndex;
      const labelValue =  this.crmDashboardData.revenueforcastData.labels[labelIndex]
      const datasetValue =  this.crmDashboardData.revenueforcastData.datasets[datasetIndex].label      
      const monthDate = this._db.getDateFormatted(new Date(labelValue));
      this.modalTitle = `Revenew Forcast: (${labelValue}-${datasetValue})`

      this._db.getCRMDashBoardRevenueForCastData(monthDate,datasetValue).subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          const leadsData:LeadsAndContacts = res['data']
          document.getElementById('showModal')?.click();
          const myModal = document.getElementById('showDashboardDataBody')
          if(!!myModal){
            

            let tableHtml = `
              <table class="table table-hover">
                <thead>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Product</th>
                </thead>
                <tbody>
            `;
            for(let i in leadsData){
              tableHtml += `<tr>`
              tableHtml += `<td><a href="/#/CRM/leads/${leadsData[i].id}">${leadsData[i].title}</a></td>`
              tableHtml += `<td>${leadsData[i].partner_name}</td>`
              tableHtml += `<td>${leadsData[i].cost} ${leadsData[i].currency}</td>`
              tableHtml += `<td>${leadsData[i].lead_sub_status_name}</td>`
              tableHtml += `<td>${leadsData[i].product_name}</td>`
              tableHtml += `</tr>`
            }
        
            tableHtml += `
                </tbody>
              </table>
            `;
        
            myModal.innerHTML = tableHtml;
          }
        }
        this.crmdashloader= false;
      },err=>{
        this.crmdashloader= false;
      })
    }
  }


  getTotalData(current:number){
    this.crmdashloader= true;     

      this.modalTitle = `Total Value Of Won Deals: (${this._db.getDateFormatted(this.start_date)}-${this._db.getDateFormatted(this.end_date)})`

      this._db.getTotalValueOfWonDealData(this._db.getDateFormatted(this.start_date),this._db.getDateFormatted(this.end_date),current).subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          const leadsData:LeadsAndContacts = res['data']
          document.getElementById('showModal')?.click();
          const myModal = document.getElementById('showDashboardDataBody')
          if(!!myModal){
            

            let tableHtml = `
              <table class="table table-hover">
                <thead>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Product</th>
                </thead>
                <tbody>
            `;
            for(let i in leadsData){
              tableHtml += `<tr>`
              tableHtml += `<td><a href="/#/CRM/leads/${leadsData[i].id}">${leadsData[i].title}</a></td>`
              tableHtml += `<td>${leadsData[i].partner_name}</td>`
              tableHtml += `<td>${leadsData[i].cost} ${leadsData[i].currency}</td>`
              tableHtml += `<td>${leadsData[i].lead_sub_status_name}</td>`
              tableHtml += `<td>${leadsData[i].product_name}</td>`
              tableHtml += `</tr>`
            }
        
            tableHtml += `
                </tbody>
              </table>
            `;
        
            myModal.innerHTML = tableHtml;
          }
        }
        this.crmdashloader= false;
      },err=>{
        this.crmdashloader= false;
      })
  }


  revenuePerProductDataSelect(event: any) {
    if (event.element) {
      this.crmdashloader= true;
      const labelIndex = event.element.index;
      const labelName = this.crmDashboardData.revenueforcastData.revenueOverProduct.labels[labelIndex]
      this.modalTitle = `Revenew Per Product: ${this._db.getDateFormatted(this.start_date)}-${this._db.getDateFormatted(this.end_date)}-${labelName})`

      this._db.getCRMDashBoardRevenuePerProductData(this._db.getDateFormatted(this.start_date),this._db.getDateFormatted(this.end_date),labelName).subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          const leadsData:LeadsAndContacts = res['data']
          document.getElementById('showModal')?.click();
          const myModal = document.getElementById('showDashboardDataBody')
          if(!!myModal){
            

            let tableHtml = `
              <table class="table table-hover">
                <thead>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Product</th>
                </thead>
                <tbody>
            `;
            for(let i in leadsData){
              tableHtml += `<tr>`
              tableHtml += `<td><a href="/#/CRM/leads/${leadsData[i].id}">${leadsData[i].title}</a></td>`
              tableHtml += `<td>${leadsData[i].partner_name}</td>`
              tableHtml += `<td>${leadsData[i].cost} ${leadsData[i].currency}</td>`
              tableHtml += `<td>${leadsData[i].lead_sub_status_name}</td>`
              tableHtml += `<td>${leadsData[i].product_name}</td>`
              tableHtml += `</tr>`
            }
        
            tableHtml += `
                </tbody>
              </table>
            `;
        
            myModal.innerHTML = tableHtml;
          }
        }
        this.crmdashloader= false;
      },err=>{
        this.crmdashloader= false;
      })
    }
  }

  revenuePerSalesDataSelect(event: any) {
    if (event.element) {
      this.crmdashloader= true;
      const labelIndex = event.element.index;
      const labelName = this.crmDashboardData.revenueforcastData.revenueOverSales.labels[labelIndex]
      this.modalTitle = `Revenew Per Sales: ${this._db.getDateFormatted(this.start_date)}-${this._db.getDateFormatted(this.end_date)}-${labelName})`

      this._db.getCRMDashBoardRevenuePerSalesData(this._db.getDateFormatted(this.start_date),this._db.getDateFormatted(this.end_date),labelName).subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          const leadsData:LeadsAndContacts = res['data']
          document.getElementById('showModal')?.click();
          const myModal = document.getElementById('showDashboardDataBody')
          if(!!myModal){
            

            let tableHtml = `
              <table class="table table-hover">
                <thead>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Product</th>
                </thead>
                <tbody>
            `;
            for(let i in leadsData){
              tableHtml += `<tr>`
              tableHtml += `<td><a href="/#/CRM/leads/${leadsData[i].id}">${leadsData[i].title}</a></td>`
              tableHtml += `<td>${leadsData[i].partner_name}</td>`
              tableHtml += `<td>${leadsData[i].cost} ${leadsData[i].currency}</td>`
              tableHtml += `<td>${leadsData[i].lead_sub_status_name}</td>`
              tableHtml += `<td>${leadsData[i].product_name}</td>`
              tableHtml += `</tr>`
            }
        
            tableHtml += `
                </tbody>
              </table>
            `;
        
            myModal.innerHTML = tableHtml;
          }
        }
        this.crmdashloader= false;
      },err=>{
        this.crmdashloader= false;
      })
    }
  }
  numberOfLeadsDataSelect(event: any) {
    if (event.element) {
      this.crmdashloader= true;
      const labelIndex = event.element.index;
      const labelName = this.crmDashboardData.leadsForSalesData.labels[labelIndex]
      this.modalTitle = `Revenew Per Sales: ${this._db.getDateFormatted(this.start_date)}-${this._db.getDateFormatted(this.end_date)}-${labelName})`

      this._db.getCRMDashBoardNumberOfLeadsData(this._db.getDateFormatted(this.start_date),this._db.getDateFormatted(this.end_date),labelName).subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          const leadsData:LeadsAndContacts = res['data']
          document.getElementById('showModal')?.click();
          const myModal = document.getElementById('showDashboardDataBody')
          if(!!myModal){
            

            let tableHtml = `
              <table class="table table-hover">
                <thead>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Product</th>
                </thead>
                <tbody>
            `;
            for(let i in leadsData){
              tableHtml += `<tr>`
              tableHtml += `<td><a href="/#/CRM/leads/${leadsData[i].id}">${leadsData[i].title}</a></td>`
              tableHtml += `<td>${leadsData[i].partner_name}</td>`
              tableHtml += `<td>${leadsData[i].cost} ${leadsData[i].currency}</td>`
              tableHtml += `<td>${leadsData[i].lead_sub_status_name}</td>`
              tableHtml += `<td>${leadsData[i].product_name}</td>`
              tableHtml += `</tr>`
            }
        
            tableHtml += `
                </tbody>
              </table>
            `;
        
            myModal.innerHTML = tableHtml;
          }
        }
        this.crmdashloader= false;
      },err=>{
        this.crmdashloader= false;
      })
    }
  }


  dealProgressDataSelect(event: any) {
    if (event.element) {
      this.crmdashloader= true;
      const labelIndex = event.element.index;
      const datasetIndex = event.element.datasetIndex;
      const labelValue =  this.crmDashboardData.dealProgressData.labels[labelIndex]
      const datasetValue =  this.crmDashboardData.dealProgressData.datasets[datasetIndex].label      
      const monthDate = this._db.getDateFormatted(new Date(labelValue));
      this.modalTitle = `Revenew Forcast: (${labelValue}-${datasetValue})`

      this._db.getCRMDashBoardDealProgressData(monthDate,datasetValue).subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          const leadsData:LeadsAndContacts = res['data']
          document.getElementById('showModal')?.click();
          const myModal = document.getElementById('showDashboardDataBody')
          if(!!myModal){
            

            let tableHtml = `
              <table class="table table-hover">
                <thead>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Product</th>
                </thead>
                <tbody>
            `;
            for(let i in leadsData){
              tableHtml += `<tr>`
              tableHtml += `<td><a href="/#/CRM/leads/${leadsData[i].id}">${leadsData[i].title}</a></td>`
              tableHtml += `<td>${leadsData[i].partner_name}</td>`
              tableHtml += `<td>${leadsData[i].cost} ${leadsData[i].currency}</td>`
              tableHtml += `<td>${leadsData[i].lead_sub_status_name}</td>`
              tableHtml += `<td>${leadsData[i].product_name}</td>`
              tableHtml += `</tr>`
            }
        
            tableHtml += `
                </tbody>
              </table>
            `;
        
            myModal.innerHTML = tableHtml;
          }
        }
        this.crmdashloader= false;
      },err=>{
        this.crmdashloader= false;
      })
    }
  }
}