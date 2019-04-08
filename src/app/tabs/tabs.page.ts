import { Component } from '@angular/core';
import { Match } from "src/app/match";
import { MatchHistoryService } from '../matchhistory.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public matches: Match[];
  public currentMatch: Match;

  constructor(private matchHistoryService: MatchHistoryService, private plt: Platform) {
    this.plt.ready().then(() => {
      this.loadItems();
    });
  }

  ngOnInit() { }

  loadItems() {
    this.matchHistoryService.getMatches().then(items => {
      this.matches = items;
      this.setCurrentMatch();
      this.setPlayerNames();
    });
  }

  setPlayerNames() {
    document.getElementById("p1Name").innerHTML = this.currentMatch.getPlayerNames()[0];
    document.getElementById("p2Name").innerHTML = this.currentMatch.getPlayerNames()[1];
  }

  setCurrentMatch() {
    let rawObject: any = this.matches[this.matchHistoryService.getActive()];
    this.currentMatch = this.matchify(rawObject);
  }

  matchify(rawObject: any) {
    let matchObject: Match = new Match(rawObject.p1name, rawObject.p2name,
                                      rawObject.gamesPerSet,
                                      rawObject.sets, rawObject.server);
    matchObject.setGames(rawObject.p1games, rawObject.p2games);
    matchObject.setPoints(rawObject.p1points, rawObject.p2points);
    matchObject.setLengths(rawObject.p1lengths, rawObject.p2lengths);
    return matchObject;
  }

}
