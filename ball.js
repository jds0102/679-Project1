//Every ball is fully Aware of the canvas
var theCanvas = document.getElementById("mycanvas");
var theContext = theCanvas.getContext("2d");
//Constants for now.
var ballcolor = "#FFFF00";      // yellow fill
var ballstroke = "#000000";     // black outline
var circ = Math.PI*2;
 
function ball(x,y,radius)
{
	this.x =x;
	this.y =y;
	this.dx =5;
	this.dy =5;
    this.radius = radius;
	this.color = "#FFFF00";
	
    this.draw = function() {
        theContext.strokeStyle = "#FFFF00";
        theContext.fillStyle = this.color;
        theContext.beginPath();
        theContext.arc(this.x,this.y,this.radius,0,circ,true);
        theContext.moveTo(this.x,this.y);
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
    };
    
    this.move = function(key) {
		
		switch (key) {
		case 38:  /* Up arrow was pressed */
			if (this.y - this.dy > 0){
				this.y -= this.dy;
			}
			break;
		case 40:  /* Down arrow was pressed */
			if (this.y + this.dy < 600){
				this.y += this.dy;
			}
			break;
		case 37:  /* Left arrow was pressed */
			if (this.x - this.dx > 0){
				this.x -= this.dx;
			}
			break;
		case 39:  /* Right arrow was pressed */
			if (this.x + this.dx < 600){
				this.x += this.dx;
			}
			break;
		}
    };

}


enemy.prototype = new ball();

function enemy(x,y,radius)
{
	this.x =x;
	this.y =y;
	this.dx =5;
	this.dy =5;
	this.vX = 1;
	this.vY = 1;
    this.radius = radius;
	this.following;
	this.color = "#FF0000";
	
	this.norm = function () {
            var z = Math.sqrt(this.vX * this.vX + this.vY * this.vY );
            z = 1.0 / z;
            this.vX *= z;
            this.vY *= z;
    };
    
    this.move = function() {
		this.vX = this.following.x - this.x;
		this.vY = this.following.y - this.y;
		this.norm();
		this.x += this.vX;
		this.y += this.vY;
		
    };
	
	
	
	this.follow = function(objectToFollow) {
		this.following = objectToFollow;
	};

}
