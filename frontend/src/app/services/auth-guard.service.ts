import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountType } from '../interfaces/user'
import { take, map, tap } from 'rxjs/operators';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router,
              private _authApi:AuthApiService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this._authApi.user.pipe(take(1),map(user=>{
        const isAuth = !!user;
        if(!!isAuth){
          console.log('access granted!');
          return true;
        }else{
          console.log('user not logged in, access denied!');
          return this.router.createUrlTree(['/']);
        }
      }))
      // return this._authApi.user.pipe(
      //   take(1),
      //   tap(user => {
      //     console.log(user);
          
      //     if (!!user) {
      //       return user;
      //     }
      //   }),
      //   map(user => {
      //     if (!!user) {
      //       return user;
      //     } else {
      //       console.log('user not logged in, access denied!');
      //       this.router.navigate(['/signin']);
      //       return false;
      //     }
      //   })
      // ); 
    }
  

}
