"use strict";
(self["webpackChunkfgsPM"] = self["webpackChunkfgsPM"] || []).push([["src_app_components_hr_hr_module_ts"],{

/***/ 28009:
/*!**********************************************************************************************************!*\
  !*** ./src/app/components/hr/hiring-process/candidates/candidate-details/candidate-details.component.ts ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CandidateDetailsComponent": () => (/* binding */ CandidateDetailsComponent)
/* harmony export */ });
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 92340);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 36362);



function CandidateDetailsComponent_span_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const isLast_r3 = ctx.last;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", item_r2.hr_job_title + (isLast_r3 ? " " : " , "), " ");
} }
function CandidateDetailsComponent_span_46_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const isLast_r5 = ctx.last;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", item_r4.hr_job_title + (isLast_r5 ? " " : " , "), " ");
} }
class CandidateDetailsComponent {
    constructor() {
        this.newServerApi = src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi;
    }
    ngOnInit() {
    }
}
CandidateDetailsComponent.ɵfac = function CandidateDetailsComponent_Factory(t) { return new (t || CandidateDetailsComponent)(); };
CandidateDetailsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: CandidateDetailsComponent, selectors: [["app-candidate-details"]], inputs: { candidate: "candidate" }, decls: 62, vars: 15, consts: [[1, "candidate-details", "py-4"], [1, "row", "m-0"], [1, "col-lg-12"], [1, "main-color", "fs-4"], ["class", "text-dark", 4, "ngFor", "ngForOf"], [1, "col-lg-6"], [1, "candidate-file", "bg-light"], ["target", "_blank", 1, "text-dark", 3, "href"], [1, "pi", "pi-file-pdf"], [1, "row", "align-items-center", "m-0"], [3, "href"], [1, "container-fluid", "candidate-general-details", "mt-4"], [1, "col-lg-12", "d-flex", "justify-content-between", "border-bottom", "my-1", "py-1"], [1, "main-color", "fw-bold"], [1, "col-lg-12", "my-1", "py-1"], [1, "text-dark"]], template: function CandidateDetailsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div")(1, "div", 0)(2, "div", 1)(3, "div", 2)(4, "div")(5, "p")(6, "span", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, " ( ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, CandidateDetailsComponent_span_9_Template, 2, 1, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, " ) ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 5)(12, "div", 6)(13, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "i", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](16, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "div", 9)(18, "div", 5)(19, "p")(20, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "Email:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "div", 5)(25, "p")(26, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27, "Phone Number:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "div", 11)(31, "div", 1)(32, "div", 12)(33, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, " Years of Experience:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "div", 12)(38, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](39, "Graduation Year:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](40, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "div", 12)(43, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](44, "Job Skills:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](45, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](46, CandidateDetailsComponent_span_46_Template, 2, 1, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](47, "div", 12)(48, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](49, "Address:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](50, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](51);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](52, "div", 12)(53, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](54, "Uploaded By:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](55, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](56);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](57, "div", 14)(58, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](59, "Notes:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](60, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](61);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.candidate.first_name + " " + ctx.candidate.last_name, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.candidate == null ? null : ctx.candidate.Job_title);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate2"]("href", "", ctx.newServerApi, "", ctx.candidate.file_path, "", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.candidate.file_name, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("href", "mailto:", ctx.candidate.email, "", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.candidate.email);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("href", "tel:+", ctx.candidate.phone_number, "", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.candidate.phone_number, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.candidate.experience || "--");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.candidate.graduated_year);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.candidate == null ? null : ctx.candidate.job_skills_id);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.candidate.address || "--");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.candidate.uploaded_by_name || "--");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.candidate.note || "--");
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf], styles: [".candidate-details[_ngcontent-%COMP%] {\n  background-color: #EEEBF3;\n  padding: 4px;\n}\n.candidate-details[_ngcontent-%COMP%]   .candidate-file[_ngcontent-%COMP%] {\n  padding: 8px;\n  border-radius: 8px;\n  color: black;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbmRpZGF0ZS1kZXRhaWxzLmNvbXBvbmVudC5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcRkdTJTIwVGFzayUyME1hbmFnZW1lbnQlMjBTeXN0ZW1cXGZnc3RtX3VpXFxzcmNcXGFwcFxcY29tcG9uZW50c1xcaHJcXGhpcmluZy1wcm9jZXNzXFxjYW5kaWRhdGVzXFxjYW5kaWRhdGUtZGV0YWlsc1xcY2FuZGlkYXRlLWRldGFpbHMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFFSSx5QkFBQTtFQUNBLFlBQUE7QUNESjtBREVJO0VBRUksWUFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtBQ0RSIiwiZmlsZSI6ImNhbmRpZGF0ZS1kZXRhaWxzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnLi4vLi4vLi4vLi4vLi4vY29sb3JzJztcclxuLmNhbmRpZGF0ZS1kZXRhaWxze1xyXG5cclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRzb2Z0VGhlbWVDb2xvcjtcclxuICAgIHBhZGRpbmc6IDRweDtcclxuICAgIC5jYW5kaWRhdGUtZmlsZXtcclxuICAgICAgICAvLyBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGdyYXk7XHJcbiAgICAgICAgcGFkZGluZzogOHB4O1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICB9XHJcbn0iLCIuY2FuZGlkYXRlLWRldGFpbHMge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRUVFQkYzO1xuICBwYWRkaW5nOiA0cHg7XG59XG4uY2FuZGlkYXRlLWRldGFpbHMgLmNhbmRpZGF0ZS1maWxlIHtcbiAgcGFkZGluZzogOHB4O1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIGNvbG9yOiBibGFjaztcbn0iXX0= */"] });


/***/ }),

/***/ 66720:
/*!****************************************************************************************************************!*\
  !*** ./src/app/components/hr/hiring-process/candidates/candidate-management/candidate-management.component.ts ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CandidateManagementComponent": () => (/* binding */ CandidateManagementComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/environments/environment */ 92340);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 25722);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 86942);
/* harmony import */ var src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/hr.service */ 35487);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/loading.service */ 4471);
/* harmony import */ var _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/form-input/form-input.component */ 37604);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var primeng_multiselect__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! primeng/multiselect */ 22460);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/form-field */ 44770);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/chips */ 81196);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/icon */ 65590);
/* harmony import */ var _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/autocomplete */ 43188);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/core */ 88133);
/* harmony import */ var primeng_sidebar__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! primeng/sidebar */ 49734);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var _candidate_details_candidate_details_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../candidate-details/candidate-details.component */ 28009);

























const _c0 = ["skillInput"];
function CandidateManagementComponent_div_12_Template(rf, ctx) { if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div")(1, "div", 35)(2, "div", 36)(3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function CandidateManagementComponent_div_12_Template_span_click_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r15); const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](); return ctx_r14.goToExistedCandidate("email"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](6, "View Candidate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ((tmp_0_0 = ctx_r0.candidateForm.get("email")) == null ? null : tmp_0_0.errors)["exist"], " ");
} }
function CandidateManagementComponent_div_15_Template(rf, ctx) { if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div")(1, "div", 35)(2, "div", 36)(3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function CandidateManagementComponent_div_15_Template_span_click_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r17); const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](); return ctx_r16.goToExistedCandidate("phone_number"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](6, "View Candidate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ((tmp_0_0 = ctx_r1.candidateForm.get("phone_number")) == null ? null : tmp_0_0.errors)["exist"], " ");
} }
function CandidateManagementComponent_div_25_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, " Job Title Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} }
function CandidateManagementComponent_div_29_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 39)(1, "a", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "i", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r4.file.name, "");
} }
function CandidateManagementComponent_div_30_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 39)(1, "a", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "i", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate2"]("href", "", ctx_r5.newServerApi, "", ctx_r5.candidate.file_path, "", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx_r5.candidate.file_name, " ");
} }
function CandidateManagementComponent_div_32_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, " Candidate Cv Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} }
function CandidateManagementComponent_mat_chip_39_Template(rf, ctx) { if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "mat-chip", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("removed", function CandidateManagementComponent_mat_chip_39_Template_mat_chip_removed_0_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r21); const i_r19 = restoredCtx.index; const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](); return ctx_r20.removeSkill(i_r19); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](2, "button", 44)(3, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4, "cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const jobSkill_r18 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", jobSkill_r18.job_skill, " ");
} }
function CandidateManagementComponent_div_42_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, " job skills are Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} }
function CandidateManagementComponent_mat_option_45_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "mat-option", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const skill_r22 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("value", skill_r22.job_skill);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", skill_r22.job_skill, " ");
} }
function CandidateManagementComponent_ng_template_62_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](0, "app-candidate-details", 46);
} if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("candidate", ctx_r13.selectedCandidate);
} }
const _c1 = function (a0) { return { "is-invalid": a0 }; };
class CandidateManagementComponent {
    constructor(hrService, _notify, _auth, _db, loadingService) {
        this.hrService = hrService;
        this._notify = _notify;
        this._auth = _auth;
        this._db = _db;
        this.loadingService = loadingService;
        this.currentUser = this._auth.currentUser;
        this.updateCandidateList = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
        this.jobProfiles = [];
        this.jobProfilesLoading = true;
        this.maxGraduatedYear = new Date().getFullYear() + 4;
        this.minGraduatedYear = new Date().getFullYear() - 40;
        this.newServerApi = src_environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.newServerApi;
        this.jobSkills = [];
        // separatorKeysCodes: number[] = [ENTER, COMMA];
        this.selectedSkills = [];
        this.showCandidateDetails = false;
        this.candidateForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormGroup({
            "first_name": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required),
            "last_name": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required),
            "email": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.email]),
            "phone_number": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required),
            "job_title_id": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required),
            "job_skills_id": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required),
            "file_name": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required),
            "graduated_year": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.max(this.maxGraduatedYear), _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.min(this.minGraduatedYear)]),
            "experience": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required),
            "address": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null),
            "note": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null),
        });
        this.filteredSkills = this.candidateForm.get('job_skills_id').valueChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.startWith)(null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.map)((skill_title) => {
            // this.selectedSkills = [...new Set(this.selectedSkills)];
            let setObj = new Map(this.selectedSkills.map((obj) => {
                return [JSON.stringify(obj), obj];
            }));
            this.selectedSkills = Array.from(setObj.values());
            return (skill_title ? this._filter(skill_title) : this.jobSkills);
        }));
    }
    ngOnInit() {
        this.getAllJobProfiles();
        if (this.candidate) {
            this.candidateForm.patchValue(Object.assign(Object.assign({}, this.candidate), { job_title_id: this.candidate.Job_title.map(x => (x.job_title_id)) }));
            this.selectedSkills = this.candidate.job_skills_id.map(x => {
                return { id: x.job_skill_id, job_skill: x.hr_job_title };
            });
        }
        this.getAllSkills();
    }
    //main logic 
    onSubmit() {
        var _a, _b, _c, _d;
        this.candidateForm.patchValue({
            job_skills_id: this.selectedSkills.map(x => (x.id))
        });
        this.candidateForm.markAllAsTouched();
        if (!!((_a = this.candidateForm.get('graduated_year')) === null || _a === void 0 ? void 0 : _a.errors) &&
            (!!((_b = this.candidateForm.get('graduated_year')) === null || _b === void 0 ? void 0 : _b.errors['min']) || !!((_c = this.candidateForm.get('graduated_year')) === null || _c === void 0 ? void 0 : _c.errors['max']))) {
            (_d = this.candidateForm.get('graduated_year')) === null || _d === void 0 ? void 0 : _d.setErrors({ graduated_year_range: `Graduated Year range must be between ${this.minGraduatedYear} and ${this.maxGraduatedYear} ` });
        }
        if (this.candidateForm.invalid)
            return;
        if (this.candidate) {
            this.updateCandidate();
        }
        else {
            this.createCandidate();
        }
    }
    createCandidate() {
        var _a, _b, _c;
        const formData = new FormData();
        formData.append('job_title_id', `[${(_a = this.candidateForm.get('job_title_id')) === null || _a === void 0 ? void 0 : _a.value}]`);
        formData.append('job_skills_id', `[${(_b = this.candidateForm.get('job_skills_id')) === null || _b === void 0 ? void 0 : _b.value}]`);
        for (const key in this.candidateForm.value) {
            if (key != 'job_title_id' && key != 'job_skills_id') {
                formData.append(key, (_c = this.candidateForm.get(key)) === null || _c === void 0 ? void 0 : _c.value);
            }
        }
        this.loadingService.setLoading(true);
        this.hrService.createCandidate(formData).subscribe({
            next: res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                    this.updateCandidateList.emit(res['data']);
                    this._notify.openSnackbar(`Candidate created successfully`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                }
                this.loadingService.setLoading(false);
            }, error: err => {
                this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Candidate At ${new Date().toLocaleString()}`, `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Candidate At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe();
                this.loadingService.setLoading(false);
            }
        });
    }
    updateCandidate() {
        var _a, _b, _c, _d;
        const formData = new FormData();
        formData.append('id', this.candidate.id);
        formData.append('job_title_id', `[${(_a = this.candidateForm.get('job_title_id')) === null || _a === void 0 ? void 0 : _a.value}]`);
        formData.append('job_skills_id', `[${(_b = this.candidateForm.get('job_skills_id')) === null || _b === void 0 ? void 0 : _b.value}]`);
        for (const key in this.candidateForm.value) {
            if (key != 'job_title_id' && key != 'job_skills_id') {
                if (this.candidate[key] != ((_c = this.candidateForm.get(key)) === null || _c === void 0 ? void 0 : _c.value)) {
                    formData.append(key, (_d = this.candidateForm.get(key)) === null || _d === void 0 ? void 0 : _d.value);
                }
            }
        }
        this.loadingService.setLoading(true);
        this.hrService.updateCandidate(formData).subscribe({
            next: res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                    this.updateCandidateList.emit(res['data']);
                    this._notify.openSnackbar(`Candidate updated successfully`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                }
                this.loadingService.setLoading(false);
            }, error: err => {
                this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Update Candidate At ${new Date().toLocaleString()}`, `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Update Candidate At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe();
                this.loadingService.setLoading(false);
            }
        });
    }
    uploadFile(event) {
        var _a;
        this.file = event.target.files[0];
        if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(this.file.type)) {
            (_a = this.candidateForm.get('file_name')) === null || _a === void 0 ? void 0 : _a.setValue(this.file);
        }
        else {
            this._notify.openSnackbar(`please upload pdf or word file`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Warning, 10000);
        }
    }
    //existed candidate
    goToExistedCandidate(key) {
        var _a;
        let existCandidate = { [key]: (_a = this.candidateForm.get(key)) === null || _a === void 0 ? void 0 : _a.value };
        this.loadingService.setLoading(true);
        this.hrService.GetCandidateDetailsDuplicate(existCandidate).subscribe({
            next: res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                    // this.existCandidate.emit(res['data']);
                    this.selectedCandidate = res['data'];
                    this.showCandidateDetails = true;
                }
                this.loadingService.setLoading(false);
            }, error: err => {
                var _a, _b;
                this.loadingService.setLoading(false);
                this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Get Candidate Details Duplicate of ${(_a = this.candidateForm.get(key)) === null || _a === void 0 ? void 0 : _a.value} At ${new Date().toLocaleString()}`, `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Get Candidate Details Duplicate of ${(_b = this.candidateForm.get(key)) === null || _b === void 0 ? void 0 : _b.value} At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe();
            }
        });
    }
    checkExistedCandidate(key) {
        var _a, _b, _c;
        let existCandidate = { [key]: (_a = this.candidateForm.get(key)) === null || _a === void 0 ? void 0 : _a.value };
        if (!((_b = this.candidateForm.get(key)) === null || _b === void 0 ? void 0 : _b.errors)) {
            if (!this.candidate || (this.candidate[key] != ((_c = this.candidateForm.get(key)) === null || _c === void 0 ? void 0 : _c.value))) {
                this.hrService.checkCandidateData(existCandidate).subscribe({
                    next: res => {
                        if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                        }
                    }, error: err => {
                        var _a, _b;
                        (_a = this.candidateForm.get(key)) === null || _a === void 0 ? void 0 : _a.setErrors(Object.assign(Object.assign({}, (_b = this.candidateForm.get(key)) === null || _b === void 0 ? void 0 : _b.errors), { 'exist': err['error']['data'][key] }));
                    }
                });
            }
        }
    }
    //job profile
    getAllJobProfiles() {
        this.jobProfilesLoading = true;
        this.hrService.getAllJobProfiles().subscribe({
            next: res => {
                this.jobProfilesLoading = false;
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                    this.jobProfiles = res['data'];
                }
                else {
                    this.jobProfiles = [];
                }
                if (this.candidate) {
                    this.candidateForm.patchValue({
                        job_title_id: this.candidate.Job_title.map(x => (x.job_title_id)),
                    });
                }
            }, error: err => {
                this.jobProfilesLoading = false;
            }
        });
    }
    onChangeJobTitle(selectedJobProfile) {
        var _a;
        let jobTitle = this.jobProfiles.find(x => x.id == selectedJobProfile.itemValue);
        let skills = (_a = jobTitle === null || jobTitle === void 0 ? void 0 : jobTitle.job_skills_id) === null || _a === void 0 ? void 0 : _a.map(x => {
            return { id: x.job_skill_id, job_skill: x.hr_job_title };
        });
        if (selectedJobProfile.value.includes(selectedJobProfile.itemValue)) {
            this.selectedSkills.push(...skills);
        }
        else {
            // const results = this.selectedSkills.filter(({ id: id1 }) => !skills.some(({ id: id2 }) => id2 === id1));
            this.selectedSkills = this.selectedSkills.filter(x => !skills.some(s => s.id === x.id));
        }
        let setObj = new Map(this.selectedSkills.map((obj) => {
            return [JSON.stringify(obj), obj];
        }));
        this.selectedSkills = Array.from(setObj.values());
    }
    //skills chips operations
    getAllSkills() {
        this.hrService.getAllJobSkills().subscribe({
            next: res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                    this.jobSkills = res['data'];
                }
            }, error: err => {
            }
        });
    }
    addSkill(event) {
        // const value = (event.value || '').trim();
        // // this.selectedSkills.push(value);
        // // if (this.jobSkills.find(x=>x.job_skill==value)) {
        // // }else{
        // //   this._notify.openSnackbar('there is no matches skills',SnackBarState.Error)
        // // }
        // event.chipInput!.clear();
        // this.candidateForm.get('job_skills_id')!.setValue(null);
    }
    removeSkill(index) {
        // const index = this.selectedSkills.findIndex(x => x.id == skill_title.id);
        // if (index >= 0) {
        this.selectedSkills.splice(index, 1);
        // }
    }
    selectingSkill(event) {
        let skill = this.jobSkills.find(x => x.job_skill == event.option.viewValue);
        if (!this.selectedSkills.find(x => x.id == skill.id)) {
            this.selectedSkills.push(skill);
        }
        this.skillInput.nativeElement.value = '';
        this.candidateForm.get('job_skills_id').setValue(null);
        // this.filteredSkills =of(this.jobSkills);
    }
    _filter(skill) {
        const filterValue = skill.toString().toLowerCase();
        return this.jobSkills.filter(skill => { var _a, _b; return (_b = (_a = skill.job_skill) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes(filterValue); }) || this.jobSkills;
    }
}
CandidateManagementComponent.ɵfac = function CandidateManagementComponent_Factory(t) { return new (t || CandidateManagementComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_3__.HrService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_6__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_7__.LoadingService)); };
CandidateManagementComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineComponent"]({ type: CandidateManagementComponent, selectors: [["app-candidate-management"]], viewQuery: function CandidateManagementComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵviewQuery"](_c0, 5);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵloadQuery"]()) && (ctx.skillInput = _t.first);
    } }, inputs: { candidate: "candidate" }, outputs: { updateCandidateList: "updateCandidateList" }, decls: 63, vars: 37, consts: [[1, "sidebar-header"], [1, "main-color"], [3, "formGroup", "ngSubmit"], [1, "row"], [1, "col-lg-6"], ["label", "First Name", "placeholder", "Write Candidate First Name", 3, "control"], ["label", "Last Name", "placeholder", "Write Candidate Last Name", 3, "control"], ["label", "Email", "type", "email", "placeholder", "Write Candidate Email", 3, "control", "focusout"], [4, "ngIf"], ["label", "Phone Number", "placeholder", "Write Candidate Phone Number", 3, "control", "focusout"], ["label", "Graduated Year", "type", "Number", "placeholder", "Write Graduated Year", 3, "control"], ["label", "Years of Experience", "type", "Number", "placeholder", "Write Candidate Experience", 3, "control"], [1, "col-lg-6", "my-2"], ["formControlName", "job_title_id", "defaultLabel", "Select Job Title", "optionLabel", "hr_job_title", "optionValue", "id", "display", "chip", "appendTo", "body", 1, "jop-profile-select", 3, "options", "dropdownIcon", "ngClass", "onChange"], ["sss", ""], ["class", "invalid-feedback", 4, "ngIf"], ["for", "cv_file"], ["class", "candidate-file bg-light", 4, "ngIf"], ["type", "file", "name", "", "id", "cv_file", "accept", ".pdf,.docx", 1, "form-control", 3, "ngClass", "change"], [1, "col-lg-12", "my-2"], ["appearance", "fill", 1, "example-chip-list", "w-100"], ["aria-label", "Fruit selection"], ["chipList", ""], [3, "removed", 4, "ngFor", "ngForOf"], ["placeholder", "Job Skills...", "formControlName", "job_skills_id", 3, "matAutocomplete", "matChipInputFor", "ngClass", "matChipInputTokenEnd"], ["skillInput", ""], [3, "optionSelected"], ["auto", "matAutocomplete"], [3, "value", 4, "ngFor", "ngForOf"], ["rows", "5", "formControlName", "address", 1, "form-control"], ["rows", "5", "formControlName", "note", 1, "form-control"], [1, "row", "my-4"], ["type", "submit", 1, "btn", "btnStyle", "w-100"], ["styleClass", "p-sidebar-md", "position", "right", 1, "side", 3, "baseZIndex", "autoZIndex", "visible", "transitionOptions", "visibleChange"], ["pTemplate", "content"], [1, "my-2"], [1, "email-error-message"], [1, "text-info", "text-decoration-underline", "cursor", 3, "click"], [1, "invalid-feedback"], [1, "candidate-file", "bg-light"], ["target", "_blank", 1, "text-dark"], [1, "pi", "pi-file-pdf"], ["target", "_blank", 1, "text-dark", 3, "href"], [3, "removed"], ["matChipRemove", ""], [3, "value"], [3, "candidate"]], template: function CandidateManagementComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div")(1, "div", 0)(2, "h1", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "form", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngSubmit", function CandidateManagementComponent_Template_form_ngSubmit_4_listener() { return ctx.onSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "div", 3)(6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](7, "app-form-input", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](8, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](9, "app-form-input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](10, "div", 4)(11, "app-form-input", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("focusout", function CandidateManagementComponent_Template_app_form_input_focusout_11_listener() { return ctx.checkExistedCandidate("email"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](12, CandidateManagementComponent_div_12_Template, 7, 1, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](13, "div", 4)(14, "app-form-input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("focusout", function CandidateManagementComponent_Template_app_form_input_focusout_14_listener() { return ctx.checkExistedCandidate("phone_number"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](15, CandidateManagementComponent_div_15_Template, 7, 1, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](16, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](17, "app-form-input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](18, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](19, "app-form-input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](20, "div", 12)(21, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](22, "Job Title");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](23, "p-multiSelect", 13, 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("onChange", function CandidateManagementComponent_Template_p_multiSelect_onChange_23_listener($event) { return ctx.onChangeJobTitle($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](25, CandidateManagementComponent_div_25_Template, 2, 0, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](26, "div", 12)(27, "label", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](28, " Upload CV ");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](29, CandidateManagementComponent_div_29_Template, 4, 1, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](30, CandidateManagementComponent_div_30_Template, 4, 3, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](31, "input", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("change", function CandidateManagementComponent_Template_input_change_31_listener($event) { return ctx.uploadFile($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](32, CandidateManagementComponent_div_32_Template, 2, 0, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](33, "div", 19)(34, "mat-form-field", 20)(35, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](36, " job Skills");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](37, "mat-chip-list", 21, 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](39, CandidateManagementComponent_mat_chip_39_Template, 5, 1, "mat-chip", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](40, "input", 24, 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("matChipInputTokenEnd", function CandidateManagementComponent_Template_input_matChipInputTokenEnd_40_listener($event) { return ctx.addSkill($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](42, CandidateManagementComponent_div_42_Template, 2, 0, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](43, "mat-autocomplete", 26, 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("optionSelected", function CandidateManagementComponent_Template_mat_autocomplete_optionSelected_43_listener($event) { return ctx.selectingSkill($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](45, CandidateManagementComponent_mat_option_45_Template, 2, 2, "mat-option", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](46, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](47, "div", 19)(48, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](49, "Address");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](50, "textarea", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](51, "        ");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](52, "div", 19)(53, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](54, "Notes");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](55, "textarea", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](56, "        ");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](57, "div", 31)(58, "div", 4)(59, "button", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](60);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](61, "p-sidebar", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("visibleChange", function CandidateManagementComponent_Template_p_sidebar_visibleChange_61_listener($event) { return ctx.showCandidateDetails = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](62, CandidateManagementComponent_ng_template_62_Template, 1, 1, "ng-template", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵreference"](38);
        const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵreference"](44);
        let tmp_5_0;
        let tmp_7_0;
        let tmp_12_0;
        let tmp_13_0;
        let tmp_16_0;
        let tmp_17_0;
        let tmp_21_0;
        let tmp_22_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx.candidate ? "Update Candidate" : "Add Candidate", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("formGroup", ctx.candidateForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("control", ctx.candidateForm.get("first_name"));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("control", ctx.candidateForm.get("last_name"));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("control", ctx.candidateForm.get("email"));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ((tmp_5_0 = ctx.candidateForm.get("email")) == null ? null : tmp_5_0.errors) && ((tmp_5_0 = ctx.candidateForm.get("email")) == null ? null : tmp_5_0.errors)["exist"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("control", ctx.candidateForm.get("phone_number"));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ((tmp_7_0 = ctx.candidateForm.get("phone_number")) == null ? null : tmp_7_0.errors) && ((tmp_7_0 = ctx.candidateForm.get("phone_number")) == null ? null : tmp_7_0.errors)["exist"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("control", ctx.candidateForm.get("graduated_year"));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("control", ctx.candidateForm.get("experience"));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("options", ctx.jobProfiles)("dropdownIcon", ctx.jobProfilesLoading ? "pi pi-spin pi-spinner" : "pi pi-angle-down")("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction1"](31, _c1, !((tmp_12_0 = ctx.candidateForm.get("job_title_id")) == null ? null : tmp_12_0.valid) && ((tmp_12_0 = ctx.candidateForm.get("job_title_id")) == null ? null : tmp_12_0.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !((tmp_13_0 = ctx.candidateForm.get("job_title_id")) == null ? null : tmp_13_0.valid) && ((tmp_13_0 = ctx.candidateForm.get("job_title_id")) == null ? null : tmp_13_0.touched));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.file);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", (ctx.candidate == null ? null : ctx.candidate.file_name) && !ctx.file);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction1"](33, _c1, !((tmp_16_0 = ctx.candidateForm.get("file_name")) == null ? null : tmp_16_0.valid) && ((tmp_16_0 = ctx.candidateForm.get("file_name")) == null ? null : tmp_16_0.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !((tmp_17_0 = ctx.candidateForm.get("file_name")) == null ? null : tmp_17_0.valid) && ((tmp_17_0 = ctx.candidateForm.get("file_name")) == null ? null : tmp_17_0.touched));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngForOf", ctx.selectedSkills);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("matAutocomplete", _r11)("matChipInputFor", _r7)("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction1"](35, _c1, ctx.selectedSkills.length == 0 && ((tmp_21_0 = ctx.candidateForm.get("job_skills_id")) == null ? null : tmp_21_0.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.selectedSkills.length == 0 && ((tmp_22_0 = ctx.candidateForm.get("job_skills_id")) == null ? null : tmp_22_0.touched));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](46, 29, ctx.filteredSkills));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx.candidate ? "Update" : "Create", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("baseZIndex", 999)("autoZIndex", false)("visible", ctx.showCandidateDetails)("transitionOptions", "350ms");
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormGroupDirective, _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_8__.FormInputComponent, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgIf, primeng_multiselect__WEBPACK_IMPORTED_MODULE_15__.MultiSelect, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControlName, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_16__.NativeElementInjectorDirective, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgClass, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_17__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_17__.MatLabel, _angular_material_chips__WEBPACK_IMPORTED_MODULE_18__.MatChipList, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgForOf, _angular_material_chips__WEBPACK_IMPORTED_MODULE_18__.MatChip, _angular_material_chips__WEBPACK_IMPORTED_MODULE_18__.MatChipRemove, _angular_material_icon__WEBPACK_IMPORTED_MODULE_19__.MatIcon, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.DefaultValueAccessor, _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_20__.MatAutocompleteTrigger, _angular_material_chips__WEBPACK_IMPORTED_MODULE_18__.MatChipInput, _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_20__.MatAutocomplete, _angular_material_core__WEBPACK_IMPORTED_MODULE_21__.MatOption, primeng_sidebar__WEBPACK_IMPORTED_MODULE_22__.Sidebar, primeng_api__WEBPACK_IMPORTED_MODULE_23__.PrimeTemplate, _candidate_details_candidate_details_component__WEBPACK_IMPORTED_MODULE_9__.CandidateDetailsComponent], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.AsyncPipe], styles: [".jop-profile-select .p-multiselect, .jop-skills-select .p-multiselect {\n  width: 100%;\n}\n.jop-profile-select .p-multiselect .p-multiselect-label, .jop-skills-select .p-multiselect .p-multiselect-label {\n  padding: 0.575rem 0.75rem;\n}\n.email-error-message {\n  background-color: #ffe6e6;\n  color: #dc3545;\n  padding: 12px;\n  border-radius: 8px;\n}\n.candidate-file {\n  padding: 8px;\n  border-radius: 8px;\n  color: black;\n  margin: 8px 0;\n}\n.add-skill-icon {\n  background: #EEEBF3;\n  padding: 6px;\n  border-radius: 50%;\n  color: #513982;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbmRpZGF0ZS1tYW5hZ2VtZW50LmNvbXBvbmVudC5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcRkdTJTIwVGFzayUyME1hbmFnZW1lbnQlMjBTeXN0ZW1cXGZnc3RtX3VpXFxzcmNcXGFwcFxcY29tcG9uZW50c1xcaHJcXGhpcmluZy1wcm9jZXNzXFxjYW5kaWRhdGVzXFxjYW5kaWRhdGUtbWFuYWdlbWVudFxcY2FuZGlkYXRlLW1hbmFnZW1lbnQuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcLi5cXF9jb2xvcnMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHSTtFQUVJLFdBQUE7QUNIUjtBRElRO0VBQ0kseUJBQUE7QUNGWjtBRE9BO0VBQ0kseUJBQUE7RUFDQSxjQUFBO0VBQ0EsYUFBQTtFQUNBLGtCQUFBO0FDSko7QURPQTtFQUVJLFlBQUE7RUFDQSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0FDTEo7QURPQTtFQUNJLG1CRXhCWTtFRnlCWixZQUFBO0VBQ0Esa0JBQUE7RUFDQSxjRTlCWTtBRDBCaEIiLCJmaWxlIjoiY2FuZGlkYXRlLW1hbmFnZW1lbnQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi8uLi9jb2xvcnMnO1xyXG5cclxuLmpvcC1wcm9maWxlLXNlbGVjdCAsIC5qb3Atc2tpbGxzLXNlbGVjdHtcclxuICAgIC5wLW11bHRpc2VsZWN0e1xyXG5cclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAucC1tdWx0aXNlbGVjdC1sYWJlbCB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDAuNTc1cmVtIDAuNzVyZW07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4uZW1haWwtZXJyb3ItbWVzc2FnZXtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmU2ZTY7XHJcbiAgICBjb2xvcjogI2RjMzU0NTtcclxuICAgIHBhZGRpbmc6IDEycHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbn1cclxuXHJcbi5jYW5kaWRhdGUtZmlsZXtcclxuICAgIC8vIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JheTtcclxuICAgIHBhZGRpbmc6IDhweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgIGNvbG9yOiBibGFjaztcclxuICAgIG1hcmdpbjogOHB4IDA7XHJcbn1cclxuLmFkZC1za2lsbC1pY29ue1xyXG4gICAgYmFja2dyb3VuZDogJHNvZnRUaGVtZUNvbG9yO1xyXG4gICAgcGFkZGluZzogNnB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxufSIsIi5qb3AtcHJvZmlsZS1zZWxlY3QgLnAtbXVsdGlzZWxlY3QsIC5qb3Atc2tpbGxzLXNlbGVjdCAucC1tdWx0aXNlbGVjdCB7XG4gIHdpZHRoOiAxMDAlO1xufVxuLmpvcC1wcm9maWxlLXNlbGVjdCAucC1tdWx0aXNlbGVjdCAucC1tdWx0aXNlbGVjdC1sYWJlbCwgLmpvcC1za2lsbHMtc2VsZWN0IC5wLW11bHRpc2VsZWN0IC5wLW11bHRpc2VsZWN0LWxhYmVsIHtcbiAgcGFkZGluZzogMC41NzVyZW0gMC43NXJlbTtcbn1cblxuLmVtYWlsLWVycm9yLW1lc3NhZ2Uge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZlNmU2O1xuICBjb2xvcjogI2RjMzU0NTtcbiAgcGFkZGluZzogMTJweDtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xufVxuXG4uY2FuZGlkYXRlLWZpbGUge1xuICBwYWRkaW5nOiA4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgY29sb3I6IGJsYWNrO1xuICBtYXJnaW46IDhweCAwO1xufVxuXG4uYWRkLXNraWxsLWljb24ge1xuICBiYWNrZ3JvdW5kOiAjRUVFQkYzO1xuICBwYWRkaW5nOiA2cHg7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgY29sb3I6ICM1MTM5ODI7XG59IiwiJG1haW5UaGVtZUNvbG9yOiM1MTM5ODI7XHJcbiRzdWJUaGVtZUNvbG9yOiM3NDYxOUI7XHJcbiRzdWJTdWJUaGVtZUNvbG9yOiM5Nzg4QjQ7XHJcbiRzb2Z0VGhlbWVDb2xvcjojRUVFQkYzO1xyXG4kYm9yZGVyQ29sb3I6I0NCQzREQTtcclxuJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I6I2Y0ODMxZjsgLy8jRjU4MjFGO1xyXG4kYnV0dG9uU3ViQmFja2dyb3VuZENvbG9yOiNGRkFCMDA7IC8vI0Y1ODIxRjtcclxuJGJ1dHRvblN1YlN1YkJhY2tncm91bmRDb2xvcjojRkU3RTE1OyAvLyNGNTgyMUY7XHJcbiRzZWNvbmRGb250Q29sb3I6IzcwNzA3MDtcclxuJGdyYXlCYWNrR3JvdW5kQ29sb3I6I0Y2RjdGODtcclxuJHdoaXRlQ29sb3I6I2ZmZjtcclxuJG1haW5Gb250RmFtaWx5OiAnQ2Fpcm8nO1xyXG4kc29mdEdyYXlCYWNrR3JvdW5kQ29sb3I6I0ZDRkNGQztcclxuJGJnTGlnaHQ6I0ZBRkJGQztcclxuJHRhYkJhY2tHcm91bmQ6I2YxZWNmMDsiXX0= */"], encapsulation: 2 });


/***/ }),

/***/ 78320:
/*!********************************************************************************************************!*\
  !*** ./src/app/components/hr/hiring-process/candidates/candidate-search/candidate-search.component.ts ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CandidateSearchComponent": () => (/* binding */ CandidateSearchComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/hr.service */ 35487);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/loading.service */ 4471);
/* harmony import */ var _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../shared/form-input/form-input.component */ 37604);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var primeng_multiselect__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/multiselect */ 22460);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);














function CandidateSearchComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](0, "div");
} }
function CandidateSearchComponent_button_29_Template(rf, ctx) { if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function CandidateSearchComponent_button_29_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r5); const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](); ctx_r4.candidateForm.reset(); return ctx_r4.filterCandidates(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " reset ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
} }
class CandidateSearchComponent {
    constructor(hrService, _notify, _auth, _db, loadingService) {
        this.hrService = hrService;
        this._notify = _notify;
        this._auth = _auth;
        this._db = _db;
        this.loadingService = loadingService;
        this.jobProfiles = [];
        this.jobProfilesLoading = true;
        this.jobSkills = [];
        this.jobSkillsLoading = true;
        this.maxGraduatedYear = new Date().getFullYear() + 4;
        this.minGraduatedYear = new Date().getFullYear() - 40;
        this.resetFilter = false;
        this.onFilterCandidates = new _angular_core__WEBPACK_IMPORTED_MODULE_7__.EventEmitter();
        this.candidateForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormGroup({
            "first_name": new _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControl(null),
            "last_name": new _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControl(null),
            "email": new _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControl(null),
            "phone_number": new _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControl(null),
            "job_title_id": new _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControl(null),
            "job_skills_id": new _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControl(null),
            "graduated_year": new _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControl(null, [_angular_forms__WEBPACK_IMPORTED_MODULE_8__.Validators.max(this.maxGraduatedYear), _angular_forms__WEBPACK_IMPORTED_MODULE_8__.Validators.min(this.minGraduatedYear)]),
            "experience": new _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControl(null),
        });
    }
    ngOnInit() {
        this.getAllJobProfiles();
        this.getAllJobSkills();
        if (this.filterObj) {
            for (const key in this.filterObj) {
                if (this.filterObj.hasOwnProperty(key)) {
                    this.resetFilter = true;
                }
            }
            let skillsArray = this.filterObj.job_skills_id ? JSON.parse(this.filterObj.job_skills_id) : null;
            this.candidateForm.patchValue(Object.assign(Object.assign({}, this.filterObj), { job_skills_id: skillsArray ? skillsArray.map(x => x.toString()) : null, job_title_id: this.filterObj.job_title_id ? JSON.parse(this.filterObj.job_title_id) : null }));
        }
    }
    //job profile
    getAllJobProfiles() {
        this.jobProfilesLoading = true;
        this.hrService.getAllJobProfiles().subscribe({
            next: res => {
                this.jobProfilesLoading = false;
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                    this.jobProfiles = res['data'];
                }
                else {
                    this.jobProfiles = [];
                }
            }, error: err => {
                this.jobSkillsLoading = false;
            }
        });
    }
    getAllJobSkills() {
        this.jobSkillsLoading = true;
        this.hrService.getAllJobSkills().subscribe({
            next: res => {
                this.jobSkillsLoading = false;
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                    this.jobSkills = res['data'];
                }
                else {
                    this.jobSkills = [];
                }
            }, error: err => {
                this.jobSkillsLoading = false;
            }
        });
    }
    filterCandidates() {
        let candidateObj = this.candidateForm.value;
        for (const key in candidateObj) {
            if (Object.prototype.hasOwnProperty.call(candidateObj, key)) {
                const element = candidateObj[key];
                if (!element) {
                    delete candidateObj[key];
                }
            }
        }
        candidateObj.job_title_id ? candidateObj.job_title_id = `[${candidateObj.job_title_id.toString()}]` : null;
        candidateObj.job_skills_id ? candidateObj.job_skills_id = `[${candidateObj.job_skills_id}]` : null;
        this.onFilterCandidates.emit(candidateObj);
    }
}
CandidateSearchComponent.ɵfac = function CandidateSearchComponent_Factory(t) { return new (t || CandidateSearchComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_1__.HrService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_2__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_3__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_4__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_5__.LoadingService)); };
CandidateSearchComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({ type: CandidateSearchComponent, selectors: [["app-candidate-search"]], inputs: { filterObj: "filterObj" }, outputs: { onFilterCandidates: "onFilterCandidates" }, decls: 30, vars: 13, consts: [[3, "formGroup", "ngSubmit"], [1, "row"], [1, "col-lg-6"], ["label", "First Name", "placeholder", "Write Candidate First Name", 3, "control"], ["label", "Last Name", "placeholder", "Write Candidate Last Name", 3, "control"], ["label", "Email", "type", "email", "placeholder", "Write Candidate Email", 3, "control"], [4, "ngIf"], ["label", "Phone Number", "placeholder", "Write Candidate Phone Number", 3, "control"], ["label", "Graduated Year", "type", "Number", "placeholder", "Write Graduated Year", 3, "control"], ["label", "Years of Experience", "type", "Number", "placeholder", "Write Candidate Experience", 3, "control"], [1, "col-lg-6", "my-2"], ["formControlName", "job_title_id", "defaultLabel", "Select Job Title", "optionLabel", "hr_job_title", "optionValue", "id", "display", "chip", "appendTo", "body", 1, "jop-profile-select", 3, "options", "dropdownIcon"], ["sss", ""], ["formControlName", "job_skills_id", "defaultLabel", "Select Job Skill", "optionLabel", "job_skill", "optionValue", "id", "display", "chip", "appendTo", "body", 1, "jop-profile-select", 3, "options", "dropdownIcon"], [1, "row", "my-4"], [1, "col-lg-6", "d-flex", "gap-2"], ["type", "submit", 1, "btn", "btnStyle", "w-50"], ["type", "reset", "class", "btn btnOutLine w-50", 3, "click", 4, "ngIf"], ["type", "reset", 1, "btn", "btnOutLine", "w-50", 3, "click"]], template: function CandidateSearchComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "form", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngSubmit", function CandidateSearchComponent_Template_form_ngSubmit_0_listener() { return ctx.filterCandidates(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "div", 1)(2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](3, "app-form-input", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](5, "app-form-input", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](7, "app-form-input", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](8, CandidateSearchComponent_div_8_Template, 1, 0, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](10, "app-form-input", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](11, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](12, "app-form-input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](14, "app-form-input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](15, "div", 10)(16, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](17, "Job Title");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](18, "p-multiSelect", 11, 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](20, "div", 10)(21, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](22, "Job Skills");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](23, "p-multiSelect", 13, 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](25, "div", 14)(26, "div", 15)(27, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](28, " Search ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](29, CandidateSearchComponent_button_29_Template, 2, 0, "button", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    } if (rf & 2) {
        let tmp_4_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("formGroup", ctx.candidateForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("control", ctx.candidateForm.get("first_name"));
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("control", ctx.candidateForm.get("last_name"));
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("control", ctx.candidateForm.get("email"));
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ((tmp_4_0 = ctx.candidateForm.get("email")) == null ? null : tmp_4_0.errors) && ((tmp_4_0 = ctx.candidateForm.get("email")) == null ? null : tmp_4_0.errors)["exist"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("control", ctx.candidateForm.get("phone_number"));
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("control", ctx.candidateForm.get("graduated_year"));
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("control", ctx.candidateForm.get("experience"));
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("options", ctx.jobProfiles)("dropdownIcon", ctx.jobProfilesLoading ? "pi pi-spin pi-spinner" : "pi pi-angle-down");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("options", ctx.jobSkills)("dropdownIcon", ctx.jobSkillsLoading ? "pi pi-spin pi-spinner" : "pi pi-angle-down");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.resetFilter);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormGroupDirective, _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_6__.FormInputComponent, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgIf, primeng_multiselect__WEBPACK_IMPORTED_MODULE_10__.MultiSelect, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControlName, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_11__.NativeElementInjectorDirective], styles: [".jop-profile-select .p-multiselect, .jop-skills-select .p-multiselect {\n  width: 100%;\n}\n.jop-profile-select .p-multiselect .p-multiselect-label, .jop-skills-select .p-multiselect .p-multiselect-label {\n  padding: 0.575rem 0.75rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbmRpZGF0ZS1zZWFyY2guY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxoclxcaGlyaW5nLXByb2Nlc3NcXGNhbmRpZGF0ZXNcXGNhbmRpZGF0ZS1zZWFyY2hcXGNhbmRpZGF0ZS1zZWFyY2guY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0k7RUFFSSxXQUFBO0FDRFI7QURFUTtFQUNJLHlCQUFBO0FDQVoiLCJmaWxlIjoiY2FuZGlkYXRlLXNlYXJjaC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5qb3AtcHJvZmlsZS1zZWxlY3QgLCAuam9wLXNraWxscy1zZWxlY3R7XHJcbiAgICAucC1tdWx0aXNlbGVjdHtcclxuXHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgLnAtbXVsdGlzZWxlY3QtbGFiZWwge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAwLjU3NXJlbSAwLjc1cmVtO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi5qb3AtcHJvZmlsZS1zZWxlY3QgLnAtbXVsdGlzZWxlY3QsIC5qb3Atc2tpbGxzLXNlbGVjdCAucC1tdWx0aXNlbGVjdCB7XG4gIHdpZHRoOiAxMDAlO1xufVxuLmpvcC1wcm9maWxlLXNlbGVjdCAucC1tdWx0aXNlbGVjdCAucC1tdWx0aXNlbGVjdC1sYWJlbCwgLmpvcC1za2lsbHMtc2VsZWN0IC5wLW11bHRpc2VsZWN0IC5wLW11bHRpc2VsZWN0LWxhYmVsIHtcbiAgcGFkZGluZzogMC41NzVyZW0gMC43NXJlbTtcbn0iXX0= */"], encapsulation: 2 });


/***/ }),

/***/ 86461:
/*!*********************************************************************************!*\
  !*** ./src/app/components/hr/hiring-process/candidates/candidates.component.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CandidatesComponent": () => (/* binding */ CandidatesComponent)
/* harmony export */ });
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 92340);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/hr.service */ 35487);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 52816);
/* harmony import */ var src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/loading.service */ 4471);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var primeng_sidebar__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! primeng/sidebar */ 49734);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var _candidate_management_candidate_management_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./candidate-management/candidate-management.component */ 66720);
/* harmony import */ var _candidate_details_candidate_details_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./candidate-details/candidate-details.component */ 28009);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! primeng/dialog */ 33489);
/* harmony import */ var _candidate_search_candidate_search_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./candidate-search/candidate-search.component */ 78320);
/* harmony import */ var _pipes_max_length_pipe__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../pipes/max-length.pipe */ 50314);


















function CandidatesComponent_button_6_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function CandidatesComponent_button_6_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r9); const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](); return ctx_r8.onResetFilter(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1, "Reset");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} }
function CandidatesComponent_button_7_Template(rf, ctx) { if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function CandidatesComponent_button_7_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r11); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](); return ctx_r10.showSearchDialog = true; });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1, "Search");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} }
function CandidatesComponent_button_8_Template(rf, ctx) { if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function CandidatesComponent_button_8_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r13); const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](); return ctx_r12.openCandidateManagement(0); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1, "Add new Candidate");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} }
function CandidatesComponent_ng_container_30_tr_1_span_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r19 = ctx.$implicit;
    const isLast_r20 = ctx.last;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", item_r19.hr_job_title + (isLast_r20 ? " " : " , "), " ");
} }
function CandidatesComponent_ng_container_30_tr_1_i_18_Template(rf, ctx) { if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "i", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function CandidatesComponent_ng_container_30_tr_1_i_18_Template_i_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r23); const candidate_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit; const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2); return ctx_r21.openCandidateManagement(candidate_r15); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} }
function CandidatesComponent_ng_container_30_tr_1_i_19_Template(rf, ctx) { if (rf & 1) {
    const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "i", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function CandidatesComponent_ng_container_30_tr_1_i_19_Template_i_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r26); const candidate_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit; const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2); return ctx_r24.deleteCandidate(candidate_r15); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} }
function CandidatesComponent_ng_container_30_tr_1_Template(rf, ctx) { if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](3, "maxLength");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](4, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](8, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](9, CandidatesComponent_ng_container_30_tr_1_span_9_Template, 2, 1, "span", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](10, "td", 17)(11, "a", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](13, "maxLength");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](14, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](16, "td")(17, "i", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function CandidatesComponent_ng_container_30_tr_1_Template_i_click_17_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r28); const candidate_r15 = restoredCtx.$implicit; const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2); return ctx_r27.openCandidateDetails(candidate_r15); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](18, CandidatesComponent_ng_container_30_tr_1_i_18_Template, 1, 0, "i", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](19, CandidatesComponent_ng_container_30_tr_1_i_19_Template, 1, 0, "i", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const candidate_r15 = ctx.$implicit;
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](3, 10, candidate_r15.first_name + " " + candidate_r15.last_name, 25));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](candidate_r15.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](candidate_r15.phone_number);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngForOf", candidate_r15 == null ? null : candidate_r15.Job_title == null ? null : candidate_r15.Job_title.slice(0, 2));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpropertyInterpolate2"]("href", "", ctx_r14.newServerApi, "", candidate_r15.file_path, "", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind2"](13, 13, candidate_r15.file_name, 20), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](candidate_r15.uploaded_by_name);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r14.checkIfHasPerm(32));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r14.checkIfHasPerm(33));
} }
function CandidatesComponent_ng_container_30_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](1, CandidatesComponent_ng_container_30_tr_1_Template, 20, 16, "tr", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngForOf", ctx_r3.candidates);
} }
function CandidatesComponent_ng_container_31_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "td", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "No Candidates Founded");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("colSpan", 7);
} }
function CandidatesComponent_ng_template_33_Template(rf, ctx) { if (rf & 1) {
    const _r30 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "app-candidate-management", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("updateCandidateList", function CandidatesComponent_ng_template_33_Template_app_candidate_management_updateCandidateList_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r30); const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](); return ctx_r29.updateCandidateList($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("candidate", ctx_r5.selectedCandidate);
} }
function CandidatesComponent_ng_template_35_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](0, "app-candidate-details", 26);
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("candidate", ctx_r6.selectedCandidate);
} }
function CandidatesComponent_ng_template_37_Template(rf, ctx) { if (rf & 1) {
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "app-candidate-search", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("onFilterCandidates", function CandidatesComponent_ng_template_37_Template_app_candidate_search_onFilterCandidates_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r32); const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](); return ctx_r31.onFilterCandidates($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("filterObj", ctx_r7.filterObj);
} }
const _c0 = function () { return { width: "50vw" }; };
const _c1 = function () { return { "960px": "50vw", "640px": "100vw" }; };
class CandidatesComponent {
    constructor(hrService, _notify, _auth, _db, router, loadingService) {
        this.hrService = hrService;
        this._notify = _notify;
        this._auth = _auth;
        this._db = _db;
        this.router = router;
        this.loadingService = loadingService;
        this.isLoading = false;
        this.newServerApi = src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi;
        this.currentUser = this._auth.currentUser;
        this.showCandidateManagement = false;
        this.showCandidateDetails = false;
        this.userPerms = this._auth.userPerms;
        this.showSearchDialog = false;
        this.resetFilter = false;
    }
    ngOnInit() {
        this.checkCurrentUserPermissions();
    }
    getAllRecruitmentRequests(filterObj) {
        this.loadingService.setLoading(true);
        this.hrService.getAllRecruitmentRequests(filterObj).subscribe({
            next: res => {
                var _a;
                this.loadingService.setLoading(false);
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                    this.candidates = res['data'];
                    filterObj && ((_a = Object.keys(filterObj)) === null || _a === void 0 ? void 0 : _a.length) > 0 ? this.resetFilter = true : this.resetFilter = false;
                }
                else if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.Forbidden) {
                    this._notify.openSnackbar(`Error, ${res['data']['message']}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_2__.SnackBarState.Error);
                    this._db.createSystemLogs(`${this.currentUser.username} Tried To Access candidates Page At ${new Date().toLocaleString()}`, `${this.currentUser.key} Tried To Access candidates Page At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe(res => {
                        this._notify.openSnackbar(`You Don't Have Permission To Access This Page`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_2__.SnackBarState.Warning, 10000);
                        this.router.navigate(['/']);
                    }, err => {
                        this.router.navigate(['/']);
                    });
                }
                else {
                    this.candidates = [];
                }
            }, error: err => {
                this.isLoading = false;
                this.loadingService.setLoading(false);
                this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_2__.SnackBarState.Error);
                this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while Accessing Candidates Page`, `${this.currentUser.key} Has Error while Accessing Candidates Page`, this.currentUser.key || '', this.currentUser.username, 'Failed').subscribe();
            }
        });
    }
    checkCurrentUserPermissions() {
        if (!!this.currentUser && this.checkIfHasPerm(34)) {
            this.getAllRecruitmentRequests(this.filterObj);
        }
        else {
            this._db.createSystemLogs(`${this.currentUser.username} Tried To Access Candidates Page At ${new Date().toLocaleString()}`, `${this.currentUser.key} Tried To Access Candidates Page At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe(res => {
                this._notify.openSnackbar(`You Don't Have Permission To Access This Page`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_2__.SnackBarState.Warning, 10000);
                this.router.navigate(['/']);
            }, err => {
                this.router.navigate(['/']);
            });
        }
    }
    openCandidateManagement(candidate) {
        this.showCandidateManagement = true;
        this.selectedCandidate = candidate;
    }
    openCandidateDetails(candidate) {
        this.showCandidateDetails = true;
        this.selectedCandidate = candidate;
    }
    deleteCandidate(candidate) {
        this._notify.openDialog('Delete Candidate?', `Are you sure you want to delete This Candidate?`, false, '', true, false).subscribe(response => {
            if (response) {
                this.loadingService.setLoading(true);
                this.hrService.deleteCandidate(candidate.id || '').subscribe(res => {
                    if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                        this._notify.openSnackbar(`Candidate Deleted Successfully`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_2__.SnackBarState.Success);
                        this.candidates = this.candidates.filter(x => x.id != candidate.id);
                    }
                    this.loadingService.setLoading(false);
                }, error => {
                    this.loadingService.setLoading(false);
                });
            }
            else {
                this._notify.openSnackbar('Operation Cancelled!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_2__.SnackBarState.Info);
            }
        });
    }
    updateCandidateList(candidate) {
        let candidateIndex = this.candidates.findIndex(x => x.id == candidate.id);
        if (candidateIndex != -1) {
            this.candidates[candidateIndex] = candidate;
        }
        else {
            this.candidates.push(candidate);
        }
        this.showCandidateManagement = false;
    }
    // existedCandidate(candidate: Candidate){
    //   this.showCandidateManagement=false;
    //   this.showCandidateDetails=true;
    //   this.selectedCandidate = candidate as Candidate;
    // }
    checkIfHasPerm(perm_id) {
        const checking = this.userPerms.find(p => p.permission_id == perm_id);
        if (!!checking) {
            return true;
        }
        else {
            return false;
        }
    }
    onFilterCandidates(filterObj) {
        this.showSearchDialog = false;
        for (const key in filterObj) {
            const element = filterObj[key];
            if (!element) {
                delete filterObj[key];
            }
        }
        this.filterObj = filterObj;
        this.getAllRecruitmentRequests(filterObj);
    }
    onResetFilter() {
        for (const key in this.filterObj) {
            delete this.filterObj[key];
        }
        this.getAllRecruitmentRequests(this.filterObj);
    }
}
CandidatesComponent.ɵfac = function CandidatesComponent_Factory(t) { return new (t || CandidatesComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_3__.HrService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_6__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_7__.LoadingService)); };
CandidatesComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineComponent"]({ type: CandidatesComponent, selectors: [["app-candidates"]], decls: 38, vars: 22, consts: [[1, "container-fluid", "mt-3"], [1, "row"], [1, "col-12", "d-flex", "justify-content-between", "align-items-center"], [1, "main-color", "p-2", "mb-2", "fw-bold"], ["class", "btn btnOutLine mx-2", 3, "click", 4, "ngIf"], ["class", "btn btnStyle mx-2", 3, "click", 4, "ngIf"], [1, "col-1"], [1, "hrLine"], [1, "teble-responsive"], [1, "table", "newTableCustom"], [4, "ngIf"], ["styleClass", "p-sidebar-md", "position", "right", 1, "side", 3, "baseZIndex", "autoZIndex", "visible", "transitionOptions", "visibleChange"], ["pTemplate", "content"], ["header", "Search", 3, "visible", "breakpoints", "modal", "draggable", "resizable", "visibleChange"], [1, "btn", "btnOutLine", "mx-2", 3, "click"], [1, "btn", "btnStyle", "mx-2", 3, "click"], [4, "ngFor", "ngForOf"], [1, "text-decoration-underline", "cursor"], ["target", "_blank", 3, "href"], [1, "cursor", "pi", "pi-eye", "text-secondary", "mx-1", 3, "click"], ["class", "cursor pi pi-pencil text-info mx-1", 3, "click", 4, "ngIf"], ["class", "cursor pi pi-trash text-danger mx-1", 3, "click", 4, "ngIf"], [1, "cursor", "pi", "pi-pencil", "text-info", "mx-1", 3, "click"], [1, "cursor", "pi", "pi-trash", "text-danger", "mx-1", 3, "click"], [1, "text-center", 3, "colSpan"], [3, "candidate", "updateCandidateList"], [3, "candidate"], [3, "filterObj", "onFilterCandidates"]], template: function CandidatesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4, "Candidates");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](6, CandidatesComponent_button_6_Template, 2, 0, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](7, CandidatesComponent_button_7_Template, 2, 0, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](8, CandidatesComponent_button_8_Template, 2, 0, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](9, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](10, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](11, "div", 8)(12, "table", 9)(13, "thead")(14, "tr")(15, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](16, "candidate name");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](17, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](18, "candidate email");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](19, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](20, "candidate phone");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](21, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](22, "job Title");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](23, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](24, "CV");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](25, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](26, "uploaded by");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](27, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](28, "Actions");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](29, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](30, CandidatesComponent_ng_container_30_Template, 2, 1, "ng-container", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](31, CandidatesComponent_ng_container_31_Template, 3, 1, "ng-container", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](32, "p-sidebar", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("visibleChange", function CandidatesComponent_Template_p_sidebar_visibleChange_32_listener($event) { return ctx.showCandidateManagement = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](33, CandidatesComponent_ng_template_33_Template, 1, 1, "ng-template", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](34, "p-sidebar", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("visibleChange", function CandidatesComponent_Template_p_sidebar_visibleChange_34_listener($event) { return ctx.showCandidateDetails = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](35, CandidatesComponent_ng_template_35_Template, 1, 1, "ng-template", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](36, "p-dialog", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("visibleChange", function CandidatesComponent_Template_p_dialog_visibleChange_36_listener($event) { return ctx.showSearchDialog = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](37, CandidatesComponent_ng_template_37_Template, 1, 1, "ng-template", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx.resetFilter);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx.checkIfHasPerm(35));
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx.checkIfHasPerm(32));
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !!ctx.candidates && ctx.candidates.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", (ctx.candidates == null ? null : ctx.candidates.length) == 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("baseZIndex", 999)("autoZIndex", false)("visible", ctx.showCandidateManagement)("transitionOptions", "350ms");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("baseZIndex", 999)("autoZIndex", false)("visible", ctx.showCandidateDetails)("transitionOptions", "350ms");
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction0"](20, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("visible", ctx.showSearchDialog)("breakpoints", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction0"](21, _c1))("modal", true)("draggable", false)("resizable", false);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgForOf, primeng_sidebar__WEBPACK_IMPORTED_MODULE_15__.Sidebar, primeng_api__WEBPACK_IMPORTED_MODULE_16__.PrimeTemplate, _candidate_management_candidate_management_component__WEBPACK_IMPORTED_MODULE_8__.CandidateManagementComponent, _candidate_details_candidate_details_component__WEBPACK_IMPORTED_MODULE_9__.CandidateDetailsComponent, primeng_dialog__WEBPACK_IMPORTED_MODULE_17__.Dialog, _candidate_search_candidate_search_component__WEBPACK_IMPORTED_MODULE_10__.CandidateSearchComponent], pipes: [_pipes_max_length_pipe__WEBPACK_IMPORTED_MODULE_11__.MaxLengthPipe], styles: [".hrLine[_ngcontent-%COMP%] {\n  height: 2px;\n  width: 100%;\n  background-color: #513982;\n  margin: 5px;\n  margin-bottom: 30px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbmRpZGF0ZXMuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcX2NvbG9ycy5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxoclxcaGlyaW5nLXByb2Nlc3NcXGNhbmRpZGF0ZXNcXGNhbmRpZGF0ZXMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxXQUFBO0VBQ0EsV0FBQTtFQUNBLHlCQ0xZO0VETVosV0FBQTtFQUNBLG1CQUFBO0FFREoiLCJmaWxlIjoiY2FuZGlkYXRlcy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uLy4uL2NvbG9ycyc7XHJcblxyXG4uaHJMaW5lIHtcclxuICAgIGhlaWdodDogMnB4O1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICBtYXJnaW46IDVweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbn1cclxuIiwiJG1haW5UaGVtZUNvbG9yOiM1MTM5ODI7XHJcbiRzdWJUaGVtZUNvbG9yOiM3NDYxOUI7XHJcbiRzdWJTdWJUaGVtZUNvbG9yOiM5Nzg4QjQ7XHJcbiRzb2Z0VGhlbWVDb2xvcjojRUVFQkYzO1xyXG4kYm9yZGVyQ29sb3I6I0NCQzREQTtcclxuJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I6I2Y0ODMxZjsgLy8jRjU4MjFGO1xyXG4kYnV0dG9uU3ViQmFja2dyb3VuZENvbG9yOiNGRkFCMDA7IC8vI0Y1ODIxRjtcclxuJGJ1dHRvblN1YlN1YkJhY2tncm91bmRDb2xvcjojRkU3RTE1OyAvLyNGNTgyMUY7XHJcbiRzZWNvbmRGb250Q29sb3I6IzcwNzA3MDtcclxuJGdyYXlCYWNrR3JvdW5kQ29sb3I6I0Y2RjdGODtcclxuJHdoaXRlQ29sb3I6I2ZmZjtcclxuJG1haW5Gb250RmFtaWx5OiAnQ2Fpcm8nO1xyXG4kc29mdEdyYXlCYWNrR3JvdW5kQ29sb3I6I0ZDRkNGQztcclxuJGJnTGlnaHQ6I0ZBRkJGQztcclxuJHRhYkJhY2tHcm91bmQ6I2YxZWNmMDsiLCIuaHJMaW5lIHtcbiAgaGVpZ2h0OiAycHg7XG4gIHdpZHRoOiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTEzOTgyO1xuICBtYXJnaW46IDVweDtcbiAgbWFyZ2luLWJvdHRvbTogMzBweDtcbn0iXX0= */"] });


/***/ }),

/***/ 56055:
/*!**********************************************************************************************************************!*\
  !*** ./src/app/components/hr/hiring-process/job-profiles/job-profile-management/job-profile-management.component.ts ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JobProfileManagementComponent": () => (/* binding */ JobProfileManagementComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_hr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/hr */ 61611);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/hr.service */ 35487);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/loading.service */ 4471);
/* harmony import */ var _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/form-input/form-input.component */ 37604);
/* harmony import */ var primeng_multiselect__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! primeng/multiselect */ 22460);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var primeng_dropdown__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! primeng/dropdown */ 74086);
/* harmony import */ var primeng_editor__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! primeng/editor */ 1791);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! primeng/dialog */ 33489);
/* harmony import */ var _job_skills_job_skill_manangement_job_skill_manangement_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../job-skills/job-skill-manangement/job-skill-manangement.component */ 83605);





















function JobProfileManagementComponent_ng_template_13_Template(rf, ctx) { if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function JobProfileManagementComponent_ng_template_13_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r6); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵreference"](12); ctx_r5.addSkillDialog = true; return _r0.hide(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](1, "i", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](2, "span", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3, "Add other Job Skill");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
} }
function JobProfileManagementComponent_div_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, " Job Skill Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} }
function JobProfileManagementComponent_div_20_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 22)(1, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2, "*Job Profile Status is Required");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
} }
function JobProfileManagementComponent_div_25_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, " description Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} }
const _c0 = function (a0) { return { "is-invalid": a0 }; };
const _c1 = function () { return { height: "320px" }; };
const _c2 = function () { return { width: "30vw" }; };
class JobProfileManagementComponent {
    constructor(hrService, _notify, _auth, _db, loadingService) {
        this.hrService = hrService;
        this._notify = _notify;
        this._auth = _auth;
        this._db = _db;
        this.loadingService = loadingService;
        this.currentUser = this._auth.currentUser;
        this.JobProfileStatus = src_app_interfaces_hr__WEBPACK_IMPORTED_MODULE_1__.JobProfileStatus;
        this.jobSkillsLoading = false;
        this.updateJobProfileList = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
        this.addSkillDialog = false;
        this.jobProfileForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormGroup({
            "hr_job_title": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required),
            "description": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required),
            "job_status": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(this.JobProfileStatus.ACTIVE, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required),
            "job_skills_id": new _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required),
        });
    }
    ngOnInit() {
        this.getAllJobSkills();
        if (this.jobProfile) {
            this.jobProfileForm.patchValue({
                hr_job_title: this.jobProfile.hr_job_title,
                description: this.jobProfile.description,
                job_status: Number(this.jobProfile.job_status).toString(),
            });
        }
    }
    onSubmit() {
        this.jobProfileForm.markAllAsTouched();
        if (this.jobProfileForm.invalid)
            return;
        if (this.jobProfile) {
            this.updateJobProfile();
        }
        else {
            this.createJobProfile();
        }
    }
    createJobProfile() {
        var _a, _b, _c, _d;
        this.loadingService.setLoading(true);
        let jobProfile = {
            hr_job_title: (_a = this.jobProfileForm.get('hr_job_title')) === null || _a === void 0 ? void 0 : _a.value,
            description: (_b = this.jobProfileForm.get('description')) === null || _b === void 0 ? void 0 : _b.value,
            job_status: (_c = this.jobProfileForm.get('job_status')) === null || _c === void 0 ? void 0 : _c.value,
            job_skills_id: `[${((_d = this.jobProfileForm.get('job_skills_id')) === null || _d === void 0 ? void 0 : _d.value).toString()}]`
        };
        this.hrService.createJobProfile(jobProfile).subscribe({
            next: res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                    this.updateJobProfileList.emit(res['data']);
                    this._notify.openSnackbar(`job Profile created successfully`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                }
                this.loadingService.setLoading(false);
            }, error: err => {
                this.loadingService.setLoading(false);
                this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Job Profile At ${new Date().toLocaleString()}`, `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Job Profile At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe();
            }
        });
    }
    updateJobProfile() {
        var _a, _b, _c, _d, _e;
        let jobProfile = {
            id: this.jobProfile.id,
            description: (_a = this.jobProfileForm.get('description')) === null || _a === void 0 ? void 0 : _a.value,
            job_status: (_b = this.jobProfileForm.get('job_status')) === null || _b === void 0 ? void 0 : _b.value,
            job_skills_id: `[${((_c = this.jobProfileForm.get('job_skills_id')) === null || _c === void 0 ? void 0 : _c.value).toString()}]`
        };
        // this.jobProfileForm.patchValue({
        //   job_skills_id:`[${(this.jobProfileForm.get('job_skills_id')?.value as Array<any>).toString()}]`
        // })
        if (this.jobProfile.hr_job_title !== ((_d = this.jobProfileForm.get('hr_job_title')) === null || _d === void 0 ? void 0 : _d.value)) {
            jobProfile.hr_job_title = (_e = this.jobProfileForm.get('hr_job_title')) === null || _e === void 0 ? void 0 : _e.value;
        }
        this.loadingService.setLoading(true);
        this.hrService.updateJobProfile(jobProfile).subscribe({
            next: res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                    this.updateJobProfileList.emit(res['data']);
                    this._notify.openSnackbar(`job Profile updated successfully`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                }
                this.loadingService.setLoading(false);
            }, error: err => {
                this.loadingService.setLoading(false);
                this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To delete Job Profile with id ${jobProfile.id} At ${new Date().toLocaleString()}`, `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To delete Job Profile with id ${jobProfile.id} At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe();
            }
        });
    }
    getAllJobSkills() {
        this.jobSkillsLoading = true;
        this.hrService.getAllJobSkills().subscribe({
            next: res => {
                var _a;
                this.jobSkillsLoading = false;
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                    this.jobSkills = res['data'];
                }
                else {
                    this.jobSkills = [];
                }
                this.jobProfileForm.patchValue({
                    job_skills_id: (_a = this.jobProfile.job_skills_id) === null || _a === void 0 ? void 0 : _a.map(x => (x.job_skill_id).toString())
                });
            }, error: err => {
            }
        });
    }
    updateJobSkillList(jobSkill) {
        var _a;
        this.jobSkills.push(jobSkill);
        this.addSkillDialog = false;
        this.jobProfileForm.patchValue({
            job_skills_id: [...((_a = this.jobProfileForm.get('job_skills_id')) === null || _a === void 0 ? void 0 : _a.value) || [], jobSkill.id]
        });
    }
}
JobProfileManagementComponent.ɵfac = function JobProfileManagementComponent_Factory(t) { return new (t || JobProfileManagementComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_3__.HrService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_6__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_7__.LoadingService)); };
JobProfileManagementComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineComponent"]({ type: JobProfileManagementComponent, selectors: [["app-job-profile-management"]], inputs: { jobProfile: "jobProfile" }, outputs: { updateJobProfileList: "updateJobProfileList" }, decls: 32, vars: 37, consts: [[1, "sidebar-header"], [1, "main-color"], [3, "formGroup", "ngSubmit"], [1, "row"], [1, "col-lg-6"], ["label", "Job Title", "placeholder", "Write Job Title", 3, "control"], [1, "col-lg-6", "my-2"], ["formControlName", "job_skills_id", "defaultLabel", "Select Job Skills", "optionLabel", "job_skill", "optionValue", "id", "display", "chip", "appendTo", "body", 1, "jop-profile-select", 3, "options", "baseZIndex", "autoZIndex", "dropdownIcon", "ngClass"], ["select", ""], ["pTemplate", "footer"], ["class", "invalid-feedback", 4, "ngIf"], ["inputId", "dropdown", "formControlName", "job_status", "optionLabel", "key", "optionValue", "value", "placeholder", "job title status", 1, "w-100", "jop-profile-status", 3, "autoDisplayFirst", "options", "ngClass"], [1, "col-lg-12", "my-2"], ["formControlName", "description", 3, "ngClass"], [1, "row", "my-4"], [1, "col-lg-12"], ["type", "submit", 1, "btn", "btnStyle", "w-100"], [3, "visible", "baseZIndex", "autoZIndex", "modal", "draggable", "resizable", "visibleChange"], [3, "inJobProfileComponent", "updateJobSkillList"], [1, "bg-light", "p-2", "cursor", 3, "click"], [1, "pi", "pi-plus", "add-skill-icon"], [1, "px-2"], [1, "invalid-feedback"]], template: function JobProfileManagementComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div")(1, "div", 0)(2, "h1", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "form", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngSubmit", function JobProfileManagementComponent_Template_form_ngSubmit_4_listener() { return ctx.onSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "div", 3)(6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](7, "app-form-input", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](8, "div", 6)(9, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](10, "Job Skills");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](11, "p-multiSelect", 7, 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](13, JobProfileManagementComponent_ng_template_13_Template, 4, 0, "ng-template", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](14, JobProfileManagementComponent_div_14_Template, 2, 0, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](15, "div", 6)(16, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](17, "Status");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](18, "p-dropdown", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](19, "keyvalue");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](20, JobProfileManagementComponent_div_20_Template, 3, 0, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](21, "div", 12)(22, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](23, "Description");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](24, "p-editor", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](25, JobProfileManagementComponent_div_25_Template, 2, 0, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](26, "div", 14)(27, "div", 15)(28, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](30, "p-dialog", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("visibleChange", function JobProfileManagementComponent_Template_p_dialog_visibleChange_30_listener($event) { return ctx.addSkillDialog = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](31, "app-job-skill-manangement", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("updateJobSkillList", function JobProfileManagementComponent_Template_app_job_skill_manangement_updateJobSkillList_31_listener($event) { return ctx.updateJobSkillList($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        let tmp_7_0;
        let tmp_8_0;
        let tmp_11_0;
        let tmp_12_0;
        let tmp_14_0;
        let tmp_15_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx.jobProfile ? "Update Job Profile" : "Create Job Profile", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("formGroup", ctx.jobProfileForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("control", ctx.jobProfileForm.get("hr_job_title"));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("options", ctx.jobSkills)("baseZIndex", 0)("autoZIndex", true)("dropdownIcon", ctx.jobSkillsLoading ? "pi pi-spin pi-spinner" : "pi pi-angle-down")("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction1"](29, _c0, !((tmp_7_0 = ctx.jobProfileForm.get("job_skills_id")) == null ? null : tmp_7_0.valid) && ((tmp_7_0 = ctx.jobProfileForm.get("job_skills_id")) == null ? null : tmp_7_0.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !((tmp_8_0 = ctx.jobProfileForm.get("job_skills_id")) == null ? null : tmp_8_0.valid) && ((tmp_8_0 = ctx.jobProfileForm.get("job_skills_id")) == null ? null : tmp_8_0.touched));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("autoDisplayFirst", false)("options", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](19, 27, ctx.JobProfileStatus))("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction1"](31, _c0, !((tmp_11_0 = ctx.jobProfileForm.get("status")) == null ? null : tmp_11_0.valid) && ((tmp_11_0 = ctx.jobProfileForm.get("status")) == null ? null : tmp_11_0.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !((tmp_12_0 = ctx.jobProfileForm.get("status")) == null ? null : tmp_12_0.valid) && ((tmp_12_0 = ctx.jobProfileForm.get("status")) == null ? null : tmp_12_0.touched));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](33, _c1));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction1"](34, _c0, !((tmp_14_0 = ctx.jobProfileForm.get("description")) == null ? null : tmp_14_0.valid) && ((tmp_14_0 = ctx.jobProfileForm.get("description")) == null ? null : tmp_14_0.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !((tmp_15_0 = ctx.jobProfileForm.get("description")) == null ? null : tmp_15_0.valid) && ((tmp_15_0 = ctx.jobProfileForm.get("description")) == null ? null : tmp_15_0.touched));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx.jobProfile ? "Update" : "Create", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](36, _c2));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("visible", ctx.addSkillDialog)("baseZIndex", 10000000000000000)("autoZIndex", true)("modal", true)("draggable", false)("resizable", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("inJobProfileComponent", true);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormGroupDirective, _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_8__.FormInputComponent, primeng_multiselect__WEBPACK_IMPORTED_MODULE_12__.MultiSelect, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControlName, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_13__.NativeElementInjectorDirective, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgClass, primeng_api__WEBPACK_IMPORTED_MODULE_15__.PrimeTemplate, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgIf, primeng_dropdown__WEBPACK_IMPORTED_MODULE_16__.Dropdown, primeng_editor__WEBPACK_IMPORTED_MODULE_17__.Editor, primeng_dialog__WEBPACK_IMPORTED_MODULE_18__.Dialog, _job_skills_job_skill_manangement_job_skill_manangement_component__WEBPACK_IMPORTED_MODULE_9__.JobSkillManangementComponent], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.KeyValuePipe], styles: [".jop-profile-status .p-dropdown {\n  width: 100%;\n}\n.jop-profile-status .p-dropdown .p-dropdown-label {\n  padding: 0.575rem 0.75rem;\n}\n.jop-profile-select .p-multiselect {\n  width: 100%;\n}\n.jop-profile-select .p-multiselect .p-multiselect-label {\n  padding: 0.575rem 0.75rem;\n}\n.add-skill-icon {\n  background: #EEEBF3;\n  padding: 6px;\n  border-radius: 50%;\n  color: #513982;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpvYi1wcm9maWxlLW1hbmFnZW1lbnQuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxoclxcaGlyaW5nLXByb2Nlc3NcXGpvYi1wcm9maWxlc1xcam9iLXByb2ZpbGUtbWFuYWdlbWVudFxcam9iLXByb2ZpbGUtbWFuYWdlbWVudC5jb21wb25lbnQuc2NzcyIsIi4uXFwuLlxcLi5cXC4uXFwuLlxcX2NvbG9ycy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdJO0VBRUksV0FBQTtBQ0hSO0FESVE7RUFDSSx5QkFBQTtBQ0ZaO0FET0k7RUFFSSxXQUFBO0FDTFI7QURNUTtFQUNJLHlCQUFBO0FDSlo7QURRQTtFQUNJLG1CRWxCWTtFRm1CWixZQUFBO0VBQ0Esa0JBQUE7RUFDQSxjRXhCWTtBRG1CaEIiLCJmaWxlIjoiam9iLXByb2ZpbGUtbWFuYWdlbWVudC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uLy4uLy4uL2NvbG9ycyc7XHJcblxyXG4uam9wLXByb2ZpbGUtc3RhdHVze1xyXG4gICAgLnAtZHJvcGRvd257XHJcblxyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgIC5wLWRyb3Bkb3duLWxhYmVsIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMC41NzVyZW0gMC43NXJlbTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLmpvcC1wcm9maWxlLXNlbGVjdHtcclxuICAgIC5wLW11bHRpc2VsZWN0e1xyXG5cclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAucC1tdWx0aXNlbGVjdC1sYWJlbCB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDAuNTc1cmVtIDAuNzVyZW07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi5hZGQtc2tpbGwtaWNvbntcclxuICAgIGJhY2tncm91bmQ6ICRzb2Z0VGhlbWVDb2xvcjtcclxuICAgIHBhZGRpbmc6IDZweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbn1cclxuXHJcbiIsIi5qb3AtcHJvZmlsZS1zdGF0dXMgLnAtZHJvcGRvd24ge1xuICB3aWR0aDogMTAwJTtcbn1cbi5qb3AtcHJvZmlsZS1zdGF0dXMgLnAtZHJvcGRvd24gLnAtZHJvcGRvd24tbGFiZWwge1xuICBwYWRkaW5nOiAwLjU3NXJlbSAwLjc1cmVtO1xufVxuXG4uam9wLXByb2ZpbGUtc2VsZWN0IC5wLW11bHRpc2VsZWN0IHtcbiAgd2lkdGg6IDEwMCU7XG59XG4uam9wLXByb2ZpbGUtc2VsZWN0IC5wLW11bHRpc2VsZWN0IC5wLW11bHRpc2VsZWN0LWxhYmVsIHtcbiAgcGFkZGluZzogMC41NzVyZW0gMC43NXJlbTtcbn1cblxuLmFkZC1za2lsbC1pY29uIHtcbiAgYmFja2dyb3VuZDogI0VFRUJGMztcbiAgcGFkZGluZzogNnB4O1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGNvbG9yOiAjNTEzOTgyO1xufSIsIiRtYWluVGhlbWVDb2xvcjojNTEzOTgyO1xyXG4kc3ViVGhlbWVDb2xvcjojNzQ2MTlCO1xyXG4kc3ViU3ViVGhlbWVDb2xvcjojOTc4OEI0O1xyXG4kc29mdFRoZW1lQ29sb3I6I0VFRUJGMztcclxuJGJvcmRlckNvbG9yOiNDQkM0REE7XHJcbiRidXR0b25NYWluQmFja2dyb3VuZENvbG9yOiNmNDgzMWY7IC8vI0Y1ODIxRjtcclxuJGJ1dHRvblN1YkJhY2tncm91bmRDb2xvcjojRkZBQjAwOyAvLyNGNTgyMUY7XHJcbiRidXR0b25TdWJTdWJCYWNrZ3JvdW5kQ29sb3I6I0ZFN0UxNTsgLy8jRjU4MjFGO1xyXG4kc2Vjb25kRm9udENvbG9yOiM3MDcwNzA7XHJcbiRncmF5QmFja0dyb3VuZENvbG9yOiNGNkY3Rjg7XHJcbiR3aGl0ZUNvbG9yOiNmZmY7XHJcbiRtYWluRm9udEZhbWlseTogJ0NhaXJvJztcclxuJHNvZnRHcmF5QmFja0dyb3VuZENvbG9yOiNGQ0ZDRkM7XHJcbiRiZ0xpZ2h0OiNGQUZCRkM7XHJcbiR0YWJCYWNrR3JvdW5kOiNmMWVjZjA7Il19 */"], encapsulation: 2 });


/***/ }),

/***/ 52865:
/*!*************************************************************************************!*\
  !*** ./src/app/components/hr/hiring-process/job-profiles/job-profiles.component.ts ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JobProfilesComponent": () => (/* binding */ JobProfilesComponent)
/* harmony export */ });
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/environments/environment */ 92340);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/hr.service */ 35487);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ 52816);
/* harmony import */ var src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/loading.service */ 4471);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var primeng_sidebar__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/sidebar */ 49734);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var _job_profile_management_job_profile_management_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./job-profile-management/job-profile-management.component */ 56055);
/* harmony import */ var _pipes_max_length_pipe__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../pipes/max-length.pipe */ 50314);















function JobProfilesComponent_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function JobProfilesComponent_button_5_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r5); const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](); return ctx_r4.openJobProfileManagement(0); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, " Add new Job Profile ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} }
function JobProfilesComponent_ng_container_23_tr_1_i_12_Template(rf, ctx) { if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "i", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function JobProfilesComponent_ng_container_23_tr_1_i_12_Template_i_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r13); const jobProfile_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit; const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2); return ctx_r11.openJobProfileManagement(jobProfile_r7); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} }
function JobProfilesComponent_ng_container_23_tr_1_i_13_Template(rf, ctx) { if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "i", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function JobProfilesComponent_ng_container_23_tr_1_i_13_Template_i_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r16); const jobProfile_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit; const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2); return ctx_r14.deleteJobProfile(jobProfile_r7); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} }
function JobProfilesComponent_ng_container_23_tr_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](6, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](7, "maxLength");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](8, "td")(9, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](11, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](12, JobProfilesComponent_ng_container_23_tr_1_i_12_Template, 1, 0, "i", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](13, JobProfilesComponent_ng_container_23_tr_1_i_13_Template, 1, 0, "i", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const jobProfile_r7 = ctx.$implicit;
    const i_r8 = ctx.index;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](i_r8 + 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](jobProfile_r7.hr_job_title);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("innerHTML", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](7, 8, jobProfile_r7.description || "", 30), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassMap"](jobProfile_r7.job_status ? "active" : "not-active");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", jobProfile_r7.job_status ? "Active" : "Not Active", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r6.checkIfHasPerm(26));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r6.checkIfHasPerm(27));
} }
function JobProfilesComponent_ng_container_23_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](1, JobProfilesComponent_ng_container_23_tr_1_Template, 14, 11, "tr", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngForOf", ctx_r1.jobProfiles);
} }
function JobProfilesComponent_ng_container_24_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](1, "td", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2, "No Job Profiles Founded");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("colSpan", 3);
} }
function JobProfilesComponent_ng_template_26_Template(rf, ctx) { if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "app-job-profile-management", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("updateJobProfileList", function JobProfilesComponent_ng_template_26_Template_app_job_profile_management_updateJobProfileList_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r18); const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](); return ctx_r17.updateJobProfileList($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("jobProfile", ctx_r3.selectedJobProfile);
} }
class JobProfilesComponent {
    constructor(hrService, _notify, _auth, _db, router, loadingService) {
        this.hrService = hrService;
        this._notify = _notify;
        this._auth = _auth;
        this._db = _db;
        this.router = router;
        this.loadingService = loadingService;
        this.newServerApi = src_environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.newServerApi;
        this.currentUser = this._auth.currentUser;
        this.showJobProfileManagement = false;
        this.userPerms = this._auth.userPerms;
    }
    ngOnInit() {
        this.checkCurrentUserPermissions();
    }
    getAllJobProfiles() {
        this.loadingService.setLoading(true);
        this.hrService.getAllJobProfiles().subscribe({
            next: res => {
                this.loadingService.setLoading(false);
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                    this.jobProfiles = res['data'];
                }
                else if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.Forbidden) {
                    this._notify.openSnackbar(`Error, ${res['data']['message']}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                    this._db.createSystemLogs(`${this.currentUser.username} Tried To Access jobProfiles Page At ${new Date().toLocaleString()}`, `${this.currentUser.key} Tried To Access jobProfiles Page At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe(res => {
                        this._notify.openSnackbar(`You Don't Have Permission To Access This Page`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Warning, 10000);
                        this.router.navigate(['/']);
                    }, err => {
                        this.router.navigate(['/']);
                    });
                }
                else {
                    this.jobProfiles = [];
                }
            }, error: err => {
                this.loadingService.setLoading(false);
                this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while Accessing jobProfiles Page`, `${this.currentUser.key} Has Error while Accessing jobProfiles Page`, this.currentUser.key || '', this.currentUser.username, 'Failed').subscribe();
            }
        });
    }
    checkCurrentUserPermissions() {
        // || this.currentUser.department == Department.MANAGEMENT
        if (!!this.currentUser && (this.checkIfHasPerm(28))) {
            this.getAllJobProfiles();
        }
        else {
            this._db.createSystemLogs(`${this.currentUser.username} Tried To Access jobProfiles Page At ${new Date().toLocaleString()}`, `${this.currentUser.key} Tried To Access jobProfiles Page At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe(res => {
                this._notify.openSnackbar(`You Don't Have Permission To Access This Page`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Warning, 10000);
                this.router.navigate(['/']);
            }, err => {
                this.router.navigate(['/']);
            });
        }
    }
    openJobProfileManagement(jobProfile) {
        this.showJobProfileManagement = true;
        this.selectedJobProfile = jobProfile;
    }
    updateJobProfileList(job_profile) {
        // let jobProfileIndex = this.jobProfiles.findIndex(x => x.id == job_profile.id);
        // if (jobProfileIndex != -1) {
        //   this.jobProfiles[jobProfileIndex] = job_profile;
        // } else {
        //   this.jobProfiles.push(job_profile);
        // }
        this.getAllJobProfiles();
        this.showJobProfileManagement = false;
    }
    deleteJobProfile(jobProfile) {
        this._notify.openDialog('Delete Job Profile?', `Are you sure you want to delete This Job Profile?`, false, '', true, false).subscribe(response => {
            if (response) {
                this.loadingService.setLoading(true);
                this.hrService.deleteJobProfile(jobProfile.id || '').subscribe({
                    next: res => {
                        if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                            this._notify.openSnackbar(`Job Profile Deleted Successfully`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                            this.jobProfiles = this.jobProfiles.filter(x => x.id != jobProfile.id);
                        }
                        this.loadingService.setLoading(false);
                    }, error: err => {
                        this.loadingService.setLoading(false);
                        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                        this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
                 trying To delete Job Profile with id ${jobProfile.id} At ${new Date().toLocaleString()}`, `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
                 trying To delete Job Profile with id ${jobProfile.id} At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe();
                    }
                });
            }
            else {
                this._notify.openSnackbar('Operation Cancelled!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Info);
            }
        });
    }
    checkIfHasPerm(perm_id) {
        const checking = this.userPerms.find(p => p.permission_id == perm_id);
        if (!!checking) {
            return true;
        }
        else {
            return false;
        }
    }
}
JobProfilesComponent.ɵfac = function JobProfilesComponent_Factory(t) { return new (t || JobProfilesComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_3__.HrService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_6__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_11__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_7__.LoadingService)); };
JobProfilesComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineComponent"]({ type: JobProfilesComponent, selectors: [["app-job-profiles"]], decls: 27, vars: 7, consts: [[1, "container-fluid", "mt-3"], [1, "row"], [1, "col-12", "d-flex", "justify-content-between", "align-items-center"], [1, "main-color", "p-2", "mb-2", "fw-bold"], ["type", "submit", "class", "btn btnStyle", 3, "click", 4, "ngIf"], [1, "col-1"], [1, "hrLine"], [1, "teble-responsive"], [1, "table", "newTableCustom"], [4, "ngIf"], ["styleClass", "p-sidebar-md", "position", "right", 1, "side", 3, "baseZIndex", "autoZIndex", "visible", "transitionOptions", "visibleChange"], ["pTemplate", "content"], ["type", "submit", 1, "btn", "btnStyle", 3, "click"], [4, "ngFor", "ngForOf"], [3, "innerHTML"], [1, "px-2", "rounded-3"], ["class", "cursor pi pi-pencil text-info mx-1", 3, "click", 4, "ngIf"], ["class", "cursor pi pi-trash text-danger mx-1", 3, "click", 4, "ngIf"], [1, "cursor", "pi", "pi-pencil", "text-info", "mx-1", 3, "click"], [1, "cursor", "pi", "pi-trash", "text-danger", "mx-1", 3, "click"], [1, "text-center", 3, "colSpan"], [3, "jobProfile", "updateJobProfileList"]], template: function JobProfilesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4, "Job Profiles");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](5, JobProfilesComponent_button_5_Template, 2, 0, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](8, "div", 7)(9, "table", 8)(10, "thead")(11, "tr")(12, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](13, "#");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](14, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](15, "Job Title");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](16, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](17, "Description");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](18, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](19, "Status");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](20, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](21, "Actions");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](22, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](23, JobProfilesComponent_ng_container_23_Template, 2, 1, "ng-container", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](24, JobProfilesComponent_ng_container_24_Template, 3, 1, "ng-container", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](25, "p-sidebar", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("visibleChange", function JobProfilesComponent_Template_p_sidebar_visibleChange_25_listener($event) { return ctx.showJobProfileManagement = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](26, JobProfilesComponent_ng_template_26_Template, 1, 1, "ng-template", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.checkIfHasPerm(26));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](18);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !!ctx.jobProfiles && ctx.jobProfiles.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", (ctx.jobProfiles == null ? null : ctx.jobProfiles.length) == 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("baseZIndex", 999)("autoZIndex", false)("visible", ctx.showJobProfileManagement)("transitionOptions", "350ms");
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgForOf, primeng_sidebar__WEBPACK_IMPORTED_MODULE_13__.Sidebar, primeng_api__WEBPACK_IMPORTED_MODULE_14__.PrimeTemplate, _job_profile_management_job_profile_management_component__WEBPACK_IMPORTED_MODULE_8__.JobProfileManagementComponent], pipes: [_pipes_max_length_pipe__WEBPACK_IMPORTED_MODULE_9__.MaxLengthPipe], styles: [".hrLine[_ngcontent-%COMP%] {\n  height: 2px;\n  width: 100%;\n  background-color: #513982;\n  margin: 5px;\n  margin-bottom: 30px;\n}\n\n.active[_ngcontent-%COMP%] {\n  color: #36B37E !important;\n  background-color: #E3FCEF;\n}\n\n.not-active[_ngcontent-%COMP%] {\n  color: #BC0000 !important;\n  background-color: #FFEBE6;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpvYi1wcm9maWxlcy5jb21wb25lbnQuc2NzcyIsIi4uXFwuLlxcLi5cXC4uXFxfY29sb3JzLnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXEZHUyUyMFRhc2slMjBNYW5hZ2VtZW50JTIwU3lzdGVtXFxmZ3N0bV91aVxcc3JjXFxhcHBcXGNvbXBvbmVudHNcXGhyXFxoaXJpbmctcHJvY2Vzc1xcam9iLXByb2ZpbGVzXFxqb2ItcHJvZmlsZXMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxXQUFBO0VBQ0EsV0FBQTtFQUNBLHlCQ0xZO0VETVosV0FBQTtFQUNBLG1CQUFBO0FFREo7O0FGSUE7RUFDSSx5QkFBQTtFQUNBLHlCQUFBO0FFREo7O0FGR0E7RUFDSSx5QkFBQTtFQUNBLHlCQUFBO0FFQUoiLCJmaWxlIjoiam9iLXByb2ZpbGVzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnLi4vLi4vLi4vLi4vY29sb3JzJztcclxuXHJcbi5ockxpbmUge1xyXG4gICAgaGVpZ2h0OiAycHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgIG1hcmdpbjogNXB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMzBweDtcclxufVxyXG5cclxuLmFjdGl2ZXtcclxuICAgIGNvbG9yOiMzNkIzN0UgIWltcG9ydGFudDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNFM0ZDRUY7XHJcbn1cclxuLm5vdC1hY3RpdmV7XHJcbiAgICBjb2xvcjojQkMwMDAwICFpbXBvcnRhbnQ7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZFQkU2O1xyXG59IiwiJG1haW5UaGVtZUNvbG9yOiM1MTM5ODI7XHJcbiRzdWJUaGVtZUNvbG9yOiM3NDYxOUI7XHJcbiRzdWJTdWJUaGVtZUNvbG9yOiM5Nzg4QjQ7XHJcbiRzb2Z0VGhlbWVDb2xvcjojRUVFQkYzO1xyXG4kYm9yZGVyQ29sb3I6I0NCQzREQTtcclxuJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I6I2Y0ODMxZjsgLy8jRjU4MjFGO1xyXG4kYnV0dG9uU3ViQmFja2dyb3VuZENvbG9yOiNGRkFCMDA7IC8vI0Y1ODIxRjtcclxuJGJ1dHRvblN1YlN1YkJhY2tncm91bmRDb2xvcjojRkU3RTE1OyAvLyNGNTgyMUY7XHJcbiRzZWNvbmRGb250Q29sb3I6IzcwNzA3MDtcclxuJGdyYXlCYWNrR3JvdW5kQ29sb3I6I0Y2RjdGODtcclxuJHdoaXRlQ29sb3I6I2ZmZjtcclxuJG1haW5Gb250RmFtaWx5OiAnQ2Fpcm8nO1xyXG4kc29mdEdyYXlCYWNrR3JvdW5kQ29sb3I6I0ZDRkNGQztcclxuJGJnTGlnaHQ6I0ZBRkJGQztcclxuJHRhYkJhY2tHcm91bmQ6I2YxZWNmMDsiLCIuaHJMaW5lIHtcbiAgaGVpZ2h0OiAycHg7XG4gIHdpZHRoOiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTEzOTgyO1xuICBtYXJnaW46IDVweDtcbiAgbWFyZ2luLWJvdHRvbTogMzBweDtcbn1cblxuLmFjdGl2ZSB7XG4gIGNvbG9yOiAjMzZCMzdFICFpbXBvcnRhbnQ7XG4gIGJhY2tncm91bmQtY29sb3I6ICNFM0ZDRUY7XG59XG5cbi5ub3QtYWN0aXZlIHtcbiAgY29sb3I6ICNCQzAwMDAgIWltcG9ydGFudDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRUJFNjtcbn0iXX0= */"] });


/***/ }),

/***/ 83605:
/*!******************************************************************************************************************!*\
  !*** ./src/app/components/hr/hiring-process/job-skills/job-skill-manangement/job-skill-manangement.component.ts ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JobSkillManangementComponent": () => (/* binding */ JobSkillManangementComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/hr.service */ 35487);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/loading.service */ 4471);
/* harmony import */ var _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/form-input/form-input.component */ 37604);












class JobSkillManangementComponent {
    constructor(hrService, _notify, _auth, _db, loadingService) {
        this.hrService = hrService;
        this._notify = _notify;
        this._auth = _auth;
        this._db = _db;
        this.loadingService = loadingService;
        this.currentUser = this._auth.currentUser;
        this.jobSkillsLoading = false;
        this.inJobProfileComponent = false;
        this.updateJobSkillList = new _angular_core__WEBPACK_IMPORTED_MODULE_8__.EventEmitter();
        this.jobSkillForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormGroup({
            "job_skill": new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.Validators.required),
        });
    }
    ngOnInit() {
        if (this.jobSkill) {
            this.jobSkillForm.patchValue(this.jobSkill);
        }
    }
    onSubmit() {
        if (this.jobSkillForm.invalid)
            return;
        if (this.jobSkill) {
            this.updateJobSkill();
        }
        else {
            this.createJobSkill();
        }
    }
    createJobSkill() {
        this.loadingService.setLoading(true);
        this.hrService.createJobSkill(this.jobSkillForm.value).subscribe({
            next: res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                    this.updateJobSkillList.emit(res['data']);
                    this._notify.openSnackbar(`job Skill created successfully`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                }
                this.loadingService.setLoading(false);
            }, error: err => {
                this.loadingService.setLoading(false);
                this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Job Skill At ${new Date().toLocaleString()}`, `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Job Skill At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe();
            }
        });
    }
    updateJobSkill() {
        var _a, _b;
        let jobSkill = {
            id: this.jobSkill.id,
        };
        if (this.jobSkill.job_skill !== ((_a = this.jobSkillForm.get('job_skill')) === null || _a === void 0 ? void 0 : _a.value)) {
            jobSkill.job_skill = (_b = this.jobSkillForm.get('job_skill')) === null || _b === void 0 ? void 0 : _b.value;
            this.loadingService.setLoading(true);
            this.hrService.updateJobSkill(jobSkill).subscribe({
                next: res => {
                    if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                        this.updateJobSkillList.emit(res['data']);
                        this._notify.openSnackbar(`job Skill updated successfully`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                    }
                    this.loadingService.setLoading(false);
                }, error: err => {
                    this.loadingService.setLoading(false);
                    this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                    this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
           trying To delete Job Skill with id ${jobSkill.id} At ${new Date().toLocaleString()}`, `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
           trying To delete Job Skill with id ${jobSkill.id} At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe();
                }
            });
        }
        else {
            this._notify.openSnackbar(`No changes made`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Info);
        }
    }
}
JobSkillManangementComponent.ɵfac = function JobSkillManangementComponent_Factory(t) { return new (t || JobSkillManangementComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_2__.HrService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_3__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_4__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_5__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_6__.LoadingService)); };
JobSkillManangementComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({ type: JobSkillManangementComponent, selectors: [["app-job-skill-manangement"]], inputs: { jobSkill: "jobSkill", inJobProfileComponent: "inJobProfileComponent" }, outputs: { updateJobSkillList: "updateJobSkillList" }, decls: 12, vars: 4, consts: [[1, "sidebar-header"], [1, "main-color"], [3, "formGroup", "ngSubmit"], [1, "row"], [1, "col-lg-12"], ["label", "Job Skill", "placeholder", "Write Job Skill", 3, "control"], [1, "row", "my-4"], ["type", "submit", 1, "btn", "btnStyle", "w-100"]], template: function JobSkillManangementComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div")(1, "div", 0)(2, "h1", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "form", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("ngSubmit", function JobSkillManangementComponent_Template_form_ngSubmit_4_listener() { return ctx.onSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](5, "div", 3)(6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](7, "app-form-input", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](8, "div", 6)(9, "div", 4)(10, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()()()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx.jobSkill ? "Update Job Skill" : "Create Job Skill", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("formGroup", ctx.jobSkillForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("control", ctx.jobSkillForm.get("job_skill"));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx.jobSkill ? "Update" : "Create", " ");
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_9__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormGroupDirective, _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_7__.FormInputComponent], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJqb2Itc2tpbGwtbWFuYW5nZW1lbnQuY29tcG9uZW50LnNjc3MifQ== */"] });


/***/ }),

/***/ 48906:
/*!*********************************************************************************!*\
  !*** ./src/app/components/hr/hiring-process/job-skills/job-skills.component.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JobSkillsComponent": () => (/* binding */ JobSkillsComponent)
/* harmony export */ });
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/environments/environment */ 92340);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/hr.service */ 35487);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 52816);
/* harmony import */ var src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/loading.service */ 4471);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var primeng_sidebar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! primeng/sidebar */ 49734);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var _job_skill_manangement_job_skill_manangement_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./job-skill-manangement/job-skill-manangement.component */ 83605);














function JobSkillsComponent_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function JobSkillsComponent_button_5_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r5); const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r4.openJobSkillManagement(0); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " Add new Job Skill ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function JobSkillsComponent_ng_container_18_tr_1_i_6_Template(rf, ctx) { if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "i", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function JobSkillsComponent_ng_container_18_tr_1_i_6_Template_i_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r13); const jobSkill_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit; const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2); return ctx_r11.openJobSkillManagement(jobSkill_r7); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function JobSkillsComponent_ng_container_18_tr_1_i_7_Template(rf, ctx) { if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "i", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function JobSkillsComponent_ng_container_18_tr_1_i_7_Template_i_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r16); const jobSkill_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit; const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2); return ctx_r14.deleteJobSkill(jobSkill_r7); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function JobSkillsComponent_ng_container_18_tr_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](6, JobSkillsComponent_ng_container_18_tr_1_i_6_Template, 1, 0, "i", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](7, JobSkillsComponent_ng_container_18_tr_1_i_7_Template, 1, 0, "i", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const jobSkill_r7 = ctx.$implicit;
    const i_r8 = ctx.index;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](i_r8 + 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](jobSkill_r7.job_skill);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r6.checkIfHasPerm(29));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r6.checkIfHasPerm(30));
} }
function JobSkillsComponent_ng_container_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, JobSkillsComponent_ng_container_18_tr_1_Template, 8, 4, "tr", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r1.jobSkills);
} }
function JobSkillsComponent_ng_container_19_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "td", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "No Job Skills Founded");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("colSpan", 3);
} }
function JobSkillsComponent_ng_template_21_Template(rf, ctx) { if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "app-job-skill-manangement", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("updateJobSkillList", function JobSkillsComponent_ng_template_21_Template_app_job_skill_manangement_updateJobSkillList_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r18); const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r17.updateJobSkillList($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("jobSkill", ctx_r3.selectedJobSkill);
} }
class JobSkillsComponent {
    constructor(hrService, _notify, _auth, _db, router, loadingService) {
        this.hrService = hrService;
        this._notify = _notify;
        this._auth = _auth;
        this._db = _db;
        this.router = router;
        this.loadingService = loadingService;
        this.newServerApi = src_environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.newServerApi;
        this.currentUser = this._auth.currentUser;
        this.showJobSkillManagement = false;
        this.userPerms = this._auth.userPerms;
    }
    ngOnInit() {
        this.checkCurrentUserPermissions();
    }
    getAllJobSkills() {
        this.loadingService.setLoading(true);
        this.hrService.getAllJobSkills().subscribe({
            next: res => {
                this.loadingService.setLoading(false);
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                    this.jobSkills = res['data'];
                }
                else if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.Forbidden) {
                    this._db.createSystemLogs(`${this.currentUser.username} Tried To Access JobSkills Page At ${new Date().toLocaleString()}`, `${this.currentUser.key} Tried To Access JobSkills Page At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe(res => {
                        this._notify.openSnackbar(`You Don't Have Permission To Access This Page`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Warning, 10000);
                        this.router.navigate(['/']);
                    }, err => {
                        this.router.navigate(['/']);
                    });
                }
                else {
                    this.jobSkills = [];
                }
            }, error: err => {
                this.loadingService.setLoading(false);
                this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while Accessing JobSkills Page`, `${this.currentUser.key} Has Error while Accessing JobSkills Page`, this.currentUser.key || '', this.currentUser.username, 'Failed').subscribe();
            }
        });
    }
    checkCurrentUserPermissions() {
        if (!!this.currentUser && this.checkIfHasPerm(31)) {
            this.getAllJobSkills();
        }
        else {
            this._db.createSystemLogs(`${this.currentUser.username} Tried To Access JobSkills Page At ${new Date().toLocaleString()}`, `${this.currentUser.key} Tried To Access JobSkills Page At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe(res => {
                this._notify.openSnackbar(`You Don't Have Permission To Access This Page`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Warning, 10000);
                this.router.navigate(['/']);
            }, err => {
                this.router.navigate(['/']);
            });
        }
    }
    openJobSkillManagement(jobSkill) {
        this.showJobSkillManagement = true;
        this.selectedJobSkill = jobSkill;
    }
    updateJobSkillList(job_Skill) {
        // let jobSkillIndex = this.JobSkills.findIndex(x => x.id == job_Skill.id);
        // if (jobSkillIndex != -1) {
        //   this.JobSkills[jobSkillIndex] = job_Skill;
        // } else {
        //   this.JobSkills.push(job_Skill);
        // }
        this.getAllJobSkills();
        this.showJobSkillManagement = false;
    }
    deleteJobSkill(jobSkill) {
        this._notify.openDialog('Delete Job Skill?', `Are you sure you want to delete This Job Skill?`, false, '', true, false).subscribe(response => {
            if (response) {
                this.loadingService.setLoading(true);
                this.hrService.deleteJobSkill(jobSkill.id.toString()).subscribe({
                    next: res => {
                        if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                            this._notify.openSnackbar(`Job Skill Deleted Successfully`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                            this.jobSkills = this.jobSkills.filter(x => x.id != jobSkill.id);
                        }
                        this.loadingService.setLoading(false);
                    }, error: err => {
                        this.loadingService.setLoading(false);
                        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
                        this._db.createSystemLogs(`${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
                 trying To delete Job Skill with id ${jobSkill.id} At ${new Date().toLocaleString()}`, `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
                 trying To delete Job Skill with id ${jobSkill.id} At ${new Date().toLocaleString()}`, this.currentUser.key, this.currentUser.username, 'Failed').subscribe();
                    }
                });
            }
            else {
                this._notify.openSnackbar('Operation Cancelled!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Info);
            }
        });
    }
    checkIfHasPerm(perm_id) {
        const checking = this.userPerms.find(p => p.permission_id == perm_id);
        if (!!checking) {
            return true;
        }
        else {
            return false;
        }
    }
}
JobSkillsComponent.ɵfac = function JobSkillsComponent_Factory(t) { return new (t || JobSkillsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_hr_service__WEBPACK_IMPORTED_MODULE_3__.HrService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_4__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_6__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_loading_service__WEBPACK_IMPORTED_MODULE_7__.LoadingService)); };
JobSkillsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({ type: JobSkillsComponent, selectors: [["app-job-skills"]], decls: 22, vars: 7, consts: [[1, "container-fluid", "mt-3"], [1, "row"], [1, "col-12", "d-flex", "justify-content-between", "align-items-center"], [1, "main-color", "p-2", "mb-2", "fw-bold"], ["type", "submit", "class", "btn btnStyle", 3, "click", 4, "ngIf"], [1, "col-1"], [1, "hrLine"], [1, "teble-responsive"], [1, "table", "newTableCustom"], [4, "ngIf"], ["styleClass", "p-sidebar-sm", "position", "right", 1, "side", 3, "baseZIndex", "autoZIndex", "visible", "transitionOptions", "visibleChange"], ["pTemplate", "content"], ["type", "submit", 1, "btn", "btnStyle", 3, "click"], [4, "ngFor", "ngForOf"], ["class", "cursor pi pi-pencil text-info mx-1", 3, "click", 4, "ngIf"], ["class", "cursor pi pi-trash text-danger mx-1", 3, "click", 4, "ngIf"], [1, "cursor", "pi", "pi-pencil", "text-info", "mx-1", 3, "click"], [1, "cursor", "pi", "pi-trash", "text-danger", "mx-1", 3, "click"], [1, "text-center", 3, "colSpan"], [3, "jobSkill", "updateJobSkillList"]], template: function JobSkillsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4, "Job Skills");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](5, JobSkillsComponent_button_5_Template, 2, 0, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "div", 7)(9, "table", 8)(10, "thead")(11, "tr")(12, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](13, "#");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](15, "Job Skill");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](16, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](17, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](18, JobSkillsComponent_ng_container_18_Template, 2, 1, "ng-container", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](19, JobSkillsComponent_ng_container_19_Template, 3, 1, "ng-container", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](20, "p-sidebar", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("visibleChange", function JobSkillsComponent_Template_p_sidebar_visibleChange_20_listener($event) { return ctx.showJobSkillManagement = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](21, JobSkillsComponent_ng_template_21_Template, 1, 1, "ng-template", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.checkIfHasPerm(29));
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!ctx.jobSkills && ctx.jobSkills.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", (ctx.jobSkills == null ? null : ctx.jobSkills.length) == 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("baseZIndex", 999)("autoZIndex", false)("visible", ctx.showJobSkillManagement)("transitionOptions", "350ms");
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgForOf, primeng_sidebar__WEBPACK_IMPORTED_MODULE_12__.Sidebar, primeng_api__WEBPACK_IMPORTED_MODULE_13__.PrimeTemplate, _job_skill_manangement_job_skill_manangement_component__WEBPACK_IMPORTED_MODULE_8__.JobSkillManangementComponent], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJqb2Itc2tpbGxzLmNvbXBvbmVudC5zY3NzIn0= */"] });


/***/ }),

/***/ 59983:
/*!****************************************************!*\
  !*** ./src/app/components/hr/hr-routing.module.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HrRoutingModule": () => (/* binding */ HrRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 52816);
/* harmony import */ var _hiring_process_candidates_candidates_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hiring-process/candidates/candidates.component */ 86461);
/* harmony import */ var _hiring_process_job_profiles_job_profiles_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hiring-process/job-profiles/job-profiles.component */ 52865);
/* harmony import */ var _hiring_process_job_skills_job_skills_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hiring-process/job-skills/job-skills.component */ 48906);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);






const routes = [
    { path: '', redirectTo: 'hiring-process', pathMatch: 'full' },
    {
        path: 'hiring-process',
        children: [
            { path: '', redirectTo: 'candidates', pathMatch: 'full' },
            { path: 'candidates', component: _hiring_process_candidates_candidates_component__WEBPACK_IMPORTED_MODULE_0__.CandidatesComponent },
            { path: 'job-profiles', component: _hiring_process_job_profiles_job_profiles_component__WEBPACK_IMPORTED_MODULE_1__.JobProfilesComponent },
            { path: 'job-skills', component: _hiring_process_job_skills_job_skills_component__WEBPACK_IMPORTED_MODULE_2__.JobSkillsComponent },
        ]
    }
];
class HrRoutingModule {
}
HrRoutingModule.ɵfac = function HrRoutingModule_Factory(t) { return new (t || HrRoutingModule)(); };
HrRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({ type: HrRoutingModule });
HrRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](HrRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule] }); })();


/***/ }),

/***/ 94920:
/*!********************************************!*\
  !*** ./src/app/components/hr/hr.module.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HrModule": () => (/* binding */ HrModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _hr_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hr-routing.module */ 59983);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/angular-material.module */ 74786);
/* harmony import */ var src_app_shared_shared_components_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/shared-components.module */ 17730);
/* harmony import */ var _hiring_process_candidates_candidate_management_candidate_management_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hiring-process/candidates/candidate-management/candidate-management.component */ 66720);
/* harmony import */ var _hiring_process_candidates_candidates_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hiring-process/candidates/candidates.component */ 86461);
/* harmony import */ var _hiring_process_job_profiles_job_profiles_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hiring-process/job-profiles/job-profiles.component */ 52865);
/* harmony import */ var _hiring_process_job_profiles_job_profile_management_job_profile_management_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hiring-process/job-profiles/job-profile-management/job-profile-management.component */ 56055);
/* harmony import */ var _hiring_process_candidates_candidate_details_candidate_details_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hiring-process/candidates/candidate-details/candidate-details.component */ 28009);
/* harmony import */ var _hiring_process_job_skills_job_skills_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./hiring-process/job-skills/job-skills.component */ 48906);
/* harmony import */ var _hiring_process_job_skills_job_skill_manangement_job_skill_manangement_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./hiring-process/job-skills/job-skill-manangement/job-skill-manangement.component */ 83605);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/chips */ 81196);
/* harmony import */ var _hiring_process_candidates_candidate_search_candidate_search_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./hiring-process/candidates/candidate-search/candidate-search.component */ 78320);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 3184);















class HrModule {
}
HrModule.ɵfac = function HrModule_Factory(t) { return new (t || HrModule)(); };
HrModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({ type: HrModule });
HrModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({ imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule,
            _hr_routing_module__WEBPACK_IMPORTED_MODULE_0__.HrRoutingModule,
            src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_1__.AngularMaterialModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule,
            src_app_shared_shared_components_module__WEBPACK_IMPORTED_MODULE_2__.SharedComponentsModule,
            _angular_material_chips__WEBPACK_IMPORTED_MODULE_14__.MatChipsModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsetNgModuleScope"](HrModule, { declarations: [_hiring_process_candidates_candidates_component__WEBPACK_IMPORTED_MODULE_4__.CandidatesComponent,
        _hiring_process_candidates_candidate_management_candidate_management_component__WEBPACK_IMPORTED_MODULE_3__.CandidateManagementComponent,
        _hiring_process_job_profiles_job_profiles_component__WEBPACK_IMPORTED_MODULE_5__.JobProfilesComponent,
        _hiring_process_job_profiles_job_profile_management_job_profile_management_component__WEBPACK_IMPORTED_MODULE_6__.JobProfileManagementComponent,
        _hiring_process_candidates_candidate_details_candidate_details_component__WEBPACK_IMPORTED_MODULE_7__.CandidateDetailsComponent,
        _hiring_process_job_skills_job_skills_component__WEBPACK_IMPORTED_MODULE_8__.JobSkillsComponent,
        _hiring_process_job_skills_job_skill_manangement_job_skill_manangement_component__WEBPACK_IMPORTED_MODULE_9__.JobSkillManangementComponent,
        _hiring_process_candidates_candidate_search_candidate_search_component__WEBPACK_IMPORTED_MODULE_10__.CandidateSearchComponent], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule,
        _hr_routing_module__WEBPACK_IMPORTED_MODULE_0__.HrRoutingModule,
        src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_1__.AngularMaterialModule,
        _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule,
        src_app_shared_shared_components_module__WEBPACK_IMPORTED_MODULE_2__.SharedComponentsModule,
        _angular_material_chips__WEBPACK_IMPORTED_MODULE_14__.MatChipsModule] }); })();


/***/ }),

/***/ 61611:
/*!**********************************!*\
  !*** ./src/app/interfaces/hr.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JobProfileStatus": () => (/* binding */ JobProfileStatus)
/* harmony export */ });
var JobProfileStatus;
(function (JobProfileStatus) {
    JobProfileStatus["ACTIVE"] = "1";
    JobProfileStatus["NOT_ACTIVE"] = "0";
})(JobProfileStatus || (JobProfileStatus = {}));


/***/ }),

/***/ 35487:
/*!****************************************!*\
  !*** ./src/app/services/hr.service.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HrService": () => (/* binding */ HrService)
/* harmony export */ });
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 92340);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 28784);



class HrService {
    constructor(_http) {
        this._http = _http;
    }
    getAllRecruitmentRequests(filterObj) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = {
            'token': token._token,
        };
        if (filterObj) {
            return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/FilterCVRecruitment`, Object.assign(Object.assign({}, reqOptions), filterObj));
        }
        else {
            return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/GetAllRecruitmentRequest`, reqOptions);
        }
    }
    createCandidate(candidate) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        candidate.append("token", token._token);
        let reqOptions = Object.assign({ 'token': token._token }, candidate);
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/UploadRecruitmentRequest`, candidate);
    }
    updateCandidate(candidate) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        candidate.append("token", token._token);
        let reqOptions = Object.assign({ 'token': token._token }, candidate);
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/UpdateRecruitmentRequest`, candidate);
    }
    deleteCandidate(candidate_id) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = {
            'token': token._token,
            'id': candidate_id
        };
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/DeleteRecruitmentRequest`, reqOptions);
    }
    checkCandidateData(candidateData) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = Object.assign({ 'token': token._token }, candidateData);
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/EmailandPhoneCheck`, reqOptions);
    }
    GetCandidateDetailsDuplicate(obj) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = Object.assign({ 'token': token._token }, obj);
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/GetRecruitmentDetailsDuplicate`, reqOptions);
    }
    // job profiles
    getAllJobProfiles() {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = {
            'token': token._token,
        };
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/GetAllJobTitle`, reqOptions);
    }
    createJobProfile(jobProfile) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = Object.assign({ 'token': token._token }, jobProfile);
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/CreateJobTitle`, reqOptions);
    }
    updateJobProfile(jobProfile) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = Object.assign({ 'token': token._token }, jobProfile);
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/UpdateJobTitle`, reqOptions);
    }
    deleteJobProfile(job_profile_id) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = {
            'token': token._token,
            'id': job_profile_id
        };
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/DeleteJobTitle`, reqOptions);
    }
    //job skills
    getAllJobSkills() {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = {
            'token': token._token,
        };
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/GetAllJobSkill`, reqOptions);
    }
    createJobSkill(jobSkill) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = Object.assign({ 'token': token._token }, jobSkill);
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/CreateJobSkill`, reqOptions);
    }
    updateJobSkill(jobSkill) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = Object.assign({ 'token': token._token }, jobSkill);
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/UpdateJobSkill`, reqOptions);
    }
    deleteJobSkill(Job_kill_id) {
        const myLocal = localStorage.getItem('userData');
        let token;
        token = JSON.parse(myLocal || '');
        let reqOptions = {
            'token': token._token,
            'id': Job_kill_id
        };
        return this._http.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.newServerApi}/api/users/DeleteJobSkill`, reqOptions);
    }
}
HrService.ɵfac = function HrService_Factory(t) { return new (t || HrService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient)); };
HrService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: HrService, factory: HrService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ 81196:
/*!***********************************************************!*\
  !*** ./node_modules/@angular/material/fesm2015/chips.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MAT_CHIPS_DEFAULT_OPTIONS": () => (/* binding */ MAT_CHIPS_DEFAULT_OPTIONS),
/* harmony export */   "MAT_CHIP_AVATAR": () => (/* binding */ MAT_CHIP_AVATAR),
/* harmony export */   "MAT_CHIP_REMOVE": () => (/* binding */ MAT_CHIP_REMOVE),
/* harmony export */   "MAT_CHIP_TRAILING_ICON": () => (/* binding */ MAT_CHIP_TRAILING_ICON),
/* harmony export */   "MatChip": () => (/* binding */ MatChip),
/* harmony export */   "MatChipAvatar": () => (/* binding */ MatChipAvatar),
/* harmony export */   "MatChipInput": () => (/* binding */ MatChipInput),
/* harmony export */   "MatChipList": () => (/* binding */ MatChipList),
/* harmony export */   "MatChipListChange": () => (/* binding */ MatChipListChange),
/* harmony export */   "MatChipRemove": () => (/* binding */ MatChipRemove),
/* harmony export */   "MatChipSelectionChange": () => (/* binding */ MatChipSelectionChange),
/* harmony export */   "MatChipTrailingIcon": () => (/* binding */ MatChipTrailingIcon),
/* harmony export */   "MatChipsModule": () => (/* binding */ MatChipsModule)
/* harmony export */ });
/* harmony import */ var _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/cdk/keycodes */ 75939);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/core */ 88133);
/* harmony import */ var _angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/cdk/coercion */ 76484);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/platform-browser/animations */ 73598);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 92218);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 88623);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 83910);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 85921);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 25722);
/* harmony import */ var _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/cdk/platform */ 14390);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/cdk/a11y */ 84128);
/* harmony import */ var _angular_cdk_collections__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/cdk/collections */ 89502);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/form-field */ 44770);
/* harmony import */ var _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/cdk/bidi */ 51588);


















/** Event object emitted by MatChip when selected or deselected. */
const _c0 = ["*"];
class MatChipSelectionChange {
  constructor( /** Reference to the chip that emitted the event. */
  source, /** Whether the chip that emitted the event is selected. */
  selected, /** Whether the selection change was a result of a user interaction. */
  isUserInput = false) {
    this.source = source;
    this.selected = selected;
    this.isUserInput = isUserInput;
  }
}
/**
 * Injection token that can be used to reference instances of `MatChipRemove`. It serves as
 * alternative token to the actual `MatChipRemove` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const MAT_CHIP_REMOVE = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('MatChipRemove');
/**
 * Injection token that can be used to reference instances of `MatChipAvatar`. It serves as
 * alternative token to the actual `MatChipAvatar` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const MAT_CHIP_AVATAR = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('MatChipAvatar');
/**
 * Injection token that can be used to reference instances of `MatChipTrailingIcon`. It serves as
 * alternative token to the actual `MatChipTrailingIcon` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const MAT_CHIP_TRAILING_ICON = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('MatChipTrailingIcon');
// Boilerplate for applying mixins to MatChip.
/** @docs-private */
class MatChipBase {
  constructor(_elementRef) {
    this._elementRef = _elementRef;
  }
}
const _MatChipMixinBase = (0,_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.mixinTabIndex)((0,_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.mixinColor)((0,_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.mixinDisableRipple)(MatChipBase), 'primary'), -1);
/**
 * Dummy directive to add CSS class to chip avatar.
 * @docs-private
 */
class MatChipAvatar {}
MatChipAvatar.ɵfac = function MatChipAvatar_Factory(t) {
  return new (t || MatChipAvatar)();
};
MatChipAvatar.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
  type: MatChipAvatar,
  selectors: [["mat-chip-avatar"], ["", "matChipAvatar", ""]],
  hostAttrs: [1, "mat-chip-avatar"],
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
    provide: MAT_CHIP_AVATAR,
    useExisting: MatChipAvatar
  }])]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipAvatar, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: 'mat-chip-avatar, [matChipAvatar]',
      host: {
        'class': 'mat-chip-avatar'
      },
      providers: [{
        provide: MAT_CHIP_AVATAR,
        useExisting: MatChipAvatar
      }]
    }]
  }], null, null);
})();
/**
 * Dummy directive to add CSS class to chip trailing icon.
 * @docs-private
 */
class MatChipTrailingIcon {}
MatChipTrailingIcon.ɵfac = function MatChipTrailingIcon_Factory(t) {
  return new (t || MatChipTrailingIcon)();
};
MatChipTrailingIcon.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
  type: MatChipTrailingIcon,
  selectors: [["mat-chip-trailing-icon"], ["", "matChipTrailingIcon", ""]],
  hostAttrs: [1, "mat-chip-trailing-icon"],
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
    provide: MAT_CHIP_TRAILING_ICON,
    useExisting: MatChipTrailingIcon
  }])]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipTrailingIcon, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: 'mat-chip-trailing-icon, [matChipTrailingIcon]',
      host: {
        'class': 'mat-chip-trailing-icon'
      },
      providers: [{
        provide: MAT_CHIP_TRAILING_ICON,
        useExisting: MatChipTrailingIcon
      }]
    }]
  }], null, null);
})();
/** Material Design styled chip directive. Used inside the MatChipList component. */
class MatChip extends _MatChipMixinBase {
  constructor(elementRef, _ngZone, platform, globalRippleOptions, _changeDetectorRef, _document, animationMode, tabIndex) {
    super(elementRef);
    this._ngZone = _ngZone;
    this._changeDetectorRef = _changeDetectorRef;
    /** Whether the chip has focus. */
    this._hasFocus = false;
    /** Whether the chip list is selectable */
    this.chipListSelectable = true;
    /** Whether the chip list is in multi-selection mode. */
    this._chipListMultiple = false;
    /** Whether the chip list as a whole is disabled. */
    this._chipListDisabled = false;
    this._selected = false;
    this._selectable = true;
    this._disabled = false;
    this._removable = true;
    /** Emits when the chip is focused. */
    this._onFocus = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits when the chip is blured. */
    this._onBlur = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emitted when the chip is selected or deselected. */
    this.selectionChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /** Emitted when the chip is destroyed. */
    this.destroyed = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /** Emitted when a chip is to be removed. */
    this.removed = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this._addHostClassName();
    // Dynamically create the ripple target, append it within the chip, and use it as the
    // chip's ripple target. Adding the class '.mat-chip-ripple' ensures that it will have
    // the proper styles.
    this._chipRippleTarget = _document.createElement('div');
    this._chipRippleTarget.classList.add('mat-chip-ripple');
    this._elementRef.nativeElement.appendChild(this._chipRippleTarget);
    this._chipRipple = new _angular_material_core__WEBPACK_IMPORTED_MODULE_1__.RippleRenderer(this, _ngZone, this._chipRippleTarget, platform);
    this._chipRipple.setupTriggerEvents(elementRef);
    this.rippleConfig = globalRippleOptions || {};
    this._animationsDisabled = animationMode === 'NoopAnimations';
    this.tabIndex = tabIndex != null ? parseInt(tabIndex) || -1 : -1;
  }
  /**
   * Whether ripples are disabled on interaction
   * @docs-private
   */
  get rippleDisabled() {
    return this.disabled || this.disableRipple || this._animationsDisabled || !!this.rippleConfig.disabled;
  }
  /** Whether the chip is selected. */
  get selected() {
    return this._selected;
  }
  set selected(value) {
    const coercedValue = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    if (coercedValue !== this._selected) {
      this._selected = coercedValue;
      this._dispatchSelectionChange();
    }
  }
  /** The value of the chip. Defaults to the content inside `<mat-chip>` tags. */
  get value() {
    return this._value !== undefined ? this._value : this._elementRef.nativeElement.textContent;
  }
  set value(value) {
    this._value = value;
  }
  /**
   * Whether or not the chip is selectable. When a chip is not selectable,
   * changes to its selected state are always ignored. By default a chip is
   * selectable, and it becomes non-selectable if its parent chip list is
   * not selectable.
   */
  get selectable() {
    return this._selectable && this.chipListSelectable;
  }
  set selectable(value) {
    this._selectable = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
  }
  /** Whether the chip is disabled. */
  get disabled() {
    return this._chipListDisabled || this._disabled;
  }
  set disabled(value) {
    this._disabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
  }
  /**
   * Determines whether or not the chip displays the remove styling and emits (removed) events.
   */
  get removable() {
    return this._removable;
  }
  set removable(value) {
    this._removable = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
  }
  /** The ARIA selected applied to the chip. */
  get ariaSelected() {
    // Remove the `aria-selected` when the chip is deselected in single-selection mode, because
    // it adds noise to NVDA users where "not selected" will be read out for each chip.
    return this.selectable && (this._chipListMultiple || this.selected) ? this.selected.toString() : null;
  }
  _addHostClassName() {
    const basicChipAttrName = 'mat-basic-chip';
    const element = this._elementRef.nativeElement;
    if (element.hasAttribute(basicChipAttrName) || element.tagName.toLowerCase() === basicChipAttrName) {
      element.classList.add(basicChipAttrName);
      return;
    } else {
      element.classList.add('mat-standard-chip');
    }
  }
  ngOnDestroy() {
    this.destroyed.emit({
      chip: this
    });
    this._chipRipple._removeTriggerEvents();
  }
  /** Selects the chip. */
  select() {
    if (!this._selected) {
      this._selected = true;
      this._dispatchSelectionChange();
      this._changeDetectorRef.markForCheck();
    }
  }
  /** Deselects the chip. */
  deselect() {
    if (this._selected) {
      this._selected = false;
      this._dispatchSelectionChange();
      this._changeDetectorRef.markForCheck();
    }
  }
  /** Select this chip and emit selected event */
  selectViaInteraction() {
    if (!this._selected) {
      this._selected = true;
      this._dispatchSelectionChange(true);
      this._changeDetectorRef.markForCheck();
    }
  }
  /** Toggles the current selected state of this chip. */
  toggleSelected(isUserInput = false) {
    this._selected = !this.selected;
    this._dispatchSelectionChange(isUserInput);
    this._changeDetectorRef.markForCheck();
    return this.selected;
  }
  /** Allows for programmatic focusing of the chip. */
  focus() {
    if (!this._hasFocus) {
      this._elementRef.nativeElement.focus();
      this._onFocus.next({
        chip: this
      });
    }
    this._hasFocus = true;
  }
  /**
   * Allows for programmatic removal of the chip. Called by the MatChipList when the DELETE or
   * BACKSPACE keys are pressed.
   *
   * Informs any listeners of the removal request. Does not remove the chip from the DOM.
   */
  remove() {
    if (this.removable) {
      this.removed.emit({
        chip: this
      });
    }
  }
  /** Handles click events on the chip. */
  _handleClick(event) {
    if (this.disabled) {
      event.preventDefault();
    }
  }
  /** Handle custom key presses. */
  _handleKeydown(event) {
    if (this.disabled) {
      return;
    }
    switch (event.keyCode) {
      case _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_4__.DELETE:
      case _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_4__.BACKSPACE:
        // If we are removable, remove the focused chip
        this.remove();
        // Always prevent so page navigation does not occur
        event.preventDefault();
        break;
      case _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_4__.SPACE:
        // If we are selectable, toggle the focused chip
        if (this.selectable) {
          this.toggleSelected(true);
        }
        // Always prevent space from scrolling the page since the list has focus
        event.preventDefault();
        break;
    }
  }
  _blur() {
    // When animations are enabled, Angular may end up removing the chip from the DOM a little
    // earlier than usual, causing it to be blurred and throwing off the logic in the chip list
    // that moves focus not the next item. To work around the issue, we defer marking the chip
    // as not focused until the next time the zone stabilizes.
    this._ngZone.onStable.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.take)(1)).subscribe(() => {
      this._ngZone.run(() => {
        this._hasFocus = false;
        this._onBlur.next({
          chip: this
        });
      });
    });
  }
  _dispatchSelectionChange(isUserInput = false) {
    this.selectionChange.emit({
      source: this,
      isUserInput,
      selected: this._selected
    });
  }
}
MatChip.ɵfac = function MatChip_Factory(t) {
  return new (t || MatChip)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_6__.Platform), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.MAT_RIPPLE_GLOBAL_OPTIONS, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_7__.DOCUMENT), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_8__.ANIMATION_MODULE_TYPE, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinjectAttribute"]('tabindex'));
};
MatChip.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
  type: MatChip,
  selectors: [["mat-basic-chip"], ["", "mat-basic-chip", ""], ["mat-chip"], ["", "mat-chip", ""]],
  contentQueries: function MatChip_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MAT_CHIP_AVATAR, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MAT_CHIP_TRAILING_ICON, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MAT_CHIP_REMOVE, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.avatar = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.trailingIcon = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.removeIcon = _t.first);
    }
  },
  hostAttrs: ["role", "option", 1, "mat-chip", "mat-focus-indicator"],
  hostVars: 14,
  hostBindings: function MatChip_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MatChip_click_HostBindingHandler($event) {
        return ctx._handleClick($event);
      })("keydown", function MatChip_keydown_HostBindingHandler($event) {
        return ctx._handleKeydown($event);
      })("focus", function MatChip_focus_HostBindingHandler() {
        return ctx.focus();
      })("blur", function MatChip_blur_HostBindingHandler() {
        return ctx._blur();
      });
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("tabindex", ctx.disabled ? null : ctx.tabIndex)("disabled", ctx.disabled || null)("aria-disabled", ctx.disabled.toString())("aria-selected", ctx.ariaSelected);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("mat-chip-selected", ctx.selected)("mat-chip-with-avatar", ctx.avatar)("mat-chip-with-trailing-icon", ctx.trailingIcon || ctx.removeIcon)("mat-chip-disabled", ctx.disabled)("_mat-animation-noopable", ctx._animationsDisabled);
    }
  },
  inputs: {
    color: "color",
    disableRipple: "disableRipple",
    tabIndex: "tabIndex",
    selected: "selected",
    value: "value",
    selectable: "selectable",
    disabled: "disabled",
    removable: "removable"
  },
  outputs: {
    selectionChange: "selectionChange",
    destroyed: "destroyed",
    removed: "removed"
  },
  exportAs: ["matChip"],
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChip, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: `mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]`,
      inputs: ['color', 'disableRipple', 'tabIndex'],
      exportAs: 'matChip',
      host: {
        'class': 'mat-chip mat-focus-indicator',
        '[attr.tabindex]': 'disabled ? null : tabIndex',
        'role': 'option',
        '[class.mat-chip-selected]': 'selected',
        '[class.mat-chip-with-avatar]': 'avatar',
        '[class.mat-chip-with-trailing-icon]': 'trailingIcon || removeIcon',
        '[class.mat-chip-disabled]': 'disabled',
        '[class._mat-animation-noopable]': '_animationsDisabled',
        '[attr.disabled]': 'disabled || null',
        '[attr.aria-disabled]': 'disabled.toString()',
        '[attr.aria-selected]': 'ariaSelected',
        '(click)': '_handleClick($event)',
        '(keydown)': '_handleKeydown($event)',
        '(focus)': 'focus()',
        '(blur)': '_blur()'
      }
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone
    }, {
      type: _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_6__.Platform
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
        args: [_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.MAT_RIPPLE_GLOBAL_OPTIONS]
      }]
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
        args: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.DOCUMENT]
      }]
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
        args: [_angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_8__.ANIMATION_MODULE_TYPE]
      }]
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Attribute,
        args: ['tabindex']
      }]
    }];
  }, {
    avatar: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChild,
      args: [MAT_CHIP_AVATAR]
    }],
    trailingIcon: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChild,
      args: [MAT_CHIP_TRAILING_ICON]
    }],
    removeIcon: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChild,
      args: [MAT_CHIP_REMOVE]
    }],
    selected: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    value: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    selectable: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    removable: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    selectionChange: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    destroyed: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    removed: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }]
  });
})();
/**
 * Applies proper (click) support and adds styling for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 *     `<mat-chip>
 *       <mat-icon matChipRemove>cancel</mat-icon>
 *     </mat-chip>`
 *
 * You *may* use a custom icon, but you may need to override the `mat-chip-remove` positioning
 * styles to properly center the icon within the chip.
 */
class MatChipRemove {
  constructor(_parentChip, elementRef) {
    this._parentChip = _parentChip;
    if (elementRef.nativeElement.nodeName === 'BUTTON') {
      elementRef.nativeElement.setAttribute('type', 'button');
    }
  }
  /** Calls the parent chip's public `remove()` method if applicable. */
  _handleClick(event) {
    const parentChip = this._parentChip;
    if (parentChip.removable && !parentChip.disabled) {
      parentChip.remove();
    }
    // We need to stop event propagation because otherwise the event will bubble up to the
    // form field and cause the `onContainerClick` method to be invoked. This method would then
    // reset the focused chip that has been focused after chip removal. Usually the parent
    // the parent click listener of the `MatChip` would prevent propagation, but it can happen
    // that the chip is being removed before the event bubbles up.
    event.stopPropagation();
    event.preventDefault();
  }
}
MatChipRemove.ɵfac = function MatChipRemove_Factory(t) {
  return new (t || MatChipRemove)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](MatChip), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef));
};
MatChipRemove.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
  type: MatChipRemove,
  selectors: [["", "matChipRemove", ""]],
  hostAttrs: [1, "mat-chip-remove", "mat-chip-trailing-icon"],
  hostBindings: function MatChipRemove_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MatChipRemove_click_HostBindingHandler($event) {
        return ctx._handleClick($event);
      });
    }
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
    provide: MAT_CHIP_REMOVE,
    useExisting: MatChipRemove
  }])]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipRemove, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: '[matChipRemove]',
      host: {
        'class': 'mat-chip-remove mat-chip-trailing-icon',
        '(click)': '_handleClick($event)'
      },
      providers: [{
        provide: MAT_CHIP_REMOVE,
        useExisting: MatChipRemove
      }]
    }]
  }], function () {
    return [{
      type: MatChip
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
    }];
  }, null);
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Injection token to be used to override the default options for the chips module. */
const MAT_CHIPS_DEFAULT_OPTIONS = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('mat-chips-default-options');

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Increasing integer for generating unique ids.
let nextUniqueId$1 = 0;
/**
 * Directive that adds chip-specific behaviors to an input element inside `<mat-form-field>`.
 * May be placed inside or outside of an `<mat-chip-list>`.
 */
class MatChipInput {
  constructor(_elementRef, _defaultOptions) {
    this._elementRef = _elementRef;
    this._defaultOptions = _defaultOptions;
    /** Whether the control is focused. */
    this.focused = false;
    this._addOnBlur = false;
    /**
     * The list of key codes that will trigger a chipEnd event.
     *
     * Defaults to `[ENTER]`.
     */
    this.separatorKeyCodes = this._defaultOptions.separatorKeyCodes;
    /** Emitted when a chip is to be added. */
    this.chipEnd = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /** The input's placeholder text. */
    this.placeholder = '';
    /** Unique id for the input. */
    this.id = `mat-chip-list-input-${nextUniqueId$1++}`;
    this._disabled = false;
    this.inputElement = this._elementRef.nativeElement;
  }
  /** Register input for chip list */
  set chipList(value) {
    if (value) {
      this._chipList = value;
      this._chipList.registerInput(this);
    }
  }
  /**
   * Whether or not the chipEnd event will be emitted when the input is blurred.
   */
  get addOnBlur() {
    return this._addOnBlur;
  }
  set addOnBlur(value) {
    this._addOnBlur = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
  }
  /** Whether the input is disabled. */
  get disabled() {
    return this._disabled || this._chipList && this._chipList.disabled;
  }
  set disabled(value) {
    this._disabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
  }
  /** Whether the input is empty. */
  get empty() {
    return !this.inputElement.value;
  }
  ngOnChanges() {
    this._chipList.stateChanges.next();
  }
  ngOnDestroy() {
    this.chipEnd.complete();
  }
  ngAfterContentInit() {
    this._focusLastChipOnBackspace = this.empty;
  }
  /** Utility method to make host definition/tests more clear. */
  _keydown(event) {
    if (event) {
      // Allow the user's focus to escape when they're tabbing forward. Note that we don't
      // want to do this when going backwards, because focus should go back to the first chip.
      if (event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_4__.TAB && !(0,_angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_4__.hasModifierKey)(event, 'shiftKey')) {
        this._chipList._allowFocusEscape();
      }
      // To prevent the user from accidentally deleting chips when pressing BACKSPACE continuously,
      // We focus the last chip on backspace only after the user has released the backspace button,
      // and the input is empty (see behaviour in _keyup)
      if (event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_4__.BACKSPACE && this._focusLastChipOnBackspace) {
        this._chipList._keyManager.setLastItemActive();
        event.preventDefault();
        return;
      } else {
        this._focusLastChipOnBackspace = false;
      }
    }
    this._emitChipEnd(event);
  }
  /**
   * Pass events to the keyboard manager. Available here for tests.
   */
  _keyup(event) {
    // Allow user to move focus to chips next time he presses backspace
    if (!this._focusLastChipOnBackspace && event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_4__.BACKSPACE && this.empty) {
      this._focusLastChipOnBackspace = true;
      event.preventDefault();
    }
  }
  /** Checks to see if the blur should emit the (chipEnd) event. */
  _blur() {
    if (this.addOnBlur) {
      this._emitChipEnd();
    }
    this.focused = false;
    // Blur the chip list if it is not focused
    if (!this._chipList.focused) {
      this._chipList._blur();
    }
    this._chipList.stateChanges.next();
  }
  _focus() {
    this.focused = true;
    this._focusLastChipOnBackspace = this.empty;
    this._chipList.stateChanges.next();
  }
  /** Checks to see if the (chipEnd) event needs to be emitted. */
  _emitChipEnd(event) {
    if (!this.inputElement.value && !!event) {
      this._chipList._keydown(event);
    }
    if (!event || this._isSeparatorKey(event)) {
      this.chipEnd.emit({
        input: this.inputElement,
        value: this.inputElement.value,
        chipInput: this
      });
      event === null || event === void 0 ? void 0 : event.preventDefault();
    }
  }
  _onInput() {
    // Let chip list know whenever the value changes.
    this._chipList.stateChanges.next();
  }
  /** Focuses the input. */
  focus(options) {
    this.inputElement.focus(options);
  }
  /** Clears the input */
  clear() {
    this.inputElement.value = '';
    this._focusLastChipOnBackspace = true;
  }
  /** Checks whether a keycode is one of the configured separators. */
  _isSeparatorKey(event) {
    return !(0,_angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_4__.hasModifierKey)(event) && new Set(this.separatorKeyCodes).has(event.keyCode);
  }
}
MatChipInput.ɵfac = function MatChipInput_Factory(t) {
  return new (t || MatChipInput)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](MAT_CHIPS_DEFAULT_OPTIONS));
};
MatChipInput.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
  type: MatChipInput,
  selectors: [["input", "matChipInputFor", ""]],
  hostAttrs: [1, "mat-chip-input", "mat-input-element"],
  hostVars: 5,
  hostBindings: function MatChipInput_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keydown", function MatChipInput_keydown_HostBindingHandler($event) {
        return ctx._keydown($event);
      })("keyup", function MatChipInput_keyup_HostBindingHandler($event) {
        return ctx._keyup($event);
      })("blur", function MatChipInput_blur_HostBindingHandler() {
        return ctx._blur();
      })("focus", function MatChipInput_focus_HostBindingHandler() {
        return ctx._focus();
      })("input", function MatChipInput_input_HostBindingHandler() {
        return ctx._onInput();
      });
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵhostProperty"]("id", ctx.id);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("disabled", ctx.disabled || null)("placeholder", ctx.placeholder || null)("aria-invalid", ctx._chipList && ctx._chipList.ngControl ? ctx._chipList.ngControl.invalid : null)("aria-required", ctx._chipList && ctx._chipList.required || null);
    }
  },
  inputs: {
    chipList: ["matChipInputFor", "chipList"],
    addOnBlur: ["matChipInputAddOnBlur", "addOnBlur"],
    separatorKeyCodes: ["matChipInputSeparatorKeyCodes", "separatorKeyCodes"],
    placeholder: "placeholder",
    id: "id",
    disabled: "disabled"
  },
  outputs: {
    chipEnd: "matChipInputTokenEnd"
  },
  exportAs: ["matChipInput", "matChipInputFor"],
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipInput, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: 'input[matChipInputFor]',
      exportAs: 'matChipInput, matChipInputFor',
      host: {
        'class': 'mat-chip-input mat-input-element',
        '(keydown)': '_keydown($event)',
        '(keyup)': '_keyup($event)',
        '(blur)': '_blur()',
        '(focus)': '_focus()',
        '(input)': '_onInput()',
        '[id]': 'id',
        '[attr.disabled]': 'disabled || null',
        '[attr.placeholder]': 'placeholder || null',
        '[attr.aria-invalid]': '_chipList && _chipList.ngControl ? _chipList.ngControl.invalid : null',
        '[attr.aria-required]': '_chipList && _chipList.required || null'
      }
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
        args: [MAT_CHIPS_DEFAULT_OPTIONS]
      }]
    }];
  }, {
    chipList: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matChipInputFor']
    }],
    addOnBlur: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matChipInputAddOnBlur']
    }],
    separatorKeyCodes: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matChipInputSeparatorKeyCodes']
    }],
    chipEnd: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output,
      args: ['matChipInputTokenEnd']
    }],
    placeholder: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    id: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }]
  });
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Boilerplate for applying mixins to MatChipList.
/** @docs-private */
const _MatChipListBase = (0,_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.mixinErrorState)(class {
  constructor(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, /** @docs-private */
  ngControl) {
    this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
    this._parentForm = _parentForm;
    this._parentFormGroup = _parentFormGroup;
    this.ngControl = ngControl;
  }
});
// Increasing integer for generating unique ids for chip-list components.
let nextUniqueId = 0;
/** Change event object that is emitted when the chip list value has changed. */
class MatChipListChange {
  constructor( /** Chip list that emitted the event. */
  source, /** Value of the chip list when the event was emitted. */
  value) {
    this.source = source;
    this.value = value;
  }
}
/**
 * A material design chips component (named ChipList for its similarity to the List component).
 */
class MatChipList extends _MatChipListBase {
  constructor(_elementRef, _changeDetectorRef, _dir, _parentForm, _parentFormGroup, _defaultErrorStateMatcher, ngControl) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    this._elementRef = _elementRef;
    this._changeDetectorRef = _changeDetectorRef;
    this._dir = _dir;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    this.controlType = 'mat-chip-list';
    /**
     * When a chip is destroyed, we store the index of the destroyed chip until the chips
     * query list notifies about the update. This is necessary because we cannot determine an
     * appropriate chip that should receive focus until the array of chips updated completely.
     */
    this._lastDestroyedChipIndex = null;
    /** Subject that emits when the component has been destroyed. */
    this._destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Uid of the chip list */
    this._uid = `mat-chip-list-${nextUniqueId++}`;
    /** Tab index for the chip list. */
    this._tabIndex = 0;
    /**
     * User defined tab index.
     * When it is not null, use user defined tab index. Otherwise use _tabIndex
     */
    this._userTabIndex = null;
    /** Function when touched */
    this._onTouched = () => {};
    /** Function when changed */
    this._onChange = () => {};
    this._multiple = false;
    this._compareWith = (o1, o2) => o1 === o2;
    this._disabled = false;
    /** Orientation of the chip list. */
    this.ariaOrientation = 'horizontal';
    this._selectable = true;
    /** Event emitted when the selected chip list value has been changed by the user. */
    this.change = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /**
     * Event that emits whenever the raw value of the chip-list changes. This is here primarily
     * to facilitate the two-way binding for the `value` input.
     * @docs-private
     */
    this.valueChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  /** The array of selected chips inside chip list. */
  get selected() {
    var _a, _b;
    return this.multiple ? ((_a = this._selectionModel) === null || _a === void 0 ? void 0 : _a.selected) || [] : (_b = this._selectionModel) === null || _b === void 0 ? void 0 : _b.selected[0];
  }
  /** The ARIA role applied to the chip list. */
  get role() {
    return this.empty ? null : 'listbox';
  }
  /** Whether the user should be allowed to select multiple chips. */
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    this._multiple = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    this._syncChipsState();
  }
  /**
   * A function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   */
  get compareWith() {
    return this._compareWith;
  }
  set compareWith(fn) {
    this._compareWith = fn;
    if (this._selectionModel) {
      // A different comparator means the selection could change.
      this._initializeSelection();
    }
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get value() {
    return this._value;
  }
  set value(value) {
    this.writeValue(value);
    this._value = value;
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get id() {
    return this._chipInput ? this._chipInput.id : this._uid;
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get required() {
    var _a, _b, _c, _d;
    return (_d = (_a = this._required) !== null && _a !== void 0 ? _a : (_c = (_b = this.ngControl) === null || _b === void 0 ? void 0 : _b.control) === null || _c === void 0 ? void 0 : _c.hasValidator(_angular_forms__WEBPACK_IMPORTED_MODULE_9__.Validators.required)) !== null && _d !== void 0 ? _d : false;
  }
  set required(value) {
    this._required = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    this.stateChanges.next();
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get placeholder() {
    return this._chipInput ? this._chipInput.placeholder : this._placeholder;
  }
  set placeholder(value) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  /** Whether any chips or the matChipInput inside of this chip-list has focus. */
  get focused() {
    return this._chipInput && this._chipInput.focused || this._hasFocusedChip();
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get empty() {
    return (!this._chipInput || this._chipInput.empty) && (!this.chips || this.chips.length === 0);
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get shouldLabelFloat() {
    return !this.empty || this.focused;
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get disabled() {
    return this.ngControl ? !!this.ngControl.disabled : this._disabled;
  }
  set disabled(value) {
    this._disabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    this._syncChipsState();
  }
  /**
   * Whether or not this chip list is selectable. When a chip list is not selectable,
   * the selected states for all the chips inside the chip list are always ignored.
   */
  get selectable() {
    return this._selectable;
  }
  set selectable(value) {
    this._selectable = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    if (this.chips) {
      this.chips.forEach(chip => chip.chipListSelectable = this._selectable);
    }
  }
  set tabIndex(value) {
    this._userTabIndex = value;
    this._tabIndex = value;
  }
  /** Combined stream of all of the child chips' selection change events. */
  get chipSelectionChanges() {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.merge)(...this.chips.map(chip => chip.selectionChange));
  }
  /** Combined stream of all of the child chips' focus change events. */
  get chipFocusChanges() {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.merge)(...this.chips.map(chip => chip._onFocus));
  }
  /** Combined stream of all of the child chips' blur change events. */
  get chipBlurChanges() {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.merge)(...this.chips.map(chip => chip._onBlur));
  }
  /** Combined stream of all of the child chips' remove change events. */
  get chipRemoveChanges() {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.merge)(...this.chips.map(chip => chip.destroyed));
  }
  ngAfterContentInit() {
    this._keyManager = new _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_11__.FocusKeyManager(this.chips).withWrap().withVerticalOrientation().withHomeAndEnd().withHorizontalOrientation(this._dir ? this._dir.value : 'ltr');
    if (this._dir) {
      this._dir.change.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this._destroyed)).subscribe(dir => this._keyManager.withHorizontalOrientation(dir));
    }
    this._keyManager.tabOut.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this._destroyed)).subscribe(() => {
      this._allowFocusEscape();
    });
    // When the list changes, re-subscribe
    this.chips.changes.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.startWith)(null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this._destroyed)).subscribe(() => {
      if (this.disabled) {
        // Since this happens after the content has been
        // checked, we need to defer it to the next tick.
        Promise.resolve().then(() => {
          this._syncChipsState();
        });
      }
      this._resetChips();
      // Reset chips selected/deselected status
      this._initializeSelection();
      // Check to see if we need to update our tab index
      this._updateTabIndex();
      // Check to see if we have a destroyed chip and need to refocus
      this._updateFocusForDestroyedChips();
      this.stateChanges.next();
    });
  }
  ngOnInit() {
    this._selectionModel = new _angular_cdk_collections__WEBPACK_IMPORTED_MODULE_14__.SelectionModel(this.multiple, undefined, false);
    this.stateChanges.next();
  }
  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
      if (this.ngControl.disabled !== this._disabled) {
        this.disabled = !!this.ngControl.disabled;
      }
    }
  }
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
    this.stateChanges.complete();
    this._dropSubscriptions();
  }
  /** Associates an HTML input element with this chip list. */
  registerInput(inputElement) {
    this._chipInput = inputElement;
    // We use this attribute to match the chip list to its input in test harnesses.
    // Set the attribute directly here to avoid "changed after checked" errors.
    this._elementRef.nativeElement.setAttribute('data-mat-chip-input', inputElement.id);
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids) {
    this._ariaDescribedby = ids.join(' ');
  }
  // Implemented as part of ControlValueAccessor.
  writeValue(value) {
    if (this.chips) {
      this._setSelectionByValue(value, false);
    }
  }
  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn) {
    this._onChange = fn;
  }
  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  onContainerClick(event) {
    if (!this._originatesFromChip(event)) {
      this.focus();
    }
  }
  /**
   * Focuses the first non-disabled chip in this chip list, or the associated input when there
   * are no eligible chips.
   */
  focus(options) {
    if (this.disabled) {
      return;
    }
    // TODO: ARIA says this should focus the first `selected` chip if any are selected.
    // Focus on first element if there's no chipInput inside chip-list
    if (this._chipInput && this._chipInput.focused) {
      // do nothing
    } else if (this.chips.length > 0) {
      this._keyManager.setFirstItemActive();
      this.stateChanges.next();
    } else {
      this._focusInput(options);
      this.stateChanges.next();
    }
  }
  /** Attempt to focus an input if we have one. */
  _focusInput(options) {
    if (this._chipInput) {
      this._chipInput.focus(options);
    }
  }
  /**
   * Pass events to the keyboard manager. Available here for tests.
   */
  _keydown(event) {
    const target = event.target;
    if (target && target.classList.contains('mat-chip')) {
      this._keyManager.onKeydown(event);
      this.stateChanges.next();
    }
  }
  /**
   * Check the tab index as you should not be allowed to focus an empty list.
   */
  _updateTabIndex() {
    // If we have 0 chips, we should not allow keyboard focus
    this._tabIndex = this._userTabIndex || (this.chips.length === 0 ? -1 : 0);
  }
  /**
   * If the amount of chips changed, we need to update the
   * key manager state and focus the next closest chip.
   */
  _updateFocusForDestroyedChips() {
    // Move focus to the closest chip. If no other chips remain, focus the chip-list itself.
    if (this._lastDestroyedChipIndex != null) {
      if (this.chips.length) {
        const newChipIndex = Math.min(this._lastDestroyedChipIndex, this.chips.length - 1);
        this._keyManager.setActiveItem(newChipIndex);
      } else {
        this.focus();
      }
    }
    this._lastDestroyedChipIndex = null;
  }
  /**
   * Utility to ensure all indexes are valid.
   *
   * @param index The index to be checked.
   * @returns True if the index is valid for our list of chips.
   */
  _isValidIndex(index) {
    return index >= 0 && index < this.chips.length;
  }
  _setSelectionByValue(value, isUserInput = true) {
    this._clearSelection();
    this.chips.forEach(chip => chip.deselect());
    if (Array.isArray(value)) {
      value.forEach(currentValue => this._selectValue(currentValue, isUserInput));
      this._sortValues();
    } else {
      const correspondingChip = this._selectValue(value, isUserInput);
      // Shift focus to the active item. Note that we shouldn't do this in multiple
      // mode, because we don't know what chip the user interacted with last.
      if (correspondingChip) {
        if (isUserInput) {
          this._keyManager.setActiveItem(correspondingChip);
        }
      }
    }
  }
  /**
   * Finds and selects the chip based on its value.
   * @returns Chip that has the corresponding value.
   */
  _selectValue(value, isUserInput = true) {
    const correspondingChip = this.chips.find(chip => {
      return chip.value != null && this._compareWith(chip.value, value);
    });
    if (correspondingChip) {
      isUserInput ? correspondingChip.selectViaInteraction() : correspondingChip.select();
      this._selectionModel.select(correspondingChip);
    }
    return correspondingChip;
  }
  _initializeSelection() {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.
    Promise.resolve().then(() => {
      if (this.ngControl || this._value) {
        this._setSelectionByValue(this.ngControl ? this.ngControl.value : this._value, false);
        this.stateChanges.next();
      }
    });
  }
  /**
   * Deselects every chip in the list.
   * @param skip Chip that should not be deselected.
   */
  _clearSelection(skip) {
    this._selectionModel.clear();
    this.chips.forEach(chip => {
      if (chip !== skip) {
        chip.deselect();
      }
    });
    this.stateChanges.next();
  }
  /**
   * Sorts the model values, ensuring that they keep the same
   * order that they have in the panel.
   */
  _sortValues() {
    if (this._multiple) {
      this._selectionModel.clear();
      this.chips.forEach(chip => {
        if (chip.selected) {
          this._selectionModel.select(chip);
        }
      });
      this.stateChanges.next();
    }
  }
  /** Emits change event to set the model value. */
  _propagateChanges(fallbackValue) {
    let valueToEmit = null;
    if (Array.isArray(this.selected)) {
      valueToEmit = this.selected.map(chip => chip.value);
    } else {
      valueToEmit = this.selected ? this.selected.value : fallbackValue;
    }
    this._value = valueToEmit;
    this.change.emit(new MatChipListChange(this, valueToEmit));
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit);
    this._changeDetectorRef.markForCheck();
  }
  /** When blurred, mark the field as touched when focus moved outside the chip list. */
  _blur() {
    if (!this._hasFocusedChip()) {
      this._keyManager.setActiveItem(-1);
    }
    if (!this.disabled) {
      if (this._chipInput) {
        // If there's a chip input, we should check whether the focus moved to chip input.
        // If the focus is not moved to chip input, mark the field as touched. If the focus moved
        // to chip input, do nothing.
        // Timeout is needed to wait for the focus() event trigger on chip input.
        setTimeout(() => {
          if (!this.focused) {
            this._markAsTouched();
          }
        });
      } else {
        // If there's no chip input, then mark the field as touched.
        this._markAsTouched();
      }
    }
  }
  /** Mark the field as touched */
  _markAsTouched() {
    this._onTouched();
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }
  /**
   * Removes the `tabindex` from the chip list and resets it back afterwards, allowing the
   * user to tab out of it. This prevents the list from capturing focus and redirecting
   * it back to the first chip, creating a focus trap, if it user tries to tab away.
   */
  _allowFocusEscape() {
    if (this._tabIndex !== -1) {
      this._tabIndex = -1;
      setTimeout(() => {
        this._tabIndex = this._userTabIndex || 0;
        this._changeDetectorRef.markForCheck();
      });
    }
  }
  _resetChips() {
    this._dropSubscriptions();
    this._listenToChipsFocus();
    this._listenToChipsSelection();
    this._listenToChipsRemoved();
  }
  _dropSubscriptions() {
    if (this._chipFocusSubscription) {
      this._chipFocusSubscription.unsubscribe();
      this._chipFocusSubscription = null;
    }
    if (this._chipBlurSubscription) {
      this._chipBlurSubscription.unsubscribe();
      this._chipBlurSubscription = null;
    }
    if (this._chipSelectionSubscription) {
      this._chipSelectionSubscription.unsubscribe();
      this._chipSelectionSubscription = null;
    }
    if (this._chipRemoveSubscription) {
      this._chipRemoveSubscription.unsubscribe();
      this._chipRemoveSubscription = null;
    }
  }
  /** Listens to user-generated selection events on each chip. */
  _listenToChipsSelection() {
    this._chipSelectionSubscription = this.chipSelectionChanges.subscribe(event => {
      event.source.selected ? this._selectionModel.select(event.source) : this._selectionModel.deselect(event.source);
      // For single selection chip list, make sure the deselected value is unselected.
      if (!this.multiple) {
        this.chips.forEach(chip => {
          if (!this._selectionModel.isSelected(chip) && chip.selected) {
            chip.deselect();
          }
        });
      }
      if (event.isUserInput) {
        this._propagateChanges();
      }
    });
  }
  /** Listens to user-generated selection events on each chip. */
  _listenToChipsFocus() {
    this._chipFocusSubscription = this.chipFocusChanges.subscribe(event => {
      let chipIndex = this.chips.toArray().indexOf(event.chip);
      if (this._isValidIndex(chipIndex)) {
        this._keyManager.updateActiveItem(chipIndex);
      }
      this.stateChanges.next();
    });
    this._chipBlurSubscription = this.chipBlurChanges.subscribe(() => {
      this._blur();
      this.stateChanges.next();
    });
  }
  _listenToChipsRemoved() {
    this._chipRemoveSubscription = this.chipRemoveChanges.subscribe(event => {
      const chip = event.chip;
      const chipIndex = this.chips.toArray().indexOf(event.chip);
      // In case the chip that will be removed is currently focused, we temporarily store
      // the index in order to be able to determine an appropriate sibling chip that will
      // receive focus.
      if (this._isValidIndex(chipIndex) && chip._hasFocus) {
        this._lastDestroyedChipIndex = chipIndex;
      }
    });
  }
  /** Checks whether an event comes from inside a chip element. */
  _originatesFromChip(event) {
    let currentElement = event.target;
    while (currentElement && currentElement !== this._elementRef.nativeElement) {
      if (currentElement.classList.contains('mat-chip')) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }
    return false;
  }
  /** Checks whether any of the chips is focused. */
  _hasFocusedChip() {
    return this.chips && this.chips.some(chip => chip._hasFocus);
  }
  /** Syncs the list's state with the individual chips. */
  _syncChipsState() {
    if (this.chips) {
      this.chips.forEach(chip => {
        chip._chipListDisabled = this._disabled;
        chip._chipListMultiple = this.multiple;
      });
    }
  }
}
MatChipList.ɵfac = function MatChipList_Factory(t) {
  return new (t || MatChipList)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_15__.Directionality, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgForm, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormGroupDirective, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.ErrorStateMatcher), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControl, 10));
};
MatChipList.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: MatChipList,
  selectors: [["mat-chip-list"]],
  contentQueries: function MatChipList_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MatChip, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.chips = _t);
    }
  },
  hostAttrs: [1, "mat-chip-list"],
  hostVars: 15,
  hostBindings: function MatChipList_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("focus", function MatChipList_focus_HostBindingHandler() {
        return ctx.focus();
      })("blur", function MatChipList_blur_HostBindingHandler() {
        return ctx._blur();
      })("keydown", function MatChipList_keydown_HostBindingHandler($event) {
        return ctx._keydown($event);
      });
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵhostProperty"]("id", ctx._uid);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("tabindex", ctx.disabled ? null : ctx._tabIndex)("aria-describedby", ctx._ariaDescribedby || null)("aria-required", ctx.role ? ctx.required : null)("aria-disabled", ctx.disabled.toString())("aria-invalid", ctx.errorState)("aria-multiselectable", ctx.multiple)("role", ctx.role)("aria-orientation", ctx.ariaOrientation);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("mat-chip-list-disabled", ctx.disabled)("mat-chip-list-invalid", ctx.errorState)("mat-chip-list-required", ctx.required);
    }
  },
  inputs: {
    errorStateMatcher: "errorStateMatcher",
    multiple: "multiple",
    compareWith: "compareWith",
    value: "value",
    required: "required",
    placeholder: "placeholder",
    disabled: "disabled",
    ariaOrientation: ["aria-orientation", "ariaOrientation"],
    selectable: "selectable",
    tabIndex: "tabIndex"
  },
  outputs: {
    change: "change",
    valueChange: "valueChange"
  },
  exportAs: ["matChipList"],
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
    provide: _angular_material_form_field__WEBPACK_IMPORTED_MODULE_16__.MatFormFieldControl,
    useExisting: MatChipList
  }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]],
  ngContentSelectors: _c0,
  decls: 2,
  vars: 0,
  consts: [[1, "mat-chip-list-wrapper"]],
  template: function MatChipList_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    }
  },
  styles: [".mat-chip{position:relative;box-sizing:border-box;-webkit-tap-highlight-color:transparent;border:none;-webkit-appearance:none;-moz-appearance:none}.mat-standard-chip{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:inline-flex;padding:7px 12px;border-radius:16px;align-items:center;cursor:default;min-height:32px;height:1px}._mat-animation-noopable.mat-standard-chip{transition:none;animation:none}.mat-standard-chip .mat-chip-remove{border:none;-webkit-appearance:none;-moz-appearance:none;padding:0;background:none}.mat-standard-chip .mat-chip-remove.mat-icon,.mat-standard-chip .mat-chip-remove .mat-icon{width:18px;height:18px;font-size:18px}.mat-standard-chip::after{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit;opacity:0;content:\"\";pointer-events:none;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-standard-chip:hover::after{opacity:.12}.mat-standard-chip:focus{outline:none}.mat-standard-chip:focus::after{opacity:.16}.cdk-high-contrast-active .mat-standard-chip{outline:solid 1px}.cdk-high-contrast-active .mat-standard-chip:focus{outline:dotted 2px}.cdk-high-contrast-active .mat-standard-chip.mat-chip-selected{outline-width:3px}.mat-standard-chip.mat-chip-disabled::after{opacity:0}.mat-standard-chip.mat-chip-disabled .mat-chip-remove,.mat-standard-chip.mat-chip-disabled .mat-chip-trailing-icon{cursor:default}.mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar,.mat-standard-chip.mat-chip-with-avatar{padding-top:0;padding-bottom:0}.mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar{padding-right:8px;padding-left:0}[dir=rtl] .mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar{padding-left:8px;padding-right:0}.mat-standard-chip.mat-chip-with-trailing-icon{padding-top:7px;padding-bottom:7px;padding-right:8px;padding-left:12px}[dir=rtl] .mat-standard-chip.mat-chip-with-trailing-icon{padding-left:8px;padding-right:12px}.mat-standard-chip.mat-chip-with-avatar{padding-left:0;padding-right:12px}[dir=rtl] .mat-standard-chip.mat-chip-with-avatar{padding-right:0;padding-left:12px}.mat-standard-chip .mat-chip-avatar{width:24px;height:24px;margin-right:8px;margin-left:4px}[dir=rtl] .mat-standard-chip .mat-chip-avatar{margin-left:8px;margin-right:4px}.mat-standard-chip .mat-chip-remove,.mat-standard-chip .mat-chip-trailing-icon{width:18px;height:18px;cursor:pointer}.mat-standard-chip .mat-chip-remove,.mat-standard-chip .mat-chip-trailing-icon{margin-left:8px;margin-right:0}[dir=rtl] .mat-standard-chip .mat-chip-remove,[dir=rtl] .mat-standard-chip .mat-chip-trailing-icon{margin-right:8px;margin-left:0}.mat-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit;overflow:hidden;transform:translateZ(0)}.mat-chip-list-wrapper{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;margin:-4px}.mat-chip-list-wrapper input.mat-input-element,.mat-chip-list-wrapper .mat-standard-chip{margin:4px}.mat-chip-list-stacked .mat-chip-list-wrapper{flex-direction:column;align-items:flex-start}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-standard-chip{width:100%}.mat-chip-avatar{border-radius:50%;justify-content:center;align-items:center;display:flex;overflow:hidden;object-fit:cover}input.mat-chip-input{width:150px;margin:4px;flex:1 0 150px}\n"],
  encapsulation: 2,
  changeDetection: 0
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipList, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Component,
    args: [{
      selector: 'mat-chip-list',
      template: `<div class="mat-chip-list-wrapper"><ng-content></ng-content></div>`,
      exportAs: 'matChipList',
      host: {
        '[attr.tabindex]': 'disabled ? null : _tabIndex',
        '[attr.aria-describedby]': '_ariaDescribedby || null',
        '[attr.aria-required]': 'role ? required : null',
        '[attr.aria-disabled]': 'disabled.toString()',
        '[attr.aria-invalid]': 'errorState',
        '[attr.aria-multiselectable]': 'multiple',
        '[attr.role]': 'role',
        '[class.mat-chip-list-disabled]': 'disabled',
        '[class.mat-chip-list-invalid]': 'errorState',
        '[class.mat-chip-list-required]': 'required',
        '[attr.aria-orientation]': 'ariaOrientation',
        'class': 'mat-chip-list',
        '(focus)': 'focus()',
        '(blur)': '_blur()',
        '(keydown)': '_keydown($event)',
        '[id]': '_uid'
      },
      providers: [{
        provide: _angular_material_form_field__WEBPACK_IMPORTED_MODULE_16__.MatFormFieldControl,
        useExisting: MatChipList
      }],
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewEncapsulation.None,
      changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectionStrategy.OnPush,
      styles: [".mat-chip{position:relative;box-sizing:border-box;-webkit-tap-highlight-color:transparent;border:none;-webkit-appearance:none;-moz-appearance:none}.mat-standard-chip{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:inline-flex;padding:7px 12px;border-radius:16px;align-items:center;cursor:default;min-height:32px;height:1px}._mat-animation-noopable.mat-standard-chip{transition:none;animation:none}.mat-standard-chip .mat-chip-remove{border:none;-webkit-appearance:none;-moz-appearance:none;padding:0;background:none}.mat-standard-chip .mat-chip-remove.mat-icon,.mat-standard-chip .mat-chip-remove .mat-icon{width:18px;height:18px;font-size:18px}.mat-standard-chip::after{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit;opacity:0;content:\"\";pointer-events:none;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-standard-chip:hover::after{opacity:.12}.mat-standard-chip:focus{outline:none}.mat-standard-chip:focus::after{opacity:.16}.cdk-high-contrast-active .mat-standard-chip{outline:solid 1px}.cdk-high-contrast-active .mat-standard-chip:focus{outline:dotted 2px}.cdk-high-contrast-active .mat-standard-chip.mat-chip-selected{outline-width:3px}.mat-standard-chip.mat-chip-disabled::after{opacity:0}.mat-standard-chip.mat-chip-disabled .mat-chip-remove,.mat-standard-chip.mat-chip-disabled .mat-chip-trailing-icon{cursor:default}.mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar,.mat-standard-chip.mat-chip-with-avatar{padding-top:0;padding-bottom:0}.mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar{padding-right:8px;padding-left:0}[dir=rtl] .mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar{padding-left:8px;padding-right:0}.mat-standard-chip.mat-chip-with-trailing-icon{padding-top:7px;padding-bottom:7px;padding-right:8px;padding-left:12px}[dir=rtl] .mat-standard-chip.mat-chip-with-trailing-icon{padding-left:8px;padding-right:12px}.mat-standard-chip.mat-chip-with-avatar{padding-left:0;padding-right:12px}[dir=rtl] .mat-standard-chip.mat-chip-with-avatar{padding-right:0;padding-left:12px}.mat-standard-chip .mat-chip-avatar{width:24px;height:24px;margin-right:8px;margin-left:4px}[dir=rtl] .mat-standard-chip .mat-chip-avatar{margin-left:8px;margin-right:4px}.mat-standard-chip .mat-chip-remove,.mat-standard-chip .mat-chip-trailing-icon{width:18px;height:18px;cursor:pointer}.mat-standard-chip .mat-chip-remove,.mat-standard-chip .mat-chip-trailing-icon{margin-left:8px;margin-right:0}[dir=rtl] .mat-standard-chip .mat-chip-remove,[dir=rtl] .mat-standard-chip .mat-chip-trailing-icon{margin-right:8px;margin-left:0}.mat-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit;overflow:hidden;transform:translateZ(0)}.mat-chip-list-wrapper{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;margin:-4px}.mat-chip-list-wrapper input.mat-input-element,.mat-chip-list-wrapper .mat-standard-chip{margin:4px}.mat-chip-list-stacked .mat-chip-list-wrapper{flex-direction:column;align-items:flex-start}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-standard-chip{width:100%}.mat-chip-avatar{border-radius:50%;justify-content:center;align-items:center;display:flex;overflow:hidden;object-fit:cover}input.mat-chip-input{width:150px;margin:4px;flex:1 0 150px}\n"]
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef
    }, {
      type: _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_15__.Directionality,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
      }]
    }, {
      type: _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgForm,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
      }]
    }, {
      type: _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormGroupDirective,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
      }]
    }, {
      type: _angular_material_core__WEBPACK_IMPORTED_MODULE_1__.ErrorStateMatcher
    }, {
      type: _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControl,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
      }]
    }];
  }, {
    errorStateMatcher: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    multiple: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    compareWith: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    value: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    required: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    placeholder: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    ariaOrientation: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['aria-orientation']
    }],
    selectable: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    tabIndex: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    change: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    valueChange: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    chips: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChildren,
      args: [MatChip, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }]
  });
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const CHIP_DECLARATIONS = [MatChipList, MatChip, MatChipInput, MatChipRemove, MatChipAvatar, MatChipTrailingIcon];
class MatChipsModule {}
MatChipsModule.ɵfac = function MatChipsModule_Factory(t) {
  return new (t || MatChipsModule)();
};
MatChipsModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
  type: MatChipsModule
});
MatChipsModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
  providers: [_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.ErrorStateMatcher, {
    provide: MAT_CHIPS_DEFAULT_OPTIONS,
    useValue: {
      separatorKeyCodes: [_angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_4__.ENTER]
    }
  }],
  imports: [[_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.MatCommonModule]]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipsModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgModule,
    args: [{
      imports: [_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.MatCommonModule],
      exports: CHIP_DECLARATIONS,
      declarations: CHIP_DECLARATIONS,
      providers: [_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.ErrorStateMatcher, {
        provide: MAT_CHIPS_DEFAULT_OPTIONS,
        useValue: {
          separatorKeyCodes: [_angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_4__.ENTER]
        }
      }]
    }]
  }], null, null);
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */



/***/ })

}]);
//# sourceMappingURL=src_app_components_hr_hr_module_ts.js.map