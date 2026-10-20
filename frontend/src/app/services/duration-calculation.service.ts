import { Injectable } from '@angular/core';
import { Project } from '../interfaces/project';
import { SUB_TASk, Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class DurationCalculationService {

  constructor() { }


  projectEndDateCalculation(projectStartDate:string , projectDuration:number):Date{
   
    const startDate = new Date(projectStartDate)     
    const duration = projectDuration
    const newDate =  startDate.setDate(startDate.getDate() + (duration - 1))
    let end_date = new Date(newDate)



    let dateForVacations = new Date(projectStartDate)
    let endDate = end_date

    while (dateForVacations <= endDate){
      if(dateForVacations.getDay() == 5 || dateForVacations.getDay() == 6){
        end_date = new Date(end_date.setDate(end_date.getDate()+1));
      }
      dateForVacations = new Date(dateForVacations.setDate(dateForVacations.getDate()+1));
    }
    return end_date
  }


  SubTaskEndDateCalculation(processStartDate:string , processDuration:number):Date{
   
    const startDate = new Date(processStartDate) 
    const duration = processDuration
    const newDate =  startDate.setDate(startDate.getDate() + (duration - 1))
    let end_date = new Date(newDate)



    let dateForVacations = new Date(processStartDate)
    let endDate = end_date

    while (dateForVacations <= endDate){
      if(dateForVacations.getDay() == 5 || dateForVacations.getDay() == 6){
        end_date = new Date(end_date.setDate(end_date.getDate()+1));
      }
      dateForVacations = new Date(dateForVacations.setDate(dateForVacations.getDate()+1));
    }
    return end_date
  }


  taskEndDateCalculation(newTask:Task){
    const startDate = new Date(newTask.start_date) 
    const duration = newTask.ex_duration / 8 
    const newDate =  startDate.setDate(startDate.getDate() + duration)
    newTask.end_date = new Date(newDate)


    let dateForVacations = new Date(newTask.start_date)
    let endDate = newTask.end_date

    while (dateForVacations <= endDate){
      if(dateForVacations.getDay() == 5 || dateForVacations.getDay() == 6){
        newTask.end_date = new Date(newTask.end_date.setDate(newTask.end_date.getDate()+1));
      }
      dateForVacations = new Date(dateForVacations.setDate(dateForVacations.getDate()+1));
    }
  
    return newTask.end_date
  
  }


  getMonthDates(date?:Date|string){
    if(!date){
      const currentMonthDays:Date[] = []
    
      const today = new Date() 
      let firstday = new Date(today.getFullYear(), today.getMonth(), 1)
      let lastday = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      while(firstday <= lastday){
        currentMonthDays.push(new Date(firstday))
        firstday = new Date(firstday.setDate(firstday.getDate()+1));
      }
      return currentMonthDays;
    }else{
      const currentMonthDays:Date[] = []
      const today = new Date(date) 
      let firstday = new Date(today.getFullYear(), today.getMonth(), 1)
      let lastday = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      while(firstday <= lastday){
        currentMonthDays.push(new Date(firstday))
        firstday = new Date(firstday.setDate(firstday.getDate()+1));
      }

      return currentMonthDays;
    }
    
  }


  datesBetweenTwoDates(from:Date , to:Date){
    const dates:Date[] = []
    let firstday = new Date(from.getFullYear(), from.getMonth(), from.getDate())
    let lastday = new Date(to.getFullYear(), to.getMonth(), to.getDate())
    while(firstday <= lastday){
      dates.push(new Date(firstday))
      firstday = new Date(firstday.setDate(firstday.getDate()+1));
    }

    return dates;
  }
  
}
