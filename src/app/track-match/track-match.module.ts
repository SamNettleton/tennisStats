import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TrackMatchPage } from './track-match.page';
import { ComponentsModule } from '../components/components.module';
import { ScorePopoverComponent } from '../components/score-popover/score-popover.component';

const routes: Routes = [
  {
    path: '',
    component: TrackMatchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
        ScorePopoverComponent,
  ],
  declarations: [TrackMatchPage]
})
export class TrackMatchPageModule {}
