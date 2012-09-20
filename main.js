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
    var flock1 = new EnemyBall(100,200,1,1,5,"#FF0000");
	flock1.following = player;
	theBalls = [];
	
	theBalls.push(flock1);
	for (var i=0; i<10; i++) {
        b = new EnemyBall(50+Math.random()*500, 50+Math.random()*500,2,2,5, "#FF0000");
        theBalls.push(b)
		b.following = flock1;
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
	    for(var i = 0; i < theBalls.length; i++)
		{
		   theBalls[i].follow();
		}
	    bounce(theBalls);
        for(var i = 0; i < theBalls.length; i++)
		{
		    theBalls[i].norm();
		    theBalls[i].move();
		}
	}
	
    function keyPressed(evt){
		player.move(evt.keyCode);
    }

    function drawLoop() {
		updateObjects();
        drawObjects();
        reqFrame(drawLoop);
    }
		
	//Add the event Listener
    window.addEventListener('keydown',keyPressed,true);
	//Start the Game
    drawLoop();
}
