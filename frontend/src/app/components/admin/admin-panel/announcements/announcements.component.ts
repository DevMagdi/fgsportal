import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Announcement, AnnouncementToView, AnnouncementViews, AnnounceStatus } from 'src/app/interfaces/announcement';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountType, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  currentUser:User;
  myAnnounces:Announcement[] = [];
  newAnnounceForm:FormGroup;
  displayModal:boolean = false;
  allUsers:User[] = [];
  announceImg:File | undefined;
  url:string = '';
  loading:boolean = false;
  announceReview:boolean = false;
  announceToEdit:Announcement;
  myViews:string = '';
  imgToDelete:string = '';
  accTypeEnum = Department;
  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    // ['blockquote', 'code-block'],
    [{ 'size': ['small', false, 'large'] }],  // custom dropdown 'huge'
    // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    // [{ 'font': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  
    ['clean']                                         // remove formatting button
  ];
  quillOPT ={
    toolbar: this.toolbarOptions
  }
  newServerApi = environment.newServerApi
  constructor(private _db:DatabaseService,
              private _auth:AuthApiService,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this.newAnnounceForm = new FormGroup({
      "title":new FormControl(null , Validators.required),
      "body":new FormControl(null , Validators.required),
      "assignTo":new FormControl(null , Validators.required),
      "language":new FormControl(null , Validators.required)
    })

    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      this.getMyAnnounces();
      this._auth.getAllUsers().subscribe(users=>{
        if(users['status'] == ResStatus.CRUD){
          this.allUsers = users['data']  //.filter(user=>user.accType != AccountType.Client);
        }
      })
    })
  }


  getMyAnnounces(){
    if(this.currentUser.department == Department.MANAGEMENT){
      this._db.getAllAnnounces().subscribe(announces=>{
        if(announces['status'] == ResStatus.CRUD){
          this.myAnnounces = announces['data'].reverse();
        }else{
          this.myAnnounces = []
        }
      })
    }else if(this.currentUser.accPosition == AccountPositions.MANAGER || this.currentUser.department == Department.ADMINSTRATION){
      this._db.getMyAnnounces().subscribe(announces=>{
        if(announces['status'] == ResStatus.CRUD){
          this.myAnnounces = announces['data'].reverse();
        }else{
          this.myAnnounces = []
        }
      })
    }
  }



  imageupload(event:any){
    
    this.announceImg = event.target.files[0]
    if (event.target.files){
      var reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event:any) =>{
        this.url = event.target.result;
      }
    }
  }


  createNewAnnounce(){
    this.loading = true;
    const assignTo = this.newAnnounceForm.get(['assignTo'])?.value;
    const isAll = assignTo.find(key=>key == 'All')
    const fd : FormData = new FormData()
    if(isAll){
      for (let i in this.allUsers){
        fd.append('user_id[]' , this.allUsers[i].key|| '')      
      }
    }else{
      for (let i in assignTo){
        fd.append('user_id[]' , assignTo[i])
      }
    }
    

    fd.append('title' ,this.newAnnounceForm.get(['title'])?.value)
    fd.append('body' ,this.newAnnounceForm.get(['body'])?.value)
    fd.append('lang' ,this.newAnnounceForm.get(['language'])?.value)
    if(!!this.announceImg){
      fd.append('attach' , this.announceImg)
    }

    this._db.createNewAnnounce(fd).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.getMyAnnounces();
        this._notify.openSnackbar('Success' , SnackBarState.Success)
        this.resetAll();
        this.loading = false;
      }else{
        this.loading = false;
      }
    },err=>{
      this.loading = false;
    })

  }

  // createNewAnnounceOLD(){
  //   this.loading = true;
  //   const assignTo = this.newAnnounceForm.get(['assignTo'])?.value;
  //   const isAll = assignTo.find(key=>key == 'All')
  //   let finalAssignTo:AnnouncementToView[] = [];
  //   if(isAll){
  //     for (let i in this.allUsers){
  //       const toView:AnnouncementToView={
  //         empToviewedByKey:this.allUsers[i].key|| '',
  //         empToviewedByName:this.allUsers[i].username
  //       }
  //       finalAssignTo.push(toView);
  //     }
  //   }else{
  //     for (let i in assignTo){
  //       const empToView = this.allUsers.find(user=>user.key == assignTo[i])
  //       if(!!empToView){
  //         const toView:AnnouncementToView={
  //           empToviewedByKey:empToView.key|| '',
  //           empToviewedByName:empToView.username
  //         }
  //         finalAssignTo.push(toView);
  //       }
        
  //     }
  //   }
    
  //   const newAnn:Announcement={
  //     title:this.newAnnounceForm.get(['title'])?.value,
  //     body:this.newAnnounceForm.get(['body'])?.value,
  //     language:this.newAnnounceForm.get(['language'])?.value,
  //     assignTo : finalAssignTo,
  //     status:AnnounceStatus.RUNNING,
  //     createdByKey:this.currentUser.key || '',
  //     createdByName:this.currentUser.username,
  //     createdByImgUrl :this.currentUser.photoURL ? this.currentUser.photoURL : '',
  //     viewedBy:[]
  //   }
  //   if(!!this.announceImg){
  //     this._db.createNewAnnounce(newAnn , this.announceImg).then(()=>{
  //       this._notify.openSnackbar('Success' , SnackBarState.Success)
  //       this.resetAll();

  //     })
  //   }else{
  //     this._db.createNewAnnounce(newAnn , this.announceImg).then(()=>{
  //       this._notify.openSnackbar('Success' , SnackBarState.Success)
  //       this.resetAll();
  //     })
  //   }
  // }


  resetAll(){
    this.displayModal = false;
    this.loading = false;
    this.url = '';
    this.announceImg = undefined;
    this.newAnnounceForm.reset();
    // this.announceToEdit = undefined;
  }

  editAnnounce(announce:Announcement){
    this.announceToEdit = announce;
    const ass = this.announceToEdit.assignTo.map(oldAss=>oldAss.empToviewedByKey)
    this.newAnnounceForm.patchValue({
      'title':this.announceToEdit.title,
      'body':this.announceToEdit.body,
      'assignTo':ass,
      'language': this.announceToEdit.language
    })
    if(!!this.announceToEdit.imgURL){
      this.url = `${this.newServerApi}${this.announceToEdit.imgURL}`;
    }
  }
  
  updateAnnounce(){
    this.loading = true;
    const assignTo = this.newAnnounceForm.get(['assignTo'])?.value;
    const isAll = assignTo.find(key=>key == 'All')
    const fd : FormData = new FormData()
    if(isAll){
      for (let i in this.allUsers){
        fd.append('user_id[]' , this.allUsers[i].key|| '')      
      }
    }else{
      for (let i in assignTo){
        fd.append('user_id[]' , assignTo[i])
      }
    }
    

    fd.append('title' ,this.newAnnounceForm.get(['title'])?.value)
    fd.append('body' ,this.newAnnounceForm.get(['body'])?.value)
    fd.append('lang' ,this.newAnnounceForm.get(['language'])?.value)
    fd.append('announce_id' ,this.announceToEdit.key || '')
    if(!!this.announceImg){
      fd.append('attach' , this.announceImg)
    }

    this._db.updateAnnounce(fd).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this._notify.openSnackbar('Success' , SnackBarState.Success)
        this.resetAll();
        this.loading = false;
        this.getMyAnnounces();
      }else{
        this.loading = false;
      }
    },err=>{
      this.loading = false;
    })
  }

  // updateAnnounceOLD(){
  //   this.loading = true;
  //   const assignTo = this.newAnnounceForm.get(['assignTo'])?.value;
  //   const isAll = assignTo.find(key=>key == 'All')
  //   let finalAssignTo:AnnouncementToView[] = [];
  //   if(isAll){
  //     for (let i in this.allUsers){
  //       const toView:AnnouncementToView={
  //         empToviewedByKey:this.allUsers[i].key|| '',
  //         empToviewedByName:this.allUsers[i].username
  //       }
  //       finalAssignTo.push(toView);
  //     }
  //   }else{
  //     for (let i in assignTo){
  //       const empToView = this.allUsers.find(user=>user.key == assignTo[i])
  //       if(!!empToView){
  //         const toView:AnnouncementToView={
  //           empToviewedByKey:empToView.key|| '',
  //           empToviewedByName:empToView.username
  //         }
  //         finalAssignTo.push(toView);
  //       }
        
  //     }
  //   }
    
  //   // const newAnn:Announcement={
  //   //   title:this.newAnnounceForm.get(['title'])?.value,
  //   //   body:this.newAnnounceForm.get(['body'])?.value,
  //   //   language:this.newAnnounceForm.get(['language'])?.value,
  //   //   assignTo : finalAssignTo,
  //   //   status:AnnounceStatus.RUNNING,
  //   //   createdByKey:this.currentUser.key || '',
  //   //   createdByName:this.currentUser.username,
  //   //   createdByImgUrl :this.currentUser.photoURL ? this.currentUser.photoURL : '',
  //   //   viewedBy:this.announceToEdit?.viewedBy || []
  //   // }
  //   this.announceToEdit.title = this.newAnnounceForm.get(['title'])?.value;
  //   this.announceToEdit.body = this.newAnnounceForm.get(['body'])?.value;
  //   this.announceToEdit.language = this.newAnnounceForm.get(['language'])?.value;
  //   this.announceToEdit.assignTo = finalAssignTo;
  //   this.announceToEdit.status = AnnounceStatus.RUNNING;
  //   if(!!this.announceImg){
  //     this.imgToDelete = this.announceToEdit?.imgURL || '';
      
  //     this._db.updateAnnounce(this.announceToEdit , this.announceImg , this.imgToDelete).then(()=>{
  //       this._notify.openSnackbar('Success' , SnackBarState.Success)
  //       this.resetAll();

  //     })
  //   }else{
  //     this._db.updateAnnounce(this.announceToEdit).then(()=>{
  //       this._notify.openSnackbar('Success' , SnackBarState.Success)
  //       this.resetAll();
  //     })
  //   }
  // }

  getMyViews(views:AnnouncementViews[]){
    this.myViews = '';
    for(let i in views){
      if(!!this.myViews){
        this.myViews = `${this.myViews} , ${views[i].viewedByName}` 
      }else{
        this.myViews = `${views[i].viewedByName}` 
      }
    }
  }


  deleteAnnounce(announce:Announcement){
    this._notify.openDialog(
      'Delete Announce?',
      `Are you sure you want to Delete Announce?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deleteAnnounce(announce.key || '').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this._notify.openSnackbar('Deleted')
              this.getMyAnnounces();
            }
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }


  closeAccounce(announce:Announcement){
    this._notify.openDialog(
      'Close Announce?',
      `Are you sure you want to Close Announce?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          announce.status = AnnounceStatus.CLOSED
          this._db.closeAnnounce(announce.key || '').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this._notify.openSnackbar('Deleted')
            }
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

}
