import React from 'react';

import { HexColorPicker } from "react-colorful";

const DrawMode = ({callSave, handleStop, animPlaying, turnOff, isLoading, inputError}) => {

	const handleColor = (newColor) => {
		document.getElementById('title').style.color = newColor;
		color = newColor;
		sendRequests['color'] = `CR${newColor.slice(1)}`;
	}

	return (
		<div>
			<div className="picker-container">
				<HexColorPicker style={{height: 'calc(90vw * 0.5)'}} color={color} onChange={handleColor} />
			</div>
			<button onClick={turnOff}>Turn Off</button>
			{!isLoading ?
			<>
				<button onClick={callSave}>Save Drawing</button>
				<input id="drawName" type="text" placeholder="drawing..." maxLength="7" />
				<button onClick={(e) => callSave(e, true)}>Save Frame</button>
				<input id="animName" type="text" placeholder="animation name..." maxLength="7"/>
				{animPlaying ? <button onClick={handleStop}>STOP</button>: null}
			</>
			: null}
		</div>
	);
};

export default DrawMode;