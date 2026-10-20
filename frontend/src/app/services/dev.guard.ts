import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountPositions, AccountType, Department } from '../interfaces/user'
import { take, map } from 'rxjs/operators';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class DevGuard implements CanActivate {
  constructor(private _auth:AuthApiService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this._auth.user.pipe(take(1),map(user=>{
        const isAuth = !!user;
        if(!!isAuth){
          if(user.department == Department.TECHNICAL_TEAM && (user.accPosition != AccountPositions.MANAGER)){
            console.log('access granted!');
            console.log("%cمنورين يا ديفلوبرز ^_^", 'color:#694796;font-size:30px;font-weight:800');
            return true;
          }else{
            console.log('access denied!');
            return this.router.createUrlTree(['/']);
          }
        }else{
          console.log('user not logged in, access denied!');
          return this.router.createUrlTree(['/']);
        }
      }))
      // return this.auth.user.pipe(
      //   take(1),
      //   tap(user => {
      //     if (!!user) {
      //       return user;
      //     }
      //   }),
      //   map(user => {
      //     if (!!user) {
      //       if ((user.department === Department.TECHNICAL_TEAM)) {
      //         console.log('access granted!');
      //         console.log("%cمنورين يا ديفلوبرز ^_^", 'color:#694796;font-size:30px;font-weight:800');
      //         return true;
      //       } else {
      //         console.log('access denied!');
      //         this.router.navigate(['/']);
      //         return false;
      //       }
  
      //     } else {
      //       console.log('user not logged in, access denied!');
      //       this.router.navigate(['/signin']);
      //       return false;
      //     }
      //   })
      // );
    }
  
  
}
