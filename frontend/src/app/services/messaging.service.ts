import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import { NotificationStatus, Notifying } from '../interfaces/notification';
import {environment} from '../../environments/environment'
import { AuthApiService } from './auth-api.service';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  private notificationPath= '/notification';
  notificationRef:AngularFireList<Notifying>;
  today:Date;

  constructor(private db:AngularFireDatabase,
              private angularFireMessaging: AngularFireMessaging,
              private http: HttpClient,
              private _auth:AuthApiService,
              private afAuth:AngularFireAuth) {

    this.notificationRef = db.list(this.notificationPath)

    this.angularFireMessaging.messages.subscribe(
      (_messaging: any) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        this.currentMessage.next(_messaging);
      }
    )

    // this.getCurrentTime().subscribe(date=>{
    //   if(!!date){
    //     this.today = new Date(date);
    //   }else{
    //     this.today = new Date();
    //   }
    // })
  } 

  // getCurrentTime():Observable<any>{
  //   return this.http.get<any>('https://api.ipgeolocation.io/timezone?apiKey=f338d94743d843f690f621e341023992&tz=Africa/Cairo')
  // }
  
  private updateToken(token){
    this._auth.user.subscribe(
      user=>{
        if (!user) return;
        const data = {[user.key] : token}
        this.db.object('fcmTokens/').update(data)
      }
    )
  }
  
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        this.updateToken(token)
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  } 
  
  
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload: any) => {
        console.log("new message received. ", payload.notification);
        this.currentMessage.next(payload);
        this.showCustomNotification(payload)
        this.playSound()
      })
  }


  private showCustomNotification(payload:any){   
    let notify_data = payload['notification']
    let title = notify_data['title']
    let option = {
      body :notify_data['body'],
      icon:'../../assets/img/new logo.png',
      badge : '../../assets/img/new logo.png',
      image : '../../assets/img/new logo.png'
    };

    console.log('new message received. ', notify_data);
    let notify:Notification = new Notification (title , option)
    notify.onclick = event => {
      event.preventDefault();
      window.location.href = 'https://connect.firstgulfsolutions.com'
    }
  }


  private sendNotification(newNotification:Notifying , toKey:any) {
    const headerDict = {
      'Authorization': `key=${environment.cloudMessagingServerkey}` 
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.post('https://fcm.googleapis.com/fcm/send', {
      "notification": {
        "title": newNotification.title,
        "body": newNotification.body
      },
      "to": toKey ? toKey : ""
    }, requestOptions
    )
  }

  getLocalStringDate(){
    return `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}, ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  }

  createnotification(newNotification:Notifying):Promise<void>{
    // console.log(newNotification.receverName);
    
    newNotification.createdAt = this.getLocalStringDate() //new Date(this.today).toLocaleString()
    newNotification.status = NotificationStatus.unSeen
    return this.notificationRef.push(newNotification).then(()=>{
      this.db.object<any>(`/fcmTokens/${newNotification.receverKey}`).snapshotChanges().pipe(
        map(user => {                              
          this.sendNotification(newNotification , user.payload.val()).subscribe()
        })
      ).subscribe();
    })
  }


  getNotificationByUser(empKey:string , withlimit:number):Observable<Notifying[]>{    
    if(withlimit == 0){
      return this.db.list<Notifying[]>('/notification', ref =>
        ref.orderByChild('receverKey').equalTo(empKey) //.limitToLast(5)
        ).snapshotChanges(['child_changed', 'child_removed', 'child_added']).pipe(
        map(notifications => notifications.map(notify => {
          return { key: notify.key, ...notify.payload.val() } as Notifying;
        }))
      );
    }else{
      return this.db.list<Notifying[]>('/notification', ref =>
        ref.orderByChild('receverKey').equalTo(empKey).limitToLast(withlimit)
      ).snapshotChanges(['child_changed', 'child_removed', 'child_added']).pipe(
        map(notifications => notifications.map(notify => {
          return { key: notify.key, ...notify.payload.val() } as Notifying;
        }))
      );
    }
  }


  updateNotification(notify:Notifying):Promise<void>{
    notify.updatedAt = new Date(this.today).toLocaleString();
    return this.notificationRef.update(notify.key || "" , notify)
  }


  deleteNotification(notify:Notifying):Promise<void>{
    return this.notificationRef.remove(notify.key)
  }


  private playSound() {
    const audio = new Audio();
    audio.src = '../../assets/sound/ping.mp3';
    audio.load();
    audio.play();
  }

}