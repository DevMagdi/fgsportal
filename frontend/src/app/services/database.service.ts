import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable, Subject } from 'rxjs';
import { SystemLogs } from '../interfaces/system-logs';
import { Project, ProjectStatus, ProjectTeam } from '../interfaces/project';
import { Client, Partner } from '../interfaces/user';
import { ProcessStatus, ProcessTeam, SUB_TASk, Task, TaskStatus } from '../interfaces/task';
import { DevDailyReport } from '../interfaces/dev-daily-report';
import { PublicRequests } from '../interfaces/public-requests';
import { Transportations } from '../interfaces/transportations';
import { AnnualLeave, PermissionAndLeavesConfig } from '../interfaces/annualLeave';
import { ClientTicket, ClientTicketTimeLine, ProjectSupport, ProjectSupportHistory } from '../interfaces/client-ticket';
import { OfficialVacation, WorkingHoursConfiguration } from '../interfaces/ramadan';
import { ActivitiesFilterBody, Contacts, CRMFilterBody, Labels, LeadsAndContacts, LeadsAndContactsActivity, POCRequestAction, RFPRequestStatus } from '../interfaces/leadsAndContacts';
import { AskForRate, Question, QuestionGroup, RateAnswers, Rating } from '../interfaces/rating';
import { Notes, NotesRealTime } from '../interfaces/notes';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { AdminReports } from '../interfaces/admin-reports';
import { AdminTasks } from '../interfaces/admin-tasks';
import { FilterBody } from '../interfaces/manager-report';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private NotesPath = '/Notes';

  NotesRef: AngularFireList<NotesRealTime>;

  manageManagerReport$ = new Subject();
  removeManagerReport$ = new Subject();

  constructor(private _http: HttpClient,
    private db: AngularFireDatabase) {
    this.NotesRef = db.list(this.NotesPath);

  }

  // ===================================== Date Section ==============================

  chatGPTConnection(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.chatGPTApiKey}`
    });
    const data = {
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.7
    };
    return this._http.post(environment.chatGPTApi, data, { headers });
  }

  getLocalStringDate() {
    return `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}, ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  }

  getServerTime(): Observable<any> {
    return this._http.get(`${environment.newServerApi}/api/users/GetTimeDate`)
  }

  getDateFormatted(date) {
    const day = `${new Date(date).getDate()}`;
    const month = `${new Date(date).getMonth() + 1}`;
    const year = `${new Date(date).getFullYear()}`;
    return `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year}`
  }


  getDateFormattedYearMonthDay(date) {
    const day = `${new Date(date).getDate()}`;
    const month = `${new Date(date).getMonth() + 1}`;
    const year = `${new Date(date).getFullYear()}`;
    return `${year}-${month.length == 1 ? `0${month}` : month}-${day.length == 1 ? `0${day}` : day}`
  }

  getDateTimeFormatted(date) {
    const day = `${new Date(date).getDate()}`;
    const month = `${new Date(date).getMonth() + 1}`;
    const year = `${new Date(date).getFullYear()}`;
    const hours = `${new Date(date).getHours()}`;
    const minuts = `${new Date(date).getMinutes()}`;
    const seconds = `${new Date(date).getSeconds()}`;
    return `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year} ${hours.length == 1 ? `0${hours}` : hours}:${minuts.length == 1 ? `0${minuts}` : minuts}:${seconds.length == 1 ? `0${seconds}` : seconds}`
  }

  getDateTimeFormattedForInputs(date) {
    const day = `${new Date(date).getDate()}`;
    const month = `${new Date(date).getMonth() + 1}`;
    const year = `${new Date(date).getFullYear()}`;
    const hours = `${new Date(date).getHours()}`;
    const minuts = `${new Date(date).getMinutes()}`;
    const seconds = `${new Date(date).getSeconds()}`;
    return `${year}-${month.length == 1 ? `0${month}` : month}-${day.length == 1 ? `0${day}` : day}T${hours.length == 1 ? `0${hours}` : hours}:${minuts.length == 1 ? `0${minuts}` : minuts}:${seconds.length == 1 ? `0${seconds}` : seconds}`
  }
  getTimeFormatted(date) {
    // Check if the input is a date-only string (YYYY-MM-DD format)
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return "00:00";
    }

    const dateObj = new Date(date);
    const hours = `${dateObj.getHours()}`;
    const minutes = `${dateObj.getMinutes()}`;

    console.log(date, hours, minutes);

    return `${hours.length == 1 ? `0${hours}` : hours}:${minutes.length == 1 ? `0${minutes}` : minutes}`;
  }

  addDurationToTime(datetimeString: string, duration: number = 0): string {
    // Check if input is a full datetime string (YYYY-MM-DDTHH:mm format)
    if (datetimeString.includes('T')) {
      // Handle full datetime
      const dateObj = new Date(datetimeString);

      if (isNaN(dateObj.getTime())) {
        return datetimeString; // Return original if invalid
      }

      // Parse duration where decimal part represents minutes directly
      const durationString = duration.toString();
      const durationParts = durationString.split('.');
      const durationHours = parseInt(durationParts[0], 10);
      const durationMinutes = durationParts.length > 1 ? parseInt(durationParts[1], 10) : 0;

      // Add duration to the date
      dateObj.setHours(dateObj.getHours() + durationHours);
      dateObj.setMinutes(dateObj.getMinutes() + durationMinutes);

      // Return in the same format (YYYY-MM-DDTHH:mm)
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } else {
      // Handle time-only format (HH:mm) - original logic
      const timeParts = datetimeString.split(':');
      if (timeParts.length !== 2) {
        return "00:00"; // Return default if invalid format
      }

      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      // Validate input
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return "00:00"; // Return default if invalid time
      }

      // Parse duration where decimal part represents minutes directly
      const durationString = duration.toString();
      const durationParts = durationString.split('.');
      const durationHours = parseInt(durationParts[0], 10);
      const durationMinutes = durationParts.length > 1 ? parseInt(durationParts[1], 10) : 0;

      // Add duration
      let totalMinutes = (hours * 60) + minutes + (durationHours * 60) + durationMinutes;

      // Handle day overflow (optional: you can modify this behavior)
      totalMinutes = totalMinutes % (24 * 60); // Keep within 24 hours

      // Convert back to hours and minutes
      const resultHours = Math.floor(totalMinutes / 60);
      const resultMinutes = totalMinutes % 60;

      // Format with leading zeros
      const formattedHours = resultHours.toString().padStart(2, '0');
      const formattedMinutes = resultMinutes.toString().padStart(2, '0');

      return `${formattedHours}:${formattedMinutes}`;
    }
  }


  taskStatusRearrange(statusList: TaskStatus[]) {
    const newArr: TaskStatus[] = [];

    statusList.forEach(element => {
      switch (element.id) {
        case 3:
          newArr[0] = element
          break
        case 1:
          newArr[1] = element
          break
        case 5:
          newArr[2] = element
          break
        case 4:
          newArr[3] = element
          break
        case 2:
          newArr[4] = element
          break
      }
    });
    return newArr;
  }

  processStatusRearrange(statusList: ProcessStatus[]) {
    const newArr: ProcessStatus[] = [];

    statusList.forEach(element => {
      switch (element.id) {
        case 3:
          newArr[0] = element
          break
        case 1:
          newArr[1] = element
          break
        case 5:
          newArr[2] = element
          break
        case 4:
          newArr[3] = element
          break
        case 2:
          newArr[4] = element
          break
      }
    });
    return newArr;
  }

  projectStatusRearrange(statusList: ProjectStatus[]) {
    const newArr: ProjectStatus[] = [];

    statusList.forEach(element => {
      switch (element.id) {
        case '3':
          newArr[0] = element
          break
        case '1':
          newArr[1] = element
          break
        case '5':
          newArr[2] = element
          break
        case '4':
          newArr[3] = element
          break
        case '2':
          newArr[4] = element
          break
      }
    });
    return newArr;
  }

  // ===================================== System Logs Section ==============================


  createSystemLogs(myAction: string,
    myActionInKeys: string,
    myempKey: string,
    myempName: string,
    myactionStatus: string): Observable<SystemLogs> {
    const systemLog: SystemLogs = {
      empKey: myempKey,
      empName: myempName,
      action: myAction,
      actionKeys: myActionInKeys,
      actionStatus: myactionStatus,
      createdAt: this.getLocalStringDate()
    }
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...systemLog
    }
    return this._http.post<SystemLogs>(`${environment.newServerApi}/api/users/CreateLogs`, reqOptions)
  }

  getSystemLogs(lastCount: number): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetAllLogs?token=${token._token}&number=${lastCount}`)
  }



  // ===================================== Department Section ==============================

  getAllDeparments(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetAllDepartment?token=${token._token}`)
  }

  getSubDepartmentsByDeparmentID(deptID: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'department_id': `${deptID}`
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSubDepartmentForSpecificDepartment`, reqOptions)
  }



  getAllWorkDegree(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetAllWorkDegree?token=${token._token}`)
  }

  // ===================================== Partners Section ==============================

  getAllClientAccounts(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllClientAccount`, reqOptions)
  }

  getAllPartners(is_org?: boolean): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    if (is_org == false) {
      return this._http.get(`${environment.newServerApi}/api/users/GetAllPartner?token=${token._token}&is_org=0`)
    } else {
      return this._http.get(`${environment.newServerApi}/api/users/GetAllPartner?token=${token._token}`)
    }
  }

  getMyPartners(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetMyPartner?token=${token._token}`)
  }

  getAllOrganizationTypes(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllOrganizeType`, reqOptions)
  }


  getPartnersIndustry(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllPartnerIndustry`, reqOptions)
  }


  createPartner(newPart: Partner): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newPart,
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreatePartner`, reqOptions)
  }

  editPartner(part: Partner): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'partner_id': part.id,
      'partner_name': part.partner_name,
      'partner_description': part.partner_description,
      'partner_address': part.partner_address,
      'email': part.email,
      'phone': part.phone,
      'partner_industry_id': part.partner_industry_id,
      'country': part.country,
      'organize_type_id': part.organize_type_id,
      'website': part.website,
      'is_org': part.is_org,
      'sales_id': part.sales_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdatePartner`, reqOptions)
  }

  editPartnerLogo(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/UpdatePartner`, fd)
  }

  editSpecificPartnerData(partner_id: string, editParams: Object): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'partner_id': partner_id,
    }
    for (let i in editParams) {
      reqOptions[i] = editParams[i];
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdatePartner`, reqOptions)
  }


  getPartnerByID(partner_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'partner_id': partner_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecifciPartner`, reqOptions)
  }


  deletePartner(partner_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'partner_id': partner_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeletePartner`, reqOptions)
  }

  createPrimaryContact(newClient: Client): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newClient
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateClientAccount`, reqOptions)
  }

  updateContact(client: Client): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'client_account_id': client.key,
      ...client
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateClientAccount`, reqOptions)
  }


  deleteContact(client: Client): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'client_account_id': client.key
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteClientAccount`, reqOptions)
  }

  clientResetPassword(email: string): Observable<any> {
    let reqOptions = {
      'email': email,
    }
    return this._http.post(`${environment.newServerApi}/api/clients/ForgetPasswordClient`, reqOptions)
  }

  // ===================================== Projects Section ==============================

  getAllProjectTypes(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetAllProjectType?token=${token._token}`)
  }

  getAllProjects(): Observable<Project[]> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get<Project[]>(`${environment.newServerApi}/api/users/GetAllProject?token=${token._token}`)
  }

  getAllProjectsIncludeClosed(): Observable<Project[]> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post<Project[]>(`${environment.newServerApi}/api/users/GetallProjectWithClosed`, reqOptions)
  }


  createNewProject(newProject: Project): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_title': newProject.title,
      'project_description': newProject.desc,
      'project_duration': newProject.duration,
      'project_start_date': `${newProject.start_date?.getMonth() + 1}/${newProject.start_date?.getDate()}/${newProject.start_date.getFullYear()}`,
      'project_end_date': `${new Date(newProject.end_date)?.getMonth() + 1}/${new Date(newProject.end_date).getDate()}/${new Date(newProject.end_date).getFullYear()}`,
      'project_type_id': newProject.type,
      'project_status_id': 3,
      'partner_id': newProject.partner_id,
      'project_team': newProject.project_team,
      'project_progress': 0,
      'project_budget': newProject.budget,
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateProject`, reqOptions)
  }



  getAllProjectStatus(): Observable<ProjectStatus[]> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get<ProjectStatus[]>(`${environment.newServerApi}/api/users/GetAllProjectStatus?token=${token._token}`)
  }


  getProjectByID(id: string): Observable<Project> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get<Project>(`${environment.newServerApi}/api/users/GetSpecificProject?token=${token._token}&project_id=${id}`)
  }


  editProjectTeam(projectTeam: ProjectTeam[], projectID: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_team': projectTeam,
      'project_id': projectID
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateProjectTeam`, reqOptions)
  }

  updateProjectStatus(project_id: string, project_status_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_id': project_id,
      'project_status_id': project_status_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateProjectStatus`, reqOptions)
  }

  updateProject(project: Project): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_id': project.key,
      'project_title': project.title,
      'project_description': project.desc,
      'project_duration': project.duration,
      'project_start_date': `${new Date(project.start_date).getMonth() + 1}/${new Date(project.start_date).getDate()}/${new Date(project.start_date).getFullYear()}`,
      'project_end_date': `${new Date(project.end_date).getMonth() + 1}/${new Date(project.end_date).getDate()}/${new Date(project.end_date).getFullYear()}`,
      'project_type_id': project.type,
      'project_status_id': project.status,
      'partner_id': project.partner_id
    }
    return this._http.post<Project>(`${environment.newServerApi}/api/users/UpdateProject`, reqOptions)
  }

  updateProjectBudget(project_id: string, Budget: number): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_id': project_id,
      'project_budget': Budget
    }
    return this._http.post<Project>(`${environment.newServerApi}/api/users/UpdateProject`, reqOptions)
  }


  getProjectTeam(project_id): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_id': project_id,
    }
    return this._http.post<Project>(`${environment.newServerApi}/api/users/GetProjectTeam`, reqOptions)

  }

  getProjectTeamUniqe(project_id): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_id': project_id,
    }
    return this._http.post<Project>(`${environment.newServerApi}/api/users/GetProjectTeamUnique`, reqOptions)

  }


  deleteProject(project_id): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_id': project_id,
    }
    return this._http.post<Project>(`${environment.newServerApi}/api/users/DeleteProject`, reqOptions)

  }


  getPMMyProjects(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id,
    }
    return this._http.post<Project>(`${environment.newServerApi}/api/users/GetUserProject`, reqOptions)
  }

  getPMMyProjectsIncludeClosed(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id,
    }
    return this._http.post<Project>(`${environment.newServerApi}/api/users/GetAllProjectWithPM`, reqOptions)
  }


  // ===================================== Process Section ==============================
  createNewProcess(newProcess: SUB_TASk): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'process_title': newProcess.title,
      'process_description': newProcess.desc,
      'process_duration': newProcess.ex_duration,
      'process_start_date': `${this.getDateFormatted(newProcess.start_date)}`,
      'process_end_date': `${this.getDateFormatted(newProcess.end_date)}`,
      'process_status_id': 3,
      'project_id': newProcess.project_key,
      'process_team': newProcess.OtherTeam
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateProcess`, reqOptions)
  }

  getProjectProcess(projectID: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_id': projectID
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetProcessForSpecificProject`, reqOptions)
  }
  getProcessByID(id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'process_id': id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecificProcess`, reqOptions)
  }

  getAllProcessStatus(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get<ProjectStatus[]>(`${environment.newServerApi}/api/users/GetAllProcessStatus?token=${token._token}`)
  }


  editProcess(newProcess: SUB_TASk) {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'process_id': newProcess.key,
      'process_title': newProcess.title,
      'process_description': newProcess.desc,
      'process_duration': newProcess.ex_duration,
      'process_start_date': `${new Date(newProcess.start_date).getMonth() + 1}/${new Date(newProcess.start_date).getDate()}/${new Date(newProcess.start_date).getFullYear()}`,
      'process_end_date': `${new Date(newProcess.end_date).getMonth() + 1}/${new Date(newProcess.end_date).getDate()}/${new Date(newProcess.end_date).getFullYear()}`,
      'process_status_id': newProcess.status,
      'project_id': newProcess.project_key,
      // 'process_team':newProcess.process_team,
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateProcess`, reqOptions)
  }

  editProcessTeam(ProcessTeam: ProcessTeam[], processID: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_team': ProcessTeam,
      'process_id': processID
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateProcessTeam`, reqOptions)
  }


  getProcessTeam(processID): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'process_id': processID
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetProcessTeam`, reqOptions)
  }

  deleteProcess(process_id): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'process_id': process_id,
    }
    return this._http.post<Project>(`${environment.newServerApi}/api/users/DeleteProcess`, reqOptions)
  }


  // ===================================== Tasks Section ==============================


  createNewTask(newTask: Task): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'task_title': newTask.title,
      'task_description': newTask.desc,
      'task_hours': newTask.ex_duration,
      'task_start_date': `${this.getDateFormatted(newTask.start_date)}`,
      'task_end_date': `${this.getDateFormatted(newTask.end_date)}`,
      'task_status_id': 1,
      'process_id': newTask.process_key,
      'task_team': newTask.task_team,
      'task_type_id': newTask.type,
      'seniorapprove': newTask.seniorIsMandatory == true ? 1 : 0,
    }
    if (newTask.force_add == 1) {
      reqOptions['force_add'] = newTask.force_add
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateTask`, reqOptions)
  }
  editTask(newTask: Task): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'task_title': newTask.title,
      'task_description': newTask.desc,
      'task_hours': newTask.ex_duration,
      'task_start_date': `${new Date(newTask.start_date).getMonth() + 1}/${new Date(newTask.start_date).getDate()}/${new Date(newTask.start_date).getFullYear()}`,
      'task_end_date': `${new Date(newTask.end_date).getMonth() + 1}/${new Date(newTask.end_date).getDate()}/${new Date(newTask.end_date).getFullYear()}`,
      // 'task_status_id':newTask.status,
      'process_id': newTask.process_key,
      'task_team': newTask.task_team,
      'task_type_id': newTask.type,
      'task_id': newTask.key
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateTask`, reqOptions)
  }


  getTaskTypes(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetAllTaskType?token=${token._token}`)
  }

  getTaskStatus(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetAllTaskStatus?token=${token._token}`)
  }

  getDevTasksOnSpecificDates(user_id: string, start_date: string | Date, end_date: string | Date): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'task_start_date': `${new Date(start_date).getMonth() + 1}/${new Date(start_date).getDate()}/${new Date(start_date).getFullYear()}`,
      'task_end_date': `${new Date(end_date).getMonth() + 1}/${new Date(end_date).getDate()}/${new Date(end_date).getFullYear()}`,
      'user_id': user_id
    }
    // console.log(reqOptions);

    return this._http.post(`${environment.newServerApi}/api/users/GetDeveloperOldTasks`, reqOptions)
  }


  getTasksByProjectID(project_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_id': project_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllTasksWithProjectID`, reqOptions)
  }


  getTasksByProcessID(process_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'process_id': process_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetTasksForSpecificProcess`, reqOptions)
  }

  updateTaskStatus(task_id: string, taskStatus_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'task_status_id': taskStatus_id,
      'task_id': task_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateTaskStatus`, reqOptions)
  }

  deleteTask(task_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'task_id': task_id,
    }
    return this._http.post<Project>(`${environment.newServerApi}/api/users/DeleteTask`, reqOptions)
  }


  getTaskProgress(task_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'task_id': task_id,
    }
    return this._http.post<Project>(`${environment.newServerApi}/api/users/GetTaskProgress`, reqOptions)
  }

  attachFileToTask(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/CreateProcessAttach`, fd)
  }

  // ===================================== Admin Reports Section ==============================
  createNewAdminReport(newReport: AdminReports): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newReport
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateAdminReport`, reqOptions)
  }

  updateAdminReport(report: AdminReports): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'report_id': report.id,
      ...report
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateAdminReport`, reqOptions)
  }

  getAdminReports(dev_id: string, start_date: string | Date, end_date: string | Date): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': dev_id,
      'start_date': `${new Date(start_date).getMonth() + 1}/${new Date(start_date).getDate()}/${new Date(start_date).getFullYear()}`,
      'end_date': `${new Date(end_date).getMonth() + 1}/${new Date(end_date).getDate()}/${new Date(end_date).getFullYear()}`,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAdminReport`, reqOptions)
  }

  getMyAdminPendingReportsToApprove(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyAdminReportPending`, reqOptions)
  }

  getAllAdminPendingReportsToApprove(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAdminReportPending`, reqOptions)
  }

  approveAllMyReports(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/ApproveAllPendingReports`, reqOptions)
  }

  approveAllPendingReports(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/ForceApproveAllPendingReports`, reqOptions)
  }

  AdminReportManagerAction(report: AdminReports): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'report_id': report.id,
      'reject_reason': report.reject_reason,
      'reject_date': `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
      'approved': report.approved
    }
    return this._http.post(`${environment.newServerApi}/api/users/AdminManagerAction`, reqOptions)
  }
  deletePendingAdminReport(report_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'report_id': report_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteAdminReport`, reqOptions)
  }


  getManagerAdminReport(dev_id: string, start_date: string | Date, end_date: string | Date): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': dev_id,
      'start_date': `${new Date(start_date).getMonth() + 1}/${new Date(start_date).getDate()}/${new Date(start_date).getFullYear()}`,
      'end_date': `${new Date(end_date).getMonth() + 1}/${new Date(end_date).getDate()}/${new Date(end_date).getFullYear()}`,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetManagerAdminReport`, reqOptions)
  }


  /* ================================================ Admin Tasks Section ========================================= */

  createNewAdminTask(newTask: AdminTasks): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newTask
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateAdminTask`, reqOptions)
  }

  updateAdminTask(task: AdminTasks): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'task_id': task.id,
      ...task
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateAdminTask`, reqOptions)
  }

  getAdminTasks(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllAdminTask`, reqOptions)
  }

  getAdminTasksByTaskStatus(task_status: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'task_status_id': task_status,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAdminTaskForSpecificStatus`, reqOptions)
  }


  deleteAdminTask(task_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'task_id': task_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteAdminTask`, reqOptions)
  }

  updateAdminTaskStatus(task_id: string, task_status_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'task_id': task_id,
      'task_status_id': task_status_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateAdminTaskStatus`, reqOptions)
  }

  getAdminTasksByAdminID(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAdminTasks`, reqOptions)
  }

  getMyAdminRunningTasks(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyAdminRunningTasks`, reqOptions)
  }
  getMyAdminOverDueTasks(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAdminOverDueTasks`, reqOptions)
  }
  // ===================================== Developer Reports Section ==============================

  createNewReport(newReport: DevDailyReport): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'report_type_id': newReport.time_activity,
      'manager_approve_id': !!newReport.managerApprovalKey ? newReport.managerApprovalKey : newReport.seniorToApproveKey,
      'report_details': newReport.details,
      'report_date': `${new Date(newReport.reportDate).getMonth() + 1}/${new Date(newReport.reportDate).getDate()}/${new Date(newReport.reportDate).getFullYear()}`,
      'process_id': newReport.processID,
      'task_id': newReport.taskID,
      'duration': newReport.durationByHours,
      'progress': newReport.progress,
      'report_status_id': newReport.report_status_id,
      'ticket_id': newReport.ticket_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateTechReport`, reqOptions)
  }

  getReportTypes(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetTechReportType?token=${token._token}`)
  }

  getDevTasks(dev_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': dev_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetDeveloperTasks`, reqOptions)
  }

  getDevAllTasks(dev_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': dev_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetDeveloperAllTask`, reqOptions)
  }

  getDevOverDueTasks(dev_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': dev_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetDeveloperOverDueTasks`, reqOptions)
  }


  getDevSupportTasks(dev_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': dev_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSupportTasks`, reqOptions)
  }

  getDevDailyReport(dev_id: string, start_date: string | Date, end_date: string | Date): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': dev_id,
      'start_date': `${new Date(start_date).getMonth() + 1}/${new Date(start_date).getDate()}/${new Date(start_date).getFullYear()}`,
      'end_date': `${new Date(end_date).getMonth() + 1}/${new Date(end_date).getDate()}/${new Date(end_date).getFullYear()}`,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetReport`, reqOptions)
  }


  getDevelopersProgressReport(dev_id: string, start_date: string | Date, end_date: string | Date): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': dev_id,
      'start_date': `${new Date(start_date).getMonth() + 1}/${new Date(start_date).getDate()}/${new Date(start_date).getFullYear()}`,
      'end_date': `${new Date(end_date).getMonth() + 1}/${new Date(end_date).getDate()}/${new Date(end_date).getFullYear()}`,
    }
    return this._http.post(`${environment.newServerApi}/api/users/DevelopersProgressReport`, reqOptions)
  }

  getDevProjects(dev_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': dev_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetUserProject`, reqOptions)
  }

  getReportsByProjectID(project_key: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'project_id': project_key
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllReportProject`, reqOptions)
  }


  getDevProcesses(dev_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': dev_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetUserProcess`, reqOptions)
  }


  editReport(report: DevDailyReport): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'report_type_id': report.time_activity.toString(),
      'manager_approve_id': !!report.managerApprovalKey ? report.managerApprovalKey.toString() : report.seniorToApproveKey?.toString(),
      'report_details': report.details,
      'report_date': `${new Date(report.reportDate).getMonth() + 1}/${new Date(report.reportDate).getDate()}/${new Date(report.reportDate).getFullYear()}`,
      'process_id': report.processID,
      'task_id': report.taskID,
      'duration': report.durationByHours,
      'progress': report.progress,
      'report_status_id': report.report_status_id,
      'report_id': report.key
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateTechReport`, reqOptions)
  }

  deletePendingDevDailyReport(report_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'report_id': report_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteTechReport`, reqOptions)
  }


  getAllPendingReports(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetReportPending`, reqOptions)
  }


  getMyPendingReports(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyReportPendingDev`, reqOptions)
  }

  getMyRejectedReports(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyReportRejectedDev`, reqOptions)
  }

  getMyPendingReportsToApprove(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyReportPending`, reqOptions)
  }

  ReportManagerAction(report: DevDailyReport): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'report_id': report.key,
      'duration': report.durationByHours,
      'duration_reason': report.managerChangeDurationComment,
      'reject_reason': report.rejectionReason,
      'reject_date': `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
      'approved': report.approved
    }
    return this._http.post(`${environment.newServerApi}/api/users/TechManagerAction`, reqOptions)
  }


  ReportSeniorAction(report: DevDailyReport): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'report_id': report.key,
      'approved': report.seniorDecision,
      'comment': report.seniorDecisionComment,
      'manager_approve_id': report.managerApprovalKey
    }
    return this._http.post(`${environment.newServerApi}/api/users/TechSeniorAction`, reqOptions)
  }


  returnReportToPending(report_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'report_id': report_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/ReturnReportToPending`, reqOptions)
  }

  // ===================================== Public Request Section ==============================


  createPublicRequest(newReq: PublicRequests): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'public_request_amount': newReq.amountByEGP,
      'public_request_details': newReq.details,
      'public_request_title': newReq.type,//newReq.type,
      'public_request_status_id': newReq.finalStatus,//newReq.approvalCycle,
      'manager_approve_id': newReq.managerToApproveKey,//newReq.managerToApproveKey,
      'process_id': newReq.processKey,
      'sub_departments_id': newReq.dept
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreatePublicRequest`, reqOptions)
  }

  deletePublicRequest(pr_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'public_request_id': pr_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeletePublicRequest`, reqOptions)
  }


  getMyPublicRequests(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyRequest`, reqOptions)
  }



  getManagerToApprovePublicRequest(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetManagerPendingRequest`, reqOptions)
  }


  getAllUnDoneApprovedPublicRequest(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetApprovedRequest`, reqOptions)
  }
  getAdminPendingPublicRequest(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetRequestApprovedSubDepartment`, reqOptions)
  }

  publicRequestManagerFinished(newReq: PublicRequests): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'public_request_id': newReq.key,
      'user_id': newReq.empToApplyKey,
    }
    if (!!newReq.managerDissisionComment) {
      reqOptions['comment'] = newReq.managerDissisionComment;
    }
    return this._http.post(`${environment.newServerApi}/api/users/ManagerApprovePublicRequest`, reqOptions)
  }

  publicRequestManagerReject(newReq: PublicRequests): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'public_request_id': newReq.key,
      'reject_reason': newReq.managerDissisionComment,
    }
    return this._http.post(`${environment.newServerApi}/api/users/RejectPublicRequest`, reqOptions)
  }


  publicRequestMarkAsDone(newReq: PublicRequests): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'public_request_id': newReq.key,
      'comment': newReq.empAppliedComment,
      'amountByEGP': newReq.amountByEGP,
    }
    return this._http.post(`${environment.newServerApi}/api/users/SubDonePublicRequest`, reqOptions)
  }

  publicRequestFilter(from?: Date | string, to?: Date | string, user_id?: string, dept_id?: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    if (!!from) {
      const day = `${new Date(from).getDate()}`
      const month = `${new Date(from).getMonth() + 1}`
      reqOptions['from_date'] = `${new Date(from).getFullYear()}-${month.length == 1 ? `0${month}` : month}-${day.length == 1 ? `0${day}` : day} 00:00:00`
    }
    if (!!to) {
      const day = `${new Date(to).getDate()}`
      const month = `${new Date(to).getMonth() + 1}`
      reqOptions['to_date'] = `${new Date(to).getFullYear()}-${month.length == 1 ? `0${month}` : month}-${day.length == 1 ? `0${day}` : day} 23:59:59`
    }
    if (!!dept_id && dept_id.length > 0) {
      reqOptions['sub_departments_id'] = dept_id
    }
    if (!!user_id && user_id.length > 0) {
      reqOptions['user_id'] = user_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetRequestSheet`, reqOptions)
  }



  // ===================================== Transportaion Section ==============================
  createtransportationRequest(newRequest: Transportations): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'transportation_request_comment': newRequest.comment,
      'transportation_request_from': newRequest.fromLocation,
      'transportation_request_to': newRequest.toLocation,
      'transportation_request_purpose': newRequest.purpose,
      'transportation_request_amount': newRequest.amountByEGP,
      'transportation_request_status_id': newRequest.finalStatus,
      'manager_approve_id': newRequest.pmToApproveKey,
      'transportation_request_date': `${new Date(newRequest.date).getMonth() + 1}/${new Date(newRequest.date).getDate()}/${new Date(newRequest.date).getFullYear()}`,
      'process_id': newRequest.processKey,
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateTransportationRequest`, reqOptions)
  }

  getMyTransportations(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetTransportationRequestUser`, reqOptions)
  }

  getMyTransportationToApprove(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetTransportationRequestManager?token=${token._token}`)
  }
  getAllTransportationToApprove(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetTransportationRequestPending`, reqOptions)
  }


  transportationAssignToApprove(transRequest: Transportations): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'assign_to_id': transRequest.managerToApproveKey,
      'request_id': transRequest.key,
      'comment': transRequest.managerDissisionComment,
    }
    return this._http.post(`${environment.newServerApi}/api/users/AssignTransportationRequest`, reqOptions)
  }

  transportationManagerApprove(transRequest: Transportations): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'assign_to_id': transRequest.managerToApproveKey,
      'request_id': transRequest.key,
      'comment': transRequest.managerDissisionComment,
    }
    return this._http.post(`${environment.newServerApi}/api/users/ManagerApproveTransportationRequest`, reqOptions)
  }

  transportationFinanceToPay(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetFinanceTransportation`, reqOptions)
  }

  transportationManagerReject(transRequest: Transportations): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'rejected_by_id': transRequest.managerDissisionKey,
      'request_id': transRequest.key,
      'reject_reason': transRequest.managerDissisionComment,
    }
    return this._http.post(`${environment.newServerApi}/api/users/RejectTransportationRequest`, reqOptions)
  }

  transportationMarkAsDone(transRequest: Transportations): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'request_id': transRequest.key,
      'comment': transRequest.managerDissisionComment,
    }
    return this._http.post(`${environment.newServerApi}/api/users/DoneTransportationRequest`, reqOptions)
  }

  getTransportationInDuration(from: string | Date, to: string | Date, user_id): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'from_date': `${new Date(from).getMonth() + 1}/${new Date(from).getDate()}/${new Date(from).getFullYear()}`,
      'to_date': `${new Date(to).getMonth() + 1}/${new Date(to).getDate()}/${new Date(to).getFullYear()}`,
      'user_id': user_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/TransportationSheetReport`, reqOptions)
  }


  /* ===================================== Products Section ======================================= */
  getAllProducts(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetAllProduct?token=${token._token}`)
  }
  /* ===================================== License Section ======================================= */

  getLicenseTypes(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetAllLicenseType?token=${token._token}`)
  }

  getAllLicense(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetAllLicense?token=${token._token}`)
  }

  createLicense(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/CreateLicense`, fd)
  }

  getLicenseByID(license_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'license_id': license_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecificLicense`, reqOptions)
  }


  updateLicense(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/UpdateLicense`, fd)
  }

  renewLicense(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/RenewLicense`, fd)
  }

  deleteLicense(license_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'license_id': license_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteLicense`, reqOptions)
  }


  /* ===================================== Vacations Section ======================================= */



  getPermissionAndLeavesConfig(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetAllPermissionBalance?token=${token._token}`)
  }

  resetUserspermissons(PermissionAndLeavesConfig: PermissionAndLeavesConfig): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'permission_balance_id': PermissionAndLeavesConfig.permission_balance_id,
      'monthly_balance': PermissionAndLeavesConfig.monthly_balance,
      'bereavement': PermissionAndLeavesConfig.bereavement,
      'marriage': PermissionAndLeavesConfig.marriage,
      'birth': PermissionAndLeavesConfig.birth,
      'birth_f': PermissionAndLeavesConfig.birth_f,
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdatePermissionBalance`, reqOptions)
  }


  getAllLeaveTypes(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    return this._http.get(`${environment.newServerApi}/api/users/GetAllAnnualType?token=${token._token}`)
  }

  getUserLeaveBalance(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetUserAnnual`, reqOptions)
  }


  createVacationRequest(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/CreateAnnualRequest`, fd)
  }


  getAnnualLeavesByUSerID(user_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetUserRequests`, reqOptions)
  }

  getManagerPendingAnnualLeavesToApprove(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      // 'user_id':user_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetManagerRequests`, reqOptions)
  }

  managerActionAnnualLeave(leave: AnnualLeave): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'annual_request_id': leave.key,
      'comment': leave.managerDissisionComment,
      'annual_status_id': leave.finalStatus,
      'user_id': leave.hrToApproveKey
    }
    return this._http.post(`${environment.newServerApi}/api/users/ManagerActionRequests`, reqOptions)
  }


  hrActionAnnualLeave(leave: AnnualLeave): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'annual_request_id': leave.key,
      'comment': leave.hrDissisionComment,
      'annual_status_id': leave.finalStatus
    }
    return this._http.post(`${environment.newServerApi}/api/users/HRActionRequests`, reqOptions)
  }



  getHRPendingAnnualLeavesToApprove(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetHRRequests`, reqOptions)
  }

  deleteAnnualLeave(annual_request_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'annual_request_id': annual_request_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteAnnualRequest`, reqOptions)
  }


  /* ===================================== Manager Reports Section ======================================= */

  getManagerDevDailyReport(dev_id: string, start_date: string | Date, end_date: string | Date): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': dev_id,
      'start_date': `${new Date(start_date).getMonth() + 1}/${new Date(start_date).getDate()}/${new Date(start_date).getFullYear()}`,
      'end_date': `${new Date(end_date).getMonth() + 1}/${new Date(end_date).getDate()}/${new Date(end_date).getFullYear()}`,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetManagerDevReport`, reqOptions)
  }

  getDevMonthlyReport(date: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'report_date': this.getDateFormatted(date)
    }
    return this._http.post(`${environment.newServerApi}/api/users/DevelopersMonthlyReport`, reqOptions)
  }

  getVacationsReport(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/DevelopersVacationsReport`, reqOptions)
  }

  getClosedProjects(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetClosedProject`, reqOptions)
  }


  getRunningTasks(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/DevelopersRunningTasksReport`, reqOptions)
  }
  getOverDueTasks(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/DevelopersOverDueTasksReport`, reqOptions)
  }

  getDeveloperTasksReport(user_id: string, from: string | Date, to: string | Date, task_id?: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'user_id': user_id,
      'start_date': this.getDateFormatted(from),
      'end_date': this.getDateFormatted(to),
    }
    if (!!task_id) {
      reqOptions['task_id'] = task_id;
    }
    return this._http.post(`${environment.newServerApi}/api/users/DevelopersTasksReport`, reqOptions)
  }


  /* ===================================== Support Contract Section ======================================= */
  createNewSupportContract(newContract: ProjectSupport): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'manager_id': newContract.managerID,
      'contract_type_id': newContract.periority,
      'partner_id': newContract.customerKey,
      'product_id': newContract.product_id,
      'contract_end_date': newContract.endDate,
      'contract_start_date': newContract.startDate
    }
    if (!!newContract.notes) {
      reqOptions['notes'] = newContract.notes
    }

    if (!!newContract.PMID) {
      reqOptions['project_manager_id'] = newContract.PMID
    }

    return this._http.post(`${environment.newServerApi}/api/users/CreateContractSupport`, reqOptions)
  }

  updateContractSupport(contract: ProjectSupport): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contract_support_id': contract.key,
      'manager_id': contract.managerID,
      'contract_type_id': contract.periority,
      'partner_id': contract.customerKey,
      'product_id': contract.product_id,
      'contract_end_date': contract.endDate,
      'contract_start_date': contract.startDate
    }
    if (!!contract.notes) {
      reqOptions['notes'] = contract.notes
    }

    if (!!contract.PMID) {
      reqOptions['project_manager_id'] = contract.PMID
    }

    return this._http.post(`${environment.newServerApi}/api/users/UpdateContractSupport`, reqOptions)
  }



  getAllSupportContract(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllContractSupport`, reqOptions)
  }

  getMySupportContract(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyContractSupport`, reqOptions)
  }

  getSupportContractByID(support_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contract_id': support_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecificContractSupport`, reqOptions)
  }
  getSupportContractCostByID(contract_support_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contract_support_id': contract_support_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetContractSupportCost`, reqOptions)
  }

  deleteProjectSupport(support_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contract_support_id': support_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteContractSupport`, reqOptions)
  }

  renewContractSupport(c_data: ProjectSupportHistory): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...c_data
    }
    return this._http.post(`${environment.newServerApi}/api/users/RenewContract`, reqOptions)
  }


  /* ===================================== Ticketing Section ======================================= */
  createNewTicket(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/CreateTicket`, fd)
  }


  updateTicket(ticket: ClientTicket, actionTitle: string, actionComment: string,): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'ticket_id': ticket.key,
      'project_manager_id': ticket.assignedToPMKey,
      'developer_id': ticket.assignedToDevKey,
      'ticket_status_id': ticket.status,
      'ticket_priority_id': ticket.priority,
      'comment_title': actionTitle,
      'comment': actionComment,
    }
    return this._http.post(`${environment.newServerApi}/api/users/ManagerUpdateTicket`, reqOptions)
  }


  getTicketsByContractID(contract_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contract_id': contract_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetContractTicket`, reqOptions)
  }

  getAllTickets(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/getMyTicketAll`, reqOptions)
  }

  getMyTickets(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/getMyTicketDev`, reqOptions)
  }

  getTicketByID(ticket_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'ticket_id': ticket_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecificTicket`, reqOptions)
  }

  deleteClientTicket(ticket_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'ticket_id': ticket_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteTicket`, reqOptions)
  }

  /* ===================================== Ticket Time Line Section ======================================= */

  getTicketTimeLine(ticket_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'ticket_id': ticket_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetTicketTimeline`, reqOptions)
  }

  createticketTimeLine(timeline: ClientTicketTimeLine): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'ticket_id': timeline.ticketKey,
      'comment': timeline.actionComment,
      'title': timeline.action,
      'showForClient': timeline.showForClient
    }
    return this._http.post(`${environment.newServerApi}/api/users/AddTicketComment`, reqOptions)
  }


  /* ===================================== Announce Section ======================================= */

  createNewAnnounce(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/CreateAnnounce`, fd)
  }

  updateAnnounce(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/UpdateAnnounce`, fd)
  }

  getAllAnnounces(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllAnnounce`, reqOptions)
  }



  getMyAnnounces(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyAnnounce`, reqOptions)
  }

  closeAnnounce(announce_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'announce_id': announce_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/CloseAnnounce`, reqOptions)
  }


  deleteAnnounce(announce_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'announce_id': announce_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteAnnounce`, reqOptions)
  }


  getMyAnnounceToView(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/ShowMyAnnounceUser`, reqOptions)
  }

  announceMarkAsView(announce_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'announce_id': announce_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/SeenMyAnnounceUser`, reqOptions)
  }

  /* ===================================== Ramadan Configuration Section ======================================= */
  createRamadanDay(newConfig: WorkingHoursConfiguration): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newConfig
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateWorkHoursConfig`, reqOptions)
  }

  getAllRamadanConfig(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllWorkHoursConfig`, reqOptions)
  }

  /* ===================================== Ramadan Configuration Section ======================================= */
  createVacationDays(newVac: OfficialVacation): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newVac
    }
    return this._http.post(`${environment.newServerApi}/api/users/OfficalVacationHolidays`, reqOptions)
  }

  /* ===================================== CRM Reports Section ======================================= */

  getContactLeadReport(filterBody: CRMFilterBody): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...filterBody
    }
    return this._http.post(`${environment.newServerApi}/api/users/FilterContactLead`, reqOptions)
  }


    getActivitesReport(filterBody: ActivitiesFilterBody): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...filterBody
    }
    return this._http.post(`${environment.newServerApi}/api/users/FilterActivity`, reqOptions)
  }


  /* ===================================== CRM Dashboard Section ======================================= */
  getCRMDashBoard(start_date: string, end_date: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'start_date': start_date,
      'end_date': end_date
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetCRMDashboardData`, reqOptions)
  }

  getCRMDashBoardRevenueForCastData(label_date: string, label_name: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'label_date': label_date,
      'label_name': label_name
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetrevenueForCastData`, reqOptions)
  }

  getTotalValueOfWonDealData(start_date: string, end_date: string, current: number): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'start_date': start_date,
      'end_date': end_date,
      'current': current
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetTotalValueOfWonDealData`, reqOptions)
  }

  getCRMDashBoardRevenuePerProductData(start_date: string, end_date: string, product_name: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'start_date': start_date,
      'end_date': end_date,
      'product_name': product_name,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetrevenuePerProductData`, reqOptions)
  }

  getCRMDashBoardRevenuePerSalesData(start_date: string, end_date: string, sales_name: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'start_date': start_date,
      'end_date': end_date,
      'sales_name': sales_name,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetrevenuePerSalesData`, reqOptions)
  }

  getCRMDashBoardNumberOfLeadsData(start_date: string, end_date: string, sales_name: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'start_date': start_date,
      'end_date': end_date,
      'sales_name': sales_name,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetNumberOfLeadsForSalesData`, reqOptions)
  }

  getCRMDashBoardDealProgressData(label_date: string, label_name: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'label_date': label_date,
      'label_name': label_name
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetDealProgressData`, reqOptions)
  }
  /* ===================================== CRM Setting Section ======================================= */

  getLeadAndContactSubStatus(status_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contact_status_id': status_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetContactSubStatusForContactStatus`, reqOptions)
  }

  getContactStatus(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllContactStatus`, reqOptions)
  }

  getLeadStatus(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetLeadStatus`, reqOptions)
  }

  getAllContactAndLeadTypes(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllContactLeadType`, reqOptions)
  }

  getAllCampaigns(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllCampagin`, reqOptions)
  }


  getAllLables(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllLabelColor`, reqOptions)
  }


  createLable(newLable: Labels): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newLable
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateLabelColor`, reqOptions)
  }

  deleteLable(label_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'label_id': label_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteLabelColor`, reqOptions)
  }


  updateLable(label_id: string, lead_color?: string, lead_name?: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'label_id': label_id
    }
    if (!!lead_color) {
      reqOptions['lead_color'] = lead_color;
    }

    if (!!lead_name) {
      reqOptions['lead_name'] = lead_name;
    }

    return this._http.post(`${environment.newServerApi}/api/users/UpdateLabelColor`, reqOptions)
  }

  /* ===================================== Person Contact Section ======================================= */
  getAllPersonContacts(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllContact`, reqOptions)
  }

  getMyPersonContacts(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyContact`, reqOptions)
  }

  createNewPersonContact(contact: Contacts): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...contact
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateContact`, reqOptions)
  }

  deletePersonContact(contact_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contact_id': contact_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteContact`, reqOptions)
  }


  updatePersonContact(contact: Contacts): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contact_id': contact.id,
      ...contact
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateContact`, reqOptions)
  }


  getOrgContact(partner_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'partner_id': partner_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetOrgContact`, reqOptions)
  }

  getMyOrgContact(partner_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'partner_id': partner_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyOrgContact`, reqOptions)
  }

  /* ===================================== Leads Cost Section ======================================= */

  getAllCostType(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllLeadCostType`, reqOptions)
  }

  /* ===================================== Contact Section ======================================= */
  getMyContacts(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyContactLead`, reqOptions)
  }

  getLeadsByPartnerID(partner_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'partner_id': partner_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetContactLeadByPartnerID`, reqOptions)
  }

  updateContactLead(contact_id: string, editParams: Object): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contact_lead_id': contact_id,
    }
    for (let i in editParams) {
      reqOptions[i] = editParams[i];
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateContactLead`, reqOptions)
  }

  getAllContacts(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllContactLead`, reqOptions)
  }

  deleteContactLead(contact_lead_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contact_lead_id': contact_lead_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteContactLead`, reqOptions)
  }


  getContactByID(contact_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contact_lead_id': contact_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecificLead`, reqOptions)
  }

  createNewContact(contact: LeadsAndContacts): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...contact
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateContactLead`, reqOptions)
  }

  getContactLeadByStatus(lead_sub_status_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'lead_sub_status_id': lead_sub_status_id,
      'isLead': false
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecificLeadByStatus`, reqOptions)
  }

  getClosedContactLead(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyClosedContactLead`, reqOptions)
  }

  /* ===================================== Leads Section ======================================= */
  getMyLeads(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyLead`, reqOptions)
  }

  getAllLeads(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllLead`, reqOptions)
  }

  /* ===================================== Activity Section ======================================= */

  getLeadAndContactActivity(lead_id: String): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contact_lead_id': lead_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/getActivityforLead`, reqOptions)
  }

  getMyPendingActivity(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllPendingActivity`, reqOptions)
  }
  GetLeadActivities(partner_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'partner_id': partner_id,
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetLeadActivities`, reqOptions)
  }

  createLeadAndContactActivity(newActivity: LeadsAndContactsActivity): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newActivity
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateActivity`, reqOptions)
  }

  updateLeadAndContactActivity(activity: LeadsAndContactsActivity): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'activity_id': activity.id,
      ...activity
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateActivity`, reqOptions)
  }


  deleteActivity(activity_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'activity_id': activity_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteActivity`, reqOptions)
  }



  /* ===================================== Lead Attach Section ======================================= */
  uploadContactLeadAttach(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/CreateContactLeadAttach`, fd)
  }

  getLeadAttaches(lead_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contact_lead_id': lead_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetContactLeadAttach`, reqOptions)
  }


  deleteLeadAttaches(attach_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'attach_id': attach_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteContactLeadAttach`, reqOptions)
  }

  /* ===================================== request RFP Section ======================================= */

  createRFPRequest(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/CreateRFPRequest`, fd)
  }

  getRFPRequestsByLeadID(lead_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contact_lead_id': lead_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecificContactLeadRequestRFP`, reqOptions)
  }

  actionONRFPRequests(request_rfp_id: string, request_rfp_status_id: RFPRequestStatus, approval_ids?: string[], comment?: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'request_rfp_id': request_rfp_id,
      'request_rfp_status_id': request_rfp_status_id
    }
    if (!!approval_ids) {
      reqOptions['approval_ids'] = approval_ids;
    }
    if (!!comment) {
      reqOptions['comment'] = comment;
    }
    return this._http.post(`${environment.newServerApi}/api/users/ApproveRFPRequest`, reqOptions)
  }

  getAllRFPRequestsForManager(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllRFPRequest`, reqOptions)
  }


  getMyRFPRequestsForManager(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyPendingRFPRequest`, reqOptions)
  }


  getMyRFPRequestsForSales(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyPendingRFPRequestSales`, reqOptions)
  }

  /* ===================================== request poc Section ======================================= */

  createRequestForPOC(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/CreateRequestPOC`, fd)
  }


  getRequestForPOCStatus(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllRequestPOCStatus`, reqOptions)
  }

  getRequestForPOCPriority(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllRequestPOCPriority`, reqOptions)
  }



  getAllPocRequestsForManager(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllPOCRequest`, reqOptions)
  }


  getMyPocRequestsForManager(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyPendingPocRequest`, reqOptions)
  }


  getMyPocRequestsForSales(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyPOCRequest`, reqOptions)
  }


  getPocRequestsByLeadID(lead_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'contact_lead_id': lead_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecificContactLeadRequest`, reqOptions)
  }



  POCRequestAction(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/TakeRequestPOCAction`, fd)
  }

  ApprovePOCRequest(fd: FormData): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    fd.append('token', token._token)
    return this._http.post(`${environment.newServerApi}/api/users/ApproveRequestPOC`, fd)
  }

  /* ===================================== Rateing Section ======================================= */

  getAllQuestionGroupTypes(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllQuestionGroupType`, reqOptions)
  }

  getQuestionGroupSubTypesByTypeID(type_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'group_type_id': type_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetGroupForSpecificType`, reqOptions)
  }

  getAllMyStaticQuestionGroups(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllQuestionGroupType`, reqOptions)
  }

  getActiveGroupsQuestionGroupsOnDemand(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetActiveGroupsInOnDemand`, reqOptions)
  }


  getUsersForRateByGroupID(qg_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'question_group_id': qg_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetUserForRate`, reqOptions)
  }


  createQuestionGroup(newQG: QuestionGroup): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newQG
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateQuestionGroup`, reqOptions)
  }


  updateQuestionGroup(QG: QuestionGroup): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'question_group_id': QG.id,
      'question_group_title': QG.question_group_title,
      'group_sub_type_id': QG.group_sub_type_id,
      'status': QG.status
    }
    if (QG.group_sub_type_id == '1') {
      reqOptions['user_id'] = [];
    } else {
      if (!!QG.user_id && QG.user_id.length > 0) {
        reqOptions['user_id'] = QG.user_id;
      } else {
        reqOptions['user_id'] = [];
      }
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateQuestionGroup`, reqOptions)
  }


  getAllQuestionGroup(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllQuestionGroup`, reqOptions)
  }


  getAllQuestionGroupByType_ID(type_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'group_type_id': type_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetQuestionGroupByType`, reqOptions)
  }

  deleteQuestionGroup(QG_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'question_group_id': QG_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteQuestionGroup`, reqOptions)
  }

  getAllQuestionTypes(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllQuestionType`, reqOptions)
  }

  createQuestion(newQ: Question): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newQ
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateQuestion`, reqOptions)
  }

  updateQuestion(Q: Question): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'question_id': Q.id,
      'question_type_id': Q.question_type_id,
      'question': Q.question,
      'question_group_id': Q.question_group_id
    }


    if (Q.question_type_id == '2') {
      reqOptions['answer'] = Q.answer;
      reqOptions['isMulti'] = Q.isMulti;
    }


    return this._http.post(`${environment.newServerApi}/api/users/UpdateQuestion`, reqOptions)
  }

  deleteQuestion(Q_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'question_id': Q_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteQuestion`, reqOptions)
  }

  getQuestionsByQuestionGroup(QG_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'question_group_id': QG_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecificQuestions`, reqOptions)
  }




  createAskForRate(ASR: AskForRate): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'question_group_id': ASR.question_group_id,
      'user_rate_id': ASR.user_rate_id,
      'user_to_rate_id': ASR.user_to_rate_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateAskforRate`, reqOptions)
  }

  updateAskForRate(ASR: AskForRate): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'ask_for_rate_id': ASR.id,
      'question_group_id': ASR.question_group_id,
      'user_rate_id': ASR.user_rate_id,
      'user_to_rate_id': ASR.user_to_rate_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateAskforRate`, reqOptions)
  }

  deleteAskForRate(afr_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'ask_for_rate_id': afr_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteAskforRate`, reqOptions)
  }

  getAllAskForRate(question_group_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'question_group_id': question_group_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAskForRateSpecificGroupID`, reqOptions)
  }

  getMyPendingAskForRate(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyPendingAskForRate`, reqOptions)
  }


  CreateNewRateUser(newRate: Rating | RateAnswers): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newRate
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateRating`, reqOptions)
  }

  createTaskRate(newRate: Rating | RateAnswers): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newRate
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateTaskRate`, reqOptions)
  }

  createTicketRate(newRate: Rating | RateAnswers): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...newRate
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateTicketRate`, reqOptions)
  }


  getMyRateHistory(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyEmployeeRating`, reqOptions)
  }


  /* ===================================== Currencies Section ======================================= */

  getCurrencyExchangeRate(currencies: string): Observable<any> {
    return this._http.get(`${environment.currecnyConvert}app_id=${environment.currecnyConvertAppID}&symbols=${currencies}`)
  }



  /* ===================================== Notes Section ======================================= */
  getNotebyID(note_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'keep_note_id': note_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecificKeepNote`, reqOptions)
  }

  getMyNotes(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyKeepNote`, reqOptions)
  }

  getAllNotes(): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllKeepNote`, reqOptions)
  }


  createNote(note: Notes): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...note
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateKeepNote`, reqOptions)
  }

  updateNote(note: Notes): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'keep_note_id': note.id,
      ...note
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateKeepNote`, reqOptions)
  }

  deleteNote(note_id: string): Observable<any> {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'keep_note_id': note_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteKeepNote`, reqOptions)
  }

  getUserNotesRealTime(note_id: string, user_id: string): Observable<NotesRealTime> {
    return this.db.object<NotesRealTime>(`Notes/${note_id}/${user_id}`).snapshotChanges().pipe(
      map(note => {
        return { key: note.payload.key, ...note.payload.val() } as NotesRealTime;
      })
    );
  }

  updateNotesRealTime(note_id: string, user_id: string, rt: NotesRealTime): Promise<any> {
    return this.db.object(`Notes/${note_id}/${user_id}`).update(rt)
  }

  getMyPMTeamRequest() {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyPMTeamRequest`, reqOptions)
  }

  CreatePMTeamRequest(body: any) {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...body
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreatePMTeamRequest`, reqOptions)
  }
  updatePMTeamRequest(body: any) {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...body
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdatePMTeamRequest`, reqOptions)
  }

  deletePMTeamRequest(pm_team_request_id: string) {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'pm_team_request_id': pm_team_request_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeletePMTeamRequest`, reqOptions)
  }


  getManagerPMTeamRequestProject(body: FilterBody) {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      ...body
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetManagerPMTeamRequestProject`, reqOptions)
  }

  GetAllOpenPMTeamRequest() {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllOpenPMTeamRequest`, reqOptions)
  }

  getAllPMTeamRequestFilter(body: FilterBody) {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '');
    let dates = {}
    for (const key in body) {
      const element = body[key];
      if (element) {
        dates[key] = element
      }

    }
    let reqOptions = {
      'token': token._token,
      ...body

    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllPMTeamRequestFilter`, reqOptions)
  }

  changePMTeamRequestStatus(pm_team_request_id: string, team_request_status_id: string) {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
      'pm_team_request_id': pm_team_request_id,
      'team_request_status_id': team_request_status_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/ChangePMTeamRequestStatus`, reqOptions)
  }

  GetAllSupportReport() {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllSupportReport`, reqOptions)
  }
  GetSupportPendingReport() {
    const myLocal = localStorage.getItem('userData')
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token': token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSupportPendingReport`, reqOptions)
  }


}





/*
                  _  
   /\     /\/\   |_| 
__/--\__ /    \  |  \
    01279766337
    01141736576
*/

/*
 <*)
  ||______
   (______}
     |  |
     ^  ^
*/