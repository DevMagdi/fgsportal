"use strict";
(self["webpackChunkfgs_pm"] = self["webpackChunkfgs_pm"] || []).push([["default-src_app_components_admin_admin_admin-routing_module_ts"],{

/***/ 41015:
/*!*******************************************************************************************!*\
  !*** ./src/app/components/admin/admin-panel/admin-vacations/admin-vacations.component.ts ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AdminVacationsComponent": () => (/* binding */ AdminVacationsComponent)
/* harmony export */ });
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/auth.service */ 37556);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/tabs */ 9348);
/* harmony import */ var _pending_vacation_requests_pending_vacation_requests_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pending-vacation-requests/pending-vacation-requests.component */ 38414);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var _edit_leaves_edit_leaves_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit-leaves/edit-leaves.component */ 42531);







function AdminVacationsComponent_mat_tab_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-tab", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "app-edit-leaves");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
class AdminVacationsComponent {
    constructor(_auth) {
        this._auth = _auth;
        this.DepartmentEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_0__.Department;
    }
    ngOnInit() {
        this._auth.user.subscribe(user => {
            this.currentUser = user;
        });
    }
}
AdminVacationsComponent.ɵfac = function AdminVacationsComponent_Factory(t) { return new (t || AdminVacationsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService)); };
AdminVacationsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: AdminVacationsComponent, selectors: [["app-admin-vacations"]], decls: 7, vars: 1, consts: [[1, "container-fluid"], [1, "row"], [1, "col-md-12", "mt-3"], ["mat-align-tabs", "left", 1, "mx-3", "px-3"], ["label", "Pending Requests"], ["label", "Annual Leaves Controller", 4, "ngIf"], ["label", "Annual Leaves Controller"]], template: function AdminVacationsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "mat-tab-group", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "mat-tab", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](5, "app-pending-vacation-requests");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, AdminVacationsComponent_mat_tab_6_Template, 2, 0, "mat-tab", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !!ctx.currentUser && (ctx.currentUser.department == ctx.DepartmentEnum.MANAGEMENT || ctx.currentUser.department == ctx.DepartmentEnum.ADMINSTRATION));
    } }, directives: [_angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabGroup, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTab, _pending_vacation_requests_pending_vacation_requests_component__WEBPACK_IMPORTED_MODULE_2__.PendingVacationRequestsComponent, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _edit_leaves_edit_leaves_component__WEBPACK_IMPORTED_MODULE_3__.EditLeavesComponent], styles: [".mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {\n  background-color: #f4831f !important;\n}\n\n  .mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {\n  background-color: rgba(244, 131, 31, 0.5) !important;\n}\n\n\n\n  .mat-tab-list .mat-tab-labels .mat-tab-label {\n  color: #100f0f;\n  background-color: #fff;\n}\n\n  .mat-tab-list .mat-tab-labels .mat-tab-label-active {\n  color: #fff;\n  background-color: #f4831f !important;\n}\n\n\n\n  .mat-ink-bar {\n  background-color: #f4831f !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluLXZhY2F0aW9ucy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNJLG9DQUFBO0FBQUo7O0FBR0E7RUFDSSxvREFBQTtBQUFKOztBQUlBLGVBQUE7O0FBRUE7RUFDSSxjQUFBO0VBQ0Esc0JBQUE7QUFGSjs7QUFLQTtFQUNJLFdBQUE7RUFDQSxvQ0FBQTtBQUZKOztBQU1BLFlBQUE7O0FBRUM7RUFDRyxvQ0FBQTtBQUpKIiwiZmlsZSI6ImFkbWluLXZhY2F0aW9ucy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uLy4uL2NvbG9ycyc7XHJcbjo6bmctZGVlcCAubWF0LXNsaWRlLXRvZ2dsZS5tYXQtY2hlY2tlZDpub3QoLm1hdC1kaXNhYmxlZCkgLm1hdC1zbGlkZS10b2dnbGUtdGh1bWIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3IgIWltcG9ydGFudDtcclxufVxyXG5cclxuOjpuZy1kZWVwIC5tYXQtc2xpZGUtdG9nZ2xlLm1hdC1jaGVja2VkOm5vdCgubWF0LWRpc2FibGVkKSAubWF0LXNsaWRlLXRvZ2dsZS1iYXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgkY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yLCAkYWxwaGE6IDAuNSkgIWltcG9ydGFudDsgLy9yZ2JhKDU1LCAxNTUsIDE2NSwgMC40OSk7XHJcbn1cclxuXHJcblxyXG4vKiBhY3RpdmUgdGFiICovXHJcblxyXG46Om5nLWRlZXAgLm1hdC10YWItbGlzdCAubWF0LXRhYi1sYWJlbHMgLm1hdC10YWItbGFiZWwge1xyXG4gICAgY29sb3I6ICMxMDBmMGY7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xyXG59XHJcblxyXG46Om5nLWRlZXAgLm1hdC10YWItbGlzdCAubWF0LXRhYi1sYWJlbHMgLm1hdC10YWItbGFiZWwtYWN0aXZlIHtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3IgIWltcG9ydGFudDtcclxufVxyXG5cclxuXHJcbi8qIGluayBiYXIgKi9cclxuXHJcbiA6Om5nLWRlZXAgLm1hdC1pbmstYmFyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yICFpbXBvcnRhbnQ7IC8vIHZhcigtLXByaW1hcnktY29sb3IsICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yKSAhaW1wb3J0YW50O1xyXG59Il19 */"] });


/***/ }),

/***/ 42531:
/*!***************************************************************************************************!*\
  !*** ./src/app/components/admin/admin-panel/admin-vacations/edit-leaves/edit-leaves.component.ts ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EditLeavesComponent": () => (/* binding */ EditLeavesComponent)
/* harmony export */ });
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/firebase-service.service */ 97732);
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/auth.service */ 37556);
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ 81288);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/messaging.service */ 64271);
/* harmony import */ var primeng_card__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/card */ 96480);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 1707);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/form-field */ 65788);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/select */ 37007);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/core */ 32220);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! primeng/api */ 81122);















function EditLeavesComponent_mat_option_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "mat-option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const user_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpropertyInterpolate"]("value", user_r2.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](user_r2.username);
} }
function EditLeavesComponent_ng_template_15_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function EditLeavesComponent_ng_template_15_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r4); const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](); return ctx_r3.submitEdits(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, "Submit");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
const _c0 = function () { return { standalone: true }; };
class EditLeavesComponent {
    constructor(_db, _auth, modalService, _notify, _message) {
        this._db = _db;
        this._auth = _auth;
        this.modalService = modalService;
        this._notify = _notify;
        this._message = _message;
        // newPerBalance:number = 0;
        this.allUsers = [];
        this.selectedUser = [];
        this.setUsersVacation = 0;
    }
    ngOnInit() {
        const getCurrentUserSubscrib = this._auth.user.subscribe(user => {
            getCurrentUserSubscrib.unsubscribe();
            if (!!user) {
                this._auth.getAllUsers().subscribe(users => {
                    this.allUsers = users.filter(user => user.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department.TECHNICAL_TEAM);
                });
                this.checkForMonthlyUpdate();
            }
        });
    }
    checkForMonthlyUpdate() {
        const timeSubscrib = this._db.getCurrentTime().subscribe(date => {
            timeSubscrib.unsubscribe();
            if (!!date) {
                this.today = new Date(date);
                const currentMonth = `${new Date(date).getMonth() + 1}/${new Date(date).getFullYear()}`;
                // console.log(currentMonth);
                const checkSubscrib = this._db.getmonthlyAnnualLeaveAutoset(currentMonth).subscribe(dates => {
                    checkSubscrib.unsubscribe();
                    if (!!dates && dates.length > 0) {
                    }
                    else {
                        this.addNewMonthBalance();
                        this._db.monthlyAnnualLeaveAutoset(currentMonth);
                    }
                });
            }
        });
    }
    resetNewYearBalance() {
        this._notify.openDialog('Reset Annual Leaves Balance?', `Are you sure you want to Reset Annual Leaves Balance?`, false, '*By clicking yes all previous annual leave balance will be deleted', true, false).subscribe(response => {
            if (response) {
                const usersSubscription = this._auth.getAllUsers().subscribe((users) => {
                    usersSubscription.unsubscribe();
                    for (let i in users) {
                        if (users[i].department != src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department.MANAGEMENT) {
                            users[i].annualLeaveBalance = !!users[i].currentLeaveBalance ? users[i].currentLeaveBalance : 0;
                            this._auth.editUser(users[i]);
                        }
                    }
                    this._notify.openSnackbar('Annual Leave Balance Updated Successfully', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success, 3000);
                });
            }
            else {
                this._notify.openSnackbar('Operation Cancelled!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Info);
            }
        });
    }
    addNewMonthBalance() {
        const usersSubscription = this._auth.getAllUsers().subscribe((users) => {
            usersSubscription.unsubscribe();
            for (let i in users) {
                if (users[i].department != src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department.MANAGEMENT) {
                    if (!!users[i].monthlyBalance) {
                        if (this.today.getMonth() < 6) {
                            users[i].annualLeaveBalance = (users[i].annualLeaveBalance || 0) + (users[i].monthlyBalance || 0);
                            users[i].currentLeaveBalance = (users[i].currentLeaveBalance || 0) + (users[i].monthlyBalance || 0);
                            users[i].pendingBalance = (users[i].pendingBalance || 0) - (users[i].monthlyBalance || 0);
                            this._auth.editUser(users[i]);
                        }
                        else {
                            users[i].annualLeaveBalance = (users[i].annualLeaveBalance || 0) + (users[i].pendingBalance || 0);
                            users[i].currentLeaveBalance = (users[i].currentLeaveBalance || 0) + (users[i].pendingBalance || 0);
                            users[i].pendingBalance = (users[i].pendingBalance || 0) - (users[i].pendingBalance || 0);
                            this._auth.editUser(users[i]);
                        }
                    }
                }
            }
            this._notify.openSnackbar('Annual Leave Balance Updated Successfully', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success, 3000);
        });
        // this._notify.openDialog(
        //   'Add Month Balance?',
        //   `Are you sure you want to Add Month Balance?`,
        //   false,
        //   '',
        //   true,
        //   false).subscribe(response => {
        //     if (response) {
        //     } else {
        //       this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        //     }
        // });
    }
    submitEdits() {
        const isAll = this.selectedUser.find(user => user == 'all');
        if (!!isAll) {
            for (let i in this.allUsers) {
                this.allUsers[i].pendingBalance = this.setUsersVacation;
                this.allUsers[i].monthlyBalance = this.setUsersVacation / 12;
                this._auth.editUser(this.allUsers[i]);
            }
            this.setUsersVacation = 0;
            this.selectedUser = [];
            this._notify.openSnackbar("Balance Added Successfully", src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
        }
        else {
            for (let i in this.selectedUser) {
                const userToEdit = this.allUsers.find(user => user.key == this.selectedUser[i]);
                // console.log(userToEdit);
                if (!!userToEdit) {
                    userToEdit.pendingBalance = this.setUsersVacation;
                    userToEdit.monthlyBalance = this.setUsersVacation / 12;
                    this._auth.editUser(userToEdit);
                }
            }
            this.setUsersVacation = 0;
            this.selectedUser = [];
            this._notify.openSnackbar("Balance Added Successfully", src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
        }
    }
    editBalance() {
        this._auth.editUser(this.selectedUserObj);
        // console.log(this.selectedUserObj);
    }
}
EditLeavesComponent.ɵfac = function EditLeavesComponent_Factory(t) { return new (t || EditLeavesComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_2__.FirebaseServiceService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_3__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_7__.NgbModal), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_5__.MessagingService)); };
EditLeavesComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({ type: EditLeavesComponent, selectors: [["app-edit-leaves"]], decls: 16, vars: 5, consts: [[1, "container"], [1, "row", "m-3"], [1, "col-lg-6"], ["header", "Reset Year Balance"], [1, "btn", "mainBtn", "m-3", 3, "click"], [1, "col-6"], ["header", "Add Annual Pending Balance"], ["type", "number", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "inputLabel"], ["multiple", "", 1, "form-control", "customInput", 3, "ngModel", "ngModelOptions", "ngModelChange"], ["value", "all"], [3, "value", 4, "ngFor", "ngForOf"], ["pTemplate", "footer"], [3, "value"]], template: function EditLeavesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "p-card", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function EditLeavesComponent_Template_button_click_4_listener() { return ctx.resetNewYearBalance(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5, "Reset New Year Balance");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "p-card", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "input", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function EditLeavesComponent_Template_input_ngModelChange_8_listener($event) { return ctx.setUsersVacation = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](9, "mat-label", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](10, "Select Users");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "mat-select", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function EditLeavesComponent_Template_mat_select_ngModelChange_11_listener($event) { return ctx.selectedUser = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "mat-option", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](13, "All");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](14, EditLeavesComponent_mat_option_14_Template, 2, 2, "mat-option", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](15, EditLeavesComponent_ng_template_15_Template, 2, 0, "ng-template", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx.setUsersVacation);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx.selectedUser)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](4, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.allUsers);
    } }, directives: [primeng_card__WEBPACK_IMPORTED_MODULE_8__.Card, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatLabel, _angular_material_select__WEBPACK_IMPORTED_MODULE_11__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_12__.MatOption, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgForOf, primeng_api__WEBPACK_IMPORTED_MODULE_14__.PrimeTemplate], styles: [".mainBtn[_ngcontent-%COMP%] {\n  color: white;\n  background-color: #513982;\n}\n\n[_nghost-%COMP%]     .p-multiselect {\n  min-width: 15rem;\n}\n\n[_nghost-%COMP%]     .multiselect-custom-virtual-scroll .p-multiselect {\n  min-width: 20rem;\n}\n\n[_nghost-%COMP%]     .multiselect-custom .p-multiselect-label {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n\n[_nghost-%COMP%]     .multiselect-custom .country-item-value {\n  padding: 0.25rem 0.5rem;\n  border-radius: 3px;\n  display: inline-flex;\n  margin-right: 0.5rem;\n  background-color: #f4831f;\n  color: white;\n}\n\n[_nghost-%COMP%]     .multiselect-custom .country-item-value img.flag {\n  width: 17px;\n}\n\n[_nghost-%COMP%]     .multiselect-custom .country-placeholder {\n  padding: 0.25rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkaXQtbGVhdmVzLmNvbXBvbmVudC5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFxfY29sb3JzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFDSSxZQUFBO0VBQ0EseUJDSFk7QURHaEI7O0FBR0E7RUFDSSxnQkFBQTtBQUFKOztBQUdBO0VBQ0ksZ0JBQUE7QUFBSjs7QUFJSTtFQUNJLG9CQUFBO0VBQ0EsdUJBQUE7QUFEUjs7QUFHSTtFQUNJLHVCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLG9CQUFBO0VBQ0EseUJDdkJtQjtFRHdCbkIsWUFBQTtBQURSOztBQUVRO0VBQ0ksV0FBQTtBQUFaOztBQUdJO0VBQ0ksZ0JBQUE7QUFEUiIsImZpbGUiOiJlZGl0LWxlYXZlcy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uLy4uLy4uL2NvbG9ycyc7XHJcbi5tYWluQnRuIHtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxufVxyXG5cclxuOmhvc3QgOjpuZy1kZWVwIC5wLW11bHRpc2VsZWN0IHtcclxuICAgIG1pbi13aWR0aDogMTVyZW07XHJcbn1cclxuXHJcbjpob3N0IDo6bmctZGVlcCAubXVsdGlzZWxlY3QtY3VzdG9tLXZpcnR1YWwtc2Nyb2xsIC5wLW11bHRpc2VsZWN0IHtcclxuICAgIG1pbi13aWR0aDogMjByZW07XHJcbn1cclxuXHJcbjpob3N0IDo6bmctZGVlcCAubXVsdGlzZWxlY3QtY3VzdG9tIHtcclxuICAgIC5wLW11bHRpc2VsZWN0LWxhYmVsIHtcclxuICAgICAgICBwYWRkaW5nLXRvcDogLjI1cmVtO1xyXG4gICAgICAgIHBhZGRpbmctYm90dG9tOiAuMjVyZW07XHJcbiAgICB9XHJcbiAgICAuY291bnRyeS1pdGVtLXZhbHVlIHtcclxuICAgICAgICBwYWRkaW5nOiAuMjVyZW0gLjVyZW07XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogM3B4O1xyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogLjVyZW07XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIGltZy5mbGFnIHtcclxuICAgICAgICAgICAgd2lkdGg6IDE3cHg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLmNvdW50cnktcGxhY2Vob2xkZXIge1xyXG4gICAgICAgIHBhZGRpbmc6IDAuMjVyZW07XHJcbiAgICB9XHJcbn0iLCIkbWFpblRoZW1lQ29sb3I6IzUxMzk4MjtcclxuJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I6I2Y0ODMxZjsgLy8jRjU4MjFGO1xyXG4kc2Vjb25kRm9udENvbG9yOiM3MDcwNzA7XHJcbiR3aGl0ZUNvbG9yOiNmZmY7XHJcbiRtYWluRm9udEZhbWlseTogJ0NhaXJvJzsiXX0= */"] });


/***/ }),

/***/ 38414:
/*!*******************************************************************************************************************************!*\
  !*** ./src/app/components/admin/admin-panel/admin-vacations/pending-vacation-requests/pending-vacation-requests.component.ts ***!
  \*******************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PendingVacationRequestsComponent": () => (/* binding */ PendingVacationRequestsComponent)
/* harmony export */ });
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ 81288);
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_annualLeave__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/annualLeave */ 80148);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/animations */ 97175);
/* harmony import */ var src_app_components_dev_components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/components/dev/components/time-sheet/time-sheet.component */ 66171);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/environments/environment */ 92340);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/firebase-service.service */ 97732);
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/auth.service */ 37556);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/services/messaging.service */ 64271);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/button */ 70781);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/card */ 42118);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/forms */ 1707);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/router */ 71258);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/divider */ 1124);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/tooltip */ 50298);























function PendingVacationRequestsComponent_div_0_div_1_mat_card_2_Template(rf, ctx) { if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "mat-card", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "Please Enter New Permission Balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](4, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](5, "Permission");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](6, "input", 12, 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_div_0_div_1_mat_card_2_Template_input_ngModelChange_6_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r10); const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3); return ctx_r9.newPerBalance = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](8, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](9, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](10, "Bereavement");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](11, "input", 12, 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_div_0_div_1_mat_card_2_Template_input_ngModelChange_11_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r10); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3); return ctx_r11.bereavement = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](13, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](14, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](15, "Marriage");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](16, "input", 12, 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_div_0_div_1_mat_card_2_Template_input_ngModelChange_16_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r10); const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3); return ctx_r12.marriage = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](18, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_div_0_div_1_mat_card_2_Template_button_click_18_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r10); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3); return ctx_r13.resetUserspermissons(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](19, "Submit");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("@openClose", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngModel", ctx_r5.newPerBalance);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngModel", ctx_r5.bereavement);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngModel", ctx_r5.marriage);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("disabled", ctx_r5.newPerBalance == 0);
} }
function PendingVacationRequestsComponent_div_0_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](2, PendingVacationRequestsComponent_div_0_div_1_mat_card_2_Template, 20, 5, "mat-card", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_div_0_div_1_Template_button_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r15); const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2); return ctx_r14.openResetPermissionPanel(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r3.isResetPanelOpened);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r3.isResetPanelOpened ? "close" : "Edit Permission Balance");
} }
function PendingVacationRequestsComponent_div_0_div_15_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](leave_r16.from);
} }
function PendingVacationRequestsComponent_div_0_div_15_div_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](2, 1, leave_r16.from, "dd/MM/yyyy"));
} }
function PendingVacationRequestsComponent_div_0_div_15_div_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](leave_r16.to);
} }
function PendingVacationRequestsComponent_div_0_div_15_div_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](2, 1, leave_r16.to, "dd/MM/yyyy"));
} }
function PendingVacationRequestsComponent_div_0_div_15_a_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "a", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1, "Attach");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit;
    const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpropertyInterpolate2"]("href", "", ctx_r21.newServerApi, "", leave_r16.attach, "", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵsanitizeUrl"]);
} }
function PendingVacationRequestsComponent_div_0_div_15_p_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1, "\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} }
function PendingVacationRequestsComponent_div_0_div_15_div_12_Template(rf, ctx) { if (rf & 1) {
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_div_0_div_15_div_12_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r32); const leave_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit; const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2); const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵreference"](2); return ctx_r31.open(_r1, leave_r16, true); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "Approve");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} }
function PendingVacationRequestsComponent_div_0_div_15_div_13_Template(rf, ctx) { if (rf & 1) {
    const _r35 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_div_0_div_15_div_13_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r35); const leave_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit; const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2); const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵreference"](2); return ctx_r34.open(_r1, leave_r16, false); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "Reject");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} }
function PendingVacationRequestsComponent_div_0_div_15_div_14_Template(rf, ctx) { if (rf & 1) {
    const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_div_0_div_15_div_14_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r38); const leave_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit; const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2); const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵreference"](2); return ctx_r37.openForAdmin(_r1, leave_r16); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "Review");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} }
const _c0 = function (a1) { return ["/user/", a1]; };
function PendingVacationRequestsComponent_div_0_div_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](5, PendingVacationRequestsComponent_div_0_div_15_div_5_Template, 2, 1, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](6, PendingVacationRequestsComponent_div_0_div_15_div_6_Template, 3, 4, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](7, PendingVacationRequestsComponent_div_0_div_15_div_7_Template, 2, 1, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](8, PendingVacationRequestsComponent_div_0_div_15_div_8_Template, 3, 4, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](9, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](10, PendingVacationRequestsComponent_div_0_div_15_a_10_Template, 2, 2, "a", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](11, PendingVacationRequestsComponent_div_0_div_15_p_11_Template, 2, 0, "p", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](12, PendingVacationRequestsComponent_div_0_div_15_div_12_Template, 3, 0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](13, PendingVacationRequestsComponent_div_0_div_15_div_13_Template, 3, 0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](14, PendingVacationRequestsComponent_div_0_div_15_div_14_Template, 3, 0, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r16 = ctx.$implicit;
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](12, _c0, leave_r16.empKey));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](leave_r16.empName);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](leave_r16.leaveType_name);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", leave_r16.leaveType == ctx_r4.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", leave_r16.leaveType != ctx_r4.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", leave_r16.leaveType == ctx_r4.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", leave_r16.leaveType != ctx_r4.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !!leave_r16.attach);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !leave_r16.attach);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !!ctx_r4.currenUser && (ctx_r4.currenUser.department == ctx_r4.DepartmentEnum.MANAGEMENT || ctx_r4.currenUser.accPosition == ctx_r4.accPosistionEnum.MANAGER));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !!ctx_r4.currenUser && (ctx_r4.currenUser.department == ctx_r4.DepartmentEnum.MANAGEMENT || ctx_r4.currenUser.accPosition == ctx_r4.accPosistionEnum.MANAGER));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !!ctx_r4.currenUser && ctx_r4.currenUser.department == ctx_r4.DepartmentEnum.ADMINSTRATION);
} }
function PendingVacationRequestsComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](1, PendingVacationRequestsComponent_div_0_div_1_Template, 5, 2, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4, "Employee Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](6, "Leave Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](7, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](8, "From");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](9, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](10, "To");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](11, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](12, "Attach");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](13, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](14, "Approve/Reject");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](15, PendingVacationRequestsComponent_div_0_div_15_Template, 15, 14, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r0.currenUser.department == ctx_r0.DepartmentEnum.MANAGEMENT || ctx_r0.currenUser.department == ctx_r0.DepartmentEnum.ADMINSTRATION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngForOf", ctx_r0.leavesToApprove.slice().reverse());
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_span_20_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r42.leaveToReview.from, " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_span_21_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](2, 1, ctx_r43.leaveToReview.from, "dd/MM/yyyy"), " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_span_26_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r44.leaveToReview.to, " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_span_27_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](2, 1, ctx_r45.leaveToReview.to, "dd/MM/yyyy"), " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_35_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "Attach : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](4, "a", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](5, "img", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpropertyInterpolate2"]("href", "", ctx_r46.newServerApi, "", ctx_r46.leaveToReview.attach, "", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpropertyInterpolate2"]("src", "", ctx_r46.newServerApi, "", ctx_r46.leaveToReview.attach, "", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵsanitizeUrl"]);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_span_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r49.calculateLeaveDuration(), " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_span_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](3, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](2, 2, ctx_r50.math.floor(ctx_r50.calculatePermissionDuration() / 60), "2.0-0"), ":", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](3, 5, ctx_r50.calculatePermissionDuration() - ctx_r50.math.floor(ctx_r50.calculatePermissionDuration() / 60) * 60, "2.0-0"), " hh:mm ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_option_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "option", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const admin_r54 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("value", admin_r54.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](admin_r54.username);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_Template(rf, ctx) { if (rf & 1) {
    const _r56 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "label", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](3, "Assign To HR");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](4, "select", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_Template_select_ngModelChange_4_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r56); const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4); return ctx_r55.leaveToReview.hrToApproveKey = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](5, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_option_5_Template, 2, 2, "option", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](6, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](7, "label", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](8, "Comment (Optional)");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](9, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](10, "input", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_Template_input_ngModelChange_10_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r56); const ctx_r57 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4); return ctx_r57.leaveToReview.managerDissisionComment = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r51 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngModel", ctx_r51.leaveToReview.hrToApproveKey);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngForOf", ctx_r51.admins);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngModel", ctx_r51.leaveToReview.managerDissisionComment);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_9_Template(rf, ctx) { if (rf & 1) {
    const _r59 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "label", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](3, "Rejection Reason");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "input", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_9_Template_input_ngModelChange_5_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r59); const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4); return ctx_r58.leaveToReview.managerDissisionComment = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngModel", ctx_r52.leaveToReview.managerDissisionComment);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_Template(rf, ctx) { if (rf & 1) {
    const _r61 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](5, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](6, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_span_6_Template, 2, 1, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](7, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_span_7_Template, 4, 8, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](8, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_Template, 11, 3, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](9, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_9_Template, 6, 1, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](10, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](11, "button", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_Template_button_click_11_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r61); const modal_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit; const ctx_r60 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](); ctx_r60.managerDissition(ctx_r60.leaveToReview); return modal_r40.close("Save click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](12, "Submit");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"]("", ctx_r47.leaveToReview.leaveType == ctx_r47.leaveTypeEnum.PERMISSION ? "Permission" : "Leave", " Duration : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r47.leaveToReview.leaveType != ctx_r47.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r47.leaveToReview.leaveType == ctx_r47.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r47.dissision == true);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r47.dissision == false);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("disabled", !!ctx_r47.dissision && !ctx_r47.leaveToReview.hrToApproveKey || !ctx_r47.dissision && !ctx_r47.leaveToReview.managerDissisionComment);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "Manager comment : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](4, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r63.leaveToReview.managerDissisionComment, " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](3, "User Annual Balance : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](7, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](8, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](9, "User Current Balance : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](10, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](11, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r64 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r64.userAnnualLeaveBalance, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r64.userLeaveBalance, " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](3, "Annual permission Balance ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](7, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](8, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](9, "Current Permission Balance ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](10, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](11, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](13, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](14, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r65 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r65.userAnnualPermissionBalance, " Hours ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](13, 3, ctx_r65.math.floor(ctx_r65.userPermissionBalance / 60), "2.0-0"), ":", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](14, 6, ctx_r65.userPermissionBalance - ctx_r65.math.floor(ctx_r65.userPermissionBalance / 60) * 60, "2.0-0"), " hh:mm ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_span_17_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r66 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r66.calculateLeaveDuration(), " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_span_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](3, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r67 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](2, 2, ctx_r67.math.floor(ctx_r67.calculatePermissionDuration() / 60), "2.0-0"), ":", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](3, 5, ctx_r67.calculatePermissionDuration() - ctx_r67.math.floor(ctx_r67.calculatePermissionDuration() / 60) * 60, "2.0-0"), " hh:mm ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_Template(rf, ctx) { if (rf & 1) {
    const _r69 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4, "Manager Approved : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](5, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](6, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](8, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_8_Template, 6, 1, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](9, "mat-divider");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](10, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_10_Template, 13, 2, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](11, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_11_Template, 15, 9, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](12, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](13, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](14, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](16, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](17, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_span_17_Template, 2, 1, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](18, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_span_18_Template, 4, 8, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](19, "mat-divider");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](20, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](21, "label", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](22, "Rejection Reason (optional On Approval Only)");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](23, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](24, "input", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_Template_input_ngModelChange_24_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r69); const ctx_r68 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3); return ctx_r68.leaveToReview.hrDissisionComment = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](25, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](26, "button", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_Template_button_click_26_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r69); const modal_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit; const ctx_r70 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](); ctx_r70.hrAction(ctx_r70.leaveToReview, true); return modal_r40.close("Save click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](27, "Approve");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](28, "button", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_Template_button_click_28_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r69); const modal_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit; const ctx_r72 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](); ctx_r72.hrAction(ctx_r72.leaveToReview, false); return modal_r40.close("Save click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](29, "Reject");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r48.leaveToReview.managerDissisionName, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r48.leaveToReview.managerDissisionComment);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r48.leaveToReview.leaveType != ctx_r48.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r48.leaveToReview.leaveType == ctx_r48.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"]("", ctx_r48.leaveToReview.leaveType == ctx_r48.leaveTypeEnum.PERMISSION ? "Permission" : "Leave", " Duration : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r48.leaveToReview.leaveType != ctx_r48.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r48.leaveToReview.leaveType == ctx_r48.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngModel", ctx_r48.leaveToReview.hrDissisionComment);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("disabled", !ctx_r48.leaveToReview.hrDissisionComment);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](4, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](5, "Request BY : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](6, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](7, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](9, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](10, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](11, "Leave Type : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](12, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](13, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](15, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](16, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](17, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](18, "From : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](19, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](20, PendingVacationRequestsComponent_ng_template_1_div_6_span_20_Template, 2, 1, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](21, PendingVacationRequestsComponent_ng_template_1_div_6_span_21_Template, 3, 4, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](22, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](23, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](24, "To : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](25, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](26, PendingVacationRequestsComponent_ng_template_1_div_6_span_26_Template, 2, 1, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](27, PendingVacationRequestsComponent_ng_template_1_div_6_span_27_Template, 3, 4, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](28, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](29, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](30, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](31, "Reason : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](32, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](33, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](35, PendingVacationRequestsComponent_ng_template_1_div_6_div_35_Template, 6, 4, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](36, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_Template, 13, 6, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](37, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_Template, 30, 9, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r41.leaveToReview.empName, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r41.leaveToReview.leaveType_name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r41.leaveToReview.leaveType == ctx_r41.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r41.leaveToReview.leaveType != ctx_r41.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r41.leaveToReview.leaveType == ctx_r41.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r41.leaveToReview.leaveType != ctx_r41.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r41.leaveToReview.reason, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !!ctx_r41.leaveToReview.attach);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !!ctx_r41.currenUser && (ctx_r41.currenUser.department == ctx_r41.DepartmentEnum.MANAGEMENT || ctx_r41.currenUser.accPosition == ctx_r41.accPosistionEnum.MANAGER));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !!ctx_r41.currenUser && ctx_r41.currenUser.department == ctx_r41.DepartmentEnum.ADMINSTRATION);
} }
function PendingVacationRequestsComponent_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    const _r75 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "h4", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "Leave Request Review");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "button", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_ng_template_1_Template_button_click_3_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r75); const modal_r40 = restoredCtx.$implicit; return modal_r40.dismiss("Cross click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](4, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](5, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](6, PendingVacationRequestsComponent_ng_template_1_div_6_Template, 38, 10, "div", 30);
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.leaveToReview);
} }
class PendingVacationRequestsComponent {
    constructor(db, auth, modalService, _notify, _message, _db, _auth) {
        this.db = db;
        this.auth = auth;
        this.modalService = modalService;
        this._notify = _notify;
        this._message = _message;
        this._db = _db;
        this._auth = _auth;
        this.leaveTypeEnum = src_app_interfaces_annualLeave__WEBPACK_IMPORTED_MODULE_1__.LeaveType;
        this.leavesToApprove = [];
        this.admins = [];
        this.math = Math;
        this.newPerBalance = 0;
        this.bereavement = 0;
        this.marriage = 0;
        this.DepartmentEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department;
        this.accPosistionEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.AccountPositions;
        this.leaveStatusEnum = src_app_interfaces_annualLeave__WEBPACK_IMPORTED_MODULE_1__.leaveFinalStatus;
        this.newServerApi = src_environments_environment__WEBPACK_IMPORTED_MODULE_5__.environment.newServerApi;
    }
    ngOnInit() {
        this._auth.user.subscribe((user) => {
            this.currenUser = user;
            this.getMyRequests();
            if (this.currenUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department.MANAGEMENT) {
                this._auth.getUserByFilter(src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department.ADMINSTRATION, src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.AccountRoles.HUMAN_RESOURCE).subscribe(res => {
                    if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__.ResStatus.CRUD) {
                        this.admins = res['data'];
                    }
                });
            }
        });
        // const allUsers:Subscription = this.auth.getAllUsers().subscribe(users=>{
        //   allUsers.unsubscribe()
        //   const newusers = users.filter(u=>u.accType == AccountType.BUSINESS_ANALYSIS || u.accType == AccountType.DEVLOPER)
        //   console.log(newusers);
        //   newusers.map(user=>{
        //     const newLeave:AnnualLeave = {
        //       empKey:user.key||'',
        //       empName:user.username,
        //       empImgUrl:user.photoURL || '',
        //       from:'5/5/2022',
        //       to:'5/5/2022',
        //       leaveType:LeaveType.AnnualLeave,
        //       reason:'Eid El Fitr',
        //       approvalCycle:annualLeaveApprovalCycle.Finished,
        //       managerDissision:true,
        //       managerDissisionKey:'jjuyajnYK6clqnD7PIMEuQesyiy2',
        //       managerDissisionName:'FGS',
        //       managerDissisionAt:new Date().toLocaleString(),
        //       hrDissision:true,
        //       hrDissisionKey:this.currenUser.key,
        //       hrDissisionName:this.currenUser.username,
        //       hrDissisionAt:new Date().toLocaleString(),
        //       finalStatus:finalStatus.Approved,
        //       createdAt:`${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}, ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
        //     }
        //     this.db.annualLeaveFinishCycle(newLeave)
        //   })
        // })
    }
    getMyRequests() {
        if (this.currenUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department.MANAGEMENT) {
            this._db.getManagerPendingAnnualLeavesToApprove().subscribe(res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__.ResStatus.CRUD) {
                    this.leavesToApprove = res['data'];
                }
                else {
                    this.leavesToApprove = [];
                }
            }, err => {
                this.leavesToApprove = [];
                console.log(err);
            });
        }
        else {
            this._db.getHRPendingAnnualLeavesToApprove().subscribe(res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__.ResStatus.CRUD) {
                    this.leavesToApprove = res['data'];
                }
                else {
                    this.leavesToApprove = [];
                }
            }, err => {
                this.leavesToApprove = [];
                console.log(err);
            });
        }
    }
    // managerApprove(leave:AnnualLeave){
    //   leave.managerDissision = true;
    //   leave.managerDissisionKey = this.currenUser.key;
    //   leave.managerDissisionName = this.currenUser.username;
    //   leave.managerDissisionAt = new Date().toLocaleString();
    //   leave.hrToApproveName = this.admins.find(admin=> admin.key == leave.hrToApproveKey)?.username;
    //   leave.approvalCycle = annualLeaveApprovalCycle.PendingOnHR;
    //   this.db.annualLeaveUpdate(leave).then(()=>{
    //       const noti:Notifying ={
    //         receverKey: leave.hrToApproveKey || '',
    //         receverName:leave.hrToApproveName || '',
    //         senderKey: leave.managerDissisionKey || '',
    //         senderName:leave.managerDissisionName || '',
    //         title:'Vacation Request',
    //         body : `${leave.managerDissisionName} Has Approved Vacation Request From ${leave.empName} And Assigned To You`,
    //         redirection:`/admin-panel/pendingvacations`,
    //         senderImg : leave.empImgUrl || ""
    //       }
    //       this._message.createnotification(noti).then(()=>{
    //         this._notify.openSnackbar(`success` , SnackBarState.Success)
    //       })
    //     }
    //   )
    // }
    // managerReject(leave:AnnualLeave){
    //   leave.managerDissision = false;
    //   leave.managerDissisionKey = this.currenUser.key;
    //   leave.managerDissisionName = this.currenUser.username;
    //   leave.managerDissisionAt = new Date().toLocaleString();
    //   // leave.managerDissisionComment = '' ;
    //   leave.finalStatus = leaveFinalStatus.rejected;
    //   this.db.annualLeaveFinishCycle(leave).then(()=>{
    //       this._notify.openSnackbar(`success` , SnackBarState.Success)
    //     }
    //   )
    // }
    managerDissition(lastDissition) {
        if (this.dissision == false) {
            lastDissition.finalStatus = src_app_interfaces_annualLeave__WEBPACK_IMPORTED_MODULE_1__.leaveFinalStatus.rejected;
        }
        else if (this.dissision == true) {
            lastDissition.finalStatus = src_app_interfaces_annualLeave__WEBPACK_IMPORTED_MODULE_1__.leaveFinalStatus.PendingOnHR;
        }
        // if(!lastDissition.managerDissisionComment){
        //   lastDissition.managerDissisionComment = '';
        // }
        this._db.managerActionAnnualLeave(lastDissition).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__.ResStatus.CRUD) {
                this.getMyRequests();
            }
            else {
                console.log(res);
            }
        }, err => {
            console.log(err);
            if (err['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__.ResStatus.ValidationError) {
                this._notify.openSnackbar(`${err['error']['data']['message']}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
            }
            else {
                this._notify.openSnackbar(`Error , Please Contact System Administrator`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
            }
        });
    }
    // managerDissitionOLD(lastDissition:AnnualLeave){
    //   if(this.dissision == false){
    //     this.managerReject(lastDissition)
    //   }else if(this.dissision == true){
    //     this.managerApprove(lastDissition)
    //   }
    // }
    getUserLeavesBalance() {
        var _a;
        const userSubscription = this.auth.getUserByKey(((_a = this.leaveToReview) === null || _a === void 0 ? void 0 : _a.empKey) || '').subscribe((user) => {
            userSubscription.unsubscribe();
            this.empData = user;
            this.userLeaveBalance = user.currentLeaveBalance ? user.currentLeaveBalance : 0;
            this.userAnnualLeaveBalance = user.annualLeaveBalance ? user.annualLeaveBalance : 0;
            this.userPermissionBalance = user.currentPermissionBalance ? user.currentPermissionBalance : 0;
            this.userAnnualPermissionBalance = user.annualPermissionBalance ? user.annualPermissionBalance : 0;
        });
    }
    calculateLeaveDuration(leave) {
        if (!!leave) {
            let duration = 0;
            let from = new Date(leave.from);
            let to = new Date(leave.to);
            while (from <= to) {
                if (from.getDay() != src_app_components_dev_components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_3__.Days.Friday && from.getDay() != src_app_components_dev_components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_3__.Days.Saturday) {
                    duration++;
                }
                from = new Date(from.setDate(from.getDate() + 1));
            }
            return duration;
        }
        else if (!!this.leaveToReview) {
            let duration = 0;
            let from = new Date(this.leaveToReview.from);
            let to = new Date(this.leaveToReview.to);
            while (from <= to) {
                if (from.getDay() != src_app_components_dev_components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_3__.Days.Friday && from.getDay() != src_app_components_dev_components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_3__.Days.Saturday) {
                    duration++;
                }
                from = new Date(from.setDate(from.getDate() + 1));
            }
            return duration;
        }
        else {
            return 0;
        }
    }
    calculatePermissionDuration() {
        if (!!this.leaveToReview) {
            let duration = 0;
            let from = (new Date(this.leaveToReview.from).getHours() * 60) + new Date(this.leaveToReview.from).getMinutes();
            let to = (new Date(this.leaveToReview.to).getHours() * 60) + new Date(this.leaveToReview.to).getMinutes();
            duration = to - from;
            return duration;
        }
        else {
            return 0;
        }
    }
    hrAction(leave, isApproved) {
        if (isApproved == false) {
            leave.finalStatus = src_app_interfaces_annualLeave__WEBPACK_IMPORTED_MODULE_1__.leaveFinalStatus.rejected;
        }
        else if (isApproved == true) {
            leave.finalStatus = src_app_interfaces_annualLeave__WEBPACK_IMPORTED_MODULE_1__.leaveFinalStatus.Approved;
        }
        this._db.hrActionAnnualLeave(leave).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__.ResStatus.CRUD) {
                this.getMyRequests();
            }
            else {
                console.log(res);
            }
        }, err => {
            console.log(err);
            if (err['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__.ResStatus.ValidationError) {
                this._notify.openSnackbar(`${err['error']['data']['message']}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
            }
            else {
                this._notify.openSnackbar(`Error , Please Contact System Administrator`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
            }
        });
    }
    // hrApprove(leave:AnnualLeave){
    //   leave.hrDissision = true;
    //   leave.hrDissisionAt = new Date().toLocaleString();
    //   leave.hrDissisionKey = this.currenUser.key;
    //   leave.hrDissisionName = this.currenUser.username;
    //   leave.approvalCycle = annualLeaveApprovalCycle.Finished;
    //   leave.finalStatus = leaveFinalStatus.Approved;
    //   this.db.annualLeaveFinishCycle(leave).then(()=>{
    //     const getUserSub:Subscription = this.auth.getUserByKey(leave.empKey).subscribe(user=>{
    //       getUserSub.unsubscribe()
    //       console.log("User Balance => ",user.currentLeaveBalance);
    //       console.log("current Duration => ",this.calculateLeaveDuration(leave));
    //       if(!!user.currentLeaveBalance){
    //         user.currentLeaveBalance = user.currentLeaveBalance - this.calculateLeaveDuration(leave)
    //       }else{
    //         user.currentLeaveBalance = 0 - this.calculateLeaveDuration(leave)
    //       }
    //       console.log("User Balance After Calc => ",user.currentLeaveBalance);
    //       this.auth.editUser(user)
    //     })
    //     if(!!this.empData){
    //       if(this.empData.department === Department.TECHNICAL_TEAM){
    //         this.createDevDailytask(leave)
    //       }
    //     }
    //   })
    // }
    // createDevDailytask(leave:AnnualLeave){
    //   const dateArr:Date[] = [];    
    //   let start = new Date(leave.from)    
    //   let end = new Date(leave.to)
    //   while(start <= end){
    //     if(start.getDay() != Days.Friday && start.getDay() != Days.Saturday){
    //       dateArr.push(new Date(start))
    //     }
    //     start = new Date(start.setDate(start.getDate() + 1) ) 
    //   }
    //   for(let i in dateArr){
    //     const devDailyReport:DevDailyReport = {
    //       devID : leave.empKey,
    //       devName : leave.empName,
    //       durationByHours : leave.leaveType == LeaveType.PERMISSION ? this.calculatePermissionDuration() / 60 : 8,
    //       reportDate :`${dateArr[i].getMonth()+1}/${dateArr[i].getDate()}/${dateArr[i].getFullYear()}`,
    //       time_activity: leave.leaveType == LeaveType.UNPAID ? Activity.UNPAID_VACATION : Activity.OFFICIAL_VACATION ,
    //       approved : true,
    //       approvedByKey : leave.managerDissisionName ,
    //       approvedByName : leave.managerDissisionName ,
    //       details : leave.reason,
    //       createdAt : leave.hrDissisionAt,
    //       preApprovedDuration:0
    //     }      
    //     this.db.moveToDevDailyReport(devDailyReport)
    //   }
    // }
    // hrRejection(leave:AnnualLeave){
    //   leave.hrDissision = false;
    //   leave.hrDissisionAt = new Date().toLocaleString();
    //   leave.hrDissisionKey = this.currenUser.key;
    //   leave.hrDissisionName = this.currenUser.username;
    //   leave.approvalCycle = annualLeaveApprovalCycle.Finished;
    //   leave.finalStatus = leaveFinalStatus.rejected;
    //   this.db.annualLeaveFinishCycle(leave)
    // }
    open(content, annualLeave, approve) {
        this.leaveToReview = annualLeave;
        this.dissision = approve;
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    openForAdmin(content, annualLeave) {
        this._db.getUserLeaveBalance(annualLeave.empKey).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__.ResStatus.CRUD) {
                this.userLeaveBalance = res['data']['currentLeaveBalance'];
                this.userAnnualLeaveBalance = res['data']['annualLeaveBalance'];
                this.userPermissionBalance = res['data']['currentPermissionBalance'];
                this.userAnnualPermissionBalance = res['data']['annualPermissionBalance'];
            }
            else {
                this.userLeaveBalance = 0;
                this.userAnnualLeaveBalance = 0;
                this.userPermissionBalance = 0;
                this.userAnnualPermissionBalance = 0;
            }
        }, err => {
            console.log(err);
            this.userLeaveBalance = 0;
            this.userAnnualLeaveBalance = 0;
            this.userPermissionBalance = 0;
            this.userAnnualPermissionBalance = 0;
        });
        this.leaveToReview = annualLeave;
        this.getUserLeavesBalance();
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    getDismissReason(reason) {
        this.leaveToReview = undefined;
        if (reason === _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_13__.ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_13__.ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        }
        else {
            return `with: ${reason}`;
        }
    }
    openResetPermissionPanel() {
        if (!this.isResetPanelOpened) {
            this._db.getPermissionAndLeavesConfig().subscribe(res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__.ResStatus.CRUD) {
                    this.newPerBalance = res['data']['monthly_balance'];
                    this.bereavement = res['data']['bereavement'];
                    this.marriage = res['data']['marriage'];
                }
            });
        }
        else {
            this.newPerBalance = 0;
            this.bereavement = 0;
            this.marriage = 0;
        }
        this.isResetPanelOpened = !this.isResetPanelOpened;
    }
    resetUserspermissons() {
        const newPer = {
            permission_balance_id: '1',
            monthly_balance: this.newPerBalance,
            bereavement: this.bereavement,
            marriage: this.marriage
        };
        this._db.resetUserspermissons(newPer).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__.ResStatus.CRUD) {
                this._notify.openSnackbar('Monthly Permission Updated Successfully', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success, 3000);
                this.newPerBalance = 0;
                this.bereavement = 0;
                this.marriage = 0;
                this.openResetPermissionPanel();
            }
            else {
                this._notify.openSnackbar('Error', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error, 3000);
            }
        }, err => {
            console.log(err);
            this._notify.openSnackbar('Error', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error, 3000);
        });
        // const usersSubscription:Subscription = this.auth.getAllUsers().subscribe(
        //   (users)=>{
        //     usersSubscription.unsubscribe();
        //     for (let i in users){
        //       if(users[i].department != Department.MANAGEMENT){
        //         users[i].annualPermissionBalance = this.newPerBalance;
        //         this.auth.editUser(users[i]);
        //       }
        //     }
        //     this._notify.openSnackbar('Monthly Permission Updated Successfully' , SnackBarState.Success , 3000)
        //     this.newPerBalance = 0;
        //     this.openResetPermissionPanel();
        //   }
        // )
    }
}
PendingVacationRequestsComponent.ɵfac = function PendingVacationRequestsComponent_Factory(t) { return new (t || PendingVacationRequestsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_6__.FirebaseServiceService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_7__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_13__.NgbModal), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_8__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_9__.MessagingService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_10__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_11__.AuthApiService)); };
PendingVacationRequestsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineComponent"]({ type: PendingVacationRequestsComponent, selectors: [["app-pending-vacation-requests"]], decls: 3, vars: 1, consts: [["class", "container", 4, "ngIf"], ["mymodal", ""], [1, "container"], ["class", "row my-3", 4, "ngIf"], [1, "row", "header", "p-3"], [1, "col-md-2"], ["class", "row p-3 my-1 body", 4, "ngFor", "ngForOf"], [1, "row", "my-3"], [1, "col-12"], ["class", "entry-card", 4, "ngIf"], ["mat-stroked-button", "", "color", "primary", 1, "m-2", 3, "click"], [1, "entry-card"], ["type", "number", "id", "perNum", "placeholder", "Ex.3", 1, "form-control", 3, "ngModel", "ngModelChange"], ["perNum", ""], ["type", "submit", "mat-raised-button", "", 1, "my-3", 3, "disabled", "click"], [1, "row", "p-3", "my-1", "body"], [1, "col-md-2", 2, "cursor", "pointer", 3, "routerLink"], ["class", "col-md-2", 4, "ngIf"], ["target", "_blank", 3, "href", 4, "ngIf"], [4, "ngIf"], ["class", "col-md-1", 4, "ngIf"], ["target", "_blank", 3, "href"], [1, "col-md-1"], [1, "btn", "btn-outline-info", 3, "click"], [1, "btn", "btn-outline-danger", 3, "click"], [1, "btn", "btn-outline-success", 3, "click"], [1, "modal-header"], ["id", "modal-basic-title", 1, "modal-title"], ["type", "button", "aria-label", "Close", 1, "close", 3, "click"], ["aria-hidden", "true"], ["class", "modal-body", 4, "ngIf"], [1, "modal-body"], [1, "container-fluid"], [1, "row"], [1, "col-md-6"], [1, "modalInfo", "pl-2"], ["class", "modalInfo pl-2", 4, "ngIf"], ["class", "col-md-6", 4, "ngIf"], ["class", "manager", 4, "ngIf"], ["class", "admin", 4, "ngIf"], ["alt", "Request Attach", "width", "100px", "height", "100px", 3, "src"], [1, "manager"], ["class", "row", 4, "ngIf"], [1, "modal-footer"], ["type", "submit", 1, "btn", "btn-info", 3, "disabled", "click"], [1, "col-md-12"], ["for", ""], ["name", "adminKey", "id", "adminKey", 1, "form-control", 3, "ngModel", "ngModelChange"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "text", 1, "form-control", 3, "ngModel", "ngModelChange"], [3, "value"], [1, "admin"], ["type", "submit", 1, "btn", "btn-info", 3, "click"], ["type", "submit", "matTooltip", "Please Add A rejection Reason", 1, "btn", "btn-outline-danger", 3, "disabled", "click"]], template: function PendingVacationRequestsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](0, PendingVacationRequestsComponent_div_0_Template, 16, 2, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](1, PendingVacationRequestsComponent_ng_template_1_Template, 7, 1, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplateRefExtractor"]);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !!ctx.currenUser);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgForOf, _angular_material_button__WEBPACK_IMPORTED_MODULE_15__.MatButton, _angular_material_card__WEBPACK_IMPORTED_MODULE_16__.MatCard, _angular_forms__WEBPACK_IMPORTED_MODULE_17__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_17__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_17__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_17__.NgModel, _angular_router__WEBPACK_IMPORTED_MODULE_18__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_17__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_17__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_17__["ɵNgSelectMultipleOption"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_19__.MatDivider, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_20__.MatTooltip], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.DatePipe, _angular_common__WEBPACK_IMPORTED_MODULE_14__.DecimalPipe], styles: [".header[_ngcontent-%COMP%] {\n  font-weight: bold;\n  font-size: large;\n  border: solid 1px #a19ea0;\n  text-align: left;\n}\n\n.body[_ngcontent-%COMP%] {\n  border: solid 1px #a19ea0;\n  text-align: left;\n}\n\n.modal-body[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n\n.modal-body[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-weight: 400;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBlbmRpbmctdmFjYXRpb24tcmVxdWVzdHMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxpQkFBQTtFQUNBLGdCQUFBO0VBQ0EseUJBQUE7RUFDQSxnQkFBQTtBQUNKOztBQUVBO0VBQ0kseUJBQUE7RUFDQSxnQkFBQTtBQUNKOztBQUdJO0VBQ0ksZ0JBQUE7QUFBUjs7QUFDUTtFQUNJLGdCQUFBO0FBQ1oiLCJmaWxlIjoicGVuZGluZy12YWNhdGlvbi1yZXF1ZXN0cy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5oZWFkZXIge1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBmb250LXNpemU6IGxhcmdlO1xyXG4gICAgYm9yZGVyOiBzb2xpZCAxcHggI2ExOWVhMDtcclxuICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbn1cclxuXHJcbi5ib2R5IHtcclxuICAgIGJvcmRlcjogc29saWQgMXB4ICNhMTllYTA7XHJcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG59XHJcblxyXG4ubW9kYWwtYm9keSB7XHJcbiAgICBoMyB7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICBzcGFuIHtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0= */"], data: { animation: [
            (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.trigger)('detailExpand', [
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.state)('collapsed', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.style)({ height: '0px', minHeight: '0' })),
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.state)('expanded', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.style)({ height: '*' })),
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.transition)('expanded <=> collapsed', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.animate)('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
            (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.trigger)('openClose', [
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.state)('void', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.style)({ height: 0, opacity: 0 })),
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.transition)('void <=> *', [
                    (0,_angular_animations__WEBPACK_IMPORTED_MODULE_21__.animate)('300ms ease-in-out')
                ])
            ])
        ] } });


/***/ }),

/***/ 55958:
/*!***************************************************************************************!*\
  !*** ./src/app/components/admin/admin-panel/announcements/announcements.component.ts ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnnouncementsComponent": () => (/* binding */ AnnouncementsComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 1707);
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_announcement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/announcement */ 59643);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/firebase-service.service */ 97732);
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/auth.service */ 37556);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! primeng/dialog */ 33489);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/form-field */ 65788);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/select */ 37007);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/core */ 32220);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/input */ 64742);
/* harmony import */ var primeng_editor__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! primeng/editor */ 1791);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/button */ 70781);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/tooltip */ 50298);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! primeng/button */ 84633);




















function AnnouncementsComponent_tr_20_span_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const announce_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", announce_r7.viewedBy.length, " ");
} }
function AnnouncementsComponent_tr_20_span_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " 0 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function AnnouncementsComponent_tr_20_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "td", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](8, AnnouncementsComponent_tr_20_span_8_Template, 2, 1, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](9, AnnouncementsComponent_tr_20_span_9_Template, 2, 0, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "i", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("mouseover", function AnnouncementsComponent_tr_20_Template_i_mouseover_11_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r12); const announce_r7 = restoredCtx.$implicit; const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](); return ctx_r11.getMyViews(announce_r7.viewedBy); });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "i", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function AnnouncementsComponent_tr_20_Template_i_click_13_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r12); const announce_r7 = restoredCtx.$implicit; const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](); ctx_r13.editAnnounce(announce_r7); return ctx_r13.announceReview = true; });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "i", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function AnnouncementsComponent_tr_20_Template_i_click_14_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r12); const announce_r7 = restoredCtx.$implicit; const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](); return ctx_r14.closeAccounce(announce_r7); });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](15, "i", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function AnnouncementsComponent_tr_20_Template_i_click_15_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r12); const announce_r7 = restoredCtx.$implicit; const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](); return ctx_r15.deleteAnnounce(announce_r7); });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const announce_r7 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](announce_r7.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](announce_r7.body);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](announce_r7.status == 0 ? "RUNNING" : "Closed");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !!announce_r7.viewedBy);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !announce_r7.viewedBy);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpropertyInterpolate"]("matTooltip", ctx_r0.myViews);
} }
function AnnouncementsComponent_ng_template_43_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "span", 37);
} }
const _c0 = function () { return ["assignTo"]; };
function AnnouncementsComponent_mat_option_51_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "mat-option", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const user_r16 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ((tmp_0_0 = ctx_r2.newAnnounceForm.get(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](3, _c0))) == null ? null : tmp_0_0.value) == "All")("value", user_r16.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](user_r16.username);
} }
function AnnouncementsComponent_img_53_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "img", 39);
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("src", ctx_r3.url, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
} }
function AnnouncementsComponent_ng_template_62_Template(rf, ctx) { }
function AnnouncementsComponent_p_dialog_63_mat_option_32_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "mat-option", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const user_r21 = ctx.$implicit;
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ((tmp_0_0 = ctx_r17.newAnnounceForm.get(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](3, _c0))) == null ? null : tmp_0_0.value) == "All")("value", user_r21.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](user_r21.username);
} }
function AnnouncementsComponent_p_dialog_63_img_34_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "img", 39);
} if (rf & 2) {
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("src", ctx_r18.url, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
} }
function AnnouncementsComponent_p_dialog_63_ng_template_43_Template(rf, ctx) { if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p-button", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function AnnouncementsComponent_p_dialog_63_ng_template_43_Template_p_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r23); const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2); return ctx_r22.displayModal = false; });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
const _c1 = function () { return { width: "50vw" }; };
const _c2 = function () { return { "960px": "50vw", "640px": "100vw" }; };
const _c3 = function () { return { "height": "320px" }; };
function AnnouncementsComponent_p_dialog_63_Template(rf, ctx) { if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p-dialog", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("visibleChange", function AnnouncementsComponent_p_dialog_63_Template_p_dialog_visibleChange_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r25); const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](); return ctx_r24.announceReview = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "div", 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](3, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "form", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngSubmit", function AnnouncementsComponent_p_dialog_63_Template_form_ngSubmit_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r25); const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](); return ctx_r26.updateAnnounce(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "mat-form-field", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](9, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](10, "Language");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "mat-select", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "mat-option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](13, "English");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "mat-option", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15, "Arabic");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](17, "mat-form-field", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](19, "Title");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](20, "input", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](21, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](22, "label", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](23, "Body:");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](24, "p-editor", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](25, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](26, "mat-form-field", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](27, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](28, "Assign To");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](29, "mat-select", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](30, "mat-option", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](31, "All");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](32, AnnouncementsComponent_p_dialog_63_mat_option_32_Template, 2, 4, "mat-option", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](33, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](34, AnnouncementsComponent_p_dialog_63_img_34_Template, 1, 1, "img", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](35, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](36, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function AnnouncementsComponent_p_dialog_63_Template_button_click_36_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r25); const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](39); return _r19.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](37, "Choose File");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](38, "input", 25, 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("change", function AnnouncementsComponent_p_dialog_63_Template_input_change_38_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r25); const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](); return ctx_r28.imageupload($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](40, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](41, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](42);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](43, AnnouncementsComponent_p_dialog_63_ng_template_43_Template, 1, 0, "ng-template", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](14, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("visible", ctx_r6.announceReview)("breakpoints", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](15, _c2))("modal", true)("draggable", false)("resizable", false);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("formGroup", ctx_r6.newAnnounceForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](16, _c3));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx_r6.allUsers);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !!ctx_r6.url);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx_r6.newAnnounceForm.invalid || ctx_r6.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r6.loading ? "Loading...." : "Submit");
} }
class AnnouncementsComponent {
    constructor(_db, _auth, _notify) {
        this._db = _db;
        this._auth = _auth;
        this._notify = _notify;
        this.myAnnounces = [];
        this.displayModal = false;
        this.allUsers = [];
        this.url = '';
        this.loading = false;
        this.announceReview = false;
        this.myViews = '';
        this.imgToDelete = '';
        this.accTypeEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department;
        this.toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'header': 1 }, { 'header': 2 }],
            ['clean'] // remove formatting button
        ];
        this.quillOPT = {
            toolbar: this.toolbarOptions
        };
    }
    ngOnInit() {
        this.newAnnounceForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormGroup({
            "title": new _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required),
            "body": new _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required),
            "assignTo": new _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required),
            "language": new _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required)
        });
        const getUSer = this._auth.user.subscribe(user => {
            getUSer.unsubscribe();
            this.currentUser = user;
            if (this.currentUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department.MANAGEMENT) {
                this._db.getAllAnnounces().subscribe(announces => {
                    this.myAnnounces = announces.reverse();
                });
            }
            else if (this.currentUser.accPosition == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.AccountPositions.MANAGER || this.currentUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department.ADMINSTRATION) {
                this._db.getMyAnnounces(this.currentUser.key || '').subscribe(announces => {
                    this.myAnnounces = announces.reverse();
                });
            }
            this._auth.getAllUsers().subscribe(users => {
                this.allUsers = users.filter(user => user.accType != src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.AccountType.Client);
            });
        });
    }
    imageupload(event) {
        this.announceImg = event.target.files[0];
        if (event.target.files) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                this.url = event.target.result;
            };
        }
    }
    createNewAnnounce() {
        var _a, _b, _c, _d;
        this.loading = true;
        const assignTo = (_a = this.newAnnounceForm.get(['assignTo'])) === null || _a === void 0 ? void 0 : _a.value;
        const isAll = assignTo.find(key => key == 'All');
        let finalAssignTo = [];
        if (isAll) {
            for (let i in this.allUsers) {
                const toView = {
                    empToviewedByKey: this.allUsers[i].key || '',
                    empToviewedByName: this.allUsers[i].username
                };
                finalAssignTo.push(toView);
            }
        }
        else {
            for (let i in assignTo) {
                const empToView = this.allUsers.find(user => user.key == assignTo[i]);
                if (!!empToView) {
                    const toView = {
                        empToviewedByKey: empToView.key || '',
                        empToviewedByName: empToView.username
                    };
                    finalAssignTo.push(toView);
                }
            }
        }
        const newAnn = {
            title: (_b = this.newAnnounceForm.get(['title'])) === null || _b === void 0 ? void 0 : _b.value,
            body: (_c = this.newAnnounceForm.get(['body'])) === null || _c === void 0 ? void 0 : _c.value,
            language: (_d = this.newAnnounceForm.get(['language'])) === null || _d === void 0 ? void 0 : _d.value,
            assignTo: finalAssignTo,
            status: src_app_interfaces_announcement__WEBPACK_IMPORTED_MODULE_1__.AnnounceStatus.RUNNING,
            createdByKey: this.currentUser.key || '',
            createdByName: this.currentUser.username,
            createdByImgUrl: this.currentUser.photoURL ? this.currentUser.photoURL : '',
            viewedBy: []
        };
        if (!!this.announceImg) {
            this._db.createNewAnnounce(newAnn, this.announceImg).then(() => {
                this._notify.openSnackbar('Success', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                this.resetAll();
            });
        }
        else {
            this._db.createNewAnnounce(newAnn, this.announceImg).then(() => {
                this._notify.openSnackbar('Success', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                this.resetAll();
            });
        }
    }
    resetAll() {
        this.displayModal = false;
        this.loading = false;
        this.url = '';
        this.announceImg = undefined;
        this.newAnnounceForm.reset();
        // this.announceToEdit = undefined;
    }
    editAnnounce(announce) {
        this.announceToEdit = announce;
        const ass = this.announceToEdit.assignTo.map(oldAss => oldAss.empToviewedByKey);
        this.newAnnounceForm.patchValue({
            'title': this.announceToEdit.title,
            'body': this.announceToEdit.body,
            'assignTo': ass,
            'language': this.announceToEdit.language
        });
        if (!!this.announceToEdit.imgURL) {
            this.url = this.announceToEdit.imgURL;
        }
    }
    updateAnnounce() {
        var _a, _b, _c, _d, _e;
        this.loading = true;
        const assignTo = (_a = this.newAnnounceForm.get(['assignTo'])) === null || _a === void 0 ? void 0 : _a.value;
        const isAll = assignTo.find(key => key == 'All');
        let finalAssignTo = [];
        if (isAll) {
            for (let i in this.allUsers) {
                const toView = {
                    empToviewedByKey: this.allUsers[i].key || '',
                    empToviewedByName: this.allUsers[i].username
                };
                finalAssignTo.push(toView);
            }
        }
        else {
            for (let i in assignTo) {
                const empToView = this.allUsers.find(user => user.key == assignTo[i]);
                if (!!empToView) {
                    const toView = {
                        empToviewedByKey: empToView.key || '',
                        empToviewedByName: empToView.username
                    };
                    finalAssignTo.push(toView);
                }
            }
        }
        // const newAnn:Announcement={
        //   title:this.newAnnounceForm.get(['title'])?.value,
        //   body:this.newAnnounceForm.get(['body'])?.value,
        //   language:this.newAnnounceForm.get(['language'])?.value,
        //   assignTo : finalAssignTo,
        //   status:AnnounceStatus.RUNNING,
        //   createdByKey:this.currentUser.key || '',
        //   createdByName:this.currentUser.username,
        //   createdByImgUrl :this.currentUser.photoURL ? this.currentUser.photoURL : '',
        //   viewedBy:this.announceToEdit?.viewedBy || []
        // }
        this.announceToEdit.title = (_b = this.newAnnounceForm.get(['title'])) === null || _b === void 0 ? void 0 : _b.value;
        this.announceToEdit.body = (_c = this.newAnnounceForm.get(['body'])) === null || _c === void 0 ? void 0 : _c.value;
        this.announceToEdit.language = (_d = this.newAnnounceForm.get(['language'])) === null || _d === void 0 ? void 0 : _d.value;
        this.announceToEdit.assignTo = finalAssignTo;
        this.announceToEdit.status = src_app_interfaces_announcement__WEBPACK_IMPORTED_MODULE_1__.AnnounceStatus.RUNNING;
        if (!!this.announceImg) {
            this.imgToDelete = ((_e = this.announceToEdit) === null || _e === void 0 ? void 0 : _e.imgURL) || '';
            this._db.updateAnnounce(this.announceToEdit, this.announceImg, this.imgToDelete).then(() => {
                this._notify.openSnackbar('Success', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                this.resetAll();
            });
        }
        else {
            this._db.updateAnnounce(this.announceToEdit).then(() => {
                this._notify.openSnackbar('Success', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                this.resetAll();
            });
        }
    }
    getMyViews(views) {
        this.myViews = '';
        for (let i in views) {
            if (!!this.myViews) {
                this.myViews = `${this.myViews} , ${views[i].viewedByName}`;
            }
            else {
                this.myViews = `${views[i].viewedByName}`;
            }
        }
    }
    deleteAnnounce(announce) {
        this._notify.openDialog('Delete Announce?', `Are you sure you want to Delete Announce?`, false, '', true, false).subscribe(response => {
            if (response) {
                this._db.deleteAnnounce(announce);
            }
            else {
                this._notify.openSnackbar('Operation Cancelled!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Info);
            }
        });
    }
    closeAccounce(announce) {
        this._notify.openDialog('Close Announce?', `Are you sure you want to Close Announce?`, false, '', true, false).subscribe(response => {
            if (response) {
                announce.status = src_app_interfaces_announcement__WEBPACK_IMPORTED_MODULE_1__.AnnounceStatus.CLOSED;
                this._db.updateAnnounce(announce);
            }
            else {
                this._notify.openSnackbar('Operation Cancelled!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Info);
            }
        });
    }
}
AnnouncementsComponent.ɵfac = function AnnouncementsComponent_Factory(t) { return new (t || AnnouncementsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_3__.FirebaseServiceService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_4__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_5__.NotificationService)); };
AnnouncementsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({ type: AnnouncementsComponent, selectors: [["app-announcements"]], decls: 64, vars: 20, consts: [[1, "container"], [1, "row", "m-2"], [1, "col-12"], [1, "btn", "addBtn", 3, "click"], [1, "row"], ["id", "costLogs", 1, "table", "table-hover", "tableCustom"], [4, "ngFor", "ngForOf"], ["header", "New Announce", 3, "visible", "breakpoints", "modal", "draggable", "resizable", "visibleChange"], [1, "example-form", 3, "formGroup", "ngSubmit"], [1, "container-fluid"], [1, "col-md-12", "my-3"], [1, "example-full-width", "w-100"], ["formControlName", "language"], ["value", "ltr"], ["value", "rtl"], ["matInput", "", "type", "text", "formControlName", "title"], ["for", ""], ["formControlName", "body", 3, "modules"], ["pTemplate", "header"], [1, "col-md-6", "my-3"], ["multiple", "", "formControlName", "assignTo"], ["value", "All"], [3, "disabled", "value", 4, "ngFor", "ngForOf"], ["alt", "", "class", "", "width", "150", 3, "src", 4, "ngIf"], ["type", "button", "mat-raised-button", "", 3, "click"], ["hidden", "", "type", "file", "id", "file", 3, "change"], ["fileInput", ""], ["type", "submit", 1, "btn", "submitBTN", "my-3", 3, "disabled"], ["pTemplate", "footer"], ["header", "Review Announce", 3, "visible", "style", "breakpoints", "modal", "draggable", "resizable", "visibleChange", 4, "ngIf"], [1, "dateStyle"], [4, "ngIf"], [1, "ml-1", "pt-1", "badge"], [1, "pi", "pi-eye", "views", 3, "matTooltip", "mouseover"], [1, "pi", "pi-pencil", "editIcon", "mr-1", 3, "click"], [1, "pi", "pi-times", "closeIcon", "mx-1", 3, "click"], [1, "pi", "pi-trash", "deleteIcon", "ml-1", 3, "click"], [1, "ql-format-group"], [3, "disabled", "value"], ["alt", "", "width", "150", 1, "", 3, "src"], ["header", "Review Announce", 3, "visible", "breakpoints", "modal", "draggable", "resizable", "visibleChange"], [1, "col-lg-3", "col-md-6"], ["formControlName", "body"], ["icon", "pi pi-check", "label", "Ok", "styleClass", "p-button-text", 3, "click"]], template: function AnnouncementsComponent_Template(rf, ctx) { if (rf & 1) {
        const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function AnnouncementsComponent_Template_button_click_3_listener() { return ctx.displayModal = true; });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4, "New");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "table", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "thead");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](9, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11, "Title");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](13, "Body");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15, "status");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](17, "Views");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](18, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](19, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](20, AnnouncementsComponent_tr_20_Template, 16, 6, "tr", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](21, "p-dialog", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("visibleChange", function AnnouncementsComponent_Template_p_dialog_visibleChange_21_listener($event) { return ctx.displayModal = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](22, "form", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngSubmit", function AnnouncementsComponent_Template_form_ngSubmit_22_listener() { return ctx.createNewAnnounce(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](23, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](24, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](25, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](26, "mat-form-field", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](27, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](28, "Language");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](29, "mat-select", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](30, "mat-option", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](31, "English");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](32, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](33, "Arabic");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](34, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](35, "mat-form-field", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](36, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](37, "Title");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](38, "input", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](39, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](40, "label", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](41, "Body:");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](42, "p-editor", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](43, AnnouncementsComponent_ng_template_43_Template, 1, 0, "ng-template", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](44, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](45, "mat-form-field", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](46, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](47, "Assign To");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](48, "mat-select", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](49, "mat-option", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](50, "All");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](51, AnnouncementsComponent_mat_option_51_Template, 2, 4, "mat-option", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](52, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](53, AnnouncementsComponent_img_53_Template, 1, 1, "img", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](54, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](55, "button", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function AnnouncementsComponent_Template_button_click_55_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r29); const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](58); return _r4.click(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](56, "Choose File");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](57, "input", 25, 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("change", function AnnouncementsComponent_Template_input_change_57_listener($event) { return ctx.imageupload($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](59, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](60, "button", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](61);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](62, AnnouncementsComponent_ng_template_62_Template, 0, 0, "ng-template", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](63, AnnouncementsComponent_p_dialog_63_Template, 44, 17, "p-dialog", 29);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.myAnnounces);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](17, _c1));
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("visible", ctx.displayModal)("breakpoints", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](18, _c2))("modal", true)("draggable", false)("resizable", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("formGroup", ctx.newAnnounceForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](19, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("modules", ctx.quillOPT);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.allUsers);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !!ctx.url);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx.newAnnounceForm.invalid || ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx.loading ? "Loading...." : "Submit");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !!ctx.announceToEdit);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgForOf, primeng_dialog__WEBPACK_IMPORTED_MODULE_9__.Dialog, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormGroupDirective, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatLabel, _angular_material_select__WEBPACK_IMPORTED_MODULE_11__.MatSelect, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControlName, _angular_material_core__WEBPACK_IMPORTED_MODULE_12__.MatOption, _angular_material_input__WEBPACK_IMPORTED_MODULE_13__.MatInput, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.DefaultValueAccessor, primeng_editor__WEBPACK_IMPORTED_MODULE_14__.Editor, primeng_api__WEBPACK_IMPORTED_MODULE_15__.PrimeTemplate, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_16__.MatButton, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltip, primeng_button__WEBPACK_IMPORTED_MODULE_18__.Button], styles: [".submitBTN[_ngcontent-%COMP%] {\n  background-color: #513982;\n  color: white;\n}\n\n.tableCustom[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n  background-color: #f1ecf0;\n  color: #513982;\n  line-height: 50px;\n  font-family: \"Cairo\";\n  font-weight: 800;\n  text-align: center;\n}\n\n.tableCustom[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-top: solid 2px #513982;\n  line-height: 50px;\n  text-align: center;\n  font-family: \"Cairo\";\n  color: #513982;\n  font-weight: 500;\n}\n\n.tableCustom[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .dateStyle[_ngcontent-%COMP%], .tableCustom[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .finalTotal[_ngcontent-%COMP%] {\n  font-family: \"Cairo\";\n  font-weight: 800;\n  color: #513982;\n}\n\n.deleteIcon[_ngcontent-%COMP%] {\n  color: #f4831f;\n  cursor: pointer;\n}\n\n.views[_ngcontent-%COMP%] {\n  color: #513982;\n  cursor: pointer;\n}\n\n.editIcon[_ngcontent-%COMP%] {\n  color: #513982;\n  cursor: pointer;\n}\n\n.closeIcon[_ngcontent-%COMP%] {\n  color: #9d9d9d;\n  cursor: pointer;\n}\n\n.addBtn[_ngcontent-%COMP%] {\n  background-color: #513982;\n  color: #fff;\n  margin: auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFubm91bmNlbWVudHMuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcX2NvbG9ycy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0kseUJDRlk7RURHWixZQUFBO0FBQUo7O0FBSUk7RUFDSSx5QkFBQTtFQUNBLGNDVFE7RURVUixpQkFBQTtFQUNBLG9CQ1BTO0VEUVQsZ0JBQUE7RUFDQSxrQkFBQTtBQURSOztBQUlRO0VBQ0ksNkJBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0JDaEJLO0VEaUJMLGNDckJJO0VEc0JKLGdCQUFBO0FBRlo7O0FBR1k7O0VBRUksb0JDckJDO0VEc0JELGdCQUFBO0VBQ0EsY0MzQkE7QUQwQmhCOztBQU9BO0VBQ0ksY0NqQ3VCO0VEa0N2QixlQUFBO0FBSko7O0FBT0E7RUFDSSxjQ3ZDWTtFRHdDWixlQUFBO0FBSko7O0FBT0E7RUFDSSxjQzVDWTtFRDZDWixlQUFBO0FBSko7O0FBT0E7RUFDSSxjQUFBO0VBQ0EsZUFBQTtBQUpKOztBQU9BO0VBQ0kseUJDdERZO0VEdURaLFdBQUE7RUFDQSxZQUFBO0FBSkoiLCJmaWxlIjoiYW5ub3VuY2VtZW50cy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uLy4uL2NvbG9ycyc7XHJcbi5zdWJtaXRCVE4ge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4udGFibGVDdXN0b20ge1xyXG4gICAgdGhlYWQge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmMWVjZjA7XHJcbiAgICAgICAgY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgICAgICBsaW5lLWhlaWdodDogNTBweDtcclxuICAgICAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgfVxyXG4gICAgdGJvZHkge1xyXG4gICAgICAgIHRyIHtcclxuICAgICAgICAgICAgYm9yZGVyLXRvcDogc29saWQgMnB4ICRtYWluVGhlbWVDb2xvcjtcclxuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDUwcHg7XHJcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICAgICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxuICAgICAgICAgICAgY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgICAgICAgICAgLmRhdGVTdHlsZSxcclxuICAgICAgICAgICAgLmZpbmFsVG90YWwge1xyXG4gICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4uZGVsZXRlSWNvbiB7XHJcbiAgICBjb2xvcjogJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi52aWV3cyB7XHJcbiAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4uZWRpdEljb24ge1xyXG4gICAgY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLmNsb3NlSWNvbiB7XHJcbiAgICBjb2xvcjogIzlkOWQ5ZDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLmFkZEJ0biB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgIG1hcmdpbjogYXV0bztcclxufSIsIiRtYWluVGhlbWVDb2xvcjojNTEzOTgyO1xyXG4kYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjojZjQ4MzFmOyAvLyNGNTgyMUY7XHJcbiRzZWNvbmRGb250Q29sb3I6IzcwNzA3MDtcclxuJHdoaXRlQ29sb3I6I2ZmZjtcclxuJG1haW5Gb250RmFtaWx5OiAnQ2Fpcm8nOyJdfQ== */"] });


/***/ }),

/***/ 79320:
/*!*********************************************************************************!*\
  !*** ./src/app/components/admin/admin-panel/dash-board/dash-board.component.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DashBoardComponent": () => (/* binding */ DashBoardComponent)
/* harmony export */ });
/* harmony import */ var src_app_interfaces_project__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/interfaces/project */ 16847);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/firebase-service.service */ 97732);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! angular-bootstrap-md */ 48881);





function DashBoardComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "canvas", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("chartHover", function DashBoardComponent_div_3_Template_canvas_chartHover_2_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r3); const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r2.projectsStatusChartHovered($event); })("chartClick", function DashBoardComponent_div_3_Template_canvas_chartClick_2_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r3); const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r4.projectsStatusChartClicked($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("chartType", ctx_r0.projectsStatusChartType)("datasets", ctx_r0.projectsStatusChartDatasets)("labels", ctx_r0.projectsStatusChartLabels)("colors", ctx_r0.projectsStatusChartColors)("options", ctx_r0.projectsStatusChartOptions)("legend", true);
} }
function DashBoardComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "canvas", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("chartHover", function DashBoardComponent_div_5_Template_canvas_chartHover_2_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r6); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r5.projectsTypeChartHovered($event); })("chartClick", function DashBoardComponent_div_5_Template_canvas_chartClick_2_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r6); const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r7.projectsTypeChartClicked($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("chartType", ctx_r1.projectsTypeChartType)("datasets", ctx_r1.projectsTypeChartDatasets)("labels", ctx_r1.projectsTypeChartLabels)("colors", ctx_r1.projectsTypeChartColors)("options", ctx_r1.projectsTypeChartOptions)("legend", true);
} }
class DashBoardComponent {
    /* =================================== Projects Type Based Chart Variables =========================== */
    constructor(_db) {
        this._db = _db;
        this.loaded = false;
        /* =================================== Projects Status Based Chart Variables =========================== */
        this.projectsStatusChartType = 'doughnut';
        this.projectsStatusChartDatasets = []; // { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
        this.projectsStatusChartLabels = [src_app_interfaces_project__WEBPACK_IMPORTED_MODULE_0__.Status.SCHEDULED, src_app_interfaces_project__WEBPACK_IMPORTED_MODULE_0__.Status.RUNNING, src_app_interfaces_project__WEBPACK_IMPORTED_MODULE_0__.Status.PENDING, src_app_interfaces_project__WEBPACK_IMPORTED_MODULE_0__.Status.HOLD, src_app_interfaces_project__WEBPACK_IMPORTED_MODULE_0__.Status.CLOSED];
        this.projectsStatusChartColors = [
            {
                backgroundColor: ['#FDB45C', '#46BFBD', '#949FB1', '#4D5360', '#F7464A'],
                hoverBackgroundColor: ['#FFC870', '#5AD3D1', '#A8B3C5', '#616774', '#FF5A5E'],
                borderWidth: 2,
            }
        ];
        this.projectsStatusChartOptions = {
            responsive: true
        };
        /* =================================== Projects Status Based Chart Variables =========================== */
        /* =================================== Projects Type Based Chart Variables =========================== */
        this.projectsTypeChartType = 'pie';
        this.projectsTypeChartDatasets = []; // { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
        this.projectsTypeChartLabels = ['Project', 'POC'];
        this.projectsTypeChartColors = [
            {
                backgroundColor: ['#FDB45C', '#46BFBD'],
                hoverBackgroundColor: ['#FFC870', '#5AD3D1'],
                borderWidth: 2,
            }
        ];
        this.projectsTypeChartOptions = {
            responsive: true
        };
    }
    projectsStatusChartClicked(e) { }
    projectsStatusChartHovered(e) { }
    projectsTypeChartClicked(e) { }
    projectsTypeChartHovered(e) { }
    ngOnInit() {
        this.loadAllProjectsChart();
    }
    loadAllProjectsChart() {
        this._db.getAllProjects().subscribe((projects) => {
            this.projectStatusPasedAnalysis(projects);
            this.projectTypeBasedAnalysis(projects);
            this.loaded = true;
        }, err => console.log(err));
    }
    projectStatusPasedAnalysis(projects) {
        let statArray = [];
        let SCHEDULEDCounter = 0;
        let RUNNINGCounter = 0;
        let PENDINGCounter = 0;
        let HOLDCounter = 0;
        let CLOSEDCounter = 0;
        projects.forEach(project => {
            if (project.status == src_app_interfaces_project__WEBPACK_IMPORTED_MODULE_0__.Status.SCHEDULED) {
                SCHEDULEDCounter++;
            }
            else if (project.status == src_app_interfaces_project__WEBPACK_IMPORTED_MODULE_0__.Status.RUNNING) {
                RUNNINGCounter++;
            }
            else if (project.status == src_app_interfaces_project__WEBPACK_IMPORTED_MODULE_0__.Status.PENDING) {
                PENDINGCounter++;
            }
            else if (project.status == src_app_interfaces_project__WEBPACK_IMPORTED_MODULE_0__.Status.HOLD) {
                HOLDCounter++;
            }
            else if (project.status == src_app_interfaces_project__WEBPACK_IMPORTED_MODULE_0__.Status.CLOSED) {
                CLOSEDCounter++;
            }
        });
        statArray.push(SCHEDULEDCounter);
        statArray.push(RUNNINGCounter);
        statArray.push(PENDINGCounter);
        statArray.push(HOLDCounter);
        statArray.push(CLOSEDCounter);
        this.projectsStatusChartDatasets.push({ data: statArray, label: 'Projects' });
    }
    projectTypeBasedAnalysis(projects) {
        let projectTypeArray = [];
        let projectCounter = 0;
        let POCCounter = 0;
        projects.forEach(project => {
            if (project.type == 'project') {
                projectCounter++;
            }
            else if (project.type == 'poc') {
                POCCounter++;
            }
        });
        projectTypeArray.push(projectCounter);
        projectTypeArray.push(POCCounter);
        this.projectsTypeChartDatasets.push({ data: projectTypeArray, label: 'Project Type' });
    }
}
DashBoardComponent.ɵfac = function DashBoardComponent_Factory(t) { return new (t || DashBoardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_1__.FirebaseServiceService)); };
DashBoardComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: DashBoardComponent, selectors: [["app-dash-board"]], decls: 9, vars: 2, consts: [[1, "container", "mt-5"], [1, "row"], [1, "col-lg-6"], ["class", "projectsChart", 4, "ngIf"], [1, "co-12", "w-75"], [1, "devChart"], [1, "projectsChart"], [2, "display", "block"], ["mdbChart", "", 3, "chartType", "datasets", "labels", "colors", "options", "legend", "chartHover", "chartClick"]], template: function DashBoardComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, DashBoardComponent_div_3_Template, 3, 6, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, DashBoardComponent_div_5_Template, 3, 6, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](8, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loaded);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loaded);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__.BaseChartDirective], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJkYXNoLWJvYXJkLmNvbXBvbmVudC5zY3NzIn0= */"] });


/***/ }),

/***/ 39584:
/*!*********************************************************************************************************************!*\
  !*** ./src/app/components/admin/admin-panel/monthly-transportation-sheet/monthly-transportation-sheet.component.ts ***!
  \*********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MonthlyTransportationSheetComponent": () => (/* binding */ MonthlyTransportationSheetComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 1707);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/firebase-service.service */ 97732);
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/auth.service */ 37556);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_export_excel_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/export-excel.service */ 40689);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ 65788);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/input */ 64742);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/select */ 37007);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/core */ 32220);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/icon */ 52529);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/tooltip */ 50298);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/table */ 54302);

















function MonthlyTransportationSheetComponent_mat_option_23_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "mat-option", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const user_r17 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("value", user_r17.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](user_r17.username);
} }
function MonthlyTransportationSheetComponent_th_34_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "th", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_35_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "td", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r18 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", request_r18.empName, " ");
} }
function MonthlyTransportationSheetComponent_th_37_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "th", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_38_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "td", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r19 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", request_r19.date, " ");
} }
function MonthlyTransportationSheetComponent_th_40_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "th", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " From ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_41_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "td", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r20 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", request_r20.fromLocation, " ");
} }
function MonthlyTransportationSheetComponent_th_43_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "th", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " To ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_44_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "td", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r21 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", request_r21.toLocation, " ");
} }
function MonthlyTransportationSheetComponent_th_46_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "th", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Purpose ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_47_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "td", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r22 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", request_r22.purpose, " ");
} }
function MonthlyTransportationSheetComponent_th_49_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "th", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Project ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_50_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "td", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r23 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", request_r23.projectName, " ");
} }
function MonthlyTransportationSheetComponent_th_52_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "th", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Amount ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_53_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "td", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r24 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", request_r24.amountByEGP, " ");
} }
function MonthlyTransportationSheetComponent_tr_54_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "tr", 30);
} }
function MonthlyTransportationSheetComponent_tr_55_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "tr", 31);
} }
class MonthlyTransportationSheetComponent {
    constructor(db, auth, _db, _auth, excelServ) {
        this.db = db;
        this.auth = auth;
        this._db = _db;
        this._auth = _auth;
        this.excelServ = excelServ;
        this.users = [];
        this.transportations = [];
        this.displayedColumns = ['Name', 'Date', 'From', 'To', 'Purpose', 'Project', 'Amount'];
    }
    ngOnInit() {
        this._auth.getAllUsers().subscribe((users) => {
            if (users['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                this.users = users['data'];
            }
        });
        // this.auth.getAllUsers().subscribe(
        //   (users)=>{
        //     this.users = users;
        //   }
        // )
        this.getTransForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormGroup({
            'fromDate': new _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required),
            'toDate': new _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required),
            'devKey': new _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required)
        });
    }
    getTransportations() {
        var _a, _b, _c;
        this._db.getTransportationInDuration((_a = this.getTransForm.get('fromDate')) === null || _a === void 0 ? void 0 : _a.value, (_b = this.getTransForm.get('toDate')) === null || _b === void 0 ? void 0 : _b.value, (_c = this.getTransForm.get('devKey')) === null || _c === void 0 ? void 0 : _c.value).subscribe((transportations) => {
            if (transportations['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                this.transportations = transportations['data'];
            }
            else if (transportations['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.Success_But_Empty) {
                this.transportations = [];
            }
        });
        // this.db.getTransportationInDuration(this.getTransForm.get('fromDate')?.value , this.getTransForm.get('toDate')?.value).subscribe(
        //   (transportations)=>{        
        //     if(this.getTransForm.get('devKey')?.value == 'all'){
        //       this.transportations = transportations.filter(trans=>trans.finalStatus == transportaionFinalStatus.Approved);
        //     }else{
        //       this.transportations = transportations.filter(trans=>trans.finalStatus == transportaionFinalStatus.Approved && trans.empKey == this.getTransForm.get('devKey')?.value);          
        //     }        
        //   }
        // )
    }
    exportDevsMonthlyReport() {
        var _a, _b;
        let element = document.getElementById('monthlyTransportations');
        const fileName = `From ${(_a = this.getTransForm.get('fromDate')) === null || _a === void 0 ? void 0 : _a.value} To ${(_b = this.getTransForm.get('toDate')) === null || _b === void 0 ? void 0 : _b.value} .xlsx`;
        this.excelServ.exportexcel(element, `Monthly Transportations ${fileName}`);
    }
}
MonthlyTransportationSheetComponent.ɵfac = function MonthlyTransportationSheetComponent_Factory(t) { return new (t || MonthlyTransportationSheetComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_1__.FirebaseServiceService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_3__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_4__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_services_export_excel_service__WEBPACK_IMPORTED_MODULE_5__.ExportExcelService)); };
MonthlyTransportationSheetComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({ type: MonthlyTransportationSheetComponent, selectors: [["app-monthly-transportation-sheet"]], decls: 56, vars: 6, consts: [[1, "container"], [1, "row"], [1, "col-12"], [1, "example-form", 3, "formGroup", "ngSubmit"], [1, "container-fluid"], [1, "col-md-3", "my-3"], [1, "example-full-width", "w-100"], ["matInput", "", "type", "date", "id", "fromDate", "formControlName", "fromDate"], ["matInput", "", "type", "date", "id", "toDate", "formControlName", "toDate"], ["formControlName", "devKey"], ["value", "0"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "submit", 1, "btn", "btn-outline-info", "my-3", 3, "disabled"], [1, "", 2, "cursor", "pointer", 3, "click"], ["matTooltip", "Download File", 2, "color", "#f5831fd3"], ["mat-table", "", "id", "monthlyTransportations", 1, "mat-elevation-z8", 3, "dataSource"], ["matColumnDef", "Name"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "Date"], ["matColumnDef", "From"], ["matColumnDef", "To"], ["matColumnDef", "Purpose"], ["matColumnDef", "Project"], ["matColumnDef", "Amount"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [3, "value"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-header-row", ""], ["mat-row", ""]], template: function MonthlyTransportationSheetComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "form", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngSubmit", function MonthlyTransportationSheetComponent_Template_form_ngSubmit_3_listener() { return ctx.getTransportations(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "mat-form-field", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9, "From");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](10, "input", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "mat-form-field", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](14, "To");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](15, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](17, "mat-form-field", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](19, "Emp Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](20, "mat-select", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](21, "mat-option", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](22, "All");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](23, MonthlyTransportationSheetComponent_mat_option_23_Template, 2, 2, "mat-option", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](24, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](25, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](26, "Submit");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](27, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](28, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](29, "a", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function MonthlyTransportationSheetComponent_Template_a_click_29_listener() { return ctx.exportDevsMonthlyReport(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](30, "mat-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](31, "cloud_download");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](32, "table", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](33, 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](34, MonthlyTransportationSheetComponent_th_34_Template, 2, 0, "th", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](35, MonthlyTransportationSheetComponent_td_35_Template, 2, 1, "td", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](36, 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](37, MonthlyTransportationSheetComponent_th_37_Template, 2, 0, "th", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](38, MonthlyTransportationSheetComponent_td_38_Template, 2, 1, "td", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](39, 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](40, MonthlyTransportationSheetComponent_th_40_Template, 2, 0, "th", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](41, MonthlyTransportationSheetComponent_td_41_Template, 2, 1, "td", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](42, 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](43, MonthlyTransportationSheetComponent_th_43_Template, 2, 0, "th", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](44, MonthlyTransportationSheetComponent_td_44_Template, 2, 1, "td", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](45, 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](46, MonthlyTransportationSheetComponent_th_46_Template, 2, 0, "th", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](47, MonthlyTransportationSheetComponent_td_47_Template, 2, 1, "td", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](48, 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](49, MonthlyTransportationSheetComponent_th_49_Template, 2, 0, "th", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](50, MonthlyTransportationSheetComponent_td_50_Template, 2, 1, "td", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](51, 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](52, MonthlyTransportationSheetComponent_th_52_Template, 2, 0, "th", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](53, MonthlyTransportationSheetComponent_td_53_Template, 2, 1, "td", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](54, MonthlyTransportationSheetComponent_tr_54_Template, 1, 0, "tr", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](55, MonthlyTransportationSheetComponent_tr_55_Template, 1, 0, "tr", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("formGroup", ctx.getTransForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.users);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx.getTransForm.invalid);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("dataSource", ctx.transportations);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormGroupDirective, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatLabel, _angular_material_input__WEBPACK_IMPORTED_MODULE_9__.MatInput, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControlName, _angular_material_select__WEBPACK_IMPORTED_MODULE_10__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_11__.MatOption, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgForOf, _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__.MatIcon, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_14__.MatTooltip, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatRow], styles: ["table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbnRobHktdHJhbnNwb3J0YXRpb24tc2hlZXQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxXQUFBO0FBQ0oiLCJmaWxlIjoibW9udGhseS10cmFuc3BvcnRhdGlvbi1zaGVldC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbInRhYmxlIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59Il19 */"] });


/***/ }),

/***/ 32626:
/*!***********************************************************************************************************!*\
  !*** ./src/app/components/admin/admin-panel/pending-transportations/pending-transportations.component.ts ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PendingTransportationsComponent": () => (/* binding */ PendingTransportationsComponent)
/* harmony export */ });
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ 81288);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/firebase-service.service */ 97732);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/messaging.service */ 64271);
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/auth.service */ 37556);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_project_cost_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/project-cost.service */ 30471);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/table */ 54302);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/divider */ 1124);
/* harmony import */ var primeng_table__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/table */ 68581);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/forms */ 1707);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/select */ 37007);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/core */ 32220);



















function PendingTransportationsComponent_th_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r20 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r20.empName, " ");
} }
function PendingTransportationsComponent_th_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r21 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r21.date, " ");
} }
function PendingTransportationsComponent_th_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " From ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r22 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r22.fromLocation, " ");
} }
function PendingTransportationsComponent_th_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " To ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r23 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r23.toLocation, " ");
} }
function PendingTransportationsComponent_th_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Purpose ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r24 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r24.purpose, " ");
} }
function PendingTransportationsComponent_th_17_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Project ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r25 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r25.projectName, " ");
} }
function PendingTransportationsComponent_th_20_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Amount ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_21_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r26 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r26.amountByEGP, " ");
} }
function PendingTransportationsComponent_th_23_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Decision ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_24_Template(rf, ctx) { if (rf & 1) {
    const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function PendingTransportationsComponent_td_24_Template_button_click_1_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r29); const request_r27 = restoredCtx.$implicit; const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](); const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](28); ctx_r28.open(_r18); return ctx_r28.reviewRequest(request_r27); });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2, "Review");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_tr_25_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "tr", 17);
} }
function PendingTransportationsComponent_tr_26_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "tr", 18);
} }
function PendingTransportationsComponent_ng_template_27_div_47_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2, "Project Name : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r32.requestToReview.projectName, " ");
} }
function PendingTransportationsComponent_ng_template_27_div_48_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2, "Process Name : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r33.requestToReview.processName, " ");
} }
function PendingTransportationsComponent_ng_template_27_p_table_50_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "tr", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2, "Action By ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](3, "th", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](4, "Status ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](5, "th", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](6, "Comment ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](7, "th", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](8, "Action Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_ng_template_27_p_table_50_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "tr", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](9, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const req_r39 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", req_r39.user_name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", req_r39.status_name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", req_r39.comment, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind2"](9, 4, req_r39.action_date, "dd/MM/yyyy HH:mm:ss"), " ");
} }
const _c0 = function () { return [10, 25, 50]; };
function PendingTransportationsComponent_ng_template_27_p_table_50_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "p-table", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, PendingTransportationsComponent_ng_template_27_p_table_50_ng_template_1_Template, 9, 0, "ng-template", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](2, PendingTransportationsComponent_ng_template_27_p_table_50_ng_template_2_Template, 10, 7, "ng-template", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("value", ctx_r34.requestToReview.history)("paginator", ctx_r34.requestToReview.history.length > 10 ? true : false)("rows", 10)("showCurrentPageReport", true)("rowsPerPageOptions", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpureFunction0"](5, _c0));
} }
function PendingTransportationsComponent_ng_template_27_div_52_div_1_mat_option_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "mat-option", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const man_r42 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("value", man_r42.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](man_r42.username);
} }
function PendingTransportationsComponent_ng_template_27_div_52_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r44 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2, "Assign To : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "mat-select", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("ngModelChange", function PendingTransportationsComponent_ng_template_27_div_52_div_1_Template_mat_select_ngModelChange_4_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r44); const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](3); return ctx_r43.requestToReview.managerToApproveKey = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](5, PendingTransportationsComponent_ng_template_27_div_52_div_1_mat_option_5_Template, 2, 2, "mat-option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngModel", ctx_r40.requestToReview.managerToApproveKey);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", ctx_r40.managers);
} }
function PendingTransportationsComponent_ng_template_27_div_52_Template(rf, ctx) { if (rf & 1) {
    const _r46 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, PendingTransportationsComponent_ng_template_27_div_52_div_1_Template, 6, 2, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](2, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](4, "Comment : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](5, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](6, "input", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("ngModelChange", function PendingTransportationsComponent_ng_template_27_div_52_Template_input_ngModelChange_6_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r46); const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2); return ctx_r45.requestToReview.managerDissisionComment = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](7, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](8, "button", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function PendingTransportationsComponent_ng_template_27_div_52_Template_button_click_8_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r46); const modal_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit; const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](); ctx_r47.flowDecision(true); return modal_r31.close("Save click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](9, "Approve");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](10, "button", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function PendingTransportationsComponent_ng_template_27_div_52_Template_button_click_10_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r46); const modal_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit; const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](); ctx_r49.flowDecision(false); return modal_r31.close("Save click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](11, "Reject");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx_r35.currentUser.department != ctx_r35.DepartmentEnum.MANAGEMENT);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngModel", ctx_r35.requestToReview.managerDissisionComment);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("disabled", ctx_r35.currentUser.department != ctx_r35.DepartmentEnum.MANAGEMENT && !ctx_r35.requestToReview.managerToApproveKey);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("disabled", !ctx_r35.requestToReview.managerDissisionComment);
} }
function PendingTransportationsComponent_ng_template_27_div_53_Template(rf, ctx) { if (rf & 1) {
    const _r52 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](2, "button", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function PendingTransportationsComponent_ng_template_27_div_53_Template_button_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r52); const modal_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit; const ctx_r51 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](); ctx_r51.markAsDone(); return modal_r31.close("Save click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](3, "Paid");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_ng_template_27_Template(rf, ctx) { if (rf & 1) {
    const _r55 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "h4", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2, "Transportation Request Review");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](3, "button", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function PendingTransportationsComponent_ng_template_27_Template_button_click_3_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r55); const modal_r31 = restoredCtx.$implicit; return modal_r31.dismiss("Cross click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](5, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](6, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](7, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](8, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](9, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](10, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](11, "Request BY : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](12, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](13, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](15, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](16, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](17, "Date : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](18, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](19, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](21, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](22, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](23, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](24, "From : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](25, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](26, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](28, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](29, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](30, "To : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](31, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](32, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](33);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](34, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](35, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](36, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](37, "purpose : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](38, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](39, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](40);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](41, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](42, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](43, "Amount : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](44, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](45, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](46);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](47, PendingTransportationsComponent_ng_template_27_div_47_Template, 6, 1, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](48, PendingTransportationsComponent_ng_template_27_div_48_Template, 6, 1, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](49, "mat-divider");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](50, PendingTransportationsComponent_ng_template_27_p_table_50_Template, 3, 6, "p-table", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](51, "mat-divider");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](52, PendingTransportationsComponent_ng_template_27_div_52_Template, 12, 4, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](53, PendingTransportationsComponent_ng_template_27_div_53_Template, 4, 0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r19.requestToReview.empName, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r19.requestToReview.date, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r19.requestToReview.fromLocation, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r19.requestToReview.toLocation, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r19.requestToReview.purpose, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r19.requestToReview.amountByEGP, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx_r19.requestToReview.projectName);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx_r19.requestToReview.processName);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !!ctx_r19.requestToReview.history && ctx_r19.requestToReview.history.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx_r19.currentUser.accRole != ctx_r19.AccountRolesEnum.FINANCE);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx_r19.currentUser.accRole == ctx_r19.AccountRolesEnum.FINANCE);
} }
class PendingTransportationsComponent {
    constructor(db, _db, modalService, _messaging, auth, _auth, _projectCost) {
        this.db = db;
        this._db = _db;
        this.modalService = modalService;
        this._messaging = _messaging;
        this.auth = auth;
        this._auth = _auth;
        this._projectCost = _projectCost;
        this.myPendingRequests = [];
        this.displayedColumns = ['Name', 'Date', 'From', 'To', 'Purpose', 'Project', 'Amount', 'Decision'];
        this.admins = [];
        this.managers = [];
        this.DepartmentEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department;
        this.AccountRolesEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.AccountRoles;
    }
    ngOnInit() {
        this._auth.user.subscribe((user) => {
            this.currentUser = user;
            this.getMyPendingTransRequest();
        });
        this._auth.getUserByFilter(src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department.MANAGEMENT).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                this.managers = res['data'];
            }
        });
        this._auth.getUserByFilter(src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department.ADMINSTRATION, src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.AccountRoles.FINANCE).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                this.admins = res['data'];
            }
        });
    }
    getMyPendingTransRequest() {
        if (this.currentUser.accRole == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.AccountRoles.SUPER_USER) {
            this._db.getAllTransportationToApprove().subscribe(res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                    this.myPendingRequests = res['data'];
                }
            });
        }
        else if (this.currentUser.accRole == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.AccountRoles.FINANCE) {
            this._db.transportationFinanceToPay().subscribe(res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                    this.myPendingRequests = res['data'];
                }
                else if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.Success_But_Empty) {
                    this.myPendingRequests = [];
                }
            });
        }
        else {
            this._db.getMyTransportationToApprove().subscribe(res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                    this.myPendingRequests = res['data'];
                }
                else if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.Success_But_Empty) {
                    this.myPendingRequests = [];
                }
            });
        }
    }
    flowDecision(approved) {
        if (approved == true) {
            if (this.currentUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department.MANAGEMENT) {
                this._db.transportationManagerApprove(this.requestToReview).subscribe(res => {
                    if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                        this.getMyPendingTransRequest();
                    }
                });
            }
            else {
                this._db.transportationAssignToApprove(this.requestToReview).subscribe(res => {
                    if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                        this.getMyPendingTransRequest();
                    }
                });
            }
        }
        else {
            this.requestToReview.managerDissisionKey = this.currentUser.key;
            this._db.transportationManagerReject(this.requestToReview).subscribe(res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                    this.getMyPendingTransRequest();
                }
            });
        }
    }
    markAsDone() {
        this._db.transportationMarkAsDone(this.requestToReview).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                this.getMyPendingTransRequest();
            }
        });
    }
    reviewRequest(req) {
        this.requestToReview = req;
    }
    getDismissReason(reason) {
        if (reason === _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_9__.ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_9__.ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        }
        else {
            return `with: ${reason}`;
        }
    }
    open(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
}
PendingTransportationsComponent.ɵfac = function PendingTransportationsComponent_Factory(t) { return new (t || PendingTransportationsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_2__.FirebaseServiceService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_3__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_9__.NgbModal), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_4__.MessagingService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_5__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_6__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_project_cost_service__WEBPACK_IMPORTED_MODULE_7__.ProjectCostService)); };
PendingTransportationsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({ type: PendingTransportationsComponent, selectors: [["app-pending-transportations"]], decls: 29, vars: 3, consts: [["mat-table", "", 1, "mat-elevation-z8", 3, "dataSource"], ["matColumnDef", "Name"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "Date"], ["matColumnDef", "From"], ["matColumnDef", "To"], ["matColumnDef", "Purpose"], ["matColumnDef", "Project"], ["matColumnDef", "Amount"], ["matColumnDef", "Decision"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mymodal", ""], ["mat-header-cell", ""], ["mat-cell", ""], [1, "btn", "reviewBTN", "mx-1", 3, "click"], ["mat-header-row", ""], ["mat-row", ""], [1, "modal-header"], ["id", "modal-basic-title", 1, "modal-title"], ["type", "button", "aria-label", "Close", 1, "close", 3, "click"], ["aria-hidden", "true"], [1, "modal-body"], [1, "container-fluid"], [1, "row"], [1, "col-6"], [1, "modalInfo", "pl-2"], ["class", "col-6", 4, "ngIf"], ["styleClass", "p-datatable-sm", "responsiveLayout", "scroll", "currentPageReportTemplate", "Showing {first} to {last} of {totalRecords} entries", 3, "value", "paginator", "rows", "showCurrentPageReport", "rowsPerPageOptions", 4, "ngIf"], ["class", "management", 4, "ngIf"], ["class", "finance", 4, "ngIf"], ["styleClass", "p-datatable-sm", "responsiveLayout", "scroll", "currentPageReportTemplate", "Showing {first} to {last} of {totalRecords} entries", 3, "value", "paginator", "rows", "showCurrentPageReport", "rowsPerPageOptions"], ["pTemplate", "header"], ["pTemplate", "body"], [1, "tHeader"], ["pSortableColumn", "user_name"], ["pSortableColumn", "status_name"], ["pSortableColumn", "comment"], ["pSortableColumn", "action_date"], [1, "tbody"], [1, "management"], ["class", "col-12", 4, "ngIf"], [1, "col-12"], ["type", "text", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "modal-footer"], ["type", "submit", 1, "btn", "mx-1", "approveBTN", 3, "disabled", "click"], ["type", "submit", 1, "btn", "mx-1", "rejectBTN", 3, "disabled", "click"], [1, "form-control", 3, "ngModel", "ngModelChange"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "finance"], ["type", "submit", 1, "btn", "mx-1", "approveBTN", 3, "click"]], template: function PendingTransportationsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "table", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](1, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](2, PendingTransportationsComponent_th_2_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](3, PendingTransportationsComponent_td_3_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](4, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](5, PendingTransportationsComponent_th_5_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](6, PendingTransportationsComponent_td_6_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](7, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](8, PendingTransportationsComponent_th_8_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](9, PendingTransportationsComponent_td_9_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](10, 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](11, PendingTransportationsComponent_th_11_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](12, PendingTransportationsComponent_td_12_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](13, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](14, PendingTransportationsComponent_th_14_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](15, PendingTransportationsComponent_td_15_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](16, 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](17, PendingTransportationsComponent_th_17_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](18, PendingTransportationsComponent_td_18_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](19, 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](20, PendingTransportationsComponent_th_20_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](21, PendingTransportationsComponent_td_21_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](22, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](23, PendingTransportationsComponent_th_23_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](24, PendingTransportationsComponent_td_24_Template, 3, 0, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](25, PendingTransportationsComponent_tr_25_Template, 1, 0, "tr", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](26, PendingTransportationsComponent_tr_26_Template, 1, 0, "tr", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](27, PendingTransportationsComponent_ng_template_27_Template, 54, 11, "ng-template", null, 13, _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplateRefExtractor"]);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("dataSource", ctx.myPendingRequests);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
    } }, directives: [_angular_material_table__WEBPACK_IMPORTED_MODULE_10__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_10__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_10__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_10__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_10__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_10__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_10__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_10__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_10__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_10__.MatRow, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf, _angular_material_divider__WEBPACK_IMPORTED_MODULE_12__.MatDivider, primeng_table__WEBPACK_IMPORTED_MODULE_13__.Table, primeng_api__WEBPACK_IMPORTED_MODULE_14__.PrimeTemplate, primeng_table__WEBPACK_IMPORTED_MODULE_13__.SortableColumn, _angular_forms__WEBPACK_IMPORTED_MODULE_15__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_15__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_15__.NgModel, _angular_material_select__WEBPACK_IMPORTED_MODULE_16__.MatSelect, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgForOf, _angular_material_core__WEBPACK_IMPORTED_MODULE_17__.MatOption], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.DatePipe], styles: ["table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.tHeader[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  font-size: 14px !important;\n  font-weight: 400;\n}\n\n.tbody[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 300;\n}\n\n.rejectBTN[_ngcontent-%COMP%] {\n  color: #f4831f;\n  background-color: transparent;\n  border: solid 1px #f4831f;\n  font-family: \"Cairo\";\n}\n\n.approveBTN[_ngcontent-%COMP%], .reviewBTN[_ngcontent-%COMP%] {\n  color: white;\n  background-color: #513982;\n  font-family: \"Cairo\";\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBlbmRpbmctdHJhbnNwb3J0YXRpb25zLmNvbXBvbmVudC5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXF9jb2xvcnMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNJLFdBQUE7QUFBSjs7QUFJSTtFQUNJLDBCQUFBO0VBQ0EsZ0JBQUE7QUFEUjs7QUFNSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtBQUhSOztBQU9BO0VBQ0ksY0NuQnVCO0VEb0J2Qiw2QkFBQTtFQUNBLHlCQUFBO0VBQ0Esb0JDbkJhO0FEZWpCOztBQU9BOztFQUVJLFlBQUE7RUFDQSx5QkM3Qlk7RUQ4Qlosb0JDMUJhO0FEc0JqQiIsImZpbGUiOiJwZW5kaW5nLXRyYW5zcG9ydGF0aW9ucy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uLy4uL2NvbG9ycyc7XHJcbnRhYmxlIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4udEhlYWRlciB7XHJcbiAgICB0aCB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4ICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcclxuICAgIH1cclxufVxyXG5cclxuLnRib2R5IHtcclxuICAgIHRoIHtcclxuICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDMwMDtcclxuICAgIH1cclxufVxyXG5cclxuLnJlamVjdEJUTiB7XHJcbiAgICBjb2xvcjogJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxuICAgIGJvcmRlcjogc29saWQgMXB4ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxufVxyXG5cclxuLmFwcHJvdmVCVE4sXHJcbi5yZXZpZXdCVE4ge1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxufVxyXG5cclxuLy8gLmhlYWRlciB7XHJcbi8vICAgICBmb250LXdlaWdodDogYm9sZDtcclxuLy8gICAgIGZvbnQtc2l6ZTogbGFyZ2U7XHJcbi8vICAgICBib3JkZXI6IHNvbGlkIDFweCAjYTE5ZWEwO1xyXG4vLyAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuLy8gfVxyXG4vLyAuYm9keSB7XHJcbi8vICAgICBib3JkZXI6IHNvbGlkIDFweCAjYTE5ZWEwO1xyXG4vLyAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuLy8gfVxyXG4vLyAubW9kYWwtYm9keSB7XHJcbi8vICAgICBoMyB7XHJcbi8vICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuLy8gICAgICAgICBzcGFuIHtcclxuLy8gICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vIH0iLCIkbWFpblRoZW1lQ29sb3I6IzUxMzk4MjtcclxuJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I6I2Y0ODMxZjsgLy8jRjU4MjFGO1xyXG4kc2Vjb25kRm9udENvbG9yOiM3MDcwNzA7XHJcbiR3aGl0ZUNvbG9yOiNmZmY7XHJcbiRtYWluRm9udEZhbWlseTogJ0NhaXJvJzsiXX0= */"] });


/***/ }),

/***/ 50154:
/*!****************************************************************!*\
  !*** ./src/app/components/admin/admin/admin-routing.module.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AdminRoutingModule": () => (/* binding */ AdminRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 71258);
/* harmony import */ var src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/services/manager.guard */ 56913);
/* harmony import */ var _admin_panel_admin_vacations_admin_vacations_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../admin-panel/admin-vacations/admin-vacations.component */ 41015);
/* harmony import */ var _admin_panel_dash_board_dash_board_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../admin-panel/dash-board/dash-board.component */ 79320);
/* harmony import */ var _admin_panel_monthly_transportation_sheet_monthly_transportation_sheet_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../admin-panel/monthly-transportation-sheet/monthly-transportation-sheet.component */ 39584);
/* harmony import */ var _admin_panel_pending_transportations_pending_transportations_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../admin-panel/pending-transportations/pending-transportations.component */ 32626);
/* harmony import */ var _admin_panel_announcements_announcements_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../admin-panel/announcements/announcements.component */ 55958);
/* harmony import */ var _dev_components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../dev/components/time-sheet/time-sheet.component */ 66171);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 2316);










const routes = [
    { path: 'dashboard', component: _admin_panel_dash_board_dash_board_component__WEBPACK_IMPORTED_MODULE_2__.DashBoardComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
    { path: 'vacations', component: _admin_panel_admin_vacations_admin_vacations_component__WEBPACK_IMPORTED_MODULE_1__.AdminVacationsComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
    { path: 'pendingtransportations', component: _admin_panel_pending_transportations_pending_transportations_component__WEBPACK_IMPORTED_MODULE_4__.PendingTransportationsComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
    { path: 'transportationsheet', component: _admin_panel_monthly_transportation_sheet_monthly_transportation_sheet_component__WEBPACK_IMPORTED_MODULE_3__.MonthlyTransportationSheetComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
    { path: 'announces', component: _admin_panel_announcements_announcements_component__WEBPACK_IMPORTED_MODULE_5__.AnnouncementsComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
    { path: 'timesheet', component: _dev_components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_6__.TimeSheetComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
];
class AdminRoutingModule {
}
AdminRoutingModule.ɵfac = function AdminRoutingModule_Factory(t) { return new (t || AdminRoutingModule)(); };
AdminRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({ type: AdminRoutingModule });
AdminRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](AdminRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule] }); })();


/***/ })

}]);
//# sourceMappingURL=default-src_app_components_admin_admin_admin-routing_module_ts.js.map