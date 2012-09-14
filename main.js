
// note: I am choosing to do this as an "onload" function for the
// window (so it gets run when the window is done loading), rather 
// than as a function of the canvas.
window.onload = function() {
    // I am putting my "Application object" inside this function
    // which might be a little bit inelegant, but it works
    
    // figure out what the "requestAnimationFrame" function is called
    // the problem is that different browsers call it differently
    // if we don't have it at all, just use setTimeout
    var reqFrame =window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element){
            window.setTimeout(callback, 1000 / 60);
        };


    // "application" level variables (not totally global, but used by all
    // of the functions defined inside this function
	// get the canvas (assumes that its there)
	var theCanvas = document.getElementById("mycanvas");
	var theContext = theCanvas.getContext("2d");
    // these are effectively the constants
    var ballcolor = "#FFFF00";      // yellow fill
    var ballstroke = "#000000";     // black outline
    var circ = Math.PI*2;           // complete circle
	var HEIGHT = 400;
	var WIDTH = 600;
    var radius = 5.0;
    
    // create a prototype ball
    // this is a slightly weird way to make an object, but it's very
    // javascripty
    var anObject = {
        "x" : 100,
        "y" : 100,
		"dy" : 5,
		"dx" : 5,
    
        draw : function() {
            theContext.strokeStyle = ballstroke;
            theContext.fillStyle = ballcolor;
            theContext.beginPath();
            theContext.arc(this.x,this.y,radius,0,circ,true);
            theContext.moveTo(this.x,this.y);
            theContext.closePath();
            theContext.stroke();
            theContext.fill();
        },
    
        move: function(key) {
		
		switch (key) {
		case 38:  /* Up arrow was pressed */
			if (this.y - this.dy > 0){
				this.y -= this.dy;
			}
			break;
		case 40:  /* Down arrow was pressed */
			if (this.y + this.dy < HEIGHT){
				this.y += this.dy;
			}
			break;
		case 37:  /* Left arrow was pressed */
			if (this.x - this.dx > 0){
				this.x -= this.dx;
			}
			break;
		case 39:  /* Right arrow was pressed */
			if (this.x + this.dx < WIDTH){
				this.x += this.dx;
			}
			break;
		}
        },

    };

   var playerBall = new ball(300,300,10);
    // this function will do the drawing
    function drawObjects() {
        // clear the window
        theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
        // draw the balls - too bad we can't use for i in theBalls
        //anObject.draw();
		playerBall.draw();
    }
     
     
    // what to do when things get clicked
    function keyPressed(evt){
        // a catch - we need to adjust for where the canvas is!
        // this is quite ugly without some degree of support from
        // a library
		anObject.move(evt.keyCode);
		
    }
    window.addEventListener('keydown',keyPressed,true);

    // what we need to do is define a function that updates the position
    // draws, then schedules another iteration in the future
    // WARNING: this is the simplest, but not the best, way to do this
    function drawLoop() {
        drawObjects();     // show things
        reqFrame(drawLoop);
    }
    drawLoop();
}
