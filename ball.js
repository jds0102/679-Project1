//Every ball is fully Aware of the canvas for drawing
var theCanvas = document.getElementById("mycanvas");
var theContext = theCanvas.getContext("2d");
//Constants for now.
var ballcolor = "#FFFF00";      // yellow fill
var ballstroke = "#000000";     // black outline
var circ = Math.PI*2;
 
//A generic Ball. Has position, speed, radius and color
//Can only draw, move and bounces to stay on the canvas
function Ball(x,y,vx,vy,radius,color)
{
	this.x =x;
	this.y =y;
	this.vx = vx;
	this.vy = vy;
    this.radius = radius;
	this.color = color;
	
    this.norm = function () {
        var z = Math.sqrt(this.vx * this.vx + this.vy * this.vy );
        z = 1.0 / z;
        this.vx *= z;
	    this.vy *= z;
    };
	
    this.draw = function() {
        theContext.strokeStyle = "#0000000";
        theContext.fillStyle = this.color;
        theContext.beginPath();
        theContext.arc(this.x,this.y,this.radius,0,circ,true);
        theContext.moveTo(this.x,this.y);
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
    };
	
    this.move = function() {
		this.x += this.vx;
		this.y += this.vy;
		if (this.x + this.radius > theCanvas.width) {
			if (this.vx > 0) {
				this.vx = -this.vx;
			}
		}
		if (this.y + this.radius > theCanvas.height) {
			if (this.vy > 0) {
				this.vy = -this.vy;
			}
		}
		if (this.x - this.radius < 0) {
			if (this.vx < 0) {
				this.vx = -this.vx;
			}
		}
		if (this.y - this.radius < 0) {
			if (this.vy < 0) {
				this.vy = -this.vy;
			}
		}
    };
}

//Player Ball
PlayerBall.prototype = new Ball();
function PlayerBall(x,y,vx,vy,radius,color)
{	
	this.dx = x;
	this.dy = y;
  
	
    Ball.apply(this, arguments);	
  
	this.update = function() {
		 if (this.x != this.dx || this.y != this.dy) {
			this.vx = this.dx - this.x;
			this.vy = this.dy - this.y;
		 }
    };
	
	this.setDestination = function(nextX,nextY) {
		this.dx = nextX;
		this.dy = nextY;
    };
}

//EnemyBall
EnemyBall.prototype = new Ball();

function EnemyBall(x,y,vx,vy,radius,color)
{
    Ball.apply(this, arguments);
	this.following;
	this.flock;
	this.isLeader;
   
    this.follow = function() {
		this.vx = this.following.x - this.x;
		this.vy = this.following.y - this.y;
    };
}

