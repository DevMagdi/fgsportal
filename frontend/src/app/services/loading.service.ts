import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loading= new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor() { }

  setLoading(isLoading:boolean){
    this.loading.next(isLoading);
    
  }
}
