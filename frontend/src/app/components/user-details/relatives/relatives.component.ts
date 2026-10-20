import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Relative, User ,Relationship, Gender, Department} from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from '../../snackbar/snackbar.component';

@Component({
  selector: 'app-relatives',
  templateUrl: './relatives.component.html',
  styleUrls: ['./relatives.component.scss']
})
export class RelativesComponent implements OnInit {

  @Input() currentUser:User;
  @Input() loggedInUser:User;
  DepartmentEnum = Department;
  myRelative:Relative[] = [];
  closeResult: string;
  modalOpen=false;
  newRelativeForm = new FormGroup({
    'name': new FormControl(null, Validators.required),
    'relation': new FormControl(null, Validators.required),
    'birthDate': new FormControl(null, Validators.required),
    'gender': new FormControl(null, Validators.required),
  });

  relativeToEdit:Relative | null;
  relativeOnEditMode:boolean = false;

  constructor(private _auth:AuthApiService,
              private notify:NotificationService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    // this.currentUser.relatives?.map(person=>this.editMode.push(false))
    this.getMyRelative();
  }



  getMyRelative(){
    this._auth.getMyfamilyInfo(this.currentUser.key || '').subscribe(res=>{
      console.log(res);
      if(res['status'] == ResStatus.CRUD){
        this.myRelative = res['data']
      }
    })
  }


  
  deleteRelative(person:Relative){

    this.notify.openDialog(
      'Delete Relative ?!',
      `Are you sure you want to delete ?!`,
      false,
      "",
      true,
      false).subscribe(response => {
        if (response) {
          this._auth.deleteMyfamilyInfo(person.key || '').subscribe(res=>{
            console.log(res);
            if(res['status'] == ResStatus.CRUD){
              this.getMyRelative()
            }else if(res['status'] == ResStatus.Success_But_Empty){
              this.myRelative = [];
            }
          })
        } else {
          this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
   
  }


  open(content) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  createRelative(){
    const day = `${new Date(this.newRelativeForm.get(['birthDate'])?.value).getDate()}`
    const month = `${new Date(this.newRelativeForm.get(['birthDate'])?.value).getMonth() + 1 }`
    const year = `${new Date(this.newRelativeForm.get(['birthDate'])?.value).getFullYear() }`
    const NewRelative:Relative = {
      name:this.newRelativeForm.get(['name'])?.value,
      birthDate:`${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year}`,
      relation:this.newRelativeForm.get(['relation'])?.value,
      gender:this.newRelativeForm.get(['gender'])?.value,
    }
    this._auth.createNewMyfamilyInfo(NewRelative).subscribe(res=>{
      console.log(res);
      if(res['status'] == ResStatus.CRUD){
        this.getMyRelative();
        this.newRelativeForm.reset();
      }
    })
  }


  validateRelative(){
    if(this.relativeOnEditMode == true){
      this.saveEditRelative()
    }else{
      this.createRelative()
    }
  }

  editRelative(relative:Relative){
    this.relativeOnEditMode = true;
    const day = `${new Date(relative.birthDate).getDate()}`
    const month = `${new Date(relative.birthDate).getMonth() + 1 }`
    const year = `${new Date(relative.birthDate).getFullYear() }`
    this.newRelativeForm.patchValue({
      'name':relative.name,
      'birthDate':`${year}-${month.length == 1 ? `0${month}` : month}-${day.length == 1 ? `0${day}` : day}`,
      'gender':relative.gender,
      'relation':relative.relation,
    })
    this.relativeToEdit = relative;
  }


  saveEditRelative(){
    const day = `${new Date(this.newRelativeForm.get(['birthDate'])?.value).getDate()}`
    const month = `${new Date(this.newRelativeForm.get(['birthDate'])?.value).getMonth() + 1 }`
    const year = `${new Date(this.newRelativeForm.get(['birthDate'])?.value).getFullYear() }`
    if(!!this.relativeToEdit){
      this.relativeToEdit.name = this.newRelativeForm.get(['name'])?.value;
      this.relativeToEdit.birthDate = `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year}`;
      this.relativeToEdit.relation = this.newRelativeForm.get(['relation'])?.value;
      this.relativeToEdit.gender = this.newRelativeForm.get(['gender'])?.value;
      this._auth.updateMyfamilyInfo(this.relativeToEdit).subscribe(res=>{
        console.log(res);
        if(res['status'] == ResStatus.CRUD){
          this.getMyRelative();
          this.newRelativeForm.reset();
          this.relativeToEdit = null;
          this.relativeOnEditMode = false;
        }
      })
    }
  }


  // addNewPerson(){
  //   // this.myRelative.push(this.newPerson)
  //   this.editMode.push(true)
  // }




  // saveRelative(relIndex){
  //   if(this.validateAddRelative(relIndex) == true){
  //     this.auth.editUser(this.currentUser).then(()=>{
  //       this.editMode[relIndex] = false;
  //     })  
  //   }
  // }


  // validateAddRelative(relIndex){

  //   let valid:boolean = true;

  //   if(this.currentUser.relatives && !this.currentUser.relatives[relIndex].name){
  //     valid = false;
  //     this.notify.openSnackbar('Name Is Required' , SnackBarState.Error)
  //   }

  //   if(this.currentUser.relatives && !this.currentUser.relatives[relIndex].birthDate){
  //     valid = false;
  //     this.notify.openSnackbar('Birthdate Is Required' , SnackBarState.Error)
  //   }

  //   if(this.currentUser.relatives && this.currentUser.relatives[relIndex].relation == Relationship.wife && this.currentUser.relatives[relIndex].gender == Gender.MALE){
  //     valid = false;
  //     this.notify.openSnackbar('gender Is Not Correct' , SnackBarState.Error)
  //   }

  //   if(this.currentUser.relatives && this.currentUser.relatives[relIndex].relation == Relationship.husband && this.currentUser.relatives[relIndex].gender == Gender.FEMALE){
  //     valid = false;
  //     this.notify.openSnackbar('gender Is Not Correct' , SnackBarState.Error)
  //   }

  //   return valid;

  // }
  
  // cancelEdit(relIndex){
  //   this.editMode[relIndex] = false;
  // }


}