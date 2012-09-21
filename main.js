//So we wait for the window to completly load before doing this. But the place
//ment of the include depicts it gets loaded last. not Necessary?
window.onload = function() {

/*
SETUP CONSTANTS
*/
    var reqFrame =window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element){
            window.setTimeout(callback, 1000 / 60);
        };

	var theCanvas = document.getElementById("mycanvas");
	var theContext = theCanvas.getContext("2d");
	
	var radius = 5;
    var player = new PlayerBall(450,220,8,8,5,"#00FF00");
    //var flock1 = new EnemyBall(100,200,4,4,5,"#FF00FF");
	//flock1.following = player;
	//flock1.isLeader = 1;
	theBalls = []; //The array of all the balls
	theFlocks = []; //The array of flocks which are arrays of Balls
	
	//theBalls.push(flock1);
	for (var i=0; i<10; i++) {
        b = new EnemyBall(50+Math.random()*500, 50+Math.random()*500,2,2,5, "#FF0000");
        theBalls.push(b)
		b.flock = 1;
    }
		for (var i=0; i<10; i++) {
        b = new EnemyBall(50+Math.random()*500, 50+Math.random()*500,2,-2,5, "#FF00FF");
        theBalls.push(b)
		b.flock = 2;
    }
	
    function bounce(ballList) {
        var rad = 2 * radius;
        rad = rad*rad;
        
        for(var i=ballList.length-1; i>=0; i--) {
            var bi = ballList[i];
            var bix = bi.x;
            var biy = bi.y;
            // notice that we do the n^2 checks here, slightly painful
            for(var j=i-1; j>=0; j--) {
                var bj = ballList[j];
                var bjx = bj.x;
                var bjy = bj.y;
                var dx = bjx - bix;
                var dy = bjy - biy;
                var d = dx*dx+dy*dy;
                if (d < rad) {
                    bj.vx = dy;
                    bj.vy = dx;
                    bi.vx = -dx;
                    bi.vy = -dy;
                }
				
            }
        }
    }
	/*function align(ballList)
	{
	    var rad = 10 * radius;
        rad = rad*rad;
        
        for(var i=ballList.length-1; i>=0; i--) {
            var bi = ballList[i];
            var bix = bi.x;
            var biy = bi.y;
			if(!bi.isLeader)
			{
			    var bj = bi.following;
			    var bjx = bj.x;
                var bjy = bj.y;
                var dx = bjx - bix;
                var dy = bjy - biy;
				var d = dx*dx+dy*dy;
			    //compute distance between myself and leader
				if (d < rad) {
                    bi.vx = bj.vx;
					bi.vy = bj.vy;
                }
			}
        }
	}*/
	// Reynold's like alignment
    // each boid tries to make it's velocity to be similar to its neighbors
    // recipricol falloff in weight (allignment parameter + d
    // this assumes the velocities will be renormalized
    function align(ballList)
    {
        var ali = 3; // alignment parameter - between 0 and 1
    
        // make temp arrays to store results
        // this is inefficient, but the goal here is to make it work first
        var newVX = new Array(ballList.length);
        var newVY = new Array(ballList.length);
    
        // do the n^2 loop over all pairs, and sum up the contribution of each
        for(var i=ballList.length-1; i>=0; i--) {
            var bi = ballList[i];
			if(!bi.isLeader)
			{
            var bix = bi.x;
            var biy = bi.y;
            newVX[i] = 0;
            newVY[i] = 0;
			
            for(var j=ballList.length-1; j>=0; j--) {
                var bj = ballList[j];
				if(bj.flock == bi.flock)
				{
                // compute the distance for falloff
                var dx = bj.x - bix;
                var dy = bj.y - biy;
                var d = Math.sqrt(dx*dx+dy*dy);
                // add to the weighted sum
                newVX[i] += (bj.vx / (d+ali));
                newVY[i] += (bj.vy / (d+ali));
				}
				
            }
			}
			 var dx = player.x - bix;
                var dy = player.y - biy;
                var d = Math.sqrt(dx*dx+dy*dy);
                // add to the weighted sum
                newVX[i] += (player.vx / (d+10));
                newVY[i] += (player.vy / (d+10));
        }
        for(var i=ballList.length-1; i>=0; i--) {
		    if(!ballList[i].isLeader)
			{
				ballList[i].vx = newVX[i];
				ballList[i].vy = newVY[i];
			}
        } 
    }
    // this function will do the drawing
    function drawObjects() {
        // clear the window
        theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
        // draw the balls - too bad we can't use for i in theBalls
		for(var i = 0; i < theBalls.length; i++)
	    {
		    theBalls[i].draw();
		}
		player.draw();
    }
    function updateObjects()
	{
		player.update();
		player.norm();
		player.move();
	    //first we need to set the correct place to follow
	    for(var i = 0; i < theBalls.length; i++)
		{
		   //theBalls[i].follow();
		}
		//Then we need to adjust the flock to the direction of the leader
		align(theBalls);
	    bounce(theBalls);
        for(var i = 0; i < theBalls.length; i++)
		{
		    theBalls[i].norm();
		    theBalls[i].move();
		}
	}
	
	function doClick(evt){
        
        player.setDestination(evt.pageX - theCanvas.offsetLeft,
        evt.pageY - theCanvas.offsetTop);
    }
	
    function keyPressed(evt){
		//player.move(evt.keyCode);
    }

    // what we need to do is define a function that updates the position
    // draws, then schedules another iteration in the future
    // WARNING: this is the simplest, but not the best, way to do this
	alert("This is how you play");
    function drawLoop() {
		updateObjects();
        drawObjects();
        reqFrame(drawLoop);
    }
		
	//Add the event Listeners
    window.addEventListener('keydown',keyPressed,true);
	window.addEventListener('keyup',keyPressed,true);
    theCanvas.addEventListener("click",doClick,false);
	//Start the Game
    drawLoop();
}
