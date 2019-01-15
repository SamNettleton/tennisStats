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

    constructor(p1name: string, p2name: string, gamesPerSet: number, sets: number, firstServer: number) {
        this.p1name = p1name;
        this.p2name = p2name;
        this.gamesPerSet = gamesPerSet;
        this.sets = sets;
        this.firstServer = firstServer;
    }

    getPlayerNames() {
      return [self.p1name, self.p2name]
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

    givePoint(shots: number) {
        //gives the winner of the previous point a point in either their game score, tiebreaker, or super tiebreaker
        let winner: number;
        let p1pointTypes: number[] = [this.p1points, this.p1tbpoints, this.p1stbpoints];
        let p2pointTypes: number[] = [this.p2points, this.p2tbpoints, this.p2stbpoints];
        let pointLists: number[][] = [p1pointTypes, p2pointTypes];
        if (this.server == 1) {
            if (shots % 2 == 0) {
                //this.p2points++;
                winner = 2;
            } else {
                //p1 won, decide point type
                //this.p1points++;
                winner = 1;
            }
        } else {
            if (shots % 2 == 0) {
                //p1 won, decide point type
                //this.p1points++;
                winner = 1;
            } else {
                //this.p2points++;
                winner = 2;
            }
        }
        //determine point type based on breakers
        if (this.p1games[-1] == this.gamesPerSet && this.p2games[-1] == this.gamesPerSet) {
            //regular tiebreaker
            pointLists[winner - 1][1]++;
            //change server if total points are odd
            if ((this.p1tbpoints + this.p2tbpoints) % 2 == 1) {
                this.changeServer();
            }
        } else if (this.p1sets == 1 && this.p2sets == 1) {
            //super tiebreaker
            pointLists[winner - 1][2]++;
            //change server if total points are odd
            if ((this.p1stbpoints + this.p2stbpoints) % 2 == 1) {
                this.changeServer();
            }
        } else {
            //normal game
            pointLists[winner - 1][0]++;
        }

    }

    checkPoints() {
        if ((this.p1points >= 4) && (this.p1points - this.p2points >= 2)) {
            //if p1 has 4 or more points and has >= 2 more points than p2
            this.p1points = 0;
            this.p2points = 0;
            this.changeServer();
            this.p1games[-1]++;
        } else if ((this.p2points >= 4) && (this.p2points - this.p1points >= 2)) {
            //if p2 has 4 or more points and has >= 2 more points than p1
            this.p1points = 0;
            this.p2points = 0;
            this.changeServer();
            this.p2games[-1]++;
        } else if (this.p1games[-1] == this.gamesPerSet && this.p2games[-1] < this.gamesPerSet - 1 || this.p1games[-1] == this.gamesPerSet + 1) {
            //if p1 has 6 games and p2 has less than 5, or if p1 has 7 games
            this.p1points = 0;
            this.p2points = 0;
            this.p1games.push(0);
            this.p2games.push(0);
            this.changeServer();
            this.p1sets++;
        } else if (this.p2games[-1] == this.gamesPerSet && this.p1games[-1] < this.gamesPerSet - 1 || this.p2games[-1] == this.gamesPerSet + 1) {
            //if p2 has 6 games and p1 has less than 5, or if p2 has 7 games
            this.p1points = 0;
            this.p2points = 0;
            this.p1games.push(0);
            this.p2games.push(0);
            this.changeServer();
            this.p2sets++;
        } else if (this.p1tbpoints >= 7 && this.p1tbpoints - this.p2tbpoints > 1) {
            //if p1 won a tiebreaker
            this.p1points = 0;
            this.p2points = 0;
            this.p1tbpoints = 0;
            this.p2tbpoints = 0;
            this.p1games[-1]++;
            this.p1games.push(0);
            this.p2games.push(0);
            this.p1sets++;
            if (this.server == this.firstServer ) {
                this.changeServer();
            }
        } else if (this.p2tbpoints >= 7 && this.p2tbpoints - this.p1tbpoints > 1) {
            //if p1 won a tiebreaker
            this.p1points = 0;
            this.p2points = 0;
            this.p1tbpoints = 0;
            this.p2tbpoints = 0;
            this.p2games[-1]++;
            this.p1games.push(0);
            this.p2games.push(0);
            if (this.server == this.firstServer ) {
                this.changeServer();
            }
            this.p2sets++;
        }
    }

    getScore() {
        //returns the current score of each set and the current game score
        return [this.p1games, this.p1points, this.p2games, this.p2points];
    }
}
