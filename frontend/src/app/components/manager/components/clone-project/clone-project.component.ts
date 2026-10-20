import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { CloneProjectI, OldProjectI, ProjectStructure } from 'src/app/interfaces/project';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-clone-project',
  templateUrl: './clone-project.component.html',
  styleUrls: ['./clone-project.component.scss']
})
export class CloneProjectComponent implements OnInit {

  project!: OldProjectI;
  newProject: CloneProjectI;
  isSubmitted: boolean=false;
  getDataLoader:boolean = false;
  errors=[];
  projectStructure=ProjectStructure
  constructor(private _auth: AuthApiService, private route: ActivatedRoute,
    private _notify:NotificationService,private router:Router) { }


  ngOnInit(): void {
    this.getProjectForClone();
  }

  getProjectForClone() {
    this.getDataLoader = true;
    const projectID = this.route.snapshot.params.id;
    this._auth.GetProjectForClone(projectID).subscribe({
      next: (res: any) => {
        this.project = res.data;
        // console.log(this.project);
        if (this.project) {
          let project_team = this.project.teams!.map(x => {
            return { user_team_id: x.user_team_id, project_structure_id: x.project_structure_id }
          })
          this.newProject = {
            project_title: this.project.title,
            project_id: this.project.project_key || '',
            project_team: project_team,
            processes_id: [],
            isConfirmed:false
          }
          this.project.processes!.forEach(element => {
            // console.log(element);

            let process = {
              process_id: element.process_key,
              tasks_id: element.process_tasks.map(x => x.key)
            }
            this.newProject.processes_id?.push(process)

          });
          // console.log(this.newProject);



        }
    this.getDataLoader = false;


      }, error:(err)=> {
       
    this.getDataLoader = false;
        
      },
    })
  }

  onSubmit() {
    this.isSubmitted=true;
    if (this.project.title == this.newProject.project_title) {

      return
    }
    this._auth.cloneProject(this.newProject).subscribe({
      next: (res: any) => {
      
      this._notify.openSnackbar('Project cloned successfully', SnackBarState.Success);
      console.log(res);
      this.router.navigate(['manager', 'projects', res.data.project_id])
      
      

      }, error:(err)=> {
        
        if (err.status==405) {
          
          
        this.handleErrors(err)
        }
        if (err.status==400) {
          this.errors=err.error.data
        }
      },
    })
  }
  handleErrors(err:any){
    this._notify.openDialog(
      'Need Confirm',
      err.error.data.warning,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.newProject.isConfirmed=true;
          this.onSubmit();
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

  toggleProcess(event: any, process: any) {
    let checked = event.target.checked;
    // let process=process;
    // console.log(event.target.checked,process.process_key);
    let index = this.newProject.processes_id?.findIndex(x => x.process_id == process.process_key) as number;
    // console.log(index);

    if (!checked && index != -1) {
      this.newProject.processes_id?.splice(index, 1)

    }
    else if (checked && index == -1) {

      this.newProject.processes_id?.push({ process_id: process.process_key, tasks_id: process.process_tasks.map(x => x.key) })

    }
    console.log(this.newProject);

  }
  
  checkTask(process: any) {

    let index = this.newProject.processes_id?.findIndex(x => x.process_id == process.process_key);
    if (index != -1) {
      return true
    }
    return false

  }

  toggleTask(event: any, process: any,task:any) {
    let checked = event.target.checked;
    let obj = this.newProject.processes_id?.find(x => x.process_id == process.process_key);
    if (!checked && obj) {
      obj.tasks_id= obj.tasks_id.filter((x) => x !== task.key)
    }else if(checked && obj){

      obj.tasks_id.push(task.key)
    }


  }

  toggleTeam(event: any, team: any) {
    let checked = event.target.checked;

    if (!checked) {
      this.newProject.project_team = this.newProject.project_team!.filter((t) => t.user_team_id != team.user_team_id)
    }
    else {
      this.newProject.project_team!.push({ user_team_id: team.user_team_id, project_structure_id : team.project_structure_id})
    }

    console.log(this.newProject);
    

  }

}
