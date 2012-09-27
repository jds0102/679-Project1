var title = new Image();   // Create new img element
title.src = 'Title.png';

var control = new Image();   // Create new img element
control.src = 'Control.png';

var instruct1 = new Image();   // Create new img element
instruct1.src = 'Intruct1.png';

var death = new Image();   // Create new img element
death.src = 'death.png';

var enter = new Image();   // Create new img element
enter.src = 'enter.png';


gameInitialize("intro");

function gameLoop()
{
    theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
	for(var index = 0; index<funcArray.length; index++)
	{
		funcArray[index].call();
	}
	reqFrame(gameLoop);
}
	window.addEventListener('keydown',keyPressed,true);
	window.addEventListener('keyup',keyReleased,true);
gameLoop();