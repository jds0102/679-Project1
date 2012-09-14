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
		playerBall.move(evt.keyCode);
		
    }
	
	//Add the event Listener
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
