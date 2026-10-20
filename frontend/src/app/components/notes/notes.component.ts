import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NoteBGColor, Notes, NoteUser } from 'src/app/interfaces/notes';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackBarState } from '../snackbar/snackbar.component';
import { environment } from 'src/environments/environment';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  private noteInput$ = new Subject<string>();
  myNotes:Notes[] = [];
  allUsers:User[] = [];
  editeNoteForm:FormGroup = new FormGroup({
    'note_date':new FormControl(this._db.getDateFormatted(new Date())),
    'project_id':new FormControl(null),
    'users':new FormControl(null),
    'note_id':new FormControl(null)
  })



  usersOnNote:NoteUser[]=[]


  selectedNote:Notes;

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'size': ['small', false, 'large'] }],  // custom dropdown 'huge'
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  
    ['clean']                                         // remove formatting button
  ];
  quillOPT ={
    toolbar: this.toolbarOptions
  }

  newServerApi = environment.newServerApi;

  noteLoader:boolean = false;
  noteColorEnum = NoteBGColor;
  currentUser:User;
  constructor(private _db:DatabaseService,
              private _auth:AuthApiService,
              private clipboard: Clipboard,
              private _notify:NotificationService) {
                this.noteInput$.pipe(debounceTime(1500)).subscribe(() => {
                  this.submitUpdateNote();
                });
               }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      if(this.currentUser.accRole == AccountRoles.SUPER_USER){
        this.getAllNotes();
      }else{
        this.getMyNotes();
      }
      this.getAllusers();
      // this._db.getNotebyID('2').subscribe(res=>{
      //   console.log(res);
      // })
      
      
    })
  }


  getAllNotes(){
    this._db.getAllNotes().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.myNotes = res['data']
        this.myNotes = this.myNotes.reverse()
        // console.log(this.myNotes);
        this.myNotes.length > 0 ? this.selectedNote = this.myNotes[0] : null
        this.triggerSelectedNote();
      }
    })
  }

  triggerSelectedNote(){
    this._db.getUserNotesRealTime(this.selectedNote.id||'',this.currentUser.key||'').subscribe(res=>{
      if(!!res && !!res.refresh_required){
        res.refresh_required = false;
        this._db.updateNotesRealTime(this.selectedNote.id||'',this.currentUser.key||'',res);
        this.refreshSelectedNote();
      }
    })
  }
  refreshSelectedNote(){
    this._db.getNotebyID(this.selectedNote.id||'').subscribe(res=>{
      console.log(res);
      if(res['status'] == ResStatus.CRUD){
        this.selectedNote = res['data'][0]
      }
    })
  }

  getMyNotes(){
    this._db.getMyNotes().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.myNotes = res['data']
        this.myNotes = this.myNotes.reverse()
        // console.log(this.myNotes);
        this.myNotes.length > 0 ? this.selectedNote = this.myNotes[0] : null
        this.triggerSelectedNote();
      }
    })
  }

  onSelectUsers(): void {
    this.usersOnNote = [];
    if(!!this.editeNoteForm.get('users')?.value && this.editeNoteForm.get('users')?.value.length > 0){
      const users = this.editeNoteForm.get('users')?.value;
      for (let i in users){
        const user:NoteUser = {
          id : users[i].key,
          username:users[i].username,
          user_id:users[i].key,
          can_write:true
        }
        this.usersOnNote.push(user)
      }
    }
  }

  getAllusers(){
    this._auth.getAllUsers().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.allUsers = res['data']
        this.allUsers = this.allUsers.sort((a,b)=>{
          return compare(a.username, b.username, true);
        })
      }
    })
  }



  createNote(){
    const newNote:Notes = {
      note:'',
      user_id:[],
      note_date :this._db.getDateFormatted(new Date()),
      keep_note_status_id : '1'
    }
    this._db.createNote(newNote).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.getMyNotes();
        this.editeNoteForm.reset()
        this.usersOnNote = [];
      }
    },console.log)
  }
  
  submitUpdateNote(){   
    if((this.currentUser.key != this.selectedNote.user_creator) && !this.checkIFCanWrite()){
      return this._notify.openSnackbar("You Don't have permission to edit it", SnackBarState.Warning)
    }
    this.noteLoader = true;
    if(this.usersOnNote.length > 0){
      this.usersOnNote.map(u=>{
        if(u.can_write == true){
          u.can_write = '1'
        }else{
          u.can_write = '0'
        }
      })
    }else{
      this.usersOnNote = this.selectedNote.user_id;
    }

    const newNote:Notes = {
      note:this.selectedNote.note,
      user_id :this.usersOnNote,
      id:this.selectedNote.id,
      noteBackgroundColor:this.selectedNote.noteBackgroundColor
    }
    
    this._db.updateNote(newNote).subscribe(res=>{
      this.noteLoader = false;
      // console.log(res);
      
      if(res['status'] == ResStatus.CRUD){
        this.refreshSelectedNote();
        // this._notify.openSnackbar('Done!', SnackBarState.Success);
        this.editeNoteForm.reset()
        this.usersOnNote = [];
      }
    },err=>{
      this.noteLoader = false;
      console.log(err);
    })
  }


  deleteNote(note_id:string){
    this._notify.openDialog(
      'Delete Note?',
      `Are you sure you want to Delete this note?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.noteLoader = true;
          this._db.deleteNote(note_id).subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this._notify.openSnackbar('Deleted!', SnackBarState.Success);
              this.getMyNotes();
              this.noteLoader = false;
            }
          },err=>{
            console.log(err);
            this.noteLoader = false;
            this._notify.openSnackbar('Error!', SnackBarState.Error);
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }


  changeNoteColor(colorName:string){
    switch (colorName){
      case "Yellow":
        this.selectedNote.noteBackgroundColor = NoteBGColor.Yellow
        break;
      case 'Green':
        this.selectedNote.noteBackgroundColor = NoteBGColor.Green
        break;
      case 'Pink':
        this.selectedNote.noteBackgroundColor = NoteBGColor.Pink
        break;
      case 'Purple':
        this.selectedNote.noteBackgroundColor = NoteBGColor.Purple
        break;
      case 'Blue':
        this.selectedNote.noteBackgroundColor = NoteBGColor.Blue
        break;
      case 'Gray':
        this.selectedNote.noteBackgroundColor = NoteBGColor.Gray
        break;
      case 'Charcoal':
        this.selectedNote.noteBackgroundColor = NoteBGColor.Charcoal
        break;
    }

    this.submitUpdateNote();

  }


  copyText(textToCopy:string) {
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(textToCopy, 'text/html');
    const finalText = parsedHtml.documentElement.textContent || '';
    this.clipboard.copy(finalText);
  }

  closeForm(){
    this.editeNoteForm.reset();
    this.usersOnNote = [];
  }


  openEditCollaboratorForm(){
    this.usersOnNote = [];
    const selectedUsers:User[] = [];
    if(this.selectedNote.user_id && this.selectedNote.user_id.length > 0){
      for (let i in this.selectedNote.user_id){
        this.usersOnNote.push({
          id : this.selectedNote.user_id[i].id,
          user_id : this.selectedNote.user_id[i].user_id,
          username : this.selectedNote.user_id[i].username,
          can_write:this.selectedNote.user_id[i].can_write,
          avatar :this.selectedNote.user_id[i].avatar
        })
        const u = this.allUsers.find(u=>u.key == this.selectedNote.user_id[i].user_id)        
        !!u?selectedUsers.push(u):null 
        
      }
      // console.log(selectedUsers);
      // console.log(this.usersOnNote);
      this.editeNoteForm.patchValue({
        'users':selectedUsers
      })
      
    }
  }

  checkIFCanWrite():boolean{
    const user = this.selectedNote.user_id.find(u=>u.user_id == this.currentUser.key)
    if(!!user){
      if(user.can_write == true){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }
  deleteUserFromCollaporators(user:NoteUser){
    this.usersOnNote.splice(this.usersOnNote.findIndex(u=>u.id == user.id),1)
    let users = this.editeNoteForm.get('users')?.value
    users.splice(users.findIndex(u=>u.key == user.user_id),1)
    this.editeNoteForm.patchValue({
      'users' : users
    })
  }

  onNoteInputChange(event:any){
    // this.submitUpdateNote();
    this.noteInput$.next(this.selectedNote.note);
    // alert('Hello')
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}