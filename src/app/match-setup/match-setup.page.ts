import {  Component, OnInit } from '@angular/core';
import { Match } from "src/app/match";
import { MatchHistoryService } from '../matchhistory.service';
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
  constructor(private matchHistoryService: MatchHistoryService, private router: Router) { }

  ngOnInit() {
    let btn = document.getElementById("btnstart");
    btn.addEventListener("click", (e:Event) => this.navigateToTracking());
  }

  navigateToTracking() {
    this.names = this.fetchNames();
    let match = new Match(this.names[0], this.names[1], 2, 2, 1);
    this.matchHistoryService.addMatch(match);
    this.router.navigate(['track-match']);
  }

  fetchNames() {
      return [this.p1name, this.p2name];
  }
}
