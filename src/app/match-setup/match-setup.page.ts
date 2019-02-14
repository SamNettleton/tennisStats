import {  Component, OnInit } from '@angular/core';
import { Match } from "src/app/match";
import { MatchHistoryService } from '../matchhistory.service';
import { MatchStorageService } from '../match-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-setup',
  templateUrl: './match-setup.page.html',
  styleUrls: ['./match-setup.page.scss'],
})
export class MatchSetupPage implements OnInit {

  public names: string[];
  public p1name: string;
  public p2name: string;
  constructor(private matchHistoryService: MatchHistoryService, private matchStorageService: MatchStorageService, private router: Router) { }

  ngOnInit() {
    let btn = document.getElementById("btnstart");
    btn.addEventListener("click", (e:Event) => this.navigateToTracking());
  }

  navigateToTracking() {
    this.names = this.fetchNames();
    let match = new Match(this.names[0], this.names[1], 2, 2, 1, 'testing');
    //this.saveMatch(match);
    //let id: string = this.generateId();
    this.matchHistoryService.addMatch(match);
    this.router.navigate(['track-match']);
  }

  saveMatch(match: Match) {
    debugger;
    //this.matchStorageService.storeMatch(match).then(() => {
    //});
  }

  generateId() {
    let baseId: string = this.names[0].concat(this.names[1]);
    let id: string = baseId;
    let counter: number = 0;
    let check: Promise<boolean> = this.matchStorageService.idExists(id);
    /*
    while (this.matchStorageService.idExists(id)) {
      let check: number = this.matchStorageService.idExists(id);
      id = baseId.concat(String(counter));
      counter++;
    }*/
    return id;
  }

  fetchNames() {
      return [this.p1name, this.p2name];
  }
}
