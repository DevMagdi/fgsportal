import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class BmsApiService {
  private readonly root = `${environment.newServerApi}/api/bms`;
  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    let token = '';
    try { token = JSON.parse(localStorage.getItem('userData') || '{}')._token || ''; } catch (_) { token = ''; }
    return new HttpHeaders({ Authorization: `Bearer ${token}`, Accept: 'application/json' });
  }
  get<T>(path: string, filters: any = {}): Observable<T> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => { if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') params = params.set(key, filters[key]); });
    return this.http.get<any>(`${this.root}/${path}`, { headers: this.headers(), params }).pipe(map(response => response.data));
  }
  post<T>(path: string, body: any = {}): Observable<T> {
    return this.http.post<any>(`${this.root}/${path}`, body, { headers: this.headers() }).pipe(map(response => response.data));
  }
  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<any>(`${this.root}/${path}`, body, { headers: this.headers() }).pipe(map(response => response.data));
  }
  delete<T>(path: string): Observable<T> {
    return this.http.delete<any>(`${this.root}/${path}`, { headers: this.headers() }).pipe(map(response => response.data));
  }
}
