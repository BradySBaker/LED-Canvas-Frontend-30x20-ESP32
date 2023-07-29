import React, { useState } from 'react';

import styles from './cssModules/createMode.module.css';

import { HexColorPicker } from "react-colorful";
import MatrixButtons from "./MatrixButtons.jsx";

const colorOptions = ['#FF0000', '#A020F0', '#FFC0CB', '#0000FF', '#FFFF00', '#00FF00', '#FFA500', '#FFFFFF'];

const CreateMode = ({callSave, animPlaying, turnOff, isLoading, inputError, mouseDown, sendRequests}) => {

  const [selectColor, setSelectColor] = useState(false);
  const [drawMode, setDrawMode] = useState(true);

	const handleColor = (newColor) => {
    if (newColor.target) {
      newColor = newColor.target.style['background-color'];
    }
		// document.getElementById('title').style.color = newColor;
		color = newColor;
		sendRequests['color'] = `C${newColor.slice(1)}`;
	}

  const colorButtons = colorOptions.map ((curColor) => {
    return <button className={styles['color-buttons']} style={{'background-color': curColor}} onClick={handleColor}></button>
  });

	return (
		<div id={styles['widget']}>
				{selectColor ? <div className="picker-container">
			<HexColorPicker style={{height: 'calc(90vw * 0.5)'}} color={color} onChange={handleColor} />
			</div>: null}
      <div id={styles['mode-picker']}>
        <button style={!drawMode ? {'background-color': '#4CC2FF'} : {'background-color': '#7D7D7D'}} onClick={() => setDrawMode(true)}>Drawing Mode</button>
        <button style={drawMode ? {'background-color': '#4CC2FF'} : {'background-color': '#7D7D7D'}} onClick={() => setDrawMode(false)}>Animate Mode</button>
      </div>
			{/* <button onClick={turnOff}>Turn Off</button>
			{!isLoading ?
			<>
				<button onClick={callSave}>Save Drawing</button>
				<input id="drawName" type="text" placeholder="drawing..." maxLength="7" />
				<button onClick={(e) => callSave(e, true)}>Save Frame</button>
				<input id="animName" type="text" placeholder="animation name..." maxLength="7"/>
				{animPlaying ? <button onClick={turnOff}>STOP</button>: null}
			</>
			: null} */}
      <div id={styles['preset-color-picker']}>
        {colorButtons}
        <img src='./icons/color-picker.png' className={styles['icons']}></img>
      </div>
      <MatrixButtons mouseDown={mouseDown} sendRequests={sendRequests}/>
      <a href="https://www.flaticon.com/free-icons/color-picker" title="color picker icons" id={styles['credit']}>Color picker icons created by Design Circle - Flaticon</a>
		</div>
	);
};

export default CreateMode;