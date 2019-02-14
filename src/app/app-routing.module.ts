import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './home/home.module#HomePageModule' },
  { path: 'match-setup', loadChildren: './match-setup/match-setup.module#MatchSetupPageModule'},
  { path: 'track-match', loadChildren: './track-match/track-match.module#TrackMatchPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' }

];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
