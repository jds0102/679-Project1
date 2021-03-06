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
	
	var ballColors = new Array ( 	"#EE00EE" , "#BBFFFF" ,
									"#E47833" , "#B22222" ,
									"#D9D919" , "#912CEE" ,
									"#C1FFC1" , "#FF0033" ,
									"#BF3EFF" , "#C71585" ,
									"#CECC15" , "#DD7500" ,
									"#F3F638" , "#EE82EE" ,
									"#FFCCFF" ,  "#FFFFFF"  );
	
	var userInput = new Array(false,false,false,false); 
	// Order of storage is UP,DOWN,LEFT,RIGHT; Stored as booleans
	var gameState = "intro";
	var score = 0;
	
	var currentFlock =0;
	var flockCount = 0;
	
	var lives = 3;
	var radius = 5;
		
	var theBalls = []; //The array of all the balls. Only used for bouncing
	var theFlocks =[]; //Seperate for faster alignment.

	var player = new PlayerBall(450,220,8,8,5,"#00FF00");
    var food = new Ball(10,10,0,0,8,"#ADFF2F");
    var powerup = new Powerup((Math.random() * 550) + 5,(Math.random() * 550) + 5, 10, "#2C75FF");
	var minDistance = (player.radius+food.radius)*(player.radius+food.radius);
	var minPowerupDistance = (player.radius+powerup.radius)*(player.radius+powerup.radius);
	
	
	var powerupStart = 0.0;
	var powerupActive = false;
	var powerupDisplayed = false;
	
	var currentDate = new Date();
	
	function generateBall()
	{
	    b = new EnemyBall(50+Math.random()*500, 50+Math.random()*500,2,2,5, "#FFFFFF");
	    if(currentFlock == 0 && flockCount == 0)
		{
			//var firstFlock = new Flock('#'+Math.floor(Math.random()*16777215).toString(16));
			var firstFlock = new Flock(ballColors[currentFlock]);
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
		   //var tempFlock = new Flock('#'+Math.floor(Math.random()*16777215).toString(16));
		   var tempFlock = new Flock(ballColors[currentFlock+1]);
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
			theBalls.push(powerup);
			for (i = 0; i < 1; i ++) {
				generateBall();
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
	function checkFood()
	{
        var d = (player.x-food.x)*(player.x-food.x) +(player.y-food.y)*(player.y-food.y);
		
        if (d < minDistance) {
		    score++;
            food.x = 50+Math.random()*500;
			food.y = 50+Math.random()*500;

			generateBall();
			if (score < 15) {
				generateBall();
			}
        }
	}
	
	function checkPowerup()
	{
		if (powerupDisplayed == true){
			var distance = (player.x-powerup.x)*(player.x-powerup.x) +(player.y-powerup.y)*(player.y-powerup.y);
			if (distance < minPowerupDistance) {
				powerupActive = true; 
				powerupDisplayed = false;
				powerup.x = (Math.random() * 550) + 5;
				powerup.y = (Math.random() * 550) + 5;
				powerupStart = new Date().getTime();
			}
		}
	}
	
    function checkDeath()
	{
        var rad = 2 * radius;
        rad = rad*rad;
        
        for(var i=theBalls.length-1; i>=0; i--) {
            var bi = theBalls[i];
            if (bi == powerup) {
            	continue;
            }
            var bix = bi.x;
            var biy = bi.y;
			var dx = player.x - bix;
			var dy = player.y - biy;
            var d = dx*dx+dy*dy;
            if (!(bi.x == player.x && bi.y == player.y) && d < rad) {
					gameState = "gameOver";
					funcArray.shift();
					funcArray.push(drawGameOver);
            }
        }
	}
	function drawScore()
	{
		theContext.fillStyle = '#CCCCCC';
		theContext.font = 'italic bold 200px sans-serif';
		theContext.textBaseline = 'bottom';
		if(score <10)
		 theContext.fillText(score, 240, 400);
		else if(score<100)
		 theContext.fillText(score, 170, 400);
		else
		 theContext.fillText(score, 120, 400);
	}
    // this function will do the drawing
    function drawObjects() {
        // draw the balls - too bad we can't use for i in theBalls
		for(var i = 0; i < theBalls.length; i++)
	    {
	    	if (theBalls[i] == powerup) {
	    		if (powerupDisplayed == true) {
	    			theBalls[i].draw();
	    		}
	    	} else {
		    	theBalls[i].draw();
		    }
		}
    }
    function updateObjects()
	{
		updatePlayer(); 
		player.norm();
		player.move();

		//Only update if the freezing powerup is not active
		if (powerupActive == false) {
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
			
			//Randomly make the powerup appear if it is not visible
			if (powerupDisplayed == false && Math.random() < (.001 * (score/35.0)) ) {
				powerupDisplayed = true;
			}
		}
		//Then we need to adjust the flock to the direction of the leader
		//align(theBalls);
	    
		if(gameState == "playing")
		{
			checkFood();
			checkDeath();
			if (powerupActive == true) {
				if (((new Date().getTime()) - powerupStart) > 5000) {
					powerupActive = false;
				}
			} else {
				checkPowerup();
			}
		}
		
		
	}
	function drawText()
{
    theContext.drawImage(title, 60,80);
	theContext.drawImage(control,110,180);
	theContext.drawImage(instruct1,110,240);
	theContext.drawImage(death,138,290);
	theContext.drawImage(enter,95,430);
}
	var funcArray = [
	updateObjects,
	drawObjects,
	drawText
];
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
		case 13:
		{
			if(gameState == "intro")
			{
				gameState ="playing";
				funcArray.pop();
				funcArray.unshift(drawScore);
				gameInitialize();
			}
			else if(gameState == "gameOver")
			{
				score = 0;
				gameState = "intro";
				funcArray.pop();
				funcArray.push(drawText);
				gameInitialize("intro");
			}
		}
		}
	}
	
    function keyReleased(evt){
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
