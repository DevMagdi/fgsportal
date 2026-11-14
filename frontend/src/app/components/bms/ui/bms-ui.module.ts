import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BmsPersonComponent } from './bms-person.component';
import { BmsSidePanelComponent } from './bms-side-panel.component';
import { BmsStatComponent } from './bms-stat.component';

/** Small presentational pieces shared by BMS pages. */
@NgModule({
  declarations: [BmsPersonComponent, BmsStatComponent, BmsSidePanelComponent],
  imports: [CommonModule],
  exports: [BmsPersonComponent, BmsStatComponent, BmsSidePanelComponent],
})
export class BmsUiModule {}
