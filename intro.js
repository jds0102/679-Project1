function drawText()
{
	theContext.fillStyle = '#f00';
	theContext.font = 'italic bold 30px sans-serif';
	theContext.textBaseline = 'bottom';
	theContext.fillText('Flock Avoider', 50, 100);
	
	theContext.fillStyle = '#f00';
	theContext.font = 'italic bold 30px sans-serif';
	theContext.textBaseline = 'bottom';
	theContext.fillText('Arrow Keys To Move', 50, 200);
	
	theContext.fillStyle = '#f00';
	theContext.font = 'italic bold 30px sans-serif';
	theContext.textBaseline = 'bottom';
	theContext.fillText('Dont Touch The Other Balls', 50, 300);
	
	theContext.fillStyle = '#f00';
	theContext.font = 'italic bold 30px sans-serif';
	theContext.textBaseline = 'bottom';
	theContext.fillText('Press Enter To Start', 50, 400);
}
function introKeys(evt)
{
	if(evt.keyCode == 13)
	{
	    window.removeEventListener('keydown',introKeys,true);
	    setupNewGame();
	}
}
function introLoop()
{
	updateObjects();
    drawObjects();
    drawText();
	reqFrame(introLoop);
}
window.addEventListener('keydown',introKeys,true);

gameInitialize("intro");
introLoop();