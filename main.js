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
	
	var score = 0;
	
	var radius = 5;
    var player = new PlayerBall(450,220,8,8,5,"#00FF00");
    var food = new Ball(100,100,0,0,10,"099000");
	var minDistance = (player.radius+food.radius)*(player.radius+food.radius);
	theBalls = []; //The array of all the balls
	
    function updateScore(score)
	{
	    document.getElementById("score").innerHTML = "Score: "+score;
	}
	//I use this for testing. we can turn it off later.
	function gameInitialize()
	{
	updateScore(score);
	theBalls = new Array();
	   for(var flock = 0; flock < 3; flock++)
	   {
	       //found this online. sorta understand how it works 16777215 = FFFFFF
	       color = '#'+Math.floor(Math.random()*16777215).toString(16);
	       for (var i=0; i<10; i++) {
		      //I found the random color thing online
              b = new EnemyBall(50+Math.random()*500, 50+Math.random()*500,2,2,5, color);
              theBalls.push(b)
		      b.flock = flock;
            }
	   }
	}
	gameInitialize()
	
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

	function checkFood()
	{
        var d = (player.x-food.x)*(player.x-food.x) +(player.y-food.y)*(player.y-food.y);
		
        if (d < minDistance) {
		    updateScore(++score);
            food.x = 50+Math.random()*500;
			food.y = 50+Math.random()*500;
        }
	}
    function checkDeath()
	{
        var rad = 2 * radius;
        rad = rad*rad;
        
        for(var i=theBalls.length-1; i>=0; i--) {
            var bi = theBalls[i];
            var bix = bi.x;
            var biy = bi.y;
			var dx = player.x - bix;
			var dy = player.y - biy;
            var d = dx*dx+dy*dy;
            if (d < rad) {
                alert("you Dead son");
				gameInitialize();
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
		food.draw();
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
		checkFood();
		checkDeath();
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
