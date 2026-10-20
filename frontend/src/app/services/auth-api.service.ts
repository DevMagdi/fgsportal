import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http'
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ClientNavParams, Relative, User, UserNavParams } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { UserAuth } from './user-auth.module';
import { Router } from '@angular/router';
import { ResStatus } from '../interfaces/res-status';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { UserPermissions } from '../interfaces/user-permissions';
import { ModuleService } from './module.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private UserNavParamsPath = '/UserNavParams';
  private ClientNavParamsPath = '/ClientNavParams';



  UserNavParamsRef: AngularFireList<UserNavParams>;
  ClientNavParamsRef: AngularFireList<ClientNavParams>;


  user = new BehaviorSubject<any>(null);
  currentUser:User;
  userPerms:UserPermissions[] = [];

  constructor(private http:HttpClient,
              private router: Router,
              private db:AngularFireDatabase,
              private moduleService: ModuleService) {
    this.UserNavParamsRef = db.list(this.UserNavParamsPath);
    this.ClientNavParamsRef = db.list(this.ClientNavParamsPath);
  }




  createUser(user:User):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      ...user
    }
    
    return this.http.post(`${environment.newServerApi}/api/users/createAccount` , reqOptions)
  }


  editUser(user:User):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'user_id':user.key,
      'sub_departments_id':user.accRole,
      'work_degrees_id':user.accPosition,
      'email':user.email,
      'username':user.username,
      'firstname':user.firstname,
      'lastname':user.lastname,
    }
    
    return this.http.post(`${environment.newServerApi}/api/users/EditUser` , reqOptions)
  }

  login(email:string , password:string): Observable<User>{
    let reqOptions = {
      'password':password
    }
    if(email.includes('@')){
      reqOptions['email'] = email
    }else{
      reqOptions['username'] = email
    }
    
    return this.http.post<User>(`${environment.newServerApi}/api/users/login` , reqOptions).pipe(
      catchError(this.handleError),
      tap(resData => {        
         this.handleAuthentication(
          resData['data'].key,
          resData['data'].email,
          resData['data'].username,
          resData['data'].accType,
          resData['data'].department,
          resData['data'].accRole,
          resData['data'].accPosition,
          resData['data'].refreshRequired,
          resData['data'].photoURL,
          resData['data'].token,
        );
      })
    );
  }

  private handleError(errorRes: HttpErrorResponse) {
    // console.log();
    return throwError(errorRes.error.message)
    // let errorMessage = 'An unknown error occurred!';
    // if (!errorRes.error || !errorRes.error.error) {
    //   return throwError(errorMessage);
    // }
    // switch (errorRes.error.error.message) {
    //   case 'EMAIL_EXISTS':
    //     errorMessage = 'This email exists already';
    //     break;
    //   case 'EMAIL_NOT_FOUND':
    //     errorMessage = 'This email does not exist.';
    //     break;
    //   case 'INVALID_PASSWORD':
    //     errorMessage = 'This password is not correct.';
    //     break;
    // }
    // return throwError(errorMessage);
  }

  autoLogin() {
    const savedUserData = localStorage.getItem('userData')
    if(!!savedUserData){
      const userData: {
        key: string;
        email: string;
        username: string;
        accType: string;
        department: string;
        accRole: string;
        accPosition: string;
        refreshRequired:boolean;
        photoURL:string;
        _token: string;
      } = JSON.parse(savedUserData);
      if (!userData) {
        return;
      }
  
      const loadedUser = new UserAuth(
        userData.key,
        userData.email,
        userData.username,
        userData.accType,
        userData.department,
        userData.accRole,
        userData.accPosition,
        userData.refreshRequired,
        userData.photoURL,
        userData._token,
      );
  
      if (loadedUser.token) {
        this.user.next(loadedUser);
        this.getCurrentLoggedInUser()?.subscribe(async user=>{
          const dataFromMe = await user['data'] as User
          if(dataFromMe.refreshRequired == true){
            loadedUser.refreshRequired = dataFromMe.refreshRequired
            this.user.next(loadedUser);
          }
          if(loadedUser.accType != dataFromMe.accType || loadedUser.department != dataFromMe.department || loadedUser.accRole != dataFromMe.accRole || loadedUser.accPosition != dataFromMe.accPosition){
            let reason = `The Data that stored in local storage ${JSON.stringify(loadedUser)} is not the same that came from response of Me API ${JSON.stringify(dataFromMe)}`;
            this.logOutForSpammer(dataFromMe.key || dataFromMe['id'] , reason).subscribe(res=>{
              this.logout()
              window.location.reload();
            },err=>{
              console.log(err);
            })
          }
        })
      }
    }else{
      return;
    }
   
  }


  // (){
  //   console.log("Hacked");
  //   this.logout()
  //   window.location.reload();
  // }
  logOutForSpammer(userId:string , reason:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token':token._token,
      'user_id':userId,
      'user_violence_message':reason
    }
    return this.http.post(`${environment.newServerApi}/api/users/BlockAccountViolence`,reqOptions)
  }


  // autoLogin() {
  //   this.getCurrentLoggedInUser()?.subscribe(async user=>{
  //     const savedUserData = await user['data'] as User
  //     if(!!savedUserData){
  //       const userData: {
  //         email: string;
  //         username: string;
  //         accType: string;
  //         department: string;
  //         accRole: string;
  //         accPosition: string;
  //         _token: string;
  //       } = {
  //         email: savedUserData.email,
  //         username: savedUserData.username,
  //         accType: savedUserData.accType,
  //         department: savedUserData.department,
  //         accRole: savedUserData.accRole,
  //         accPosition: savedUserData.accPosition,
  //         _token: savedUserData.token || '',
  //       }
  //       if (!userData) {
  //         return;
  //       }
        
  //       const myLocal = localStorage.getItem('userData')
  //       if(!!myLocal){
  //         const afterParsed = JSON.parse(myLocal)
  //         if(afterParsed.accType != userData.accType || afterParsed.department != userData.department || afterParsed.accRole != userData.accRole || afterParsed.accPosition != userData.accPosition){
  //           console.log("Hacked");
  //           return;
  //         }else{
  //           const loadedUser = new UserAuth(
  //             userData.email,
  //             userData.username,
  //             userData.accType,
  //             userData.department,
  //             userData.accRole,
  //             userData.accPosition,
  //             userData._token,
  //           );
  //           if (loadedUser.token) {
  //             this.user.next(loadedUser);
  //           }
  //         }
  //       }

  //     }else{
  //       return;
  //     }
  //   })
  // }

  logout() {
    // this.user.next(null);
    // this.router.navigate(['/']);
    // localStorage.removeItem('userData');
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token':token._token,
    }
    this.user.next(null);
    localStorage.removeItem('userData');
    // Clear cached module entitlements on logout.
    this.moduleService.clear();
    return this.http.post(`${environment.newServerApi}/api/users/logout`,reqOptions)
    // if (this.tokenExpirationTimer) {
    //   clearTimeout(this.tokenExpirationTimer);
    // }
    // this.tokenExpirationTimer = null;
  }

  private handleAuthentication(
    key: string,
    email: string,
    username: string,
    accType: string,
    department: string,
    accRole: string,
    accPosition: string,
    refreshRequired: number | boolean,
    photoURL: string,
    token: string,
  ) {
    const user = new UserAuth(key , email, username , accType , department , accRole , accPosition , refreshRequired ,photoURL, token);
    localStorage.setItem('userData', JSON.stringify(user));
    console.log('handleAuthentication',JSON.stringify(user));
    this.user.next(user);

    // Load the modules this user's company has purchased.
    this.moduleService.loadEnabledModules().subscribe();
  }
  
  getCurrentLoggedInUser(){
    const myLocal = localStorage.getItem('userData') 
    let token;
    if(!!myLocal){
      token = JSON.parse(myLocal)
      return this.http.get(`${environment.newServerApi}/api/users/me?token=${token._token}`)
    }else{
      return;
    }

  }

  getAllUsers():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')
    return this.http.get(`${environment.newServerApi}/api/users/getAllUser?token=${token._token}&number=100`)
  }

  getAllUsersData():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')
    return this.http.get(`${environment.newServerApi}/api/users/getAllUserData?token=${token._token}&number=100`)
  }


  getAllDeactivatedUser():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')
    return this.http.get(`${environment.newServerApi}/api/users/getDeactivatedUser?token=${token._token}&number=100`)
  }

  deactivateUser(user_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'user_id':user_id
    }
    return this.http.post(`${environment.newServerApi}/api/users/DeactivateAccount`,reqOptions)
  }

  getUserByKey(user_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')
    let reqOptions = {
      'token':token._token,
      'user_id':user_id
    }
    return this.http.post(`${environment.newServerApi}/api/users/GetUserProfileData`,reqOptions)
  }

  activateUser(user_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'user_id':user_id
    }
    return this.http.post(`${environment.newServerApi}/api/users/ActivateAccount`,reqOptions)
  }



  requestResetPassword(email:string):Observable<any>{
    let reqOptions = {
      'email':email,
    }
    return this.http.post(`${environment.newServerApi}/api/users/ForgetPasswordUser`,reqOptions)
  }

  setNewPassword(email:string,password:string , password_confirmation:string , token:string):Observable<any>{
    let reqOptions = {
      'email':email,
      'password':password,
      'password_confirmation':password_confirmation,
      'token':token,
    }
    return this.http.post(`${environment.newServerApi}/api/users/NewPasswordUser`,reqOptions)
  }

  refreshAllUsers(){
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
    }
    return this.http.post(`${environment.newServerApi}/api/users/RefreshAll`,reqOptions)
  }

  userRefreshed(){
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
    }
    return this.http.post(`${environment.newServerApi}/api/users/UserRefreshed`,reqOptions)
  }


  getUserByFilter(dept?:string, role?:string , position?:string):Observable<User[]>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
    }

    if(!!dept){
      reqOptions['department_id'] = dept;
    }
    if(!!role){
      reqOptions['sub_department_id'] = role;
    }
    if(!!position){
      reqOptions['work_degrees_id'] = position;
    }

    return this.http.post<User[]>(`${environment.newServerApi}/api/users/FilterUser`,reqOptions)
  } 



  changePreviousReportStatus(user_id:string, status:boolean):Observable<User[]>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'user_id':user_id,
      'canAddPreviousReports':status,
    }
    return this.http.post<User[]>(`${environment.newServerApi}/api/users/CanAddPreviousReport`,reqOptions)
  } 




  editProfilePhoto(fd:FormData){
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    fd.append('token' , token._token)
    return this.http.post<User[]>(`${environment.newServerApi}/api/users/UploadProfilePhoto`,fd)
  }


  getDateFormatted(date){
    const day = `${new Date(date).getDate()}`;
    const month = `${new Date(date).getMonth() + 1}`;
    const year = `${new Date(date).getFullYear()}`;
    return `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year}`
  }

  editProfileData(user:User){
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'firstname':user.firstname,
      'lastname':user.lastname,
      'emergancyPhoneNumber':user.emergancyPhoneNumber,
      'emergancyPhoneNumberRelation':user.emergancyPhoneNumberRelation,
      'emergancyPhoneNumberName':user.emergancyPhoneNumberName,
      'socialSecureityNumber':user.socialSecureityNumber,
      'address':user.address,
      'maritalStatus':user.maritalStatus,
      'gender':user.gender,
      'mobileNumber':user.mobileNumber,
      'user_id':user.key,
    }

    if(!!user.hiringDate){
      reqOptions['hiringDate'] = this.getDateFormatted(user.hiringDate);
    }

    if(!!user.birthDate){
      reqOptions['birthDate'] = this.getDateFormatted(user.birthDate);
    }

    if(!!user.contractStartDate){
      reqOptions['contractStartDate'] = this.getDateFormatted(user.contractStartDate);
    }

    if(!!user.contractEndDate){
      reqOptions['contractEndDate'] = this.getDateFormatted(user.contractEndDate);
    }
    return this.http.post<User[]>(`${environment.newServerApi}/api/users/UploadProfileData`,reqOptions)
  }


  /*==================================== Family Section =========================================== */

  getMyfamilyInfo(user_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    // let reqOptions = {
    //   'token':token._token,
    //   'user_id':user_id
    // }
    return this.http.get(`${environment.newServerApi}/api/users/GetFamilyInformationForUser?token=${token._token}&user_id=${user_id}`)
  }

  createNewMyfamilyInfo(newRelative:Relative):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'family_name':newRelative.name,
      'relation':newRelative.relation,
      'gender':newRelative.gender,
      'birth_date':newRelative.birthDate
    }
    return this.http.post(`${environment.newServerApi}/api/users/CreateFamilyInformation`,reqOptions)
  }

  updateMyfamilyInfo(relative:Relative):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'family_name':relative.name,
      'relation':relative.relation,
      'gender':relative.gender,
      'birth_date':relative.birthDate,
      'family_member_id':relative.key
    }
    return this.http.post(`${environment.newServerApi}/api/users/UpdateFamilyInformation`,reqOptions)
  }

  deleteMyfamilyInfo(family_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'family_member_id':family_id
    }
    return this.http.post(`${environment.newServerApi}/api/users/DeleteFamilyInformation`,reqOptions)
  }


  /*==================================== Permissions Section =========================================== */


  getAllPermissions():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    return this.http.get(`${environment.newServerApi}/api/users/GetAllPermission?token=${token._token}`)
  }

  editUserPermissions(permissions_id:string  | number , users_id:string,status:number):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'permissions_id':permissions_id,
      'users_id':users_id,
      'status':status,
    }
    return this.http.post(`${environment.newServerApi}/api/users/EditUserPermission`,reqOptions)
  }

  getUserPermissionsByKey(userKey:string):Observable<any>{
    const myLocal = localStorage.getItem('userData')     
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'users_id':userKey
    }
    return this.http.post(`${environment.newServerApi}/api/users/GetUserPermission`,reqOptions)
  }

  getUserByPermissionID(permission_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData')     
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'permission_id':permission_id
    }
    return this.http.post(`${environment.newServerApi}/api/users/GetAllUserByPermissionID`,reqOptions)
  }


  // getUserPermissionsBypermission(perm:string):Observable<UserPermissions[]>{
  //   return this.db.list<UserPermissions>(`${this.userPermissionsPath}`, ref =>
  //     ref.orderByChild(perm).equalTo(true)
  //   ).snapshotChanges(['child_changed', 'child_removed', 'child_added']).pipe(
  //     map(users => users.map(user => {
  //       return { key: user.key, ...user.payload.val() } as UserPermissions;
  //     }))
  //   );
  // }


  /* =========================== User Nav Params Section ================================== */
  updateNavPerms(navPerms:UserNavParams):Promise<any>{
    return this.UserNavParamsRef.update(navPerms.user_id , navPerms)
  }

  getNavPermsByUserID(userKey:string):Observable<UserNavParams>{
    return this.db.object<UserNavParams>(`${this.UserNavParamsPath}/${userKey}`).snapshotChanges().pipe(
      map(user => {
        return { key: user.payload.key, ...user.payload.val() } as UserNavParams;
      })
    );
  }


  updateClientNavPerms(navPerms:ClientNavParams):Promise<any>{    
    return this.ClientNavParamsRef.update(navPerms.user_id , navPerms)
  }

  /* =========================== Open To Work Section ================================== */


  openToWork(from_date_time:string|Date,to_date_time:string|Date):Observable<any>{
    const myLocal = localStorage.getItem('userData')     
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'from_date_time':from_date_time,
      'to_date_time':to_date_time
    }
    return this.http.post(`${environment.newServerApi}/api/users/CreateNewOpenToWork`,reqOptions)
  }


  updateToWork(open_to_work_id:string,active:string):Observable<any>{
    const myLocal = localStorage.getItem('userData')     
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'open_to_work_id':open_to_work_id,
      'active':active
    }
    return this.http.post(`${environment.newServerApi}/api/users/UpdateOpenToWork`,reqOptions)
  }

  getAllOpenToWork():Observable<any>{
    const myLocal = localStorage.getItem('userData')     
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
    }
    return this.http.post(`${environment.newServerApi}/api/users/GetActiveOpenToWork`,reqOptions)
  }

  //dashboard

  GetAllDashboardDetails():Observable<any>{
    const myLocal = localStorage.getItem('userData')     
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
    }
    return this.http.post(`${environment.newServerApi}/api/users/GetAllDashboardDetails`,reqOptions)
  }

  GetProjectForClone(projectID:number):Observable<any>{
    const myLocal = localStorage.getItem('userData')     
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
      'project_id':projectID
    }
    return this.http.post(`${environment.newServerApi}/api/users/GetProjectForClone`,reqOptions)
  }
  cloneProject(body:any):Observable<any>{
    const myLocal = localStorage.getItem('userData')     
    let token;
    token = JSON.parse(myLocal || '')  
    // let reqOptions = {
    //   'token':token._token,
    // }
    return this.http.post(`${environment.newServerApi}/api/users/CloneOldProject`,{token :token._token,...body})
  }


}
