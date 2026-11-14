import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BmsStateComponent } from './bms-state.component';

/** Loading / empty / error / success primitive, shared by BMS pages and the application shell. */
@NgModule({ declarations: [BmsStateComponent], imports: [CommonModule], exports: [BmsStateComponent] })
export class BmsStateModule {}
