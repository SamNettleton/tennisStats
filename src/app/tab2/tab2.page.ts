import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { MatchHistoryService } from '../matchhistory.service';
import { Match } from "src/app/match";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public currentMatch: Match;
  public matches: Match[];

  constructor(private matchHistoryService: MatchHistoryService, private plt: Platform) {
    this.plt.ready().then(() => {
      this.loadItems();
    });
  }

  loadItems() {
    this.matchHistoryService.getMatches().then(items => {
      this.matches = items;
      this.setUpView();
    });
  }

  setUpView() {
    this.setCurrentMatch();
    this.errorStats();
    this.serveStats();
    this.netStats();
    this.deuceReturnStats();
    this.adReturnStats();
  }

  errorStats() {
    document.getElementById('p1forced').innerHTML = this.currentMatch.getErrorTypes(1)[0];
    document.getElementById('p1unforced').innerHTML = this.currentMatch.getErrorTypes(1)[1];
    document.getElementById('p2forced').innerHTML = this.currentMatch.getErrorTypes(2)[0];
    document.getElementById('p2unforced').innerHTML = this.currentMatch.getErrorTypes(2)[1];
  }

  serveStats() {
    document.getElementById('p1firstwin').innerHTML = this.currentMatch.getServeStats(1)[0];
    document.getElementById('p1secondwin').innerHTML = this.currentMatch.getServeStats(1)[1];
    document.getElementById('p1first').innerHTML = this.currentMatch.getServeStats(1)[2];
    document.getElementById('p2firstwin').innerHTML = this.currentMatch.getServeStats(2)[0];
    document.getElementById('p2secondwin').innerHTML = this.currentMatch.getServeStats(2)[1];
    document.getElementById('p2first').innerHTML = this.currentMatch.getServeStats(2)[2];
  }

  netStats() {
    document.getElementById('p1netwon').innerHTML = this.currentMatch.getNetStats(1)[0];
    document.getElementById('p1netlost').innerHTML = this.currentMatch.getNetStats(1)[1];
    document.getElementById('p1netpercent').innerHTML = this.currentMatch.getNetStats(1)[2];
    document.getElementById('p2netwon').innerHTML = this.currentMatch.getNetStats(2)[0];
    document.getElementById('p2netlost').innerHTML = this.currentMatch.getNetStats(2)[1];
    document.getElementById('p2netpercent').innerHTML = this.currentMatch.getNetStats(2)[2];
  }

  deuceReturnStats() {
    document.getElementById('p1deuceall').innerHTML = this.currentMatch.getDeuceReturnStats(1)[0];
    document.getElementById('p1deucefirst').innerHTML = this.currentMatch.getDeuceReturnStats(1)[1];
    document.getElementById('p1deucesecond').innerHTML = this.currentMatch.getDeuceReturnStats(1)[2];
    document.getElementById('p2deuceall').innerHTML = this.currentMatch.getDeuceReturnStats(2)[0];
    document.getElementById('p2deucefirst').innerHTML = this.currentMatch.getDeuceReturnStats(2)[1];
    document.getElementById('p2deucesecond').innerHTML = this.currentMatch.getDeuceReturnStats(2)[2];
  }

  adReturnStats() {
    document.getElementById('p1adall').innerHTML = this.currentMatch.getAdReturnStats(1)[0];
    document.getElementById('p1adfirst').innerHTML = this.currentMatch.getAdReturnStats(1)[1];
    document.getElementById('p1adsecond').innerHTML = this.currentMatch.getAdReturnStats(1)[2];
    document.getElementById('p2adall').innerHTML = this.currentMatch.getAdReturnStats(2)[0];
    document.getElementById('p2adfirst').innerHTML = this.currentMatch.getAdReturnStats(2)[1];
    document.getElementById('p2adsecond').innerHTML = this.currentMatch.getAdReturnStats(2)[2];
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
    matchObject.setErrorTypes(rawObject.p1forced, rawObject.p1unforced, rawObject.p2forced, rawObject.p2unforced);
    matchObject.setServeTypes(rawObject.p1firstWon, rawObject.p1firstLost, rawObject.p1secondWon, rawObject.p1secondLost,
      rawObject.p2firstWon, rawObject.p2firstLost, rawObject.p2secondWon, rawObject.p2secondLost);
    matchObject.setNetPoints(rawObject.p1atNetWon, rawObject.p1atNetLost, rawObject.p2atNetWon, rawObject.p2atNetLost);
    matchObject.setReturns(rawObject.p1deuceReturns, rawObject.p2deuceReturns, rawObject.p1adReturns, rawObject.p2adReturns);
    return matchObject;
  }
}
