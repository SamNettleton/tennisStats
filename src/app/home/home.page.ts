import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MatchHistoryService } from '../matchhistory.service';
import { Match } from "src/app/match";
import { Router } from '@angular/router';
import { Platform, IonList, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public matches: Match[];
  public progress: number = 0;
  public interval: number;

  constructor( private matchHistoryService: MatchHistoryService, private plt: Platform, private router: Router, public alertController: AlertController ) {
    //this.matchHistoryService.addMatch(new Match('Sam', 'Will', 6, 2, 1, "randomID"));
    this.plt.ready().then(() => {
      this.loadItems();
    });
  }

  ngOnInit() {
  }

  loadItems() {
    this.matchHistoryService.getMatches().then(items => {
      this.matches = items;
      console.log(this.matches);
    });
  }

  newMatch() {
    this.router.navigate(['match-setup']);
  }

  viewMatch(match: Match) {
    this.matchHistoryService.setActive(this.matches.indexOf(match));
    this.router.navigate(['track-match']);
  }

  deleteMatch(match: Match) {
    this.presentAlert(match);
  }

  onPress($event, match: Match) {
        console.log("onPress", $event);
        this.startInterval(match);
    }

    onPressUp($event, match: Match) {
        console.log("onPressUp", $event);
        this.stopInterval();
    }

    startInterval(match: Match) {
        const self = this;
        if (self.progress >= 10) {
          this.deleteMatch(match);
        }
        this.interval = setInterval(function () {
            self.progress = self.progress + 1;
        }, 50);
    }

    stopInterval() {
        clearInterval(this.interval);
    }

  async presentAlert(match: Match) {
    const alert = await this.alertController.create({
      header: 'Delete Match',
      message: 'Are you sure you would like to delete this match?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.matches.splice(this.matches.indexOf(match), 1);
            this.matchHistoryService.updateStorage(this.matches);
            this.doRefresh();
          }
        }]
    });
    await alert.present();
  }

  doRefresh() {
    setTimeout(() => {
    }, 2000);
  }
}
