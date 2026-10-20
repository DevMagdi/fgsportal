import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { AdminTaskTeam, AdminTasks } from 'src/app/interfaces/admin-tasks';
import { Status } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { TaskStatus } from 'src/app/interfaces/task';
import { Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-manage-admin-tasks',
  templateUrl: './manage-admin-tasks.component.html',
  styleUrls: ['./manage-admin-tasks.component.scss']
})
export class ManageAdminTasksComponent implements OnInit {
  currentUser:User;
  runningTasks:AdminTasks[]=[];
  admins:User[];
  adminTasksLoader:boolean = false;
  taskStatus:TaskStatus[] = [
    {id:1,task_status_name:'Running'},
    {id:5,task_status_name:'Closed'},
  ];
  editMode:boolean = false;
  newTaskForm:FormGroup = new FormGroup({
    'task_title':new FormControl(null, Validators.required),
    'task_description':new FormControl(null), 
    'task_start_date':new FormControl(null, Validators.required),
    'task_end_date':new FormControl(null, Validators.required),
    'task_status_id':new FormControl(1, Validators.required),
    'task_team':new FormControl(null, Validators.required),
    'id':new FormControl(null),
  })


  adminTasks:AdminTasks[]=[];
  admin_id:string = '';

  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      this.getRunningTasks();
    })
  }

  getAdmins(){
    if(this.currentUser.department == Department.MANAGEMENT){
      this._auth.getAllUsers().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.admins = res['data'].filter(u=>u.department == Department.ADMINSTRATION);          
        }else{
          this.admins = [];
        }
      },err=>{
        this.admins = [];
        console.log(err);
      })
    }
  }

  getRunningTasks(){
    this._db.getAdminTasksByTaskStatus('1').subscribe(res=>{
      this.adminTasksLoader = false;
      if(res['status'] == ResStatus.CRUD){
        this.runningTasks = res['data']
      }else{
        this.runningTasks = []
      }
    },err=>{
      this.adminTasksLoader = false;
      console.log(err);
      this.runningTasks = []
    })
  }

  addNewTask(){
    this.adminTasksLoader = true;
    const taskTeam:AdminTaskTeam[]=[{
      user_id:this.newTaskForm.get('task_team')?.value
    }]
    const newTask:AdminTasks={
      task_title:this.newTaskForm.get('task_title')?.value,
      task_description:this.newTaskForm.get('task_description')?.value,
      task_start_date:this._db.getDateFormatted(this.newTaskForm.get('task_start_date')?.value),
      task_end_date:this._db.getDateFormatted(this.newTaskForm.get('task_end_date')?.value),
      task_team:taskTeam,
      task_status_id:this.newTaskForm.get('task_status_id')?.value,
    }

    if(this.editMode == true){
      newTask.id = this.newTaskForm.get('id')?.value
      this._db.updateAdminTask(newTask).subscribe(res=>{
        this.adminTasksLoader = false;
        if(res['status'] == ResStatus.CRUD){
          this._notify.openSnackbar('Task updated successfully', SnackBarState.Success);
          this.newTaskForm.reset();
          this.newTaskForm.patchValue({
            'task_status_id':1
          })
          this.getRunningTasks();
          this.editMode = false;
        }
      },err=>{
        this.adminTasksLoader = false;
        console.log(err);
      })
    }else{
      this._db.createNewAdminTask(newTask).subscribe(res=>{
        this.adminTasksLoader = false;
        if(res['status'] == ResStatus.CRUD){
          this._notify.openSnackbar('Task created successfully', SnackBarState.Success);
          this.newTaskForm.reset();
          this.newTaskForm.patchValue({
            'task_status_id':1
          })
          this.getRunningTasks();
        }
      },err=>{
        this.adminTasksLoader = false;
        console.log(err);
      })
  
    }
    
  }

  closeForm(){
    this.newTaskForm.reset();
    this.newTaskForm.patchValue({
      'task_status_id':1
    })
    this.editMode = false;
  }

    
  clear(table: Table) {
    table.clear();
  }


  editTask(task:AdminTasks){    
    this.editMode = true;
    if(!this.admins || this.admins.length == 0){
      this.getAdmins();
    }
    this.newTaskForm.patchValue({
      'task_title':task.task_title,
      'task_description':task.task_description,
      'task_start_date':this._db.getDateFormattedYearMonthDay(task.task_start_date),
      'task_end_date':this._db.getDateFormattedYearMonthDay(task.task_end_date),
      'task_status_id':task.task_status_id,
      'task_team':task.task_team[0].user_id.toString(),
      'id':task.id,
    })    
  }


  deleteTask(task:AdminTasks){
    this._notify.openDialog(
      'Delete Task?',
      `Are you sure you want to delete This Task?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.adminTasksLoader = true;
          this._db.deleteAdminTask(task.id || '').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.getRunningTasks()
              this._notify.openSnackbar(`Task Deleted Successfully` , SnackBarState.Success)
              this.adminTasksLoader = false;
            }else{
              this._notify.openSnackbar(`something wrong ${JSON.stringify(response['data'])}` , SnackBarState.Warning,5000)
              this.adminTasksLoader = false;
            }
          },err=>{
            this._notify.openSnackbar(`Error ${JSON.stringify(err['error']['data'])}` , SnackBarState.Error,5000)
            this.adminTasksLoader = false;
          })          
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }


  closeTask(task:AdminTasks){
    this._notify.openDialog(
      'Close Task?',
      `Are you sure you want to Close This Task?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.adminTasksLoader = true;
          this._db.updateAdminTaskStatus(task.id || '' , Status.CLOSED).subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.getRunningTasks()
              this._notify.openSnackbar(`Task Closed Successfully` , SnackBarState.Success)
              this.adminTasksLoader = false;
            }else{
              this._notify.openSnackbar(`something wrong ${JSON.stringify(response['data'])}` , SnackBarState.Warning,5000)
              this.adminTasksLoader = false;
            }
          },err=>{
            this._notify.openSnackbar(`Error ${JSON.stringify(err['error']['data'])}` , SnackBarState.Error,5000)
            this.adminTasksLoader = false;
          })          
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }






  /* =================================================== Get Admin Tasks ================================== */
  checkAdmins(){
    if(!this.admins || this.admins.length == 0){
      this.getAdmins();
    }
  }


  getAdminTasks(){
    this.adminTasksLoader = true;
    if(!!this.admin_id){
      this._db.getAdminTasksByAdminID(this.admin_id).subscribe(res=>{
        this.adminTasksLoader = false;
        if(res['status'] == ResStatus.CRUD){
          this.adminTasks = res['data']
        }else{
          this.adminTasks = [];
        }
      },err=>{
        this.adminTasks = [];
      })
    }else{
      this.adminTasksLoader = false;
      this.adminTasks = [];
    }
  }


  changeTaskStatus(task:AdminTasks){
    this._notify.openDialog(
      `${task.task_status_id == '1' ? 'Open' : 'Close' } Task?`,
      `Are you sure you want to ${task.task_status_id == '1' ? 'Open' : 'Close' } This Task?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.adminTasksLoader = true;
          this._db.updateAdminTaskStatus(task.id || '' , task.task_status_id).subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.getAdminTasks();
              this._notify.openSnackbar(`Task status changed Successfully` , SnackBarState.Success)
              this.adminTasksLoader = false;
            }else{
              this._notify.openSnackbar(`something wrong ${JSON.stringify(response['data'])}` , SnackBarState.Warning,5000)
              this.adminTasksLoader = false;
            }
          },err=>{
            this._notify.openSnackbar(`Error ${JSON.stringify(err['error']['data'])}` , SnackBarState.Error,5000)
            this.adminTasksLoader = false;
          })          
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

}
