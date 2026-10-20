import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { NgCircleProgressModule } from 'ng-circle-progress';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ChartsModule, WavesModule } from 'angular-bootstrap-md'
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {ChartModule} from 'primeng/chart';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {SplitButtonModule} from 'primeng/splitbutton';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {DropdownModule} from 'primeng/dropdown';
import { MatTabsModule } from '@angular/material/tabs';
import {MultiSelectModule} from 'primeng/multiselect';
import {CardModule} from 'primeng/card';
import {TooltipModule} from 'primeng/tooltip';
import {CalendarModule} from 'primeng/calendar';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
// import {ConfirmationService} from 'primeng/api';
import {AccordionModule} from 'primeng/accordion';
import {TabMenuModule} from 'primeng/tabmenu';
import {ImageModule} from 'primeng/image';
import {TimelineModule} from 'primeng/timeline';
import {CheckboxModule} from 'primeng/checkbox';
import {SkeletonModule} from 'primeng/skeleton';
import {EditorModule} from 'primeng/editor';
import {TableModule} from 'primeng/table';
import {ProgressBarModule} from 'primeng/progressbar';
import {RadioButtonModule} from 'primeng/radiobutton';

import {GalleriaModule} from 'primeng/galleria';
import {InputSwitchModule} from 'primeng/inputswitch';
import {SidebarModule} from 'primeng/sidebar';
// import {DragDropModule} from 'primeng/dragdrop';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import { TagModule } from 'primeng/tag';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {TabViewModule} from 'primeng/tabview';
import {PanelModule} from 'primeng/panel';
import {SpeedDialModule} from 'primeng/speeddial';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { LoadingDotsComponent } from './components/loading-dots/loading-dots.component';
import {InputTextModule} from 'primeng/inputtext';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import {InputNumberModule} from 'primeng/inputnumber';
import {RatingModule} from 'primeng/rating';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
    LoadingDotsComponent
  ],
  imports: [
    CommonModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      "backgroundGradient": true,
      "backgroundColor": "#ffffff",
      "backgroundGradientStopColor": "#c0c0c0",
      "backgroundPadding": -10,
      "radius": 60,
      "maxPercent": 100,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#61A9DC",
      "innerStrokeWidth": 0,
      "subtitleColor": "#444444",
      "showInnerStroke": false,
      "startFromZero": false
    })
  ],
  exports:[
    ReactiveFormsModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    NgbModule,
    MatTooltipModule,
    MatStepperModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    NgxPaginationModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSortModule,
    NgCircleProgressModule,
    MatMenuModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatToolbarModule,
    ChartsModule,
    WavesModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ChartModule,
    DialogModule,
    ButtonModule,
    SplitButtonModule,
    CascadeSelectModule,
    DropdownModule,
    MatTabsModule,
    MultiSelectModule,
    CardModule,
    TooltipModule,
    CalendarModule,
    ConfirmPopupModule,
    AccordionModule,
    TabMenuModule,
    ImageModule,
    TimelineModule,
    CheckboxModule,
    SkeletonModule,
    EditorModule,
    CheckboxModule,
    TableModule,
    ProgressBarModule,
    RadioButtonModule,
    GalleriaModule,
    InputSwitchModule,
    SidebarModule,
    DragDropModule,
    BlockUIModule,
    ProgressSpinnerModule,
    AvatarGroupModule,
    AvatarModule,
    TagModule,
    SelectButtonModule,
    ToggleButtonModule,
    FileUploadModule,
    HttpClientModule,
    TabViewModule,
    PanelModule,
    SpeedDialModule,
    OrganizationChartModule,
    OverlayPanelModule,
    AutoCompleteModule,
    LoadingDotsComponent,
    InputTextModule,
    NgxIntlTelInputModule,
    InputNumberModule,
    RatingModule,
    MatRadioModule
  ]
})
export class AngularMaterialModule { }
