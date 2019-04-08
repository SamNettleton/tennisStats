import { Component, OnInit } from '@angular/core';
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
  public gamesPerSet: number = 6;
  public setsPerMatch: number = 2;
  public serverSelected: number = 1;
  constructor(private matchHistoryService: MatchHistoryService, private matchStorageService: MatchStorageService, private router: Router) { }

  ngOnInit() {
    let btn = document.getElementById("btnstart");
    btn.addEventListener("click", (e:Event) => this.navigateToTracking());
  }

  navigateToTracking() {
    this.names = this.fetchNames();
    var server = this.fetchServer();
    let match = new Match(this.names[0], this.names[1], this.gamesPerSet, this.setsPerMatch, server);
    //this.saveMatch(match);
    //let id: string = this.generateId();
    this.matchHistoryService.addMatch(match);
    this.router.navigate(['track-match']);
  }

  fetchNames() {
      return [this.p1name, this.p2name];
  }

  fetchServer() {
    return this.serverSelected;
  }

  changeServer(server: string) {
    this.serverSelected = Number(server);
  }

  setsChange(val: any) {
    this.setsPerMatch = Number(val.detail.value);
  }

  gamesChange(val: any) {
    this.gamesPerSet = Number(val.detail.value);
  }
}
