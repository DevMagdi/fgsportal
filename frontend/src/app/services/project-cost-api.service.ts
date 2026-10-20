import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment'
import { Observable } from 'rxjs';
import { DatabaseService } from './database.service';
import { AuthApiService } from './auth-api.service';
import { singleProjectCost } from '../interfaces/project-cost';

@Injectable({
  providedIn: 'root'
})
export class ProjectCostApiService {

  constructor(private _http:HttpClient,
              private _db:DatabaseService,
              private _auth:AuthApiService ) { }

  
  // ===================================== Public Cost Section ==============================

  getgetCostTypes():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    return this._http.get(`${environment.newServerApi}/api/users/GetAllCostType?token=${token._token}`)
  }



  getSingleProjectCost(project_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'project_id':project_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetProjectCost` , reqOptions)
  }


  getTotalProjectCost(project_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'project_id':project_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/ProjectTotalCost` , reqOptions)
  }


  createNewSingleCost(newSinglePC:singleProjectCost):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'process_id':newSinglePC.processKey,
      'project_cost_date':newSinglePC.costDate,
      'comment':newSinglePC.costComment,
      'user_id':newSinglePC.empKey,
      'cost_type_id':newSinglePC.costType,
      'cost_amount':newSinglePC.costAmount,
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateProjectCostManual` , reqOptions)
  }


  deleteSingleProjectCost(cost:singleProjectCost):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'manual_project_id':cost.activity_key,
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteProjectCostManual` , reqOptions)
  }


  recalculateCost(p_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'project_id':p_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/ReCalculateProjectCost` , reqOptions)
  }
}

