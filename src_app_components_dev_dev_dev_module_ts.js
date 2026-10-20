"use strict";
(self["webpackChunkfgsPM"] = self["webpackChunkfgsPM"] || []).push([["src_app_components_dev_dev_dev_module_ts"],{

/***/ 8655:
/*!**********************************************************************************!*\
  !*** ./src/app/components/dev/components/dev-projects/dev-projects.component.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DevProjectsComponent": () => (/* binding */ DevProjectsComponent)
/* harmony export */ });
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var primeng_progressbar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/progressbar */ 59858);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 52816);







const _c0 = function (a0) { return { "hold": a0 }; };
const _c1 = function () { return { "height": "10px" }; };
const _c2 = function (a1) { return ["/dev/myprojects", a1]; };
function DevProjectsComponent_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 3)(2, "div", 4)(3, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "a", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](6, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](7, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](9, "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div")(11, "p", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12, "Progress");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](13, "p-progressBar", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "p", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](16, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "a", 10)(18, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](19, "Details");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const project_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](project_r1.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassMapInterpolate1"]("badge ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](6, 11, project_r1.status_name), " p-2");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction1"](20, _c0, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](7, 13, project_r1.status_name) == "on hold"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](9, 15, project_r1.status_name));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](22, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", project_r1.progress);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](16, 17, project_r1.progress, "1.2-2"), "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction1"](23, _c2, project_r1.key));
} }
class DevProjectsComponent {
    constructor(_db, _auth) {
        this._db = _db;
        this._auth = _auth;
        this.myProjectsList = [];
    }
    ngOnInit() {
        this._auth.user.subscribe((user) => {
            if (!!user) {
                this._db.getDevProjects(user.key).subscribe(data => {
                    // console.log(data);
                    if (data['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                        this.myProjectsList = data['data'];
                    }
                });
                // if(user.accRoles == AccountRoles.Automation_Engineer){
                // }
                // else if(user.accRoles == AccountRoles.Automation_Engineer){
                //   this.db.getBAProjects(user.key , user.username).subscribe(
                //     (data)=>{
                //       this.myProjectsList = data
                //     }
                //   )
                // }else if(user.accRoles == AccountRoles.Automation_Engineer){
                //   this.db.getTechLeadProjects(user.key).subscribe(
                //     (data)=>{
                //       this.myProjectsList = data
                //     }
                //   )
                // }
            }
        });
    }
}
DevProjectsComponent.ɵfac = function DevProjectsComponent_Factory(t) { return new (t || DevProjectsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_1__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_2__.AuthApiService)); };
DevProjectsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: DevProjectsComponent, selectors: [["app-dev-projects"]], decls: 3, vars: 1, consts: [[1, "container", "mainPage", "dev-projects", "mt-4"], [1, "row"], [4, "ngFor", "ngForOf"], [1, "col-md-3"], [1, "card", "mb-5", "p-2"], [1, "pCard_header", "globalFont", "text-start"], [2, "width", "fit-content", 3, "ngClass"], [1, "text-start", "subTitel"], [3, "value"], [1, "text-end", "subTitel"], [1, "btn", "btn-sm", "detailBtn", "m-2"], [1, "globalFont", 3, "routerLink"]], template: function DevProjectsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, DevProjectsComponent_ng_container_2_Template, 20, 25, "ng-container", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.myProjectsList);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgClass, primeng_progressbar__WEBPACK_IMPORTED_MODULE_5__.ProgressBar, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.LowerCasePipe, _angular_common__WEBPACK_IMPORTED_MODULE_4__.UpperCasePipe, _angular_common__WEBPACK_IMPORTED_MODULE_4__.DecimalPipe], styles: ["a[_ngcontent-%COMP%], h1[_ngcontent-%COMP%], h2[_ngcontent-%COMP%], h3[_ngcontent-%COMP%], h4[_ngcontent-%COMP%], h5[_ngcontent-%COMP%], h6[_ngcontent-%COMP%], p[_ngcontent-%COMP%] {\n  font-family: \"Cairo\";\n  color: #fff;\n}\n\n.globalFont[_ngcontent-%COMP%] {\n  font-family: \"Cairo\";\n  font-weight: bold;\n  font-size: large;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%] {\n  width: 270px;\n  height: 299px;\n  background-color: #fff;\n  position: relative;\n  border-radius: 16px;\n  border: 0;\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  margin: auto;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .pCard_header[_ngcontent-%COMP%] {\n  margin: 10px;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  color: #fff;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .detailBtn[_ngcontent-%COMP%] {\n  background-color: #EEEBF3 !important;\n  color: #513982 !important;\n  border-radius: 8px;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .detailBtn[_ngcontent-%COMP%]:hover {\n  color: #EEEBF3 !important;\n  background-color: #513982 !important;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .subTitel[_ngcontent-%COMP%] {\n  color: #74619B;\n  font-weight: bold;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .status-input[_ngcontent-%COMP%] {\n  min-width: 109px;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .bg-soft-success[_ngcontent-%COMP%] {\n  background-color: #E3FCEF !important;\n  color: #36B37E !important;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]     .p-progressbar .p-progressbar-value {\n  background: #f7be47;\n  background: linear-gradient(90deg, #f7be47 0%, #ae63d4 100%);\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]     .p-progressbar-determinate .p-progressbar-label, .dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]    .p-multiselect-header {\n  display: none !important;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]     p-dropdown.ng-dirty.ng-invalid > .p-dropdown {\n  border-color: #ced4da;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]     .p-dropdown, .dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]     .p-calendar, .dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]     .p-multiselect {\n  min-width: 100% !important;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]     .p-inputtext {\n  border-right: 0;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]     .p-inputtext:hover {\n  border-color: #ced4da !important;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]     .p-calendar-w-btn .p-datepicker-trigger {\n  background-color: white;\n  border-left: 0 !important;\n  border-color: #ced4da;\n  color: #513982;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]     .p-calendar-w-btn .p-datepicker-trigger:hover {\n  background-color: white;\n  color: #513982;\n  border-color: #ced4da;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]     .p-calendar-w-btn .p-datepicker-trigger .pi-calendar {\n  color: #513982;\n}\n\n.dev-projects[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-right: 50px;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  background-color: #f4831f;\n  color: #fff;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .category_header[_ngcontent-%COMP%] {\n  width: -moz-fit-content;\n  width: fit-content;\n  color: #100f0f;\n  margin-bottom: 10px;\n  font-size: 40px;\n  font-weight: bold;\n}\n\n.dev-projects[_ngcontent-%COMP%]   .hrLine[_ngcontent-%COMP%] {\n  height: 2px;\n  width: 100%;\n  background-color: #513982;\n  margin: 5px;\n  margin-bottom: 30px;\n}\n\n@media (max-width: 768px) {\n  .mainPage[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldi1wcm9qZWN0cy5jb21wb25lbnQuc2NzcyIsIi4uXFwuLlxcLi5cXC4uXFxfY29sb3JzLnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXEZHUyUyMFRhc2slMjBNYW5hZ2VtZW50JTIwU3lzdGVtXFxmZ3N0bV91aVxcc3JjXFxhcHBcXGNvbXBvbmVudHNcXGRldlxcY29tcG9uZW50c1xcZGV2LXByb2plY3RzXFxkZXYtcHJvamVjdHMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7Ozs7O0VBUUksb0JDRWE7RURBYixXQUFBO0FFREo7O0FGSUE7RUFDSSxvQkNKYTtFRE1iLGlCQUFBO0VBQ0EsZ0JBQUE7QUVGSjs7QUZRQTtFQUdJLFlBQUE7RUFDQSxhQUFBO0VBRUEsc0JBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsOEJBQUE7RUFDQSxZQUFBO0FFUko7O0FGK0JJO0VBRUksWUFBQTtBRTlCUjs7QUZpQ0k7RUFDSSxXQUFBO0FFL0JSOztBRmlDSTtFQUNJLG9DQUFBO0VBQ0EseUJBQUE7RUFDQSxrQkFBQTtBRS9CUjs7QUZnQ1E7RUFDSSx5QkFBQTtFQUNBLG9DQUFBO0FFOUJaOztBRmtDSTtFQUNJLGNDL0VPO0VEZ0ZQLGlCQUFBO0FFaENSOztBRmtDSTtFQUNJLGdCQUFBO0FFaENSOztBRmtDSTtFQUNJLG9DQUFBO0VBQ0EseUJBQUE7QUVoQ1I7O0FGa0NJO0VBR0EsbUJBQUE7RUFDQSw0REFBQTtBRWxDSjs7QUZ1Q0k7O0VBRUEsd0JBQUE7QUVyQ0o7O0FGdUNJO0VBQ0kscUJBQUE7QUVyQ1I7O0FGd0NJO0VBQ0ksMEJBQUE7QUV0Q1I7O0FGeUNJO0VBQ0EsZUFBQTtBRXZDSjs7QUZ3Q0k7RUFDSSxnQ0FBQTtBRXRDUjs7QUZ5Q0k7RUFDSSx1QkFBQTtFQUNBLHlCQUFBO0VBQ0EscUJBQUE7RUFDQSxjQ3pIUTtBQ2tGaEI7O0FGeUNRO0VBQ0EsdUJBQUE7RUFDQSxjQzdIUTtFRDhIUixxQkFBQTtBRXZDUjs7QUYwQ1E7RUFDSSxjQ2xJSTtBQzBGaEI7O0FGNkNBO0VBQ0ksa0JBQUE7QUUzQ0o7O0FGOENBO0VBQ0kseUJDdkl1QjtFRHdJdkIsV0FBQTtBRTVDSjs7QUYrQ0E7RUFDSSx1QkFBQTtFQUFBLGtCQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0FFN0NKOztBRmdEQTtFQUNJLFdBQUE7RUFDQSxXQUFBO0VBQ0EseUJDM0pZO0VENEpaLFdBQUE7RUFDQSxtQkFBQTtBRTlDSjs7QUZpREE7RUFDSTtJQUNJLFdBQUE7RUU5Q047QUFDRiIsImZpbGUiOiJkZXYtcHJvamVjdHMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi9jb2xvcnMnO1xyXG5hLFxyXG5oMSxcclxuaDIsXHJcbmgzLFxyXG5oNCxcclxuaDUsXHJcbmg2LFxyXG5wIHtcclxuICAgIGZvbnQtZmFtaWx5OiAkbWFpbkZvbnRGYW1pbHk7XHJcbiAgICAvLyBmb250LWZhbWlseTogJ0xhdG8nLCBzYW5zLXNlcmlmICFpbXBvcnRhbnQ7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxufVxyXG5cclxuLmdsb2JhbEZvbnQge1xyXG4gICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxuICAgIC8vIGZvbnQtZmFtaWx5OiAnTGF0bycsIHNhbnMtc2VyaWYgIWltcG9ydGFudDtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgZm9udC1zaXplOiBsYXJnZTtcclxufVxyXG4uZGV2LXByb2plY3Rze1xyXG5cclxuXHJcblxyXG4uY2FyZCB7XHJcbiAgICAvLyB3aWR0aDogMjIwcHg7XHJcbiAgICAvLyBoZWlnaHQ6IDIyMHB4O1xyXG4gICAgd2lkdGg6IDI3MHB4O1xyXG4gICAgaGVpZ2h0OiAyOTlweDtcclxuICAgIC8vIGJveC1zaGFkb3c6IDNweCA1cHggMTBweCAwIHJnYmEoMCwgMCwgMCwgMC4xNik7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcclxuICAgIGJvcmRlcjogMDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgbWFyZ2luOiBhdXRvO1xyXG4gICAgLy8gIDo6YWZ0ZXIge1xyXG4gICAgLy8gICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAvLyAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgLy8gICAgIGJvdHRvbTogMHB4O1xyXG4gICAgLy8gICAgIGxlZnQ6IDEwcHg7XHJcbiAgICAvLyAgICAgd2lkdGg6IDIyMHB4O1xyXG4gICAgLy8gICAgIGhlaWdodDogMjIwcHg7XHJcbiAgICAvLyAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICAgIC8vICAgICBib3JkZXI6IDJweCBzb2xpZCAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICAvLyAgICAgei1pbmRleDogLTE7XHJcbiAgICAvLyB9XHJcbiAgICAvLyAgOjpiZWZvcmUge1xyXG4gICAgLy8gICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAvLyAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgLy8gICAgIHRvcDogMTBweDtcclxuICAgIC8vICAgICByaWdodDogMTBweDtcclxuICAgIC8vICAgICB3aWR0aDogMjIwcHg7XHJcbiAgICAvLyAgICAgaGVpZ2h0OiAyMjBweDtcclxuICAgIC8vICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gICAgLy8gICAgIGJvcmRlcjogMnB4IHNvbGlkICRtYWluVGhlbWVDb2xvcjtcclxuICAgIC8vICAgICB6LWluZGV4OiAtMTtcclxuICAgIC8vIH1cclxuICAgIC5wQ2FyZF9oZWFkZXIge1xyXG4gICAgICAgIC8vIHBhZGRpbmc6IDE1cHg7XHJcbiAgICAgICAgbWFyZ2luOiAxMHB4O1xyXG4gICAgICAgIC8vIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICB9XHJcbiAgICAuYnRuIHtcclxuICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgIH1cclxuICAgIC5kZXRhaWxCdG57XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHNvZnRUaGVtZUNvbG9yICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgY29sb3I6ICRtYWluVGhlbWVDb2xvciAhaW1wb3J0YW50O1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgICAgICAmOmhvdmVye1xyXG4gICAgICAgICAgICBjb2xvcjogJHNvZnRUaGVtZUNvbG9yICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRtYWluVGhlbWVDb2xvciAhaW1wb3J0YW50OyAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC5zdWJUaXRlbHtcclxuICAgICAgICBjb2xvcjogJHN1YlRoZW1lQ29sb3I7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICB9XHJcbiAgICAuc3RhdHVzLWlucHV0e1xyXG4gICAgICAgIG1pbi13aWR0aDogMTA5cHg7XHJcbiAgICB9XHJcbiAgICAuYmctc29mdC1zdWNjZXNze1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6I0UzRkNFRiFpbXBvcnRhbnQ7XHJcbiAgICAgICAgY29sb3I6ICMzNkIzN0UgIWltcG9ydGFudDtcclxuICAgIH1cclxuICAgIDo6bmctZGVlcCAucC1wcm9ncmVzc2JhciAucC1wcm9ncmVzc2Jhci12YWx1ZSB7XHJcbiAgICBcclxuICAgIC8vIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNGN0JFNDcgNDAlLCAjQUU2M0Q0IDYwJSkgIWltcG9ydGFudDtcclxuICAgIGJhY2tncm91bmQ6IHJnYigyNDcsMTkwLDcxKTtcclxuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNDcsMTkwLDcxLDEpIDAlLCByZ2JhKDE3NCw5OSwyMTIsMSkgMTAwJSk7XHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICB9XHJcbiAgICA6Om5nLWRlZXAgLnAtcHJvZ3Jlc3NiYXItZGV0ZXJtaW5hdGUgLnAtcHJvZ3Jlc3NiYXItbGFiZWxcclxuICAgICw6Om5nLWRlZXAucC1tdWx0aXNlbGVjdC1oZWFkZXJcdHtcclxuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgIH1cclxuICAgIDo6bmctZGVlcCBwLWRyb3Bkb3duLm5nLWRpcnR5Lm5nLWludmFsaWQgPiAucC1kcm9wZG93biB7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiAjY2VkNGRhO1xyXG4gICAgICAgIC8vIG1pbi13aWR0aDogMTAwJTtcclxuICAgIH1cclxuICAgIDo6bmctZGVlcCAucC1kcm9wZG93biAsIDo6bmctZGVlcCAucC1jYWxlbmRhciAsOjpuZy1kZWVwIC5wLW11bHRpc2VsZWN0IHtcclxuICAgICAgICBtaW4td2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICAgIFxyXG4gICAgfVxyXG4gICAgOjpuZy1kZWVwIC5wLWlucHV0dGV4dHtcclxuICAgIGJvcmRlci1yaWdodDogMDtcclxuICAgICY6aG92ZXJ7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiAjY2VkNGRhICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgOjpuZy1kZWVwIC5wLWNhbGVuZGFyLXctYnRuIC5wLWRhdGVwaWNrZXItdHJpZ2dlcntcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsgXHJcbiAgICAgICAgYm9yZGVyLWxlZnQ6IDAgIWltcG9ydGFudDtcclxuICAgICAgICBib3JkZXItY29sb3I6ICNjZWQ0ZGE7XHJcbiAgICAgICAgY29sb3I6JG1haW5UaGVtZUNvbG9yO1xyXG4gICAgXHJcbiAgICAgICAgJjpob3ZlcntcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsgXHJcbiAgICAgICAgY29sb3I6JG1haW5UaGVtZUNvbG9yO1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogI2NlZDRkYTtcclxuICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAucGktY2FsZW5kYXJ7XHJcbiAgICAgICAgICAgIGNvbG9yOiRtYWluVGhlbWVDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbnNwYW4ge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiA1MHB4O1xyXG59XHJcblxyXG4uYnRuIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbn1cclxuXHJcbi5jYXRlZ29yeV9oZWFkZXIge1xyXG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgY29sb3I6ICMxMDBmMGY7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gICAgZm9udC1zaXplOiA0MHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbn1cclxuXHJcbi5ockxpbmUge1xyXG4gICAgaGVpZ2h0OiAycHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgIG1hcmdpbjogNXB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMzBweDtcclxufVxyXG59XHJcbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xyXG4gICAgLm1haW5QYWdlIHtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgIH1cclxufSIsIiRtYWluVGhlbWVDb2xvcjojNTEzOTgyO1xyXG4kc3ViVGhlbWVDb2xvcjojNzQ2MTlCO1xyXG4kc3ViU3ViVGhlbWVDb2xvcjojOTc4OEI0O1xyXG4kc29mdFRoZW1lQ29sb3I6I0VFRUJGMztcclxuJGJvcmRlckNvbG9yOiNDQkM0REE7XHJcbiRidXR0b25NYWluQmFja2dyb3VuZENvbG9yOiNmNDgzMWY7IC8vI0Y1ODIxRjtcclxuJGJ1dHRvblN1YkJhY2tncm91bmRDb2xvcjojRkZBQjAwOyAvLyNGNTgyMUY7XHJcbiRidXR0b25TdWJTdWJCYWNrZ3JvdW5kQ29sb3I6I0ZFN0UxNTsgLy8jRjU4MjFGO1xyXG4kc2Vjb25kRm9udENvbG9yOiM3MDcwNzA7XHJcbiRncmF5QmFja0dyb3VuZENvbG9yOiNGNkY3Rjg7XHJcbiR3aGl0ZUNvbG9yOiNmZmY7XHJcbiRtYWluRm9udEZhbWlseTogJ0NhaXJvJztcclxuJHNvZnRHcmF5QmFja0dyb3VuZENvbG9yOiNGQ0ZDRkM7XHJcbiRiZ0xpZ2h0OiNGQUZCRkM7XHJcbiR0YWJCYWNrR3JvdW5kOiNmMWVjZjA7IiwiYSxcbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNixcbnAge1xuICBmb250LWZhbWlseTogXCJDYWlyb1wiO1xuICBjb2xvcjogI2ZmZjtcbn1cblxuLmdsb2JhbEZvbnQge1xuICBmb250LWZhbWlseTogXCJDYWlyb1wiO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zaXplOiBsYXJnZTtcbn1cblxuLmRldi1wcm9qZWN0cyAuY2FyZCB7XG4gIHdpZHRoOiAyNzBweDtcbiAgaGVpZ2h0OiAyOTlweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICBib3JkZXI6IDA7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBtYXJnaW46IGF1dG87XG59XG4uZGV2LXByb2plY3RzIC5jYXJkIC5wQ2FyZF9oZWFkZXIge1xuICBtYXJnaW46IDEwcHg7XG59XG4uZGV2LXByb2plY3RzIC5jYXJkIC5idG4ge1xuICBjb2xvcjogI2ZmZjtcbn1cbi5kZXYtcHJvamVjdHMgLmNhcmQgLmRldGFpbEJ0biB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNFRUVCRjMgIWltcG9ydGFudDtcbiAgY29sb3I6ICM1MTM5ODIgIWltcG9ydGFudDtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xufVxuLmRldi1wcm9qZWN0cyAuY2FyZCAuZGV0YWlsQnRuOmhvdmVyIHtcbiAgY29sb3I6ICNFRUVCRjMgIWltcG9ydGFudDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzUxMzk4MiAhaW1wb3J0YW50O1xufVxuLmRldi1wcm9qZWN0cyAuY2FyZCAuc3ViVGl0ZWwge1xuICBjb2xvcjogIzc0NjE5QjtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG4uZGV2LXByb2plY3RzIC5jYXJkIC5zdGF0dXMtaW5wdXQge1xuICBtaW4td2lkdGg6IDEwOXB4O1xufVxuLmRldi1wcm9qZWN0cyAuY2FyZCAuYmctc29mdC1zdWNjZXNzIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0UzRkNFRiAhaW1wb3J0YW50O1xuICBjb2xvcjogIzM2QjM3RSAhaW1wb3J0YW50O1xufVxuLmRldi1wcm9qZWN0cyAuY2FyZCA6Om5nLWRlZXAgLnAtcHJvZ3Jlc3NiYXIgLnAtcHJvZ3Jlc3NiYXItdmFsdWUge1xuICBiYWNrZ3JvdW5kOiAjZjdiZTQ3O1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICNmN2JlNDcgMCUsICNhZTYzZDQgMTAwJSk7XG59XG4uZGV2LXByb2plY3RzIC5jYXJkIDo6bmctZGVlcCAucC1wcm9ncmVzc2Jhci1kZXRlcm1pbmF0ZSAucC1wcm9ncmVzc2Jhci1sYWJlbCxcbi5kZXYtcHJvamVjdHMgLmNhcmQgOjpuZy1kZWVwLnAtbXVsdGlzZWxlY3QtaGVhZGVyIHtcbiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xufVxuLmRldi1wcm9qZWN0cyAuY2FyZCA6Om5nLWRlZXAgcC1kcm9wZG93bi5uZy1kaXJ0eS5uZy1pbnZhbGlkID4gLnAtZHJvcGRvd24ge1xuICBib3JkZXItY29sb3I6ICNjZWQ0ZGE7XG59XG4uZGV2LXByb2plY3RzIC5jYXJkIDo6bmctZGVlcCAucC1kcm9wZG93biwgLmRldi1wcm9qZWN0cyAuY2FyZCA6Om5nLWRlZXAgLnAtY2FsZW5kYXIsIC5kZXYtcHJvamVjdHMgLmNhcmQgOjpuZy1kZWVwIC5wLW11bHRpc2VsZWN0IHtcbiAgbWluLXdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XG59XG4uZGV2LXByb2plY3RzIC5jYXJkIDo6bmctZGVlcCAucC1pbnB1dHRleHQge1xuICBib3JkZXItcmlnaHQ6IDA7XG59XG4uZGV2LXByb2plY3RzIC5jYXJkIDo6bmctZGVlcCAucC1pbnB1dHRleHQ6aG92ZXIge1xuICBib3JkZXItY29sb3I6ICNjZWQ0ZGEgIWltcG9ydGFudDtcbn1cbi5kZXYtcHJvamVjdHMgLmNhcmQgOjpuZy1kZWVwIC5wLWNhbGVuZGFyLXctYnRuIC5wLWRhdGVwaWNrZXItdHJpZ2dlciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBib3JkZXItbGVmdDogMCAhaW1wb3J0YW50O1xuICBib3JkZXItY29sb3I6ICNjZWQ0ZGE7XG4gIGNvbG9yOiAjNTEzOTgyO1xufVxuLmRldi1wcm9qZWN0cyAuY2FyZCA6Om5nLWRlZXAgLnAtY2FsZW5kYXItdy1idG4gLnAtZGF0ZXBpY2tlci10cmlnZ2VyOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gIGNvbG9yOiAjNTEzOTgyO1xuICBib3JkZXItY29sb3I6ICNjZWQ0ZGE7XG59XG4uZGV2LXByb2plY3RzIC5jYXJkIDo6bmctZGVlcCAucC1jYWxlbmRhci13LWJ0biAucC1kYXRlcGlja2VyLXRyaWdnZXIgLnBpLWNhbGVuZGFyIHtcbiAgY29sb3I6ICM1MTM5ODI7XG59XG4uZGV2LXByb2plY3RzIHNwYW4ge1xuICBtYXJnaW4tcmlnaHQ6IDUwcHg7XG59XG4uZGV2LXByb2plY3RzIC5idG4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjQ4MzFmO1xuICBjb2xvcjogI2ZmZjtcbn1cbi5kZXYtcHJvamVjdHMgLmNhdGVnb3J5X2hlYWRlciB7XG4gIHdpZHRoOiBmaXQtY29udGVudDtcbiAgY29sb3I6ICMxMDBmMGY7XG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gIGZvbnQtc2l6ZTogNDBweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG4uZGV2LXByb2plY3RzIC5ockxpbmUge1xuICBoZWlnaHQ6IDJweDtcbiAgd2lkdGg6IDEwMCU7XG4gIGJhY2tncm91bmQtY29sb3I6ICM1MTM5ODI7XG4gIG1hcmdpbjogNXB4O1xuICBtYXJnaW4tYm90dG9tOiAzMHB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLm1haW5QYWdlIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxufSJdfQ== */"] });


/***/ }),

/***/ 98948:
/*!********************************************************************************!*\
  !*** ./src/app/components/dev/components/dev-reports/dev-reports.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DevReportsComponent": () => (/* binding */ DevReportsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var primeng_tabview__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/tabview */ 12050);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var _shared_pending_reports_pending_reports_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../shared/pending-reports/pending-reports.component */ 2131);
/* harmony import */ var _rejected_reports_rejected_reports_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../rejected-reports/rejected-reports.component */ 30640);
/* harmony import */ var _history_history_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../history/history.component */ 12847);







function DevReportsComponent_ng_template_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "app-pending-reports");
} }
function DevReportsComponent_ng_template_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "app-rejected-reports");
} }
function DevReportsComponent_ng_template_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "app-history");
} }
class DevReportsComponent {
    constructor(_auth) {
        this._auth = _auth;
    }
    ngOnInit() {
        this.getPermissions();
    }
    getPermissions() {
        this.userSub = this._auth.user.subscribe((data) => {
            if (!!data) {
                this.currentUser = data;
                this._auth.getNavPermsByUserID(this.currentUser.key || '').subscribe(res => {
                    if (!!res.refresh_required) {
                        res.refresh_required = false;
                        this._auth.updateNavPerms(res).finally(() => {
                            window.location.reload();
                        });
                    }
                    else {
                        this.myNavParams = res;
                        if (!this.myNavParams.open_to_work_counter) {
                            this.myNavParams.open_to_work_counter = 0;
                        }
                        if (!this.myNavParams.pendingReport) {
                            this.myNavParams.pendingReport = 0;
                        }
                        // Count Requests Section 
                        if (!this.myNavParams.pendingPublicRequest) {
                            this.myNavParams.pendingPublicRequest = 0;
                        }
                        if (!this.myNavParams.pendingIncentiveRequest) {
                            this.myNavParams.pendingIncentiveRequest = 0;
                        }
                        if (!this.myNavParams.pendingTransportationRequest) {
                            this.myNavParams.pendingTransportationRequest = 0;
                        }
                    }
                });
            }
        });
    }
}
DevReportsComponent.ɵfac = function DevReportsComponent_Factory(t) { return new (t || DevReportsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_0__.AuthApiService)); };
DevReportsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: DevReportsComponent, selectors: [["app-dev-reports"]], decls: 8, vars: 2, consts: [[1, "dev-reports"], [3, "header"], ["pTemplate", "content"], ["header", "History"]], template: function DevReportsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "p-tabView")(2, "p-tabPanel", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, DevReportsComponent_ng_template_3_Template, 1, 0, "ng-template", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "p-tabPanel", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, DevReportsComponent_ng_template_5_Template, 1, 0, "ng-template", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "p-tabPanel", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](7, DevReportsComponent_ng_template_7_Template, 1, 0, "ng-template", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate1"]("header", "Pending Reports ", !!ctx.myNavParams && ctx.myNavParams.devPendingReports && ctx.myNavParams.devPendingReports > 0 ? ctx.myNavParams.devPendingReports : "", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate1"]("header", "Rejected Reports ", !!ctx.myNavParams && ctx.myNavParams.rejectedReport && ctx.myNavParams.rejectedReport > 0 ? ctx.myNavParams.rejectedReport : "", "");
    } }, directives: [primeng_tabview__WEBPACK_IMPORTED_MODULE_5__.TabView, primeng_tabview__WEBPACK_IMPORTED_MODULE_5__.TabPanel, primeng_api__WEBPACK_IMPORTED_MODULE_6__.PrimeTemplate, _shared_pending_reports_pending_reports_component__WEBPACK_IMPORTED_MODULE_1__.PendingReportsComponent, _rejected_reports_rejected_reports_component__WEBPACK_IMPORTED_MODULE_2__.RejectedReportsComponent, _history_history_component__WEBPACK_IMPORTED_MODULE_3__.HistoryComponent], styles: [".dev-reports[_ngcontent-%COMP%]     .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {\n  background: #ffffff;\n  border-color: #513982 !important;\n  color: #513982 !important;\n  font-weight: bold;\n}\n.dev-reports[_ngcontent-%COMP%]     .p-tabview .p-tabview-nav .p-tabview-ink-bar {\n  background: #513982 !important;\n  z-index: 0;\n}\n.dev-reports[_ngcontent-%COMP%]     .p-tabview .p-tabview-nav li .p-tabview-nav-link {\n  color: #74619B !important;\n  font-weight: normal;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldi1yZXBvcnRzLmNvbXBvbmVudC5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxkZXZcXGNvbXBvbmVudHNcXGRldi1yZXBvcnRzXFxkZXYtcmVwb3J0cy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPUTtFQUNJLG1CQUFBO0VBQ0EsZ0NBQUE7RUFDQSx5QkFBQTtFQUNBLGlCQUFBO0FDTlo7QURRUTtFQUNJLDhCQUFBO0VBQ0EsVUFBQTtBQ05aO0FEU1E7RUFDRyx5QkFBQTtFQUNBLG1CQUFBO0FDUFgiLCJmaWxlIjoiZGV2LXJlcG9ydHMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi9jb2xvcnMnO1xyXG4uZGV2LXJlcG9ydHN7XHJcblxyXG5cclxuICAgIFxyXG4gICAgOjpuZy1kZWVwIC5wLXRhYnZpZXcgLnAtdGFidmlldy1uYXYge1xyXG4gICAgXHJcbiAgICAgICAgbGkucC1oaWdobGlnaHQgLnAtdGFidmlldy1uYXYtbGluayB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogJG1haW5UaGVtZUNvbG9yICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3IgIWltcG9ydGFudDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC5wLXRhYnZpZXctaW5rLWJhcntcclxuICAgICAgICAgICAgYmFja2dyb3VuZDokbWFpblRoZW1lQ29sb3IhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICB6LWluZGV4OiAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBsaSAucC10YWJ2aWV3LW5hdi1saW5re1xyXG4gICAgICAgICAgIGNvbG9yOiAkc3ViVGhlbWVDb2xvciAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgIGZvbnQtd2VpZ2h0OiBub3JtYWwgO1xyXG4gICAgICAgfVxyXG4gICAgfVxyXG59IiwiLmRldi1yZXBvcnRzIDo6bmctZGVlcCAucC10YWJ2aWV3IC5wLXRhYnZpZXctbmF2IGxpLnAtaGlnaGxpZ2h0IC5wLXRhYnZpZXctbmF2LWxpbmsge1xuICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xuICBib3JkZXItY29sb3I6ICM1MTM5ODIgIWltcG9ydGFudDtcbiAgY29sb3I6ICM1MTM5ODIgIWltcG9ydGFudDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG4uZGV2LXJlcG9ydHMgOjpuZy1kZWVwIC5wLXRhYnZpZXcgLnAtdGFidmlldy1uYXYgLnAtdGFidmlldy1pbmstYmFyIHtcbiAgYmFja2dyb3VuZDogIzUxMzk4MiAhaW1wb3J0YW50O1xuICB6LWluZGV4OiAwO1xufVxuLmRldi1yZXBvcnRzIDo6bmctZGVlcCAucC10YWJ2aWV3IC5wLXRhYnZpZXctbmF2IGxpIC5wLXRhYnZpZXctbmF2LWxpbmsge1xuICBjb2xvcjogIzc0NjE5QiAhaW1wb3J0YW50O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xufSJdfQ== */"] });


/***/ }),

/***/ 12847:
/*!************************************************************************!*\
  !*** ./src/app/components/dev/components/history/history.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HistoryComponent": () => (/* binding */ HistoryComponent)
/* harmony export */ });
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 36362);







function HistoryComponent_label_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " TOTAL WORKING HOURS ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "img", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r0.workingHoursCalculate(), " ");
} }
function HistoryComponent_div_18_div_10_ng_container_1_h5_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "h5", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Approved");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function HistoryComponent_div_18_div_10_ng_container_1_h5_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "h5", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](report_r5.report_status_name);
} }
function HistoryComponent_div_18_div_10_ng_container_1_h5_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "h5", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Rejected");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function HistoryComponent_div_18_div_10_ng_container_1_div_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("Project Name: ", report_r5.projectName, "");
} }
function HistoryComponent_div_18_div_10_ng_container_1_div_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("Process Name: ", report_r5.processName, "");
} }
function HistoryComponent_div_18_div_10_ng_container_1_div_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("Task Title: ", report_r5.taskTitle, "");
} }
function HistoryComponent_div_18_div_10_ng_container_1_div_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("Details: ", report_r5.details, "");
} }
function HistoryComponent_div_18_div_10_ng_container_1_div_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("Progress : ", report_r5.progress, "");
} }
function HistoryComponent_div_18_div_10_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 19)(2, "div", 13)(3, "div", 1)(4, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](5, HistoryComponent_div_18_div_10_ng_container_1_h5_5_Template, 2, 0, "h5", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](6, HistoryComponent_div_18_div_10_ng_container_1_h5_6_Template, 2, 1, "h5", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, HistoryComponent_div_18_div_10_ng_container_1_h5_7_Template, 2, 0, "h5", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "div", 1)(9, "div", 8)(10, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](12, HistoryComponent_div_18_div_10_ng_container_1_div_12_Template, 2, 1, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, HistoryComponent_div_18_div_10_ng_container_1_div_13_Template, 2, 1, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](14, HistoryComponent_div_18_div_10_ng_container_1_div_14_Template, 2, 1, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](15, HistoryComponent_div_18_div_10_ng_container_1_div_15_Template, 2, 1, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](18, HistoryComponent_div_18_div_10_ng_container_1_div_18_Template, 2, 1, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const report_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", report_r5.approved);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !report_r5.approved && !report_r5.rejected);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", report_r5.rejected);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("Working On : ", report_r5.time_activity_name, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !!report_r5.projectName);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !!report_r5.processName);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !!report_r5.taskTitle);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !!report_r5.details);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("Duration : ", report_r5.durationByHours, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !!report_r5.progress);
} }
function HistoryComponent_div_18_div_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, HistoryComponent_div_18_div_10_ng_container_1_Template, 19, 10, "ng-container", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r5 = ctx.$implicit;
    const day_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r4.getDate(day_r2) == report_r5.reportDate);
} }
function HistoryComponent_div_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 12)(1, "div", 13)(2, "div", 1)(3, "div", 14)(4, "h3", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](6, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "div", 16)(8, "div", 13)(9, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](10, HistoryComponent_div_18_div_10_Template, 2, 1, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()()();
} if (rf & 2) {
    const day_r2 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](6, 2, day_r2, "fullDate"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r1.myReportsList);
} }
class HistoryComponent {
    constructor(_auth, _db) {
        this._auth = _auth;
        this._db = _db;
        this.myReportsList = [];
        this.fromDate = new Date();
        this.toDate = new Date();
        this.periodDates = [];
    }
    ngOnInit() {
        this._auth.user.subscribe((user) => {
            if (!!user) {
                this.myUserKey = user.key;
            }
        });
        // this.auth.user.subscribe(
        //   (user)=>{
        //     if(!!user){
        //       this.myUserKey = user.key
        //     }
        //   }
        // )
    }
    // getMyPreviousReports(){
    //   this.myReportsList = []
    //   this.getPeriodDates()    
    //   let from = new Date(this.fromDate)
    //   let to = new Date(this.toDate)
    //   const finalFrom = `${from.getMonth() +1 }/${from.getDate()}/${from.getFullYear()}`
    //   const finalTo = `${to.getMonth() +1 }/${to.getDate()}/${to.getFullYear()}`
    //   console.log(finalFrom);
    //   console.log(finalTo);
    //   this.db.getDevReportsHistory(finalFrom, finalTo).subscribe(
    //     (reports)=>{
    //       this.myReportsList =  reports.filter(report => report.devID == this.myUserKey)
    //       console.log(this.myReportsList);
    //     }
    //   )
    // }
    getMyPreviousReports() {
        this._db.getDevDailyReport(this.myUserKey, this.fromDate, this.toDate).subscribe((reports) => {
            if (reports['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_0__.ResStatus.CRUD) {
                this.myReportsList = reports['data'];
            }
        });
    }
    getPeriodDates() {
        this.periodDates = [];
        const from = new Date(this.fromDate);
        const to = new Date(this.toDate);
        let firstday = new Date(from.getFullYear(), from.getMonth(), from.getDate());
        let lastday = new Date(to.getFullYear(), to.getMonth(), to.getDate());
        while (firstday <= lastday) {
            this.periodDates.push(new Date(firstday));
            firstday = new Date(firstday.setDate(firstday.getDate() + 1));
        }
        // for(let i in this.periodDates){
        //   // console.log(this.periodDates[i]);
        //   // this.getMyPreviousReports(this.periodDates[i])
        // }
        this.getMyPreviousReports();
    }
    getDate(date) {
        const day = `${date.getDate()}`;
        const month = `${date.getMonth() + 1}`;
        const year = date.getFullYear();
        const realDate = `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year}`;
        return realDate;
    }
    workingHoursCalculate() {
        const workingHours = [];
        this.myReportsList.map(rep => {
            if (!rep.rejected) {
                workingHours.push(rep.durationByHours);
            }
        });
        if (workingHours.length > 0) {
            return workingHours.reduce((a, b) => a + b);
        }
        else {
            return 0;
        }
    }
}
HistoryComponent.ɵfac = function HistoryComponent_Factory(t) { return new (t || HistoryComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_1__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_2__.DatabaseService)); };
HistoryComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: HistoryComponent, selectors: [["app-history"]], decls: 19, vars: 4, consts: [[1, "container"], [1, "row"], [1, "col-md-5", "mt-4"], ["for", ""], ["type", "date", 1, "form-control", "my-1", 3, "ngModel", "ngModelChange"], [1, "col-md-2", "mt-auto"], [1, "btn", 3, "click"], [4, "ngIf"], [1, "col-md-12"], [1, "tasksTable", "m-3"], ["class", "days m-2", 4, "ngFor", "ngForOf"], ["src", "../../../assets/img/working-time.svg", "alt", "working hours icon", 2, "cursor", "pointer"], [1, "days", "m-2"], [1, "container-fluid"], [1, "col-md-2", "day"], [2, "font-family", "'Cairo',sans-serif"], [1, "col-md-9", "tasks"], ["class", "col-md-3 ", "class", "report", 4, "ngFor", "ngForOf"], [1, "report"], [1, "task", "m-2", "p-2"], [1, "col-12"], ["class", "text-center", "style", "color:green;", 4, "ngIf"], ["class", "text-center", 4, "ngIf"], ["class", "text-center", "style", "color:brown;", 4, "ngIf"], [1, "working"], ["class", "working", 4, "ngIf"], [1, "text-center", 2, "color", "green"], [1, "text-center"], [1, "text-center", 2, "color", "brown"]], template: function HistoryComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "label", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "From");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "input", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function HistoryComponent_Template_input_ngModelChange_5_listener($event) { return ctx.fromDate = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 2)(7, "label", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8, "To");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "input", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function HistoryComponent_Template_input_ngModelChange_9_listener($event) { return ctx.toDate = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div", 5)(11, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function HistoryComponent_Template_button_click_11_listener() { return ctx.getPeriodDates(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12, "Get My Reports");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](14, HistoryComponent_label_14_Template, 6, 1, "label", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "div", 1)(16, "div", 8)(17, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](18, HistoryComponent_div_18_Template, 11, 5, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.fromDate);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.toDate);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.myReportsList.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.periodDates);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgModel, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_5__.NativeElementInjectorDirective, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.DatePipe], styles: [".btn[_ngcontent-%COMP%] {\n  background-color: #f4831f;\n  color: #fff;\n}\n\n.tasksTable[_ngcontent-%COMP%]   .days[_ngcontent-%COMP%] {\n  border-radius: 10px;\n  box-shadow: 0 0 5px rgba(81, 57, 130, 0.5);\n  color: #513982;\n}\n\n.task[_ngcontent-%COMP%] {\n  border-radius: 6px;\n  color: #513982;\n  box-shadow: 0 0 5px rgba(81, 57, 130, 0.5);\n}\n\n.task[_ngcontent-%COMP%]   .working[_ngcontent-%COMP%] {\n  font-family: \"Cairo\";\n}\n\n.task[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%] {\n  text-align: right;\n}\n\n.task[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]   .delete[_ngcontent-%COMP%] {\n  color: #dcdcdc !important;\n  cursor: pointer;\n}\n\n.task[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]   .edit[_ngcontent-%COMP%] {\n  color: #f4831f !important;\n  cursor: pointer;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhpc3RvcnkuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcX2NvbG9ycy5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxkZXZcXGNvbXBvbmVudHNcXGhpc3RvcnlcXGhpc3RvcnkuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFDSSx5QkNHdUI7RURGdkIsV0FBQTtBRUFKOztBRklJO0VBRUksbUJBQUE7RUFDQSwwQ0FBQTtFQUNBLGNDWFE7QUNTaEI7O0FGTUE7RUFFSSxrQkFBQTtFQUdBLGNDcEJZO0VEcUJaLDBDQUFBO0FFTko7O0FGT0k7RUFDSSxvQkNaUztBQ09qQjs7QUZRSTtFQUNJLGlCQUFBO0FFTlI7O0FGT1E7RUFDSSx5QkFBQTtFQUNBLGVBQUE7QUVMWjs7QUZPUTtFQUNJLHlCQUFBO0VBQ0EsZUFBQTtBRUxaIiwiZmlsZSI6Imhpc3RvcnkuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi9jb2xvcnMnO1xyXG4uYnRuIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbn1cclxuXHJcbi50YXNrc1RhYmxlIHtcclxuICAgIC5kYXlzIHtcclxuICAgICAgICAvLyBib3JkZXI6IHNvbGlkIDFweCAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDAgNXB4IHJnYmEoJG1haW5UaGVtZUNvbG9yLCAwLjUpO1xyXG4gICAgICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbi50YXNrIHtcclxuICAgIC8vIGJvcmRlcjogc29saWQgMXB4ICRtYWluVGhlbWVDb2xvcjtcclxuICAgIGJvcmRlci1yYWRpdXM6IDZweDtcclxuICAgIC8vIGJveC1zaGFkb3c6IDAgMCA1cHggJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgLy8gYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7IC8vcmdiYSgkY29sb3I6ICRtYWluVGhlbWVDb2xvciwgJGFscGhhOiAwLjUpOyAvLyByZ2JhKDE2NSwgNTUsIDE1NSwgMC41KSA7XHJcbiAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgYm94LXNoYWRvdzogMCAwIDVweCByZ2JhKCRtYWluVGhlbWVDb2xvciwgMC41KTtcclxuICAgIC53b3JraW5nIHtcclxuICAgICAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG4gICAgfVxyXG4gICAgLy8gZm9udC1mYW1pbHk6ICdMYXRvJywgc2Fucy1zZXJpZiAhaW1wb3J0YW50O1xyXG4gICAgLmljb24ge1xyXG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xyXG4gICAgICAgIC5kZWxldGUge1xyXG4gICAgICAgICAgICBjb2xvcjogI2RjZGNkYyAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC5lZGl0IHtcclxuICAgICAgICAgICAgY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIkbWFpblRoZW1lQ29sb3I6IzUxMzk4MjtcclxuJHN1YlRoZW1lQ29sb3I6Izc0NjE5QjtcclxuJHN1YlN1YlRoZW1lQ29sb3I6Izk3ODhCNDtcclxuJHNvZnRUaGVtZUNvbG9yOiNFRUVCRjM7XHJcbiRib3JkZXJDb2xvcjojQ0JDNERBO1xyXG4kYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjojZjQ4MzFmOyAvLyNGNTgyMUY7XHJcbiRidXR0b25TdWJCYWNrZ3JvdW5kQ29sb3I6I0ZGQUIwMDsgLy8jRjU4MjFGO1xyXG4kYnV0dG9uU3ViU3ViQmFja2dyb3VuZENvbG9yOiNGRTdFMTU7IC8vI0Y1ODIxRjtcclxuJHNlY29uZEZvbnRDb2xvcjojNzA3MDcwO1xyXG4kZ3JheUJhY2tHcm91bmRDb2xvcjojRjZGN0Y4O1xyXG4kd2hpdGVDb2xvcjojZmZmO1xyXG4kbWFpbkZvbnRGYW1pbHk6ICdDYWlybyc7XHJcbiRzb2Z0R3JheUJhY2tHcm91bmRDb2xvcjojRkNGQ0ZDO1xyXG4kYmdMaWdodDojRkFGQkZDO1xyXG4kdGFiQmFja0dyb3VuZDojZjFlY2YwOyIsIi5idG4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjQ4MzFmO1xuICBjb2xvcjogI2ZmZjtcbn1cblxuLnRhc2tzVGFibGUgLmRheXMge1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBib3gtc2hhZG93OiAwIDAgNXB4IHJnYmEoODEsIDU3LCAxMzAsIDAuNSk7XG4gIGNvbG9yOiAjNTEzOTgyO1xufVxuXG4udGFzayB7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgY29sb3I6ICM1MTM5ODI7XG4gIGJveC1zaGFkb3c6IDAgMCA1cHggcmdiYSg4MSwgNTcsIDEzMCwgMC41KTtcbn1cbi50YXNrIC53b3JraW5nIHtcbiAgZm9udC1mYW1pbHk6IFwiQ2Fpcm9cIjtcbn1cbi50YXNrIC5pY29uIHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG4udGFzayAuaWNvbiAuZGVsZXRlIHtcbiAgY29sb3I6ICNkY2RjZGMgIWltcG9ydGFudDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuLnRhc2sgLmljb24gLmVkaXQge1xuICBjb2xvcjogI2Y0ODMxZiAhaW1wb3J0YW50O1xuICBjdXJzb3I6IHBvaW50ZXI7XG59Il19 */"] });


/***/ }),

/***/ 30640:
/*!******************************************************************************************!*\
  !*** ./src/app/components/dev/components/rejected-reports/rejected-reports.component.ts ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RejectedReportsComponent": () => (/* binding */ RejectedReportsComponent)
/* harmony export */ });
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ 3191);
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/dev-daily-report */ 18754);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/environments/environment */ 92340);
/* harmony import */ var _time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../time-sheet/time-sheet.component */ 66171);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/tooltip */ 40089);
/* harmony import */ var primeng_sidebar__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/sidebar */ 49734);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/progress-bar */ 60833);


















function RejectedReportsComponent_tbody_21_ng_container_1_td_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](report_r11.projectName);
} }
function RejectedReportsComponent_tbody_21_ng_container_1_td_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function RejectedReportsComponent_tbody_21_ng_container_1_td_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](report_r11.processName);
} }
function RejectedReportsComponent_tbody_21_ng_container_1_td_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function RejectedReportsComponent_tbody_21_ng_container_1_td_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](report_r11.taskTitle);
} }
function RejectedReportsComponent_tbody_21_ng_container_1_td_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function RejectedReportsComponent_tbody_21_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "tr")(2, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](10, RejectedReportsComponent_tbody_21_ng_container_1_td_10_Template, 2, 1, "td", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](11, RejectedReportsComponent_tbody_21_ng_container_1_td_11_Template, 2, 0, "td", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](12, RejectedReportsComponent_tbody_21_ng_container_1_td_12_Template, 2, 1, "td", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](13, RejectedReportsComponent_tbody_21_ng_container_1_td_13_Template, 2, 0, "td", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](14, RejectedReportsComponent_tbody_21_ng_container_1_td_14_Template, 2, 1, "td", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](15, RejectedReportsComponent_tbody_21_ng_container_1_td_15_Template, 2, 0, "td", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](18, "td")(19, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function RejectedReportsComponent_tbody_21_ng_container_1_Template_span_click_19_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r23); const report_r11 = restoredCtx.$implicit; const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2); return ctx_r22.open("mymodal", report_r11); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](20, " edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const report_r11 = ctx.$implicit;
    const i_r12 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](i_r12 + 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](report_r11.reportDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](report_r11.durationByHours);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](report_r11.time_activity_name);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", report_r11.projectName);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !report_r11.projectName);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", report_r11.processName);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !report_r11.processName);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", report_r11.taskTitle);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !report_r11.taskTitle);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](report_r11.approvedByName);
} }
function RejectedReportsComponent_tbody_21_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, RejectedReportsComponent_tbody_21_ng_container_1_Template, 21, 11, "ng-container", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r0.myRejectedReports);
} }
function RejectedReportsComponent_option_34_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const type_r24 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("value", type_r24.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](type_r24.report_type);
} }
function RejectedReportsComponent_div_35_option_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const project_r26 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", project_r26.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](project_r26.title);
} }
function RejectedReportsComponent_div_35_Template(rf, ctx) { if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 7)(1, "label", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "Project Name?!");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "select", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function RejectedReportsComponent_div_35_Template_select_ngModelChange_3_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r28); const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r27.reportToEdit.projectID = $event; })("ngModelChange", function RejectedReportsComponent_div_35_Template_select_ngModelChange_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r28); const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r29.getProjectProcess(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](4, "option", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](5, RejectedReportsComponent_div_35_option_5_Template, 2, 2, "option", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx_r2.reportToEdit.projectID);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r2.myProjectsList);
} }
function RejectedReportsComponent_div_36_option_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const process_r31 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", process_r31.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](process_r31.title);
} }
function RejectedReportsComponent_div_36_Template(rf, ctx) { if (rf & 1) {
    const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 7)(1, "label", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "Activity Name?!");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "select", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function RejectedReportsComponent_div_36_Template_select_ngModelChange_3_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r33); const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r32.reportToEdit.processID = $event; })("ngModelChange", function RejectedReportsComponent_div_36_Template_select_ngModelChange_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r33); const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r34.getProcessTasks(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](4, "option", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](5, RejectedReportsComponent_div_36_option_5_Template, 2, 2, "option", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx_r3.reportToEdit.processID);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r3.myProcess);
} }
function RejectedReportsComponent_div_37_option_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const task_r36 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", task_r36.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](task_r36.title);
} }
function RejectedReportsComponent_div_37_Template(rf, ctx) { if (rf & 1) {
    const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 7)(1, "label", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "Task Name?!");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "select", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function RejectedReportsComponent_div_37_Template_select_ngModelChange_3_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r38); const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r37.reportToEdit.taskID = $event; })("change", function RejectedReportsComponent_div_37_Template_select_change_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r38); const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); ctx_r39.getTaskProgress(); return ctx_r39.getSelectedTask(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](4, "option", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](5, RejectedReportsComponent_div_37_option_5_Template, 2, 2, "option", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx_r4.reportToEdit.taskID);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r4.myTasksList);
} }
function RejectedReportsComponent_div_38_Template(rf, ctx) { if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 7)(1, "label", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "Duration By Hours:");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "input", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function RejectedReportsComponent_div_38_Template_input_ngModelChange_3_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r41); const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r40.reportToEdit.durationByHours = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx_r5.reportToEdit.durationByHours);
} }
function RejectedReportsComponent_div_39_Template(rf, ctx) { if (rf & 1) {
    const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 29)(1, "div", 6)(2, "div", 30)(3, "label", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4, "Your Progress (%):");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "input", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function RejectedReportsComponent_div_39_Template_input_ngModelChange_5_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r43); const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r42.reportToEdit.progress = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "div", 33)(7, "label", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](9, "mat-progress-bar", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx_r6.reportToEdit.progress);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("Your Previous Progress is: ", ctx_r6.taskTotalProgress, " % ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", ctx_r6.taskTotalProgress);
} }
function RejectedReportsComponent_div_40_option_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const senior_r45 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", senior_r45.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](senior_r45.username);
} }
function RejectedReportsComponent_div_40_Template(rf, ctx) { if (rf & 1) {
    const _r47 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 7)(1, "label", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "Senior To Approve (Optional)");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "select", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function RejectedReportsComponent_div_40_Template_select_ngModelChange_3_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r47); const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r46.reportToEdit.seniorToApproveKey = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](4, "option", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](5, RejectedReportsComponent_div_40_option_5_Template, 2, 2, "option", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx_r7.reportToEdit.seniorToApproveKey);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r7.seniors);
} }
function RejectedReportsComponent_div_41_option_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const manager_r49 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", manager_r49.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](manager_r49.username);
} }
function RejectedReportsComponent_div_41_Template(rf, ctx) { if (rf & 1) {
    const _r51 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 7)(1, "label", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "approval Manager");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "select", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function RejectedReportsComponent_div_41_Template_select_ngModelChange_3_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r51); const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r50.reportToEdit.managerApprovalKey = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](4, "option", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](5, RejectedReportsComponent_div_41_option_5_Template, 2, 2, "option", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx_r8.reportToEdit.managerApprovalKey);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r8.managers);
} }
function RejectedReportsComponent_div_42_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 7)(1, "label", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "Rejection Reason:");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "div")(4, "p", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx_r9.reportToEdit.rejectionReason, " ");
} }
class RejectedReportsComponent {
    constructor(modalService, notify, _db, _auth) {
        this.modalService = modalService;
        this.notify = notify;
        this._db = _db;
        this._auth = _auth;
        this.myRejectedReports = [];
        this.rejectedReportInEditMode = false;
        this.myReportsList = [];
        this.myTasks = [];
        this.mySupportTasks = [];
        this.managers = [];
        this.AccountPositionEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.AccountPositions;
        this.seniors = [];
        this.ActivityEnum = src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity;
        this.myProjectsList = [];
        this.myProcess = [];
        this.taskTotalProgress = 0;
        this.reportTypes = [];
        this.myTasksList = [];
        this.myProcessesList = [];
        this.displayModal = false;
        this.reportToEdit = {
            devID: '',
            devName: '',
            reportDate: new Date().toDateString(),
            durationByHours: 0,
            time_activity: src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.DAILY_TASK,
            preApprovedDuration: 0
        };
    }
    ngOnInit() {
        this._auth.user.subscribe(user => {
            this.currentUser = user;
            this.getDevREjectedReport();
            this.getDevProjectsAndProcessAndTasks();
            const userNavParamsSub = this._auth.getNavPermsByUserID(this.currentUser.key || '').subscribe(res => {
                userNavParamsSub.unsubscribe();
                res.rejectedReport = 0;
                this._auth.updateNavPerms(res);
            });
        });
    }
    getDevREjectedReport() {
        this._db.getMyRejectedReports(this.currentUser.key || '').subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                this.myRejectedReports = res['data'];
            }
        });
    }
    getReportTypes() {
        this._db.getReportTypes().subscribe(types => {
            if (types['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                this.reportTypes = types['data'];
            }
        });
    }
    // onEdit(){
    //   this.getReportTypes();
    //   this.getManagersAndSeniors();
    // }
    getProjectProcess() {
        this.myProcess = [];
        this.reportToEdit.processID = null;
        this.reportToEdit.taskID = null;
        this.myProcess = this.myProcessesList.filter(p => p.project_key == this.reportToEdit.projectID);
        for (let i in this.myProcess) {
            let ps;
            if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.DAILY_TASK) {
                ps = this.myTasks.filter(t => t.process_key == this.myProcess[i].key);
            }
            else if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.SUPPORT) {
                ps = this.mySupportTasks.filter(t => t.process_key == this.myProcess[i].key);
            }
            if (!!ps && ps.length < 1) {
                this.myProcess.splice(parseInt(i), 1);
            }
        }
    }
    getDevProjectsAndProcessAndTasks() {
        this._db.getDevTasks(this.currentUser.key || '').subscribe(data => {
            if (data['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                this.myTasks = data['data'];
                this._db.getDevSupportTasks(this.currentUser.key || '').subscribe(res => {
                    if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                        this.mySupportTasks = res['data'];
                        for (let i in res['data']) {
                            this.myTasks.push(data['data'][i]);
                        }
                    }
                });
            }
        }, (err) => console.log(err));
        this._db.getDevProjects(this.currentUser.key || '').subscribe(data => {
            if (data['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                this.myProjectsList = data['data'];
            }
        });
        this._db.getDevProcesses(this.currentUser.key || '').subscribe(data => {
            if (data['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                this.myProcessesList = data['data'];
            }
        });
    }
    editRejectedReport(report) {
        this.getReportTypes();
        this.getManagersAndSeniors();
        this.reportToEdit = report;
        this.rejectedReportInEditMode = true;
        if (this.reportToEdit.report_status_id == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.ReportStatus.Pending_On_Manager) {
            this.reportToEdit.seniorToApproveKey = null;
            this.reportToEdit.seniorToApproveName = null;
        }
        this.myProcess = [];
        this.myProcess = this.myProcessesList.filter(p => p.project_key == this.reportToEdit.projectID);
        for (let i in this.myProcess) {
            let ps;
            if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.DAILY_TASK) {
                ps = this.myTasks.filter(t => t.process_key == this.myProcess[i].key);
            }
            else if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.SUPPORT) {
                ps = this.mySupportTasks.filter(t => t.process_key == this.myProcess[i].key);
            }
            if (!!ps && ps.length < 1) {
                this.myProcess.splice(parseInt(i), 1);
            }
        }
        this.myTasksList = [];
        if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.DAILY_TASK) {
            this.myTasksList = this.myTasks.filter(t => t.process_key == this.reportToEdit.processID);
        }
        else if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.SUPPORT) {
            this.myTasksList = this.mySupportTasks.filter(t => t.process_key == this.reportToEdit.processID);
        }
        this.getSelectedTask();
        this.getTaskProgress();
        if (!this.reportToEdit.preApprovedDuration) {
            this.reportToEdit.preApprovedDuration = this.reportToEdit.durationByHours;
        }
    }
    changeDuration() {
        if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.UNPAID_VACATION || this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.OFFICIAL_VACATION) {
            const rDate = new Date(this.reportToEdit.reportDate);
            this.reportToEdit.preApprovedDuration = 6;
            // this.db.getRamadanDay(`${rDate.getMonth()+1}/${rDate.getDate()}/${rDate.getFullYear()}`).subscribe(ramadan=>{      
            //   if(ramadan.length > 0){
            //   }else{
            //     this.reportToEdit.preApprovedDuration = 8;
            //   }
            // })
        }
        else {
            this.reportToEdit.preApprovedDuration = 0;
        }
    }
    resetForm() {
        this.rejectedReportInEditMode = false;
        this.reportToEdit = {
            devID: '',
            devName: '',
            reportDate: new Date().toDateString(),
            durationByHours: 0,
            details: "",
            progress: 0,
            time_activity: src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.DAILY_TASK,
            preApprovedDuration: 0
        };
        this.notify.openSnackbar('Operation Cancelled!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Info);
    }
    getTaskProgress() {
        if (!!this.reportToEdit.taskID) {
            this._db.getTaskProgress(this.reportToEdit.taskID).subscribe(res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                    this.taskTotalProgress = res['data'];
                }
            });
        }
    }
    getTaskProgressOLd() {
        if (!this.rejectedReportInEditMode) {
            if (!!this.reportToEdit.taskID) {
                const reports = this.myReportsList.filter(report => report.taskID == this.reportToEdit.taskID);
                let allPorgress = [];
                reports.map(report => allPorgress.push(report.progress || 0));
                let progress = 0;
                if (allPorgress.length > 0) {
                    progress = allPorgress.reduce((a, b) => a + b);
                }
                else {
                    progress = 0;
                }
                return progress;
            }
            else {
                return 0;
            }
        }
        else {
            if (!!this.reportToEdit.taskID) {
                // const i = this.myReportsList.findIndex(reports => reports.key == this.reportToEdit.key)
                // this.myReportsList[i].progress = this.reportToEdit.progress
                const reports = this.myReportsList.filter(report => report.taskID == this.reportToEdit.taskID);
                let allPorgress = [];
                reports.map(report => allPorgress.push(report.progress || 0));
                let progress = 0;
                if (allPorgress.length > 0) {
                    progress = allPorgress.reduce((a, b) => a + b);
                    if (!!this.reportToEdit.progress) {
                        progress = progress + this.reportToEdit.progress;
                    }
                }
                else {
                    progress = 0;
                }
                return progress;
            }
            else {
                return 0;
            }
        }
    }
    validateReportData() {
        let invalid = false;
        if ((new Date(this.reportToEdit.reportDate).getDay() == _time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_5__.Days.Friday || new Date(this.reportToEdit.reportDate).getDay() == _time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_5__.Days.Saturday) && (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.UNPAID_VACATION || this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.OFFICIAL_VACATION || this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.IDEAL_HOURS)) {
            invalid = true;
            return this.notify.openSnackbar('You tried to fill a report on the weekend with invalid data!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
        }
        if (!!this.reportToEdit.details && this.reportToEdit.details.length <= 10 || this.reportToEdit.details == undefined) {
            invalid = true;
            return this.notify.openSnackbar('Details Is Invalid Please Enter a valid Data!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
        }
        if (this.reportToEdit.durationByHours == undefined || this.reportToEdit.durationByHours <= 0) {
            invalid = true;
            return this.notify.openSnackbar('Duration Is Invalid Please Enter a valid Data!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
        }
        if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.DAILY_TASK && this.reportToEdit.taskID == undefined) {
            invalid = true;
            return this.notify.openSnackbar('Task Is Invalid Please Enter a valid Data!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
        }
        if (this.reportToEdit.managerApprovalKey == undefined) {
            invalid = true;
            return this.notify.openSnackbar('Please Choose Approval Manager!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
        }
        if (!this.rejectedReportInEditMode) {
            if ((!!this.reportToEdit.progress && (this.taskTotalProgress + this.reportToEdit.progress > 100)) || (!!this.reportToEdit.progress && (this.reportToEdit.progress <= 0 || this.reportToEdit.progress > 100))) {
                invalid = true;
                return this.notify.openSnackbar('Your Progress Is Invalid!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
            }
        }
        else {
            if ((!!this.reportToEdit.progress && (this.taskTotalProgress > 100)) || (!!this.reportToEdit.progress && (this.reportToEdit.progress <= 0 || this.reportToEdit.progress > 100))) {
                invalid = true;
                return this.notify.openSnackbar('Your Progress Is Invalid!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
            }
        }
        if (!invalid) {
            if (this.rejectedReportInEditMode) {
                this.saveEditedReport();
            }
            else {
                // this.createreportToEdit()
            }
        }
    }
    saveEditedReport() {
        // this.reportToEdit.durationByHours = this.reportToEdit.preApprovedDuration;
        var _a, _b, _c;
        if (!!this.reportToEdit.taskID) {
            let task;
            if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.DAILY_TASK) {
                task = this.myTasks.find(task => task.key == this.reportToEdit.taskID);
            }
            else if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.SUPPORT) {
                task = this.mySupportTasks.find(task => task.key == this.reportToEdit.taskID);
            }
            this.reportToEdit.taskTitle = task === null || task === void 0 ? void 0 : task.title;
            this.reportToEdit.projectID = task === null || task === void 0 ? void 0 : task.project_key;
            this.reportToEdit.projectName = task === null || task === void 0 ? void 0 : task.project_title;
            this.reportToEdit.processID = task === null || task === void 0 ? void 0 : task.process_key;
            this.reportToEdit.processName = task === null || task === void 0 ? void 0 : task.process_title;
        }
        if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.IDEAL_HOURS) {
            if (!!this.reportToEdit.projectID) {
                this.reportToEdit.projectName = (_a = this.myProjectsList.find(project => project.key == this.reportToEdit.projectID)) === null || _a === void 0 ? void 0 : _a.title;
            }
            else {
                this.reportToEdit.projectName = src_environments_environment__WEBPACK_IMPORTED_MODULE_4__.environment.staticFGSProjectTitle;
                this.reportToEdit.projectID = src_environments_environment__WEBPACK_IMPORTED_MODULE_4__.environment.staticFGSProjectKey;
            }
        }
        if (!!this.reportToEdit.seniorToApproveKey && this.reportToEdit.seniorToApproveKey.length > 0) {
            const serName = (_b = this.seniors.find(user => this.reportToEdit.seniorToApproveKey == user.key)) === null || _b === void 0 ? void 0 : _b.username;
            if (!!serName) {
                this.reportToEdit.seniorToApproveName = serName;
            }
            this.reportToEdit.managerApprovalKey = '';
            this.reportToEdit.managerApprovalname = '';
            this.reportToEdit.report_status_id = src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.ReportStatus.Pending_On_Senior;
        }
        else {
            const manName = (_c = this.managers.find(user => this.reportToEdit.managerApprovalKey == user.key)) === null || _c === void 0 ? void 0 : _c.username;
            if (!!manName) {
                this.reportToEdit.managerApprovalname = manName;
            }
            this.reportToEdit.report_status_id = src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.ReportStatus.Pending_On_Manager;
        }
        this._db.editReport(this.reportToEdit).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                this.rejectedReportInEditMode = false;
                this.notify.openSnackbar("Report Edited Successfully!", src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Success);
                this.reportToEdit = {
                    devID: '',
                    devName: '',
                    reportDate: new Date().toDateString(),
                    durationByHours: 0,
                    details: "",
                    progress: 0,
                    time_activity: src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.DAILY_TASK,
                    preApprovedDuration: 0
                };
                this.getDevREjectedReport();
            }
            else {
                this.notify.openSnackbar("Error !", src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
            }
        }, err => {
            this.notify.openSnackbar("Error !", src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
        });
    }
    // saveEditedReport(){
    //   this.notify.openDialog(
    //     'Edit Report ?!',
    //     `Are you sure you want to edit This Report ?!`,
    //     false,
    //     "* By Editing this Report You It Will be sent again To Manager !!",
    //     true,
    //     false).subscribe(response => {
    //       if (response) {
    //         this.reportToEdit.rejected = false;
    //         if(!!this.reportToEdit.processID){
    //           this.reportToEdit.processName = this.myProcess.find(p=>p.key == this.reportToEdit.processID)?.title
    //         }
    //         if(!!this.reportToEdit.projectID){
    //           this.reportToEdit.projectName = this.myProjectsList.find(p=>p.key == this.reportToEdit.projectID)?.title
    //         }
    //         if(!!this.reportToEdit.taskID){
    //           this.reportToEdit.taskTitle = this.myTasks.find(t=>t.key == this.reportToEdit.taskID)?.title
    //         }
    //         this.reOpenReport(this.reportToEdit)
    //         this.rejectedReportInEditMode = false;
    //           // this.notify.openSnackbar("Report Edited Successfully!" , SnackBarState.Success)
    //           this.reportToEdit = {
    //             devID:'',
    //             devName:'',
    //             reportDate:new Date().toDateString(),
    //             durationByHours:0,
    //             details:"",
    //             progress:0 , 
    //             time_activity:Activity.DAILY_TASK,
    //             preApprovedDuration:0
    //         }
    //       } else {
    //         this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
    //       }
    //     });
    // }
    // reOpenReport(report:DevDailyReport){
    //   this.db.moveFromRejectedReportToPending(report).then(
    //     (data)=>{
    //       this.db.deleteRejectedDevDailyReport(report).then(
    //         ()=>{
    //           this.notify.openSnackbar("Report Edited Successfully!" , SnackBarState.Success)
    //         }
    //       ).catch(
    //         ()=>{
    //           this.notify.openSnackbar("Error !" , SnackBarState.Error)
    //         }
    //       )
    //     }
    //   ).catch(
    //     ()=>{
    //       this.notify.openSnackbar("Error !" , SnackBarState.Error)
    //     }
    //   )
    // }
    open(content, report) {
        this.displayModal = true;
        this.editRejectedReport(report);
        // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        //   this.closeResult = `Closed with: ${result}`;
        // }, (reason) => {
        //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        // });
    }
    getDismissReason(reason) {
        if (reason === _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_10__.ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_10__.ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        }
        else {
            return `with: ${reason}`;
        }
    }
    getProcessTasks() {
        this.myTasksList = [];
        this.reportToEdit.taskID = null;
        if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.DAILY_TASK) {
            this.myTasksList = this.myTasks.filter(t => t.process_key == this.reportToEdit.processID);
        }
        else if (this.reportToEdit.time_activity == src_app_interfaces_dev_daily_report__WEBPACK_IMPORTED_MODULE_1__.Activity.SUPPORT) {
            this.myTasksList = this.mySupportTasks.filter(t => t.process_key == this.reportToEdit.processID);
        }
    }
    getSelectedTask() {
        const selectedTask = this.myTasks.find(t => t.key == this.reportToEdit.taskID);
        if (!!selectedTask) {
            this.selectedTask = selectedTask;
            if (this.selectedTask.seniorToApproveID) {
                if (this.selectedTask.seniorIsMandatory) {
                    this.reportToEdit.seniorToApproveKey = this.selectedTask.seniorToApproveID;
                    this.reportToEdit.seniorToApproveName = this.selectedTask.seniorToApproveName;
                    this.seniors = this.seniors.filter(s => { var _a; return s.key == ((_a = this.selectedTask) === null || _a === void 0 ? void 0 : _a.seniorToApproveID); });
                }
                else {
                    this.seniors = this.seniors.filter(s => { var _a; return s.key == ((_a = this.selectedTask) === null || _a === void 0 ? void 0 : _a.seniorToApproveID); });
                }
            }
            else {
                this.getManagersAndSeniors();
                this.selectedTask = undefined;
                this.reportToEdit.seniorToApproveKey = null;
                this.reportToEdit.seniorToApproveName = null;
            }
        }
        else {
            this.selectedTask = undefined;
            this.reportToEdit.seniorToApproveKey = null;
            this.reportToEdit.seniorToApproveName = null;
            this.getManagersAndSeniors();
        }
    }
    getManagersAndSeniors() {
        this._auth.getUserByFilter(src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.Department.TECHNICAL_TEAM, src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.AccountRoles.Automation_Engineer, src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.AccountPositions.MANAGER).subscribe(pms => {
            if (pms['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                this.managers = pms['data'];
            }
            this._auth.getUserByFilter(src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.Department.MANAGEMENT).subscribe(managers => {
                if (managers['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                    managers['data'].map((man) => this.managers.push(man));
                }
            });
        });
        this._auth.getUserByFilter(src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.Department.TECHNICAL_TEAM, src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.AccountRoles.Automation_Engineer, src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_3__.AccountPositions.SENIOR).subscribe(sers => {
            if (sers['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_2__.ResStatus.CRUD) {
                this.seniors = sers['data'];
            }
        });
    }
}
RejectedReportsComponent.ɵfac = function RejectedReportsComponent_Factory(t) { return new (t || RejectedReportsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_10__.NgbModal), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_6__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_7__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_8__.AuthApiService)); };
RejectedReportsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({ type: RejectedReportsComponent, selectors: [["app-rejected-reports"]], decls: 51, vars: 18, consts: [[1, "table-responsive"], [1, "my-3", "table", "table-hover", "newTableCustom"], [4, "ngIf"], ["header", "", "position", "right", "styleClass", "p-sidebar-md", 2, "z-index", "2", 3, "visible", "autoZIndex", "baseZIndex", "modal", "visibleChange"], [1, "modal-body"], [1, "container"], [1, "row"], [1, "col-md-6", "my-2"], ["for", "date"], ["type", "text", "disabled", "", 1, "form-control", 3, "value"], ["for", "activity"], ["name", "activity", "id", "activity", 1, "form-control", 3, "ngModel", "ngModelChange", "change"], [3, "value", 4, "ngFor", "ngForOf"], ["class", "col-md-6 my-2", 4, "ngIf"], ["class", "col-md-12 my-2", 4, "ngIf"], [1, "col-md-12"], ["for", "dailytask"], [1, "txt"], ["name", "dailytask", "id", "dailytask", "cols", "30", "rows", "5", "placeholder", "details", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "modal-footer", "text-start"], [1, "btn", 3, "click"], [4, "ngFor", "ngForOf"], ["matTooltip", "Edit Report", "data-toggle", "modal", "data-target", "#addNewTask", 1, "material-icons", "edit", 3, "click"], [3, "value"], ["name", "dailytask", "id", "dailytask", 1, "form-control", 3, "ngModel", "ngModelChange"], ["value", ""], ["name", "dailytask", "id", "dailytask", 1, "form-control", 3, "ngModel", "ngModelChange", "change"], ["for", "duration"], ["type", "number", "name", "duration", "id", "duration", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "col-md-12", "my-2"], [1, "col-6"], ["for", "progress"], ["type", "number", "name", "progress", "min", "1", "max", "100", "maxlength", "3", "id", "progress", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "col-6", "mt-auto"], ["id", "progress", "min", "1", "max", "100", "mode", "determinate", 1, "example-margin", 3, "value"], ["for", "approval_Manager"], [1, "rejectionReason"]], template: function RejectedReportsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 0)(1, "table", 1)(2, "thead")(3, "tr")(4, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5, "#");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](7, "Date");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](9, "Duration");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](11, "Time Activity");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](12, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](13, "Project");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](15, "Process Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](17, "Task Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](18, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](19, "Rejected By");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](20, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](21, RejectedReportsComponent_tbody_21_Template, 2, 1, "tbody", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](22, "p-sidebar", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("visibleChange", function RejectedReportsComponent_Template_p_sidebar_visibleChange_22_listener($event) { return ctx.displayModal = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](23, "div", 4)(24, "div", 5)(25, "div", 6)(26, "div", 7)(27, "label", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](28, "Date");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](29, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](30, "div", 7)(31, "label", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](32, "Today Progress:");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](33, "select", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function RejectedReportsComponent_Template_select_ngModelChange_33_listener($event) { return ctx.reportToEdit.time_activity = $event; })("change", function RejectedReportsComponent_Template_select_change_33_listener() { return ctx.changeDuration(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](34, RejectedReportsComponent_option_34_Template, 2, 2, "option", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](35, RejectedReportsComponent_div_35_Template, 6, 2, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](36, RejectedReportsComponent_div_36_Template, 6, 2, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](37, RejectedReportsComponent_div_37_Template, 6, 2, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](38, RejectedReportsComponent_div_38_Template, 4, 1, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](39, RejectedReportsComponent_div_39_Template, 10, 3, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](40, RejectedReportsComponent_div_40_Template, 6, 2, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](41, RejectedReportsComponent_div_41_Template, 6, 2, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](42, RejectedReportsComponent_div_42_Template, 6, 1, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](43, "div", 15)(44, "label", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](45, "Daily Progress Summary:");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](46, "div", 17)(47, "textarea", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function RejectedReportsComponent_Template_textarea_ngModelChange_47_listener($event) { return ctx.reportToEdit.details = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](48, "div", 19)(49, "button", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function RejectedReportsComponent_Template_button_click_49_listener() { return ctx.validateReportData(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](50);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](21);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!ctx.myRejectedReports && ctx.myRejectedReports.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("visible", ctx.displayModal)("autoZIndex", false)("baseZIndex", 999999)("modal", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", ctx.reportToEdit.reportDate);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx.reportToEdit.time_activity);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx.reportTypes);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.reportToEdit.time_activity == ctx.ActivityEnum.IDEAL_HOURS || ctx.reportToEdit.time_activity == ctx.ActivityEnum.CLIENT_MEETING || ctx.reportToEdit.time_activity == ctx.ActivityEnum.DAILY_TASK || ctx.reportToEdit.time_activity == ctx.ActivityEnum.SUPPORT);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", (ctx.reportToEdit.time_activity == ctx.ActivityEnum.IDEAL_HOURS || ctx.reportToEdit.time_activity == ctx.ActivityEnum.CLIENT_MEETING || ctx.reportToEdit.time_activity == ctx.ActivityEnum.DAILY_TASK || ctx.reportToEdit.time_activity == ctx.ActivityEnum.SUPPORT) && !!ctx.reportToEdit.projectID);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", (ctx.reportToEdit.time_activity == ctx.ActivityEnum.DAILY_TASK || ctx.reportToEdit.time_activity == ctx.ActivityEnum.SUPPORT) && !!ctx.reportToEdit.processID);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.reportToEdit.time_activity != ctx.ActivityEnum.OFFICIAL_VACATION && ctx.reportToEdit.time_activity != ctx.ActivityEnum.UNPAID_VACATION);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.reportToEdit.time_activity == ctx.ActivityEnum.DAILY_TASK);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.currentUser.accPosition != ctx.AccountPositionEnum.SENIOR);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx.reportToEdit.seniorToApproveKey || ctx.reportToEdit.seniorToApproveKey.length == 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!ctx.reportToEdit.rejectionReason);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx.reportToEdit.details);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx.rejectedReportInEditMode ? "Edit" : "Add");
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgForOf, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_12__.MatTooltip, primeng_sidebar__WEBPACK_IMPORTED_MODULE_13__.Sidebar, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgModel, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_15__.NativeElementInjectorDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_14__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.MaxValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.MaxLengthValidator, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_16__.MatProgressBar], styles: [".tableCustom[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n  background-color: #f1ecf0;\n  color: #100f0f;\n  line-height: 50px;\n}\n.tableCustom[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-top: solid 2px #513982;\n  line-height: 50px;\n}\n.rejectionReason[_ngcontent-%COMP%] {\n  padding-left: 5px;\n  color: #f4831f;\n}\n.approvalBtn[_ngcontent-%COMP%] {\n  background: linear-gradient(180deg, #FFAB00 0%, #FE7E15 100%);\n  color: #fff;\n}\n.edit[_ngcontent-%COMP%] {\n  color: #f4831f;\n  cursor: pointer;\n}\n.rejectBtn[_ngcontent-%COMP%] {\n  background-color: brown;\n  color: #fff;\n}\n.modal-footer[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  background-color: #f4831f;\n  color: #fff;\n  width: 40%;\n  margin-left: auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlamVjdGVkLXJlcG9ydHMuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcX2NvbG9ycy5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxkZXZcXGNvbXBvbmVudHNcXHJlamVjdGVkLXJlcG9ydHNcXHJlamVjdGVkLXJlcG9ydHMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUk7RUFDSSx5QkNXTztFRFZQLGNBQUE7RUFDQSxpQkFBQTtBRURSO0FGSVE7RUFDSSw2QkFBQTtFQUNBLGlCQUFBO0FFRlo7QUZPQTtFQUNJLGlCQUFBO0VBQ0EsY0NadUI7QUNRM0I7QUZPQTtFQUVJLDZEQUFBO0VBRUEsV0FBQTtBRU5KO0FGV0E7RUFDSSxjQ3pCdUI7RUQwQnZCLGVBQUE7QUVSSjtBRldBO0VBQ0ksdUJBQUE7RUFDQSxXQUFBO0FFUko7QUZjSTtFQUNJLHlCQ3RDbUI7RUR1Q25CLFdBQUE7RUFDQSxVQUFBO0VBQ0EsaUJBQUE7QUVYUiIsImZpbGUiOiJyZWplY3RlZC1yZXBvcnRzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnLi4vLi4vLi4vLi4vY29sb3JzJztcclxuLnRhYmxlQ3VzdG9tIHtcclxuICAgIHRoZWFkIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGFiQmFja0dyb3VuZDtcclxuICAgICAgICBjb2xvcjogIzEwMGYwZjtcclxuICAgICAgICBsaW5lLWhlaWdodDogNTBweDtcclxuICAgIH1cclxuICAgIHRib2R5IHtcclxuICAgICAgICB0ciB7XHJcbiAgICAgICAgICAgIGJvcmRlci10b3A6IHNvbGlkIDJweCAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiA1MHB4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLnJlamVjdGlvblJlYXNvbiB7XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDVweDtcclxuICAgIGNvbG9yOiAkYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjtcclxufVxyXG5cclxuLmFwcHJvdmFsQnRuIHtcclxuICAgIC8vIGJhY2tncm91bmQtY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDE4MGRlZywgJGJ1dHRvblN1YkJhY2tncm91bmRDb2xvciAwJSwgJGJ1dHRvblN1YlN1YkJhY2tncm91bmRDb2xvciAxMDAlKTtcclxuXHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgIC8vIHdpZHRoOiA0MCU7XHJcbiAgICAvLyBtYXJnaW46IGF1dG87XHJcbn1cclxuXHJcbi5lZGl0IHtcclxuICAgIGNvbG9yOiAkYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLnJlamVjdEJ0biB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBicm93bjtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgLy8gd2lkdGg6IDQwJTtcclxuICAgIC8vIG1hcmdpbjogYXV0bztcclxufVxyXG5cclxuLm1vZGFsLWZvb3RlciB7XHJcbiAgICBidXR0b24ge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgICAgIHdpZHRoOiA0MCU7XHJcbiAgICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XHJcbiAgICB9XHJcbn0iLCIkbWFpblRoZW1lQ29sb3I6IzUxMzk4MjtcclxuJHN1YlRoZW1lQ29sb3I6Izc0NjE5QjtcclxuJHN1YlN1YlRoZW1lQ29sb3I6Izk3ODhCNDtcclxuJHNvZnRUaGVtZUNvbG9yOiNFRUVCRjM7XHJcbiRib3JkZXJDb2xvcjojQ0JDNERBO1xyXG4kYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjojZjQ4MzFmOyAvLyNGNTgyMUY7XHJcbiRidXR0b25TdWJCYWNrZ3JvdW5kQ29sb3I6I0ZGQUIwMDsgLy8jRjU4MjFGO1xyXG4kYnV0dG9uU3ViU3ViQmFja2dyb3VuZENvbG9yOiNGRTdFMTU7IC8vI0Y1ODIxRjtcclxuJHNlY29uZEZvbnRDb2xvcjojNzA3MDcwO1xyXG4kZ3JheUJhY2tHcm91bmRDb2xvcjojRjZGN0Y4O1xyXG4kd2hpdGVDb2xvcjojZmZmO1xyXG4kbWFpbkZvbnRGYW1pbHk6ICdDYWlybyc7XHJcbiRzb2Z0R3JheUJhY2tHcm91bmRDb2xvcjojRkNGQ0ZDO1xyXG4kYmdMaWdodDojRkFGQkZDO1xyXG4kdGFiQmFja0dyb3VuZDojZjFlY2YwOyIsIi50YWJsZUN1c3RvbSB0aGVhZCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmMWVjZjA7XG4gIGNvbG9yOiAjMTAwZjBmO1xuICBsaW5lLWhlaWdodDogNTBweDtcbn1cbi50YWJsZUN1c3RvbSB0Ym9keSB0ciB7XG4gIGJvcmRlci10b3A6IHNvbGlkIDJweCAjNTEzOTgyO1xuICBsaW5lLWhlaWdodDogNTBweDtcbn1cblxuLnJlamVjdGlvblJlYXNvbiB7XG4gIHBhZGRpbmctbGVmdDogNXB4O1xuICBjb2xvcjogI2Y0ODMxZjtcbn1cblxuLmFwcHJvdmFsQnRuIHtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDE4MGRlZywgI0ZGQUIwMCAwJSwgI0ZFN0UxNSAxMDAlKTtcbiAgY29sb3I6ICNmZmY7XG59XG5cbi5lZGl0IHtcbiAgY29sb3I6ICNmNDgzMWY7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLnJlamVjdEJ0biB7XG4gIGJhY2tncm91bmQtY29sb3I6IGJyb3duO1xuICBjb2xvcjogI2ZmZjtcbn1cblxuLm1vZGFsLWZvb3RlciBidXR0b24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjQ4MzFmO1xuICBjb2xvcjogI2ZmZjtcbiAgd2lkdGg6IDQwJTtcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XG59Il19 */"] });


/***/ }),

/***/ 63895:
/*!**************************************************************************!*\
  !*** ./src/app/components/dev/components/requests/requests.component.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RequestsComponent": () => (/* binding */ RequestsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var primeng_tabview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/tabview */ 12050);
/* harmony import */ var _public_request_public_request_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../public-request/public-request.component */ 52101);
/* harmony import */ var _transportaions_transportaions_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../transportaions/transportaions.component */ 13856);




class RequestsComponent {
    constructor() { }
    ngOnInit() {
    }
}
RequestsComponent.ɵfac = function RequestsComponent_Factory(t) { return new (t || RequestsComponent)(); };
RequestsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: RequestsComponent, selectors: [["app-requests"]], decls: 6, vars: 0, consts: [[1, "requests"], ["header", "public requests"], ["header", "Transportations"]], template: function RequestsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "p-tabView")(2, "p-tabPanel", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "app-public-request");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "p-tabPanel", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "app-transportaions");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    } }, directives: [primeng_tabview__WEBPACK_IMPORTED_MODULE_3__.TabView, primeng_tabview__WEBPACK_IMPORTED_MODULE_3__.TabPanel, _public_request_public_request_component__WEBPACK_IMPORTED_MODULE_0__.PublicRequestComponent, _transportaions_transportaions_component__WEBPACK_IMPORTED_MODULE_1__.TransportaionsComponent], styles: [".requests[_ngcontent-%COMP%]     .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {\n  background: #ffffff;\n  border-color: #513982 !important;\n  color: #513982 !important;\n  font-weight: bold;\n}\n.requests[_ngcontent-%COMP%]     .p-tabview .p-tabview-nav .p-tabview-ink-bar {\n  background: #513982 !important;\n  z-index: 0;\n}\n.requests[_ngcontent-%COMP%]     .p-tabview .p-tabview-nav li .p-tabview-nav-link {\n  color: #74619B !important;\n  font-weight: normal;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlcXVlc3RzLmNvbXBvbmVudC5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxkZXZcXGNvbXBvbmVudHNcXHJlcXVlc3RzXFxyZXF1ZXN0cy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPUTtFQUNJLG1CQUFBO0VBQ0EsZ0NBQUE7RUFDQSx5QkFBQTtFQUNBLGlCQUFBO0FDTlo7QURRUTtFQUNJLDhCQUFBO0VBQ0EsVUFBQTtBQ05aO0FEU1E7RUFDRyx5QkFBQTtFQUNBLG1CQUFBO0FDUFgiLCJmaWxlIjoicmVxdWVzdHMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi9jb2xvcnMnO1xyXG4ucmVxdWVzdHN7XHJcblxyXG5cclxuICAgIFxyXG4gICAgOjpuZy1kZWVwIC5wLXRhYnZpZXcgLnAtdGFidmlldy1uYXYge1xyXG4gICAgXHJcbiAgICAgICAgbGkucC1oaWdobGlnaHQgLnAtdGFidmlldy1uYXYtbGluayB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogJG1haW5UaGVtZUNvbG9yICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3IgIWltcG9ydGFudDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC5wLXRhYnZpZXctaW5rLWJhcntcclxuICAgICAgICAgICAgYmFja2dyb3VuZDokbWFpblRoZW1lQ29sb3IhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICB6LWluZGV4OiAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBsaSAucC10YWJ2aWV3LW5hdi1saW5re1xyXG4gICAgICAgICAgIGNvbG9yOiAkc3ViVGhlbWVDb2xvciAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgIGZvbnQtd2VpZ2h0OiBub3JtYWwgO1xyXG4gICAgICAgfVxyXG4gICAgfVxyXG59IiwiLnJlcXVlc3RzIDo6bmctZGVlcCAucC10YWJ2aWV3IC5wLXRhYnZpZXctbmF2IGxpLnAtaGlnaGxpZ2h0IC5wLXRhYnZpZXctbmF2LWxpbmsge1xuICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xuICBib3JkZXItY29sb3I6ICM1MTM5ODIgIWltcG9ydGFudDtcbiAgY29sb3I6ICM1MTM5ODIgIWltcG9ydGFudDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG4ucmVxdWVzdHMgOjpuZy1kZWVwIC5wLXRhYnZpZXcgLnAtdGFidmlldy1uYXYgLnAtdGFidmlldy1pbmstYmFyIHtcbiAgYmFja2dyb3VuZDogIzUxMzk4MiAhaW1wb3J0YW50O1xuICB6LWluZGV4OiAwO1xufVxuLnJlcXVlc3RzIDo6bmctZGVlcCAucC10YWJ2aWV3IC5wLXRhYnZpZXctbmF2IGxpIC5wLXRhYnZpZXctbmF2LWxpbmsge1xuICBjb2xvcjogIzc0NjE5QiAhaW1wb3J0YW50O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xufSJdfQ== */"] });


/***/ }),

/***/ 22846:
/*!******************************************************************************************************!*\
  !*** ./src/app/components/dev/components/senior-report-approval/senior-report-approval.component.ts ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SeniorReportApprovalComponent": () => (/* binding */ SeniorReportApprovalComponent)
/* harmony export */ });
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/environments/environment */ 92340);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 52816);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/messaging.service */ 64271);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/dialog */ 33489);
/* harmony import */ var primeng_tooltip__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! primeng/tooltip */ 71210);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! primeng/button */ 84633);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/tooltip */ 40089);


















function SeniorReportApprovalComponent_td_24_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, "To Approve");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function SeniorReportApprovalComponent_ng_container_27_tr_1_td_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](report_r3.projectName);
} }
function SeniorReportApprovalComponent_ng_container_27_tr_1_td_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function SeniorReportApprovalComponent_ng_container_27_tr_1_td_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](report_r3.processName);
} }
function SeniorReportApprovalComponent_ng_container_27_tr_1_td_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function SeniorReportApprovalComponent_ng_container_27_tr_1_td_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](report_r3.taskTitle);
} }
function SeniorReportApprovalComponent_ng_container_27_tr_1_td_16_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function SeniorReportApprovalComponent_ng_container_27_tr_1_td_17_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"]("", report_r3.progress, " %");
} }
function SeniorReportApprovalComponent_ng_container_27_tr_1_td_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function SeniorReportApprovalComponent_ng_container_27_tr_1_td_19_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const report_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](report_r3.managerApprovalname);
} }
function SeniorReportApprovalComponent_ng_container_27_tr_1_Template(rf, ctx) { if (rf & 1) {
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "tr")(1, "td");
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
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](9, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](11, SeniorReportApprovalComponent_ng_container_27_tr_1_td_11_Template, 2, 1, "td", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](12, SeniorReportApprovalComponent_ng_container_27_tr_1_td_12_Template, 2, 0, "td", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](13, SeniorReportApprovalComponent_ng_container_27_tr_1_td_13_Template, 2, 1, "td", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](14, SeniorReportApprovalComponent_ng_container_27_tr_1_td_14_Template, 2, 0, "td", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](15, SeniorReportApprovalComponent_ng_container_27_tr_1_td_15_Template, 2, 1, "td", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](16, SeniorReportApprovalComponent_ng_container_27_tr_1_td_16_Template, 2, 0, "td", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](17, SeniorReportApprovalComponent_ng_container_27_tr_1_td_17_Template, 2, 1, "td", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](18, SeniorReportApprovalComponent_ng_container_27_tr_1_td_18_Template, 2, 0, "td", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](19, SeniorReportApprovalComponent_ng_container_27_tr_1_td_19_Template, 2, 1, "td", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](20, "td")(21, "button", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function SeniorReportApprovalComponent_ng_container_27_tr_1_Template_button_click_21_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r22); const report_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit; const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](); return ctx_r20.openApproveDialog(report_r3); });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](22, "Review");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    const i_r4 = ctx_r23.index;
    const report_r3 = ctx_r23.$implicit;
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](i_r4 + 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](report_r3.devName);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](report_r3.reportDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](report_r3.preApprovedDuration);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](report_r3.time_activity_name);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", report_r3.projectName);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !report_r3.projectName);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", report_r3.processName);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !report_r3.processName);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", report_r3.taskTitle);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !report_r3.taskTitle);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", report_r3.progress);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !report_r3.progress);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !!ctx_r5.currentUser && ctx_r5.currentUser.department == ctx_r5.DepartmentEnum.MANAGEMENT && ctx_r5.allReports);
} }
function SeniorReportApprovalComponent_ng_container_27_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, SeniorReportApprovalComponent_ng_container_27_tr_1_Template, 23, 14, "tr", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const report_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !report_r3.rejected == true);
} }
function SeniorReportApprovalComponent_p_dialog_28_img_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "img", 35);
} if (rf & 2) {
    const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpropertyInterpolate2"]("src", "", ctx_r24.newServerApi, "", ctx_r24.reportToApprove.devImgURL, "", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsanitizeUrl"]);
} }
function SeniorReportApprovalComponent_p_dialog_28_img_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "img", 36);
} }
function SeniorReportApprovalComponent_p_dialog_28_option_71_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "option", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const man_r28 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("value", man_r28.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](man_r28.username);
} }
function SeniorReportApprovalComponent_p_dialog_28_ng_template_83_Template(rf, ctx) { if (rf & 1) {
    const _r30 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "p-button", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function SeniorReportApprovalComponent_p_dialog_28_ng_template_83_Template_p_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r30); const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2); return ctx_r29.validateDecision(true); });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "p-button", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function SeniorReportApprovalComponent_p_dialog_28_ng_template_83_Template_p_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r30); const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2); return ctx_r31.validateDecision(false); });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("disabled", !ctx_r27.reportToApprove.managerApprovalKey);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("disabled", !ctx_r27.reportToApprove.rejectionReason);
} }
const _c0 = function () { return { width: "50vw" }; };
const _c1 = function () { return { "960px": "50vw", "640px": "100vw" }; };
function SeniorReportApprovalComponent_p_dialog_28_Template(rf, ctx) { if (rf & 1) {
    const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "p-dialog", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("visibleChange", function SeniorReportApprovalComponent_p_dialog_28_Template_p_dialog_visibleChange_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r33); const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](); return ctx_r32.approveReportDialog = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "div", 11)(2, "div", 12)(3, "div", 13)(4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](5, SeniorReportApprovalComponent_p_dialog_28_img_5_Template, 1, 2, "img", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](6, SeniorReportApprovalComponent_p_dialog_28_img_6_Template, 1, 0, "img", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](7, "span", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](9, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](10, "div", 13)(11, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](13, "div", 17)(14, "div", 13)(15, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](16, "i", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](17, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](19, "div", 13)(20, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](21, "i", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](22, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](24, "div", 22)(25, "span", 23)(26, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](27, " work_outline ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](28, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](29);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](30, "div", 17)(31, "div", 26)(32, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](33, " Project Name: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](34, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](35);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](36, "div", 26)(37, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](38, " Process Name: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](39, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](40);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](41, "div", 17)(42, "div", 26)(43, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](44, " Task Name: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](45, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](46);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](47, "div", 26)(48, "span", 27)(49, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](50, " Progress: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](51, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](52);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](53, "div", 17)(54, "div", 2)(55, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](56, " Details: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](57, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](58);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](59, "hr");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](60, "div", 17)(61, "div", 2)(62, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](63, " Senior Decision!! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](64, "div", 17)(65, "div", 29)(66, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](67, " Assign To Manager ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](68, "span", 28)(69, "select", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("ngModelChange", function SeniorReportApprovalComponent_p_dialog_28_Template_select_ngModelChange_69_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r33); const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](); return ctx_r34.reportToApprove.managerApprovalKey = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](70, "option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](71, SeniorReportApprovalComponent_p_dialog_28_option_71_Template, 2, 2, "option", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](72, "div", 29)(73, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](74, " Comment ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](75, "span", 28)(76, "input", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("ngModelChange", function SeniorReportApprovalComponent_p_dialog_28_Template_input_ngModelChange_76_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r33); const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](); return ctx_r35.reportToApprove.seniorDecisionComment = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](77, "div", 17)(78, "div", 2)(79, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](80, " Rejection Reason ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](81, "span", 28)(82, "input", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("ngModelChange", function SeniorReportApprovalComponent_p_dialog_28_Template_input_ngModelChange_82_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r33); const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](); return ctx_r36.reportToApprove.rejectionReason = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](83, SeniorReportApprovalComponent_p_dialog_28_ng_template_83_Template, 2, 2, "ng-template", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpureFunction0"](23, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("visible", ctx_r2.approveReportDialog)("breakpoints", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpureFunction0"](24, _c1))("modal", true)("draggable", false)("resizable", false);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx_r2.reportToApprove.devImgURL);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !ctx_r2.reportToApprove.devImgURL);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r2.reportToApprove.devName, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r2.reportToApprove.createdAt, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r2.reportToApprove.reportDate, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r2.reportToApprove.preApprovedDuration, " Hours ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r2.reportToApprove.time_activity_name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", !!ctx_r2.reportToApprove.projectName ? ctx_r2.reportToApprove.projectName : "-", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", !!ctx_r2.reportToApprove.processName ? ctx_r2.reportToApprove.processName : "-", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", !!ctx_r2.reportToApprove.taskTitle ? ctx_r2.reportToApprove.taskTitle : "-", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", !!ctx_r2.reportToApprove.progress ? ctx_r2.reportToApprove.progress : "0", " % ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ctx_r2.reportToApprove.details, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngModel", ctx_r2.reportToApprove.managerApprovalKey);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", ctx_r2.managers);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngModel", ctx_r2.reportToApprove.seniorDecisionComment);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngModel", ctx_r2.reportToApprove.rejectionReason);
} }
class SeniorReportApprovalComponent {
    constructor(_auth, _db, router, notify, _message) {
        this._auth = _auth;
        this._db = _db;
        this.router = router;
        this.notify = notify;
        this._message = _message;
        this.myReportsToApprove = [];
        this.allReports = false;
        this.approveReportDialog = false;
        this.managers = [];
        this.DepartmentEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department;
        this.newServerApi = src_environments_environment__WEBPACK_IMPORTED_MODULE_3__.environment.newServerApi;
    }
    ngOnInit() {
        this._auth.user.subscribe(user => {
            if (!user || user.accPosition != src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.AccountPositions.SENIOR) {
                console.log('Access Denied');
                this._db.createSystemLogs(`${user.username} Tried To Access Senior Report Approval Page At ${new Date().toLocaleString()}`, `${user.key} Tried To Access Senior Report Approval Page At ${new Date().toLocaleString()}`, user.key, user.username, 'Success').subscribe(res => {
                    this.router.navigate(['/']);
                }, err => {
                    this.router.navigate(['/']);
                });
            }
            else {
                this.currentUser = user;
                this.getMyReports();
            }
        });
        // this.auth.user.subscribe(user=>{
        //   if(!user || user.accPosition != AccountPositions.SENIOR){
        //     console.log('Access Denied');
        //     this.db.createSystemLog(
        //       `${user.username} Tried To Access Senior Report Approval Page At ${new Date().toLocaleString()}`,
        //       `${user.key} Tried To Access Senior Report Approval Page At ${new Date().toLocaleString()}`,
        //       user.key,
        //       user.username,
        //       'Success'
        //     ).then(()=>{
        //       this.router.navigate(['/'])          
        //     })
        //   }else{
        //     this.currentUser = user;
        //     this.getMyReports()
        //   }
        // })
    }
    getMyReports() {
        this.myReportsToApprove = [];
        this._db.getMyPendingReportsToApprove(this.currentUser.key || '').subscribe((reports) => {
            if (reports['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                this.myReportsToApprove = reports['data'].filter(r => !r.seniorDecision);
            }
        }, (err) => {
            console.log(err);
        });
    }
    openApproveDialog(report) {
        this.approveReportDialog = true;
        this.reportToApprove = report;
        this._auth.getUserByFilter(src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department.MANAGEMENT).subscribe(mans => {
            if (mans['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                this.managers = mans['data'];
                this._auth.getUserByFilter(src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department.TECHNICAL_TEAM, src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.AccountRoles.Automation_Engineer, src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.AccountPositions.MANAGER).subscribe(pms => {
                    if (pms['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                        this.managers = this.managers.concat(pms['data']);
                    }
                });
            }
        });
        // this.auth.getMymanagers().subscribe(man=>{
        //   this.managers = man;
        //   this.auth.getMyPMs().subscribe(pms=>{
        //     this.managers = this.managers.concat(pms)
        //     console.log(this.managers);
        //   })
        // })
    }
    validateDecision(decision) {
        if (decision == true) {
            if ((this.reportToApprove.durationByHours != this.reportToApprove.preApprovedDuration) && !this.reportToApprove.managerChangeDurationComment) {
                this.notify.openSnackbar('Change Duration Reason Is Required', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
            }
            else {
                this.approveReport();
                this.approveReportDialog = false;
            }
        }
        else {
            if (!this.reportToApprove.rejectionReason) {
                this.notify.openSnackbar('Rejection Reason Reason Is Required', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Error);
            }
            else {
                this.rejectReport();
                this.approveReportDialog = false;
            }
        }
    }
    approveReport() {
        var _a;
        this.reportToApprove.seniorDecision = true;
        this.reportToApprove.seniorDecisionKey = this.currentUser.key;
        this.reportToApprove.seniorDecisionName = this.currentUser.username;
        this.reportToApprove.seniorDecisionAt = new Date().toLocaleDateString();
        const manName = (_a = this.managers.find(man => man.key == this.reportToApprove.managerApprovalKey)) === null || _a === void 0 ? void 0 : _a.username;
        if (!!manName) {
            this.reportToApprove.managerApprovalname = manName;
            this._db.ReportSeniorAction(this.reportToApprove).subscribe(res => {
                if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                    const i = this.myReportsToApprove.findIndex(rep => rep.key == this.reportToApprove.key);
                    this.myReportsToApprove.splice(i, 1);
                }
                else {
                    this.notify.openSnackbar("Error, Please Contact System Adminstration", src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Warning);
                }
            }, err => {
                this.notify.openSnackbar("Error, Please Contact System Adminstration", src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Warning);
                console.log(err);
            });
        }
        else {
            this.notify.openSnackbar("Please Select Manager TO Assign", src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Warning);
        }
    }
    rejectReport() {
        this.reportToApprove.seniorDecision = false;
        this.reportToApprove.seniorDecisionKey = this.currentUser.key;
        this.reportToApprove.seniorDecisionName = this.currentUser.username;
        this.reportToApprove.seniorDecisionComment = this.reportToApprove.rejectionReason;
        this.reportToApprove.seniorDecisionAt = new Date().toLocaleDateString();
        this.reportToApprove.approved = false;
        this._db.ReportSeniorAction(this.reportToApprove).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_1__.ResStatus.CRUD) {
                const i = this.myReportsToApprove.findIndex(rep => rep.key == this.reportToApprove.key);
                this.myReportsToApprove.splice(i, 1);
            }
            else {
                this.notify.openSnackbar("Error, Please Contact System Adminstration", src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Warning);
            }
        }, err => {
            this.notify.openSnackbar("Error, Please Contact System Adminstration", src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_0__.SnackBarState.Warning);
            console.log(err);
        });
    }
    sendNotificationToDev(report) {
        const newNotification = {
            title: ` Your report ${report.approved == true ? 'Approved' : 'Reject'}`,
            body: `${this.currentUser.username} Has ${report.approved == true ? 'Approved' : 'Rejected'} Your report `,
            receverKey: report.devID,
            receverName: report.devName,
            senderKey: this.currentUser.key || "",
            senderName: this.currentUser.username,
            senderImg: this.currentUser.photoURL ? this.currentUser.photoURL : this.currentUser.gender == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Gender.MALE ? 'https://bootdey.com/img/Content/avatar/avatar7.png' : this.currentUser.gender == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Gender.FEMALE ? 'https://i2.wp.com/nofiredrills.com/wp-content/uploads/2016/10/myavatar.png?fit=400%2C400&ssl=1' : 'https://bootdey.com/img/Content/avatar/avatar7.png',
            redirection: `${report.approved == true ? '/dev/timesheet' : '/dev/rejected'}`
        };
        this._message.createnotification(newNotification);
    }
}
SeniorReportApprovalComponent.ɵfac = function SeniorReportApprovalComponent_Factory(t) { return new (t || SeniorReportApprovalComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_4__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_5__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_9__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_6__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_7__.MessagingService)); };
SeniorReportApprovalComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({ type: SeniorReportApprovalComponent, selectors: [["app-senior-report-approval"]], decls: 29, vars: 3, consts: [[1, "container-fluid"], [1, "row", "tableRow"], [1, "col-12"], [1, "my-3", "table", "table-hover", "tableCustom"], [4, "ngIf"], [4, "ngFor", "ngForOf"], ["header", "Approve Report", 3, "visible", "style", "breakpoints", "modal", "draggable", "resizable", "visibleChange", 4, "ngIf"], ["class", "details", 4, "ngIf"], [1, "btn", "approvalBtn", "mx-1", 3, "click"], [1, "details"], ["header", "Approve Report", 3, "visible", "breakpoints", "modal", "draggable", "resizable", "visibleChange"], [1, "container-fluid", "myCardStyle"], [1, "row"], [1, "col-4"], ["class", "rounded-circle p-1 cardImg", "width", "70px", "alt", "", 3, "src", 4, "ngIf"], ["class", "rounded-circle p-1 cardImg", "width", "70px", "src", "../../../../../../../assets/img/avatarman.png", "alt", "", 4, "ngIf"], [1, "empName", "ml-3"], [1, "row", "mt-3", "ml-2"], ["pTooltip", "Report Date", "tooltipPosition", "left", 1, "myLable"], [1, "pi", "pi-calendar"], ["pTooltip", "Duration", "tooltipPosition", "top", 1, "myLable"], [1, "pi", "pi-clock"], [1, "col-4", "d-flex"], ["pTooltip", "Time Activity", "tooltipPosition", "right", 1, "myLable"], [1, "material-icons-outlined"], [1, "ml-2", "mt-1"], [1, "col-6"], [1, "myLable"], [1, "ml-2"], [1, "col-lg-6"], ["name", "dailytask", "id", "dailytask", 1, "form-control", 3, "ngModel", "ngModelChange"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["required", "", "type", "text", 1, "form-control", 3, "ngModel", "ngModelChange"], ["pTemplate", "footer"], ["width", "70px", "alt", "", 1, "rounded-circle", "p-1", "cardImg", 3, "src"], ["width", "70px", "src", "../../../../../../../assets/img/avatarman.png", "alt", "", 1, "rounded-circle", "p-1", "cardImg"], [3, "value"], ["icon", "pi pi-check", "label", "Send To Manager", "styleClass", "p-button-text", 3, "disabled", "click"], ["icon", "pi pi-times", "matTooltip", "Rejection Reason Required", "label", "Reject", "styleClass", "p-button-text p-button-danger", 3, "disabled", "click"]], template: function SeniorReportApprovalComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "table", 3)(4, "thead")(5, "tr")(6, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](7, "#");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](8, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](9, "Dev Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](10, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](11, "Date");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](12, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](13, "Duration");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](14, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](15, "Time Activity");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](16, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](17, "Project Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](18, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](19, "Process Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](20, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](21, "Task Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](22, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](23, "Progress");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](24, SeniorReportApprovalComponent_td_24_Template, 2, 0, "td", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](25, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](26, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](27, SeniorReportApprovalComponent_ng_container_27_Template, 2, 1, "ng-container", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](28, SeniorReportApprovalComponent_p_dialog_28_Template, 84, 25, "p-dialog", 6);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](24);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !!ctx.currentUser && ctx.currentUser.department == ctx.DepartmentEnum.MANAGEMENT && ctx.allReports);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", ctx.myReportsToApprove);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !!ctx.reportToApprove);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgForOf, primeng_dialog__WEBPACK_IMPORTED_MODULE_11__.Dialog, primeng_tooltip__WEBPACK_IMPORTED_MODULE_12__.Tooltip, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgModel, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_14__.NativeElementInjectorDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_13__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_13__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.RequiredValidator, primeng_api__WEBPACK_IMPORTED_MODULE_15__.PrimeTemplate, primeng_button__WEBPACK_IMPORTED_MODULE_16__.Button, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltip], styles: [".tableCustom[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n  background-color: #f1ecf0;\n  color: #513982;\n  line-height: 50px;\n  font-family: \"Cairo\";\n  font-weight: 800;\n  text-align: center;\n}\n.tableCustom[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-top: solid 2px #513982;\n  line-height: 50px;\n  text-align: center;\n  font-family: \"Cairo\";\n  color: #513982;\n  font-weight: 500;\n}\n.tableCustom[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .dateStyle[_ngcontent-%COMP%], .tableCustom[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .finalTotal[_ngcontent-%COMP%] {\n  font-family: \"Cairo\";\n  font-weight: 800;\n  color: #513982;\n}\n.approvalBtn[_ngcontent-%COMP%] {\n  background-color: #513982;\n  color: #fff;\n}\n.rejectBtn[_ngcontent-%COMP%] {\n  background-color: #f4831f;\n  color: #fff;\n}\n.myReports[_ngcontent-%COMP%] {\n  background-color: #513982;\n  color: #fff;\n  border-radius: 0px !important;\n  width: 200px;\n}\n.allReports[_ngcontent-%COMP%] {\n  width: 200px;\n  background-color: #f1ecf0;\n  color: #100f0f;\n  border-radius: 0px !important;\n}\n.cardHeader[_ngcontent-%COMP%] {\n  color: #513982;\n  font-size: larger;\n  font-weight: 600;\n  font-family: \"Cairo\";\n}\n.myCardStyle[_ngcontent-%COMP%] {\n  color: #513982;\n  font-family: \"Cairo\";\n}\n.myCardStyle[_ngcontent-%COMP%]   .cardImg[_ngcontent-%COMP%] {\n  border: solid 2px #f4831f;\n}\n.myCardStyle[_ngcontent-%COMP%]   .empName[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.myCardStyle[_ngcontent-%COMP%]   .myLable[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.myCardStyle[_ngcontent-%COMP%]   .optionColor[_ngcontent-%COMP%] {\n  color: #f4831f;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlbmlvci1yZXBvcnQtYXBwcm92YWwuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcX2NvbG9ycy5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxkZXZcXGNvbXBvbmVudHNcXHNlbmlvci1yZXBvcnQtYXBwcm92YWxcXHNlbmlvci1yZXBvcnQtYXBwcm92YWwuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUk7RUFDSSx5QkNXTztFRFZQLGNDSlE7RURLUixpQkFBQTtFQUNBLG9CQ0tTO0VESlQsZ0JBQUE7RUFDQSxrQkFBQTtBRURSO0FGSVE7RUFDSSw2QkFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkNKSztFREtMLGNDaEJJO0VEaUJKLGdCQUFBO0FFRlo7QUZHWTs7RUFFSSxvQkNUQztFRFVELGdCQUFBO0VBQ0EsY0N0QkE7QUNxQmhCO0FGT0E7RUFDSSx5QkM3Qlk7RUQ4QlosV0FBQTtBRUpKO0FGT0E7RUFDSSx5QkM3QnVCO0VEOEJ2QixXQUFBO0FFSko7QUZPQTtFQUNJLHlCQ3ZDWTtFRHdDWixXQUFBO0VBQ0EsNkJBQUE7RUFDQSxZQUFBO0FFSko7QUZPQTtFQUNJLFlBQUE7RUFDQSx5QkNqQ1c7RURrQ1gsY0FBQTtFQUNBLDZCQUFBO0FFSko7QUZPQTtFQUNJLGNDckRZO0VEc0RaLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxvQkM3Q2E7QUN5Q2pCO0FGT0E7RUFDSSxjQzVEWTtFRDZEWixvQkNsRGE7QUM4Q2pCO0FGS0k7RUFDSSx5QkFBQTtBRUhSO0FGS0k7RUFDSSxnQkFBQTtBRUhSO0FGS0k7RUFDSSxnQkFBQTtBRUhSO0FGS0k7RUFDSSxjQ25FbUI7QUNnRTNCIiwiZmlsZSI6InNlbmlvci1yZXBvcnQtYXBwcm92YWwuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi9jb2xvcnMnO1xyXG4udGFibGVDdXN0b20ge1xyXG4gICAgdGhlYWQge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0YWJCYWNrR3JvdW5kO1xyXG4gICAgICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICAgICAgbGluZS1oZWlnaHQ6IDUwcHg7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxuICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIH1cclxuICAgIHRib2R5IHtcclxuICAgICAgICB0ciB7XHJcbiAgICAgICAgICAgIGJvcmRlci10b3A6IHNvbGlkIDJweCAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiA1MHB4O1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAkbWFpbkZvbnRGYW1pbHk7XHJcbiAgICAgICAgICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICAgICAgICAgIC5kYXRlU3R5bGUsXHJcbiAgICAgICAgICAgIC5maW5hbFRvdGFsIHtcclxuICAgICAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAkbWFpbkZvbnRGYW1pbHk7XHJcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgICAgICAgY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLmFwcHJvdmFsQnRuIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG59XHJcblxyXG4ucmVqZWN0QnRuIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbn1cclxuXHJcbi5teVJlcG9ydHMge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgICBib3JkZXItcmFkaXVzOiAwcHggIWltcG9ydGFudDtcclxuICAgIHdpZHRoOiAyMDBweDtcclxufVxyXG5cclxuLmFsbFJlcG9ydHMge1xyXG4gICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHRhYkJhY2tHcm91bmQ7XHJcbiAgICBjb2xvcjogIzEwMGYwZjtcclxuICAgIGJvcmRlci1yYWRpdXM6IDBweCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4uY2FyZEhlYWRlciB7XHJcbiAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgZm9udC1zaXplOiBsYXJnZXI7XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxufVxyXG5cclxuLm15Q2FyZFN0eWxlIHtcclxuICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG4gICAgLmNhcmRJbWcge1xyXG4gICAgICAgIGJvcmRlcjogc29saWQgMnB4ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgfVxyXG4gICAgLmVtcE5hbWUge1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICB9XHJcbiAgICAubXlMYWJsZSB7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIH1cclxuICAgIC5vcHRpb25Db2xvciB7XHJcbiAgICAgICAgY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgfVxyXG59IiwiJG1haW5UaGVtZUNvbG9yOiM1MTM5ODI7XHJcbiRzdWJUaGVtZUNvbG9yOiM3NDYxOUI7XHJcbiRzdWJTdWJUaGVtZUNvbG9yOiM5Nzg4QjQ7XHJcbiRzb2Z0VGhlbWVDb2xvcjojRUVFQkYzO1xyXG4kYm9yZGVyQ29sb3I6I0NCQzREQTtcclxuJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I6I2Y0ODMxZjsgLy8jRjU4MjFGO1xyXG4kYnV0dG9uU3ViQmFja2dyb3VuZENvbG9yOiNGRkFCMDA7IC8vI0Y1ODIxRjtcclxuJGJ1dHRvblN1YlN1YkJhY2tncm91bmRDb2xvcjojRkU3RTE1OyAvLyNGNTgyMUY7XHJcbiRzZWNvbmRGb250Q29sb3I6IzcwNzA3MDtcclxuJGdyYXlCYWNrR3JvdW5kQ29sb3I6I0Y2RjdGODtcclxuJHdoaXRlQ29sb3I6I2ZmZjtcclxuJG1haW5Gb250RmFtaWx5OiAnQ2Fpcm8nO1xyXG4kc29mdEdyYXlCYWNrR3JvdW5kQ29sb3I6I0ZDRkNGQztcclxuJGJnTGlnaHQ6I0ZBRkJGQztcclxuJHRhYkJhY2tHcm91bmQ6I2YxZWNmMDsiLCIudGFibGVDdXN0b20gdGhlYWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjFlY2YwO1xuICBjb2xvcjogIzUxMzk4MjtcbiAgbGluZS1oZWlnaHQ6IDUwcHg7XG4gIGZvbnQtZmFtaWx5OiBcIkNhaXJvXCI7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cbi50YWJsZUN1c3RvbSB0Ym9keSB0ciB7XG4gIGJvcmRlci10b3A6IHNvbGlkIDJweCAjNTEzOTgyO1xuICBsaW5lLWhlaWdodDogNTBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LWZhbWlseTogXCJDYWlyb1wiO1xuICBjb2xvcjogIzUxMzk4MjtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cbi50YWJsZUN1c3RvbSB0Ym9keSB0ciAuZGF0ZVN0eWxlLFxuLnRhYmxlQ3VzdG9tIHRib2R5IHRyIC5maW5hbFRvdGFsIHtcbiAgZm9udC1mYW1pbHk6IFwiQ2Fpcm9cIjtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgY29sb3I6ICM1MTM5ODI7XG59XG5cbi5hcHByb3ZhbEJ0biB7XG4gIGJhY2tncm91bmQtY29sb3I6ICM1MTM5ODI7XG4gIGNvbG9yOiAjZmZmO1xufVxuXG4ucmVqZWN0QnRuIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y0ODMxZjtcbiAgY29sb3I6ICNmZmY7XG59XG5cbi5teVJlcG9ydHMge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTEzOTgyO1xuICBjb2xvcjogI2ZmZjtcbiAgYm9yZGVyLXJhZGl1czogMHB4ICFpbXBvcnRhbnQ7XG4gIHdpZHRoOiAyMDBweDtcbn1cblxuLmFsbFJlcG9ydHMge1xuICB3aWR0aDogMjAwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmMWVjZjA7XG4gIGNvbG9yOiAjMTAwZjBmO1xuICBib3JkZXItcmFkaXVzOiAwcHggIWltcG9ydGFudDtcbn1cblxuLmNhcmRIZWFkZXIge1xuICBjb2xvcjogIzUxMzk4MjtcbiAgZm9udC1zaXplOiBsYXJnZXI7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGZvbnQtZmFtaWx5OiBcIkNhaXJvXCI7XG59XG5cbi5teUNhcmRTdHlsZSB7XG4gIGNvbG9yOiAjNTEzOTgyO1xuICBmb250LWZhbWlseTogXCJDYWlyb1wiO1xufVxuLm15Q2FyZFN0eWxlIC5jYXJkSW1nIHtcbiAgYm9yZGVyOiBzb2xpZCAycHggI2Y0ODMxZjtcbn1cbi5teUNhcmRTdHlsZSAuZW1wTmFtZSB7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG59XG4ubXlDYXJkU3R5bGUgLm15TGFibGUge1xuICBmb250LXdlaWdodDogNjAwO1xufVxuLm15Q2FyZFN0eWxlIC5vcHRpb25Db2xvciB7XG4gIGNvbG9yOiAjZjQ4MzFmO1xufSJdfQ== */"] });


/***/ }),

/***/ 13856:
/*!**************************************************************************************!*\
  !*** ./src/app/components/dev/components/transportaions/transportaions.component.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TransportaionsComponent": () => (/* binding */ TransportaionsComponent)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/animations */ 31631);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var src_app_interfaces_transportations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/interfaces/transportations */ 33595);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/interfaces/res-status */ 24557);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var src_app_services_database_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/database.service */ 54382);
/* harmony import */ var src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/auth-api.service */ 893);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var primeng_sidebar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/sidebar */ 49734);
/* harmony import */ var _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../shared/form-input/form-input.component */ 37604);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/select */ 91434);
/* harmony import */ var ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-intl-tel-input */ 68831);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/core */ 88133);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/form-field */ 44770);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/table */ 97217);



















function TransportaionsComponent_mat_option_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "mat-option", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const manager_r22 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("value", manager_r22.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](manager_r22.username);
} }
function TransportaionsComponent_div_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 37)(1, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2, "Manager To Approve Is Required");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
} }
function TransportaionsComponent_mat_option_25_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "mat-option", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const project_r23 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("value", project_r23.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](project_r23.title);
} }
function TransportaionsComponent_div_26_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 37)(1, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2, " Project Is Required");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
} }
function TransportaionsComponent_mat_option_31_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "mat-option", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const process_r24 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("value", process_r24.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](process_r24.title);
} }
function TransportaionsComponent_div_32_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Process Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function TransportaionsComponent_th_52_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function TransportaionsComponent_td_53_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r25 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind2"](2, 1, request_r25.date, "dd MMM, yyyy"), " ");
} }
function TransportaionsComponent_th_55_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " From ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function TransportaionsComponent_td_56_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r26 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r26.fromLocation, " ");
} }
function TransportaionsComponent_th_58_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " To ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function TransportaionsComponent_td_59_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r27 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r27.toLocation, " ");
} }
function TransportaionsComponent_th_61_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Purpose ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function TransportaionsComponent_td_62_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r28 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r28.purpose, " ");
} }
function TransportaionsComponent_th_64_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Project ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function TransportaionsComponent_td_65_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r29 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r29.projectName, " ");
} }
function TransportaionsComponent_th_67_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Amount ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function TransportaionsComponent_td_68_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r30 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r30.amountByEGP, " ");
} }
function TransportaionsComponent_th_70_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " Status ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} }
function TransportaionsComponent_td_71_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
} if (rf & 2) {
    const request_r31 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", request_r31.trans_status_name, " ");
} }
function TransportaionsComponent_tr_72_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "tr", 40);
} }
function TransportaionsComponent_tr_73_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "tr", 41);
} }
const _c0 = function (a0) { return { "is-invalid": a0 }; };
class TransportaionsComponent {
    // excelFile:File;
    // excelUrl:string = '';
    // uploadProgress:number;
    constructor(_db, _auth, _notify) {
        this._db = _db;
        this._auth = _auth;
        this._notify = _notify;
        this.isNewTransIsopened = false;
        this.allPmsAndManagers = [];
        this.myProjects = [];
        this.displayedColumns = ['Date', 'From', 'To', 'Purpose', 'Project', 'Amount', 'Status'];
        this.myRequests = [];
        this.myProcess = [];
    }
    ngOnInit() {
        this._auth.user.subscribe(user => {
            this.currentLoggedInUser = user;
            // this._db.getMyTransportationsFromPending(this.currentLoggedInUser.key|| '').subscribe(transportations=>{
            //   if(transportations['status'] == ResStatus.CRUD){
            //     this.myRequests = transportations['data'];
            //   }
            // })
            this.getMyTransportation();
            this._db.getDevProjects(this.currentLoggedInUser.key || '').subscribe(projects => {
                if (projects['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_3__.ResStatus.CRUD) {
                    this.myProjects = projects['data'];
                }
            });
        });
        this._auth.getUserByFilter(src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department.TECHNICAL_TEAM, src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.AccountRoles.Automation_Engineer, src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.AccountPositions.MANAGER).subscribe(pms => {
            if (pms['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_3__.ResStatus.CRUD) {
                this.allPmsAndManagers = pms['data'];
            }
            this._auth.getUserByFilter(src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_1__.Department.MANAGEMENT).subscribe(managers => {
                if (managers['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_3__.ResStatus.CRUD) {
                    managers['data'].map((man) => this.allPmsAndManagers.push(man));
                }
            });
        });
        // const getCurrentUserSubscription:Subscription = this.auth.user.subscribe(
        //   (user)=>{
        //     getCurrentUserSubscription.unsubscribe()
        //     this.currentLoggedInUser = user;
        //     this.db.getMyTransportationsFromPending(this.currentLoggedInUser.key|| '').subscribe(
        //       (transportations)=>{
        //         this.myRequests = [];
        //         this.myRequests = transportations;
        //         console.log(transportations);
        //         this.db.getMyTransportationsFromFinished(this.currentLoggedInUser.key|| '').subscribe(
        //           (trans)=>{
        //             this.myRequests = this.myRequests.concat(trans)
        //           }
        //         )
        //       }
        //     )
        //     this.db.getDevProjects(this.currentLoggedInUser.key || '' , this.currentLoggedInUser.username).subscribe(
        //       (projects)=>{
        //         this.myProjects = projects;
        //       }
        //     )
        //   }
        // )
        // const getPMSSubscription:Subscription = this.auth.getMyPMs().subscribe(
        //   (pms)=>{
        //     getPMSSubscription.unsubscribe();
        //     this.allPmsAndManagers = pms;
        //     const getManagersSubscription:Subscription = this.auth.getMymanagers().subscribe(
        //       (managers)=>{
        //         getManagersSubscription.unsubscribe();
        //         managers.map((man)=>{
        //           if(man.key != 'jjuyajnYK6clqnD7PIMEuQesyiy2'){
        //             this.allPmsAndManagers.push(man)
        //           }
        //         });
        //       }
        //     )
        //   }
        // )
        this.newTransRequestForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormGroup({
            'date': new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.Validators.required),
            'from': new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.Validators.required),
            'to': new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.Validators.required),
            'purpose': new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.Validators.required),
            'amountByEGP': new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.Validators.required),
            'pmToApproveKey': new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.Validators.required),
            'projectkey': new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.Validators.required),
            'processkey': new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.Validators.required),
            'comment': new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null)
        });
    }
    getMyTransportation() {
        this._db.getMyTransportations(this.currentLoggedInUser.key || '').subscribe(transportations => {
            if (transportations['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_3__.ResStatus.CRUD) {
                this.myRequests = transportations['data'];
                // console.log(this.myRequests);
            }
        });
    }
    createTransRequest() {
        var _a, _b, _c;
        const managerName = (_a = this.allPmsAndManagers.find(man => { var _a; return man.key == ((_a = this.newTransRequestForm.get(['pmToApproveKey'])) === null || _a === void 0 ? void 0 : _a.value); })) === null || _a === void 0 ? void 0 : _a.username;
        const newRequest = {
            date: this.newTransRequestForm.value['date'],
            fromLocation: this.newTransRequestForm.value['from'],
            toLocation: this.newTransRequestForm.value['to'],
            purpose: this.newTransRequestForm.value['purpose'],
            amountByEGP: this.newTransRequestForm.value['amountByEGP'],
            empKey: this.currentLoggedInUser.key || '',
            empName: this.currentLoggedInUser.username,
            empImgUrl: this.currentLoggedInUser.photoURL || '',
            pmToApproveKey: this.newTransRequestForm.value['pmToApproveKey'],
            pmToApproveName: managerName || '',
            finalStatus: src_app_interfaces_transportations__WEBPACK_IMPORTED_MODULE_0__.transportaionFinalStatus.Pending
        };
        if (!!this.newTransRequestForm.value['projectkey']) {
            newRequest.projectKey = this.newTransRequestForm.value['projectkey'];
            newRequest.projectName = (_b = this.myProjects.find(pro => pro.key == this.newTransRequestForm.value['projectkey'])) === null || _b === void 0 ? void 0 : _b.title;
        }
        if (!!this.newTransRequestForm.value['processkey']) {
            newRequest.processKey = this.newTransRequestForm.value['processkey'];
            newRequest.processName = (_c = this.myProcess.find(pro => pro.key == this.newTransRequestForm.value['processkey'])) === null || _c === void 0 ? void 0 : _c.title;
        }
        if (!!this.newTransRequestForm.value['comment']) {
            newRequest.comment = this.newTransRequestForm.value['comment'];
        }
        this._db.createtransportationRequest(newRequest).subscribe(res => {
            if (res['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_3__.ResStatus.CRUD) {
                this.newTransRequestForm.reset();
                this.isNewTransIsopened = false;
                this._notify.openSnackbar('Your Request Sent Successfully', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_2__.SnackBarState.Success);
                this.getMyTransportation();
            }
            else {
                this._notify.openSnackbar(`Error, ${JSON.stringify(res['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_2__.SnackBarState.Warning);
                this._db.createSystemLogs(`${this.currentLoggedInUser.username} Has Error ${JSON.stringify(res['data'])} while creating his Transportation Request ${JSON.stringify(newRequest)}`, `${this.currentLoggedInUser.key} Has Error while creating his report`, this.currentLoggedInUser.key || '', this.currentLoggedInUser.username, 'Faild').subscribe();
            }
        }, err => {
            console.log(err);
            // this._notify.openSnackbar('Error, Please Contact System Adminstrator' , SnackBarState.Error);
            this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_2__.SnackBarState.Error);
            this._db.createSystemLogs(`${this.currentLoggedInUser.username} Has Error ${JSON.stringify(err['error']['data'])} while creating his Transportation Request ${JSON.stringify(newRequest)}`, `${this.currentLoggedInUser.key} Has Error while creating his report`, this.currentLoggedInUser.key || '', this.currentLoggedInUser.username, 'Faild').subscribe();
        });
        // .then(
        //   ()=>{
        //     this.newTransRequestForm.reset();
        //     this.isNewTransIsopened = false;
        //     this._notify.openSnackbar('Your Request Sent Successfully' , SnackBarState.Success);
        //   }
        // )
        // this.db.createtransportationRequest(newRequest).then(
        //   ()=>{
        //     this.newTransRequestForm.reset();
        //     this.isNewTransIsopened = false;
        //     this._notify.openSnackbar('Your Request Sent Successfully' , SnackBarState.Success);
        //   }
        // )
    }
    togglePanel() {
        this.isNewTransIsopened = !this.isNewTransIsopened;
    }
    getProcesses() {
        var _a;
        const projectKey = (_a = this.newTransRequestForm.get(['projectkey'])) === null || _a === void 0 ? void 0 : _a.value;
        this._db.getProjectProcess(projectKey).subscribe(processes => {
            if (processes['status'] == src_app_interfaces_res_status__WEBPACK_IMPORTED_MODULE_3__.ResStatus.CRUD) {
                this.myProcess = processes['data'];
            }
        });
        // this.db.getProjectSubTasks(projectKey).subscribe(processes=>{
        //   this.myProcess = processes;
        // })
    }
}
TransportaionsComponent.ɵfac = function TransportaionsComponent_Factory(t) { return new (t || TransportaionsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_database_service__WEBPACK_IMPORTED_MODULE_4__.DatabaseService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_auth_api_service__WEBPACK_IMPORTED_MODULE_5__.AuthApiService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_6__.NotificationService)); };
TransportaionsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({ type: TransportaionsComponent, selectors: [["app-transportaions"]], decls: 74, vars: 29, consts: [[1, "container-fluid"], [1, "row"], [1, "col-lg-12", "text-end", "px-0"], ["header", "", "position", "right", "styleClass", "p-sidebar-md", 3, "visible", "autoZIndex", "baseZIndex", "modal", "visibleChange"], [1, "example-form", 3, "formGroup", "ngSubmit"], [1, "container-fluid", "text-start"], [1, "col-md-6", "my-3", "text-start"], ["label", "Date", "type", "date", "placeholder", "pick date", 3, "control"], [1, "col-md-6", "my-3"], ["formControlName", "pmToApproveKey", "placeholder", "Select Manager", "floatlLabel", "never", 1, "form-control", 3, "ngClass"], [3, "value", 4, "ngFor", "ngForOf"], ["class", "invalid-feedback", 4, "ngIf"], ["label", "From", "type", "text", "placeholder", "write Location", 3, "control"], ["label", "To", "type", "text", "placeholder", "write Location", 3, "control"], ["formControlName", "projectkey", "placeholder", "Select Project", "floatlLabel", "never", 1, "form-control", 3, "ngClass", "selectionChange"], ["formControlName", "processkey", "placeholder", "Select Process", "floatlLabel", "never", 1, "form-control", 3, "ngClass"], ["label", "Purpose", "type", "text", "placeholder", "Write Project duration", 3, "control"], ["label", "Amount By EGP", "type", "number", "placeholder", "Amount By EGP", 3, "control"], [1, "col-md-12", "my-3"], ["type", "text", "id", "comment", "formControlName", "comment", 1, "form-control"], [1, "col-md-12"], ["type", "submit", 1, "btn", "add_request", "w-100", "my-3", 3, "disabled"], [1, "m-3", "add_request", "text-center", "mr-auto", "btn", 3, "click"], [1, "table-responsive"], ["mat-table", "", 1, "newTableCustom", 3, "dataSource"], ["matColumnDef", "Date"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "From"], ["matColumnDef", "To"], ["matColumnDef", "Purpose"], ["matColumnDef", "Project"], ["matColumnDef", "Amount"], ["matColumnDef", "Status"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [3, "value"], [1, "invalid-feedback"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-header-row", ""], ["mat-row", ""]], template: function TransportaionsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "p-sidebar", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("visibleChange", function TransportaionsComponent_Template_p_sidebar_visibleChange_3_listener($event) { return ctx.isNewTransIsopened = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "form", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("ngSubmit", function TransportaionsComponent_Template_form_ngSubmit_4_listener() { return ctx.createTransRequest(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](5, "div", 5)(6, "div", 1)(7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](8, "app-form-input", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](9, "div", 8)(10, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](11, "Manager To Approve");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](12, "mat-select", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](13, TransportaionsComponent_mat_option_13_Template, 2, 2, "mat-option", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](14, TransportaionsComponent_div_14_Template, 3, 0, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](15, "div", 1)(16, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](17, "app-form-input", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](18, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](19, "app-form-input", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](20, "div", 1)(21, "div", 8)(22, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](23, "Project");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](24, "mat-select", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("selectionChange", function TransportaionsComponent_Template_mat_select_selectionChange_24_listener() { return ctx.getProcesses(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](25, TransportaionsComponent_mat_option_25_Template, 2, 2, "mat-option", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](26, TransportaionsComponent_div_26_Template, 3, 0, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](27, "div", 8)(28, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](29, "Process");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](30, "mat-select", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](31, TransportaionsComponent_mat_option_31_Template, 2, 2, "mat-option", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](32, TransportaionsComponent_div_32_Template, 2, 0, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](33, "div", 1)(34, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](35, "app-form-input", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](36, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](37, "app-form-input", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](38, "div", 1)(39, "div", 18)(40, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](41, "Comment");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](42, "textarea", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](43, "div", 1)(44, "div", 20)(45, "button", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](46, "Submit");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](47, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function TransportaionsComponent_Template_button_click_47_listener() { return ctx.togglePanel(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](48, "Add New Request");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](49, "div", 23)(50, "table", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](51, 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](52, TransportaionsComponent_th_52_Template, 2, 0, "th", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](53, TransportaionsComponent_td_53_Template, 3, 4, "td", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](54, 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](55, TransportaionsComponent_th_55_Template, 2, 0, "th", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](56, TransportaionsComponent_td_56_Template, 2, 1, "td", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](57, 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](58, TransportaionsComponent_th_58_Template, 2, 0, "th", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](59, TransportaionsComponent_td_59_Template, 2, 1, "td", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](60, 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](61, TransportaionsComponent_th_61_Template, 2, 0, "th", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](62, TransportaionsComponent_td_62_Template, 2, 1, "td", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](63, 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](64, TransportaionsComponent_th_64_Template, 2, 0, "th", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](65, TransportaionsComponent_td_65_Template, 2, 1, "td", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](66, 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](67, TransportaionsComponent_th_67_Template, 2, 0, "th", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](68, TransportaionsComponent_td_68_Template, 2, 1, "td", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](69, 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](70, TransportaionsComponent_th_70_Template, 2, 0, "th", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](71, TransportaionsComponent_td_71_Template, 2, 1, "td", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](72, TransportaionsComponent_tr_72_Template, 1, 0, "tr", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](73, TransportaionsComponent_tr_73_Template, 1, 0, "tr", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        let tmp_6_0;
        let tmp_8_0;
        let tmp_11_0;
        let tmp_13_0;
        let tmp_14_0;
        let tmp_16_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("visible", ctx.isNewTransIsopened)("autoZIndex", false)("baseZIndex", 9999)("modal", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("formGroup", ctx.newTransRequestForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("control", ctx.newTransRequestForm.get("date"));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpureFunction1"](23, _c0, !((tmp_6_0 = ctx.newTransRequestForm.get("pmToApproveKey")) == null ? null : tmp_6_0.valid) && ((tmp_6_0 = ctx.newTransRequestForm.get("pmToApproveKey")) == null ? null : tmp_6_0.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", ctx.allPmsAndManagers);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !((tmp_8_0 = ctx.newTransRequestForm.get("pmToApproveKey")) == null ? null : tmp_8_0.valid) && ((tmp_8_0 = ctx.newTransRequestForm.get("pmToApproveKey")) == null ? null : tmp_8_0.touched));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("control", ctx.newTransRequestForm.get("from"));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("control", ctx.newTransRequestForm.get("to"));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpureFunction1"](25, _c0, !((tmp_11_0 = ctx.newTransRequestForm.get("projectkey")) == null ? null : tmp_11_0.valid) && ((tmp_11_0 = ctx.newTransRequestForm.get("projectkey")) == null ? null : tmp_11_0.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", ctx.myProjects);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !((tmp_13_0 = ctx.newTransRequestForm.get("projectkey")) == null ? null : tmp_13_0.valid) && ((tmp_13_0 = ctx.newTransRequestForm.get("projectkey")) == null ? null : tmp_13_0.touched));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpureFunction1"](27, _c0, !((tmp_14_0 = ctx.newTransRequestForm.get("processkey")) == null ? null : tmp_14_0.valid) && ((tmp_14_0 = ctx.newTransRequestForm.get("processkey")) == null ? null : tmp_14_0.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", ctx.myProcess);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !((tmp_16_0 = ctx.newTransRequestForm.get("processkey")) == null ? null : tmp_16_0.valid) && ((tmp_16_0 = ctx.newTransRequestForm.get("processkey")) == null ? null : tmp_16_0.touched));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("control", ctx.newTransRequestForm.get("purpose"));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("control", ctx.newTransRequestForm.get("amountByEGP"));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("disabled", ctx.newTransRequestForm.invalid);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("dataSource", ctx.myRequests.slice().reverse());
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
    } }, directives: [primeng_sidebar__WEBPACK_IMPORTED_MODULE_10__.Sidebar, _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormGroupDirective, _shared_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_7__.FormInputComponent, _angular_material_select__WEBPACK_IMPORTED_MODULE_11__.MatSelect, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControlName, ngx_intl_tel_input__WEBPACK_IMPORTED_MODULE_12__.NativeElementInjectorDirective, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgForOf, _angular_material_core__WEBPACK_IMPORTED_MODULE_14__.MatOption, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgIf, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatLabel, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.DefaultValueAccessor, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatRow], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.DatePipe], styles: ["table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n@media (max-width: 768px) {\n  .entry-card[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n\n.add_request[_ngcontent-%COMP%] {\n  border-radius: 4px;\n  background: linear-gradient(180deg, #FFAB00 0%, #FE7E15 100%);\n  color: white;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zcG9ydGFpb25zLmNvbXBvbmVudC5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxGR1MlMjBUYXNrJTIwTWFuYWdlbWVudCUyMFN5c3RlbVxcZmdzdG1fdWlcXHNyY1xcYXBwXFxjb21wb25lbnRzXFxkZXZcXGNvbXBvbmVudHNcXHRyYW5zcG9ydGFpb25zXFx0cmFuc3BvcnRhaW9ucy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLFdBQUE7QUNESjs7QURJQTtFQUNJO0lBQ0ksV0FBQTtFQ0ROO0FBQ0Y7O0FESUE7RUFDSSxrQkFBQTtFQUNBLDZEQUFBO0VBQ0EsWUFBQTtBQ0ZKIiwiZmlsZSI6InRyYW5zcG9ydGFpb25zLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnLi4vLi4vLi4vLi4vY29sb3JzJztcclxuXHJcbnRhYmxlIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcclxuICAgIC5lbnRyeS1jYXJkIHtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgIH1cclxufVxyXG5cclxuLmFkZF9yZXF1ZXN0e1xyXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDE4MGRlZywgJGJ1dHRvblN1YkJhY2tncm91bmRDb2xvciAwJSwgJGJ1dHRvblN1YlN1YkJhY2tncm91bmRDb2xvciAxMDAlKTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxufSIsInRhYmxlIHtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuZW50cnktY2FyZCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbn1cbi5hZGRfcmVxdWVzdCB7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDE4MGRlZywgI0ZGQUIwMCAwJSwgI0ZFN0UxNSAxMDAlKTtcbiAgY29sb3I6IHdoaXRlO1xufSJdfQ== */"], data: { animation: [
            (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.trigger)('detailExpand', [
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.state)('collapsed', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.style)({ height: '0px', minHeight: '0' })),
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.state)('expanded', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.style)({ height: '*' })),
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.transition)('expanded <=> collapsed', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.animate)('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
            (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.trigger)('openClose', [
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.state)('void', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.style)({ height: 0, opacity: 0 })),
                (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.transition)('void <=> *', [
                    (0,_angular_animations__WEBPACK_IMPORTED_MODULE_17__.animate)('300ms ease-in-out')
                ])
            ])
        ] } });


/***/ }),

/***/ 57568:
/*!**********************************************************!*\
  !*** ./src/app/components/dev/dev/dev-routing.module.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DevRoutingModule": () => (/* binding */ DevRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 52816);
/* harmony import */ var src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/services/dev.guard */ 99614);
/* harmony import */ var _project_details_project_details_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../project-details/project-details.component */ 1661);
/* harmony import */ var _project_sub_tasks_project_sub_tasks_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../project-sub-tasks/project-sub-tasks.component */ 85212);
/* harmony import */ var _components_dev_projects_dev_projects_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/dev-projects/dev-projects.component */ 8655);
/* harmony import */ var _components_history_history_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/history/history.component */ 12847);
/* harmony import */ var _shared_pending_reports_pending_reports_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/pending-reports/pending-reports.component */ 2131);
/* harmony import */ var _components_rejected_reports_rejected_reports_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/rejected-reports/rejected-reports.component */ 30640);
/* harmony import */ var _components_senior_report_approval_senior_report_approval_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/senior-report-approval/senior-report-approval.component */ 22846);
/* harmony import */ var _components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/time-sheet/time-sheet.component */ 66171);
/* harmony import */ var _components_transportaions_transportaions_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/transportaions/transportaions.component */ 13856);
/* harmony import */ var _components_requests_requests_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/requests/requests.component */ 63895);
/* harmony import */ var _components_dev_reports_dev_reports_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/dev-reports/dev-reports.component */ 98948);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 3184);















const routes = [
    { path: 'myprojects', component: _components_dev_projects_dev_projects_component__WEBPACK_IMPORTED_MODULE_3__.DevProjectsComponent, canActivate: [src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__.DevGuard] },
    { path: 'myprojects/:id', component: _project_details_project_details_component__WEBPACK_IMPORTED_MODULE_1__.ProjectDetailsComponent, canActivate: [src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__.DevGuard] },
    { path: 'myprojects/:id/:subTasks', component: _project_sub_tasks_project_sub_tasks_component__WEBPACK_IMPORTED_MODULE_2__.ProjectSubTasksComponent, canActivate: [src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__.DevGuard] },
    { path: 'timesheet', component: _components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_8__.TimeSheetComponent, canActivate: [src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__.DevGuard] },
    { path: 'history', component: _components_history_history_component__WEBPACK_IMPORTED_MODULE_4__.HistoryComponent, canActivate: [src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__.DevGuard] },
    { path: 'rejected', component: _components_rejected_reports_rejected_reports_component__WEBPACK_IMPORTED_MODULE_6__.RejectedReportsComponent, canActivate: [src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__.DevGuard] },
    { path: 'pending', component: _shared_pending_reports_pending_reports_component__WEBPACK_IMPORTED_MODULE_5__.PendingReportsComponent, canActivate: [src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__.DevGuard] },
    { path: 'reports', component: _components_dev_reports_dev_reports_component__WEBPACK_IMPORTED_MODULE_11__.DevReportsComponent, canActivate: [src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__.DevGuard] },
    { path: 'transportaions', component: _components_transportaions_transportaions_component__WEBPACK_IMPORTED_MODULE_9__.TransportaionsComponent, canActivate: [src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__.DevGuard] },
    { path: 'requests', component: _components_requests_requests_component__WEBPACK_IMPORTED_MODULE_10__.RequestsComponent, canActivate: [src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__.DevGuard] },
    { path: 'reportsToApprove', component: _components_senior_report_approval_senior_report_approval_component__WEBPACK_IMPORTED_MODULE_7__.SeniorReportApprovalComponent, canActivate: [src_app_services_dev_guard__WEBPACK_IMPORTED_MODULE_0__.DevGuard] },
];
class DevRoutingModule {
}
DevRoutingModule.ɵfac = function DevRoutingModule_Factory(t) { return new (t || DevRoutingModule)(); };
DevRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineNgModule"]({ type: DevRoutingModule });
DevRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵsetNgModuleScope"](DevRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterModule] }); })();


/***/ }),

/***/ 83180:
/*!**************************************************!*\
  !*** ./src/app/components/dev/dev/dev.module.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DevModule": () => (/* binding */ DevModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _dev_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dev-routing.module */ 57568);
/* harmony import */ var _components_dev_dev_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/dev/dev.component */ 21799);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/sidenav */ 7216);
/* harmony import */ var _components_dev_projects_dev_projects_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/dev-projects/dev-projects.component */ 8655);
/* harmony import */ var _components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/time-sheet/time-sheet.component */ 66171);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/icon */ 65590);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/divider */ 19975);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/list */ 26131);
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/expansion */ 12928);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/menu */ 82796);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/progress-bar */ 60833);
/* harmony import */ var _components_transportaions_transportaions_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/transportaions/transportaions.component */ 13856);
/* harmony import */ var src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/angular-material.module */ 74786);
/* harmony import */ var _components_public_request_public_request_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/public-request/public-request.component */ 52101);
/* harmony import */ var _components_senior_report_approval_senior_report_approval_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/senior-report-approval/senior-report-approval.component */ 22846);
/* harmony import */ var _components_requests_requests_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/requests/requests.component */ 63895);
/* harmony import */ var src_app_shared_shared_components_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/shared/shared-components.module */ 17730);
/* harmony import */ var _components_dev_reports_dev_reports_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/dev-reports/dev-reports.component */ 98948);
/* harmony import */ var _components_rejected_reports_rejected_reports_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/rejected-reports/rejected-reports.component */ 30640);
/* harmony import */ var _components_history_history_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../components/history/history.component */ 12847);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ 3184);























class DevModule {
}
DevModule.ɵfac = function DevModule_Factory(t) { return new (t || DevModule)(); };
DevModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineNgModule"]({ type: DevModule });
DevModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineInjector"]({ imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_14__.CommonModule,
            _dev_routing_module__WEBPACK_IMPORTED_MODULE_0__.DevRoutingModule,
            _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_15__.MatSidenavModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_16__.FormsModule,
            _angular_material_icon__WEBPACK_IMPORTED_MODULE_17__.MatIconModule,
            _angular_material_divider__WEBPACK_IMPORTED_MODULE_18__.MatDividerModule,
            _angular_material_list__WEBPACK_IMPORTED_MODULE_19__.MatListModule,
            _angular_material_expansion__WEBPACK_IMPORTED_MODULE_20__.MatExpansionModule,
            _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__.MatMenuModule,
            _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_22__.MatProgressBarModule,
            src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_5__.AngularMaterialModule,
            src_app_shared_shared_components_module__WEBPACK_IMPORTED_MODULE_9__.SharedComponentsModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵsetNgModuleScope"](DevModule, { declarations: [_components_dev_dev_component__WEBPACK_IMPORTED_MODULE_1__.DevComponent,
        _components_dev_projects_dev_projects_component__WEBPACK_IMPORTED_MODULE_2__.DevProjectsComponent,
        _components_time_sheet_time_sheet_component__WEBPACK_IMPORTED_MODULE_3__.TimeSheetComponent,
        _components_transportaions_transportaions_component__WEBPACK_IMPORTED_MODULE_4__.TransportaionsComponent,
        _components_public_request_public_request_component__WEBPACK_IMPORTED_MODULE_6__.PublicRequestComponent,
        _components_senior_report_approval_senior_report_approval_component__WEBPACK_IMPORTED_MODULE_7__.SeniorReportApprovalComponent,
        _components_requests_requests_component__WEBPACK_IMPORTED_MODULE_8__.RequestsComponent,
        _components_dev_reports_dev_reports_component__WEBPACK_IMPORTED_MODULE_10__.DevReportsComponent,
        _components_rejected_reports_rejected_reports_component__WEBPACK_IMPORTED_MODULE_11__.RejectedReportsComponent,
        _components_history_history_component__WEBPACK_IMPORTED_MODULE_12__.HistoryComponent], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.CommonModule,
        _dev_routing_module__WEBPACK_IMPORTED_MODULE_0__.DevRoutingModule,
        _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_15__.MatSidenavModule,
        _angular_forms__WEBPACK_IMPORTED_MODULE_16__.FormsModule,
        _angular_material_icon__WEBPACK_IMPORTED_MODULE_17__.MatIconModule,
        _angular_material_divider__WEBPACK_IMPORTED_MODULE_18__.MatDividerModule,
        _angular_material_list__WEBPACK_IMPORTED_MODULE_19__.MatListModule,
        _angular_material_expansion__WEBPACK_IMPORTED_MODULE_20__.MatExpansionModule,
        _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__.MatMenuModule,
        _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_22__.MatProgressBarModule,
        src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_5__.AngularMaterialModule,
        src_app_shared_shared_components_module__WEBPACK_IMPORTED_MODULE_9__.SharedComponentsModule], exports: [_components_dev_dev_component__WEBPACK_IMPORTED_MODULE_1__.DevComponent,
        _components_dev_projects_dev_projects_component__WEBPACK_IMPORTED_MODULE_2__.DevProjectsComponent] }); })();


/***/ }),

/***/ 33595:
/*!***********************************************!*\
  !*** ./src/app/interfaces/transportations.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "transportaionApprovalCycle": () => (/* binding */ transportaionApprovalCycle),
/* harmony export */   "transportaionFinalStatus": () => (/* binding */ transportaionFinalStatus)
/* harmony export */ });
var transportaionApprovalCycle;
(function (transportaionApprovalCycle) {
    transportaionApprovalCycle[transportaionApprovalCycle["Finished"] = 3] = "Finished";
    transportaionApprovalCycle[transportaionApprovalCycle["PendingOnManager"] = 2] = "PendingOnManager";
    transportaionApprovalCycle[transportaionApprovalCycle["PendingOnFinance"] = 1] = "PendingOnFinance";
    transportaionApprovalCycle[transportaionApprovalCycle["PendingOnPM"] = 0] = "PendingOnPM";
})(transportaionApprovalCycle || (transportaionApprovalCycle = {}));
var transportaionFinalStatus;
(function (transportaionFinalStatus) {
    transportaionFinalStatus["Pending"] = "1";
    transportaionFinalStatus["Approved"] = "2";
    transportaionFinalStatus["Done"] = "3";
    transportaionFinalStatus["Rejected"] = "4";
    // Approved = 2 ,
    // Pending = 1,
    // rejected = 0,
})(transportaionFinalStatus || (transportaionFinalStatus = {}));


/***/ })

}]);
//# sourceMappingURL=src_app_components_dev_dev_dev_module_ts.js.map