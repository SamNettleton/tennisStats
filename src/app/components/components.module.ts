import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScorePopoverComponent } from './score-popover/score-popover.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ScorePopoverComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ScorePopoverComponent]
})
export class ComponentsModule { }
