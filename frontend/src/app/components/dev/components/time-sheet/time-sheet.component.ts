import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ClientTicket, ClientTicketStatus } from 'src/app/interfaces/client-ticket';
import { DevDailyReport, Activity, ReportStatus, ReportType } from 'src/app/interfaces/dev-daily-report';
import { Notifying } from 'src/app/interfaces/notification';
import { Project } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { SUB_TASk, Task } from 'src/app/interfaces/task';
import { AccountPositions, AccountRoles, Department, Gender, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';
declare var Email: any;

export enum Days {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}
@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss']
})
export class TimeSheetComponent implements OnInit {
  timesheetLoader: boolean = false;
  currentWeekDays: Date[] = [];
  newReport: DevDailyReport;
  // time_activity:string
  myTasks: Task[] = []
  mySupportTasks: Task[] = []
  myID: string;
  myName: string;

  myProjectsList: Project[] = [];
  myProcessesList: SUB_TASk[] = [];
  myTasksList: Task[] = [];

  myReportsList: DevDailyReport[] = []

  totalHours: Array<number> = []

  panelOpenState = false;

  tasksIsOpened: boolean = false;
  reportInEditMode: boolean = false;

  managers: User[] = [];
  seniors: User[] = [];
  currentUser: User;


  publicDate: Date;

  hideAddBtn: boolean = false;
  today: Date;

  closeResult: string;
  myProcess: SUB_TASk[] = [];
  AccountPositionEnum = AccountPositions;
  reportTypes: ReportType[] = [];
  ActivityEnum = Activity;
  taskTotalProgress: number = 0

  selectedTask: Task | undefined;

  displayModal = false;
  openedDay: boolean[] = [false, false, false, false, false, false, false];
  recentClientTickets: ClientTicket[] = [];
  yesterDay: Date | string;
  toDay: Date | string;
  isOutSourcedTask: boolean = false;
  firstWeekDay: Date;
  lastWeekDay: Date;

  constructor(private _db: DatabaseService,
    private _auth: AuthApiService,
    private modalService: NgbModal,
    private notify: NotificationService,
    private message: MessagingService) {
    this.newReport = {
      devID: '',
      devName: '',
      reportDate: new Date().toDateString(),
      durationByHours: 0,
      time_activity: Activity.DAILY_TASK,
      preApprovedDuration: 0
    }
  }

  ngOnInit(): void {
    const timeSubscrib: Subscription = this._db.getServerTime().subscribe(
      (date) => {
        timeSubscrib.unsubscribe()

        const summerDate = new Date(date);

        // Increase date 1 hour to adjust for timezone
        // Add 1 hour (in milliseconds)
        summerDate.setHours(summerDate.getHours() - 2);


        // try to get the date from API And If it is not working get it from local time
        this.today = summerDate;
        // console.log(this.today, new Date(date).toDateString());

        const today = `${new DatePipe('en-Us').transform(date, 'yyyy-MM-dd', 'GMT')}`;
        let first = new Date(today).getDate() - (new Date(today).getDay())
        let last = first + 6

        let firstday = this.firstWeekDay = new Date(new Date(today).setDate(first))
        let lastday = this.lastWeekDay = new Date(new Date(today).setDate(last))


        // /////////////
        // this.firstWeekDay = new DatePipe('en-Us').transform(new Date(new Date().setDate(first)), 'yyyy-MM-dd', 'GMT') || '';
        // this.lastWeekDay = new DatePipe('en-Us').transform(new Date(new Date().setDate(last)), 'yyyy-MM-dd', 'GMT') || '';

        while (firstday <= lastday) {
          this.currentWeekDays.push(new Date(firstday))
          firstday = new Date(firstday.setDate(firstday.getDate() + 1));
        }


        if (this.currentWeekDays.length < 7) {
          console.log('Loaded From Local');
          this.today = new Date();
          this.newReport.reportDate = new Date().toDateString();

          const today = new Date();
          let first = today.getDate() - (today.getDay())
          let last = first + 6
          let firstday = this.firstWeekDay = new Date(new Date().setDate(first))
          let lastday = this.lastWeekDay = new Date(new Date().setDate(last))

          // //////////////
          // let firstDate = today.getDate() - (today.getDay())
          // let lastDate = firstDate + 4
          // this.firstWeekDay = new DatePipe('en-Us').transform(new Date(new Date().setDate(first)), 'yyyy-MM-dd', 'GMT') || '';
          // this.lastWeekDay = new DatePipe('en-Us').transform(new Date(new Date().setDate(last)), 'yyyy-MM-dd', 'GMT') || '';
          console.log(this.firstWeekDay, this.lastWeekDay);

          while (firstday <= lastday) {
            this.currentWeekDays.push(new Date(firstday))
            firstday = new Date(firstday.setDate(firstday.getDate() + 1));
          }

          this.getUserData()
          this.handleDatesFormat();
        } else {
          console.log('Loaded From public');
          // console.log(new Date(this.today).toDateString());
          // console.log(new DatePipe('en-Us').transform(this.today, 'EEE MMM dd yyyy', 'GMT'));

          this.newReport.reportDate = `${new DatePipe('en-Us').transform(this.today,
            'yyyy-MM-dd', 'GMT')}`;
          console.log(this.newReport.reportDate);

          const todayDate = new Date(this.newReport.reportDate);
          let firstDate = todayDate.getDate() - (todayDate.getDay())
          let lastDate = firstDate + 6;
          this.firstWeekDay = new Date(new Date().setDate(firstDate))
          this.lastWeekDay = new Date(new Date().setDate(lastDate))
          // this.firstWeekDay = new DatePipe('en-Us').transform(new Date(new Date().setDate(firstDate)), 'yyyy-MM-dd', 'GMT') || '';
          // this.lastWeekDay = new DatePipe('en-Us').transform(new Date(new Date().setDate(lastDate)), 'yyyy-MM-dd', 'GMT') || '';
          console.log(this.firstWeekDay, this.lastWeekDay);

          this.getUserData()
          this.handleDatesFormat();
        }
      }, err => {
        console.log('Loaded From Local');
        this.today = new Date();
        this.newReport.reportDate = new Date().toDateString();

        const today = new Date();
        let first = today.getDate() - (today.getDay())
        let last = first + 6
        let firstday = this.firstWeekDay = new Date(new Date().setDate(first))
        let lastday = this.lastWeekDay = new Date(new Date().setDate(last))


        // //////////////
        // this.firstWeekDay = new DatePipe('en-Us').transform(new Date(new Date().setDate(first)), 'yyyy-MM-dd', 'GMT') || '';
        // this.lastWeekDay = new DatePipe('en-Us').transform(new Date(new Date().setDate(last)), 'yyyy-MM-dd', 'GMT') || '';

        while (firstday <= lastday) {
          this.currentWeekDays.push(new Date(firstday))
          firstday = new Date(firstday.setDate(firstday.getDate() + 1));
        }

        this.getUserData()
        this.handleDatesFormat();
      }
    )


    this.getDevTickets();


  }


  getReportTypes() {
    this._db.getReportTypes().subscribe(types => {
      if (types['status'] == ResStatus.CRUD) {
        this.reportTypes = types['data'];
      }
    })
  }

  getManagersAndSeniors() {
    this._auth.getUserByFilter(Department.TECHNICAL_TEAM, AccountRoles.Automation_Engineer, AccountPositions.MANAGER).subscribe(pms => {
      if (pms['status'] == ResStatus.CRUD) {
        this.managers = pms['data']
      }
      this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(managers => {
        if (managers['status'] == ResStatus.CRUD) {
          managers['data'].map((man) => this.managers.push(man))
        }
      })
    })

    this._auth.getUserByFilter(Department.TECHNICAL_TEAM, AccountRoles.Automation_Engineer, AccountPositions.SENIOR).subscribe(sers => {
      if (sers['status'] == ResStatus.CRUD) {
        this.seniors = sers['data'];
      }
    })


  }



  getProjectProcess() {
    this.myProcess = [];
    this.newReport.processID = null;
    this.newReport.taskID = null;
    this.myProcess = this.myProcessesList.filter(p => p.project_key == this.newReport.projectID)
    for (let i in this.myProcess) {
      let ps;
      if (this.newReport.time_activity == Activity.DAILY_TASK) {
        ps = this.myTasks.filter(t => t.process_key == this.myProcess[i].key)
      } else if (this.newReport.time_activity == Activity.SUPPORT) {
        ps = this.mySupportTasks.filter(t => t.process_key == this.myProcess[i].key)
      }
      if (!!ps && ps.length < 1) {
        this.myProcess.splice(parseInt(i), 1)
      }
    }
  }

  getProcessTasks() {
    this.myTasksList = [];
    this.newReport.taskID = null;
    if (this.newReport.time_activity == Activity.DAILY_TASK) {
      this.myTasksList = this.myTasks.filter(t => t.process_key == this.newReport.processID)
    } else if (this.newReport.time_activity == Activity.SUPPORT) {
      this.myTasksList = this.mySupportTasks.filter(t => t.process_key == this.newReport.processID)
    }
  }



  getUserData() {
    this._auth.getCurrentLoggedInUser()?.subscribe(user => {
      if (user['status'] == ResStatus.CRUD) {
        this.currentUser = user['data']
        this.myID = user['data'].key;
        this.myName = user['data'].username;

        if (this.currentUser.accRole == AccountRoles.Automation_Engineer) {

        } else if (this.currentUser.accPosition == AccountPositions.Team_Leader) {


        } else if (this.currentUser.department == Department.Business_Development || this.currentUser.department == Department.ADMINSTRATION) {

        }
        // To Check If User Can Add His Previous Reports
        if (!!this.currentUser.canAddPreviousReports) {
          this.hideAddBtn = false;
          const limitDate = new Date(this.currentUser.canAddPreviousReportsDate || '')

          const now = new Date()
          if (`${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}` > `${limitDate.getMonth() + 1}/${limitDate.getDate()}/${limitDate.getFullYear()}`) {
            this.currentUser.canAddPreviousReports = false;
            this._auth.changePreviousReportStatus(this.currentUser.key || '', this.currentUser.canAddPreviousReports).subscribe()
          }
        }

        this._db.getDevProjects(this.currentUser.key || '').subscribe(data => {
          if (data['status'] == ResStatus.CRUD) {
            this.myProjectsList = data['data']
          }
        })

        this._db.getDevProcesses(this.currentUser.key || '').subscribe(data => {
          if (data['status'] == ResStatus.CRUD) {
            this.myProcessesList = data['data']
          }
        })

        this.getDevDailyReport();

        this._db.getDevTasks(this.currentUser.key || '').subscribe(
          (data) => {
            if (data['status'] == ResStatus.CRUD) {

              this.myTasks = data['data'];
              console.log(this.myTasks);
            }
          },
          (err) => console.log(err)
        )

        this._db.getDevSupportTasks(this.currentUser.key || '').subscribe(
          (data) => {

            if (data['status'] == ResStatus.CRUD) {
              this.mySupportTasks = data['data']
            }
          }
        )
      }



    })
  }


  getDevDailyReport() {
    this._db.getDevDailyReport(this.currentUser.key || '', this.currentWeekDays[0], this.currentWeekDays[this.currentWeekDays.length - 1]).subscribe(data => {
      if (data['status'] == ResStatus.CRUD) {

        this.myReportsList = data['data']
        this.totalHoursCalculation()
      } else if (data['status'] == ResStatus.Success_But_Empty) {
        this.myReportsList = [];
      }

    }, console.log)
  }

  validateReportData() {
    this.timesheetLoader = true;
    let invalid = false;

    const todayDate = new DatePipe('en-Us').transform(this.today, 'yyyy-MM-dd', 'GMT') || '';

    // calc yesterdayDate
    const yesterday = new Date(this.today);
    const yesterdayDate = new DatePipe('en-Us').transform(new Date(yesterday.setDate(yesterday.getDate() - 1)), 'yyyy-MM-dd', 'GMT') || '';


    //reportDate with format yyyy-MM-dd
    const reportDate = new DatePipe('en-Us').transform(this.newReport.reportDate, 'yyyy-MM-dd') || '';
    // const reportDate = `${new Date(this.newReport.reportDate).getFullYear()}-${new Date(this.newReport.reportDate).getMonth() + 1}-${new Date(this.newReport.reportDate).getDate()}`
    // console.log(this.today, todayDate, reportDate, yesterdayDate);

    if (!this.currentUser.canAddPreviousReports) {
      if (todayDate != reportDate && yesterdayDate != reportDate) {
        //   invalid = true;
        //   this.timesheetLoader = false;
        //   return this.notify.openSnackbar(`Stop Sheeting Ya ${this.currentUser.username},You tried to fill a report with wrong date!`, SnackBarState.Error, 10000);
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Tried to fill a report with wrong date ${JSON.stringify(this.newReport)}\n
         Today Date is (server time) ${todayDate} And Report Date is ${reportDate} (user selected time)`,
          `${this.currentUser.key} Has Tried to fill a report with wrong date ${JSON.stringify(this.newReport)}\n
         Today Date is (server time) ${todayDate} And Report Date is ${reportDate} (user selected time)`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Warning'
        ).subscribe()
      }
    }



    if ((new Date(this.newReport.reportDate).getDay() == Days.Friday || new Date(this.newReport.reportDate).getDay() == Days.Saturday) && (this.newReport.time_activity == Activity.UNPAID_VACATION || this.newReport.time_activity == Activity.OFFICIAL_VACATION || this.newReport.time_activity == Activity.IDEAL_HOURS)) {
      invalid = true;
      this.timesheetLoader = false;
      return this.notify.openSnackbar('You tried to fill a report on the weekend with invalid data!', SnackBarState.Error);
    }



    if (!!this.newReport.details && this.newReport.details.trim().length <= 10 || this.newReport.details == undefined) {
      invalid = true;
      this.timesheetLoader = false;

      return this.notify.openSnackbar('Details Is Invalid Please Enter a valid Data!', SnackBarState.Error);
    }

    if (this.newReport.preApprovedDuration == undefined || this.newReport.preApprovedDuration <= 0) {
      invalid = true;
      this.timesheetLoader = false;

      // console.log(this.newReport);

      return this.notify.openSnackbar('Duration Is Invalid Please Enter a valid Data!', SnackBarState.Error);
    }

    if ((this.newReport.time_activity == Activity.DAILY_TASK || this.newReport.time_activity == Activity.SUPPORT) && (this.newReport.taskID == undefined || !this.newReport.taskID)) {
      invalid = true;
      this.timesheetLoader = false;
      return this.notify.openSnackbar('Task Is Invalid Please Enter a valid Data!', SnackBarState.Error);
    }


    if (this.newReport.time_activity == Activity.DAILY_TASK && this.newReport.progress == undefined) {
      invalid = true;
      this.timesheetLoader = false;

      return this.notify.openSnackbar('Progress Is Invalid!', SnackBarState.Error);
    }

    if ((this.newReport.time_activity == Activity.CLIENT_MEETING || this.newReport.time_activity == Activity.IDEAL_HOURS) && (this.newReport.projectID == undefined || this.newReport.processID == undefined)) {
      invalid = true;
      this.timesheetLoader = false;
      return this.notify.openSnackbar('Process Is Invalid Please Enter a valid Data!', SnackBarState.Error);
    }

    if ((this.newReport.managerApprovalKey == undefined || this.newReport.managerApprovalKey.length <= 0) && (this.newReport.seniorToApproveKey == undefined || this.newReport.seniorToApproveKey.length <= 0)) {
      invalid = true;
      this.timesheetLoader = false;
      return this.notify.openSnackbar('Please Choose Approval Manager Or Senior!', SnackBarState.Error);
    }

    if (!this.reportInEditMode) {
      if ((!!this.newReport.progress && (this.taskTotalProgress + this.newReport.progress > 100)) || (!!this.newReport.progress && (this.newReport.progress <= 0 || this.newReport.progress > 100))) {
        invalid = true
        this.timesheetLoader = false;
        return this.notify.openSnackbar('Your Progress Is Invalid!', SnackBarState.Error);
      }
    } else {
      if ((!!this.newReport.progress && (this.taskTotalProgress > 100)) || (!!this.newReport.progress && (this.newReport.progress <= 0 || this.newReport.progress > 100))) {
        invalid = true
        this.timesheetLoader = false;
        return this.notify.openSnackbar('Your Progress Is Invalid!', SnackBarState.Error);
      }
    }

    if (!invalid) {
      if (this.reportInEditMode) {
        this.saveEditedReport()
      } else {
        this.createNewReport()
      }
    } else {
      this.timesheetLoader = false;
    }

  }

  createNewReport() {
    this.timesheetLoader = true;

    this.newReport.devID = this.myID;
    this.newReport.devName = this.myName;
    // this.newReport.devImgURL = !!this.currentUser.photoURL ? this.currentUser.photoURL : '';
    this.newReport.durationByHours = this.newReport.preApprovedDuration;

    if (!!this.newReport.taskID) {
      let task;
      if (this.newReport.time_activity == Activity.DAILY_TASK) {
        task = this.myTasks.find(task => task.key == this.newReport.taskID)
      } else if (this.newReport.time_activity == Activity.SUPPORT) {
        task = this.mySupportTasks.find(task => task.key == this.newReport.taskID)
      }
      this.newReport.taskTitle = task?.title
      this.newReport.projectID = task?.project_key
      this.newReport.projectName = task?.project_title
      this.newReport.processID = task?.process_key
      this.newReport.processName = task?.process_title
    }

    if (!!this.newReport.processID) {
      const myprocess = this.myProcess.find(p => p.key == this.newReport.processID)
      if (!!myprocess) {
        this.newReport.processName = myprocess.title;
      }
    }

    if (!!this.newReport.projectID) {
      const myproject = this.myProjectsList.find(p => p.key == this.newReport.projectID)
      if (!!myproject) {
        this.newReport.projectName = myproject.title;
      }
    }

    // if(this.newReport.time_activity == Activity.IDEAL_HOURS){
    //   if(!!this.newReport.projectID){ 
    //     this.newReport.projectName = this.myProjectsList.find(project=>project.key == this.newReport.projectID)?.title
    //   }else{
    //     this.newReport.projectName = environment.staticFGSProjectTitle;
    //     this.newReport.projectID = environment.staticFGSProjectKey;
    //   }
    // }


    this.newReport.approved = false;



    if (!!this.newReport.seniorToApproveKey && this.newReport.seniorToApproveKey.length > 0) {
      const serName = this.seniors.find(user => this.newReport.seniorToApproveKey == user.key)?.username;
      if (!!serName) {
        this.newReport.seniorToApproveName = serName
      }

      this.newReport.managerApprovalKey = '';
      this.newReport.managerApprovalname = '';
      this.newReport.report_status_id = ReportStatus.Pending_On_Senior;

    } else {
      const manName = this.managers.find(user => this.newReport.managerApprovalKey == user.key)?.username;
      if (!!manName) {
        this.newReport.managerApprovalname = manName
      }
      this.newReport.report_status_id = ReportStatus.Pending_On_Manager;
    }



    if (!!this.newReport.outSourceTasksDate && this.selectedTask?.task_type_id == 7) {

      this.createMultipleReports()
    } else {

      const newDate = new Date(this.newReport.reportDate)
      this.newReport.reportDate = `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`;
      this.createReport(this.newReport);
    }

  }
  createReport(newReport: DevDailyReport) {
    this._db.createNewReport(newReport).subscribe(res => {

      if (res['status'] == ResStatus.CRUD) {
        this.totalHoursCalculation()
        this.getDevDailyReport();
        this.notify.openSnackbar(`Report Created Successfully`, SnackBarState.Success)
        // Reset Form
        const todayDate = this.today ? new DatePipe('en-Us').transform(this.today, 'yyyy-MM-dd', 'GMT') : new Date().toDateString();
        this.newReport = {
          devID: '',
          devName: '',
          durationByHours: 0,
          reportDate: todayDate as string,
          time_activity: Activity.DAILY_TASK,
          preApprovedDuration: 0
        }
        // console.log(this.today ,todayDate);

        this.timesheetLoader = false;
      } else {
        this.notify.openSnackbar(`Error, ${JSON.stringify(res['data'])}`, SnackBarState.Warning)
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Status ${JSON.stringify(res['status'])} =>  Error ${JSON.stringify(res['data'])} while creating his report ${JSON.stringify(this.newReport)}`,
          `${this.currentUser.key} Has Error while creating his report`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Faild'
        ).subscribe()
        this.timesheetLoader = false;

      }
    }, err => {

      this.notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error)
      this._db.createSystemLogs(
        `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while creating his report ${JSON.stringify(this.newReport)}`,
        `${this.currentUser.key} Has Error while creating his report`,
        this.currentUser.key || '',
        this.currentUser.username,
        'Faild'
      ).subscribe()
      this.timesheetLoader = false;

    })

  }

  createMultipleReports() {
    const reportsToCreate: DevDailyReport[] = [];

    if (!this.newReport.outSourceTasksDate) {
      return
    }

    // Build an inclusive date range from the selected outsourced task dates.
    const selectedDates = this.newReport.outSourceTasksDate
      .map((date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
      })
      .sort((a, b) => a.getTime() - b.getTime());

    const rangeDates: Date[] = [];
    if (selectedDates.length > 0) {
      const startDate = new Date(selectedDates[0]);
      const endDate = new Date(selectedDates[selectedDates.length - 1]);
      const cursor = new Date(startDate);

      while (cursor <= endDate) {
        rangeDates.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    for (let i in rangeDates) {
      const currentDate = new Date(rangeDates[i]);
      const reportDate = new DatePipe('en-Us').transform(currentDate, 'yyyy-MM-dd') || '';
      // const reportDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
      const report: DevDailyReport = {
        ...this.newReport,
        reportDate: reportDate
      }
      reportsToCreate.push(report);
    }

    if (reportsToCreate.length < 1) {
      this.timesheetLoader = false;
      return;
    }

    forkJoin(reportsToCreate.map((report) => this._db.createNewReport(report))).subscribe(responses => {
      const failedResponses = responses.filter((res) => res['status'] != ResStatus.CRUD);

      if (failedResponses.length > 0) {
        this.notify.openSnackbar(`Error, some reports were not created`, SnackBarState.Warning);
      } else {
        this.notify.openSnackbar(`Reports Created Successfully`, SnackBarState.Success);
      }

      this.getDevDailyReport();
      this.timesheetLoader = false;
      this.displayModal = false;
    }, err => {
      console.log(err);
      this.notify.openSnackbar(`Error, ${JSON.stringify(err['error']?.['data'] || err)}`, SnackBarState.Error);
      this.timesheetLoader = false;
    })
  }


  getDate(date) {
    const day = `${date.getDate()}`
    const month = `${date.getMonth() + 1}`
    const year = date.getFullYear()
    const realDate = `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year}`
    return realDate
  }

  totalHoursCalculation() {
    this.totalHours = []
    for (let i in this.currentWeekDays) {
      const day = this.getDate(this.currentWeekDays[i])
      const daysData = this.myReportsList.filter(report => report.reportDate == day)
      if (daysData.length > 0) {
        const dayTotal: number[] = []
        for (let i in daysData) {
          if (daysData[i].rejected != true) {
            dayTotal.push(daysData[i].durationByHours)
          }
        }
        const onDay = dayTotal.reduce((a, b) => a + b)
        this.totalHours.push(onDay)
      } else {
        this.totalHours.push(0)
      }
    }
  }

  deleteReport(report: DevDailyReport) {
    this.notify.openDialog(
      'Delete Report ?!',
      `Are you sure you want to delete This Report ?!`,
      false,
      '* Deleteing this task Report not be restored !!',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deletePendingDevDailyReport(report.key || '').subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this.notify.openSnackbar('Report Deleted Successfully!', SnackBarState.Success);
              this.getDevDailyReport()
            } else {
              this.notify.openSnackbar('Somthing Wrong!', SnackBarState.Error);
            }
          }, err => {
            this.notify.openSnackbar('Somthing Wrong!', SnackBarState.Error);
            console.log(err);
          })

        } else {
          this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }



  changeDuration() {

    this.newReport.projectID = null;
    this.newReport.processID = null;
    this.newReport.taskID = null;
    if (this.newReport.time_activity == Activity.UNPAID_VACATION || this.newReport.time_activity == Activity.OFFICIAL_VACATION) {
      // const rDate = new Date(this.newReport.reportDate)
      this.newReport.preApprovedDuration = 8;
      // this.db.getRamadanDay(`${rDate.getMonth()+1}/${rDate.getDate()}/${rDate.getFullYear()}`).subscribe(ramadan=>{      
      //   if(ramadan.length > 0){
      //     this.newReport.preApprovedDuration = 6;
      //   }else{
      //     this.newReport.preApprovedDuration = 8;
      //   }
      // })
    } else {
      this.newReport.preApprovedDuration = 0
    }
  }

  openList() {
    this.tasksIsOpened = !this.tasksIsOpened
  }
  // changeActivitySelection(){
  //   this.newReport.taskID = null
  //   this.newReport.taskTitle = null
  //   this.newReport.processID = null
  //   this.newReport.processName = null
  //   this.newReport.projectID = null
  //   this.newReport.projectName = null
  //   this.selectedTask = undefined;
  //   this.newReport.seniorToApproveKey = null;
  //   this.newReport.seniorToApproveName = null;
  //   this.getManagersAndSeniors();
  //   if(this.newReport.time_activity == Activity.DAILY_TASK || this.newReport.time_activity == Activity.SUPPORT){
  //     this.getSelectedTask();
  //   }
  // }

  getSelectedTask() {
    const selectedTask = this.myTasks.find(t => t.key == this.newReport.taskID);
    console.log(selectedTask,this.myTasks ,this.newReport.taskID );
    
    if (!!selectedTask) {
      this.selectedTask = selectedTask;
      if (this.selectedTask.seniorToApproveID) {
        if (this.selectedTask.seniorIsMandatory) {
          this.newReport.seniorToApproveKey = this.selectedTask.seniorToApproveID;
          this.newReport.seniorToApproveName = this.selectedTask.seniorToApproveName;
          this.seniors = this.seniors.filter(s => s.key == this.selectedTask?.seniorToApproveID)
        } else {
          this.seniors = this.seniors.filter(s => s.key == this.selectedTask?.seniorToApproveID)
        }
      } else {
        this.getManagersAndSeniors()
        // this.selectedTask = undefined;
        this.newReport.seniorToApproveKey = null;
        this.newReport.seniorToApproveName = null;
      }
      console.log(this.selectedTask , selectedTask);
      
      if (this.selectedTask?.task_type_id == 7) {

        this.isOutSourcedTask = true;
        this.newReport.outSourceTasksDate = [new Date(this.newReport.reportDate)]
      }else{
        this.isOutSourcedTask = false;
        this.newReport.outSourceTasksDate = [];
      }
    } else {
      this.selectedTask = undefined;
      this.newReport.seniorToApproveKey = null;
      this.newReport.seniorToApproveName = null;
      this.getManagersAndSeniors()
    }
  }

  getTaskProgress() {
    if (!!this.newReport.taskID) {
      this._db.getTaskProgress(this.newReport.taskID).subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.taskTotalProgress = res['data']
        }
      })
    }
  }


  editReport(report: DevDailyReport) {
    this.getReportTypes();
    this.getManagersAndSeniors();

    this.reportInEditMode = true
    this.newReport = report;
    this.newReport.time_activity = report.time_activity.toString() as Activity;

    this.newReport.reportDate = new DatePipe('en-Us').transform(this.newReport.reportDate, 'yyyy-MM-dd') || '';
    if (this.newReport.report_status_id == ReportStatus.Pending_On_Manager) {
      this.newReport.seniorToApproveKey = null
      this.newReport.seniorToApproveName = null
    }
    // this.getProjectProcess();
    this.myProcess = [];
    this.myProcess = this.myProcessesList.filter(p => p.project_key == this.newReport.projectID)
    for (let i in this.myProcess) {
      let ps;
      if (this.newReport.time_activity == Activity.DAILY_TASK) {
        ps = this.myTasks.filter(t => t.process_key == this.myProcess[i].key)
      } else if (this.newReport.time_activity == Activity.SUPPORT) {
        ps = this.mySupportTasks.filter(t => t.process_key == this.myProcess[i].key)
      }
      if (!!ps && ps.length < 1) {
        this.myProcess.splice(parseInt(i), 1)
      }
    }

    this.myTasksList = [];
    if (this.newReport.time_activity == Activity.DAILY_TASK) {
      this.myTasksList = this.myTasks.filter(t => t.process_key == this.newReport.processID)
    } else if (this.newReport.time_activity == Activity.SUPPORT) {
      this.myTasksList = this.mySupportTasks.filter(t => t.process_key == this.newReport.processID)
    }
    this.getSelectedTask();
    this.getTaskProgress();

    if (!this.newReport.preApprovedDuration) {
      this.newReport.preApprovedDuration = this.newReport.durationByHours;
    }

    // console.log(this.newReport);

  }

  saveEditedReport() {
    this.timesheetLoader = true;

    this.newReport.durationByHours = this.newReport.preApprovedDuration;

    if (!!this.newReport.taskID) {
      let task;
      if (this.newReport.time_activity == Activity.DAILY_TASK) {
        task = this.myTasks.find(task => task.key == this.newReport.taskID)
      } else if (this.newReport.time_activity == Activity.SUPPORT) {
        task = this.mySupportTasks.find(task => task.key == this.newReport.taskID)
      }
      this.newReport.taskTitle = task?.title
      this.newReport.projectID = task?.project_key
      this.newReport.projectName = task?.project_title
      this.newReport.processID = task?.process_key
      this.newReport.processName = task?.process_title
    }

    if (!!this.newReport.processID) {
      const myprocess = this.myProcess.find(p => p.key == this.newReport.processID)
      if (!!myprocess) {
        this.newReport.processName = myprocess.title;
      }
    }

    if (!!this.newReport.projectID) {
      const myproject = this.myProjectsList.find(p => p.key == this.newReport.projectID)
      if (!!myproject) {
        this.newReport.projectName = myproject.title;
      }
    }


    // if(this.newReport.time_activity == Activity.IDEAL_HOURS){
    //   if(!!this.newReport.projectID){ 
    //     this.newReport.projectName = this.myProjectsList.find(project=>project.key == this.newReport.projectID)?.title
    //   }else{
    //     this.newReport.projectName = environment.staticFGSProjectTitle;
    //     this.newReport.projectID = environment.staticFGSProjectKey;
    //   }
    // }


    // this.newReport.approved = false;



    if (!!this.newReport.seniorToApproveKey && this.newReport.seniorToApproveKey.length > 0) {
      const serName = this.seniors.find(user => this.newReport.seniorToApproveKey == user.key)?.username;
      if (!!serName) {
        this.newReport.seniorToApproveName = serName
      }

      this.newReport.managerApprovalKey = '';
      this.newReport.managerApprovalname = '';
      this.newReport.report_status_id = ReportStatus.Pending_On_Senior;

    } else {
      const manName = this.managers.find(user => this.newReport.managerApprovalKey == user.key)?.username;
      if (!!manName) {
        this.newReport.managerApprovalname = manName
      }
      this.newReport.report_status_id = ReportStatus.Pending_On_Manager;
    }

    this._db.editReport(this.newReport).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.reportInEditMode = false;
        this.notify.openSnackbar("Report Edited Successfully!", SnackBarState.Success)
        this.newReport = {
          devID: '',
          devName: '',
          reportDate: new Date(this.today).toDateString(),
          durationByHours: 0,
          details: "",
          progress: 0,
          time_activity: Activity.DAILY_TASK,
          preApprovedDuration: 0
        }
        this.getDevDailyReport()
        this.timesheetLoader = false;
      } else {
        this.notify.openSnackbar("Error !", SnackBarState.Error)
        this.timesheetLoader = false;

      }
    }, err => {
      this.notify.openSnackbar("Error !", SnackBarState.Error)
      console.log(err);
      this.timesheetLoader = false;

    })
  }


  resetForm() {
    this.reportInEditMode = false;
    this.newReport = {
      devID: '',
      devName: '',
      reportDate: !!this.today ? new Date(this.today).toDateString() : new Date(this.today).toDateString(),
      durationByHours: 0,
      details: "",
      progress: 0,
      time_activity: Activity.DAILY_TASK,
      preApprovedDuration: 0
    }
    this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  }


  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  showDayReports(index: number) {
    document.getElementById('day' + index)!.classList.toggle('d-none');
    this.openedDay[index] = !this.openedDay[index]
    // if(this.openedDay == index){
    //   this.openedDay = undefined;
    // }else{
    //   this.openedDay = index;
    // }
  }
  cancelEdit() {
    this.reportInEditMode = false;
    this.newReport = {
      devID: '',
      devName: '',
      reportDate: new Date().toDateString(),
      durationByHours: 0,
      time_activity: Activity.DAILY_TASK,
      preApprovedDuration: 0
    }
  }
  getDevTickets() {
    this._db.getMyTickets().subscribe((tickets) => {
      if (tickets['status'] == ResStatus.CRUD) {
        this.recentClientTickets = tickets['data'];
        let openTickets: Boolean = false;
        for (let i in this.recentClientTickets) {
          if (this.recentClientTickets[i].status == ClientTicketStatus.STARTED) {
            openTickets = true;
            break;
          }
        }

        if (openTickets == true) {
          this.recentClientTickets = this.recentClientTickets.sort((a, b) => {
            return compare(a.status, b.status, true);
          })
        } else {
          this.recentClientTickets = this.recentClientTickets.reverse()
        }

      }
    })
  }
  handleDatesFormat() {
    //dates with format 'yyyy-MM-dd'

    const y = new Date();
    y.setDate(y.getDate() - 1);
    this.yesterDay = new DatePipe('en-Us').transform(y, 'yyyy-MM-dd') || '';


    this.toDay = new DatePipe('en-Us').transform(new Date(), 'yyyy-MM-dd') || '';
    // console.log(this.yesterDay, this.toDay, this.today);
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
