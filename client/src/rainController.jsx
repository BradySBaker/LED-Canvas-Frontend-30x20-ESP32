import React, { useState } from 'react';

import { HexColorPicker } from "react-colorful";

const RainController = ({sendData, setRainSending, rainSending, setInputError}) => {
	const [colorChoices, setColorChoices] = useState([]);
	const [curChosenColor, setCurChosenColor] = useState(color);
	const handleRainColor = (newColor) => {
		setCurChosenColor(newColor);
	};

	const handleChooseColor = () => {
		var colors = JSON.parse(JSON.stringify(colorChoices));
		colors.push(curChosenColor);
		setColorChoices(colors);
		sendData("CRR" + curChosenColor.slice(1));
		setRainSending(true);
	};

	const handleRain = (e, startRain, amount = document.getElementById('rainAmount').value) => {
		if (isNaN(Number(amount))) {
			setInputError("Please input a number value");
			return;
		}
		if (isRaining && !startRain) {
			sendData("SR");
			setTimeout(handleRain, 400);
		} else if (e) {
			if (!isRaining) {
				sendData("R" + amount);
				setTimeout(() => {handleRain(true, true, amount)}, 400);
			}
		}
	};

	return (
		<div id='rainController'>
			<div className='picker-container'>
				<HexColorPicker style={{height: 'calc(90vw * 0.5)'}} color={color} onChange={handleRainColor} />
			</div>
			<div>
				{colorChoices.map((curChoice) => {
					return(
						<div style={{'backgroundColor': curChoice, 'width': '100px', 'height': '100px'}}></div>
					)
				})}
			</div>
			<button style={{'color': curChosenColor}} onClick={handleChooseColor}>Choose Color</button>
			<input id='rainAmount' type='text' placeholder='1...'/>
			<button onClick={handleRain}>rain</button>
		</div>
	)
};

export default RainController;