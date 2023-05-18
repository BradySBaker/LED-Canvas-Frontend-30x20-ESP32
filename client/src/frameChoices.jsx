import React, {useState, useEffect, useRef} from 'react';

const FrameChoices = ({frames, handleFrameChoice, frameCount}) => {

	const [frameElements, setFrameElements] = useState([]);
	var prevFrameElements = [];


	const createPrevFrames = () => {
		for (var i = 0; i < frameCount; i++) {
			prevFrameElements.push(<div onClick={() => {handleFrameChoice(i)}} className='prevFrame'>Prev Frame{i}</div>);
		}
	}

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
	useEffect(createPrevFrames, []);

	useEffect(createFrames,[frames]);

	return (
		<div id='frameChoices'>
			<div>Saved Frames</div>
			{prevFrameElements.map((curElem) => {
				return curElem;
			})}
			{frameElements.map((curElem, idx) => {
				return <canvas onClick={() => {handleFrameChoice(frames[idx][16])/* 16 contains name */}} className='frame' ref={(canvas) => {canvas && canvas.getContext("2d").drawImage(curElem, 0, 0);}} width={128} height={128}></canvas>
			})}
		</div>
	)
}

export default FrameChoices;