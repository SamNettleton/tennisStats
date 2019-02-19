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
  public activeMatch: number = 0;

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

  getMatches(): Promise<Match[]> {
    return this.storage.get('savedMatches');
  }

  getCurrentMatch(): Match {
    this.getMatches().then(items => {
      this.MATCHES = items;
      console.log(items);
    });
    return this.MATCHES[this.activeMatch];
  }

  addMatch(match: Match) {
    return this.storage.get('savedMatches').then((items: Match[]) => {
      if (items) {
        items.push(match);
        console.log(items);
        console.log("old list");
        return this.storage.set('savedMatches', items);
      } else {
        console.log("new list");
        return this.storage.set('savedMatches', [match]);
      }
    });
  }

  setActive(index: number) {
    this.activeMatch = index;
  }

  getActive() {
    return this.activeMatch;
  }

}
