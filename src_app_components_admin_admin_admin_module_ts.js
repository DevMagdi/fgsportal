"use strict";
(self["webpackChunkfgsPM"] = self["webpackChunkfgsPM"] || []).push([["src_app_components_admin_admin_admin_module_ts"],{

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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/tabs */ 12379);
/* harmony import */ var _pending_vacation_requests_pending_vacation_requests_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pending-vacation-requests/pending-vacation-requests.component */ 38414);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _official_vacations_official_vacations_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./official-vacations/official-vacations.component */ 4866);







function AdminVacationsComponent_mat_tab_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-tab", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "app-official-vacations");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
class AdminVacationsComponent {
    constructor(_auth) {
        this._auth = _auth;
        this.DepartmentEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_0__.Department;
        this.AccountRolesEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_0__.AccountRoles;
    }
    ngOnInit() {
        this._auth.user.subscribe(user => {
            this.currentUser = user;
        });
    }
}
AdminVacationsComponent.ɵfac = function AdminVacationsComponent_Factory(t) { return new (t || AdminVacationsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_1__.AuthApiService)); };
AdminVacationsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: AdminVacationsComponent, selectors: [["app-admin-vacations"]], decls: 7, vars: 1, consts: [[1, "container-fluid"], [1, "row"], [1, "col-md-12", "mt-3"], ["mat-align-tabs", "left", 1, "mx-3", "px-3"], ["label", "Pending Requests"], ["label", "Official Vacations", 4, "ngIf"], ["label", "Official Vacations"]], template: function AdminVacationsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "mat-tab-group", 3)(4, "mat-tab", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](5, "app-pending-vacation-requests");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, AdminVacationsComponent_mat_tab_6_Template, 2, 0, "mat-tab", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !!ctx.currentUser && (ctx.currentUser.department == ctx.DepartmentEnum.MANAGEMENT || ctx.currentUser.accRole == ctx.AccountRolesEnum.HUMAN_RESOURCE));
    } }, directives: [_angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabGroup, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTab, _pending_vacation_requests_pending_vacation_requests_component__WEBPACK_IMPORTED_MODULE_2__.PendingVacationRequestsComponent, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _official_vacations_official_vacations_component__WEBPACK_IMPORTED_MODULE_3__.OfficialVacationsComponent], styles: [".mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {\n  background-color: #f4831f !important;\n}\n\n  .mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {\n  background-color: rgba(244, 131, 31, 0.5) !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluLXZhY2F0aW9ucy5jb21wb25lbnQuc2NzcyIsIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcRkdTJTIwVGFzayUyME1hbmFnZW1lbnQlMjBTeXN0ZW1cXGZnc3RtX3VpXFxzcmNcXGFwcFxcY29tcG9uZW50c1xcYWRtaW5cXGFkbWluLXBhbmVsXFxhZG1pbi12YWNhdGlvbnNcXGFkbWluLXZhY2F0aW9ucy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNJLG9DQUFBO0FDQUo7O0FER0E7RUFDSSxvREFBQTtBQ0FKIiwiZmlsZSI6ImFkbWluLXZhY2F0aW9ucy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uLy4uL2NvbG9ycyc7XHJcbjo6bmctZGVlcCAubWF0LXNsaWRlLXRvZ2dsZS5tYXQtY2hlY2tlZDpub3QoLm1hdC1kaXNhYmxlZCkgLm1hdC1zbGlkZS10b2dnbGUtdGh1bWIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3IgIWltcG9ydGFudDtcclxufVxyXG5cclxuOjpuZy1kZWVwIC5tYXQtc2xpZGUtdG9nZ2xlLm1hdC1jaGVja2VkOm5vdCgubWF0LWRpc2FibGVkKSAubWF0LXNsaWRlLXRvZ2dsZS1iYXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgkY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yLCAkYWxwaGE6IDAuNSkgIWltcG9ydGFudDsgLy9yZ2JhKDU1LCAxNTUsIDE2NSwgMC40OSk7XHJcbn1cclxuXHJcblxyXG4vLyAvKiBhY3RpdmUgdGFiICovXHJcblxyXG4vLyA6Om5nLWRlZXAgLm1hdC10YWItbGlzdCAubWF0LXRhYi1sYWJlbHMgLm1hdC10YWItbGFiZWwge1xyXG4vLyAgICAgY29sb3I6ICMxMDBmMGY7XHJcbi8vICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xyXG4vLyB9XHJcblxyXG4vLyA6Om5nLWRlZXAgLm1hdC10YWItbGlzdCAubWF0LXRhYi1sYWJlbHMgLm1hdC10YWItbGFiZWwtYWN0aXZlIHtcclxuLy8gICAgIGNvbG9yOiAjZmZmO1xyXG4vLyAgICAgYmFja2dyb3VuZC1jb2xvcjogJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3IgIWltcG9ydGFudDtcclxuLy8gfVxyXG5cclxuXHJcbi8vIC8qIGluayBiYXIgKi9cclxuXHJcbi8vICA6Om5nLWRlZXAgLm1hdC1pbmstYmFyIHtcclxuLy8gICAgIGJhY2tncm91bmQtY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yICFpbXBvcnRhbnQ7IC8vIHZhcigtLXByaW1hcnktY29sb3IsICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yKSAhaW1wb3J0YW50O1xyXG4vLyB9IiwiOjpuZy1kZWVwIC5tYXQtc2xpZGUtdG9nZ2xlLm1hdC1jaGVja2VkOm5vdCgubWF0LWRpc2FibGVkKSAubWF0LXNsaWRlLXRvZ2dsZS10aHVtYiB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNDgzMWYgIWltcG9ydGFudDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtc2xpZGUtdG9nZ2xlLm1hdC1jaGVja2VkOm5vdCgubWF0LWRpc2FibGVkKSAubWF0LXNsaWRlLXRvZ2dsZS1iYXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0NCwgMTMxLCAzMSwgMC41KSAhaW1wb3J0YW50O1xufSJdfQ== */"] });


/***/ }),

/***/ 4866:
/*!*****************************************************************************************************************!*\
  !*** ./src/app/components/admin/admin-panel/admin-vacations/official-vacations/official-vacations.component.ts ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OfficialVacationsComponent": () => (/* binding */ OfficialVacationsComponent)
/* harmony export */ });
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var primeng_blockui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/blockui */ 98015);
/* harmony import */ var primeng_progressspinner__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/progressspinner */ 60120);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ 44770);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/input */ 43365);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/datepicker */ 5818);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);













class OfficialVacationsComponent {
    constructor(_notify, _auth, _db) {
        this._notify = _notify;
        this._auth = _auth;
        this._db = _db;
        this.officialVacationLoading = false;
    }
    ngOnInit() {
        this._auth.user.subscribe(user => {
            this.currentUser = user;
        });
    }
    openDatePicker(dp) {
        dp.open();
    }
    closeDatePicker(eventData, fromOrTo, dp) {
        // get month and year from eventData and close datepicker, thus not allowing user to select date    
        if (fromOrTo = 'from') {
            this.from = eventData;
        }
        else {
            this.to = eventData;
        }
        dp.close();
    }
    validateDates() {
        if (this.from > this.to || !this.details || this.details.length == 0) {
            this._notify.openSnackbar(`Invalid`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
        }
        else {
            this.submitVacation();
        }
    }
    submitVacation() {
        this.officialVacationLoading = true;
        const createVacatioReq = {
            start_date: this._db.getDateFormatted(this.from),
            end_date: this._db.getDateFormatted(this.to),
            manager_approve_id: this.currentUser.key || '',
            report_details: this.details
        };
        this._db.createVacationDays(createVacatioReq).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                this._notify.openSnackbar('Success', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                this.details = '';
                this.from = new Date();
                this.to = new Date();
                this.officialVacationLoading = false;
            }
            else {
                this.officialVacationLoading = false;
            }
        }, err => {
            this.officialVacationLoading = false;
        });
    }
}
OfficialVacationsComponent.ɵfac = function OfficialVacationsComponent_Factory(t) { return new (t || OfficialVacationsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_2__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_3__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_4__.DatabaseService)); };
OfficialVacationsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({ type: OfficialVacationsComponent, selectors: [["app-official-vacations"]], decls: 22, vars: 8, consts: [[2, "width", "100vw", "height", "100vh", 3, "blocked"], [1, "row", "m-auto", "justify-content-center"], [1, "card", "col-md-6", "border-0", "mt-4", "p-4"], [1, ""], [1, "my-2"], [1, "w-100"], ["matInput", "", "readonly", "", "autocomplete", "off", "placeholder", "From", 3, "matDatepicker", "ngModel", "click", "ngModelChange"], ["matSuffix", "", 3, "for"], [3, "viewChanged"], ["dp", ""], ["matInput", "", "readonly", "", "autocomplete", "off", "placeholder", "To", 3, "matDatepicker", "ngModel", "click", "ngModelChange"], ["dp2", ""], ["placeholder", "Details: Ex. 6 October Vacation", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "btn", "btnStyle", "w-100", "mt-2", 3, "click"]], template: function OfficialVacationsComponent_Template(rf, ctx) { if (rf & 1) {
        const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "p-blockUI", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "p-progressSpinner");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "div", 1)(3, "div", 2)(4, "div", 3)(5, "div", 4)(6, "mat-form-field", 5)(7, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function OfficialVacationsComponent_Template_input_click_7_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r2); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](10); return ctx.openDatePicker(_r0); })("ngModelChange", function OfficialVacationsComponent_Template_input_ngModelChange_7_listener($event) { return ctx.from = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](8, "mat-datepicker-toggle", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](9, "mat-datepicker", 8, 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("viewChanged", function OfficialVacationsComponent_Template_mat_datepicker_viewChanged_9_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r2); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](10); return ctx.closeDatePicker($event, "from", _r0); });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](11, "div", 4)(12, "mat-form-field", 5)(13, "input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function OfficialVacationsComponent_Template_input_click_13_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r2); const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](16); return ctx.openDatePicker(_r1); })("ngModelChange", function OfficialVacationsComponent_Template_input_ngModelChange_13_listener($event) { return ctx.to = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](14, "mat-datepicker-toggle", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](15, "mat-datepicker", 8, 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("viewChanged", function OfficialVacationsComponent_Template_mat_datepicker_viewChanged_15_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r2); const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](16); return ctx.closeDatePicker($event, "to", _r1); });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](17, "div", 4)(18, "input", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("ngModelChange", function OfficialVacationsComponent_Template_input_ngModelChange_18_listener($event) { return ctx.details = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](19, "div", 3)(20, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function OfficialVacationsComponent_Template_button_click_20_listener() { return ctx.validateDates(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](21, "Submit");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()();
    } if (rf & 2) {
        const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](10);
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("blocked", ctx.officialVacationLoading);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matDatepicker", _r0)("ngModel", ctx.from);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("for", _r0);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matDatepicker", _r1)("ngModel", ctx.to);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("for", _r1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngModel", ctx.details);
    } }, directives: [primeng_blockui__WEBPACK_IMPORTED_MODULE_6__.BlockUI, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_7__.ProgressSpinner, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatFormField, _angular_material_input__WEBPACK_IMPORTED_MODULE_9__.MatInput, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_10__.MatDatepickerInput, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatus, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_12__.NativeElementInjectorDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgModel, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_10__.MatDatepickerToggle, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatSuffix, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_10__.MatDatepicker], styles: [".generateBtn[_ngcontent-%COMP%] {\n  background-color: #513982;\n  color: #fff;\n  margin: auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9mZmljaWFsLXZhY2F0aW9ucy5jb21wb25lbnQuc2NzcyIsIi4uXFwuLlxcLi5cXC4uXFwuLlxcX2NvbG9ycy5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcRkdTJTIwVGFzayUyME1hbmFnZW1lbnQlMjBTeXN0ZW1cXGZnc3RtX3VpXFxzcmNcXGFwcFxcY29tcG9uZW50c1xcYWRtaW5cXGFkbWluLXBhbmVsXFxhZG1pbi12YWNhdGlvbnNcXG9mZmljaWFsLXZhY2F0aW9uc1xcb2ZmaWNpYWwtdmFjYXRpb25zLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0kseUJDRlk7RURHWixXQUFBO0VBQ0EsWUFBQTtBRUFKIiwiZmlsZSI6Im9mZmljaWFsLXZhY2F0aW9ucy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uLy4uLy4uL2NvbG9ycyc7XHJcbi5nZW5lcmF0ZUJ0biB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgIG1hcmdpbjogYXV0bztcclxufSIsIiRtYWluVGhlbWVDb2xvcjojNTEzOTgyO1xyXG4kc3ViVGhlbWVDb2xvcjojNzQ2MTlCO1xyXG4kc3ViU3ViVGhlbWVDb2xvcjojOTc4OEI0O1xyXG4kc29mdFRoZW1lQ29sb3I6I0VFRUJGMztcclxuJGJvcmRlckNvbG9yOiNDQkM0REE7XHJcbiRidXR0b25NYWluQmFja2dyb3VuZENvbG9yOiNmNDgzMWY7IC8vI0Y1ODIxRjtcclxuJGJ1dHRvblN1YkJhY2tncm91bmRDb2xvcjojRkZBQjAwOyAvLyNGNTgyMUY7XHJcbiRidXR0b25TdWJTdWJCYWNrZ3JvdW5kQ29sb3I6I0ZFN0UxNTsgLy8jRjU4MjFGO1xyXG4kc2Vjb25kRm9udENvbG9yOiM3MDcwNzA7XHJcbiRncmF5QmFja0dyb3VuZENvbG9yOiNGNkY3Rjg7XHJcbiR3aGl0ZUNvbG9yOiNmZmY7XHJcbiRtYWluRm9udEZhbWlseTogJ0NhaXJvJztcclxuJHNvZnRHcmF5QmFja0dyb3VuZENvbG9yOiNGQ0ZDRkM7XHJcbiRiZ0xpZ2h0OiNGQUZCRkM7XHJcbiR0YWJCYWNrR3JvdW5kOiNmMWVjZjA7IiwiLmdlbmVyYXRlQnRuIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzUxMzk4MjtcbiAgY29sb3I6ICNmZmY7XG4gIG1hcmdpbjogYXV0bztcbn0iXX0= */"] });


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
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ 3191);
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_annualLeave__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/annualLeave */ 80148);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/animations */ 31631);
/* harmony import */ var src_app_components_dev_components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/components/dev/components/time-sheet/time-sheet.component */ 66171);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/environments/environment */ 92340);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/messaging.service */ 64271);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 52816);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/divider */ 19975);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/tooltip */ 40089);
/* harmony import */ var primeng_sidebar__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! primeng/sidebar */ 49734);





















function PendingVacationRequestsComponent_div_0_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 13)(1, "div", 14)(2, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_div_0_div_1_Template_button_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r11); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2); return ctx_r10.openResetPermissionPanel(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](ctx_r8.isResetPanelOpened ? "close" : "Edit Permission Balance");
} }
function PendingVacationRequestsComponent_div_0_tr_19_td_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](leave_r12.from);
} }
function PendingVacationRequestsComponent_div_0_tr_19_td_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](2, 1, leave_r12.from, "dd/MM/yyyy"));
} }
function PendingVacationRequestsComponent_div_0_tr_19_td_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](leave_r12.to);
} }
function PendingVacationRequestsComponent_div_0_tr_19_td_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](2, 1, leave_r12.to, "dd/MM/yyyy"));
} }
function PendingVacationRequestsComponent_div_0_tr_19_a_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "a", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "Attach");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate2"]("href", "", ctx_r17.newServerApi, "", leave_r12.attach, "", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵsanitizeUrl"]);
} }
function PendingVacationRequestsComponent_div_0_tr_19_p_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} }
function PendingVacationRequestsComponent_div_0_tr_19_td_12_Template(rf, ctx) { if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "td", 23)(1, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_div_0_tr_19_td_12_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r28); const leave_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit; const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2); const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵreference"](2); return ctx_r27.open(_r1, leave_r12, true); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2, "Approve");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
} }
function PendingVacationRequestsComponent_div_0_tr_19_td_13_Template(rf, ctx) { if (rf & 1) {
    const _r31 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "td", 23)(1, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_div_0_tr_19_td_13_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r31); const leave_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit; const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2); const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵreference"](2); return ctx_r30.open(_r1, leave_r12, false); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2, "Reject");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
} }
function PendingVacationRequestsComponent_div_0_tr_19_td_14_Template(rf, ctx) { if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "td", 11)(1, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_div_0_tr_19_td_14_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r34); const leave_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit; const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2); const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵreference"](2); return ctx_r33.openForAdmin(_r1, leave_r12); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2, "Review");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
} }
const _c0 = function (a1) { return ["/user/", a1]; };
function PendingVacationRequestsComponent_div_0_tr_19_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "tr", 16)(1, "td", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](5, PendingVacationRequestsComponent_div_0_tr_19_td_5_Template, 2, 1, "td", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](6, PendingVacationRequestsComponent_div_0_tr_19_td_6_Template, 3, 4, "td", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](7, PendingVacationRequestsComponent_div_0_tr_19_td_7_Template, 2, 1, "td", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](8, PendingVacationRequestsComponent_div_0_tr_19_td_8_Template, 3, 4, "td", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](9, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](10, PendingVacationRequestsComponent_div_0_tr_19_a_10_Template, 2, 2, "a", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](11, PendingVacationRequestsComponent_div_0_tr_19_p_11_Template, 2, 0, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](12, PendingVacationRequestsComponent_div_0_tr_19_td_12_Template, 3, 0, "td", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](13, PendingVacationRequestsComponent_div_0_tr_19_td_13_Template, 3, 0, "td", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](14, PendingVacationRequestsComponent_div_0_tr_19_td_14_Template, 3, 0, "td", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const leave_r12 = ctx.$implicit;
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction1"](12, _c0, leave_r12.empKey));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](leave_r12.empName);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](leave_r12.leaveType_name);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", leave_r12.leaveType == ctx_r9.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", leave_r12.leaveType != ctx_r9.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", leave_r12.leaveType == ctx_r9.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", leave_r12.leaveType != ctx_r9.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !!leave_r12.attach);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !leave_r12.attach);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !!ctx_r9.currenUser && (ctx_r9.currenUser.department == ctx_r9.DepartmentEnum.MANAGEMENT || ctx_r9.currenUser.accPosition == ctx_r9.accPosistionEnum.MANAGER));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !!ctx_r9.currenUser && (ctx_r9.currenUser.department == ctx_r9.DepartmentEnum.MANAGEMENT || ctx_r9.currenUser.accPosition == ctx_r9.accPosistionEnum.MANAGER));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !!ctx_r9.currenUser && ctx_r9.currenUser.department == ctx_r9.DepartmentEnum.ADMINSTRATION);
} }
function PendingVacationRequestsComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](1, PendingVacationRequestsComponent_div_0_div_1_Template, 4, 1, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](2, "div", 8)(3, "table", 9)(4, "thead")(5, "tr", 10)(6, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](7, "Employee Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](8, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](9, "Leave Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](10, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](11, "From");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](12, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](13, "To");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](14, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](15, "Attach");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](16, "td", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](17, "Approve/Reject");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](18, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](19, PendingVacationRequestsComponent_div_0_tr_19_Template, 15, 14, "tr", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r0.currenUser.department == ctx_r0.DepartmentEnum.MANAGEMENT || ctx_r0.currenUser.department == ctx_r0.DepartmentEnum.ADMINSTRATION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngForOf", ctx_r0.leavesToApprove.slice().reverse());
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_span_20_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r38.leaveToReview.from, " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_span_21_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](2, 1, ctx_r39.leaveToReview.from, "dd/MM/yyyy"), " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_span_26_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r40.leaveToReview.to, " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_span_27_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](2, 1, ctx_r41.leaveToReview.to, "dd/MM/yyyy"), " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_35_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 35)(1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2, "Attach : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "a", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](5, "img", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate2"]("href", "", ctx_r42.newServerApi, "", ctx_r42.leaveToReview.attach, "", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate2"]("src", "", ctx_r42.newServerApi, "", ctx_r42.leaveToReview.attach, "", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵsanitizeUrl"]);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_span_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r45.calculateLeaveDuration(), " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_span_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](3, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](2, 2, ctx_r46.math.floor(ctx_r46.calculatePermissionDuration() / 60), "2.0-0"), ":", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](3, 5, ctx_r46.calculatePermissionDuration() - ctx_r46.math.floor(ctx_r46.calculatePermissionDuration() / 60) * 60, "2.0-0"), " hh:mm ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_option_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "option", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const admin_r50 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("value", admin_r50.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](admin_r50.username);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_Template(rf, ctx) { if (rf & 1) {
    const _r52 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 34)(1, "div", 46)(2, "label", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3, "Assign To HR");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "select", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_Template_select_ngModelChange_4_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r52); const ctx_r51 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4); return ctx_r51.leaveToReview.hrToApproveKey = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](5, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_option_5_Template, 2, 2, "option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](6, "div", 46)(7, "label", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](8, "Comment (Optional)");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](9, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](10, "input", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_Template_input_ngModelChange_10_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r52); const ctx_r53 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4); return ctx_r53.leaveToReview.managerDissisionComment = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", ctx_r47.leaveToReview.hrToApproveKey);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngForOf", ctx_r47.admins);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", ctx_r47.leaveToReview.managerDissisionComment);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_9_Template(rf, ctx) { if (rf & 1) {
    const _r55 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 34)(1, "div", 46)(2, "label", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3, "Rejection Reason");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "input", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_9_Template_input_ngModelChange_5_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r55); const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4); return ctx_r54.leaveToReview.managerDissisionComment = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", ctx_r48.leaveToReview.managerDissisionComment);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_Template(rf, ctx) { if (rf & 1) {
    const _r57 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 42)(1, "div", 34)(2, "div", 35)(3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](5, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](6, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_span_6_Template, 2, 1, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](7, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_span_7_Template, 4, 8, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](8, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_8_Template, 11, 3, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](9, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_div_9_Template, 6, 1, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](10, "div", 44)(11, "button", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_ng_template_1_div_6_div_36_Template_button_click_11_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r57); const modal_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2).$implicit; const ctx_r56 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](); ctx_r56.managerDissition(ctx_r56.leaveToReview); return modal_r36.close("Save click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](12, "Submit");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"]("", ctx_r43.leaveToReview.leaveType == ctx_r43.leaveTypeEnum.PERMISSION ? "Permission" : "Leave", " Duration : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r43.leaveToReview.leaveType != ctx_r43.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r43.leaveToReview.leaveType == ctx_r43.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r43.dissision == true);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r43.dissision == false);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("disabled", !!ctx_r43.dissision && !ctx_r43.leaveToReview.hrToApproveKey || !ctx_r43.dissision && !ctx_r43.leaveToReview.managerDissisionComment);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 35)(1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2, "Manager comment : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r59 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r59.leaveToReview.managerDissisionComment, " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 34)(1, "div", 35)(2, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3, "User Annual Balance : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](7, "div", 35)(8, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](9, "User Current Balance : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](10, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](11, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
} if (rf & 2) {
    const ctx_r60 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r60.userAnnualLeaveBalance, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r60.userLeaveBalance, " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 34)(1, "div", 35)(2, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3, "Annual permission Balance ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](7, "div", 35)(8, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](9, "Current Permission Balance ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](10, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](11, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](13, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](14, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
} if (rf & 2) {
    const ctx_r61 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r61.userAnnualPermissionBalance, " Hours ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](13, 3, ctx_r61.math.floor(ctx_r61.userPermissionBalance / 60), "2.0-0"), ":", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](14, 6, ctx_r61.userPermissionBalance - ctx_r61.math.floor(ctx_r61.userPermissionBalance / 60) * 60, "2.0-0"), " hh:mm ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_span_17_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r62.calculateLeaveDuration(), " ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_span_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](3, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](2, 2, ctx_r63.math.floor(ctx_r63.calculatePermissionDuration() / 60), "2.0-0"), ":", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](3, 5, ctx_r63.calculatePermissionDuration() - ctx_r63.math.floor(ctx_r63.calculatePermissionDuration() / 60) * 60, "2.0-0"), " hh:mm ");
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_Template(rf, ctx) { if (rf & 1) {
    const _r65 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 52)(1, "div", 34)(2, "div", 35)(3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4, "Manager Approved : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](5, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](6, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](8, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_8_Template, 6, 1, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](9, "mat-divider");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](10, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_10_Template, 13, 2, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](11, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_div_11_Template, 15, 9, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](12, "div", 34)(13, "div", 35)(14, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](16, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](17, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_span_17_Template, 2, 1, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](18, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_span_18_Template, 4, 8, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](19, "mat-divider");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](20, "div", 35)(21, "label", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](22, "Rejection Reason (optional On Approval Only)");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](23, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](24, "input", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_Template_input_ngModelChange_24_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r65); const ctx_r64 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3); return ctx_r64.leaveToReview.hrDissisionComment = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](25, "div", 44)(26, "button", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_Template_button_click_26_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r65); const modal_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2).$implicit; const ctx_r66 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](); ctx_r66.hrAction(ctx_r66.leaveToReview, true); return modal_r36.close("Save click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](27, "Approve");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](28, "button", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_ng_template_1_div_6_div_37_Template_button_click_28_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r65); const modal_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2).$implicit; const ctx_r68 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](); ctx_r68.hrAction(ctx_r68.leaveToReview, false); return modal_r36.close("Save click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](29, "Reject");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r44.leaveToReview.managerDissisionName, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r44.leaveToReview.managerDissisionComment);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r44.leaveToReview.leaveType != ctx_r44.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r44.leaveToReview.leaveType == ctx_r44.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"]("", ctx_r44.leaveToReview.leaveType == ctx_r44.leaveTypeEnum.PERMISSION ? "Permission" : "Leave", " Duration : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r44.leaveToReview.leaveType != ctx_r44.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r44.leaveToReview.leaveType == ctx_r44.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", ctx_r44.leaveToReview.hrDissisionComment);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("disabled", !ctx_r44.leaveToReview.hrDissisionComment);
} }
function PendingVacationRequestsComponent_ng_template_1_div_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 32)(1, "div", 33)(2, "div", 34)(3, "div", 35)(4, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](5, "Request BY : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](6, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](7, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](9, "div", 35)(10, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](11, "Leave Type : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](12, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](13, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](15, "div", 34)(16, "div", 35)(17, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](18, "From : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](19, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](20, PendingVacationRequestsComponent_ng_template_1_div_6_span_20_Template, 2, 1, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](21, PendingVacationRequestsComponent_ng_template_1_div_6_span_21_Template, 3, 4, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](22, "div", 35)(23, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](24, "To : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](25, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](26, PendingVacationRequestsComponent_ng_template_1_div_6_span_26_Template, 2, 1, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](27, PendingVacationRequestsComponent_ng_template_1_div_6_span_27_Template, 3, 4, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](28, "div", 34)(29, "div", 35)(30, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](31, "Reason : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](32, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](33, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](35, PendingVacationRequestsComponent_ng_template_1_div_6_div_35_Template, 6, 4, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](36, PendingVacationRequestsComponent_ng_template_1_div_6_div_36_Template, 13, 6, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](37, PendingVacationRequestsComponent_ng_template_1_div_6_div_37_Template, 30, 9, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r37.leaveToReview.empName, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r37.leaveToReview.leaveType_name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r37.leaveToReview.leaveType == ctx_r37.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r37.leaveToReview.leaveType != ctx_r37.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r37.leaveToReview.leaveType == ctx_r37.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r37.leaveToReview.leaveType != ctx_r37.leaveTypeEnum.PERMISSION);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r37.leaveToReview.reason, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !!ctx_r37.leaveToReview.attach);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !!ctx_r37.currenUser && (ctx_r37.currenUser.department == ctx_r37.DepartmentEnum.MANAGEMENT || ctx_r37.currenUser.accPosition == ctx_r37.accPosistionEnum.MANAGER));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !!ctx_r37.currenUser && ctx_r37.currenUser.department == ctx_r37.DepartmentEnum.ADMINSTRATION);
} }
function PendingVacationRequestsComponent_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    const _r71 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 27)(1, "h4", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2, "Leave Request Review");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "button", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_ng_template_1_Template_button_click_3_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r71); const modal_r36 = restoredCtx.$implicit; return modal_r36.dismiss("Cross click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "span", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](5, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](6, PendingVacationRequestsComponent_ng_template_1_div_6_Template, 38, 10, "div", 31);
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r2.leaveToReview);
} }
class PendingVacationRequestsComponent {
    constructor(modalService, _notify, _message, _db, _auth) {
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
        this.birth = 0;
        this.birth_f = 0;
        this.DepartmentEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department;
        this.accPosistionEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.AccountPositions;
        this.leaveStatusEnum = src_app_interfaces_annualLeave__WEBPACK_IMPORTED_MODULE_1__.leaveFinalStatus;
        this.newServerApi = src_environments_environment__WEBPACK_IMPORTED_MODULE_5__.environment.newServerApi;
    }
    ngOnInit() {
        this._auth.user.subscribe((user) => {
            this.currenUser = user;
            this.getMyRequests();
            if (this.currenUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department.MANAGEMENT || (this.currenUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department.TECHNICAL_TEAM && this.currenUser.accPosition == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.AccountPositions.MANAGER)) {
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
        else if (this.currenUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department.TECHNICAL_TEAM && this.currenUser.accPosition == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.AccountPositions.MANAGER) {
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
            }
        }, err => {
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
    // getUserLeavesBalance(){
    // const userSubscription:Subscription = this.auth.getUserByKey(this.leaveToReview?.empKey || '').subscribe(
    //   (user)=>{
    //     userSubscription.unsubscribe();
    //     this.empData = user ;
    //     this.userLeaveBalance = user.currentLeaveBalance?user.currentLeaveBalance : 0; 
    //     this.userAnnualLeaveBalance = user.annualLeaveBalance?user.annualLeaveBalance : 0; 
    //     this.userPermissionBalance = user.currentPermissionBalance?user.currentPermissionBalance : 0; 
    //     this.userAnnualPermissionBalance = user.annualPermissionBalance?user.annualPermissionBalance : 0; 
    //   }
    // )
    // }
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
            }
        }, err => {
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
            this.userLeaveBalance = 0;
            this.userAnnualLeaveBalance = 0;
            this.userPermissionBalance = 0;
            this.userAnnualPermissionBalance = 0;
        });
        this.leaveToReview = annualLeave;
        // this.getUserLeavesBalance()
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    getDismissReason(reason) {
        this.leaveToReview = undefined;
        if (reason === _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_11__.ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_11__.ModalDismissReasons.BACKDROP_CLICK) {
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
                    this.birth = res['data']['birth'];
                    this.birth_f = res['data']['birth_f'];
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
            marriage: this.marriage,
            birth: this.birth,
            birth_f: this.birth_f
        };
        this._db.resetUserspermissons(newPer).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_4__.ResStatus.CRUD) {
                this._notify.openSnackbar('Monthly Permission Updated Successfully', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success, 3000);
                this.newPerBalance = 0;
                this.bereavement = 0;
                this.marriage = 0;
                this.birth = 0;
                this.birth_f = 0;
                this.openResetPermissionPanel();
            }
            else {
                this._notify.openSnackbar('Error', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error, 3000);
            }
        }, err => {
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
PendingVacationRequestsComponent.ɵfac = function PendingVacationRequestsComponent_Factory(t) { return new (t || PendingVacationRequestsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_11__.NgbModal), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_6__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_7__.MessagingService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_8__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_9__.AuthApiService)); };
PendingVacationRequestsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineComponent"]({ type: PendingVacationRequestsComponent, selectors: [["app-pending-vacation-requests"]], decls: 33, vars: 11, consts: [["class", "container", 4, "ngIf"], ["mymodal", ""], ["styleClass", "p-sidebar-sm", "position", "right", 1, "side", 3, "baseZIndex", "autoZIndex", "visible", "transitionOptions", "visibleChange"], ["type", "number", "id", "perNum", "placeholder", "Ex.3", 1, "form-control", 3, "ngModel", "ngModelChange"], ["perNum", ""], ["type", "submit", 1, "my-3", "btn", "btnStyle", "w-100", 3, "disabled", "click"], [1, "container"], ["class", "d-flex justify-content-end my-3", 4, "ngIf"], [1, "table-responsive"], [1, "table", "newTableCustom"], [1, "p-3"], [1, "col-md-2"], ["class", "p-3 my-1 ", 4, "ngFor", "ngForOf"], [1, "d-flex", "justify-content-end", "my-3"], [1, ""], [1, "m-2", "btn", "btnOutLine", 3, "click"], [1, "p-3", "my-1"], [1, "col-md-2", 2, "cursor", "pointer", 3, "routerLink"], ["class", "col-md-2", 4, "ngIf"], ["target", "_blank", 3, "href", 4, "ngIf"], [4, "ngIf"], ["class", "col-md-1", 4, "ngIf"], ["target", "_blank", 3, "href"], [1, "col-md-1"], [1, "btn", "btn-outline-info", 3, "click"], [1, "btn", "btn-outline-danger", 3, "click"], [1, "btn", "btn-outline-success", 3, "click"], [1, "modal-header"], ["id", "modal-basic-title", 1, "modal-title"], ["type", "button", "aria-label", "Close", 1, "close", 3, "click"], ["aria-hidden", "true"], ["class", "modal-body", 4, "ngIf"], [1, "modal-body"], [1, "container-fluid"], [1, "row"], [1, "col-md-6"], [1, "modalInfo", "pl-2"], ["class", "modalInfo pl-2", 4, "ngIf"], ["class", "col-md-6", 4, "ngIf"], ["class", "manager", 4, "ngIf"], ["class", "admin", 4, "ngIf"], ["alt", "Request Attach", "width", "100px", "height", "100px", 3, "src"], [1, "manager"], ["class", "row", 4, "ngIf"], [1, "modal-footer"], ["type", "submit", 1, "btn", "btn-info", 3, "disabled", "click"], [1, "col-md-12"], ["for", ""], ["name", "adminKey", "id", "adminKey", 1, "form-control", 3, "ngModel", "ngModelChange"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "text", 1, "form-control", 3, "ngModel", "ngModelChange"], [3, "value"], [1, "admin"], ["type", "submit", 1, "btn", "btn-info", 3, "click"], ["type", "submit", "matTooltip", "Please Add A rejection Reason", 1, "btn", "btn-outline-danger", 3, "disabled", "click"]], template: function PendingVacationRequestsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](0, PendingVacationRequestsComponent_div_0_Template, 20, 2, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](1, PendingVacationRequestsComponent_ng_template_1_Template, 7, 1, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "p-sidebar", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("visibleChange", function PendingVacationRequestsComponent_Template_p_sidebar_visibleChange_3_listener($event) { return ctx.isResetPanelOpened = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](5, "Please Enter New Permission Balance");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](6, "div")(7, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](8, "Permission");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](9, "input", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_Template_input_ngModelChange_9_listener($event) { return ctx.newPerBalance = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](11, "div")(12, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](13, "Bereavement");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](14, "input", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_Template_input_ngModelChange_14_listener($event) { return ctx.bereavement = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](16, "div")(17, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](18, "Marriage");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](19, "input", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_Template_input_ngModelChange_19_listener($event) { return ctx.marriage = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](21, "div")(22, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](23, "Birth For Males");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](24, "input", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_Template_input_ngModelChange_24_listener($event) { return ctx.birth = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](26, "div")(27, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](28, "Birth For Femails");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](29, "input", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function PendingVacationRequestsComponent_Template_input_ngModelChange_29_listener($event) { return ctx.birth_f = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](31, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function PendingVacationRequestsComponent_Template_button_click_31_listener() { return ctx.resetUserspermissons(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](32, "Submit");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !!ctx.currenUser);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("baseZIndex", 999)("autoZIndex", false)("visible", ctx.isResetPanelOpened)("transitionOptions", "350ms");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", ctx.newPerBalance);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", ctx.bereavement);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", ctx.marriage);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", ctx.birth);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", ctx.birth_f);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("disabled", ctx.newPerBalance == 0);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgForOf, _angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgControlStatus, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_15__.NativeElementInjectorDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_14__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_14__.DefaultValueAccessor, _angular_material_divider__WEBPACK_IMPORTED_MODULE_16__.MatDivider, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltip, primeng_sidebar__WEBPACK_IMPORTED_MODULE_18__.Sidebar, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NumberValueAccessor], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.DatePipe, _angular_common__WEBPACK_IMPORTED_MODULE_12__.DecimalPipe], styles: [".header[_ngcontent-%COMP%] {\n  font-weight: bold;\n  font-size: large;\n  border: solid 1px #a19ea0;\n  text-align: left;\n}\n\n.body[_ngcontent-%COMP%] {\n  border: solid 1px #a19ea0;\n  text-align: left;\n}\n\n.modal-body[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n\n.modal-body[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-weight: 400;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBlbmRpbmctdmFjYXRpb24tcmVxdWVzdHMuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxhZG1pblxcYWRtaW4tcGFuZWxcXGFkbWluLXZhY2F0aW9uc1xccGVuZGluZy12YWNhdGlvbi1yZXF1ZXN0c1xccGVuZGluZy12YWNhdGlvbi1yZXF1ZXN0cy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSx5QkFBQTtFQUNBLGdCQUFBO0FDQ0o7O0FERUE7RUFDSSx5QkFBQTtFQUNBLGdCQUFBO0FDQ0o7O0FER0k7RUFDSSxnQkFBQTtBQ0FSOztBRENRO0VBQ0ksZ0JBQUE7QUNDWiIsImZpbGUiOiJwZW5kaW5nLXZhY2F0aW9uLXJlcXVlc3RzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmhlYWRlciB7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XHJcbiAgICBib3JkZXI6IHNvbGlkIDFweCAjYTE5ZWEwO1xyXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcclxufVxyXG5cclxuLmJvZHkge1xyXG4gICAgYm9yZGVyOiBzb2xpZCAxcHggI2ExOWVhMDtcclxuICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbn1cclxuXHJcbi5tb2RhbC1ib2R5IHtcclxuICAgIGgzIHtcclxuICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgIHNwYW4ge1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNDAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi5oZWFkZXIge1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zaXplOiBsYXJnZTtcbiAgYm9yZGVyOiBzb2xpZCAxcHggI2ExOWVhMDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbn1cblxuLmJvZHkge1xuICBib3JkZXI6IHNvbGlkIDFweCAjYTE5ZWEwO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuXG4ubW9kYWwtYm9keSBoMyB7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG59XG4ubW9kYWwtYm9keSBoMyBzcGFuIHtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbn0iXX0= */"], data: { animation: [
            (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.trigger)('detailExpand', [
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.state)('collapsed', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.style)({ height: '0px', minHeight: '0' })),
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.state)('expanded', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.style)({ height: '*' })),
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.transition)('expanded <=> collapsed', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.animate)('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
            (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.trigger)('openClose', [
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.state)('void', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.style)({ height: 0, opacity: 0 })),
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.transition)('void <=> *', [
                    (0,_angular_animations__WEBPACK_IMPORTED_MODULE_19__.animate)('300ms ease-in-out')
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
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_announcement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/announcement */ 59643);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/environments/environment */ 92340);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/tooltip */ 40089);
/* harmony import */ var primeng_sidebar__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/sidebar */ 49734);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/select */ 91434);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/core */ 88133);
/* harmony import */ var _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../shared/form-input/form-input.component */ 37604);
/* harmony import */ var primeng_editor__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! primeng/editor */ 1791);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/form-field */ 44770);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/button */ 87317);






















function AnnouncementsComponent_tr_20_span_8_Template(rf, ctx) { if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("mouseover", function AnnouncementsComponent_tr_20_span_8_Template_span_mouseover_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r15); const announce_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit; const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r13.getMyViews(announce_r9.viewedBy); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const announce_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("matTooltip", ctx_r10.myViews);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", announce_r9.viewedBy.length, " ");
} }
function AnnouncementsComponent_tr_20_span_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " 0 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function AnnouncementsComponent_tr_20_li_24_Template(rf, ctx) { if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "li")(1, "a", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function AnnouncementsComponent_tr_20_li_24_Template_a_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r19); const announce_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit; const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r17.closeAccounce(announce_r9); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "Close announce");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
} }
function AnnouncementsComponent_tr_20_Template(rf, ctx) { if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "tr")(1, "td", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "td", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](8, AnnouncementsComponent_tr_20_span_8_Template, 2, 2, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](9, AnnouncementsComponent_tr_20_span_9_Template, 2, 0, "span", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "td", 35)(11, "div", 36)(12, "a", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "svg", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](14, "path", 39)(15, "path", 40)(16, "path", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](17, "ul", 42)(18, "li")(19, "a", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function AnnouncementsComponent_tr_20_Template_a_click_19_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r21); const announce_r9 = restoredCtx.$implicit; const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); ctx_r20.editAnnounce(announce_r9); return ctx_r20.announceReview = true; });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](20, "Update announce");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](21, "li")(22, "a", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function AnnouncementsComponent_tr_20_Template_a_click_22_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r21); const announce_r9 = restoredCtx.$implicit; const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r22.deleteAnnounce(announce_r9); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](23, " Delete announce");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](24, AnnouncementsComponent_tr_20_li_24_Template, 3, 0, "li", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
} if (rf & 2) {
    const announce_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](announce_r9.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", announce_r9.body, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](announce_r9.status == 0 ? "RUNNING" : "Closed");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!announce_r9.viewedBy);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !announce_r9.viewedBy);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", announce_r9.status == 0);
} }
function AnnouncementsComponent_div_33_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " Language Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function AnnouncementsComponent_ng_template_40_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "span", 48);
} }
const _c0 = function () { return ["assignTo"]; };
function AnnouncementsComponent_mat_option_47_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "mat-option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const user_r23 = ctx.$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ((tmp_0_0 = ctx_r3.newAnnounceForm.get(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](3, _c0))) == null ? null : tmp_0_0.value) == "All")("value", user_r23.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](user_r23.username);
} }
function AnnouncementsComponent_div_48_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " this field Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function AnnouncementsComponent_img_50_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "img", 50);
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", ctx_r5.url, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
} }
function AnnouncementsComponent_ng_template_59_Template(rf, ctx) { }
function AnnouncementsComponent_p_sidebar_60_div_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " Language Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function AnnouncementsComponent_p_sidebar_60_ng_template_22_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "span", 48);
} }
function AnnouncementsComponent_p_sidebar_60_mat_option_29_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "mat-option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const user_r31 = ctx.$implicit;
    const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ((tmp_0_0 = ctx_r26.newAnnounceForm.get(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](3, _c0))) == null ? null : tmp_0_0.value) == "All")("value", user_r31.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](user_r31.username);
} }
function AnnouncementsComponent_p_sidebar_60_div_30_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " this field Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function AnnouncementsComponent_p_sidebar_60_img_32_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "img", 50);
} if (rf & 2) {
    const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", ctx_r28.url, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
} }
function AnnouncementsComponent_p_sidebar_60_ng_template_41_Template(rf, ctx) { }
const _c1 = function (a0) { return { "is-invalid": a0 }; };
const _c2 = function () { return { "height": "320px" }; };
function AnnouncementsComponent_p_sidebar_60_Template(rf, ctx) { if (rf & 1) {
    const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p-sidebar", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("visibleChange", function AnnouncementsComponent_p_sidebar_60_Template_p_sidebar_visibleChange_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r33); const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r32.announceReview = $event; })("onHide", function AnnouncementsComponent_p_sidebar_60_Template_p_sidebar_onHide_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r33); const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r34.newAnnounceForm.reset(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 0)(2, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](3, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "form", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngSubmit", function AnnouncementsComponent_p_sidebar_60_Template_form_ngSubmit_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r33); const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r35.updateAnnounce(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "div", 11)(6, "div", 4)(7, "div", 12)(8, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](9, "Language");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "mat-select", 13)(11, "mat-option", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12, "English");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "mat-option", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](14, "Arabic");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](15, AnnouncementsComponent_p_sidebar_60_div_15_Template, 2, 0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](17, "app-form-input", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](18, "div", 12)(19, "label", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](20, "Body:");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](21, "p-editor", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](22, AnnouncementsComponent_p_sidebar_60_ng_template_22_Template, 1, 0, "ng-template", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](23, "div", 21)(24, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](25, "Assign To");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](26, "mat-select", 22)(27, "mat-option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](28, "All");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](29, AnnouncementsComponent_p_sidebar_60_mat_option_29_Template, 2, 4, "mat-option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](30, AnnouncementsComponent_p_sidebar_60_div_30_Template, 2, 0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](31, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](32, AnnouncementsComponent_p_sidebar_60_img_32_Template, 1, 1, "img", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](33, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](34, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function AnnouncementsComponent_p_sidebar_60_Template_button_click_34_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r33); const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](37); return _r29.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](35, "Choose File");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](36, "input", 27, 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("change", function AnnouncementsComponent_p_sidebar_60_Template_input_change_36_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r33); const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r37.imageupload($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](38, "div", 21)(39, "button", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](40);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](41, AnnouncementsComponent_p_sidebar_60_ng_template_41_Template, 0, 0, "ng-template", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    let tmp_5_0;
    let tmp_6_0;
    let tmp_10_0;
    let tmp_12_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("visible", ctx_r8.announceReview)("baseZIndex", 999)("autoZIndex", false)("transitionOptions", "350ms");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("formGroup", ctx_r8.newAnnounceForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](17, _c1, !((tmp_5_0 = ctx_r8.newAnnounceForm.get("language")) == null ? null : tmp_5_0.valid) && ((tmp_5_0 = ctx_r8.newAnnounceForm.get("language")) == null ? null : tmp_5_0.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_6_0 = ctx_r8.newAnnounceForm.get("language")) == null ? null : tmp_6_0.valid) && ((tmp_6_0 = ctx_r8.newAnnounceForm.get("language")) == null ? null : tmp_6_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("control", ctx_r8.newAnnounceForm.get("title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](19, _c2));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("modules", ctx_r8.quillOPT);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](20, _c1, !((tmp_10_0 = ctx_r8.newAnnounceForm.get("assignTo")) == null ? null : tmp_10_0.valid) && ((tmp_10_0 = ctx_r8.newAnnounceForm.get("assignTo")) == null ? null : tmp_10_0.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r8.allUsers);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_12_0 = ctx_r8.newAnnounceForm.get("assignTo")) == null ? null : tmp_12_0.valid) && ((tmp_12_0 = ctx_r8.newAnnounceForm.get("assignTo")) == null ? null : tmp_12_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!ctx_r8.url);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r8.newAnnounceForm.invalid || ctx_r8.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r8.loading ? "Loading...." : "Submit");
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
        this.accTypeEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.Department;
        this.toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],
            // ['blockquote', 'code-block'],
            [{ 'size': ['small', false, 'large'] }],
            // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            // [{ 'font': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'header': 1 }, { 'header': 2 }],
            ['clean'] // remove formatting button
        ];
        this.quillOPT = {
            toolbar: this.toolbarOptions
        };
        this.newServerApi = src_environments_environment__WEBPACK_IMPORTED_MODULE_4__.environment.newServerApi;
    }
    ngOnInit() {
        this.newAnnounceForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormGroup({
            "title": new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required),
            "body": new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required),
            "assignTo": new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required),
            "language": new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required)
        });
        this._auth.user.subscribe(user => {
            this.currentUser = user;
            this.getMyAnnounces();
            this._auth.getAllUsers().subscribe(users => {
                if (users['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                    this.allUsers = users['data']; //.filter(user=>user.accType != AccountType.Client);
                }
            });
        });
    }
    getMyAnnounces() {
        if (this.currentUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.Department.MANAGEMENT) {
            this._db.getAllAnnounces().subscribe(announces => {
                if (announces['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                    this.myAnnounces = announces['data'].reverse();
                }
                else {
                    this.myAnnounces = [];
                }
            });
        }
        else if (this.currentUser.accPosition == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.AccountPositions.MANAGER || this.currentUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.Department.ADMINSTRATION) {
            this._db.getMyAnnounces().subscribe(announces => {
                if (announces['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                    this.myAnnounces = announces['data'].reverse();
                }
                else {
                    this.myAnnounces = [];
                }
            });
        }
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
        const fd = new FormData();
        if (isAll) {
            for (let i in this.allUsers) {
                fd.append('user_id[]', this.allUsers[i].key || '');
            }
        }
        else {
            for (let i in assignTo) {
                fd.append('user_id[]', assignTo[i]);
            }
        }
        fd.append('title', (_b = this.newAnnounceForm.get(['title'])) === null || _b === void 0 ? void 0 : _b.value);
        fd.append('body', (_c = this.newAnnounceForm.get(['body'])) === null || _c === void 0 ? void 0 : _c.value);
        fd.append('lang', (_d = this.newAnnounceForm.get(['language'])) === null || _d === void 0 ? void 0 : _d.value);
        if (!!this.announceImg) {
            fd.append('attach', this.announceImg);
        }
        this._db.createNewAnnounce(fd).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                this.getMyAnnounces();
                this._notify.openSnackbar('Success', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                this.resetAll();
                this.loading = false;
            }
            else {
                this.loading = false;
            }
        }, err => {
            this.loading = false;
        });
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
            this.url = `${this.newServerApi}${this.announceToEdit.imgURL}`;
        }
    }
    updateAnnounce() {
        var _a, _b, _c, _d;
        this.loading = true;
        const assignTo = (_a = this.newAnnounceForm.get(['assignTo'])) === null || _a === void 0 ? void 0 : _a.value;
        const isAll = assignTo.find(key => key == 'All');
        const fd = new FormData();
        if (isAll) {
            for (let i in this.allUsers) {
                fd.append('user_id[]', this.allUsers[i].key || '');
            }
        }
        else {
            for (let i in assignTo) {
                fd.append('user_id[]', assignTo[i]);
            }
        }
        fd.append('title', (_b = this.newAnnounceForm.get(['title'])) === null || _b === void 0 ? void 0 : _b.value);
        fd.append('body', (_c = this.newAnnounceForm.get(['body'])) === null || _c === void 0 ? void 0 : _c.value);
        fd.append('lang', (_d = this.newAnnounceForm.get(['language'])) === null || _d === void 0 ? void 0 : _d.value);
        fd.append('announce_id', this.announceToEdit.key || '');
        if (!!this.announceImg) {
            fd.append('attach', this.announceImg);
        }
        this._db.updateAnnounce(fd).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                this._notify.openSnackbar('Success', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                this.resetAll();
                this.loading = false;
                this.getMyAnnounces();
            }
            else {
                this.loading = false;
            }
        }, err => {
            this.loading = false;
        });
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
                this._db.deleteAnnounce(announce.key || '').subscribe(res => {
                    if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                        this._notify.openSnackbar('Deleted');
                        this.getMyAnnounces();
                    }
                });
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
                this._db.closeAnnounce(announce.key || '').subscribe(res => {
                    if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                        this._notify.openSnackbar('Deleted');
                    }
                });
            }
            else {
                this._notify.openSnackbar('Operation Cancelled!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Info);
            }
        });
    }
}
AnnouncementsComponent.ɵfac = function AnnouncementsComponent_Factory(t) { return new (t || AnnouncementsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_5__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_6__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_7__.NotificationService)); };
AnnouncementsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({ type: AnnouncementsComponent, selectors: [["app-announcements"]], decls: 61, vars: 24, consts: [[1, "container"], [1, "d-flex", "justify-content-end", "m-2"], [1, ""], [1, "btn", "btnStyle", 3, "click"], [1, "row"], [1, "col-12"], ["id", "costLogs", 1, "table", "table-hover", "newTableCustom"], [2, "max-width", "600px", "word-wrap", "break-word"], [4, "ngFor", "ngForOf"], ["header", "New Announce", "styleClass", "p-sidebar-md", "position", "right", 1, "side", 3, "visible", "baseZIndex", "autoZIndex", "transitionOptions", "visibleChange", "onHide"], [1, "example-form", 3, "formGroup", "ngSubmit"], [1, "container-fluid"], [1, "col-md-12", "my-3"], ["formControlName", "language", 1, "form-control", 3, "ngClass"], ["value", "ltr"], ["value", "rtl"], ["class", "invalid-feedback", 4, "ngIf"], ["label", "Title", "placeholder", "Write title", 3, "control"], ["for", ""], ["formControlName", "body", 3, "modules"], ["pTemplate", "header"], [1, "col-md-6", "my-3"], ["multiple", "", "formControlName", "assignTo", 1, "form-control", 3, "ngClass"], ["value", "All"], [3, "disabled", "value", 4, "ngFor", "ngForOf"], ["alt", "", "class", "", "width", "150", 3, "src", 4, "ngIf"], ["type", "button", "mat-raised-button", "", 3, "click"], ["hidden", "", "type", "file", "id", "file", 3, "change"], ["fileInput", ""], ["type", "submit", 1, "btn", "btnStyle", "my-3", "w-100", 3, "disabled"], ["pTemplate", "footer"], ["header", "Review Announce", "styleClass", "p-sidebar-md", "class", "side", "position", "right", 3, "visible", "baseZIndex", "autoZIndex", "transitionOptions", "visibleChange", "onHide", 4, "ngIf"], [1, "dateStyle"], ["class", "cursor", 3, "matTooltip", "mouseover", 4, "ngIf"], [4, "ngIf"], [1, "announce-actions"], [1, "dropdown"], ["id", "dropdownMenuButton2", "data-bs-toggle", "dropdown", "aria-expanded", "false", 1, "dropdown-toggle"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M14.75 19C14.75 20.52 13.52 21.75 12 21.75C10.48 21.75 9.25 20.52 9.25 19C9.25 17.48 10.48 16.25 12 16.25C13.52 16.25 14.75 17.48 14.75 19ZM10.75 19C10.75 19.69 11.31 20.25 12 20.25C12.69 20.25 13.25 19.69 13.25 19C13.25 18.31 12.69 17.75 12 17.75C11.31 17.75 10.75 18.31 10.75 19Z", "fill", "#292D32"], ["d", "M14.75 5C14.75 6.52 13.52 7.75 12 7.75C10.48 7.75 9.25 6.52 9.25 5C9.25 3.48 10.48 2.25 12 2.25C13.52 2.25 14.75 3.48 14.75 5ZM10.75 5C10.75 5.69 11.31 6.25 12 6.25C12.69 6.25 13.25 5.69 13.25 5C13.25 4.31 12.69 3.75 12 3.75C11.31 3.75 10.75 4.31 10.75 5Z", "fill", "#292D32"], ["d", "M14.75 12C14.75 13.52 13.52 14.75 12 14.75C10.48 14.75 9.25 13.52 9.25 12C9.25 10.48 10.48 9.25 12 9.25C13.52 9.25 14.75 10.48 14.75 12ZM10.75 12C10.75 12.69 11.31 13.25 12 13.25C12.69 13.25 13.25 12.69 13.25 12C13.25 11.31 12.69 10.75 12 10.75C11.31 10.75 10.75 11.31 10.75 12Z", "fill", "#292D32"], ["aria-labelledby", "dropdownMenuButton2", 1, "dropdown-menu", "dropdown-menu-dark"], [1, "dropdown-item", "mr-1", 3, "click"], [1, "dropdown-item", "ml-1", 3, "click"], [1, "cursor", 3, "matTooltip", "mouseover"], [1, "dropdown-item", "mx-1", 3, "click"], [1, "invalid-feedback"], [1, "ql-format-group"], [3, "disabled", "value"], ["alt", "", "width", "150", 1, "", 3, "src"], ["header", "Review Announce", "styleClass", "p-sidebar-md", "position", "right", 1, "side", 3, "visible", "baseZIndex", "autoZIndex", "transitionOptions", "visibleChange", "onHide"], [1, "col-lg-3", "col-md-6"]], template: function AnnouncementsComponent_Template(rf, ctx) { if (rf & 1) {
        const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function AnnouncementsComponent_Template_button_click_3_listener() { return ctx.displayModal = true; });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4, "New announce +");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "div", 4)(6, "div", 5)(7, "table", 6)(8, "thead")(9, "tr")(10, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](11, "Title");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](12, "td", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](13, "Body");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](15, "status");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](17, "Views");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](18, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](20, AnnouncementsComponent_tr_20_Template, 25, 6, "tr", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](21, "p-sidebar", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("visibleChange", function AnnouncementsComponent_Template_p_sidebar_visibleChange_21_listener($event) { return ctx.displayModal = $event; })("onHide", function AnnouncementsComponent_Template_p_sidebar_onHide_21_listener() { return ctx.newAnnounceForm.reset(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](22, "form", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngSubmit", function AnnouncementsComponent_Template_form_ngSubmit_22_listener() { return ctx.createNewAnnounce(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](23, "div", 11)(24, "div", 4)(25, "div", 12)(26, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](27, "Language");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](28, "mat-select", 13)(29, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](30, "English");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](31, "mat-option", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](32, "Arabic");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](33, AnnouncementsComponent_div_33_Template, 2, 0, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](34, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](35, "app-form-input", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](36, "div", 12)(37, "label", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](38, "Body:");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](39, "p-editor", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](40, AnnouncementsComponent_ng_template_40_Template, 1, 0, "ng-template", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](41, "div", 21)(42, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](43, "Assign To");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](44, "mat-select", 22)(45, "mat-option", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](46, "All");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](47, AnnouncementsComponent_mat_option_47_Template, 2, 4, "mat-option", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](48, AnnouncementsComponent_div_48_Template, 2, 0, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](49, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](50, AnnouncementsComponent_img_50_Template, 1, 1, "img", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](51, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](52, "button", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function AnnouncementsComponent_Template_button_click_52_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r38); const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](55); return _r6.click(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](53, "Choose File");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](54, "input", 27, 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("change", function AnnouncementsComponent_Template_input_change_54_listener($event) { return ctx.imageupload($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](56, "div", 21)(57, "button", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](58);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](59, AnnouncementsComponent_ng_template_59_Template, 0, 0, "ng-template", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](60, AnnouncementsComponent_p_sidebar_60_Template, 42, 22, "p-sidebar", 31);
    } if (rf & 2) {
        let tmp_6_0;
        let tmp_7_0;
        let tmp_11_0;
        let tmp_13_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx.myAnnounces);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("visible", ctx.displayModal)("baseZIndex", 999)("autoZIndex", false)("transitionOptions", "350ms");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("formGroup", ctx.newAnnounceForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](19, _c1, !((tmp_6_0 = ctx.newAnnounceForm.get("language")) == null ? null : tmp_6_0.valid) && ((tmp_6_0 = ctx.newAnnounceForm.get("language")) == null ? null : tmp_6_0.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_7_0 = ctx.newAnnounceForm.get("language")) == null ? null : tmp_7_0.valid) && ((tmp_7_0 = ctx.newAnnounceForm.get("language")) == null ? null : tmp_7_0.touched));
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("control", ctx.newAnnounceForm.get("title"));
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](21, _c2));
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("modules", ctx.quillOPT);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](22, _c1, !((tmp_11_0 = ctx.newAnnounceForm.get("assignTo")) == null ? null : tmp_11_0.valid) && ((tmp_11_0 = ctx.newAnnounceForm.get("assignTo")) == null ? null : tmp_11_0.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx.allUsers);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_13_0 = ctx.newAnnounceForm.get("assignTo")) == null ? null : tmp_13_0.valid) && ((tmp_13_0 = ctx.newAnnounceForm.get("assignTo")) == null ? null : tmp_13_0.touched));
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!ctx.url);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx.newAnnounceForm.invalid || ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx.loading ? "Loading...." : "Submit");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!ctx.announceToEdit);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_12__.MatTooltip, primeng_sidebar__WEBPACK_IMPORTED_MODULE_13__.Sidebar, _angular_forms__WEBPACK_IMPORTED_MODULE_10__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormGroupDirective, _angular_material_select__WEBPACK_IMPORTED_MODULE_14__.MatSelect, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControlName, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_15__.NativeElementInjectorDirective, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgClass, _angular_material_core__WEBPACK_IMPORTED_MODULE_16__.MatOption, _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_8__.FormInputComponent, primeng_editor__WEBPACK_IMPORTED_MODULE_17__.Editor, primeng_api__WEBPACK_IMPORTED_MODULE_18__.PrimeTemplate, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_19__.MatLabel, _angular_material_button__WEBPACK_IMPORTED_MODULE_20__.MatButton], styles: [".submitBTN[_ngcontent-%COMP%] {\n  background-color: #513982;\n  color: white;\n}\n\n.ql-editor[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  font-size: 15px !important;\n}\n\n.tableCustom[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n  background-color: #f1ecf0;\n  color: #513982;\n  line-height: 50px;\n  font-family: \"Cairo\";\n  font-weight: 800;\n  text-align: center;\n}\n\n.tableCustom[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-top: solid 2px #513982;\n  line-height: 50px;\n  text-align: center;\n  font-family: \"Cairo\";\n  color: #513982;\n  font-weight: 500;\n}\n\n.tableCustom[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .dateStyle[_ngcontent-%COMP%], .tableCustom[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .finalTotal[_ngcontent-%COMP%] {\n  font-family: \"Cairo\";\n  font-weight: 800;\n  color: #513982;\n}\n\n.deleteIcon[_ngcontent-%COMP%] {\n  color: #f4831f;\n  cursor: pointer;\n}\n\n.views[_ngcontent-%COMP%] {\n  color: #513982;\n  cursor: pointer;\n}\n\n.editIcon[_ngcontent-%COMP%] {\n  color: #513982;\n  cursor: pointer;\n}\n\n.closeIcon[_ngcontent-%COMP%] {\n  color: #9d9d9d;\n  cursor: pointer;\n}\n\n.addBtn[_ngcontent-%COMP%] {\n  background-color: #513982;\n  color: #fff;\n  margin: auto;\n}\n\n.announce-actions[_ngcontent-%COMP%]   .dropdown-toggle[_ngcontent-%COMP%] {\n  color: #513982;\n  cursor: pointer;\n}\n\n.announce-actions[_ngcontent-%COMP%]   .dropdown-toggle[_ngcontent-%COMP%]::after {\n  display: none;\n}\n\n.announce-actions[_ngcontent-%COMP%]   .dropdown-menu-dark[_ngcontent-%COMP%]   .dropdown-item[_ngcontent-%COMP%] {\n  color: black;\n  cursor: pointer;\n}\n\n.announce-actions[_ngcontent-%COMP%]   .dropdown-menu-dark[_ngcontent-%COMP%]   .dropdown-item[_ngcontent-%COMP%]:hover {\n  color: #513982;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFubm91bmNlbWVudHMuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcX2NvbG9ycy5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxhZG1pblxcYWRtaW4tcGFuZWxcXGFubm91bmNlbWVudHNcXGFubm91bmNlbWVudHMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFDSSx5QkNGWTtFREdaLFlBQUE7QUVBSjs7QUZJSTtFQUNJLDBCQUFBO0FFRFI7O0FGTUk7RUFDSSx5QkFBQTtFQUNBLGNDZlE7RURnQlIsaUJBQUE7RUFDQSxvQkNOUztFRE9ULGdCQUFBO0VBQ0Esa0JBQUE7QUVIUjs7QUZNUTtFQUNJLDZCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQ2ZLO0VEZ0JMLGNDM0JJO0VENEJKLGdCQUFBO0FFSlo7O0FGS1k7O0VBRUksb0JDcEJDO0VEcUJELGdCQUFBO0VBQ0EsY0NqQ0E7QUM4QmhCOztBRlNBO0VBQ0ksY0NuQ3VCO0VEb0N2QixlQUFBO0FFTko7O0FGU0E7RUFDSSxjQzdDWTtFRDhDWixlQUFBO0FFTko7O0FGU0E7RUFDSSxjQ2xEWTtFRG1EWixlQUFBO0FFTko7O0FGU0E7RUFDSSxjQUFBO0VBQ0EsZUFBQTtBRU5KOztBRlNBO0VBQ0kseUJDNURZO0VENkRaLFdBQUE7RUFDQSxZQUFBO0FFTko7O0FGU0k7RUFDSSxjQ2xFUTtFRG1FUixlQUFBO0FFTlI7O0FGUUk7RUFDSSxhQUFBO0FFTlI7O0FGUUk7RUFDSSxZQUFBO0VBQ0EsZUFBQTtBRU5SOztBRk9RO0VBQ0ksY0M1RUk7QUN1RWhCIiwiZmlsZSI6ImFubm91bmNlbWVudHMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi9jb2xvcnMnO1xyXG4uc3VibWl0QlROIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxufVxyXG5cclxuLnFsLWVkaXRvciB7XHJcbiAgICAqIHtcclxuICAgICAgICBmb250LXNpemU6IDE1cHggIWltcG9ydGFudDtcclxuICAgIH1cclxufVxyXG5cclxuLnRhYmxlQ3VzdG9tIHtcclxuICAgIHRoZWFkIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGFiQmFja0dyb3VuZDtcclxuICAgICAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgICAgIGxpbmUtaGVpZ2h0OiA1MHB4O1xyXG4gICAgICAgIGZvbnQtZmFtaWx5OiAkbWFpbkZvbnRGYW1pbHk7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICB9XHJcbiAgICB0Ym9keSB7XHJcbiAgICAgICAgdHIge1xyXG4gICAgICAgICAgICBib3JkZXItdG9wOiBzb2xpZCAycHggJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogNTBweDtcclxuICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG4gICAgICAgICAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgICAgICAgICAuZGF0ZVN0eWxlLFxyXG4gICAgICAgICAgICAuZmluYWxUb3RhbCB7XHJcbiAgICAgICAgICAgICAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi5kZWxldGVJY29uIHtcclxuICAgIGNvbG9yOiAkYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLnZpZXdzIHtcclxuICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi5lZGl0SWNvbiB7XHJcbiAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4uY2xvc2VJY29uIHtcclxuICAgIGNvbG9yOiAjOWQ5ZDlkO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4uYWRkQnRuIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgbWFyZ2luOiBhdXRvO1xyXG59XHJcbi5hbm5vdW5jZS1hY3Rpb25ze1xyXG4gICAgLmRyb3Bkb3duLXRvZ2dsZXtcclxuICAgICAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIH1cclxuICAgIC5kcm9wZG93bi10b2dnbGU6OmFmdGVye1xyXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB9XHJcbiAgICAuZHJvcGRvd24tbWVudS1kYXJrIC5kcm9wZG93bi1pdGVte1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgJjpob3ZlcntcclxuICAgICAgICAgICAgY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIkbWFpblRoZW1lQ29sb3I6IzUxMzk4MjtcclxuJHN1YlRoZW1lQ29sb3I6Izc0NjE5QjtcclxuJHN1YlN1YlRoZW1lQ29sb3I6Izk3ODhCNDtcclxuJHNvZnRUaGVtZUNvbG9yOiNFRUVCRjM7XHJcbiRib3JkZXJDb2xvcjojQ0JDNERBO1xyXG4kYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjojZjQ4MzFmOyAvLyNGNTgyMUY7XHJcbiRidXR0b25TdWJCYWNrZ3JvdW5kQ29sb3I6I0ZGQUIwMDsgLy8jRjU4MjFGO1xyXG4kYnV0dG9uU3ViU3ViQmFja2dyb3VuZENvbG9yOiNGRTdFMTU7IC8vI0Y1ODIxRjtcclxuJHNlY29uZEZvbnRDb2xvcjojNzA3MDcwO1xyXG4kZ3JheUJhY2tHcm91bmRDb2xvcjojRjZGN0Y4O1xyXG4kd2hpdGVDb2xvcjojZmZmO1xyXG4kbWFpbkZvbnRGYW1pbHk6ICdDYWlybyc7XHJcbiRzb2Z0R3JheUJhY2tHcm91bmRDb2xvcjojRkNGQ0ZDO1xyXG4kYmdMaWdodDojRkFGQkZDO1xyXG4kdGFiQmFja0dyb3VuZDojZjFlY2YwOyIsIi5zdWJtaXRCVE4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTEzOTgyO1xuICBjb2xvcjogd2hpdGU7XG59XG5cbi5xbC1lZGl0b3IgKiB7XG4gIGZvbnQtc2l6ZTogMTVweCAhaW1wb3J0YW50O1xufVxuXG4udGFibGVDdXN0b20gdGhlYWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjFlY2YwO1xuICBjb2xvcjogIzUxMzk4MjtcbiAgbGluZS1oZWlnaHQ6IDUwcHg7XG4gIGZvbnQtZmFtaWx5OiBcIkNhaXJvXCI7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cbi50YWJsZUN1c3RvbSB0Ym9keSB0ciB7XG4gIGJvcmRlci10b3A6IHNvbGlkIDJweCAjNTEzOTgyO1xuICBsaW5lLWhlaWdodDogNTBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LWZhbWlseTogXCJDYWlyb1wiO1xuICBjb2xvcjogIzUxMzk4MjtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cbi50YWJsZUN1c3RvbSB0Ym9keSB0ciAuZGF0ZVN0eWxlLFxuLnRhYmxlQ3VzdG9tIHRib2R5IHRyIC5maW5hbFRvdGFsIHtcbiAgZm9udC1mYW1pbHk6IFwiQ2Fpcm9cIjtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgY29sb3I6ICM1MTM5ODI7XG59XG5cbi5kZWxldGVJY29uIHtcbiAgY29sb3I6ICNmNDgzMWY7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLnZpZXdzIHtcbiAgY29sb3I6ICM1MTM5ODI7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmVkaXRJY29uIHtcbiAgY29sb3I6ICM1MTM5ODI7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmNsb3NlSWNvbiB7XG4gIGNvbG9yOiAjOWQ5ZDlkO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5hZGRCdG4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTEzOTgyO1xuICBjb2xvcjogI2ZmZjtcbiAgbWFyZ2luOiBhdXRvO1xufVxuXG4uYW5ub3VuY2UtYWN0aW9ucyAuZHJvcGRvd24tdG9nZ2xlIHtcbiAgY29sb3I6ICM1MTM5ODI7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbi5hbm5vdW5jZS1hY3Rpb25zIC5kcm9wZG93bi10b2dnbGU6OmFmdGVyIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbi5hbm5vdW5jZS1hY3Rpb25zIC5kcm9wZG93bi1tZW51LWRhcmsgLmRyb3Bkb3duLWl0ZW0ge1xuICBjb2xvcjogYmxhY2s7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbi5hbm5vdW5jZS1hY3Rpb25zIC5kcm9wZG93bi1tZW51LWRhcmsgLmRyb3Bkb3duLWl0ZW06aG92ZXIge1xuICBjb2xvcjogIzUxMzk4Mjtcbn0iXX0= */"] });


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
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var primeng_skeleton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/skeleton */ 77377);
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! angular-bootstrap-md */ 83246);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 52816);










function DashBoardComponent_h2_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](ctx_r0.dashboardStatistics.pending_reports);
} }
function DashBoardComponent_p_skeleton_43_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "p-skeleton", 28);
} }
function DashBoardComponent_canvas_44_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "canvas", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("chartHover", function DashBoardComponent_canvas_44_Template_canvas_chartHover_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r9); const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](); return ctx_r8.projectsStatusChartHovered($event); })("chartClick", function DashBoardComponent_canvas_44_Template_canvas_chartClick_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r9); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](); return ctx_r10.projectsStatusChartClicked($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("chartType", ctx_r2.projectsStatusChartType)("datasets", ctx_r2.projectsStatusChartDatasets)("labels", ctx_r2.projectsStatusChartLabels)("colors", ctx_r2.projectsStatusChartColors)("options", ctx_r2.projectsStatusChartOptions)("legend", true);
} }
function DashBoardComponent_p_skeleton_50_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "p-skeleton", 28);
} }
function DashBoardComponent_canvas_51_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "canvas", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("chartHover", function DashBoardComponent_canvas_51_Template_canvas_chartHover_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r12); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](); return ctx_r11.projectsTypeChartHovered($event); })("chartClick", function DashBoardComponent_canvas_51_Template_canvas_chartClick_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r12); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](); return ctx_r13.projectsTypeChartClicked($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("chartType", ctx_r4.projectsTypeChartType)("datasets", ctx_r4.projectsTypeChartDatasets)("labels", ctx_r4.projectsTypeChartLabels)("colors", ctx_r4.projectsTypeChartColors)("options", ctx_r4.projectsTypeChartOptions)("legend", true);
} }
function DashBoardComponent_ng_container_76_tr_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](9, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const item_r15 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](item_r15.Employee);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](item_r15.Department);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](item_r15.RequestType);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](item_r15.Project);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](item_r15.Status);
} }
function DashBoardComponent_ng_container_76_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, DashBoardComponent_ng_container_76_tr_1_Template, 11, 5, "tr", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx_r5.dashboardStatistics.latest_request);
} }
function DashBoardComponent_tr_77_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "tr")(1, "td", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2, "no requests founded");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
} }
function DashBoardComponent_div_78_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 13)(1, "div", 21)(2, "div", 10)(3, "div", 22)(4, "h3", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](5, " Admin Tasks ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "a", 32)(7, "h3", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](8, "All requests");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](9, "div", 34)(10, "div", 35)(11, "div", 36)(12, "h3", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](13, "Quarter Sales Report");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](14, "div", 38)(15, "div")(16, "p", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](17, "Start Date");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](18, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](19, "25th Sep 2023");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](20, "div")(21, "p", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](22, "End Date");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](23, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](24, "25th Sep 2023");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](25, "div", 35)(26, "div", 36)(27, "h3", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](28, "Quarter Sales Report");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](29, "div", 38)(30, "div")(31, "p", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](32, "Start Date");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](33, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](34, "25th Sep 2023");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](35, "div")(36, "p", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](37, "End Date");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](38, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](39, "25th Sep 2023");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](40, "div", 40)(41, "div", 36)(42, "h3", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](43, "Quarter Sales Report");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](44, "div", 38)(45, "div")(46, "p", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](47, "Start Date");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](48, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](49, "25th Sep 2023");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](50, "div")(51, "p", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](52, "End Date");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](53, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](54, "25th Sep 2023");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](55, "button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](56, " Add New Task ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
} }
class DashBoardComponent {
    /* =================================== Projects Type Based Chart Variables =========================== */
    constructor(_db, _auth) {
        this._db = _db;
        this._auth = _auth;
        this.loaded = false;
        this.departmentEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department;
        /* =================================== Projects Status Based Chart Variables =========================== */
        this.projectsStatusChartType = 'pie';
        this.projectsStatusChartDatasets = []; // { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
        this.projectsStatusChartLabels = ['Pending', 'Hold', 'Scheduled', 'Running', 'Closed'];
        this.projectsStatusChartColors = [
            {
                backgroundColor: ['#CBC4DA', '#B5179E', '#480CA8', '#560BAD', '#7209B7'],
                hoverBackgroundColor: ['#CBC4DA', '#B5179E', '#480CA8', '#560BAD', '#7209B7'],
                borderWidth: 2,
            }
        ];
        this.projectsStatusChartOptions = {
            responsive: true,
            width: 50,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                    }
                }
            }
        };
        this.dashboardStatistics = {
            admin_tasks: 0,
            open_tickets: 0,
            pending_reports: 0,
            public_request: 0,
            latest_request: []
        };
        /* =================================== Projects Status Based Chart Variables =========================== */
        /* =================================== Projects Type Based Chart Variables =========================== */
        this.projectsTypeChartType = 'pie';
        this.projectsTypeChartDatasets = []; // { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
        this.projectsTypeChartLabels = ['Project', 'POC'];
        this.projectsTypeChartColors = [
            {
                backgroundColor: ['#560BAD', '#B5179E'],
                hoverBackgroundColor: ['#560BAD', '#B5179E'],
                borderWidth: 2,
            }
        ];
        this.projectsTypeChartOptions = {
            responsive: true,
            width: '50px',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                    }
                },
            }
        };
    }
    projectsStatusChartClicked(e) { }
    projectsStatusChartHovered(e) { }
    projectsTypeChartClicked(e) { }
    projectsTypeChartHovered(e) { }
    ngOnInit() {
        this.loadAllProjectsChart();
        this.date = new Date();
        this.getCurrentUser();
        this.GetAllDashboardDetails();
    }
    loadAllProjectsChart() {
        this._db.getAllProjectsIncludeClosed().subscribe((projects) => {
            if (projects['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                this.projectStatusPasedAnalysis(projects['data']);
                this.projectTypeBasedAnalysis(projects['data']);
                this.loaded = true;
            }
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
            if (project.type == '2') {
                projectCounter++;
            }
            else if (project.type == '1') {
                POCCounter++;
            }
        });
        projectTypeArray.push(projectCounter);
        projectTypeArray.push(POCCounter);
        this.projectsTypeChartDatasets.push({ data: projectTypeArray, label: 'Project Type' });
    }
    getCurrentUser() {
        this._auth.user.subscribe((res) => {
            this.currentUser = res;
            this.getStatistics();
        });
    }
    getStatistics() {
        var _a;
        this._auth.getNavPermsByUserID(((_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.key) || '').subscribe(res => {
            this.myNavParams = Object.assign({}, res);
        });
    }
    GetAllDashboardDetails() {
        this._auth.GetAllDashboardDetails().subscribe({
            next: (res) => {
                this.dashboardStatistics = res.data;
            }, error: (err) => {
            }
        });
    }
}
DashBoardComponent.ɵfac = function DashBoardComponent_Factory(t) { return new (t || DashBoardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_3__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_4__.AuthApiService)); };
DashBoardComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({ type: DashBoardComponent, selectors: [["app-dash-board"]], decls: 79, vars: 16, consts: [[1, "container-fluid", "dash", "my-5"], [1, "col-10", "titles", "ml-2"], [1, ""], [1, "user_name", "fw-bold", "mb-0"], [1, "date"], [1, "row", "justify-content-center"], [1, "col-lg-4", "col-12", "mb-2"], [1, "row"], [1, "col-md-6"], [1, "card", "text-start", "statistics", "mb-2", "p-1"], [1, "card-body"], [4, "ngIf"], [1, "titles", "fw-bold"], [1, "col-lg-4", "mb-2"], [1, "card", "statistics"], [1, "chartValueCard", "p-2", "m-3"], [1, "card-title"], ["shape", "circle", "size", "150px", 4, "ngIf"], ["mdbChart", "", "style", "height: 250px !important;", 3, "chartType", "datasets", "labels", "colors", "options", "legend", "chartHover", "chartClick", 4, "ngIf"], [1, "row", "mt-2"], [1, "col-lg-8", "mb-2"], [1, "card", "border-0"], [1, "d-flex", "justify-content-between"], [1, "card-title", "fw-bold"], ["routerLink", "/manager/publicreqs", 1, "titles", "text-end", 2, "cursor", "pointer"], [1, "table-responsive"], [1, "my-3", "table", "table-hover", "newTableCustomDah"], ["class", "col-lg-4 mb-2", 4, "ngIf"], ["shape", "circle", "size", "150px"], ["mdbChart", "", 2, "height", "250px !important", 3, "chartType", "datasets", "labels", "colors", "options", "legend", "chartHover", "chartClick"], [4, "ngFor", "ngForOf"], ["colspan", "5", 1, "text-center"], ["routerLink", "/manager/admin_tasks"], [1, "titles", "text-end"], [1, "mb-5"], [1, "card", "mb-2"], [1, "card-body", "p-2"], [1, "fw-bold"], [1, "d-flex", "justify-content-start", "gap-5"], [1, "text-muted", "mb-0"], [1, "card"], ["routerLink", "/manager/admin_tasks", 1, "btn", "addTaskBtn", "mt-4", "w-100"]], template: function DashBoardComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "p", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](7, "date");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](8, "div", 5)(9, "div", 6)(10, "div", 7)(11, "div", 8)(12, "div", 9)(13, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](14, DashBoardComponent_h2_14_Template, 2, 1, "h2", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](15, "p", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](16, "Pending Reports");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](17, "div", 8)(18, "div", 9)(19, "div", 10)(20, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](21);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](22, "p", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](23, "Admin Tasks");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](24, "div", 8)(25, "div", 9)(26, "div", 10)(27, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](28);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](29, "p", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](30, "Public Requests");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](31, "div", 8)(32, "div", 9)(33, "div", 10)(34, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](35);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](36, "p", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](37, "Open tickets");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](38, "div", 13)(39, "div", 14)(40, "div", 15)(41, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](42, " Projects By Status ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](43, DashBoardComponent_p_skeleton_43_Template, 1, 0, "p-skeleton", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](44, DashBoardComponent_canvas_44_Template, 1, 6, "canvas", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](45, "div", 13)(46, "div", 14)(47, "div", 15)(48, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](49, " Projects By Type ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](50, DashBoardComponent_p_skeleton_50_Template, 1, 0, "p-skeleton", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](51, DashBoardComponent_canvas_51_Template, 1, 6, "canvas", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](52, "div", 19)(53, "div", 20)(54, "div", 21)(55, "div", 10)(56, "div", 22)(57, "h3", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](58, " Latest Requests ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](59, "h3", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](60, "All requests");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](61, "div", 25)(62, "table", 26)(63, "thead")(64, "tr")(65, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](66, "employee");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](67, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](68, "department");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](69, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](70, "type");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](71, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](72, "Project");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](73, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](74, "status");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](75, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](76, DashBoardComponent_ng_container_76_Template, 2, 1, "ng-container", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](77, DashBoardComponent_tr_77_Template, 3, 0, "tr", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](78, DashBoardComponent_div_78_Template, 57, 0, "div", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("Hello ", ctx.currentUser.username, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind2"](7, 13, ctx.date, "d MMMM , YYYY"));
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.myNavParams);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](ctx.dashboardStatistics.admin_tasks);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](ctx.dashboardStatistics.public_request);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](ctx.dashboardStatistics.open_tickets);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", !ctx.loaded);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.loaded);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", !ctx.loaded);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.loaded);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.dashboardStatistics.latest_request.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.dashboardStatistics.latest_request.length == 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.currentUser.department == ctx.departmentEnum.MANAGEMENT);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, primeng_skeleton__WEBPACK_IMPORTED_MODULE_7__.Skeleton, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_8__.BaseChartDirective, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterLinkWithHref], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.DatePipe], styles: [".dash[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .dash[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .dash[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .dash[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], .dash[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], .dash[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%], .dash[_ngcontent-%COMP%]   h6[_ngcontent-%COMP%] {\n  font-family: \"Cairo\";\n}\n.dash[_ngcontent-%COMP%]   .chartValueCard[_ngcontent-%COMP%]   .card-title[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 600;\n  color: #74619B;\n  line-height: 21px;\n}\n.dash[_ngcontent-%COMP%]   .chartValueCard[_ngcontent-%COMP%]   .card-title[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n  font-size: 10px;\n  font-weight: 600;\n  color: #65686f;\n  line-height: 16px;\n  margin-top: 5px;\n}\n.dash[_ngcontent-%COMP%]   .chartValueCard[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%] {\n  max-width: 300px !important;\n  max-height: 185px !important;\n}\n.dash[_ngcontent-%COMP%]   .singleValueCard[_ngcontent-%COMP%]   .card-title[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 600;\n  color: #21232c;\n  line-height: 21px;\n}\n.dash[_ngcontent-%COMP%]   .singleValueCard[_ngcontent-%COMP%]   .card-title[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n  font-size: 10px;\n  font-weight: 600;\n  color: #65686f;\n  line-height: 16px;\n  margin-top: 5px;\n}\n.dash[_ngcontent-%COMP%]   .singleValueCard[_ngcontent-%COMP%]   .card-body[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 35px;\n  font-weight: 600;\n  color: #21232c;\n  line-height: 48px;\n}\n.dash[_ngcontent-%COMP%]   .singleValueCard[_ngcontent-%COMP%]   .card-body[_ngcontent-%COMP%]   h6[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 450;\n  color: #65686f;\n  line-height: 21px;\n}\n.titles[_ngcontent-%COMP%] {\n  color: #513982;\n}\n.statistics[_ngcontent-%COMP%] {\n  border-color: #CBC4DA;\n}\n.statistics[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: bold;\n}\n.card[_ngcontent-%COMP%] {\n  border-color: #CBC4DA;\n}\n.addTaskBtn[_ngcontent-%COMP%] {\n  border: 1px dashed #513982;\n  color: #513982;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhc2gtYm9hcmQuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcX2NvbG9ycy5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxhZG1pblxcYWRtaW4tcGFuZWxcXGRhc2gtYm9hcmRcXGRhc2gtYm9hcmQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUk7Ozs7Ozs7RUFPSSxvQkNFUztBQ0hqQjtBRklRO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBRUEsY0NmRztFRGlCSCxpQkFBQTtBRUpaO0FGS1k7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsaUJBQUE7RUFDQSxlQUFBO0FFSGhCO0FGTVE7RUFDSSwyQkFBQTtFQUNBLDRCQUFBO0FFSlo7QUZRUTtFQUVJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxpQkFBQTtBRVBaO0FGUVk7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsaUJBQUE7RUFDQSxlQUFBO0FFTmhCO0FGVVk7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsaUJBQUE7QUVSaEI7QUZVWTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxpQkFBQTtBRVJoQjtBRmFBO0VBQ0ksY0NoRVk7QUNzRGhCO0FGYUE7RUFDSSxxQkNoRVM7QUNzRGI7QUZZSTtFQUNJLGVBQUE7RUFDQSxpQkFBQTtBRVZSO0FGY0E7RUFDSSxxQkN6RVM7QUM4RGI7QUZjQTtFQUNJLDBCQUFBO0VBQ0EsY0NsRlk7QUN1RWhCIiwiZmlsZSI6ImRhc2gtYm9hcmQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi9jb2xvcnMnO1xyXG4uZGFzaCB7XHJcbiAgICBwLFxyXG4gICAgaDEsXHJcbiAgICBoMixcclxuICAgIGgzLFxyXG4gICAgaDQsXHJcbiAgICBoNSxcclxuICAgIGg2IHtcclxuICAgICAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG4gICAgfVxyXG4gICAgLmNoYXJ0VmFsdWVDYXJkIHtcclxuICAgICAgICAuY2FyZC10aXRsZSB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICAgICAgLy8gY29sb3I6IHJnYigzMywgMzUsIDQ0KTtcclxuICAgICAgICAgICAgY29sb3I6JHN1YlRoZW1lQ29sb3I7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMjFweDtcclxuICAgICAgICAgICAgLmRhdGUge1xyXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMHB4O1xyXG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiByZ2IoMTAxLCAxMDQsIDExMSk7XHJcbiAgICAgICAgICAgICAgICBsaW5lLWhlaWdodDogMTZweDtcclxuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDVweDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYW52YXN7XHJcbiAgICAgICAgICAgIG1heC13aWR0aDogMzAwcHggIWltcG9ydGFudDtcclxuICAgICAgICAgICAgbWF4LWhlaWdodDogMTg1cHggIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAuc2luZ2xlVmFsdWVDYXJkIHtcclxuICAgICAgICAuY2FyZC10aXRsZSB7XHJcbiAgICAgICAgICAgIC8vIGJhY2tncm91bmQtY29sb3I6ICMwOWM7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICAgICAgY29sb3I6IHJnYigzMywgMzUsIDQ0KTtcclxuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDIxcHg7XHJcbiAgICAgICAgICAgIC5kYXRlIHtcclxuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTBweDtcclxuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogcmdiKDEwMSwgMTA0LCAxMTEpO1xyXG4gICAgICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDE2cHg7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiA1cHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLmNhcmQtYm9keSB7XHJcbiAgICAgICAgICAgIGgyIHtcclxuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMzVweDtcclxuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogcmdiKDMzLCAzNSwgNDQpO1xyXG4gICAgICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDQ4cHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaDYge1xyXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDQ1MDtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiByZ2IoMTAxLCAxMDQsIDExMSk7XHJcbiAgICAgICAgICAgICAgICBsaW5lLWhlaWdodDogMjFweDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4udGl0bGVze1xyXG4gICAgY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgIFxyXG59XHJcbi5zdGF0aXN0aWNze1xyXG4gICAgYm9yZGVyLWNvbG9yOiAkYm9yZGVyQ29sb3I7XHJcblxyXG4gICAgaDJ7XHJcbiAgICAgICAgZm9udC1zaXplOiAzMnB4O1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgfVxyXG5cclxufVxyXG4uY2FyZHtcclxuICAgIGJvcmRlci1jb2xvcjogJGJvcmRlckNvbG9yO1xyXG5cclxufVxyXG4uYWRkVGFza0J0bntcclxuICAgIGJvcmRlcjoxcHggZGFzaGVkICRtYWluVGhlbWVDb2xvcjtcclxuICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbn0iLCIkbWFpblRoZW1lQ29sb3I6IzUxMzk4MjtcclxuJHN1YlRoZW1lQ29sb3I6Izc0NjE5QjtcclxuJHN1YlN1YlRoZW1lQ29sb3I6Izk3ODhCNDtcclxuJHNvZnRUaGVtZUNvbG9yOiNFRUVCRjM7XHJcbiRib3JkZXJDb2xvcjojQ0JDNERBO1xyXG4kYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjojZjQ4MzFmOyAvLyNGNTgyMUY7XHJcbiRidXR0b25TdWJCYWNrZ3JvdW5kQ29sb3I6I0ZGQUIwMDsgLy8jRjU4MjFGO1xyXG4kYnV0dG9uU3ViU3ViQmFja2dyb3VuZENvbG9yOiNGRTdFMTU7IC8vI0Y1ODIxRjtcclxuJHNlY29uZEZvbnRDb2xvcjojNzA3MDcwO1xyXG4kZ3JheUJhY2tHcm91bmRDb2xvcjojRjZGN0Y4O1xyXG4kd2hpdGVDb2xvcjojZmZmO1xyXG4kbWFpbkZvbnRGYW1pbHk6ICdDYWlybyc7XHJcbiRzb2Z0R3JheUJhY2tHcm91bmRDb2xvcjojRkNGQ0ZDO1xyXG4kYmdMaWdodDojRkFGQkZDO1xyXG4kdGFiQmFja0dyb3VuZDojZjFlY2YwOyIsIi5kYXNoIHAsXG4uZGFzaCBoMSxcbi5kYXNoIGgyLFxuLmRhc2ggaDMsXG4uZGFzaCBoNCxcbi5kYXNoIGg1LFxuLmRhc2ggaDYge1xuICBmb250LWZhbWlseTogXCJDYWlyb1wiO1xufVxuLmRhc2ggLmNoYXJ0VmFsdWVDYXJkIC5jYXJkLXRpdGxlIHtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBmb250LXdlaWdodDogNjAwO1xuICBjb2xvcjogIzc0NjE5QjtcbiAgbGluZS1oZWlnaHQ6IDIxcHg7XG59XG4uZGFzaCAuY2hhcnRWYWx1ZUNhcmQgLmNhcmQtdGl0bGUgLmRhdGUge1xuICBmb250LXNpemU6IDEwcHg7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGNvbG9yOiAjNjU2ODZmO1xuICBsaW5lLWhlaWdodDogMTZweDtcbiAgbWFyZ2luLXRvcDogNXB4O1xufVxuLmRhc2ggLmNoYXJ0VmFsdWVDYXJkIGNhbnZhcyB7XG4gIG1heC13aWR0aDogMzAwcHggIWltcG9ydGFudDtcbiAgbWF4LWhlaWdodDogMTg1cHggIWltcG9ydGFudDtcbn1cbi5kYXNoIC5zaW5nbGVWYWx1ZUNhcmQgLmNhcmQtdGl0bGUge1xuICBmb250LXNpemU6IDE2cHg7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGNvbG9yOiAjMjEyMzJjO1xuICBsaW5lLWhlaWdodDogMjFweDtcbn1cbi5kYXNoIC5zaW5nbGVWYWx1ZUNhcmQgLmNhcmQtdGl0bGUgLmRhdGUge1xuICBmb250LXNpemU6IDEwcHg7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGNvbG9yOiAjNjU2ODZmO1xuICBsaW5lLWhlaWdodDogMTZweDtcbiAgbWFyZ2luLXRvcDogNXB4O1xufVxuLmRhc2ggLnNpbmdsZVZhbHVlQ2FyZCAuY2FyZC1ib2R5IGgyIHtcbiAgZm9udC1zaXplOiAzNXB4O1xuICBmb250LXdlaWdodDogNjAwO1xuICBjb2xvcjogIzIxMjMyYztcbiAgbGluZS1oZWlnaHQ6IDQ4cHg7XG59XG4uZGFzaCAuc2luZ2xlVmFsdWVDYXJkIC5jYXJkLWJvZHkgaDYge1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiA0NTA7XG4gIGNvbG9yOiAjNjU2ODZmO1xuICBsaW5lLWhlaWdodDogMjFweDtcbn1cblxuLnRpdGxlcyB7XG4gIGNvbG9yOiAjNTEzOTgyO1xufVxuXG4uc3RhdGlzdGljcyB7XG4gIGJvcmRlci1jb2xvcjogI0NCQzREQTtcbn1cbi5zdGF0aXN0aWNzIGgyIHtcbiAgZm9udC1zaXplOiAzMnB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cblxuLmNhcmQge1xuICBib3JkZXItY29sb3I6ICNDQkM0REE7XG59XG5cbi5hZGRUYXNrQnRuIHtcbiAgYm9yZGVyOiAxcHggZGFzaGVkICM1MTM5ODI7XG4gIGNvbG9yOiAjNTEzOTgyO1xufSJdfQ== */"] });


/***/ }),

/***/ 77660:
/*!****************************************************************************************************************!*\
  !*** ./src/app/components/admin/admin-panel/dash-board/dev-monthly-progress/dev-monthly-progress.component.ts ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DevMonthlyProgressComponent": () => (/* binding */ DevMonthlyProgressComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angular-bootstrap-md */ 83246);


// import { DurationCalculationService } from 'src/app/services/duration-calculation.service';
class DevMonthlyProgressComponent {
    constructor() {
        this.pageLoaded = false;
        this.monthDevProgressChartType = 'bar';
        this.monthDevProgressChartDatasets = [
            { data: [65, 59, 80, 81, 56, 55, 40], label: 'This Month Devs Progress' }
        ];
        this.monthDevProgressChartLabels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
        this.monthDevProgressChartColors = [
            {
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2,
            }
        ];
        this.monthDevProgressChartOptions = {
            responsive: true
        };
    }
    monthDevProgressChartClicked(e) { }
    monthDevProgressChartHovered(e) { }
    ngOnInit() {
        // this.getMonthDevsProgressAnalysis()
    }
}
DevMonthlyProgressComponent.ɵfac = function DevMonthlyProgressComponent_Factory(t) { return new (t || DevMonthlyProgressComponent)(); };
DevMonthlyProgressComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: DevMonthlyProgressComponent, selectors: [["app-dev-monthly-progress"]], decls: 2, vars: 6, consts: [[2, "display", "block"], ["mdbChart", "", 3, "chartType", "datasets", "labels", "colors", "options", "legend", "chartHover", "chartClick"]], template: function DevMonthlyProgressComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "canvas", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("chartHover", function DevMonthlyProgressComponent_Template_canvas_chartHover_1_listener($event) { return ctx.monthDevProgressChartHovered($event); })("chartClick", function DevMonthlyProgressComponent_Template_canvas_chartClick_1_listener($event) { return ctx.monthDevProgressChartClicked($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("chartType", ctx.monthDevProgressChartType)("datasets", ctx.monthDevProgressChartDatasets)("labels", ctx.monthDevProgressChartLabels)("colors", ctx.monthDevProgressChartColors)("options", ctx.monthDevProgressChartOptions)("legend", true);
    } }, directives: [angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_1__.BaseChartDirective], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJkZXYtbW9udGhseS1wcm9ncmVzcy5jb21wb25lbnQuc2NzcyJ9 */"] });


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
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_export_excel_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/export-excel.service */ 40689);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/form-field */ 44770);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/input */ 43365);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/select */ 91434);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/core */ 88133);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/icon */ 65590);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/tooltip */ 40089);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/table */ 97217);
















function MonthlyTransportationSheetComponent_mat_option_23_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const user_r20 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", user_r20.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](user_r20.username);
} }
function MonthlyTransportationSheetComponent_th_34_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_35_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r21 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r21.empName, " ");
} }
function MonthlyTransportationSheetComponent_th_37_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_38_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r22 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r22.date, " ");
} }
function MonthlyTransportationSheetComponent_th_40_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " From ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_41_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r23 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r23.fromLocation, " ");
} }
function MonthlyTransportationSheetComponent_th_43_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " To ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_44_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r24 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r24.toLocation, " ");
} }
function MonthlyTransportationSheetComponent_th_46_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Purpose ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_47_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r25 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r25.purpose, " ");
} }
function MonthlyTransportationSheetComponent_th_49_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Project ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_50_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r26 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r26.projectName, " ");
} }
function MonthlyTransportationSheetComponent_th_52_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Amount ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_53_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r27 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r27.amountByEGP, " ");
} }
function MonthlyTransportationSheetComponent_th_55_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Status ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function MonthlyTransportationSheetComponent_td_56_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r28 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r28.trans_status_name, " ");
} }
function MonthlyTransportationSheetComponent_tr_57_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "tr", 33);
} }
function MonthlyTransportationSheetComponent_tr_58_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "tr", 34);
} }
function MonthlyTransportationSheetComponent_tr_59_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr", 35)(1, "td", 36)(2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, " No data matching the filter.");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("colspan", ctx_r19.displayedColumns.length);
} }
class MonthlyTransportationSheetComponent {
    constructor(_db, _auth, excelServ) {
        this._db = _db;
        this._auth = _auth;
        this.excelServ = excelServ;
        this.users = [];
        this.transportations = [];
        this.displayedColumns = ['Name', 'Date', 'From', 'To', 'Purpose', 'Project', 'Amount', 'Status'];
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
        this.getTransForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroup({
            'fromDate': new _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required),
            'toDate': new _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required),
            'devKey': new _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required)
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
MonthlyTransportationSheetComponent.ɵfac = function MonthlyTransportationSheetComponent_Factory(t) { return new (t || MonthlyTransportationSheetComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_1__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_2__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_services_export_excel_service__WEBPACK_IMPORTED_MODULE_3__.ExportExcelService)); };
MonthlyTransportationSheetComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: MonthlyTransportationSheetComponent, selectors: [["app-monthly-transportation-sheet"]], decls: 60, vars: 6, consts: [[1, "container"], [1, "row"], [1, "col-12"], [1, "example-form", 3, "formGroup", "ngSubmit"], [1, "container-fluid"], [1, "row", "align-items-end"], [1, "col-md-3", "my-3"], [1, "example-full-width", "w-100"], ["matInput", "", "type", "date", "id", "fromDate", "formControlName", "fromDate"], ["matInput", "", "type", "date", "id", "toDate", "formControlName", "toDate"], ["formControlName", "devKey"], ["value", "0"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "submit", 1, "btn", "btnStyle", "my-3", 3, "disabled"], [1, "", 2, "cursor", "pointer", 3, "click"], ["matTooltip", "Download File", 2, "color", "#f5831fd3"], ["mat-table", "", "id", "monthlyTransportations", 1, "mat-elevation-z8", 3, "dataSource"], ["matColumnDef", "Name"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "Date"], ["matColumnDef", "From"], ["matColumnDef", "To"], ["matColumnDef", "Purpose"], ["matColumnDef", "Project"], ["matColumnDef", "Amount"], ["matColumnDef", "Status"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["class", "mat-row", 4, "matNoDataRow"], [3, "value"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-header-row", ""], ["mat-row", ""], [1, "mat-row"], [1, "mat-cell", "text-center"]], template: function MonthlyTransportationSheetComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "form", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngSubmit", function MonthlyTransportationSheetComponent_Template_form_ngSubmit_3_listener() { return ctx.getTransportations(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "mat-form-field", 7)(8, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9, "From");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](10, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "div", 6)(12, "mat-form-field", 7)(13, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "To");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](15, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "div", 6)(17, "mat-form-field", 7)(18, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](19, "Emp Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "mat-select", 10)(21, "mat-option", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](22, "All");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](23, MonthlyTransportationSheetComponent_mat_option_23_Template, 2, 2, "mat-option", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](24, "div", 6)(25, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](26, "Submit");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](27, "div", 1)(28, "div", 2)(29, "a", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function MonthlyTransportationSheetComponent_Template_a_click_29_listener() { return ctx.exportDevsMonthlyReport(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](30, "mat-icon", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](31, "cloud_download");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](32, "table", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](33, 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](34, MonthlyTransportationSheetComponent_th_34_Template, 2, 0, "th", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](35, MonthlyTransportationSheetComponent_td_35_Template, 2, 1, "td", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](36, 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](37, MonthlyTransportationSheetComponent_th_37_Template, 2, 0, "th", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](38, MonthlyTransportationSheetComponent_td_38_Template, 2, 1, "td", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](39, 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](40, MonthlyTransportationSheetComponent_th_40_Template, 2, 0, "th", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](41, MonthlyTransportationSheetComponent_td_41_Template, 2, 1, "td", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](42, 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](43, MonthlyTransportationSheetComponent_th_43_Template, 2, 0, "th", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](44, MonthlyTransportationSheetComponent_td_44_Template, 2, 1, "td", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](45, 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](46, MonthlyTransportationSheetComponent_th_46_Template, 2, 0, "th", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](47, MonthlyTransportationSheetComponent_td_47_Template, 2, 1, "td", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](48, 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](49, MonthlyTransportationSheetComponent_th_49_Template, 2, 0, "th", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](50, MonthlyTransportationSheetComponent_td_50_Template, 2, 1, "td", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](51, 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](52, MonthlyTransportationSheetComponent_th_52_Template, 2, 0, "th", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](53, MonthlyTransportationSheetComponent_td_53_Template, 2, 1, "td", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](54, 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](55, MonthlyTransportationSheetComponent_th_55_Template, 2, 0, "th", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](56, MonthlyTransportationSheetComponent_td_56_Template, 2, 1, "td", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](57, MonthlyTransportationSheetComponent_tr_57_Template, 1, 0, "tr", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](58, MonthlyTransportationSheetComponent_tr_58_Template, 1, 0, "tr", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](59, MonthlyTransportationSheetComponent_tr_59_Template, 4, 1, "tr", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formGroup", ctx.getTransForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.users);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", ctx.getTransForm.invalid);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("dataSource", ctx.transportations);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroupDirective, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatLabel, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInput, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormControlName, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_8__.NativeElementInjectorDirective, _angular_material_select__WEBPACK_IMPORTED_MODULE_9__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_10__.MatOption, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgForOf, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIcon, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_13__.MatTooltip, _angular_material_table__WEBPACK_IMPORTED_MODULE_14__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_14__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_14__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_14__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_14__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_14__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_14__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_14__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_14__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_14__.MatRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_14__.MatNoDataRow], styles: ["table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbnRobHktdHJhbnNwb3J0YXRpb24tc2hlZXQuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXEZHUyUyMFRhc2slMjBNYW5hZ2VtZW50JTIwU3lzdGVtXFxmZ3N0bV91aVxcc3JjXFxhcHBcXGNvbXBvbmVudHNcXGFkbWluXFxhZG1pbi1wYW5lbFxcbW9udGhseS10cmFuc3BvcnRhdGlvbi1zaGVldFxcbW9udGhseS10cmFuc3BvcnRhdGlvbi1zaGVldC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLFdBQUE7QUNDSiIsImZpbGUiOiJtb250aGx5LXRyYW5zcG9ydGF0aW9uLXNoZWV0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsidGFibGUge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbn0iLCJ0YWJsZSB7XG4gIHdpZHRoOiAxMDAlO1xufSJdfQ== */"] });


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
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ 3191);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/table */ 97217);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var primeng_sidebar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/sidebar */ 49734);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/divider */ 19975);
/* harmony import */ var primeng_table__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/table */ 68581);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/select */ 91434);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/core */ 88133);

















function PendingTransportationsComponent_th_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r19 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r19.empName, " ");
} }
function PendingTransportationsComponent_th_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r20 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r20.date, " ");
} }
function PendingTransportationsComponent_th_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " From ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r21 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r21.fromLocation, " ");
} }
function PendingTransportationsComponent_th_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " To ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r22 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r22.toLocation, " ");
} }
function PendingTransportationsComponent_th_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Purpose ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r23 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r23.purpose, " ");
} }
function PendingTransportationsComponent_th_17_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Project ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r24 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r24.projectName, " ");
} }
function PendingTransportationsComponent_th_20_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Amount ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_21_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r25 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", request_r25.amountByEGP, " ");
} }
function PendingTransportationsComponent_th_23_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Decision ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function PendingTransportationsComponent_td_24_Template(rf, ctx) { if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 15)(1, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function PendingTransportationsComponent_td_24_Template_button_click_1_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r28); const request_r26 = restoredCtx.$implicit; const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); ctx_r27.transportationModal = true; return ctx_r27.reviewRequest(request_r26); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Review");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
} }
function PendingTransportationsComponent_tr_25_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "tr", 17);
} }
function PendingTransportationsComponent_tr_26_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "tr", 18);
} }
function PendingTransportationsComponent_p_sidebar_27_div_36_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 23)(1, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Project Name : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r30.requestToReview.projectName, " ");
} }
function PendingTransportationsComponent_p_sidebar_27_div_37_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 31)(1, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Process Name : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r31.requestToReview.processName, " ");
} }
function PendingTransportationsComponent_p_sidebar_27_p_table_39_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr", 35)(1, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Action By ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "th", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "Status ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "th", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "Comment ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "th", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "Action Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
} }
function PendingTransportationsComponent_p_sidebar_27_p_table_39_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr", 40)(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](9, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const req_r37 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", req_r37.user_name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", req_r37.status_name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", req_r37.comment, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind2"](9, 4, req_r37.action_date, "dd/MM/yyyy HH:mm:ss"), " ");
} }
const _c0 = function () { return [10, 25, 50]; };
function PendingTransportationsComponent_p_sidebar_27_p_table_39_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "p-table", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, PendingTransportationsComponent_p_sidebar_27_p_table_39_ng_template_1_Template, 9, 0, "ng-template", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, PendingTransportationsComponent_p_sidebar_27_p_table_39_ng_template_2_Template, 10, 7, "ng-template", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx_r32.requestToReview.history)("paginator", ctx_r32.requestToReview.history.length > 10 ? true : false)("rows", 10)("showCurrentPageReport", true)("rowsPerPageOptions", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](5, _c0));
} }
function PendingTransportationsComponent_p_sidebar_27_div_41_div_1_mat_option_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-option", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const man_r40 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", man_r40.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](man_r40.username);
} }
function PendingTransportationsComponent_p_sidebar_27_div_41_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r42 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 47)(1, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Assign To : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "mat-select", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function PendingTransportationsComponent_p_sidebar_27_div_41_div_1_Template_mat_select_ngModelChange_3_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r42); const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3); return ctx_r41.requestToReview.managerToApproveKey = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, PendingTransportationsComponent_p_sidebar_27_div_41_div_1_mat_option_4_Template, 2, 2, "mat-option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r38.requestToReview.managerToApproveKey);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r38.managers);
} }
function PendingTransportationsComponent_p_sidebar_27_div_41_Template(rf, ctx) { if (rf & 1) {
    const _r44 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, PendingTransportationsComponent_p_sidebar_27_div_41_div_1_Template, 5, 2, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "div", 43)(3, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "Comment : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "input", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function PendingTransportationsComponent_p_sidebar_27_div_41_Template_input_ngModelChange_5_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r44); const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); return ctx_r43.requestToReview.managerDissisionComment = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "div", 21)(7, "button", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function PendingTransportationsComponent_p_sidebar_27_div_41_Template_button_click_7_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r44); const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); ctx_r45.flowDecision(true); return ctx_r45.transportationModal = false; });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "Approve");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "button", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function PendingTransportationsComponent_p_sidebar_27_div_41_Template_button_click_9_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r44); const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); ctx_r46.flowDecision(false); return ctx_r46.transportationModal = false; });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10, "Reject");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r33.currentUser.department != ctx_r33.DepartmentEnum.MANAGEMENT);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r33.requestToReview.managerDissisionComment);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", ctx_r33.currentUser.department != ctx_r33.DepartmentEnum.MANAGEMENT && !ctx_r33.requestToReview.managerToApproveKey);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", !ctx_r33.requestToReview.managerDissisionComment);
} }
function PendingTransportationsComponent_p_sidebar_27_div_42_Template(rf, ctx) { if (rf & 1) {
    const _r48 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 51)(1, "div", 52)(2, "button", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function PendingTransportationsComponent_p_sidebar_27_div_42_Template_button_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r48); const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); ctx_r47.markAsDone(); return ctx_r47.transportationModal = false; });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "Paid");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
} }
function PendingTransportationsComponent_p_sidebar_27_Template(rf, ctx) { if (rf & 1) {
    const _r50 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "p-sidebar", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("visibleChange", function PendingTransportationsComponent_p_sidebar_27_Template_p_sidebar_visibleChange_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r50); const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); return ctx_r49.transportationModal = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "h4", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Transportation Request Review");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "div", 21)(4, "div", 22)(5, "div", 21)(6, "div", 23)(7, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "Request BY : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "div", 23)(12, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Date : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "div", 23)(17, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18, "From : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "div", 23)(22, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23, "To : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](24, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](26, "div", 23)(27, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](28, "purpose : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](29, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](31, "div", 23)(32, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](33, "Amount : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](34, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](36, PendingTransportationsComponent_p_sidebar_27_div_36_Template, 5, 1, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](37, PendingTransportationsComponent_p_sidebar_27_div_37_Template, 5, 1, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](38, "mat-divider");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](39, PendingTransportationsComponent_p_sidebar_27_p_table_39_Template, 3, 6, "p-table", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](40, "mat-divider");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](41, PendingTransportationsComponent_p_sidebar_27_div_41_Template, 11, 4, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](42, PendingTransportationsComponent_p_sidebar_27_div_42_Template, 4, 0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("visible", ctx_r18.transportationModal)("baseZIndex", 999)("autoZIndex", false)("transitionOptions", "350ms");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r18.requestToReview.empName, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r18.requestToReview.date, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r18.requestToReview.fromLocation, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r18.requestToReview.toLocation, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r18.requestToReview.purpose, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r18.requestToReview.amountByEGP, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r18.requestToReview.projectName);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r18.requestToReview.processName);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !!ctx_r18.requestToReview.history && ctx_r18.requestToReview.history.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r18.currentUser.accRole != ctx_r18.AccountRolesEnum.FINANCE);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r18.currentUser.accRole == ctx_r18.AccountRolesEnum.FINANCE || ctx_r18.currentUser.department == ctx_r18.DepartmentEnum.MANAGEMENT);
} }
class PendingTransportationsComponent {
    constructor(_db, modalService, _auth) {
        this._db = _db;
        this.modalService = modalService;
        this._auth = _auth;
        this.myPendingRequests = [];
        this.displayedColumns = ['Name', 'Date', 'From', 'To', 'Purpose', 'Project', 'Amount', 'Decision'];
        this.admins = [];
        this.managers = [];
        this.DepartmentEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department;
        this.AccountRolesEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.AccountRoles;
        this.transportationModal = false;
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
        if (reason === _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_5__.ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_5__.ModalDismissReasons.BACKDROP_CLICK) {
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
PendingTransportationsComponent.ɵfac = function PendingTransportationsComponent_Factory(t) { return new (t || PendingTransportationsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_2__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_5__.NgbModal), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_3__.AuthApiService)); };
PendingTransportationsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: PendingTransportationsComponent, selectors: [["app-pending-transportations"]], decls: 28, vars: 4, consts: [["mat-table", "", 1, "mat-elevation-z8", 3, "dataSource"], ["matColumnDef", "Name"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "Date"], ["matColumnDef", "From"], ["matColumnDef", "To"], ["matColumnDef", "Purpose"], ["matColumnDef", "Project"], ["matColumnDef", "Amount"], ["matColumnDef", "Decision"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["styleClass", "p-sidebar-sm", "class", "side", "position", "right", 3, "visible", "baseZIndex", "autoZIndex", "transitionOptions", "visibleChange", 4, "ngIf"], ["mat-header-cell", ""], ["mat-cell", ""], [1, "btn", "reviewBTN", "mx-1", 3, "click"], ["mat-header-row", ""], ["mat-row", ""], ["styleClass", "p-sidebar-sm", "position", "right", 1, "side", 3, "visible", "baseZIndex", "autoZIndex", "transitionOptions", "visibleChange"], ["id", "modal-basic-title", 1, "modal-title"], [1, ""], [1, "container-fluid", "myCardStyle"], [1, "d-flex", "py-2", "my-1", "border-bottom", "justify-content-between"], [1, "myLable"], [1, "modalInfo", "pl-2"], ["class", "d-flex py-2 my-1 border-bottom justify-content-between", 4, "ngIf"], ["class", "d-flex py-2 my-1 justify-content-between", 4, "ngIf"], ["styleClass", "p-datatable-sm", "responsiveLayout", "scroll", "currentPageReportTemplate", "Showing {first} to {last} of {totalRecords} entries", 3, "value", "paginator", "rows", "showCurrentPageReport", "rowsPerPageOptions", 4, "ngIf"], ["class", "management", 4, "ngIf"], ["class", "finance", 4, "ngIf"], [1, "d-flex", "py-2", "my-1", "justify-content-between"], ["styleClass", "p-datatable-sm", "responsiveLayout", "scroll", "currentPageReportTemplate", "Showing {first} to {last} of {totalRecords} entries", 3, "value", "paginator", "rows", "showCurrentPageReport", "rowsPerPageOptions"], ["pTemplate", "header"], ["pTemplate", "body"], [1, "tHeader"], ["pSortableColumn", "user_name"], ["pSortableColumn", "status_name"], ["pSortableColumn", "comment"], ["pSortableColumn", "action_date"], [1, "tbody"], [1, "management"], ["class", "col-12", 4, "ngIf"], [1, "my-4"], ["type", "text", 1, "form-control", 3, "ngModel", "ngModelChange"], ["type", "submit", 1, "btn", "mx-1", "btnStyle", 3, "disabled", "click"], ["type", "submit", 1, "btn", "mx-1", "rejectBTN", 3, "disabled", "click"], [1, "col-12"], [1, "form-control", 3, "ngModel", "ngModelChange"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "finance"], [1, "modal-footer"], ["type", "submit", 1, "btn", "mx-1", "approveBTN", 3, "click"]], template: function PendingTransportationsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "table", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](1, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, PendingTransportationsComponent_th_2_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, PendingTransportationsComponent_td_3_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](4, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, PendingTransportationsComponent_th_5_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, PendingTransportationsComponent_td_6_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](7, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](8, PendingTransportationsComponent_th_8_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, PendingTransportationsComponent_td_9_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](10, 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](11, PendingTransportationsComponent_th_11_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](12, PendingTransportationsComponent_td_12_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](13, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](14, PendingTransportationsComponent_th_14_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](15, PendingTransportationsComponent_td_15_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](16, 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](17, PendingTransportationsComponent_th_17_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](18, PendingTransportationsComponent_td_18_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](19, 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](20, PendingTransportationsComponent_th_20_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](21, PendingTransportationsComponent_td_21_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](22, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](23, PendingTransportationsComponent_th_23_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](24, PendingTransportationsComponent_td_24_Template, 3, 0, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](25, PendingTransportationsComponent_tr_25_Template, 1, 0, "tr", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](26, PendingTransportationsComponent_tr_26_Template, 1, 0, "tr", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](27, PendingTransportationsComponent_p_sidebar_27_Template, 43, 15, "p-sidebar", 13);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("dataSource", ctx.myPendingRequests);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !!ctx.requestToReview);
    } }, directives: [_angular_material_table__WEBPACK_IMPORTED_MODULE_6__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_6__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_6__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_6__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_6__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_6__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_6__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_6__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_6__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_6__.MatRow, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, primeng_sidebar__WEBPACK_IMPORTED_MODULE_8__.Sidebar, _angular_material_divider__WEBPACK_IMPORTED_MODULE_9__.MatDivider, primeng_table__WEBPACK_IMPORTED_MODULE_10__.Table, primeng_api__WEBPACK_IMPORTED_MODULE_11__.PrimeTemplate, primeng_table__WEBPACK_IMPORTED_MODULE_10__.SortableColumn, _angular_material_select__WEBPACK_IMPORTED_MODULE_12__.MatSelect, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgControlStatus, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_14__.NativeElementInjectorDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgModel, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _angular_material_core__WEBPACK_IMPORTED_MODULE_15__.MatOption, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.DefaultValueAccessor], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.DatePipe], styles: ["table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.tHeader[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  font-size: 14px !important;\n  font-weight: 400;\n}\n\n.tbody[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 300;\n}\n\n.rejectBTN[_ngcontent-%COMP%] {\n  color: #f4831f;\n  background-color: transparent;\n  border: solid 1px #f4831f;\n  font-family: \"Cairo\";\n}\n\n.approveBTN[_ngcontent-%COMP%], .reviewBTN[_ngcontent-%COMP%] {\n  color: white;\n  background-color: #513982;\n  font-family: \"Cairo\";\n}\n\n.myCardStyle[_ngcontent-%COMP%] {\n  color: #513982;\n  font-family: \"Cairo\";\n}\n\n.myCardStyle[_ngcontent-%COMP%]   .cardImg[_ngcontent-%COMP%] {\n  border: solid 2px #f4831f;\n}\n\n.myCardStyle[_ngcontent-%COMP%]   .empName[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n\n.myCardStyle[_ngcontent-%COMP%]   .myLable[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n\n.myCardStyle[_ngcontent-%COMP%]   .optionColor[_ngcontent-%COMP%] {\n  color: #f4831f;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBlbmRpbmctdHJhbnNwb3J0YXRpb25zLmNvbXBvbmVudC5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxhZG1pblxcYWRtaW4tcGFuZWxcXHBlbmRpbmctdHJhbnNwb3J0YXRpb25zXFxwZW5kaW5nLXRyYW5zcG9ydGF0aW9ucy5jb21wb25lbnQuc2NzcyIsIi4uXFwuLlxcLi5cXC4uXFxfY29sb3JzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFDSSxXQUFBO0FDQUo7O0FESUk7RUFDSSwwQkFBQTtFQUNBLGdCQUFBO0FDRFI7O0FETUk7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7QUNIUjs7QURPQTtFQUNJLGNFZnVCO0VGZ0J2Qiw2QkFBQTtFQUNBLHlCQUFBO0VBQ0Esb0JFWmE7QURRakI7O0FET0E7O0VBRUksWUFBQTtFQUNBLHlCRTdCWTtFRjhCWixvQkVuQmE7QURlakI7O0FET0E7RUFDSSxjRWxDWTtFRm1DWixvQkV4QmE7QURvQmpCOztBREtJO0VBQ0kseUJBQUE7QUNIUjs7QURLSTtFQUNJLGdCQUFBO0FDSFI7O0FES0k7RUFDSSxnQkFBQTtBQ0hSOztBREtJO0VBQ0ksY0V6Q21CO0FEc0MzQiIsImZpbGUiOiJwZW5kaW5nLXRyYW5zcG9ydGF0aW9ucy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uLy4uL2NvbG9ycyc7XHJcbnRhYmxlIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4udEhlYWRlciB7XHJcbiAgICB0aCB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4ICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcclxuICAgIH1cclxufVxyXG5cclxuLnRib2R5IHtcclxuICAgIHRoIHtcclxuICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDMwMDtcclxuICAgIH1cclxufVxyXG5cclxuLnJlamVjdEJUTiB7XHJcbiAgICBjb2xvcjogJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxuICAgIGJvcmRlcjogc29saWQgMXB4ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxufVxyXG5cclxuLmFwcHJvdmVCVE4sXHJcbi5yZXZpZXdCVE4ge1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxufVxyXG5cclxuLm15Q2FyZFN0eWxlIHtcclxuICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG4gICAgLmNhcmRJbWcge1xyXG4gICAgICAgIGJvcmRlcjogc29saWQgMnB4ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgfVxyXG4gICAgLmVtcE5hbWUge1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICB9XHJcbiAgICAubXlMYWJsZSB7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIH1cclxuICAgIC5vcHRpb25Db2xvciB7XHJcbiAgICAgICAgY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgfVxyXG59XHJcbi8vIC5oZWFkZXIge1xyXG4vLyAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbi8vICAgICBmb250LXNpemU6IGxhcmdlO1xyXG4vLyAgICAgYm9yZGVyOiBzb2xpZCAxcHggI2ExOWVhMDtcclxuLy8gICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbi8vIH1cclxuLy8gLmJvZHkge1xyXG4vLyAgICAgYm9yZGVyOiBzb2xpZCAxcHggI2ExOWVhMDtcclxuLy8gICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbi8vIH1cclxuLy8gLm1vZGFsLWJvZHkge1xyXG4vLyAgICAgaDMge1xyXG4vLyAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbi8vICAgICAgICAgc3BhbiB7XHJcbi8vICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG4vLyB9IiwidGFibGUge1xuICB3aWR0aDogMTAwJTtcbn1cblxuLnRIZWFkZXIgdGgge1xuICBmb250LXNpemU6IDE0cHggIWltcG9ydGFudDtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbn1cblxuLnRib2R5IHRoIHtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogMzAwO1xufVxuXG4ucmVqZWN0QlROIHtcbiAgY29sb3I6ICNmNDgzMWY7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBib3JkZXI6IHNvbGlkIDFweCAjZjQ4MzFmO1xuICBmb250LWZhbWlseTogXCJDYWlyb1wiO1xufVxuXG4uYXBwcm92ZUJUTixcbi5yZXZpZXdCVE4ge1xuICBjb2xvcjogd2hpdGU7XG4gIGJhY2tncm91bmQtY29sb3I6ICM1MTM5ODI7XG4gIGZvbnQtZmFtaWx5OiBcIkNhaXJvXCI7XG59XG5cbi5teUNhcmRTdHlsZSB7XG4gIGNvbG9yOiAjNTEzOTgyO1xuICBmb250LWZhbWlseTogXCJDYWlyb1wiO1xufVxuLm15Q2FyZFN0eWxlIC5jYXJkSW1nIHtcbiAgYm9yZGVyOiBzb2xpZCAycHggI2Y0ODMxZjtcbn1cbi5teUNhcmRTdHlsZSAuZW1wTmFtZSB7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG59XG4ubXlDYXJkU3R5bGUgLm15TGFibGUge1xuICBmb250LXdlaWdodDogNjAwO1xufVxuLm15Q2FyZFN0eWxlIC5vcHRpb25Db2xvciB7XG4gIGNvbG9yOiAjZjQ4MzFmO1xufSIsIiRtYWluVGhlbWVDb2xvcjojNTEzOTgyO1xyXG4kc3ViVGhlbWVDb2xvcjojNzQ2MTlCO1xyXG4kc3ViU3ViVGhlbWVDb2xvcjojOTc4OEI0O1xyXG4kc29mdFRoZW1lQ29sb3I6I0VFRUJGMztcclxuJGJvcmRlckNvbG9yOiNDQkM0REE7XHJcbiRidXR0b25NYWluQmFja2dyb3VuZENvbG9yOiNmNDgzMWY7IC8vI0Y1ODIxRjtcclxuJGJ1dHRvblN1YkJhY2tncm91bmRDb2xvcjojRkZBQjAwOyAvLyNGNTgyMUY7XHJcbiRidXR0b25TdWJTdWJCYWNrZ3JvdW5kQ29sb3I6I0ZFN0UxNTsgLy8jRjU4MjFGO1xyXG4kc2Vjb25kRm9udENvbG9yOiM3MDcwNzA7XHJcbiRncmF5QmFja0dyb3VuZENvbG9yOiNGNkY3Rjg7XHJcbiR3aGl0ZUNvbG9yOiNmZmY7XHJcbiRtYWluRm9udEZhbWlseTogJ0NhaXJvJztcclxuJHNvZnRHcmF5QmFja0dyb3VuZENvbG9yOiNGQ0ZDRkM7XHJcbiRiZ0xpZ2h0OiNGQUZCRkM7XHJcbiR0YWJCYWNrR3JvdW5kOiNmMWVjZjA7Il19 */"] });


/***/ }),

/***/ 98625:
/*!*********************************************************************************!*\
  !*** ./src/app/components/admin/admin-panel/users-data/users-data.component.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UsersDataComponent": () => (/* binding */ UsersDataComponent)
/* harmony export */ });
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_export_excel_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/export-excel.service */ 40689);
/* harmony import */ var primeng_blockui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/blockui */ 98015);
/* harmony import */ var primeng_progressspinner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/progressspinner */ 60120);
/* harmony import */ var primeng_table__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/table */ 68581);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/icon */ 65590);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/tooltip */ 40089);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/inputtext */ 95583);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 52816);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 36362);














function UsersDataComponent_ng_template_7_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 12)(1, "a", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function UsersDataComponent_ng_template_7_Template_a_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r7); const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); return ctx_r6.exportUsersDataReport(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "mat-icon", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "cloud_download");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div")(5, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "i", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "input", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("input", function UsersDataComponent_ng_template_7_Template_input_input_7_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r7); _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](6); return _r0.filterGlobal($event.target.value, "contains"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function UsersDataComponent_ng_template_7_Template_button_click_8_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r7); const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](6); return ctx_r9.clear(_r0); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](9, "i", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10, " Clear");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
} }
function UsersDataComponent_ng_template_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr")(1, "th")(2, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, " Name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](4, "p-columnFilter", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "th")(6, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, " Email ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](8, "p-columnFilter", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "th")(10, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11, " Phone ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "th")(13, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, " Hiring Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](15, "p-columnFilter", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "th")(17, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18, " Contract End Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](19, "p-columnFilter", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "th")(21, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](22, " Address ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](23, "p-columnFilter", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](24, "th")(25, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](26, " Birth Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](27, "p-columnFilter", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](28, "th")(29, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](30, " ID Number ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](31, "p-columnFilter", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
} }
function UsersDataComponent_ng_template_9_ng_container_8_ng_container_1_a_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "a", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const p_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate1"]("href", "tel:002", p_r13.phone, "", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matTooltip", "Call Phone (" + p_r13.phone + " )");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", p_r13.phone, " ");
} }
function UsersDataComponent_ng_template_9_ng_container_8_ng_container_1_a_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "a", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const p_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate1"]("href", "https://api.whatsapp.com/send?phone=2", p_r13.phone, "", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matTooltip", "Message ( " + p_r13.phone + " ) On Whatsapp");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", p_r13.phone, " ");
} }
function UsersDataComponent_ng_template_9_ng_container_8_ng_container_1_span_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " / ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function UsersDataComponent_ng_template_9_ng_container_8_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, UsersDataComponent_ng_template_9_ng_container_8_ng_container_1_a_1_Template, 2, 3, "a", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, UsersDataComponent_ng_template_9_ng_container_8_ng_container_1_a_2_Template, 2, 3, "a", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, UsersDataComponent_ng_template_9_ng_container_8_ng_container_1_span_3_Template, 2, 0, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const p_r13 = ctx.$implicit;
    const i_r14 = ctx.index;
    const user_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", p_r13.phone_type != "Whatsapp");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", p_r13.phone_type == "Whatsapp");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", i_r14 < user_r10.mobileNumber.length - 1);
} }
function UsersDataComponent_ng_template_9_ng_container_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, UsersDataComponent_ng_template_9_ng_container_8_ng_container_1_Template, 4, 3, "ng-container", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const user_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", user_r10.mobileNumber);
} }
const _c0 = function (a1) { return ["/user", a1]; };
function UsersDataComponent_ng_template_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr")(1, "td")(2, "a", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "td", 29)(5, "a", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "td", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](8, UsersDataComponent_ng_template_9_ng_container_8_Template, 2, 1, "ng-container", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const user_r10 = ctx.$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](12, _c0, user_r10.key));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](user_r10.username);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate3"]("href", "mailto:", user_r10.email, "?subject=welcome from FGS &body=Hello,", user_r10.name, " %0D%0A Best regards,%0D%0A", ctx_r3.currentUser.username, "", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", user_r10.email, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !!user_r10.mobileNumber && user_r10.mobileNumber.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", user_r10.hiringDate, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", user_r10.contractEndDate, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", user_r10.address, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", user_r10.birthDate, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", user_r10.socialSecureityNumber, " ");
} }
function UsersDataComponent_ng_template_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr")(1, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "No data found.");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
} }
function UsersDataComponent_tr_31_ng_container_6_ng_container_1_a_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "a", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const p_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate1"]("href", "tel:002", p_r25.phone, "", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matTooltip", "Call Phone (" + p_r25.phone + " )");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", p_r25.phone, " ");
} }
function UsersDataComponent_tr_31_ng_container_6_ng_container_1_a_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "a", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const p_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate1"]("href", "https://api.whatsapp.com/send?phone=2", p_r25.phone, "", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matTooltip", "Message ( " + p_r25.phone + " ) On Whatsapp");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", p_r25.phone, " ");
} }
function UsersDataComponent_tr_31_ng_container_6_ng_container_1_span_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " / ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function UsersDataComponent_tr_31_ng_container_6_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, UsersDataComponent_tr_31_ng_container_6_ng_container_1_a_1_Template, 2, 3, "a", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, UsersDataComponent_tr_31_ng_container_6_ng_container_1_a_2_Template, 2, 3, "a", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, UsersDataComponent_tr_31_ng_container_6_ng_container_1_span_3_Template, 2, 0, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const p_r25 = ctx.$implicit;
    const i_r26 = ctx.index;
    const user_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", p_r25.phone_type != "Whatsapp");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", p_r25.phone_type == "Whatsapp");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", i_r26 < user_r22.mobileNumber.length - 1);
} }
function UsersDataComponent_tr_31_ng_container_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, UsersDataComponent_tr_31_ng_container_6_ng_container_1_Template, 4, 3, "ng-container", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const user_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", user_r22.mobileNumber);
} }
function UsersDataComponent_tr_31_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, UsersDataComponent_tr_31_ng_container_6_Template, 2, 1, "ng-container", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const user_r22 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](user_r22.username);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](user_r22.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !!user_r22.mobileNumber && user_r22.mobileNumber.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](user_r22.hiringDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](user_r22.contractEndDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](user_r22.address);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](user_r22.birthDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](user_r22.socialSecureityNumber);
} }
const _c1 = function () { return [10, 25, 50]; };
const _c2 = function () { return ["username", "Email", "socialSecureityNumber", "address"]; };
class UsersDataComponent {
    constructor(_auth, excelServ) {
        this._auth = _auth;
        this.excelServ = excelServ;
        this.usersDataLoader = false;
        this.users = [];
        this.getToday = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;
        this.fileName = `${this.getToday}.xlsx`;
    }
    ngOnInit() {
        this._auth.user.subscribe(user => {
            this.currentUser = user;
            if (this.currentUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department.MANAGEMENT || (this.currentUser.department == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department.ADMINSTRATION && this.currentUser.accRole == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.AccountRoles.HUMAN_RESOURCE)) {
                this.getUserData();
            }
        });
    }
    getUserData() {
        this._auth.getAllUsersData().subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                this.users = res['data'];
                this.users.map(u => {
                    if (!!u.mobileNumber) {
                        const phoneSTR = u.mobileNumber;
                        u.mobileNumber = JSON.parse(phoneSTR);
                    }
                    else {
                        u.mobileNumber = [];
                    }
                });
                this.users = this.users.sort((a, b) => {
                    return compare(a.username, b.username, true);
                });
            }
        });
    }
    clear(table) {
        table.clear();
    }
    exportUsersDataReport() {
        let element = document.getElementById('usersDataReport');
        this.excelServ.exportexcel(element, `users Data Report ${this.fileName}`);
    }
}
UsersDataComponent.ɵfac = function UsersDataComponent_Factory(t) { return new (t || UsersDataComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_2__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_services_export_excel_service__WEBPACK_IMPORTED_MODULE_3__.ExportExcelService)); };
UsersDataComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: UsersDataComponent, selectors: [["app-users-data"]], decls: 32, vars: 10, consts: [[2, "width", "100vw", "height", "100vh", 3, "blocked"], [1, "content-wrapper"], [1, "container-xxl", "flex-grow-1", "container-p-y"], [1, ""], ["responsiveLayout", "scroll", "id", "dt1", "dataKey", "id", "currentPageReportTemplate", "Showing {first} to {last} of {totalRecords} entries", 3, "value", "rows", "showCurrentPageReport", "rowsPerPageOptions", "paginator", "globalFilterFields"], ["dt1", ""], ["pTemplate", "caption"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["id", "usersDataReport", 1, "table", "table-striped", 2, "display", "none"], [4, "ngFor", "ngForOf"], [1, "d-flex", "justify-content-between", "align-items-end"], [1, "downloadFile", 2, "cursor", "pointer", 3, "click"], ["matTooltip", "Export", 2, "color", "#f5831fd3"], [1, "search", "p-input-icon-left"], [1, "pi", "pi-search"], ["pInputText", "", "type", "text", "placeholder", "Search keyword", 3, "input"], [1, "btn", "btnOutLine", "mx-1", 3, "click"], [1, "pi", "pi-filter-slash"], [1, "d-flex", "justify-content-start", "align-items-center"], ["type", "text", "field", "name", "display", "menu"], ["type", "text", "field", "email", "display", "menu"], ["type", "date", "field", "hiringDate", "display", "menu"], ["type", "date", "field", "contractEndDate", "display", "menu"], ["type", "text", "field", "address", "display", "menu"], ["type", "date", "field", "birthDate", "display", "menu"], ["type", "text", "field", "socialSecureityNumber", "display", "menu"], [3, "routerLink"], ["matTooltip", "to choose the defualt email app 1) Open the Start menu and search for 'Default apps' 2)Click on the 'Default app settings' option in the search results 3)Click on the current default email program and select a new one from the list of available options", 2, "cursor", "pointer"], ["target", "_blank", "rel", "noopener noreferrer", 3, "href"], [2, "cursor", "pointer"], [4, "ngIf"], [3, "href", "matTooltip", 4, "ngIf"], ["target", "_blank", 3, "href", "matTooltip", 4, "ngIf"], [3, "href", "matTooltip"], ["target", "_blank", 3, "href", "matTooltip"], ["colspan", "7"]], template: function UsersDataComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "p-blockUI", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "p-progressSpinner");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "div", 1)(3, "div", 2)(4, "div", 3)(5, "p-table", 4, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](7, UsersDataComponent_ng_template_7_Template, 11, 0, "ng-template", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](8, UsersDataComponent_ng_template_8_Template, 32, 0, "ng-template", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, UsersDataComponent_ng_template_9_Template, 19, 14, "ng-template", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](10, UsersDataComponent_ng_template_10_Template, 3, 0, "ng-template", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "table", 10)(12, "thead")(13, "tr")(14, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15, "Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](17, "Email");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](19, "Phone");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21, "Hiring Date");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23, "Contract End Date");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](24, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](25, "Address");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](26, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](27, "Birth Date");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](28, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](29, "ID Number");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](30, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](31, UsersDataComponent_tr_31_Template, 17, 8, "tr", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("blocked", ctx.usersDataLoader);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.users)("rows", 10)("showCurrentPageReport", true)("rowsPerPageOptions", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](8, _c1))("paginator", true)("globalFilterFields", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](9, _c2));
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](26);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.users);
    } }, directives: [primeng_blockui__WEBPACK_IMPORTED_MODULE_5__.BlockUI, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_6__.ProgressSpinner, primeng_table__WEBPACK_IMPORTED_MODULE_7__.Table, primeng_api__WEBPACK_IMPORTED_MODULE_8__.PrimeTemplate, _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__.MatIcon, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_10__.MatTooltip, primeng_inputtext__WEBPACK_IMPORTED_MODULE_11__.InputText, primeng_table__WEBPACK_IMPORTED_MODULE_7__.ColumnFilter, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterLinkWithHref, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgForOf], styles: [".delete[_ngcontent-%COMP%] {\n  color: #f4831f;\n  cursor: pointer;\n}\n\n.coloredIcon[_ngcontent-%COMP%] {\n  color: #513982;\n}\n\n.coloredIconSec[_ngcontent-%COMP%] {\n  color: #f4831f;\n}\n\n.ci[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%] {\n  width: 100000px !important;\n}\n\ntd[_ngcontent-%COMP%] {\n  text-align: left !important;\n  font-size: 12px;\n}\n\n.search[_ngcontent-%COMP%] {\n  height: 42px;\n}\n\n.search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  color: #9788B4;\n  font-size: 12px;\n  height: 42px;\n}\n\n.search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder {\n  color: #9788B4;\n}\n\n.search[_ngcontent-%COMP%]   .p-inputtext[_ngcontent-%COMP%] {\n  border-right: 1px solid !important;\n  border-color: #9788B4;\n}\n\n.search[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], .search[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #9788B4;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVzZXJzLWRhdGEuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcX2NvbG9ycy5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxhZG1pblxcYWRtaW4tcGFuZWxcXHVzZXJzLWRhdGFcXHVzZXJzLWRhdGEuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFDSSxjQ0d1QjtFREZ2QixlQUFBO0FFQUo7O0FGR0E7RUFDSSxjQ1BZO0FDT2hCOztBRkdBO0VBQ0ksY0NOdUI7QUNNM0I7O0FGSUk7RUFDSSwwQkFBQTtBRURSOztBRk9BO0VBQ0ksMkJBQUE7RUFDQSxlQUFBO0FFSko7O0FGTUE7RUFDSSxZQUFBO0FFSEo7O0FGS0k7RUFJSSxjQy9CVTtFRGdDVixlQUFBO0VBQ0EsWUFBQTtBRU5SOztBRk9RO0VBQ0ksY0NuQ007QUM4QmxCOztBRlNJO0VBQ0ksa0NBQUE7RUFDQSxxQkN6Q1U7QUNrQ2xCOztBRlNJO0VBQ0ksY0M1Q1U7QUNxQ2xCIiwiZmlsZSI6InVzZXJzLWRhdGEuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi9jb2xvcnMnO1xyXG4uZGVsZXRlIHtcclxuICAgIGNvbG9yOiAkYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLmNvbG9yZWRJY29uIHtcclxuICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbn1cclxuXHJcbi5jb2xvcmVkSWNvblNlYyB7XHJcbiAgICBjb2xvcjogJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I7XHJcbn1cclxuXHJcbi5jaSB7XHJcbiAgICAuZm9ybS1jb250cm9sIHtcclxuICAgICAgICB3aWR0aDogMTAwMDAwcHggIWltcG9ydGFudDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG50ZCB7XHJcbiAgICB0ZXh0LWFsaWduOiBsZWZ0ICFpbXBvcnRhbnQ7XHJcbiAgICBmb250LXNpemU6IDEycHg7XHJcbn1cclxuLnNlYXJjaCB7XHJcbiAgICBoZWlnaHQ6IDQycHg7XHJcblxyXG4gICAgaW5wdXQge1xyXG4gICAgICAgIC8vIGJvcmRlcjogJG1haW5UaGVtZUNvbG9yIHNvbGlkIDFweDtcclxuICAgICAgICAvLyBib3JkZXItcmFkaXVzOiAwO1xyXG4gICAgICAgIC8vIGJhY2tncm91bmQtY29sb3I6ICRzb2Z0VGhlbWVDb2xvcjtcclxuICAgICAgICBjb2xvcjogJHN1YlN1YlRoZW1lQ29sb3I7XHJcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgIGhlaWdodDogNDJweDtcclxuICAgICAgICAmOjpwbGFjZWhvbGRlciB7XHJcbiAgICAgICAgICAgIGNvbG9yOiAkc3ViU3ViVGhlbWVDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIC5wLWlucHV0dGV4dHtcclxuICAgICAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAhaW1wb3J0YW50O1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogJHN1YlN1YlRoZW1lQ29sb3I7XHJcbiAgICB9XHJcbiAgICBpICwgc3BhbiB7XHJcbiAgICAgICAgY29sb3I6ICRzdWJTdWJUaGVtZUNvbG9yO1xyXG4gICAgICAgIC8vIGJhY2tncm91bmQtY29sb3I6ICRzb2Z0VGhlbWVDb2xvcjtcclxuICAgICAgICAvLyBtYXJnaW4tcmlnaHQ6IDA7XHJcbiAgICB9XHJcbiAgICBcclxufSIsIiRtYWluVGhlbWVDb2xvcjojNTEzOTgyO1xyXG4kc3ViVGhlbWVDb2xvcjojNzQ2MTlCO1xyXG4kc3ViU3ViVGhlbWVDb2xvcjojOTc4OEI0O1xyXG4kc29mdFRoZW1lQ29sb3I6I0VFRUJGMztcclxuJGJvcmRlckNvbG9yOiNDQkM0REE7XHJcbiRidXR0b25NYWluQmFja2dyb3VuZENvbG9yOiNmNDgzMWY7IC8vI0Y1ODIxRjtcclxuJGJ1dHRvblN1YkJhY2tncm91bmRDb2xvcjojRkZBQjAwOyAvLyNGNTgyMUY7XHJcbiRidXR0b25TdWJTdWJCYWNrZ3JvdW5kQ29sb3I6I0ZFN0UxNTsgLy8jRjU4MjFGO1xyXG4kc2Vjb25kRm9udENvbG9yOiM3MDcwNzA7XHJcbiRncmF5QmFja0dyb3VuZENvbG9yOiNGNkY3Rjg7XHJcbiR3aGl0ZUNvbG9yOiNmZmY7XHJcbiRtYWluRm9udEZhbWlseTogJ0NhaXJvJztcclxuJHNvZnRHcmF5QmFja0dyb3VuZENvbG9yOiNGQ0ZDRkM7XHJcbiRiZ0xpZ2h0OiNGQUZCRkM7XHJcbiR0YWJCYWNrR3JvdW5kOiNmMWVjZjA7IiwiLmRlbGV0ZSB7XG4gIGNvbG9yOiAjZjQ4MzFmO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5jb2xvcmVkSWNvbiB7XG4gIGNvbG9yOiAjNTEzOTgyO1xufVxuXG4uY29sb3JlZEljb25TZWMge1xuICBjb2xvcjogI2Y0ODMxZjtcbn1cblxuLmNpIC5mb3JtLWNvbnRyb2wge1xuICB3aWR0aDogMTAwMDAwcHggIWltcG9ydGFudDtcbn1cblxudGQge1xuICB0ZXh0LWFsaWduOiBsZWZ0ICFpbXBvcnRhbnQ7XG4gIGZvbnQtc2l6ZTogMTJweDtcbn1cblxuLnNlYXJjaCB7XG4gIGhlaWdodDogNDJweDtcbn1cbi5zZWFyY2ggaW5wdXQge1xuICBjb2xvcjogIzk3ODhCNDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBoZWlnaHQ6IDQycHg7XG59XG4uc2VhcmNoIGlucHV0OjpwbGFjZWhvbGRlciB7XG4gIGNvbG9yOiAjOTc4OEI0O1xufVxuLnNlYXJjaCAucC1pbnB1dHRleHQge1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAhaW1wb3J0YW50O1xuICBib3JkZXItY29sb3I6ICM5Nzg4QjQ7XG59XG4uc2VhcmNoIGksIC5zZWFyY2ggc3BhbiB7XG4gIGNvbG9yOiAjOTc4OEI0O1xufSJdfQ== */"] });
function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


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
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 52816);
/* harmony import */ var src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/services/manager.guard */ 56913);
/* harmony import */ var _admin_panel_admin_vacations_admin_vacations_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../admin-panel/admin-vacations/admin-vacations.component */ 41015);
/* harmony import */ var _admin_panel_dash_board_dash_board_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../admin-panel/dash-board/dash-board.component */ 79320);
/* harmony import */ var _admin_panel_monthly_transportation_sheet_monthly_transportation_sheet_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../admin-panel/monthly-transportation-sheet/monthly-transportation-sheet.component */ 39584);
/* harmony import */ var _admin_panel_pending_transportations_pending_transportations_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../admin-panel/pending-transportations/pending-transportations.component */ 32626);
/* harmony import */ var _admin_panel_announcements_announcements_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../admin-panel/announcements/announcements.component */ 55958);
/* harmony import */ var _admin_panel_users_data_users_data_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../admin-panel/users-data/users-data.component */ 98625);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 3184);










const routes = [
    { path: 'dashboard', component: _admin_panel_dash_board_dash_board_component__WEBPACK_IMPORTED_MODULE_2__.DashBoardComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
    { path: 'vacations', component: _admin_panel_admin_vacations_admin_vacations_component__WEBPACK_IMPORTED_MODULE_1__.AdminVacationsComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
    { path: 'pendingtransportations', component: _admin_panel_pending_transportations_pending_transportations_component__WEBPACK_IMPORTED_MODULE_4__.PendingTransportationsComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
    { path: 'transportationsheet', component: _admin_panel_monthly_transportation_sheet_monthly_transportation_sheet_component__WEBPACK_IMPORTED_MODULE_3__.MonthlyTransportationSheetComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
    { path: 'announces', component: _admin_panel_announcements_announcements_component__WEBPACK_IMPORTED_MODULE_5__.AnnouncementsComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
    { path: 'usersdata', component: _admin_panel_users_data_users_data_component__WEBPACK_IMPORTED_MODULE_6__.UsersDataComponent, canActivate: [src_app_services_manager_guard__WEBPACK_IMPORTED_MODULE_0__.ManagerGuard] },
    // { path: 'timesheet', component:TimeSheetComponent,canActivate:[ManagerGuard]},
];
class AdminRoutingModule {
}
AdminRoutingModule.ɵfac = function AdminRoutingModule_Factory(t) { return new (t || AdminRoutingModule)(); };
AdminRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({ type: AdminRoutingModule });
AdminRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](AdminRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule] }); })();


/***/ }),

/***/ 31917:
/*!********************************************************!*\
  !*** ./src/app/components/admin/admin/admin.module.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AdminModule": () => (/* binding */ AdminModule)
/* harmony export */ });
/* harmony import */ var src_app_shared_shared_components_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/shared-components.module */ 17730);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _admin_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./admin-routing.module */ 50154);
/* harmony import */ var _admin_panel_admin_panel_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../admin-panel/admin-panel.component */ 43914);
/* harmony import */ var _admin_panel_dash_board_dash_board_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../admin-panel/dash-board/dash-board.component */ 79320);
/* harmony import */ var src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/angular-material.module */ 74786);
/* harmony import */ var _admin_panel_dash_board_dev_monthly_progress_dev_monthly_progress_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../admin-panel/dash-board/dev-monthly-progress/dev-monthly-progress.component */ 77660);
/* harmony import */ var _admin_panel_admin_vacations_pending_vacation_requests_pending_vacation_requests_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../admin-panel/admin-vacations/pending-vacation-requests/pending-vacation-requests.component */ 38414);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var _admin_panel_pending_transportations_pending_transportations_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../admin-panel/pending-transportations/pending-transportations.component */ 32626);
/* harmony import */ var _admin_panel_monthly_transportation_sheet_monthly_transportation_sheet_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../admin-panel/monthly-transportation-sheet/monthly-transportation-sheet.component */ 39584);
/* harmony import */ var _admin_panel_admin_vacations_admin_vacations_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../admin-panel/admin-vacations/admin-vacations.component */ 41015);
/* harmony import */ var _admin_panel_announcements_announcements_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../admin-panel/announcements/announcements.component */ 55958);
/* harmony import */ var _admin_panel_admin_vacations_official_vacations_official_vacations_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../admin-panel/admin-vacations/official-vacations/official-vacations.component */ 4866);
/* harmony import */ var _admin_panel_users_data_users_data_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../admin-panel/users-data/users-data.component */ 98625);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ 3184);
















class AdminModule {
}
AdminModule.ɵfac = function AdminModule_Factory(t) { return new (t || AdminModule)(); };
AdminModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineNgModule"]({ type: AdminModule });
AdminModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineInjector"]({ imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_14__.CommonModule,
            _admin_routing_module__WEBPACK_IMPORTED_MODULE_1__.AdminRoutingModule,
            src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_4__.AngularMaterialModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_15__.FormsModule,
            src_app_shared_shared_components_module__WEBPACK_IMPORTED_MODULE_0__.SharedComponentsModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵsetNgModuleScope"](AdminModule, { declarations: [_admin_panel_admin_panel_component__WEBPACK_IMPORTED_MODULE_2__.AdminPanelComponent,
        _admin_panel_dash_board_dash_board_component__WEBPACK_IMPORTED_MODULE_3__.DashBoardComponent,
        _admin_panel_dash_board_dev_monthly_progress_dev_monthly_progress_component__WEBPACK_IMPORTED_MODULE_5__.DevMonthlyProgressComponent,
        _admin_panel_admin_vacations_pending_vacation_requests_pending_vacation_requests_component__WEBPACK_IMPORTED_MODULE_6__.PendingVacationRequestsComponent,
        _admin_panel_pending_transportations_pending_transportations_component__WEBPACK_IMPORTED_MODULE_7__.PendingTransportationsComponent,
        _admin_panel_monthly_transportation_sheet_monthly_transportation_sheet_component__WEBPACK_IMPORTED_MODULE_8__.MonthlyTransportationSheetComponent,
        _admin_panel_admin_vacations_admin_vacations_component__WEBPACK_IMPORTED_MODULE_9__.AdminVacationsComponent,
        _admin_panel_announcements_announcements_component__WEBPACK_IMPORTED_MODULE_10__.AnnouncementsComponent,
        _admin_panel_admin_vacations_official_vacations_official_vacations_component__WEBPACK_IMPORTED_MODULE_11__.OfficialVacationsComponent,
        _admin_panel_users_data_users_data_component__WEBPACK_IMPORTED_MODULE_12__.UsersDataComponent], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.CommonModule,
        _admin_routing_module__WEBPACK_IMPORTED_MODULE_1__.AdminRoutingModule,
        src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_4__.AngularMaterialModule,
        _angular_forms__WEBPACK_IMPORTED_MODULE_15__.FormsModule,
        src_app_shared_shared_components_module__WEBPACK_IMPORTED_MODULE_0__.SharedComponentsModule] }); })();


/***/ }),

/***/ 59643:
/*!********************************************!*\
  !*** ./src/app/interfaces/announcement.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnnounceLang": () => (/* binding */ AnnounceLang),
/* harmony export */   "AnnounceStatus": () => (/* binding */ AnnounceStatus)
/* harmony export */ });
var AnnounceStatus;
(function (AnnounceStatus) {
    AnnounceStatus[AnnounceStatus["RUNNING"] = 0] = "RUNNING";
    AnnounceStatus[AnnounceStatus["CLOSED"] = 1] = "CLOSED";
})(AnnounceStatus || (AnnounceStatus = {}));
var AnnounceLang;
(function (AnnounceLang) {
    AnnounceLang["ARABIC"] = "rtl";
    AnnounceLang["ENGLISH"] = "ltr";
})(AnnounceLang || (AnnounceLang = {}));


/***/ })

}]);
//# sourceMappingURL=src_app_components_admin_admin_admin_module_ts.js.map