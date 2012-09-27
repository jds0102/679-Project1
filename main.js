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
	
	var userInput = new Array(false,false,false,false); 
	// Order of storage is UP,DOWN,LEFT,RIGHT; Stored as booleans
	var gameState = "intro";
	var score = 0;
	
	var currentFlock =0;
	var flockCount = 0;
	
	var radius = 5;
		
	var theBalls = []; //The array of all the balls. Only used for bouncing
	var theFlocks =[]; //Seperate for faster alignment.

	var player = new PlayerBall(450,220,8,8,5,"#00FF00");
    var food = new Ball(10,10,0,0,8,"#D9D919");
	var minDistance = (player.radius+food.radius)*(player.radius+food.radius);
	
	function generateBall()
	{
	    b = new EnemyBall(50+Math.random()*500, 50+Math.random()*500,2,2,5, "#FFFFFF");
	    if(currentFlock == 0 && flockCount == 0)
		{
			var firstFlock = new Flock('#'+Math.floor(Math.random()*16777215).toString(16));
			theFlocks.push(firstFlock);
			theFlocks[currentFlock].addBall(b);
			flockCount++;
		}
		else if(flockCount<10)
		{
		   //get out the first ball and try to place us close to them
		   var first = theFlocks[currentFlock].balls[0];
		   
		   b.x = first.x + (Math.random()*radius*14-radius*7);
		   b.y = first.y + (Math.random()*radius*14-radius*7);
		   theFlocks[currentFlock].addBall(b);
		   flockCount++;
		}
		else
		{
		   var tempFlock = new Flock('#'+Math.floor(Math.random()*16777215).toString(16));
		   tempFlock.addBall(b);
		   theFlocks.push(tempFlock);
		   flockCount = 1;
		   currentFlock++;
		}
		theBalls.push(b);
	}
	//I use this for testing. we can turn it off later.
	function gameInitialize(type)
	{
	    theBalls = new Array();
		theFlocks = new Array();
		
		currentFlock = 0;
		flockCount = 0;
		
		if(type == "intro")
		{
			for(var balls = 0; balls < 50; balls++)
			{
				generateBall();
            }    
	   }
	   else
	   {
	        theBalls.push(food);
			theBalls.push(player);
	        generateBall();
	   }
	}
	
	function switchState(evt)
	{
	    if(evt.keyCode == 13)
		{
		    if(gameState == "intro")
			{ 
			    gameState = "playing";
				setupNewGame();
			}
			else if(gameState == "gameover")
			{
			    score = 0;
			    gameState = 'intro';
				gameInitialize("intro");
				introLoop();
			}
		}
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
	function checkFood()
	{
        var d = (player.x-food.x)*(player.x-food.x) +(player.y-food.y)*(player.y-food.y);
		
        if (d < minDistance) {
		    score++;
            food.x = 50+Math.random()*500;
			food.y = 50+Math.random()*500;

			generateBall();
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
            if (!(bi.x == player.x && bi.y == player.y) && d < rad) {
				gameState = "gameover";
            }
        }
	}
	function drawScore()
	{
		theContext.fillStyle = '#CCCCCC';
		theContext.font = 'italic bold 200px sans-serif';
		theContext.textBaseline = 'bottom';
		if(score >= 10)
		 theContext.fillText(score, 170, 400);
		 else
		 theContext.fillText(score, 240, 400);
	}
    // this function will do the drawing
    function drawObjects() {
        // clear the window
        theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
		if(gameState == "playing")
			drawScore();
        // draw the balls - too bad we can't use for i in theBalls
		for(var i = 0; i < theBalls.length; i++)
	    {
		    theBalls[i].draw();
		}
    }
    function updateObjects()
	{
		updatePlayer(); 
		player.norm();
		player.move();
		
		for(var i = theFlocks.length-1; i >=0 ; i--)
		{
		   theFlocks[i].align();
		   theFlocks[i].norm();
		   for(var j = i-1; j>=0; j--)
		   {
		      theFlocks[i].repel(theFlocks[j]);
		   }
		   theFlocks[i].norm();
		}
		bounce(theBalls);
	    //first we need to set the correct place to follow
	    for(var i = 0; i < theFlocks.length; i++)
		{
		   theFlocks[i].update();
		}
		//Then we need to adjust the flock to the direction of the leader
		//align(theBalls);
	    

		checkFood();
		checkDeath();
	}
	
	function doClick(evt){
}
	
	function keyPressed(evt){
		switch (evt.keyCode) {
		case 37: //left
			userInput[2] = true;
			break;
		case 38: //up
			userInput[0] = true;
			break;
		case 39: //right
			userInput[3] = true;
			break;
		case 40: //down
			userInput[1] = true;
			break;
		}
    }
	
    function keyReleased(evt){
	    if(gameState='playing')
		{
			switch (evt.keyCode) {
			case 37: //left
				userInput[2] = false;
				break;
			case 38: //up
				userInput[0] = false;
				break;
			case 39: //right
				userInput[3] = false;
				break;
			case 40: //down
				userInput[1] = false;
				break;
			}
		}
    }

	//Returns an array that contains the vector of the players 
	//movement. X is at position 0, Y is at 1
	function updatePlayer(){
		var x = 0;
		var y = 0;
		if (userInput[0]){
			y --;
		} 
		if (userInput[1]){
			y ++;
		}
		if (userInput[2]){
			x --;
		}
		if (userInput[3]){
			x ++;
		}	
		if (player.getX() > 595 && x > 0) {
			x = 0;
		} else if (player.getX() < 5 && x < 0) {
			x = 0;
		}
		if (player.getY() > 595 && y > 0) {
			y = 0;
		} else if (player.getY() < 5 && y < 0) {
			y = 0;
		}
		player.setVelocity(x,y);		
	}
	
	var GameOver = new Image()
	GameOver.src = "GameOver.png";
	
	var finalScore = new Image()
	finalScore.src = "finalScore.png";
	function drawGameOver()
	{
	   theContext.drawImage(GameOver,160,180);
	   theContext.drawImage(finalScore,110,350);
	   
	    theContext.strokeStye = "#000000";
	   	theContext.fillStyle = '#D9D919';
		theContext.font = 'italic bold 50px sans-serif';
		theContext.textBaseline = 'bottom';
		if(score >= 10)
		{
		 theContext.fillText(score, 390, 410);
		 theContext.strokeText(score, 390, 410);
		 }
		else
		{
		 theContext.fillText(score, 390, 410);
		 theContext.strokeText(score, 390, 410);
		}
	}
	function gameOverLoop()
	{
	    if(gameState == "gameover")
		{
			updateObjects();
			drawObjects();
			drawGameOver();
			reqFrame(gameOverLoop);
		}
	}
    function drawLoop() {
	    if(gameState == "playing")
		{
			updateObjects();
			drawObjects();
			reqFrame(drawLoop);
		}
		else
		{
		    for( i = 0; i < userInput.length; i++)
			{
			   userInput[i] = 0;
			}
			window.removeEventListener('keydown',keyPressed,true);
			window.removeEventListener('keyup',keyReleased,true);
			window.addEventListener('keydown',switchState,true);
			gameOverLoop();
		}
    }
	
	function setupNewGame()
	{
		window.removeEventListener('keydown',switchState,true);
		window.addEventListener('keydown',keyPressed,true);
		window.addEventListener('keyup',keyReleased,true);
		theCanvas.addEventListener("click",doClick,false);
		
		gameInitialize();
		drawLoop();
	}
