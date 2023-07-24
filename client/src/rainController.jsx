import React, { useEffect, useState } from 'react';

import { HexColorPicker } from "react-colorful";

const RainController = ({sendData, setInputError, handleModeStartStop, setCurChosenColor, modeDataSending, colorChoices, handleChooseColor, curChosenColor}) => {
	const handleRainColor = (newColor) => {
		setCurChosenColor(newColor);
	};

	return (
		<div id='rainController'>
			{!modeDataSending ?
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
				<button onClick={(e) => handleModeStartStop(e, true)}>Start</button>
			</> : null}
		</div>
	)
};

export default RainController;