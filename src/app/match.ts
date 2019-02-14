import { MatchStorageService } from './match-storage.service';

export class Match {
    p1name: string
    p2name: string
    gamesPerSet: number
    sets: number
    firstServer: number;
    public server: number = 1;
    public p1lengths: number[] = [];
    public p2lengths: number[] = [];
    public p1points: number = 0;
    public p2points: number = 0;
    public p1games: number[] = [0];
    public p2games: number[] = [0];
    public p1sets: number = 0;
    public p2sets: number = 0;
    public p1tbpoints: number = 0;
    public p2tbpoints: number = 0;
    public p1stbpoints: number = 0;
    public p2stbpoints: number = 0;
    public matchFinished: boolean = false;
    public fullThird: boolean = false;
    public statHistory: number[][] = [];
    public p1scoreHistory: number[][] = [];
    public p2scoreHistory: number[][] = [];
    public id: string = "initialID";

    constructor(p1name: string, p2name: string, gamesPerSet: number, sets: number, firstServer: number, id: string) {
        this.id = id;
        this.p1name = p1name;
        this.p2name = p2name;
        this.gamesPerSet = gamesPerSet;
        this.sets = sets;
        this.firstServer = firstServer;
    }

    getPlayerNames() {
      return [this.p1name, this.p2name];
    }

    getCurrentServer() {
      return this.server;
    }

    getRallyLengths(player: number) {
      if (player == 1) {
        return this.p1lengths;
      } else {
        return this.p2lengths;
      }
    }

    changeServer() {
        //if p1 is serving, change to p2, if p2 is serving, change to p1
        if (this.server == 1) {
            this.server = 2;
        } else {
            this.server = 1;
        }
    }

    addPoint(shots: number) {
        this.recordHistory(shots);
        //add the point to the lengths list of current server
        if (this.server == 1) {
            this.p1lengths.push(shots);
        } else {
            this.p2lengths.push(shots);
        }
        //give the winner of the previous point a point
        this.givePoint(shots);
        //check points to see if a player won a game, set, or match
        this.checkPoints();
    }

    recordHistory(shots: number) {
      //history is taken in this order:
      //0: server (1 or 2), 1: rally length
      this.statHistory.push([this.server, shots]);
      var p1currentScore: number[] = [this.p1points];
      var p2currentScore: number[] = [this.p2points];
      for (let i = 0; i < this.p1games.length; i++) {
        p1currentScore.push(this.p1games[i]);
        p2currentScore.push(this.p2games[i]);
      }
      this.p1scoreHistory.push(p1currentScore);
      this.p2scoreHistory.push(p2currentScore);
    }

    undoPoint() {
      //remove the last point stats
      if (this.statHistory[this.statHistory.length - 1][0] == 1) {
        this.p1lengths = this.p1lengths.slice(0, this.p1lengths.length - 1);
      } else {
        this.p2lengths = this.p2lengths.slice(0, this.p2lengths.length - 1);
      }
      this.statHistory = this.statHistory.slice(0, this.statHistory.length - 1);
      //remove the last point from score
      var p1newGames: number[] = [];
      var p2newGames: number[] = [];
      this.p1points = this.p1scoreHistory[this.p1scoreHistory.length - 1][0];
      this.p2points = this.p2scoreHistory[this.p2scoreHistory.length - 1][0];
      for (let i = 1; i < this.p1scoreHistory[this.p1scoreHistory.length - 1].length; i++) {
        p1newGames.push(this.p1scoreHistory[this.p1scoreHistory.length - 1][i]);
        p2newGames.push(this.p2scoreHistory[this.p2scoreHistory.length - 1][i]);
      }
      this.p1games = p1newGames;
      this.p2games = p2newGames;
      this.p1scoreHistory = this.p1scoreHistory.slice(0, this.p1scoreHistory.length - 1);
      this.p2scoreHistory = this.p2scoreHistory.slice(0, this.p2scoreHistory.length - 1);
    }

    givePoint(shots: number) {
        //gives the winner of the previous point a point in either their game score, tiebreaker, or super tiebreaker
        let winner: number;
        if (this.server == 1) {
            if (shots % 2 == 0) {
                winner = 2;
            } else {
                //p1 won, decide point type
                winner = 1;
            }
        } else {
            if (shots % 2 == 0) {
                //p1 won, decide point type
                winner = 1;
            } else {
                winner = 2;
            }
        }
        //determine point type based on breakers
        if (this.p1games[this.p1games.length-(this.p1sets + this.p2sets)-1] == this.gamesPerSet && this.p2games[this.p2games.length-(this.p1sets + this.p2sets)-1] == this.gamesPerSet) {
            //regular tiebreaker
            if (winner == 1) {
              this.p1tbpoints++;
            } else {
              this.p2tbpoints++;
            }
            //change server if total points are odd
            if ((this.p1tbpoints + this.p2tbpoints) % 2 == 1) {
                this.changeServer();
            }
        } else if (this.p1sets == 1 && this.p2sets == 1 && this.fullThird == false) {
            //super tiebreaker
            if (winner == 1) {
              this.p1stbpoints++;
            } else {
              this.p2stbpoints++;
            }
            //change server if total points are odd
            if ((this.p1stbpoints + this.p2stbpoints) % 2 == 1) {
                this.changeServer();
            }
        } else {
            //normal game
            if (winner == 1) {
              this.p1points++;
            } else {
              this.p2points++;
            }
        }

    }

    checkPoints() {
        if ((this.p1points >= 4) && (this.p1points - this.p2points >= 2)) {
            //if p1 has 4 or more points and has >= 2 more points than p2
            this.p1points = 0;
            this.p2points = 0;
            this.changeServer();
            this.p1games[this.p1games.length - 1]++;
        } else if ((this.p2points >= 4) && (this.p2points - this.p1points >= 2)) {
            //if p2 has 4 or more points and has >= 2 more points than p1
            this.p1points = 0;
            this.p2points = 0;
            this.changeServer();
            this.p2games[this.p2games.length - 1]++;
        }

        //handle breakers
        if (this.p1tbpoints >= 7 && this.p1tbpoints - this.p2tbpoints > 1) {
            //if p1 won a tiebreaker
            this.p1tbpoints = 0;
            this.p2tbpoints = 0;
            this.p1games[this.p1games.length - 1]++;
            if (this.server == this.firstServer ) {
                this.changeServer();
            }
        } else if (this.p2tbpoints >= 7 && this.p2tbpoints - this.p1tbpoints > 1) {
            //if p2 won a tiebreaker
            this.p1tbpoints = 0;
            this.p2tbpoints = 0;
            this.p2games[this.p2games.length - 1]++;
            if (this.server == this.firstServer ) {
                this.changeServer();
            }
        }

        //handle SUPER breakers
        if (this.p1stbpoints >= 10 && this.p1stbpoints - this.p2stbpoints > 1) {
          //if p1 won a super tiebreaker
          this.p1games[this.p1games.length - 1]++;
        } else if (this.p2stbpoints >= 10 && this.p2stbpoints - this.p1stbpoints > 1) {
          //if p2 won a super tiebreaker
          this.p2games[this.p2games.length - 1]++;
        }

        //handle and of set
        if (this.p1games[this.p1games.length-1] == this.gamesPerSet && this.p2games[this.p2games.length-1] < this.gamesPerSet - 1 || this.p1games[this.p1games.length-1] == this.gamesPerSet + 1) {
            //if p1 has 6 games and p2 has less than 5, or if p1 has 7 games
            this.p1games.push(0);
            this.p2games.push(0);
            this.p1sets++;
        } else if (this.p2games[this.p2games.length-1] == this.gamesPerSet && this.p1games[this.p1games.length-1] < this.gamesPerSet - 1 || this.p2games[this.p2games.length-1] == this.gamesPerSet + 1) {
            //if p2 has 6 games and p1 has less than 5, or if p2 has 7 games
            this.p1games.push(0);
            this.p2games.push(0);
            this.p2sets++;
        }

    }

    getSetScore() {
      //returns the current score of each set
      return [this.p1games, this.p2games];
    }

    getGameScore() {
      //returns the current game score
      return [this.p1points, this.p2points];
    }

    getTiebreakerScore() {
      //retruns the current tiebreaker score
      return [this.p1tbpoints, this.p2tbpoints];
    }

    getSuperScore() {
      //retruns the current super tiebreaker score
      return [this.p1stbpoints, this.p2stbpoints];
    }

}
