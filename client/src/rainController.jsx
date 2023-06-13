import React, { useEffect, useState } from 'react';

import { HexColorPicker } from "react-colorful";

const RainController = ({sendData, setRainSending, rainSending, setInputError, handleRain}) => {
	var colorsSent = 0;
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
		rainColorsSent++;
	};

	return (
		<div id='rainController'>
			{!rainSending ?
			<>
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
			</> : null}
		</div>
	)
};

export default RainController;