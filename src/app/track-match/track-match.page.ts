import { Component, OnInit } from '@angular/core';
import { MatchHistoryService } from '../matchhistory.service';
import { Match } from "src/app/match";
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, Platform, IonList, PopoverController } from '@ionic/angular';
import { serialize } from "serializer.ts/Serializer";
import { ScorePopoverComponent } from '../components/score-popover/score-popover.component';

@Component({
  selector: 'app-track-match',
  templateUrl: './track-match.page.html',
  styleUrls: ['./track-match.page.scss'],
})
export class TrackMatchPage implements OnInit {

  public shots: string;
  public currentMatch: Match;
  public matches: Match[];
  public setScore: number[][];
  public gameScore: number[];
  public p1scoreElements: HTMLElement[];
  public p2scoreElements: HTMLElement[];
  public unregisterBackButtonAction: any;
  public serveType: number = 0;
  public firstServe: number = 0;
  public secondServe: number = 0;
  public errorType: number = 0;
  public forcedError: number = 0;
  public unforcedError: number = 0;
  public p1atNet: number = 0;
  public p2atNet: number = 0;
  public returnSide: string = '';
  public forehandReturn: number = 0;
  public backhandReturn: number = 0;

  constructor(private matchHistoryService: MatchHistoryService, private router: Router, private plt: Platform, private popoverController: PopoverController) {
    document.addEventListener('pause', () => {
      this.updateStorage();
    });
    this.plt.backButton.subscribe(() => {
      this.updateStorage();
    });
    this.plt.ready().then(() => {
        this.loadMatches();
    });
  }

  ngOnInit() {
    let btn = document.getElementById("submit-shots");
    btn.addEventListener("click", (e:Event) => this.addPoint());
    let increasebtn = document.getElementById("increase-shots");
    increasebtn.addEventListener("click", (e:Event) => this.increaseShots());
    let decreasebtn = document.getElementById("decrease-shots");
    decreasebtn.addEventListener("click", (e:Event) => this.decreaseShots());
    let statsBtn = document.getElementById("view-stats");
    statsBtn.addEventListener("click", (e:Event) => this.navigateToStats());
    let undoBtn = document.getElementById("undo-point");
    undoBtn.addEventListener("click", (e:Event) => this.undoPoint());
  }

  navigateToStats() {
    this.updateStorage();
    this.router.navigate(['tabs']);
  }

  loadMatches(): void {
    this.matchHistoryService.getMatches().then(items => {
      this.matches = items;
      this.setUpView();
    });
  }

  setUpView() {
    this.setCurrentMatch();
    document.getElementById('p1name').innerHTML = this.currentMatch.getPlayerNames()[0];
    document.getElementById('p2name').innerHTML = this.currentMatch.getPlayerNames()[1];
    document.getElementById('p1netname').innerHTML = this.currentMatch.getPlayerNames()[0];
    document.getElementById('p2netname').innerHTML = this.currentMatch.getPlayerNames()[1];
    this.setScore = this.currentMatch.getSetScore();
    this.gameScore = this.currentMatch.getGameScore();
    this.p1scoreElements = this.getElements('p1score');
    this.p2scoreElements = this.getElements('p2score');
    //update the score of all the setScore
    this.displayScores();
  }

  setCurrentMatch() {
    let rawObject: any = this.matches[this.matchHistoryService.getActive()];
    this.currentMatch = this.matchify(rawObject);
  }

  matchify(rawObject: any) {
    let matchObject: Match = new Match(rawObject.p1name, rawObject.p2name,
                                      rawObject.gamesPerSet,
                                      rawObject.sets, rawObject.server);
    matchObject.setServer(rawObject.server);
    matchObject.setGames(rawObject.p1games, rawObject.p2games);
    matchObject.setPoints(rawObject.p1points, rawObject.p2points);
    matchObject.setLengths(rawObject.p1lengths, rawObject.p2lengths);
    matchObject.setErrorTypes(rawObject.p1forced, rawObject.p1unforced, rawObject.p2forced, rawObject.p2unforced);
    matchObject.setServeTypes(rawObject.p1firstWon, rawObject.p1firstLost, rawObject.p1secondWon, rawObject.p1secondLost,
      rawObject.p2firstWon, rawObject.p2firstLost, rawObject.p2secondWon, rawObject.p2secondLost);
    matchObject.setNetPoints(rawObject.p1atNetWon, rawObject.p1atNetLost, rawObject.p2atNetWon, rawObject.p2atNetLost);
    matchObject.setReturns(rawObject.p1deuceReturns, rawObject.p2deuceReturns, rawObject.p1adReturns, rawObject.p2adReturns);
    return matchObject;
    /*
    firstServer: 1
    formattedScores: (2) ["0", "0"]
    fullThird: false
    gamesPerSet: 2
    matchFinished: false
    p1formatted: "0"
    p1games: [0]
    p1lengths: []
    p1name: "aosdfgh"
    p1points: 0
    p1scoreHistory: []
    p1sets: 0
    p1stbpoints: 0
    p1tbpoints: 0
    p2formatted: "0"
    p2games: [0]
    p2lengths: []
    p2name: "asipgh"
    p2points: 0
    p2scoreHistory: []
    p2sets: 0
    p2stbpoints: 0
    p2tbpoints: 0
    server: 1
    sets: 2
    */
  }

  updateStorage() {
    this.matches[this.matchHistoryService.getActive()] = this.currentMatch;
    this.matchHistoryService.updateStorage(this.matches);
  }

  increaseShots() {
    let shotCounter: HTMLElement = document.getElementById("shot-counter");
    shotCounter.innerHTML = (Number(shotCounter.innerHTML) + 1).toLocaleString();
  }

  decreaseShots() {
    let shotCounter: HTMLElement = document.getElementById("shot-counter");
    if (Number(shotCounter.innerHTML) != 0) {
      shotCounter.innerHTML = (Number(shotCounter.innerHTML) - 1).toLocaleString();
    }
  }

  async editScores() {
    this.editPopover();
    this.doRefresh();
  }

  doRefresh() {
    setTimeout(() => {
    }, 2000);
  }

  async editPopover() {
    let popover = await this.popoverController.create({
      component: ScorePopoverComponent,
      componentProps: {currentMatch: this.currentMatch, matchList: this.matches},
      translucent: false,
      cssClass: 'contact-popover'
    });
    popover.onDidDismiss().then(() => {
      this.setUpView();
    });
    return await popover.present();
  }

  addPoint() {
    //get the current shot count
    let shotCounter: HTMLElement = document.getElementById("shot-counter");
    this.shots = shotCounter.innerHTML;
    this.currentMatch.addPoint(Number(this.shots), this.forcedError, this.unforcedError, this.firstServe, this.secondServe, this.p1atNet, this.p2atNet, this.forehandReturn, this.backhandReturn);
    this.setScore = this.currentMatch.getSetScore();
    this.gameScore = this.currentMatch.getGameScore();
    this.p1scoreElements = this.getElements('p1score');
    this.p2scoreElements = this.getElements('p2score');
    this.displayScores();

    this.resetView();
  }

  undoPoint() {
    this.currentMatch.undoPoint();
    this.setScore = this.currentMatch.getSetScore();
    this.gameScore = this.currentMatch.getGameScore();
    this.p1scoreElements = this.getElements('p1score');
    this.p2scoreElements = this.getElements('p2score');
    this.displayScores();
  }

  changeServeType(serve: string) {
    let firstServeElement = document.getElementById("first") as HTMLInputElement;
    let secondServeElement = document.getElementById("second") as HTMLInputElement;
    if (this.serveType == Number(serve)) {
      firstServeElement.checked = false;
      secondServeElement.checked = false;
      this.firstServe = 0;
      this.secondServe = 0;
    } else if (Number(serve) == 1) {
      this.firstServe = 1;
      this.secondServe = 0;
    } else if (Number(serve) == 2) {
      this.firstServe = 0;
      this.secondServe = 1;
    }
    this.serveType = Number(serve);
  }

  changeErrorType(error: string) {
    let forcedErrorElement = document.getElementById("forced") as HTMLInputElement;
    let unforcedErrorElement = document.getElementById("unforced") as HTMLInputElement;
    if (this.errorType == Number(error)) {
      forcedErrorElement.checked = false;
      unforcedErrorElement.checked = false;
      this.forcedError = 0;
      this.unforcedError = 0;
    } else if (Number(error) == 1) {
      this.forcedError = 1;
      this.unforcedError = 0;
    } else if (Number(error) == 2) {
      this.forcedError = 0;
      this.unforcedError = 1;
    }
    this.errorType = Number(error);
  }

  changeReturnSide(side: string) {
    let forehandReturnElement = document.getElementById("forehandreturn") as HTMLInputElement;
    let backhandReturnElement = document.getElementById("backhandreturn") as HTMLInputElement;
    if (this.returnSide == side) {
      forehandReturnElement.checked = false;
      backhandReturnElement.checked = false;
      this.forehandReturn = 0;
      this.backhandReturn = 0;
    } else if (side == 'forehand') {
      this.forehandReturn = 1;
      this.backhandReturn = 0;
    } else if (side == 'backhand') {
      this.forehandReturn = 0;
      this.backhandReturn = 1;
    }
    this.returnSide = side;
  }

  changeNet(player: string) {
    if (player == '1') {
      this.p1atNet = (this.p1atNet + 1) % 2;
    }
    if (player == '2') {
      this.p2atNet = (this.p2atNet + 1) % 2;
    }
  }

  resetView() {
    //clear the shot counter
    let shotCounter: HTMLElement = document.getElementById("shot-counter");
    shotCounter.innerHTML = "0";
    //clear additional inputs
    let firstServeElement = document.getElementById("first") as HTMLInputElement;
    let secondServeElement = document.getElementById("second") as HTMLInputElement;
    let forcedErrorElement = document.getElementById("forced") as HTMLInputElement;
    let unforcedErrorElement = document.getElementById("unforced") as HTMLInputElement;
    let p1netElement = document.getElementById("p1net") as HTMLInputElement;
    let p2netElement = document.getElementById("p2net") as HTMLInputElement;
    let forehandReturnElement = document.getElementById("forehandreturn") as HTMLInputElement;
    let backhandReturnElement = document.getElementById("backhandreturn") as HTMLInputElement;
    firstServeElement.checked = false;
    secondServeElement.checked = false;
    forcedErrorElement.checked = false;
    unforcedErrorElement.checked = false;
    p1netElement.checked = false;
    p2netElement.checked = false;
    forehandReturnElement.checked = false;
    backhandReturnElement.checked = false;
    this.serveType = 0;
    this.firstServe = 0;
    this.secondServe = 0;
    this.errorType = 0;
    this.forcedError = 0;
    this.unforcedError = 0;
    this.p1atNet = 0;
    this.p2atNet = 0;
    this.forehandReturn = 0;
    this.backhandReturn = 0;
    this.returnSide = '';
  }

  getElements(initialText: String) {
    var htmlElements: HTMLElement[] = [];
    for (let i = 0; i < 6; i++) {
      htmlElements.push(document.getElementById(initialText + i.toLocaleString()));
    }
    return htmlElements;
  }

  displayScores() {
    this.setScore = this.currentMatch.getSetScore();
    this.gameScore = this.currentMatch.getGameScore();
    this.p1scoreElements = this.getElements('p1score');
    this.p2scoreElements = this.getElements('p2score');
    //update the score of all the setScore
    this.displaySetScore();
    //set score of current game, tiebreaker, or super tiebreaker
    this.displayGameScore();
    //make sure formatting is blank after other sets (in case removed set)
    this.updateNoneScore();
    this.displayServer();
  }

  displaySetScore() {
    for (let i = 0; i < this.setScore[0].length; i++) {
      this.p1scoreElements[i].classList.remove("game-score");
      this.p2scoreElements[i].classList.remove("game-score");
      //set past set scores with bolded winner
      if (this.setScore[0][i] > this.setScore[1][i] && i < this.setScore[0].length - 1) {
        this.p1scoreElements[i].style.fontWeight = 'bold';
        this.p2scoreElements[i].style.fontWeight = 'normal';
      } else if (i < this.setScore[0].length - 1) {
        this.p1scoreElements[i].style.fontWeight = 'normal';
        this.p2scoreElements[i].style.fontWeight = 'bold';
      }
      let p1SetScoreElement = <HTMLElement> this.p1scoreElements[i].childNodes[0];
      let p2SetScoreElement = <HTMLElement> this.p2scoreElements[i].childNodes[0];
      p1SetScoreElement.innerHTML = this.setScore[0][i].toLocaleString();
      p2SetScoreElement.innerHTML = this.setScore[1][i].toLocaleString();
      //this.p1scoreElements[i].innerHTML = this.setScore[0][i].toLocaleString();
      //this.p2scoreElements[i].innerHTML = this.setScore[1][i].toLocaleString();
      this.p1scoreElements[i].classList.add("set-score");
      this.p2scoreElements[i].classList.add("set-score");
    }
  }

  displayGameScore() {
    let p1GameScoreElement = <HTMLElement> this.p1scoreElements[this.setScore[0].length].childNodes[0];
    let p2GameScoreElement = <HTMLElement> this.p2scoreElements[this.setScore[0].length].childNodes[0];
    //if it's in a tiebreaker
    if (this.currentMatch.getTiebreakerScore()[0] > 0 || this.currentMatch.getTiebreakerScore()[1] > 0) {
      p1GameScoreElement.innerHTML = this.currentMatch.getTiebreakerScore()[0].toLocaleString();
      p2GameScoreElement.innerHTML = this.currentMatch.getTiebreakerScore()[1].toLocaleString();
    } else if (this.currentMatch.getSuperScore()[0] > 0 || this.currentMatch.getSuperScore()[1] > 0) {
      //if it's in a super tiebreaker
      p1GameScoreElement.innerHTML = this.currentMatch.getSuperScore()[0].toLocaleString();
      p2GameScoreElement.innerHTML = this.currentMatch.getSuperScore()[1].toLocaleString();
    } else {
      //change the score formatting for games into 15, 30, 40
      var modifiedGameScores: string[] = ["0", "0"];
      for (let i = 0; i < this.gameScore.length; i++) {
        if (this.gameScore[i] == 1) {
          modifiedGameScores[i] = "15";
        } else if (this.gameScore[i] == 2) {
          modifiedGameScores[i] = "30";
        } else if (this.gameScore[i] == 3) {
          modifiedGameScores[i] = "40";
        } else {
          modifiedGameScores[i] = "0";
        }
      }
      //account for deuce games
      if (this.gameScore[0] >= 3 && this.gameScore[1] >= 3) {
        //the game is tied, back to deuce
        if (this.gameScore[0] == this.gameScore[1]) {
          modifiedGameScores = ["40", "40"];
        } else if (this.gameScore[0] > this.gameScore[1]) {
          modifiedGameScores = ["AD", "40"];
        } else {
          modifiedGameScores = ["40", "AD"];
        }
      }

      p1GameScoreElement.innerHTML = modifiedGameScores[0];
      p2GameScoreElement.innerHTML = modifiedGameScores[1];
      this.p1scoreElements[this.setScore[0].length].classList.remove("none-score");
      this.p2scoreElements[this.setScore[0].length].classList.remove("none-score");
      this.p1scoreElements[this.setScore[0].length].classList.remove("set-score");
      this.p2scoreElements[this.setScore[0].length].classList.remove("set-score");
      this.p1scoreElements[this.setScore[0].length].classList.add("game-score");
      this.p2scoreElements[this.setScore[0].length].classList.add("game-score");
    }
  }

  updateNoneScore() {
    for (let i = this.setScore[0].length + 1; i < this.p1scoreElements.length; i++) {
      this.p1scoreElements[i].classList.remove("game-score");
      this.p2scoreElements[i].classList.remove("game-score");
      this.p1scoreElements[i].classList.remove("set-score");
      this.p2scoreElements[i].classList.remove("set-score");
      this.p1scoreElements[i].classList.add("none-score");
      this.p2scoreElements[i].classList.add("none-score");
      this.p1scoreElements[i].innerHTML = "<div></div>";
      this.p2scoreElements[i].innerHTML = "<div></div>";
      this.p1scoreElements[i].style.fontWeight = 'normal';
      this.p2scoreElements[i].style.fontWeight = 'normal';
    }
  }

  displayServer() {
    //get the current server and show a dot by their name
    let currentServer: number = this.currentMatch.getCurrentServer();
    if (currentServer == 1) {
      document.getElementById('p1serving').innerHTML = "•"
      document.getElementById('p2serving').innerHTML = ""
    } else {
      document.getElementById('p1serving').innerHTML = ""
      document.getElementById('p2serving').innerHTML = "•"
    }
  }

}
