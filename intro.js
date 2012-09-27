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

function drawText()
{
    theContext.drawImage(title, 60,80);
	theContext.drawImage(control,110,180);
	theContext.drawImage(instruct1,110,240);
	theContext.drawImage(death,138,290);
	theContext.drawImage(enter,95,430);
}
function introLoop()
{
	updateObjects();
	drawObjects();
	drawText();
	reqFrame(introLoop);

}

window.addEventListener('keydown',switchState,true);
gameInitialize("intro");
introLoop();