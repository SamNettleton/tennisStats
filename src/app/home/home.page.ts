import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MatchHistoryService } from '../matchhistory.service';
import { Match } from "src/app/match";
import { Platform, IonList } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public matches: Match[];

  constructor( private matchHistoryService: MatchHistoryService, private plt: Platform, private router: Router ) {
    //this.matchHistoryService.addMatch(new Match('Sam', 'Will', 6, 2, 1, "randomID"));
    this.plt.ready().then(() => {
      this.loadItems();
      //this.displayMatchHistory();
    });
  }

  ngOnInit() {
    //this.matches = this.matchHistoryService.getMatches();
  }

  loadItems() {
    this.matchHistoryService.getMatches().then(items => {
      this.matches = items;
      //console.log(this.matches);
    });
  }

  viewMatch(match: Match) {

    this.matchHistoryService.setActive(this.matches.indexOf(match));
    this.router.navigate(['track-match']);
  }

}
