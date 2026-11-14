import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BmsStateModule } from '../components/bms/bms-state.module';
import { AnnouncementDialogComponent } from './announcement-dialog/announcement-dialog.component';
import { AppShellComponent } from './app-shell.component';
import { AppHeaderComponent } from './header/app-header.component';
import { OpenToWorkDialogComponent } from './open-to-work/open-to-work.component';
import { AppSidebarComponent } from './sidebar/app-sidebar.component';

/** The application shell: the only place that renders global navigation chrome. */
@NgModule({
  declarations: [AppShellComponent, AppSidebarComponent, AppHeaderComponent, AnnouncementDialogComponent, OpenToWorkDialogComponent],
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    DialogModule, ButtonModule, BlockUIModule, ProgressSpinnerModule, BmsStateModule,
  ],
  exports: [AppShellComponent],
})
export class LayoutModule {}
