import { Injectable } from '@angular/core';
import { Match } from "src/app/match";
import { MatchStorageService } from './match-storage.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class MatchHistoryService {

  public MATCHES: Match[] = [];
  public defaultMatch: Match = new Match('Sam', 'Will', 6, 2, 1, "randomID");

  constructor(private matchStorageService: MatchStorageService, private storage: Storage) {
    //this.updateFromStorage();

    var defaultRallies: number[] = [0, 0, 1, 3, 3, 9, /*game1*/
      2, 4, 4, 6, 3, 1, 5, 5, 3, 1, 7, 7, /*p1 is winning 3-1 p1 serving*/
      9, 11, 21, 2, 6, 10, 3, 1]
    for (let i = 0; i < defaultRallies.length; i++) {
      this.defaultMatch.addPoint(defaultRallies[i]);
    }
    //this.MATCHES.push(this.defaultMatch);

  }

  getMatches(): Match[] {
    this.storage.get('savedMatches').then((val) => {
      this.MATCHES = val[val.length - 1];
    })
    return this.MATCHES;
  }

/*
  updateFromStorage() {
    this.matchStorageService.getAllMatches().then(res => {
      this.MATCHES = res;
    })
  }*/

  getCurrentMatch(): Match {
    //this.updateFromStorage();
    this.storage.get('savedMatches').then((val) => {
      this.MATCHES = val[val.length - 1];
    })
    return this.MATCHES[0];
    //return this.defaultMatch;
  }

  addMatch(match: Match) {
    if (this.getMatches() == null) {
      this.MATCHES = [];
    } else {
      this.MATCHES = this.getMatches();
    }
    this.MATCHES.push(match);
    this.storage.set('savedMatches', this.MATCHES);

  }

}
