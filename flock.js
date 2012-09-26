/*Keep a ratio of how much the direction affects us when we combine*/
var percentPlayer = .2;
var percentFlock = .8;

function Flock(color)
{
     this.balls = [];
	 this.color = color;
	 
	 this.addBall = function(ballToAdd)
	 {
		ballToAdd.color = this.color;
		this.balls.push(ballToAdd);
	 };
	 
	 this.draw = function()
	 {
	     for(var i=0; i<this.balls.length; i++) {
		     this.balls[i].draw();
		 }
	 };
	 
	 this.update = function(player)
	 {
		for(var i=0; i<this.balls.length;i++)
		{
			this.balls[i].norm();
			this.balls[i].move();
		}
	 };
	 this.norm = function()
	 {
		for(var i=0; i<this.balls.length;i++)
		{
			this.balls[i].norm();
		}
	 };
	this.repel = function(otherFlock)
    {
        var ali = 1; // alignment parameter - between 0 and 1
    
        // make temp arrays to store results
        // this is inefficient, but the goal here is to make it work first
        var newVX = new Array(this.balls.length);
        var newVY = new Array(this.balls.length);
    
        // do the n^2 loop over all pairs, and sum up the contribution of each
        for(var i=this.balls.length-1; i>=0; i--) {
            var bi = this.balls[i];
            var bix = bi.x;
            var biy = bi.y;
            newVX[i] = 0;
            newVY[i] = 0;
    
            for(var j=this.balls.length-1; j>=0; j--) {
                var bj = otherFlock.balls[j];
                // compute the distance for falloff
                var dx = bj.x - bix;
                var dy = bj.y - biy;
                var d = Math.sqrt(dx*dx+dy*dy);
                // add to the weighted sum
                newVX[i] += (bj.vx / (d+ali));
                newVY[i] += (bj.vy / (d+ali));
            }
        }
        for(var i=this.balls.length-1; i>=0; i--) {
            this.balls[i].vx = this.balls[i].vx-newVX[i];
            this.balls[i].vy = this.balls[i].vy-newVY[i];
        } 
    };
	this.align = function()
    {
        var ali = .9; // alignment parameter - between 0 and 1
    
        // make temp arrays to store results
        // this is inefficient, but the goal here is to make it work first
        var newVX = new Array(this.balls.length);
        var newVY = new Array(this.balls.length);
    
        // do the n^2 loop over all pairs, and sum up the contribution of each
        for(var i=this.balls.length-1; i>=0; i--) {
            var bi = this.balls[i];
            var bix = bi.x;
            var biy = bi.y;
            newVX[i] = 0;
            newVY[i] = 0;
    
            for(var j=this.balls.length-1; j>=0; j--) {
                var bj = this.balls[j];
                // compute the distance for falloff
                var dx = bj.x - bix;
                var dy = bj.y - biy;
                var d = Math.sqrt(dx*dx+dy*dy);
                // add to the weighted sum
                newVX[i] += (bj.vx / (d+ali));
                newVY[i] += (bj.vy / (d+ali));
            }
        }
        for(var i=this.balls.length-1; i>=0; i--) {
            this.balls[i].vx = newVX[i];
            this.balls[i].vy = newVY[i];
        } 
    };
}