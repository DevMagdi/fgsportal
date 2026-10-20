import { User } from 'src/app/interfaces/user';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Department } from '../interfaces/user';
import { AuthApiService } from './auth-api.service';
import { DatabaseService } from './database.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentGuard implements CanActivate {
  // private readonly defaultAllowedDepartments: number[] = [
  //   Number(Department.Business_Development),
  //   Number(Department.MANAGEMENT),
  //   Number(Department.ADMINSTRATION)
  // ];

  constructor(private _auth: AuthApiService,
    private _db: DatabaseService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const routeDepartments = route.data?.allowedDepartments as Department[] | undefined;
    const allowedDepartments: number[] = routeDepartments?.map(dept => Number(dept)) || [];
    return this._auth.user.pipe(take(1), map((user: User) => {
      console.log(user);

      const isAuth = !!user;
      if (!!isAuth) {
        if (allowedDepartments.includes(Number(user.department))) {
          return true;
        } else {
          console.log(`Access denied for department: ${user.department}`);
          this._db.createSystemLogs(
            `Access denied to ${state.url}`,
            JSON.stringify({
              route: state.url,
              department: user.department,
              allowedDepartments
            }),
            user.key || '',
            user.username || '',
            'Denied'
          ).subscribe();

          return this.router.createUrlTree(['/']);
        }
      } else {
        console.log('user not logged in, access denied!');
        return this.router.createUrlTree(['/']);
      }
    }));
  }
}
