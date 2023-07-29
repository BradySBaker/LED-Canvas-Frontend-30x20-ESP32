import React, { useState } from 'react';

import styles from './cssModules/createMode.module.css';

import { HexColorPicker } from "react-colorful";
import MatrixButtons from "./MatrixButtons.jsx";

const CreateMode = ({callSave, animPlaying, turnOff, isLoading, inputError, mouseDown, sendRequests}) => {

  const [selectColor, setSelectColor] = useState(false);

	const handleColor = (newColor) => {
		// document.getElementById('title').style.color = newColor;
		color = newColor;
		sendRequests['color'] = `C${newColor.slice(1)}`;
	}

	return (
		<div>
			<div className="picker-container">
				{selectColor ? <HexColorPicker style={{height: 'calc(90vw * 0.5)'}} color={color} onChange={handleColor} /> : null}
			</div>
			<button onClick={turnOff}>Turn Off</button>
			{!isLoading ?
			<>
				<button onClick={callSave}>Save Drawing</button>
				<input id="drawName" type="text" placeholder="drawing..." maxLength="7" />
				<button onClick={(e) => callSave(e, true)}>Save Frame</button>
				<input id="animName" type="text" placeholder="animation name..." maxLength="7"/>
				{animPlaying ? <button onClick={turnOff}>STOP</button>: null}
			</>
			: null}
      <MatrixButtons mouseDown={mouseDown} sendRequests={sendRequests}/>
		</div>
	);
};

export default CreateMode;