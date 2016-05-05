/*
myStupidBall.js
Author: Bochuan Du
*/

var myGamePiece;
var myObstacles = [];
var myScore;

//For Adjusting Difficulties
var obstacle_speed = 3;
var update_speed = 20;


function startGame() {
    myGamePiece = new component(0, 0, "gray", 10, 120, "circle");
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 180, 40, "text");
    gameOver = new component("30px", "Consolas", "red", 180, 180, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 600;//270
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, update_speed);
        this.interval = setInterval(updateJumpAvail, 300);

        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })


        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if(this.type == "circle"){
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(this.x+10, this.y, 20, 2*Math.PI,false)
            ctx.closePath()
            ctx.fill()
        }
        else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitTop();
        this.hitLeft();
        this.hitRight();
    }

    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            return true;
        }
        return false;
    }
    this.hitTop = function() {
        var rocktop = this.height;
        if (this.y < rocktop) {
            this.y = rocktop;
        }
    }
    this.hitLeft = function() {
        if (this.x < 5) {
            this.x = 5;
        }
    }
    this.hitRight = function() {
        if (this.x > 475) {
            this.x = 475;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }

        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            printGameOver();
            return;
        } 
    }

    if(myGamePiece.hitBottom()){
        printGameOver();
        return;
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(70)) {
        x = myGameArea.canvas.width;

        canvas_w = myGameArea.canvas.width;
        canvas_h = myGameArea.canvas.height;
        bar_w = 150
        bar_h = 15
        bar_w_var = gap = bar_w + (Math.random()>0.5 ? 1:-1)*Math.random()*100;

        //gap between bars
        minGap = 50;
        maxGap = 120;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);

        
        myObstacles.push(new component(bar_w_var, bar_h, "black", 0, canvas_h));
        myObstacles.push(new component(canvas_w-bar_w_var-gap, bar_h, "black", bar_w_var+gap, canvas_h));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += -obstacle_speed;
        myObstacles[i].update();
    }
    
    updateScore();
    updateBallPos();
    
}

//Avoid keeping pressing the UP button
function updateJumpAvail(){
    jump_flag = true;
}

function updateBallPos(){
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    myGamePiece.gravity = 0.05;
    if (myGameArea.key && myGameArea.key == 37) {
        myGamePiece.speedX = -6; 
    }
    if (myGameArea.key && myGameArea.key == 39) {
        myGamePiece.speedX = 6; 
    }
    if (myGameArea.key && myGameArea.key == 38){
        if(jump_flag){
            jump_flag = false;
            myGamePiece.speedY = -30;
            myGamePiece.gravitySpeed = 0.05;
        }
    }
    //if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1; }
    myGamePiece.newPos();
    myGamePiece.update();
}

function updateScore(){
    score = 0
    for (i = 0; i < myObstacles.length; i += 1) {
        if(myObstacles[i].y < myGamePiece.y){
            score = score+1;
        }
    }
    score = score/2;

    //Diificulty due to different score
    
    if(score > 5){ // Easy
        obstacle_speed = 4;
        update_speed = 13;
    }
    if(score > 10){ // Easy
        obstacle_speed = 6;
        update_speed = 10;
    }
    if(score > 20){ // Hard
        obstacle_speed = 7;
        update_speed = 8;
    }
    if(score > 30){ // Crazy
        obstacle_speed = 12;
        update_speed = 1;
    }

    myScore.text="Score: " + score;
    myScore.update();
}

function printGameOver(){
    gameOver.text="Game Over";
    gameOver.update();
}


function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
