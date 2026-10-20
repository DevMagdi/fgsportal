"use strict";
(self["webpackChunkfgs_pm"] = self["webpackChunkfgs_pm"] || []).push([["src_app_components_client_client_module_ts"],{

/***/ 72098:
/*!*****************************************************************************************!*\
  !*** ./src/app/components/client/Components/client-profile/client-profile.component.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClientProfileComponent": () => (/* binding */ ClientProfileComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2316);

class ClientProfileComponent {
    constructor() { }
    ngOnInit() {
    }
}
ClientProfileComponent.ɵfac = function ClientProfileComponent_Factory(t) { return new (t || ClientProfileComponent)(); };
ClientProfileComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ClientProfileComponent, selectors: [["app-client-profile"]], decls: 2, vars: 0, template: function ClientProfileComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "client-profile works!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJjbGllbnQtcHJvZmlsZS5jb21wb25lbnQuc2NzcyJ9 */"] });


/***/ }),

/***/ 35742:
/*!***************************************************************************************!*\
  !*** ./src/app/components/client/Components/closed-ticket/closed-ticket.component.ts ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClosedTicketComponent": () => (/* binding */ ClosedTicketComponent)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ 2281);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/client-ticket */ 9551);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/auth.service */ 37556);
/* harmony import */ var src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/firebase-service.service */ 97732);
/* harmony import */ var primeng_table__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/table */ 68581);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 71258);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 54364);










function ClosedTicketComponent_ng_template_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "tr", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2, "Created From");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4, "Title");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](6, "Project Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](7, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](8, "Priority");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} }
const _c0 = function (a1) { return ["/support/tickets", a1]; };
const _c1 = function (a0) { return { "color": a0 }; };
function ClosedTicketComponent_ng_template_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "tr", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "a", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](8, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](9, "p", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ticket_r2 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](ctx_r1.getTime(ticket_r2.createdAt) == "Invalid date" ? ticket_r2.createdAt : ctx_r1.getTime(ticket_r2.createdAt));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](6, _c0, ticket_r2.key));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", ctx_r1.getTicketName(ticket_r2.title), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](ticket_r2.projectName);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](8, _c1, ctx_r1.getPriority(ticket_r2.priority)));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", ticket_r2.priority == "0" ? "Critical" : ticket_r2.priority == "1" ? "High" : ticket_r2.priority == "2" ? "Normal" : "", " ");
} }
const _c2 = function () { return [10, 25, 50]; };
class ClosedTicketComponent {
    constructor(_auth, _db) {
        this._auth = _auth;
        this._db = _db;
        this.uploading = false;
        this.recentClientTickets = [];
        this.myLimit = 5;
        this.clientTiketStatusEnum = src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketStatus;
        this.searchKey = '';
    }
    ngOnInit() {
        this._auth.user.subscribe(user => {
            if (!!user) {
                this.currentUser = user;
                if (this.currentUser.accType == src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.AccountType.Client) {
                    this.getClientRecentTikets();
                }
            }
        });
    }
    getClientRecentTikets() {
        this._db.getClientTicketsByClientKey(this.currentUser.key || '', this.myLimit).subscribe((tickets) => {
            this.recentClientTickets = tickets.filter(t => t.status == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketStatus.CLOSED).reverse();
        });
    }
    loadMore() {
        this.myLimit += 5;
        this.getClientRecentTikets();
    }
    getTime(dateString) {
        const timestampPositive = Date.parse(dateString);
        return moment__WEBPACK_IMPORTED_MODULE_0__(moment__WEBPACK_IMPORTED_MODULE_0__.unix(timestampPositive / 1000)).startOf('minute').fromNow();
    }
    getStatus(status) {
        if (status == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketStatus.STARTED) {
            return '#1CCC6D';
        }
        else if (status == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketStatus.CLOSED) {
            return '#CC1C52';
        }
        else {
            return '#000';
        }
    }
    getPriority(priority) {
        if (priority == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketPeriority.Normal) {
            return '#1CCC6D';
        }
        else if (priority == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketPeriority.High) {
            return '#513982';
        }
        else if (priority == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketPeriority.Critical) {
            return '#CC1C52';
        }
        else {
            return '#CC1C52';
        }
    }
    sortData(sort) {
        const data = this.recentClientTickets.slice();
        if (!sort.active || sort.direction === '') {
            this.recentClientTickets = data;
            return;
        }
        this.recentClientTickets = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'title': return compare(a.title, b.title, isAsc);
                // case 'pendingOn': return compare(a.pendingOn, b.pendingOn, isAsc);
                case 'status': return compare(a.status ? a.status : '', b.status ? b.status : '', isAsc);
                case 'projectTitle': return compare(a.projectName ? a.projectName : '', b.projectName ? b.projectName : '', isAsc);
                case 'lastReplied': return compare(this.getTime(a.createdAt) ? this.getTime(a.createdAt) : '', this.getTime(b.createdAt) ? this.getTime(b.createdAt) : '', isAsc);
                default: return 0;
            }
        });
    }
    getTicketName(name) {
        let newName = '';
        if (name.length < 50) {
            return name;
        }
        else {
            newName = `${name.slice(0, 50)}...`;
            return newName;
        }
    }
}
ClosedTicketComponent.ɵfac = function ClosedTicketComponent_Factory(t) { return new (t || ClosedTicketComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_3__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_4__.FirebaseServiceService)); };
ClosedTicketComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({ type: ClosedTicketComponent, selectors: [["app-closed-ticket"]], decls: 15, vars: 6, consts: [[1, "tClientTickets"], [1, "container-fluid", "mt-4"], [1, "row"], [1, "col-12"], [1, "pageTitle"], [1, "ProjectCostData"], [1, "container-fluid"], [1, "row", "my-5"], [1, "projectCost"], [1, "card"], ["styleClass", "p-datatable-sm", "responsiveLayout", "scroll", "currentPageReportTemplate", "Showing {first} to {last} of {totalRecords} entries", 3, "value", "paginator", "rows", "showCurrentPageReport", "rowsPerPageOptions"], ["pTemplate", "header"], ["pTemplate", "body"], [1, "tHeader"], [1, "tbody"], [1, "time"], [1, "title", 3, "routerLink"], [3, "ngStyle"]], template: function ClosedTicketComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "h1", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](5, "Closed Tickets");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](8, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](9, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](11, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](12, "p-table", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](13, ClosedTicketComponent_ng_template_13_Template, 9, 0, "ng-template", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](14, ClosedTicketComponent_ng_template_14_Template, 11, 10, "ng-template", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("value", ctx.recentClientTickets)("paginator", ctx.recentClientTickets.length > 10 ? true : false)("rows", 10)("showCurrentPageReport", true)("rowsPerPageOptions", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction0"](5, _c2));
    } }, directives: [primeng_table__WEBPACK_IMPORTED_MODULE_6__.Table, primeng_api__WEBPACK_IMPORTED_MODULE_7__.PrimeTemplate, _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterLinkWithHref, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgStyle], styles: [".tClientTickets[_ngcontent-%COMP%] {\n  scale: 1;\n  zoom: 0.8;\n  margin-top: 75px;\n}\n\n.pageTitle[_ngcontent-%COMP%] {\n  color: rgba(81, 57, 130, 0.8);\n  font-size: 38px;\n  font-family: \"Cairo\";\n  font-weight: 600;\n  border-left: solid 7px #f4831f;\n  padding-left: 5px;\n}\n\n.addIssue[_ngcontent-%COMP%] {\n  background-color: #513982;\n  color: #fff;\n  height: -moz-fit-content;\n  height: fit-content;\n  margin-top: 15px;\n}\n\n.tHeader[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  color: #f4831f !important;\n  font-family: \"Cairo\";\n}\n\n.tbody[_ngcontent-%COMP%]   .key[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #513982 !important;\n}\n\n.tbody[_ngcontent-%COMP%]   .time[_ngcontent-%COMP%] {\n  color: #513982 !important;\n  font-family: \"Cairo\";\n}\n\n.tbody[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-weight: 24px;\n  font-weight: bold;\n  color: #513982;\n  line-height: 0px;\n}\n\n.tbody[_ngcontent-%COMP%]   .pendingon[_ngcontent-%COMP%], .tbody[_ngcontent-%COMP%]   .projectName[_ngcontent-%COMP%], .tbody[_ngcontent-%COMP%]   .lastReply[_ngcontent-%COMP%] {\n  font-weight: 18px;\n  color: #707070;\n}\n\n.tbody[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%] {\n  font-weight: 18px;\n  color: #fff;\n}\n\n.tbody[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  border-radius: 5px;\n  width: -moz-fit-content;\n  width: fit-content;\n  padding: 3px 5px;\n}\n\n.tbody[_ngcontent-%COMP%]   .loadBtn[_ngcontent-%COMP%] {\n  background-color: #f4831f;\n  color: #fff;\n}\n\n.tbody[_ngcontent-%COMP%]   .priority[_ngcontent-%COMP%] {\n  font-weight: 18px;\n  color: #fff;\n}\n\n.tbody[_ngcontent-%COMP%]   .priority[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  border-radius: 5px;\n  width: -moz-fit-content;\n  width: fit-content;\n  padding: 3px 5px;\n}\n\n.popover[_ngcontent-%COMP%] {\n  width: 1250px !important;\n  max-width: 500px !important;\n}\n\n.formLables[_ngcontent-%COMP%] {\n  color: #513982;\n  font-family: \"Cairo\";\n  font-weight: bold;\n}\n\n.submitFormBtn[_ngcontent-%COMP%] {\n  background-color: #513982;\n  color: #fff;\n  font-family: \"Cairo\";\n}\n\n.modal-header[_ngcontent-%COMP%] {\n  background-color: #513982;\n}\n\n.modal-header[_ngcontent-%COMP%]   .modal-title[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 25px;\n  font-weight: bold;\n  font-family: \"Cairo\";\n  text-align: center;\n  width: 100%;\n  height: 80%;\n}\n\n.modal-header[_ngcontent-%COMP%]   .close[_ngcontent-%COMP%] {\n  color: #fff;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsb3NlZC10aWNrZXQuY29tcG9uZW50LnNjc3MiLCIuLlxcLi5cXC4uXFwuLlxcX2NvbG9ycy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0ksUUFBQTtFQUNBLFNBQUE7RUFDQSxnQkFBQTtBQUFKOztBQUdBO0VBQ0ksNkJBQUE7RUFDQSxlQUFBO0VBQ0Esb0JDTmE7RURPYixnQkFBQTtFQUNBLDhCQUFBO0VBQ0EsaUJBQUE7QUFBSjs7QUFHQTtFQUNJLHlCQ2pCWTtFRGtCWixXQ2ZRO0VEZ0JSLHdCQUFBO0VBQUEsbUJBQUE7RUFDQSxnQkFBQTtBQUFKOztBQUlJO0VBQ0kseUJBQUE7RUFDQSxvQkN0QlM7QURxQmpCOztBQU9RO0VBQ0kseUJBQUE7QUFKWjs7QUFPSTtFQUNJLHlCQUFBO0VBQ0Esb0JDbENTO0FENkJqQjs7QUFPSTtFQUNJLGlCQUFBO0VBQ0EsaUJBQUE7RUFDQSxjQzNDUTtFRDRDUixnQkFBQTtBQUxSOztBQU9JOzs7RUFHSSxpQkFBQTtFQUNBLGNDaERTO0FEMkNqQjs7QUFPSTtFQUNJLGlCQUFBO0VBQ0EsV0NuREk7QUQ4Q1o7O0FBTVE7RUFDSSxrQkFBQTtFQUNBLHVCQUFBO0VBQUEsa0JBQUE7RUFDQSxnQkFBQTtBQUpaOztBQU9JO0VBQ0kseUJDN0RtQjtFRDhEbkIsV0M1REk7QUR1RFo7O0FBT0k7RUFDSSxpQkFBQTtFQUNBLFdDaEVJO0FEMkRaOztBQU1RO0VBQ0ksa0JBQUE7RUFDQSx1QkFBQTtFQUFBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFKWjs7QUFTQTtFQUNJLHdCQUFBO0VBQ0EsMkJBQUE7QUFOSjs7QUFTQTtFQUNJLGNDbEZZO0VEbUZaLG9CQy9FYTtFRGdGYixpQkFBQTtBQU5KOztBQVNBO0VBQ0kseUJDeEZZO0VEeUZaLFdBQUE7RUFDQSxvQkN0RmE7QURnRmpCOztBQVNBO0VBQ0kseUJDOUZZO0FEd0ZoQjs7QUFPSTtFQUNJLFdBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxvQkMvRlM7RURnR1Qsa0JBQUE7RUFDQSxXQUFBO0VBQ0EsV0FBQTtBQUxSOztBQU9JO0VBQ0ksV0FBQTtBQUxSIiwiZmlsZSI6ImNsb3NlZC10aWNrZXQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi9jb2xvcnMnO1xyXG4udENsaWVudFRpY2tldHMge1xyXG4gICAgc2NhbGU6IDE7XHJcbiAgICB6b29tOiAwLjg7XHJcbiAgICBtYXJnaW4tdG9wOiA3NXB4O1xyXG59XHJcblxyXG4ucGFnZVRpdGxlIHtcclxuICAgIGNvbG9yOiByZ2JhKCRjb2xvcjogJG1haW5UaGVtZUNvbG9yLCAkYWxwaGE6IDAuOCk7XHJcbiAgICBmb250LXNpemU6IDM4cHg7XHJcbiAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIGJvcmRlci1sZWZ0OiBzb2xpZCA3cHggJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDVweDtcclxufVxyXG5cclxuLmFkZElzc3VlIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgIGNvbG9yOiAkd2hpdGVDb2xvcjtcclxuICAgIGhlaWdodDogZml0LWNvbnRlbnQ7XHJcbiAgICBtYXJnaW4tdG9wOiAxNXB4O1xyXG59XHJcblxyXG4udEhlYWRlciB7XHJcbiAgICB0aCB7XHJcbiAgICAgICAgY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxuICAgIH1cclxufVxyXG5cclxuLnRib2R5IHtcclxuICAgIC5rZXkge1xyXG4gICAgICAgIGEge1xyXG4gICAgICAgICAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLnRpbWUge1xyXG4gICAgICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3IgIWltcG9ydGFudDtcclxuICAgICAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG4gICAgfVxyXG4gICAgLnRpdGxlIHtcclxuICAgICAgICBmb250LXdlaWdodDogMjRweDtcclxuICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgICAgIGxpbmUtaGVpZ2h0OiAwcHg7XHJcbiAgICB9XHJcbiAgICAucGVuZGluZ29uLFxyXG4gICAgLnByb2plY3ROYW1lLFxyXG4gICAgLmxhc3RSZXBseSB7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDE4cHg7XHJcbiAgICAgICAgY29sb3I6ICRzZWNvbmRGb250Q29sb3I7XHJcbiAgICB9XHJcbiAgICAuc3RhdHVzIHtcclxuICAgICAgICBmb250LXdlaWdodDogMThweDtcclxuICAgICAgICBjb2xvcjogJHdoaXRlQ29sb3I7XHJcbiAgICAgICAgcCB7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICAgICAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAzcHggNXB4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC5sb2FkQnRuIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICBjb2xvcjogJHdoaXRlQ29sb3I7XHJcbiAgICB9XHJcbiAgICAucHJpb3JpdHkge1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiAxOHB4O1xyXG4gICAgICAgIGNvbG9yOiAkd2hpdGVDb2xvcjtcclxuICAgICAgICBwIHtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgICAgICB3aWR0aDogZml0LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDNweCA1cHg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4ucG9wb3ZlciB7XHJcbiAgICB3aWR0aDogMTI1MHB4ICFpbXBvcnRhbnQ7XHJcbiAgICBtYXgtd2lkdGg6IDUwMHB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5mb3JtTGFibGVzIHtcclxuICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbn1cclxuXHJcbi5zdWJtaXRGb3JtQnRuIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxufVxyXG5cclxuLm1vZGFsLWhlYWRlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICAubW9kYWwtdGl0bGUge1xyXG4gICAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMjVweDtcclxuICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICBoZWlnaHQ6IDgwJTtcclxuICAgIH1cclxuICAgIC5jbG9zZSB7XHJcbiAgICAgICAgY29sb3I6ICNmZmY7XHJcbiAgICB9XHJcbn0iLCIkbWFpblRoZW1lQ29sb3I6IzUxMzk4MjtcclxuJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I6I2Y0ODMxZjsgLy8jRjU4MjFGO1xyXG4kc2Vjb25kRm9udENvbG9yOiM3MDcwNzA7XHJcbiR3aGl0ZUNvbG9yOiNmZmY7XHJcbiRtYWluRm9udEZhbWlseTogJ0NhaXJvJzsiXX0= */"] });
function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


/***/ }),

/***/ 76651:
/*!*****************************************************************************************!*\
  !*** ./src/app/components/client/Components/ticket-details/ticket-details.component.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TicketDetailsComponent": () => (/* binding */ TicketDetailsComponent)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ 2281);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/interfaces/client-ticket */ 9551);
/* harmony import */ var src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/interfaces/user */ 5153);
/* harmony import */ var src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/components/snackbar/snackbar.component */ 24665);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 1707);
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ 81288);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/firebase-service.service */ 97732);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 71258);
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/auth.service */ 37556);
/* harmony import */ var src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/messaging.service */ 64271);
/* harmony import */ var src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/notification.service */ 12013);
/* harmony import */ var src_app_services_send_email_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/services/send-email.service */ 98449);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/divider */ 1124);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/form-field */ 65788);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/input */ 64742);
/* harmony import */ var primeng_timeline__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! primeng/timeline */ 68554);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! primeng/api */ 81122);
/* harmony import */ var primeng_image__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! primeng/image */ 60796);
/* harmony import */ var primeng_card__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! primeng/card */ 96480);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/checkbox */ 74058);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/select */ 37007);
/* harmony import */ var primeng_editor__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! primeng/editor */ 1791);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/button */ 70781);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/core */ 32220);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/tooltip */ 50298);





























function TicketDetailsComponent_div_0_div_1_span_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx_r5.currentClientTicket.title, " ");
} }
function TicketDetailsComponent_div_0_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "h1", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](5, "i", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](6, TicketDetailsComponent_div_0_div_1_span_6_Template, 2, 1, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.currentClientTicket.title);
} }
function TicketDetailsComponent_div_0_div_2_div_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "div", 39);
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("innerHTML", ctx_r6.currentClientTicket.desc, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeHtml"]);
} }
function TicketDetailsComponent_div_0_div_2_span_21_Template(rf, ctx) { if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function TicketDetailsComponent_div_0_div_2_span_21_Template_span_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r17); _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2); const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](4); const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); ctx_r16.open(_r3); return ctx_r16.editClientTicket(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function TicketDetailsComponent_div_0_div_2_div_30_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "h4", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx_r8.currentClientTicket.closureDate, " ");
} }
function TicketDetailsComponent_div_0_div_2_div_31_Template(rf, ctx) { if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function TicketDetailsComponent_div_0_div_2_div_31_Template_button_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r19); const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3); return ctx_r18.escalateTicket(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3, " Escalate ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function TicketDetailsComponent_div_0_div_2_div_32_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "h4", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3, "Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function TicketDetailsComponent_div_0_div_2_div_33_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "p-image", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("onShow", function TicketDetailsComponent_div_0_div_2_div_33_div_1_Template_p_image_onShow_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r23); const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](4); return ctx_r22.zoomout(); })("onHide", function TicketDetailsComponent_div_0_div_2_div_33_div_1_Template_p_image_onHide_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r23); const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](4); return ctx_r24.zoomin(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const imgUrl_r21 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("src", imgUrl_r21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("preview", true);
} }
function TicketDetailsComponent_div_0_div_2_div_33_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, TicketDetailsComponent_div_0_div_2_div_33_div_1_Template, 2, 2, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r11.currentClientTicket.imagesURls);
} }
function TicketDetailsComponent_div_0_div_2_mat_error_43_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "mat-error", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " Title Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function TicketDetailsComponent_div_0_div_2_mat_error_48_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "mat-error", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " Description Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function TicketDetailsComponent_div_0_div_2_ng_template_54_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "i", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function TicketDetailsComponent_div_0_div_2_ng_template_55_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const timeline_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", timeline_r26.action, " ");
} }
function TicketDetailsComponent_div_0_div_2_ng_template_55_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const timeline_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", timeline_r26.createdAt, " ");
} }
function TicketDetailsComponent_div_0_div_2_ng_template_55_p_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "span", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, " Action Details : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const timeline_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", timeline_r26.actionComment, " ");
} }
function TicketDetailsComponent_div_0_div_2_ng_template_55_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p-card");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, TicketDetailsComponent_div_0_div_2_ng_template_55_ng_template_1_Template, 2, 1, "ng-template", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, TicketDetailsComponent_div_0_div_2_ng_template_55_ng_template_2_Template, 2, 1, "ng-template", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "p", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "span", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5, " BY : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](8, TicketDetailsComponent_div_0_div_2_ng_template_55_p_8_Template, 5, 1, "p", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const timeline_r26 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", timeline_r26.actionByName, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", timeline_r26.actionComment);
} }
const _c0 = function (a0) { return { "background-color": a0 }; };
const _c1 = function (a0, a1) { return { "border-color": a0, "color": a1 }; };
function TicketDetailsComponent_div_0_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](7, "h4", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](11, TicketDetailsComponent_div_0_div_2_div_11_Template, 1, 1, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](12, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](15, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "h4", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](17, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](18, " access_time ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](21, TicketDetailsComponent_div_0_div_2_span_21_Template, 2, 0, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](22, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](23, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](24, "h4", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](26, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](27, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](28, "h4", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](30, TicketDetailsComponent_div_0_div_2_div_30_Template, 5, 1, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](31, TicketDetailsComponent_div_0_div_2_div_31_Template, 4, 0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](32, TicketDetailsComponent_div_0_div_2_div_32_Template, 4, 0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](33, TicketDetailsComponent_div_0_div_2_div_33_Template, 2, 1, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](34, "mat-divider", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](35, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](36, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](37, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](38, "form", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngSubmit", function TicketDetailsComponent_div_0_div_2_Template_form_ngSubmit_38_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r34); const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2); return ctx_r33.submitNewTimeLine(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](39, "mat-form-field", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](40, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](41, "Title");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](42, "input", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](43, TicketDetailsComponent_div_0_div_2_mat_error_43_Template, 2, 0, "mat-error", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](44, "mat-form-field", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](45, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](46, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](47, "textarea", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](48, TicketDetailsComponent_div_0_div_2_mat_error_48_Template, 2, 0, "mat-error", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](49, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](50, "button", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](51, "Comment");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](52, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](53, "p-timeline", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](54, TicketDetailsComponent_div_0_div_2_ng_template_54_Template, 2, 0, "ng-template", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](55, TicketDetailsComponent_div_0_div_2_ng_template_55_Template, 9, 2, "ng-template", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    let tmp_12_0;
    let tmp_13_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r2.editMode);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx_r2.getTime(ctx_r2.currentClientTicket.startDate), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r2.currentClientTicket.clientKey == ctx_r2.currentuser.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](16, _c0, ctx_r2.getPriority(ctx_r2.currentClientTicket.priority)));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx_r2.currentClientTicket.priority == "0" ? "Critical" : ctx_r2.currentClientTicket.priority == "1" ? "High" : ctx_r2.currentClientTicket.priority == "2" ? "Normal" : "", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction2"](18, _c1, ctx_r2.getStatusColor(ctx_r2.currentClientTicket.status), ctx_r2.getStatusColor(ctx_r2.currentClientTicket.status)));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx_r2.currentClientTicket.status == "0" ? "STARTED" : "CLOSED", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r2.currentClientTicket.closureDate && ctx_r2.currentClientTicket.status == "3");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r2.currentClientTicket.status != "3" && !ctx_r2.currentClientTicket.escalated);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!ctx_r2.currentClientTicket.imagesURls);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!ctx_r2.currentClientTicket.imagesURls);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("formGroup", ctx_r2.newTimeLineForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_12_0 = ctx_r2.newTimeLineForm.get("title")) == null ? null : tmp_12_0.valid) && ((tmp_12_0 = ctx_r2.newTimeLineForm.get("title")) == null ? null : tmp_12_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_13_0 = ctx_r2.newTimeLineForm.get("comment")) == null ? null : tmp_13_0.valid) && ((tmp_13_0 = ctx_r2.newTimeLineForm.get("comment")) == null ? null : tmp_13_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r2.newTimeLineForm.invalid);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", ctx_r2.ticketTimeLine);
} }
function TicketDetailsComponent_div_0_ng_template_3_mat_error_19_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "mat-error", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " Title Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function TicketDetailsComponent_div_0_ng_template_3_mat_option_25_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "mat-option", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "span", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](5, "i", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const per_r46 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", per_r46.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", per_r46.key, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("matTooltip", per_r46.value == "0" ? "e.g., Fatal or server downtime" : per_r46.value == "1" ? "e.g., Potential for performance impact" : "e.g., - Issue addressed but potentially impact in the future - Inquiry for information");
} }
function TicketDetailsComponent_div_0_ng_template_3_ng_template_41_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "span", 83);
} }
function TicketDetailsComponent_div_0_ng_template_3_mat_error_42_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "mat-error", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " Description Is Required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function TicketDetailsComponent_div_0_ng_template_3_div_46_Template(rf, ctx) { if (rf & 1) {
    const _r50 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "img", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "span", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function TicketDetailsComponent_div_0_ng_template_3_div_46_Template_span_click_2_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r50); const i_r48 = restoredCtx.index; const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3); return ctx_r49.delImg(i_r48); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3, " delete ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const oldImg_r47 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", oldImg_r47, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
} }
function TicketDetailsComponent_div_0_ng_template_3_div_47_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "img", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const url_r51 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", url_r51, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
} }
function TicketDetailsComponent_div_0_ng_template_3_button_53_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "Submit");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r44.editTicketForm.invalid);
} }
function TicketDetailsComponent_div_0_ng_template_3_button_54_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "Loading...");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
const _c2 = function () { return { standalone: true }; };
const _c3 = function () { return { "height": "210px" }; };
function TicketDetailsComponent_div_0_ng_template_3_Template(rf, ctx) { if (rf & 1) {
    const _r53 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "h4", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "Edit Issue");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "button", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function TicketDetailsComponent_div_0_ng_template_3_Template_button_click_3_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r53); const d_r36 = restoredCtx.dismiss; return d_r36("Cross click"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "form", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngSubmit", function TicketDetailsComponent_div_0_ng_template_3_Template_form_ngSubmit_6_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r53); const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2); return ctx_r54.submitEditTicket(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](7, "div", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "div", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "mat-checkbox", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function TicketDetailsComponent_div_0_ng_template_3_Template_mat_checkbox_click_11_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r53); const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2); return ctx_r55.editClientTicketStatus(); })("ngModelChange", function TicketDetailsComponent_div_0_ng_template_3_Template_mat_checkbox_ngModelChange_11_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r53); const ctx_r56 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2); return ctx_r56.closeByClient = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12, "Close Ticket");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](15, "mat-form-field", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "mat-label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](17, "Issue Title");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](18, "input", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](19, TicketDetailsComponent_div_0_ng_template_3_mat_error_19_Template, 2, 0, "mat-error", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](20, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](21, "mat-form-field", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](22, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](23, "Change Priority");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](24, "mat-select", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](25, TicketDetailsComponent_div_0_ng_template_3_mat_option_25_Template, 6, 3, "mat-option", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](26, "keyvalue");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](27, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](28, "mat-form-field", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](29, "mat-label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](30, "Primary Contact Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](31, "input", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](32, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](33, "mat-form-field", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](34, "mat-label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](35, "Primary Contact Phone");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](36, "input", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](37, "div", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](38, "label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](39, "Description:");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](40, "p-editor", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](41, TicketDetailsComponent_div_0_ng_template_3_ng_template_41_Template, 1, 0, "ng-template", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](42, TicketDetailsComponent_div_0_ng_template_3_mat_error_42_Template, 2, 0, "mat-error", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](43, "div", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](44, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](45, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](46, TicketDetailsComponent_div_0_ng_template_3_div_46_Template, 4, 1, "div", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](47, TicketDetailsComponent_div_0_ng_template_3_div_47_Template, 2, 1, "div", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](48, "button", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function TicketDetailsComponent_div_0_ng_template_3_Template_button_click_48_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r53); const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](51); return _r43.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](49, "Browse");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](50, "input", 74, 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("change", function TicketDetailsComponent_div_0_ng_template_3_Template_input_change_50_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r53); const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2); return ctx_r58.imagesupload($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](52, "div", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](53, TicketDetailsComponent_div_0_ng_template_3_button_53_Template, 2, 1, "button", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](54, TicketDetailsComponent_div_0_ng_template_3_button_54_Template, 2, 0, "button", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    let tmp_3_0;
    let tmp_7_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("formGroup", ctx_r4.editTicketForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx_r4.closeByClient)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](15, _c2));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_3_0 = ctx_r4.editTicketForm.get("title")) == null ? null : tmp_3_0.valid) && ((tmp_3_0 = ctx_r4.editTicketForm.get("title")) == null ? null : tmp_3_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](26, 13, ctx_r4.clientTicketperiorityENUM));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](16, _c3));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("modules", ctx_r4.quillOPT);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_7_0 = ctx_r4.editTicketForm.get("desc")) == null ? null : tmp_7_0.valid) && ((tmp_7_0 = ctx_r4.editTicketForm.get("desc")) == null ? null : tmp_7_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r4.oldImages);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r4.urls);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r4.uploading);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r4.uploading);
} }
function TicketDetailsComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, TicketDetailsComponent_div_0_div_1_Template, 7, 1, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, TicketDetailsComponent_div_0_div_2_Template, 56, 21, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](3, TicketDetailsComponent_div_0_ng_template_3_Template, 55, 17, "ng-template", null, 4, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!ctx_r0.currentClientTicket);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!ctx_r0.currentClientTicket);
} }
class TicketDetailsComponent {
    constructor(_db, _activerouter, _auth, router, modalService, _message, _notify, _mail) {
        this._db = _db;
        this._activerouter = _activerouter;
        this._auth = _auth;
        this.router = router;
        this.modalService = modalService;
        this._message = _message;
        this._notify = _notify;
        this._mail = _mail;
        this.editTicketForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormGroup({
            'title': new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required),
            'desc': new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required),
            // 'projectKey': new FormControl(null , Validators.required),
            // 'processKey': new FormControl(null),
            'priority': new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControl(true, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required),
            'primaryContactName': new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControl(null),
            'primaryContactPhone': new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControl(null),
        });
        this.ticketTimeLine = [];
        this.editMode = false;
        this.clientTicketStatusEnum = src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketStatus;
        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 5
            },
            {
                breakpoint: '768px',
                numVisible: 3
            },
            {
                breakpoint: '560px',
                numVisible: 1
            }
        ];
        this.activeIndex = 0;
        this.display = false;
        this.oldImages = [];
        this.imagesToBeDeleted = [];
        this.urls = [];
        this.ticketImages = [];
        this.uploading = false;
        this.closeByClient = false;
        this.DepartmentEnum = src_app_interfaces_user__WEBPACK_IMPORTED_MODULE_2__.Department;
        this.clientTicketperiorityENUM = src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketPeriority;
        this.newTimeLineForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormGroup({
            'title': new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required),
            'comment': new _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required),
        });
        this.toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],
            // ['blockquote', 'code-block'],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            // [{ 'font': [] }],
            // [{ 'align': [] }],
            // [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            // [{ 'direction': 'rtl' }],                         // text direction
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            ['clean'] // remove formatting button
        ];
        this.quillOPT = {
            toolbar: this.toolbarOptions
        };
    }
    ngOnInit() {
        this.getClientCurrentIssue();
        this._auth.user.subscribe((user) => {
            this.currentuser = user;
        });
    }
    getClientCurrentIssue() {
        this._activerouter.params.subscribe(parameter => {
            const ticketKey = parameter['id'];
            this._db.getClientTicketById(ticketKey).subscribe((ticket) => {
                this.currentClientTicket = ticket;
                this.getClientTicketTimeLine();
            }, (err) => {
                console.log(err);
            });
        });
    }
    getClientTicketTimeLine() {
        this._db.getClientTicketTimelineByTicketKey(this.currentClientTicket.key || '').subscribe((answers) => {
            answers = answers.filter(a => a.showForClient == true);
            this.ticketTimeLine = answers.reverse();
        });
    }
    getStatusColor(status) {
        if (status == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketStatus.STARTED) {
            return '#1CCC6D';
            // }else if(status == ClientTicketStatus.INPROGRESS){
            //   return '#513982'
            // }else if(status == ClientTicketStatus.HOLD){
            // return '#f4831f'
        }
        else if (status == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketStatus.CLOSED) {
            return '#CC1C52';
        }
        else {
            return '#000';
        }
    }
    getPriority(priority) {
        if (priority == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketPeriority.Normal) {
            return '#1CCC6D';
        }
        else if (priority == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketPeriority.High) {
            return '#513982';
        }
        else if (priority == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketPeriority.Critical) {
            return '#CC1C52';
        }
        else {
            return '#CC1C52';
        }
    }
    getPriorityName(priority) {
        if (priority == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketPeriority.Normal) {
            return 'Normal';
        }
        else if (priority == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketPeriority.High) {
            return 'High';
        }
        else if (priority == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketPeriority.Critical) {
            return 'Critical';
        }
        else {
            return '';
        }
    }
    getTime(dateString) {
        const timestampPositive = Date.parse(dateString);
        return moment__WEBPACK_IMPORTED_MODULE_0__(moment__WEBPACK_IMPORTED_MODULE_0__.unix(timestampPositive / 1000)).startOf('minute').fromNow();
    }
    imageClick(index) {
        this.activeIndex = index;
        this.displayCustom = true;
    }
    editClientTicket() {
        // this.showDialog();
        this.getClientProjects();
        this.editTicketForm.patchValue({
            'title': this.currentClientTicket.title,
            'desc': this.currentClientTicket.desc,
        });
        if (!!this.currentClientTicket.priority) {
            this.editTicketForm.patchValue({
                'priority': this.currentClientTicket.priority
            });
        }
        if (!!this.currentClientTicket.primaryContactName) {
            this.editTicketForm.patchValue({
                'primaryContactName': this.currentClientTicket.primaryContactName
            });
        }
        if (!!this.currentClientTicket.primaryContactPhoneNumber) {
            this.editTicketForm.patchValue({
                'primaryContactPhone': this.currentClientTicket.primaryContactPhoneNumber
            });
        }
        // if(!!this.currentClientTicket.projectKey){
        //   this.editTicketForm.patchValue({
        //     'projectKey' : this.currentClientTicket.projectKey,
        //   })
        //   this.getProjectProcesses();
        // }
        // if(!!this.currentClientTicket.processKey){
        //   this.editTicketForm.patchValue({
        //     'processKey' : this.currentClientTicket.processKey,
        //   })
        // }
        if (this.currentClientTicket.status == src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketStatus.CLOSED) {
            this.closeByClient = true;
        }
        this.oldImages = this.currentClientTicket.imagesURls || [];
    }
    submitEditTicket() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        let actionTitle = 'Ticket Updated';
        let actionComment = '';
        if (this.currentClientTicket.title != ((_a = this.editTicketForm.get(['title'])) === null || _a === void 0 ? void 0 : _a.value)) {
            actionComment = actionComment += `Title Changed From ${this.currentClientTicket.title},`;
            this.currentClientTicket.title = (_b = this.editTicketForm.get(['title'])) === null || _b === void 0 ? void 0 : _b.value;
        }
        if (this.currentClientTicket.desc != ((_c = this.editTicketForm.get(['desc'])) === null || _c === void 0 ? void 0 : _c.value)) {
            actionComment = actionComment += `Description Changed From ${this.currentClientTicket.desc},`;
            this.currentClientTicket.desc = (_d = this.editTicketForm.get(['desc'])) === null || _d === void 0 ? void 0 : _d.value;
        }
        // if(this.currentClientTicket.projectKey != this.editTicketForm.get(['projectKey'])?.value){
        //   actionComment = actionComment += `Project Changed From ${this.currentClientTicket.projectName},`;
        //   this.currentClientTicket.projectKey = this.editTicketForm.get(['projectKey'])?.value;
        //   this.currentClientTicket.projectName = this.clientProjects.find(p=>p.key == this.editTicketForm.get(['projectKey'])?.value)?.projectTitle || '';
        // }
        // if(this.currentClientTicket.processKey != this.editTicketForm.get(['processKey'])?.value){
        //   actionComment = actionComment += `Process Changed From ${this.currentClientTicket.processName},`;
        //   this.currentClientTicket.processKey = this.editTicketForm.get(['processKey'])?.value;
        //   this.currentClientTicket.processName = this.clientProcess.find(pr=>pr.key == this.editTicketForm.get(['processKey'])?.value)?.processTitle || '';
        // }
        if (this.currentClientTicket.priority != ((_e = this.editTicketForm.get(['priority'])) === null || _e === void 0 ? void 0 : _e.value)) {
            actionComment = actionComment += `Priority Changed From ${this.getPriorityName(this.currentClientTicket.priority)},`;
            this.currentClientTicket.priority = (_f = this.editTicketForm.get(['priority'])) === null || _f === void 0 ? void 0 : _f.value;
        }
        // primaryContactPhone
        if (this.currentClientTicket.primaryContactName != ((_g = this.editTicketForm.get(['primaryContactName'])) === null || _g === void 0 ? void 0 : _g.value)) {
            actionComment = actionComment += `Primary Contact Name Changed From ${this.currentClientTicket.primaryContactName},`;
            this.currentClientTicket.primaryContactName = (_h = this.editTicketForm.get(['primaryContactName'])) === null || _h === void 0 ? void 0 : _h.value;
        }
        if (this.currentClientTicket.primaryContactPhoneNumber != ((_j = this.editTicketForm.get(['primaryContactPhone'])) === null || _j === void 0 ? void 0 : _j.value)) {
            actionComment = actionComment += `Primary Contact Phone Changed From ${this.currentClientTicket.primaryContactPhoneNumber},`;
            this.currentClientTicket.primaryContactPhoneNumber = (_k = this.editTicketForm.get(['primaryContactPhone'])) === null || _k === void 0 ? void 0 : _k.value;
        }
        if (this.imagesToBeDeleted.length > 0) {
            actionComment = actionComment += `Images Removed,`;
        }
        if (this.ticketImages.length > 0) {
            actionComment = actionComment += `More Images Added,`;
        }
        if (this.closeByClient == true && this.currentClientTicket.status != src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketStatus.CLOSED) {
            actionComment = actionComment += `Close The Ticket`;
            this.currentClientTicket.status = src_app_interfaces_client_ticket__WEBPACK_IMPORTED_MODULE_1__.ClientTicketStatus.CLOSED;
            this.currentClientTicket.closureDate = new Date().toLocaleString();
            actionTitle = 'Ticket Closed';
        }
        const newTimeline = {
            action: actionTitle,
            actionComment: actionComment,
            actionByKey: this.currentuser.key || '',
            actionByName: this.currentuser.username,
            ticketKey: this.currentClientTicket.key || '',
            ticketTitle: this.currentClientTicket.title,
            createdAt: new Date().toLocaleString(),
            showForClient: true
        };
        this._db.editClientTicket(this.currentClientTicket, this.ticketImages, this.imagesToBeDeleted).then(() => {
            this._db.createNewClientTicketTimeline(newTimeline);
            this._notify.openSnackbar('success', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_3__.SnackBarState.Success);
            this.editTicketForm.reset();
            this.imagesToBeDeleted = [];
            this.clientProjects = [];
            this.clientProcess = [];
            this.ticketImages = [];
            this.urls = [];
            this.oldImages = [];
            this.display = false;
        });
    }
    delImg(index) {
        this.imagesToBeDeleted.push(this.oldImages[index]);
        this.oldImages.splice(index);
    }
    editClientTicketStatus() {
        if (this.closeByClient == false) {
            this._notify.openDialog('Change Status?', `Are you sure you want to Change Status?`, false, '', true, false).subscribe(response => {
                if (response) {
                    // if(this.currentClientTicket.status == ClientTicketStatus.CLOSED){
                    //   this.currentClientTicket.closureDate = new Date().toLocaleString();
                    // }
                    // this._db.editClientTicket(this.currentClientTicket)
                }
                else {
                    this.closeByClient = false;
                    this._notify.openSnackbar('Operation Cancelled!', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_3__.SnackBarState.Info);
                    // this.getClientCurrentIssue()
                }
            });
        }
    }
    // deleteTicket(ticket:ClientTicket){
    //   this._notify.openDialog(
    //     'Delete Issue?',
    //     `Are you sure you want to delete This Issue?`,
    //     false,
    //     '',
    //     true,
    //     false).subscribe(response => {
    //       if (response) {
    //         this._db.deleteClientTicket(ticket).then(()=>{
    //           this._notify.openSnackbar('Ticket Deleted Successfully', SnackBarState.Success)
    //           this.router.navigate(['/support'])
    //         })
    //       } else {
    //         this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
    //       }
    //   });
    // }
    showDialog() {
        this.display = true;
    }
    open(content) {
        this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    getDismissReason(reason) {
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
    imagesupload(event) {
        this.ticketImages = [];
        if (event.target.files) {
            this.urls = [];
            for (let i = 0; i < event.target.files.length; i++) {
                this.ticketImages.push(event.target.files[i]);
                var reader = new FileReader();
                reader.readAsDataURL(event.target.files[i]);
                reader.onload = (event) => {
                    this.urls.push(event.target.result);
                };
            }
        }
    }
    getProjectProcesses() {
        var _a;
        this.clientProcess = [];
        this._db.getProcessSupportByProjectKey((_a = this.editTicketForm.get('projectKey')) === null || _a === void 0 ? void 0 : _a.value).subscribe((processes) => {
            // console.log(processes);
            this.clientProcess = processes;
        });
    }
    getClientProjects() {
        const clientProjectsSub = this._db.getProjectByClientKey(this.currentuser.key || '').subscribe(projects => {
            clientProjectsSub.unsubscribe();
            this.clientProjects = projects;
        });
    }
    submitNewTimeLine(timeline) {
        var _a, _b;
        let newTimeline;
        if (!timeline) {
            newTimeline = {
                action: (_a = this.newTimeLineForm.get(['title'])) === null || _a === void 0 ? void 0 : _a.value,
                actionComment: (_b = this.newTimeLineForm.get(['comment'])) === null || _b === void 0 ? void 0 : _b.value,
                actionByKey: this.currentuser.key || '',
                actionByName: this.currentuser.username,
                ticketKey: this.currentClientTicket.key || '',
                ticketTitle: this.currentClientTicket.title,
                createdAt: new Date().toLocaleString(),
                showForClient: true
            };
        }
        else {
            newTimeline = timeline;
        }
        this._db.createNewClientTicketTimeline(newTimeline).then(() => {
            this.newTimeLineForm.reset();
            if (!!this.currentClientTicket.assignedToPMKey) {
                const newNotification = {
                    title: `${!timeline ? 'Client Commented On His Ticket' : 'Client Escalated His Ticket'}`,
                    body: `${this.currentuser.username} ${!timeline ? 'Commented On His Ticket' : 'Escalated His Ticket'} ${this.currentClientTicket.projectName}`,
                    receverKey: this.currentClientTicket.assignedToPMKey || '',
                    receverName: this.currentClientTicket.assignedToPMName || '',
                    senderKey: this.currentuser.key || '',
                    senderName: this.currentuser.username,
                    senderImg: this.currentuser.photoURL ? this.currentuser.photoURL : 'https://bootdey.com/img/Content/avatar/avatar7.png',
                    redirection: `/tickets/${this.currentClientTicket.key}`
                };
                this._message.createnotification(newNotification);
                const message = `
        Hello ${this.currentClientTicket.assignedToPMName},
        <br>
        ${this.currentuser.username} Updated <a href="https://connect.firstgulfsolutions.com/#/tickets/${this.currentuser.key}">Ticket</a>,<br>
        ${newTimeline.actionComment},
        <br>
        <br>
        Best Regards,
        <br>
        <br>
        <a href="https://connect.firstgulfsolutions.com/#/">First Gulf Solutions</a>
        <br>
        <br>
        <a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
        `;
                this._auth.getUserByKey(this.currentClientTicket.assignedToPMKey || '').subscribe(user => {
                    if (!!user) {
                        this._mail.supportCenter(user.email, 'Ticket Update', message);
                    }
                });
                this._mail.supportCenter(this.currentClientTicket.assignedToPMKey || '', 'Commented On His Ticket', newTimeline.actionComment || '');
            }
            if (!!this.currentClientTicket.assignedToDevKey) {
                const newNotification = {
                    title: `${!timeline ? 'Client Commented On His Ticket' : 'Client Escalated His Ticket'}`,
                    body: `${this.currentuser.username} ${!timeline ? 'Commented On His Ticket' : 'Escalated His Ticket'} ${this.currentClientTicket.projectName}`,
                    receverKey: this.currentClientTicket.assignedToDevKey || '',
                    receverName: this.currentClientTicket.assignedToDevName || '',
                    senderKey: this.currentuser.key || '',
                    senderName: this.currentuser.username,
                    senderImg: this.currentuser.photoURL ? this.currentuser.photoURL : 'https://bootdey.com/img/Content/avatar/avatar7.png',
                    redirection: `/tickets/${this.currentClientTicket.key}`
                };
                this._message.createnotification(newNotification);
                const message = `
        Hello ${this.currentClientTicket.assignedToDevName},
        <br>
        ${this.currentuser.username} Updated <a href="https://connect.firstgulfsolutions.com/#/tickets/${this.currentuser.key}">Ticket</a>,<br>
        ${newTimeline.actionComment},
        <br>
        <br>
        Best Regards,
        <br>
        <br>
        <a href="https://connect.firstgulfsolutions.com/#/">First Gulf Solutions</a>
        <br>
        <br>
        <a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
        `;
                this._auth.getUserByKey(this.currentClientTicket.assignedToDevKey || '').subscribe(user => {
                    if (!!user) {
                        this._mail.supportCenter(user.email, 'Ticket Update', message);
                    }
                });
            }
        });
    }
    sendMail(userkey, subject, body) {
        const getuser = this._auth.getUserByKey(userkey).subscribe(user => {
            if (!!user) {
                this._mail.supportCenter(user.email, subject, body);
            }
        });
    }
    escalateTicket() {
        if (!this.currentClientTicket.escalated) {
            const newTimeline = {
                action: 'Ticket Escalate',
                actionComment: `${this.currentuser.username} Escalated This Ticket`,
                actionByKey: this.currentuser.key || '',
                actionByName: this.currentuser.username,
                ticketKey: this.currentClientTicket.key || '',
                ticketTitle: this.currentClientTicket.title,
                createdAt: new Date().toLocaleString(),
                showForClient: true
            };
            this.submitNewTimeLine(newTimeline);
            this.currentClientTicket.escalated = true;
            this.currentClientTicket.lastEscalat = new Date().toLocaleString();
            this._db.editClientTicket(this.currentClientTicket).then(() => {
                this._notify.openSnackbar('Ticket Escalated', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_3__.SnackBarState.Success, 5000);
            });
        }
        else {
            this._notify.openSnackbar('Ticket Already Escalated', src_app_components_snackbar_snackbar_component__WEBPACK_IMPORTED_MODULE_3__.SnackBarState.Info, 5000);
        }
    }
    zoomout() {
        var _a;
        (_a = document.getElementById('tDetailsPage')) === null || _a === void 0 ? void 0 : _a.setAttribute('style', 'zoom:0.7');
    }
    zoomin() {
        var _a;
        (_a = document.getElementById('tDetailsPage')) === null || _a === void 0 ? void 0 : _a.removeAttribute('style');
    }
}
TicketDetailsComponent.ɵfac = function TicketDetailsComponent_Factory(t) { return new (t || TicketDetailsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_firebase_service_service__WEBPACK_IMPORTED_MODULE_4__.FirebaseServiceService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_5__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_11__.NgbModal), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_messaging_service__WEBPACK_IMPORTED_MODULE_6__.MessagingService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_notification_service__WEBPACK_IMPORTED_MODULE_7__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_send_email_service__WEBPACK_IMPORTED_MODULE_8__.SendEmailService)); };
TicketDetailsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({ type: TicketDetailsComponent, selectors: [["app-ticket-details"]], decls: 1, vars: 1, consts: [["class", "tDetailsPage", "id", "tDetailsPage", 4, "ngIf"], ["id", "tDetailsPage", 1, "tDetailsPage"], ["class", "container-fluid", 4, "ngIf"], ["class", "issueDetailsPage", 4, "ngIf"], ["mymodal", ""], [1, "container-fluid"], [1, "row"], [1, "col-lg-6", "text-left"], [1, "mt-5", "projectDetails"], ["routerLink", "/support/tickets", 1, "pi", "pi-arrow-left", "backIcon", "mr-1"], [4, "ngIf"], [1, "issueDetailsPage"], [1, "col-lg-6", "mt-2"], [1, "col-12"], [1, "secTitle", "pl-1"], ["class", "px-5 ql-editor", 3, "innerHTML", 4, "ngIf"], [1, "col-12", "d-flex", "flex-row-reverse"], [1, "createdAt", "ml-3", "d-flex", "flex-row", "align-items-center", "text-center"], [1, "material-icons", "mr-1"], ["class", "material-icons issueEditIcon m-1", 3, "click", 4, "ngIf"], [1, "priority", "mt-2", 3, "ngStyle"], [1, "status", "mt-2", 3, "ngStyle"], ["class", "row", 4, "ngIf"], ["class", "row mt-2", 4, "ngIf"], [1, "mt-3"], [1, "container", "mt-5"], [1, "row", "newComment", "my-4", "p-2"], [1, "col-lg-4"], [1, "example-form", 3, "formGroup", "ngSubmit"], [1, "example-full-width", "w-100"], ["matInput", "", "type", "text", "id", "title", "formControlName", "title"], ["class", "alert help-block", 4, "ngIf"], ["matInput", "", "id", "comment", "formControlName", "comment"], [1, "col-12", "mt-2", "d-flex", "flex-row-reverse"], ["type", "submit", 1, "btn", "newCommentBtn", 3, "disabled"], [1, "col-lg-8"], ["align", "alternate", "styleClass", "customized-timeline", 3, "value"], ["pTemplate", "marker"], ["pTemplate", "content"], [1, "px-5", "ql-editor", 3, "innerHTML"], [1, "material-icons", "issueEditIcon", "m-1", 3, "click"], [1, "text-center"], [1, "btn", "escalationBtn", 3, "click"], [1, "row", "mt-2"], ["class", "col-lg-2 mt-1", 4, "ngFor", "ngForOf"], [1, "col-lg-2", "mt-1"], ["alt", "", "width", "200px", "height", "200px", 1, "rounded", "thumbnail-image", 3, "src", "preview", "onShow", "onHide"], [1, "alert", "help-block"], [1, "custom-marker", "shadow-2"], [1, "pi", "pi-check-circle", "checkIconColor"], ["pTemplate", "title"], ["pTemplate", "subtitle"], [1, "timelineTitle"], [2, "font-weight", "bold"], ["class", "timelineTitle", 4, "ngIf"], [1, "timelineSubTitle"], [1, "modal-header"], ["id", "modal-basic-title", 1, "modal-title"], ["type", "button", "aria-label", "Close", 1, "close", 3, "click"], ["aria-hidden", "true"], [1, "modal-body"], [1, "container"], [1, "example-margin", 3, "ngModel", "ngModelOptions", "click", "ngModelChange"], [1, "col-lg-6", "my-3"], [1, "formLables"], ["formControlName", "priority"], [3, "value", 4, "ngFor", "ngForOf"], ["matInput", "", "type", "text", "id", "title", "formControlName", "primaryContactName"], ["matInput", "", "type", "text", "id", "title", "formControlName", "primaryContactPhone"], [1, "col-lg-12", "my-3"], ["formControlName", "desc", 3, "modules"], ["pTemplate", "header"], ["class", "col-lg-3 col-md-6", 4, "ngFor", "ngForOf"], ["type", "button", "mat-raised-button", "", 1, "btn", "submitFormBtn", 3, "click"], ["hidden", "", "multiple", "", "type", "file", "id", "file", "accept", "image/*", 3, "change"], ["fileInput", ""], [1, "modal-footer"], ["type", "submit", "class", "btn submitFormBtn", 3, "disabled", 4, "ngIf"], ["type", "submit", "class", "btn submitFormBtn", "disabled", "", 4, "ngIf"], [3, "value"], [1, "d-flex", "justify-content-between"], [1, "info_icon", 3, "matTooltip"], [1, "pi", "pi-info"], [1, "ql-format-group"], [1, "col-lg-3", "col-md-6"], ["alt", "ticketImages", "width", "100", 3, "src"], ["matTooltip", "Delete", 1, "material-icons", "issueDelIcon", "m-1", 3, "click"], ["type", "submit", 1, "btn", "submitFormBtn", 3, "disabled"], ["type", "submit", "disabled", "", 1, "btn", "submitFormBtn"]], template: function TicketDetailsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](0, TicketDetailsComponent_div_0_Template, 5, 2, "div", 0);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !!ctx.currentuser);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgStyle, _angular_material_divider__WEBPACK_IMPORTED_MODULE_14__.MatDivider, _angular_forms__WEBPACK_IMPORTED_MODULE_10__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormGroupDirective, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatLabel, _angular_material_input__WEBPACK_IMPORTED_MODULE_16__.MatInput, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControlName, primeng_timeline__WEBPACK_IMPORTED_MODULE_17__.Timeline, primeng_api__WEBPACK_IMPORTED_MODULE_18__.PrimeTemplate, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgForOf, primeng_image__WEBPACK_IMPORTED_MODULE_19__.Image, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatError, primeng_card__WEBPACK_IMPORTED_MODULE_20__.Card, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_21__.MatCheckbox, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgModel, _angular_material_select__WEBPACK_IMPORTED_MODULE_22__.MatSelect, primeng_editor__WEBPACK_IMPORTED_MODULE_23__.Editor, _angular_material_button__WEBPACK_IMPORTED_MODULE_24__.MatButton, _angular_material_core__WEBPACK_IMPORTED_MODULE_25__.MatOption, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_26__.MatTooltip], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.KeyValuePipe], styles: [".tDetailsPage[_ngcontent-%COMP%] {\n  zoom: 0.9;\n  margin-top: 35px;\n}\n\n.projectDetails[_ngcontent-%COMP%] {\n  font-size: 26px;\n  font-weight: bold;\n  color: #513982;\n}\n\n.escalationBtn[_ngcontent-%COMP%] {\n  border-color: #f4831f;\n  color: #f4831f;\n  font-family: \"Cairo\";\n  width: 100px;\n}\n\n.issueEditIcon[_ngcontent-%COMP%] {\n  color: #513982;\n  cursor: pointer;\n}\n\n.issueDelIcon[_ngcontent-%COMP%] {\n  color: #f4831f;\n  cursor: pointer;\n}\n\n.backIcon[_ngcontent-%COMP%] {\n  color: #513982;\n  cursor: pointer;\n}\n\n.priority[_ngcontent-%COMP%] {\n  color: #fff;\n  border-radius: 5px;\n  padding: 5px 10px;\n  width: 100px;\n  height: 45px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.checkIconColor[_ngcontent-%COMP%] {\n  color: #513982;\n}\n\n.timelineTitle[_ngcontent-%COMP%] {\n  color: #513982;\n  font-family: \"Cairo\";\n}\n\n.timelineSubTitle[_ngcontent-%COMP%] {\n  color: #f4831f;\n  font-family: \"Cairo\";\n}\n\n.issueDetailsPage[_ngcontent-%COMP%] {\n  background-color: #fff;\n  width: 95%;\n  margin: auto;\n  padding: 0px;\n}\n\n.issueDetailsPage[_ngcontent-%COMP%]   .secTitle[_ngcontent-%COMP%] {\n  color: #513982;\n  font-size: 20px;\n  font-weight: bold;\n  border-left: solid 7px #f4831f;\n}\n\n.issueDetailsPage[_ngcontent-%COMP%]   .createdAt[_ngcontent-%COMP%] {\n  color: #a19ea0;\n  font-size: 16px;\n}\n\n.issueDetailsPage[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%] {\n  color: #fff;\n  border-radius: 5px;\n  padding: 5px 10px;\n  width: 100px;\n  height: 45px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.issueDetailsPage[_ngcontent-%COMP%]   .newCommentBtn[_ngcontent-%COMP%] {\n  background-color: #513982;\n  color: #fff;\n  height: -moz-fit-content;\n  height: fit-content;\n}\n\n.issueDetailsPage[_ngcontent-%COMP%]   .commented-section[_ngcontent-%COMP%]   .delIcon[_ngcontent-%COMP%] {\n  opacity: 0;\n  color: #a19ea0;\n  cursor: pointer;\n}\n\n.issueDetailsPage[_ngcontent-%COMP%]   .commented-section[_ngcontent-%COMP%]:hover {\n  box-shadow: 0px 0px 20px 0 rgba(0, 0, 0, 0.3);\n  background-color: #fff;\n}\n\n.issueDetailsPage[_ngcontent-%COMP%]   .commented-section[_ngcontent-%COMP%]:hover   .delIcon[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n\n.issueDetailsPage[_ngcontent-%COMP%]   .newComment[_ngcontent-%COMP%] {\n  box-shadow: 0px 0px 20px 0 rgba(0, 0, 0, 0.3);\n}\n\n@media (max-width: 768px) {\n  .issueDetailsPage[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%] {\n    padding: 2px 5px;\n    width: 75px;\n    height: 35px;\n  }\n  .issueDetailsPage[_ngcontent-%COMP%]   .createdAt[_ngcontent-%COMP%] {\n    font-size: 16px;\n  }\n\n  .projectDetails[_ngcontent-%COMP%] {\n    font-size: 20px;\n    margin: 25px !important;\n  }\n}\n\n.formLables[_ngcontent-%COMP%] {\n  color: #513982;\n  font-family: \"Cairo\";\n  font-weight: bold;\n}\n\n.submitFormBtn[_ngcontent-%COMP%] {\n  background-color: #513982;\n  color: #fff;\n  font-family: \"Cairo\";\n}\n\n.modal-header[_ngcontent-%COMP%] {\n  background-color: #513982;\n}\n\n.modal-header[_ngcontent-%COMP%]   .modal-title[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 25px;\n  font-weight: bold;\n  font-family: \"Cairo\";\n  text-align: center;\n  width: 100%;\n  height: 80%;\n}\n\n.modal-header[_ngcontent-%COMP%]   .close[_ngcontent-%COMP%] {\n  color: #fff;\n}\n\n  .mat-checkbox-checked.mat-accent .mat-checkbox-ripple .mat-ripple-element {\n  opacity: 0.03 !important;\n  background-color: #f4831f !important;\n}\n\n  .mat-checkbox-checked.mat-accent .mat-checkbox-background, .mat-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-checkbox-background[_ngcontent-%COMP%] {\n  background-color: #f4831f;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpY2tldC1kZXRhaWxzLmNvbXBvbmVudC5zY3NzIiwiLi5cXC4uXFwuLlxcLi5cXF9jb2xvcnMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUVJLFNBQUE7RUFDQSxnQkFBQTtBQURKOztBQUlBO0VBQ0ksZUFBQTtFQUNBLGlCQUFBO0VBQ0EsY0NWWTtBRFNoQjs7QUFJQTtFQUNJLHFCQ2J1QjtFRGN2QixjQ2R1QjtFRGV2QixvQkNaYTtFRGFiLFlBQUE7QUFESjs7QUFJQTtFQUNJLGNDckJZO0VEc0JaLGVBQUE7QUFESjs7QUFJQTtFQUNJLGNDekJ1QjtFRDBCdkIsZUFBQTtBQURKOztBQUlBO0VBQ0ksY0MvQlk7RURnQ1osZUFBQTtBQURKOztBQUlBO0VBQ0ksV0NqQ1E7RURrQ1Isa0JBQUE7RUFDQSxpQkFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7QUFESjs7QUFJQTtFQUNJLGNDL0NZO0FEOENoQjs7QUFJQTtFQUNJLGNDbkRZO0VEb0RaLG9CQ2hEYTtBRCtDakI7O0FBSUE7RUFDSSxjQ3ZEdUI7RUR3RHZCLG9CQ3JEYTtBRG9EakI7O0FBSUE7RUFDSSxzQkMxRFE7RUQyRFIsVUFBQTtFQUlBLFlBQUE7RUFDQSxZQUFBO0FBSko7O0FBS0k7RUFDSSxjQ3JFUTtFRHNFUixlQUFBO0VBQ0EsaUJBQUE7RUFDQSw4QkFBQTtBQUhSOztBQUtJO0VBQ0ksY0FBQTtFQUNBLGVBQUE7QUFIUjs7QUFLSTtFQUNJLFdDNUVJO0VENkVKLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0FBSFI7O0FBS0k7RUFDSSx5QkN6RlE7RUQwRlIsV0N2Rkk7RUR3Rkosd0JBQUE7RUFBQSxtQkFBQTtBQUhSOztBQU1RO0VBQ0ksVUFBQTtFQUNBLGNBQUE7RUFDQSxlQUFBO0FBSlo7O0FBTVE7RUFDSSw2Q0FBQTtFQUNBLHNCQUFBO0FBSlo7O0FBS1k7RUFDSSxVQUFBO0FBSGhCOztBQU9JO0VBQ0ksNkNBQUE7QUFMUjs7QUFTQTtFQUVRO0lBQ0ksZ0JBQUE7SUFDQSxXQUFBO0lBQ0EsWUFBQTtFQVBWO0VBU007SUFDSSxlQUFBO0VBUFY7O0VBVUU7SUFDSSxlQUFBO0lBQ0EsdUJBQUE7RUFQTjtBQUNGOztBQVVBO0VBQ0ksY0NsSVk7RURtSVosb0JDL0hhO0VEZ0liLGlCQUFBO0FBUko7O0FBV0E7RUFDSSx5QkN4SVk7RUR5SVosV0FBQTtFQUNBLG9CQ3RJYTtBRDhIakI7O0FBV0E7RUFDSSx5QkM5SVk7QURzSWhCOztBQVNJO0VBQ0ksV0FBQTtFQUNBLGVBQUE7RUFDQSxpQkFBQTtFQUNBLG9CQy9JUztFRGdKVCxrQkFBQTtFQUNBLFdBQUE7RUFDQSxXQUFBO0FBUFI7O0FBU0k7RUFDSSxXQUFBO0FBUFI7O0FBV0E7RUFDSSx3QkFBQTtFQUNBLG9DQUFBO0FBUko7O0FBV0E7O0VBRUkseUJDbkt1QjtBRDJKM0IiLCJmaWxlIjoidGlja2V0LWRldGFpbHMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi9jb2xvcnMnO1xyXG4udERldGFpbHNQYWdlIHtcclxuICAgIC8vIHNjYWxlOiAxO1xyXG4gICAgem9vbTogMC45O1xyXG4gICAgbWFyZ2luLXRvcDogMzVweDtcclxufVxyXG5cclxuLnByb2plY3REZXRhaWxzIHtcclxuICAgIGZvbnQtc2l6ZTogMjZweDtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxufVxyXG5cclxuLmVzY2FsYXRpb25CdG4ge1xyXG4gICAgYm9yZGVyLWNvbG9yOiAkYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjtcclxuICAgIGNvbG9yOiAkYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjtcclxuICAgIGZvbnQtZmFtaWx5OiAkbWFpbkZvbnRGYW1pbHk7XHJcbiAgICB3aWR0aDogMTAwcHg7XHJcbn1cclxuXHJcbi5pc3N1ZUVkaXRJY29uIHtcclxuICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi5pc3N1ZURlbEljb24ge1xyXG4gICAgY29sb3I6ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4uYmFja0ljb24ge1xyXG4gICAgY29sb3I6ICRtYWluVGhlbWVDb2xvcjtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLnByaW9yaXR5IHtcclxuICAgIGNvbG9yOiAkd2hpdGVDb2xvcjtcclxuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgIHBhZGRpbmc6IDVweCAxMHB4O1xyXG4gICAgd2lkdGg6IDEwMHB4O1xyXG4gICAgaGVpZ2h0OiA0NXB4O1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxufVxyXG5cclxuLmNoZWNrSWNvbkNvbG9yIHtcclxuICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbn1cclxuXHJcbi50aW1lbGluZVRpdGxlIHtcclxuICAgIGNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG59XHJcblxyXG4udGltZWxpbmVTdWJUaXRsZSB7XHJcbiAgICBjb2xvcjogJGJ1dHRvbk1haW5CYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICBmb250LWZhbWlseTogJG1haW5Gb250RmFtaWx5O1xyXG59XHJcblxyXG4uaXNzdWVEZXRhaWxzUGFnZSB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkd2hpdGVDb2xvcjtcclxuICAgIHdpZHRoOiA5NSU7XHJcbiAgICAvLyBkaXNwbGF5OiBmbGV4O1xyXG4gICAgLy8ganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAvLyBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgbWFyZ2luOiBhdXRvO1xyXG4gICAgcGFkZGluZzogMHB4O1xyXG4gICAgLnNlY1RpdGxlIHtcclxuICAgICAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICBib3JkZXItbGVmdDogc29saWQgN3B4ICRidXR0b25NYWluQmFja2dyb3VuZENvbG9yO1xyXG4gICAgfVxyXG4gICAgLmNyZWF0ZWRBdCB7XHJcbiAgICAgICAgY29sb3I6ICNhMTllYTA7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgfVxyXG4gICAgLnN0YXR1cyB7XHJcbiAgICAgICAgY29sb3I6ICR3aGl0ZUNvbG9yO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICBwYWRkaW5nOiA1cHggMTBweDtcclxuICAgICAgICB3aWR0aDogMTAwcHg7XHJcbiAgICAgICAgaGVpZ2h0OiA0NXB4O1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIH1cclxuICAgIC5uZXdDb21tZW50QnRuIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICAgICAgY29sb3I6ICR3aGl0ZUNvbG9yO1xyXG4gICAgICAgIGhlaWdodDogZml0LWNvbnRlbnQ7XHJcbiAgICB9XHJcbiAgICAuY29tbWVudGVkLXNlY3Rpb24ge1xyXG4gICAgICAgIC5kZWxJY29uIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgICAgICAgY29sb3I6ICNhMTllYTA7XHJcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgJjpob3ZlciB7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDBweCAwcHggMjBweCAwIHJnYmEoMCwgMCwgMCwgMC4zKTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICAgICAgICAgICAgLmRlbEljb24ge1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC5uZXdDb21tZW50IHtcclxuICAgICAgICBib3gtc2hhZG93OiAwcHggMHB4IDIwcHggMCByZ2JhKDAsIDAsIDAsIDAuMyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xyXG4gICAgLmlzc3VlRGV0YWlsc1BhZ2Uge1xyXG4gICAgICAgIC5zdGF0dXMge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAycHggNXB4O1xyXG4gICAgICAgICAgICB3aWR0aDogNzVweDtcclxuICAgICAgICAgICAgaGVpZ2h0OiAzNXB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICAuY3JlYXRlZEF0IHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC5wcm9qZWN0RGV0YWlscyB7XHJcbiAgICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgICAgIG1hcmdpbjogMjVweCAhaW1wb3J0YW50O1xyXG4gICAgfVxyXG59XHJcblxyXG4uZm9ybUxhYmxlcyB7XHJcbiAgICBjb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG59XHJcblxyXG4uc3VibWl0Rm9ybUJ0biB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkbWFpblRoZW1lQ29sb3I7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgIGZvbnQtZmFtaWx5OiAkbWFpbkZvbnRGYW1pbHk7XHJcbn1cclxuXHJcbi5tb2RhbC1oZWFkZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJG1haW5UaGVtZUNvbG9yO1xyXG4gICAgLm1vZGFsLXRpdGxlIHtcclxuICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgICBmb250LXNpemU6IDI1cHg7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6ICRtYWluRm9udEZhbWlseTtcclxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgaGVpZ2h0OiA4MCU7XHJcbiAgICB9XHJcbiAgICAuY2xvc2Uge1xyXG4gICAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgfVxyXG59XHJcblxyXG46Om5nLWRlZXAgLm1hdC1jaGVja2JveC1jaGVja2VkLm1hdC1hY2NlbnQgLm1hdC1jaGVja2JveC1yaXBwbGUgLm1hdC1yaXBwbGUtZWxlbWVudCB7XHJcbiAgICBvcGFjaXR5OiAwLjAzICFpbXBvcnRhbnQ7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvciFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbjo6bmctZGVlcCAubWF0LWNoZWNrYm94LWNoZWNrZWQubWF0LWFjY2VudCAubWF0LWNoZWNrYm94LWJhY2tncm91bmQsXHJcbi5tYXQtY2hlY2tib3gtaW5kZXRlcm1pbmF0ZS5tYXQtYWNjZW50IC5tYXQtY2hlY2tib3gtYmFja2dyb3VuZCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjtcclxufSIsIiRtYWluVGhlbWVDb2xvcjojNTEzOTgyO1xyXG4kYnV0dG9uTWFpbkJhY2tncm91bmRDb2xvcjojZjQ4MzFmOyAvLyNGNTgyMUY7XHJcbiRzZWNvbmRGb250Q29sb3I6IzcwNzA3MDtcclxuJHdoaXRlQ29sb3I6I2ZmZjtcclxuJG1haW5Gb250RmFtaWx5OiAnQ2Fpcm8nOyJdfQ== */"] });


/***/ }),

/***/ 94291:
/*!************************************************************!*\
  !*** ./src/app/components/client/client-routing.module.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClientRoutingModule": () => (/* binding */ ClientRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 71258);
/* harmony import */ var src_app_services_client_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/services/client.guard */ 49402);
/* harmony import */ var _Components_client_main_client_main_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Components/client-main/client-main.component */ 53106);
/* harmony import */ var _Components_client_profile_client_profile_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Components/client-profile/client-profile.component */ 72098);
/* harmony import */ var _Components_client_tickets_client_tickets_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/client-tickets/client-tickets.component */ 83997);
/* harmony import */ var _Components_closed_ticket_closed_ticket_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Components/closed-ticket/closed-ticket.component */ 35742);
/* harmony import */ var _Components_ticket_details_ticket_details_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Components/ticket-details/ticket-details.component */ 76651);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 2316);









const routes = [
    { path: '/', component: _Components_client_main_client_main_component__WEBPACK_IMPORTED_MODULE_1__.ClientMainComponent, canActivate: [src_app_services_client_guard__WEBPACK_IMPORTED_MODULE_0__.ClientGuard] },
    { path: 'profile', component: _Components_client_profile_client_profile_component__WEBPACK_IMPORTED_MODULE_2__.ClientProfileComponent, canActivate: [src_app_services_client_guard__WEBPACK_IMPORTED_MODULE_0__.ClientGuard] },
    { path: 'tickets', component: _Components_client_tickets_client_tickets_component__WEBPACK_IMPORTED_MODULE_3__.ClientTicketsComponent, canActivate: [src_app_services_client_guard__WEBPACK_IMPORTED_MODULE_0__.ClientGuard] },
    { path: 'closed', component: _Components_closed_ticket_closed_ticket_component__WEBPACK_IMPORTED_MODULE_4__.ClosedTicketComponent, canActivate: [src_app_services_client_guard__WEBPACK_IMPORTED_MODULE_0__.ClientGuard] },
    { path: 'tickets/:id', component: _Components_ticket_details_ticket_details_component__WEBPACK_IMPORTED_MODULE_5__.TicketDetailsComponent, canActivate: [src_app_services_client_guard__WEBPACK_IMPORTED_MODULE_0__.ClientGuard] },
];
class ClientRoutingModule {
}
ClientRoutingModule.ɵfac = function ClientRoutingModule_Factory(t) { return new (t || ClientRoutingModule)(); };
ClientRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({ type: ClientRoutingModule });
ClientRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](ClientRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule] }); })();


/***/ }),

/***/ 67131:
/*!****************************************************!*\
  !*** ./src/app/components/client/client.module.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClientModule": () => (/* binding */ ClientModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var _client_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./client-routing.module */ 94291);
/* harmony import */ var src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/angular-material.module */ 74786);
/* harmony import */ var _admin_admin_admin_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../admin/admin/admin-routing.module */ 50154);
/* harmony import */ var _Components_client_main_client_main_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/client-main/client-main.component */ 53106);
/* harmony import */ var _Components_client_profile_client_profile_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Components/client-profile/client-profile.component */ 72098);
/* harmony import */ var _Components_client_tickets_client_tickets_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Components/client-tickets/client-tickets.component */ 83997);
/* harmony import */ var _Components_ticket_details_ticket_details_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Components/ticket-details/ticket-details.component */ 76651);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 1707);
/* harmony import */ var _Components_closed_ticket_closed_ticket_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Components/closed-ticket/closed-ticket.component */ 35742);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 2316);











class ClientModule {
}
ClientModule.ɵfac = function ClientModule_Factory(t) { return new (t || ClientModule)(); };
ClientModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({ type: ClientModule });
ClientModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({ imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule,
            _client_routing_module__WEBPACK_IMPORTED_MODULE_0__.ClientRoutingModule,
            _admin_admin_admin_routing_module__WEBPACK_IMPORTED_MODULE_2__.AdminRoutingModule,
            src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_1__.AngularMaterialModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](ClientModule, { declarations: [_Components_client_main_client_main_component__WEBPACK_IMPORTED_MODULE_3__.ClientMainComponent,
        _Components_client_profile_client_profile_component__WEBPACK_IMPORTED_MODULE_4__.ClientProfileComponent,
        _Components_client_tickets_client_tickets_component__WEBPACK_IMPORTED_MODULE_5__.ClientTicketsComponent,
        _Components_ticket_details_ticket_details_component__WEBPACK_IMPORTED_MODULE_6__.TicketDetailsComponent,
        _Components_closed_ticket_closed_ticket_component__WEBPACK_IMPORTED_MODULE_7__.ClosedTicketComponent], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule,
        _client_routing_module__WEBPACK_IMPORTED_MODULE_0__.ClientRoutingModule,
        _admin_admin_admin_routing_module__WEBPACK_IMPORTED_MODULE_2__.AdminRoutingModule,
        src_app_angular_material_module__WEBPACK_IMPORTED_MODULE_1__.AngularMaterialModule,
        _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule] }); })();


/***/ })

}]);
//# sourceMappingURL=src_app_components_client_client_module_ts.js.map