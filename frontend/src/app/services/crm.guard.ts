import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Department } from '../interfaces/user';
import { AuthApiService } from './auth-api.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CRMGuard implements CanActivate {
  constructor(private _auth: AuthApiService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._auth.user.pipe(take(1), map(user => {
      const isAuth = !!user;
      if (!!isAuth) {
        if (user.department == Department.Business_Development || user.department == Department.MANAGEMENT || user.department == Department.ADMINSTRATION) {
          console.log('access granted!');
          console.log("%c Welcome To CRM ^_^", 'color:#694796;font-size:30px;font-weight:800');
          return true;
        } else {
          console.log('access denied!');
          return this.router.createUrlTree(['/']);
        }
      } else {
        console.log('user not logged in, access denied!');
        return this.router.createUrlTree(['/']);
      }
    }))
  }

}
