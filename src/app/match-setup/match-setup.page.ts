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

  constructor(private matchHistoryService: MatchHistoryService) {
    document.getElementById ("btnstart").addEventListener ("click", function() {
      let match = new Match("sam", "will", 2, 2, 1);
      this.router = Router
      this.router.navigateByUrl('/login');
      this.router.navigate(['track-match']);
    }); }

  ngOnInit() {

  }
}
