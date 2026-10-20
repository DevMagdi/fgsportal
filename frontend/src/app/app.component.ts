import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthApiService } from './services/auth-api.service';
import { MessagingService } from './services/messaging.service';
import { DatabaseService } from './services/database.service';
import { ResStatus } from './interfaces/res-status';
import { LoadingService } from './services/loading.service';
import { ModuleService } from './services/module.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fgsPM';
  message;
  loggedIn: boolean = true;
  loading$ = this.loadingService.loading$;
  loading = true;

  constructor(private messagingService: MessagingService,
    private _db: DatabaseService,
    private _authAPi: AuthApiService,
    public loadingService: LoadingService,
    private cd:ChangeDetectorRef,
    private moduleService: ModuleService

  ) {


  }
  ngOnInit() {

    // if (Notification.permission === 'denied') {
    //   let message = '';
    //   if(!localStorage.getItem('n') || (localStorage.getItem('n') == 'true')){
    //     if ('Notification' in window) {
    //       message = 'Notifications have been blocked for this website. Please enable notifications in your browser settings to receive all updates.'
    //     } else {
    //       message = 'Your browser not support the web notification, so please to get all our news please use another browser.'
    //     }
    //     const res = confirm(message).valueOf();
    //     if(res == false){
    //       localStorage.setItem('n','false')
    //     }
    //   }

    // }else if(Notification.permission === 'default'){
    //   this.messagingService.requestPermission()
    // }
    this.messagingService.requestPermission()
    this.messagingService.receiveMessage()
    this.message = this.messagingService.currentMessage
    this._authAPi.autoLogin()
    // Refresh module entitlements on every app bootstrap (covers page refresh).
    if (localStorage.getItem('userData')) {
      this.moduleService.loadEnabledModules().subscribe();
    }
    this._authAPi.user.subscribe(user => {
      
      this.loadingService.setLoading(true);
      this.loading = true;
      // this.loggedIn == false;
      if (!!user) {

        this._authAPi.getUserPermissionsByKey(user.key || '').subscribe(perms => {
          if (perms['status'] == ResStatus.CRUD || perms['status'] == ResStatus.Success_But_Empty) {
            this._authAPi.userPerms = perms['data'];
            this.loading = false;
            this.loggedIn = true;
            this._authAPi.currentUser = user;

          } else {
            this.loading = false;
            this.loggedIn = false;
            this._authAPi.userPerms = [];

          }
          this.loadingService.setLoading(false);
        }, err => {
          this.loading = false;
          this.loggedIn = true;
          console.log(err);
          this._authAPi.userPerms = [];
          this.loadingService.setLoading(false);
        })

      } else {
        this.loading = false;
        this.loggedIn = false;
        this.loadingService.setLoading(false);
      }
    })
  }

}
