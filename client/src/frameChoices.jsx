import React, {useState, useEffect, useRef} from 'react';

const FrameChoices = ({frames, handleFrameChoice}) => {

	const [frameElements, setFrameElements] = useState([]);

	const createFrames = () => {
		var newFrames = [];
		frames.forEach((curFrame, idx) => {
			var canvas = document.createElement('canvas');
			canvas.width = 128;
			canvas.height = 128;
			var c = canvas.getContext("2d");
			for (var y = 0; y < 16; y++) {
				var curColumn = curFrame[y];
				for (var x = 0; x < 16; x++) {
					var yPos = x * canvas.width/16;
					var xPos = y * canvas.height/16;

					var curSquare = curColumn[x];
					c.fillStyle = curSquare;
					c.fillRect(xPos, yPos, 16, 16);
				}
			}
			newFrames.push(canvas);
		});
		setFrameElements(newFrames)
	}

	useEffect(createFrames,[frames]);

	return (
		<div id='frameChoices'>
			<div>Saved Frames</div>
			{frameElements.map((curElem, idx) => {
				return <canvas onClick={() => {handleFrameChoice(idx)}} className='frame' ref={(canvas) => {canvas && canvas.getContext("2d").drawImage(curElem, 0, 0);}} width={128} height={128}></canvas>
			})}
		</div>
	)
}

export default FrameChoices;