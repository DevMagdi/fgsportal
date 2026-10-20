import { LoadingComponent } from './loading/loading.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevReportsComponent } from './dev-reports/dev-reports.component';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { FormInputComponent } from './form-input/form-input.component';
import { PendingReportsComponent } from './pending-reports/pending-reports.component';
import { RejectedReportsComponent } from '../components/dev/components/rejected-reports/rejected-reports.component';
import { MaxLengthPipe } from '../pipes/max-length.pipe';



@NgModule({
  declarations: [DevReportsComponent, FormInputComponent, PendingReportsComponent, MaxLengthPipe, LoadingComponent],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,

  ],
  exports: [
    DevReportsComponent,
    FormInputComponent,
    PendingReportsComponent,
    MaxLengthPipe,
    LoadingComponent
  ]
})
export class SharedComponentsModule { }
