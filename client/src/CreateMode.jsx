import React, { useState, useRef  } from 'react';

import styles from './cssModules/createMode.module.css';

import { HexColorPicker } from "react-colorful";
import MatrixButtons from "./MatrixButtons.jsx";

const colorOptions = ['#FF0000', '#A020F0', '#FFC0CB', '#0000FF', '#FFFF00', '#00FF00', '#FFA500', '#FFFFFF'];

const CreateMode = ({callSave, animPlaying, turnOff, isLoading, inputError, mouseDown, sendRequests, selectedColor, setSelectedColor}) => {

  const [selectColor, setSelectColor] = useState(false);
  const [drawMode, setDrawMode] = useState(true);
	const handleColor = (newColor) => {
    if (newColor.target) {
      newColor = newColor.target.style['background-color'];
    }
		setSelectedColor(newColor); //For visual elements
    window.color = newColor; //For color buttons
		sendRequests['color'] = `C${newColor.slice(1)}`;
	}

  const colorButtons = colorOptions.map ((curColor) => {
    return <button className={styles['color-buttons']} style={{'background-color': curColor}} onClick={handleColor}></button>
  });

	return (
		<div id={styles['widget']}>
				{selectColor ?
        <>
          <div id={styles['popup-closer']} onClick={() => setSelectColor(false)}></div>
          <div id={styles['color-picker-container']} >
            <HexColorPicker style={{height: 'calc(90vw * 0.5)'}} color={color} onChange={handleColor} />
          </div>
        </>: null}
      <div id={styles['mode-picker']}>
        <button style={!drawMode ? {'background-color': '#4CC2FF'} : {'background-color': '#7D7D7D'}} onClick={() => setDrawMode(true)}>Drawing Mode</button>
        <button style={drawMode ? {'background-color': '#4CC2FF'} : {'background-color': '#7D7D7D'}} onClick={() => setDrawMode(false)}>Animate Mode</button>
      </div>
      <div id={styles['mode-select-line']} style={drawMode ?  {transform: 'translate(10vw, -35px)'} : {transform: 'translate(53vw, -35px)'}}></div>
      <img src='./icons/trash-icon.png' id={styles['trash']} onClick={turnOff}/>
      <div id={styles['eraser-save-column']}>
        <img src='./icons/eraser-icon.png' id={styles['eraser']} onClick={() => handleColor('#000')}/>
        {!isLoading ?
        <>
          <button id={styles['save-button']}>
            Save
            <img src='./icons/save-icon.png' id={styles['save-icon']}></img>
          </button>
          {/* onClick={callSave} */}
          {/* <input id="drawName" type="text" placeholder="drawing..." maxLength="7" />
          <button onClick={(e) => callSave(e, true)}>Save Frame</button>
          <input id="animName" type="text" placeholder="animation name..." maxLength="7"/>
          {animPlaying ? <button onClick={turnOff}>STOP</button>: null} */}
        </>
        : null}
      </div>
      <div id={styles['preset-color-picker']}>
        {colorButtons}
        <img src='./icons/color-picker.png' id={styles['color-picker']} onClick={() => setSelectColor(true)}/>
      </div>
      <MatrixButtons mouseDown={mouseDown} sendRequests={sendRequests} selectedColor={selectedColor}/>
      <button id={styles['gallery-button']}>Gallery</button>
      <a href="https://www.flaticon.com/free-icons/color-picker" title="color picker icons" id={styles['credit']}>Color picker icons created by Design Circle - Flaticon</a>
		</div>
	);
};

export default CreateMode;