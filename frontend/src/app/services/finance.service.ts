import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import {environment} from '../../environments/environment'
import { Observable } from 'rxjs';
import { Incentive, incentiveFinalStatus } from '../interfaces/Incentive';
import { Salary } from '../interfaces/salary';
import { Debit, Installments } from '../interfaces/installments';
@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  constructor(private _http:HttpClient) { }

  // ===================================== Incentive Section ==============================
  getUnPaidIncentive():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
    }   
    return this._http.post(`${environment.newServerApi}/api/users/GetApprovedIncentiveRequest` , reqOptions)
  }
  
  deletePendingIncentive(incentive_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'incentive_id':incentive_id,
    }   
    return this._http.post(`${environment.newServerApi}/api/users/DeleteIncentiveRequest` , reqOptions)
  }

  updatePendingIncentive(incentiveRequest:Incentive):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'incentive_amount':incentiveRequest.incentiveAmount,
      'incentive_comment':incentiveRequest.comment,
      'incentive_date':incentiveRequest.date,
      'incentive_status_id':incentiveRequest.incentive_status_id,
      'process_id':incentiveRequest.processKey,
      'user_to_id':incentiveRequest.empKey,
      'incentive_request_id':incentiveRequest.key,
    }
    if(incentiveRequest.incentive_status_id == incentiveFinalStatus.Pending){
      reqOptions['manager_approve_id'] = incentiveRequest.managerToApproveKey;
    }
    
    return this._http.post(`${environment.newServerApi}/api/users/UpdateIncentiveRequest` , reqOptions)
  }
  
  createPendingIncentive(newIncentiveRequest:Incentive):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'incentive_amount':newIncentiveRequest.incentiveAmount,
      'incentive_comment':newIncentiveRequest.comment,
      'incentive_date':newIncentiveRequest.date,
      'incentive_status_id':newIncentiveRequest.finalStatus,
      'process_id':newIncentiveRequest.processKey,
      'user_to_id':newIncentiveRequest.empKey,
    }
    if(newIncentiveRequest.finalStatus == incentiveFinalStatus.Pending){
      reqOptions['manager_approve_id'] = newIncentiveRequest.managerToApproveKey;
    }

    return this._http.post(`${environment.newServerApi}/api/users/CreateIncentiveRequest` , reqOptions)
  }

  getMyIntensiveRequestsToApprove():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetManagerPendingIncentive` , reqOptions)
  }

  getMyPendingIntensiveRequests():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetMyIncentiveRequest` , reqOptions)
  }


  incentiveManagerApprove(incentive_id:string,comment?:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'incentive_id':incentive_id
    }
    if(!!comment){
      reqOptions['comment'] = comment;
    }
    return this._http.post(`${environment.newServerApi}/api/users/ManagerApproveIncentiveRequest` , reqOptions)
  }

  incentiveManagerReject(incentive_id:string,reject_reason:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'incentive_id':incentive_id,
      'reject_reason':reject_reason,
    }
    return this._http.post(`${environment.newServerApi}/api/users/RejectIncentiveRequest` , reqOptions)
  }


  incentiveMarkAsDone(incentive_id:string,comment?:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'incentive_id':incentive_id
    }
    if(!!comment){
      reqOptions['comment'] = comment;
    }
    return this._http.post(`${environment.newServerApi}/api/users/SubDoneIncentiveRequest` , reqOptions)
  }


  getIncentiveHistory(user_id?:string,project_id?:string,from_date?:string | Date , to_date?:string | Date ,status?:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
    }
    if(!!user_id){
      reqOptions['user_id'] = user_id;
    }
    if(!!project_id){
      reqOptions['project_id'] = project_id;
    }
    if(!!from_date){
      reqOptions['from_date'] = `${new Date(from_date).getFullYear()}-${new Date(from_date).getMonth()+1}-${new Date(from_date).getDate()}`;
    }
    if(!!to_date){
      reqOptions['to_date'] = `${new Date(to_date).getFullYear()}-${new Date(to_date).getMonth()+1}-${new Date(to_date).getDate()}`;
    }

    if(!!status){
      reqOptions['incentive_status_id'] = status;
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetIncentiveRequestSheet` , reqOptions)
  }



  // ===================================== Salary Section ==============================

  getEmpsSalaryReport():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetReportUserSalary` , reqOptions)
  }

  getEmpSalaryHistory(user_id):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'user_id':user_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSalaryForUser` , reqOptions)
  }

  createNewSalary(newSalary:Salary):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'salary':`${newSalary.salary}`,
      'assign_to_id':newSalary.empKey,
      'start_date':`${new Date(newSalary.applyfrom).getMonth()+1}/${new Date(newSalary.applyfrom).getDate()}/${new Date(newSalary.applyfrom).getFullYear()}`
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateUserSalary` , reqOptions)
  }


  editSalary(newSalary:Salary):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'salary':`${newSalary.salary}`,
      'salary_id':newSalary.key,
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateUserSalary` , reqOptions)
  }


  generatMonthlySalaryReport(report_date:string| Date, salary_status_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'report_date':`${new Date(report_date).getMonth()+1}/01/${new Date(report_date).getFullYear()}`,
      'salary_status_id':salary_status_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateSalaryMonthlyReport` , reqOptions)
  }

  getMonthlySalaryReport(report_date:string | Date):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'report_date':`${new Date(report_date).getMonth()+1}/${new Date(report_date).getDate()}/${new Date(report_date).getFullYear()}`,
    }
    return this._http.post(`${environment.newServerApi}/api/users/getSalaryMonthlyReport` , reqOptions)
  }

  getApprovedMonthlySalaryReport(report_date:string | Date):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'report_date':`${new Date(report_date).getMonth()+1}/${new Date(report_date).getDate()}/${new Date(report_date).getFullYear()}`,
    }
    return this._http.post(`${environment.newServerApi}/api/users/getSalaryMonthlyReportApproved` , reqOptions)
  }

  financePaySalary(report_date:string, user_id:number):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'report_date':report_date,
      'user_id':user_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/FinancePaidSalaryReport` , reqOptions)
  }


  hrApproveSalary(report_date:string, manager_approve_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'report_date':report_date,
      'manager_approve_id':manager_approve_id,
    }
    return this._http.post(`${environment.newServerApi}/api/users/HRApprovedSalaryReport` , reqOptions)
  }

  managerApproveSalary(report_date:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'report_date':report_date,
    }
    return this._http.post(`${environment.newServerApi}/api/users/ManagerApproveSalaryReport` , reqOptions)
  }


  /* ===================================== Installments Section ============================== */

  getInstallmentDashboard():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetInstallmentDashboard` , reqOptions)
  }

  getInstallmentDashboardByType(type_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'installment_type_id':type_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetInstallmentDashboardForSpecificType` , reqOptions)
  }

  createDebit(newdebit:Debit):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    newdebit.total_amount = newdebit.total_amount.toString()
    let reqOptions = {
      'token':token._token,
      ...newdebit
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateInstallment` , reqOptions)
  }

  createInstallment(newdebit:Installments):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    newdebit.installment_amount = newdebit.installment_amount.toString()
    let reqOptions = {
      'token':token._token,
      ...newdebit
    }
    return this._http.post(`${environment.newServerApi}/api/users/CreateInstallmentPeriod` , reqOptions)
  }

  getDebitDetails(debit_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'installment_id':debit_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetSpecificInstallment` , reqOptions)
  }


  getAllPendingInstallment():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllPendingInstallment` , reqOptions)
  }

  getPendingInstallmentByType(type_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'installment_type_id':type_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllPendingInstallmentForSpecificType` , reqOptions)
  }
  

  getAllNearestInstallment():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllNearestInstallment` , reqOptions)
  }

  getAllInstallment():Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllInstallment` , reqOptions)
  }


  getAllInstallmentByType(type_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'installment_type_id':type_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/GetAllInstallmentForSpecificType` , reqOptions)
  }

  deleteDebit(installment_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'installment_id':installment_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteInstallment` , reqOptions)
  }
  deleteInstallment(installment_id:string):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'installment_period_id':installment_id
    }
    return this._http.post(`${environment.newServerApi}/api/users/DeleteInstallmentPeriod` , reqOptions)
  }

  UpdateInstallment(installment:Installments):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'installment_period_id':installment.id,
      ...installment
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateInstallmentPeriod` , reqOptions)
  }

  UpdateDebit(debit:Debit):Observable<any>{
    const myLocal = localStorage.getItem('userData') 
    let token;
    token = JSON.parse(myLocal || '')   
    let reqOptions = {
      'token':token._token,
      'installment_id':debit.id,
      ...debit
    }
    return this._http.post(`${environment.newServerApi}/api/users/UpdateInstallment` , reqOptions)
  }
  
}
