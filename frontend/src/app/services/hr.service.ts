import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Candidate, JobProfile, JobProfileSkill, JobSkill } from '../interfaces/hr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HrService {

  constructor(private _http:HttpClient) { }
 
  getAllRecruitmentRequests(filterObj:Candidate | 0){
    
    const myLocal = localStorage.getItem('userData')     
    let token;
    token = JSON.parse(myLocal || '')  
    let reqOptions = {
      'token':token._token,
     
    }
    if (filterObj) {
    return this._http.post(`${environment.newServerApi}/api/users/FilterCVRecruitment`,{...reqOptions,...filterObj})
      
    }else{

      return this._http.post(`${environment.newServerApi}/api/users/GetAllRecruitmentRequest`,reqOptions)
    }
  }
  createCandidate(candidate:FormData):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || ''); 
    candidate.append("token", token._token);

    let reqOptions = {
      'token':token._token,
      ...candidate
    }   
    return this._http.post(`${environment.newServerApi}/api/users/UploadRecruitmentRequest` , candidate)
  }

  updateCandidate(candidate:FormData):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '') ;
    candidate.append("token", token._token);

    let reqOptions = {
      'token':token._token,
      ...candidate
    }   
    return this._http.post(`${environment.newServerApi}/api/users/UpdateRecruitmentRequest` , candidate)
  }

  deleteCandidate(candidate_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'id':candidate_id
    }   
    return this._http.post(`${environment.newServerApi}/api/users/DeleteRecruitmentRequest` , reqOptions)
  }


  checkCandidateData(candidateData:object):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      ...candidateData
    }   
    return this._http.post(`${environment.newServerApi}/api/users/EmailandPhoneCheck` , reqOptions)
  }

  GetCandidateDetailsDuplicate(obj:Object):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      ...obj

    }   
    return this._http.post(`${environment.newServerApi}/api/users/GetRecruitmentDetailsDuplicate` , reqOptions)
  }
  

// job profiles
getAllJobProfiles(){
  const myLocal = localStorage.getItem('userData')     
  let token;
  token = JSON.parse(myLocal || '')  
  let reqOptions = {
    'token':token._token,
  }
  return this._http.post(`${environment.newServerApi}/api/users/GetAllJobTitle`,reqOptions)
}

createJobProfile(jobProfile:any):Observable<any>{
  const myLocal = localStorage.getItem('userData') 
  let token;
  token = JSON.parse(myLocal || '')   
  let reqOptions = {
    'token':token._token,
    ...jobProfile
  }   
  return this._http.post(`${environment.newServerApi}/api/users/CreateJobTitle` , reqOptions)
}

updateJobProfile(jobProfile:JobProfile):Observable<any>{
  const myLocal = localStorage.getItem('userData') 
  let token;
  token = JSON.parse(myLocal || '')   
  let reqOptions = {
    'token':token._token,
    ...jobProfile
  }   
  return this._http.post(`${environment.newServerApi}/api/users/UpdateJobTitle` , reqOptions)
}

deleteJobProfile(job_profile_id:string):Observable<any>{
  const myLocal = localStorage.getItem('userData') 
  let token;
  token = JSON.parse(myLocal || '')   
  let reqOptions = {
    'token':token._token,
    'id':job_profile_id
  }   
  return this._http.post(`${environment.newServerApi}/api/users/DeleteJobTitle` , reqOptions)
}

//job skills
getAllJobSkills(){
  const myLocal = localStorage.getItem('userData')     
  let token;
  token = JSON.parse(myLocal || '')  
  let reqOptions = {
    'token':token._token,
  }
  return this._http.post(`${environment.newServerApi}/api/users/GetAllJobSkill`,reqOptions)
}

createJobSkill(jobSkill:JobSkill):Observable<any>{
  const myLocal = localStorage.getItem('userData') 
  let token;
  token = JSON.parse(myLocal || '')   
  let reqOptions = {
    'token':token._token,
    ...jobSkill
  }   
  return this._http.post(`${environment.newServerApi}/api/users/CreateJobSkill` , reqOptions)
}

updateJobSkill(jobSkill:JobSkill):Observable<any>{
  const myLocal = localStorage.getItem('userData') 
  let token;
  token = JSON.parse(myLocal || '')   
  let reqOptions = {
    'token':token._token,
    ...jobSkill
  }   
  return this._http.post(`${environment.newServerApi}/api/users/UpdateJobSkill` , reqOptions)
}

deleteJobSkill(Job_kill_id:string):Observable<any>{
  const myLocal = localStorage.getItem('userData') 
  let token;
  token = JSON.parse(myLocal || '')   
  let reqOptions = {
    'token':token._token,
    'id':Job_kill_id
  }   
  return this._http.post(`${environment.newServerApi}/api/users/DeleteJobSkill` , reqOptions)
}
}
