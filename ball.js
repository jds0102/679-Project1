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
    Ball.apply(this, arguments);
	
    this.move = function(key) {	
		switch (key) {
		case 38:  /* Up arrow was pressed */
			if (this.y - this.radius - this.vy > 0){
				this.y -= this.vy;
			}
			break;
		case 40:  /* Down arrow was pressed */
			if (this.y + this.radius + this.vy < theCanvas.height){
				this.y += this.vy;
			}
			break;
		case 37:  /* Left arrow was pressed */
			if (this.x - this.radius - this.vx > 0){
				this.x -= this.vx;
			}
			break;
		case 39:  /* Right arrow was pressed */
			if (this.x + this.radius + this.vx < theCanvas.width){
				this.x += this.vx;
			}
			break;
		}
    };
}

//EnemyBall
EnemyBall.prototype = new Ball();

function EnemyBall(x,y,vx,vy,radius,color)
{
    Ball.apply(this, arguments);
	this.following;
	
	this.norm = function () {
            var z = Math.sqrt(this.vx * this.vx + this.vy * this.vy );
            z = 1.0 / z;
            this.vx *= z;
            this.vy *= z;
    };
    
    this.move = function() {
		this.vx = this.following.x - this.x;
		this.vy = this.following.y - this.y;
		this.norm();
		this.x += this.vx;
		this.y += this.vy;
		
    };

	this.follow = function(objectToFollow) {
		this.following = objectToFollow;
	};

}

