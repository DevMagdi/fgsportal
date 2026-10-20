import { Component, Input, OnInit } from '@angular/core';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ContractCost, ContractSupportCost, ProjectManagerSupport } from 'src/app/interfaces/client-ticket';
import { TypeOfCost, singleProjectCost } from 'src/app/interfaces/project-cost';
import { ResStatus } from 'src/app/interfaces/res-status';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

export enum Months {
  JAN = 0,
  FEB = 1,
  MAR = 2,
  APR = 3,
  MAY = 4,
  JUN = 5,
  JUL = 6,
  AUG = 7,
  SEP = 8,
  OCT = 9,
  NOV = 10,
  DEC = 11
}
interface SingleProjectCostOverTime {
  date: string;
  salaries: number;
  Incentive: number;
  Idle_Hours: number;
  Transportation: number;
  Mobile: number;
  Internet: number;
  PublicRequest: number;
  Other: number;
  Total: number;
}
@Component({
  selector: 'app-contract-support-cost',
  templateUrl: './contract-support-cost.component.html',
  styleUrls: ['./contract-support-cost.component.scss']
})
export class ContractSupportCostComponent implements OnInit {

  @Input() SupportID: string;
  loading = true;
  data: any;
  contractSupportCostData: ContractSupportCost;
  allProjectManagers: string[];
  projectCostWithEmpOverTime: any;
  basicOptions = {
    plugins: {
      position: 'bottom',

      legend: {
        position: 'bottom'
      }
    }
  }
  projectCostOverTime: any[];
  newServerApi = environment.newServerApi
  chartData: any;
  constructor(private _db: DatabaseService,private _notify:NotificationService) { }

  ngOnInit(): void {
    this.getSupportContractCostByID();
  }
  getSupportContractCostByID() {
    this._db.getSupportContractCostByID(this.SupportID).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.contractSupportCostData = res['data'];


        this.getChartOverEmps(this.contractSupportCostData.contract_cost);
        this.getChartData(this.contractSupportCostData.contract_cost);
        this.allProjectManagers = this.contractSupportCostData.project_managers.map((x) => x.project_manager_username)
        this.loading = false;
        
      }else{
        this.loading = false;
        this._notify.openSnackbar(`No Cost Found` , SnackBarState.Warning ,5000)
      }

    })
  }

  getChartData(costs: ContractCost[]){
    let labels: number[] = [];
    let labelsInStr: string[] = [];
    let myDatasets: any = [];
    let empsKeys: string[] = [];
    let empsNames: string[] = [];
    for (let i in costs) {
      const costTick = costs[i].ticket_id;
      const IfTickExists = labels.find(emp => emp == costTick);
      console.log(IfTickExists);
      
      if (!IfTickExists) {
       
        
        labels.push(costs[i].ticket_id);
        labelsInStr.push(costs[i].ticket_title.substring(0,10))

      }
      const IfEmpKeyExists = empsKeys.find(emp => emp == costs[i].empKey.toString())
      console.log(IfEmpKeyExists);

      if (!IfEmpKeyExists) {
        empsKeys.push(costs[i].empKey.toString())
        empsNames.push(costs[i].empName)
      }

   
    

    }
    for (let i in empsNames) {
      const empLable = empsNames[i];
      const backgroundColor = this.getRandomColor(i)
      const data = costs.filter(cost => cost.empKey.toString() == empsKeys[i])
      let finalData: any = [];
      for (let d in labels) {
        let monthAmount = 0;
        for (let e in data) {
          if (data[e].ticket_id == labels[d]) {
            monthAmount += data[e].costAmount;
          }
        }
        finalData.push(monthAmount)
      }
      myDatasets.push({
        label: empLable,
        backgroundColor: backgroundColor,
        data: finalData
      })
    }
          this.chartData = {
        labels: labelsInStr,
        datasets: myDatasets,
        
      };
  }
  getChartOverEmps(costs: ContractCost[]) {
    let labels: Date[] = [];
    let labelsInStr: string[] = [];
    let myDatasets: any = [];
    let empsKeys: string[] = [];
    let empsNames: string[] = [];
    for (let i in costs) {
      const costMonth = new Date(costs[i].costDate).getMonth();
      const IfMonthExists = labels.find(month => month.getMonth() == costMonth)
      if (!IfMonthExists) {
        labels.push(new Date(costs[i].costDate))
      }

      const IfEmpKeyExists = empsKeys.find(emp => emp == costs[i].empKey.toString())
      console.log(IfEmpKeyExists);

      if (!IfEmpKeyExists) {
        empsKeys.push(costs[i].empKey.toString())
        empsNames.push(costs[i].empName)
      }

    }

    labels = labels.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    labels.map(lable => labelsInStr.push(`${Months[new Date(lable).getMonth()]} ${new Date(lable).getFullYear()}`))
    // this.getFinalProjectCostOverTime(costs, labels);

    for (let i in empsNames) {
      const empLable = empsNames[i];
      const backgroundColor = this.getRandomColor(i)
      const data = costs.filter(cost => cost.empKey.toString() == empsKeys[i])
      let finalData: any = [];
      for (let d in labels) {
        let monthAmount = 0;
        for (let e in data) {
          if (new Date(data[e].costDate).getMonth() == new Date(labels[d]).getMonth()) {
            monthAmount += data[e].costAmount;
          }
        }
        finalData.push(monthAmount)
      }
      myDatasets.push({
        label: empLable,
        backgroundColor: backgroundColor,
        data: finalData
      })
    }

    this.projectCostWithEmpOverTime = {
      labels: labelsInStr,
      datasets: myDatasets
    };
  }


  getFinalProjectCostOverTime(costs: ContractCost[], dates: Date[]) {
    this.projectCostOverTime = [];
    for (let i in dates) {
      const myCosts = costs.filter(cost => `${new Date(cost.costDate).getMonth() - new Date(cost.costDate).getFullYear()}` == `${new Date(dates[i]).getMonth() - new Date(dates[i]).getFullYear()}`);
      if (myCosts.length > 0) {
        let Idle_Hours: number = 0;
        let Incentive: number = 0;
        let Internet: number = 0;
        let Mobile: number = 0;
        let PublicRequest: number = 0;
        let Other: number = 0;
        let Transportation: number = 0;
        let salaries: number = 0;
        for (let r in myCosts) {
          // switch(myCosts[r].costType){
          //   case TypeOfCost.TRANSPORTATION:
          //     Transportation += myCosts[r].costAmount;
          //     break;
          //   case TypeOfCost.IDLE_HOURS:
          //     Idle_Hours += myCosts[r].costAmount;
          //     break;
          //   case TypeOfCost.INCENTIVE:
          //     Incentive += myCosts[r].costAmount;
          //     break;
          //   case TypeOfCost.INTERNET:
          //     console.log(myCosts[r]);

          //     Internet += myCosts[r].costAmount;
          //     break;
          //   case TypeOfCost.MOBILE:
          //     Mobile += myCosts[r].costAmount;
          //     break;
          //   case TypeOfCost.SALARY:
          //     salaries += myCosts[r].costAmount;
          //     break;
          //   case TypeOfCost.OTHER:
          //     Other += myCosts[r].costAmount;
          //     break;
          //   case TypeOfCost.Public_Request:
          //     PublicRequest += myCosts[r].costAmount;
          //     break;
          //   default:
          //     break;
          // }
          Idle_Hours += myCosts[r].costAmount;
        }
        const newSingleCost: SingleProjectCostOverTime = {
          date: `${Months[new Date(dates[i]).getMonth()]} ${new Date(dates[i]).getFullYear()}`,
          Idle_Hours: Idle_Hours,
          Incentive: Incentive,
          Internet: Internet,
          Mobile: Mobile,
          Other: Other,
          Transportation: Transportation,
          PublicRequest: PublicRequest,
          salaries: salaries,
          Total: Idle_Hours + Incentive + Internet + Mobile + Other + Transportation + PublicRequest + salaries
        }
        this.projectCostOverTime.push(newSingleCost)

      } else {
        const newSingleCost: SingleProjectCostOverTime = {
          date: `${Months[new Date(dates[i]).getMonth()]} ${new Date(dates[i]).getFullYear()}`,
          Idle_Hours: 0,
          Incentive: 0,
          Internet: 0,
          Mobile: 0,
          Other: 0,
          Transportation: 0,
          PublicRequest: 0,
          salaries: 0,
          Total: 0
        }
        this.projectCostOverTime.push(newSingleCost)

      }

    }
  }

  getRandomColor(index) {
    var colors = [
      '#513982',
      '#f4831f',
      '#707070',
      '#2c0d69',
      '#905017',
      '#1f1531',
      '#faa75e',
      '#9b6cf3',
      '#2b2a2a',
      '#5a0aee'
    ]
    if (!!colors[index]) {
      return colors[index];
    } else {
      return colors[index - colors.length];
    }
  }
}
