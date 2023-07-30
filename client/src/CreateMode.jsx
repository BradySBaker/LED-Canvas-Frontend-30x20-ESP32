import React, { useState, useRef  } from 'react';

import styles from './cssModules/createMode.module.css';

import { HexColorPicker } from "react-colorful";
import MatrixButtons from "./MatrixButtons.jsx";

const colorOptions = ['#FF0000', '#A020F0', '#FFC0CB', '#0000FF', '#FFFF00', '#00FF00', '#FFA500', '#FFFFFF'];

const CreateMode = ({callSave, animPlaying, turnOff, isLoading, inputError, mouseDown, sendRequests, selectedColor, setSelectedColor, handleFrameChoice}) => {

  const [frameCount, setFrameCount] = useState(0);
  const [selectColor, setSelectColor] = useState(false);
  const [drawMode, setDrawMode] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentAnimFrame, setCurrentAnimFrame] = useState('');
  const [playClicked, setPlayClicked] = useState(false);

	const handleColor = (newColor) => {
    if (newColor.target) {
      newColor = colorOptions[newColor.target.id];
    }
		setSelectedColor(newColor); //For visual elements
    window.color = newColor; //For color buttons
		sendRequests['color'] = `C${newColor.slice(1)}`;
	}

  const colorButtons = colorOptions.map ((curColor, idx) => {
    return <button className={styles['color-buttons']} id={idx} style={{'background-color': curColor}} onClick={handleColor}></button>
  });

  const handleSaveFrame = (e) => {
    var frameName = document.getElementById('frameName').value;
    if (drawMode) {
      console.log(frameName);
      callSave(e, false, frameName);
    } else {
      setFrameCount(frameCount+1);
      callSave(e, true, frameName);
      setCurrentAnimFrame(frameName);
    }
    setSaving(false);
  };

  const handleAddAnimFrame = () => {
    if (frameCount === 0) {
      setSaving(true)
    } else {
      setFrameCount(frameCount + 1);
      callSave(e, true, currentAnimFrame)
    }
  };

	return (
		<div id={styles['widget']}>
        {selectColor || saving ? <div id={styles['popup-closer']} onClick={() => {setSelectColor(false); setSaving(false);}}></div> : null}
				{selectColor ?

          <div id={styles['color-picker-container']} >
            <HexColorPicker style={{height: '80vw', width: '80vw', maxHeight: '70vh', maxWidth: '700px'}} color={color} onChange={handleColor} />
          </div>
        : null}
      <div id={styles['mode-picker']}>
        <button style={!drawMode ? {'background-color': '#4CC2FF'} : {'background-color': '#7D7D7D'}} onClick={() => setDrawMode(true)}>Drawing Mode</button>
        <button style={drawMode ? {'background-color': '#4CC2FF'} : {'background-color': '#7D7D7D'}} onClick={() => setDrawMode(false)}>Animate Mode</button>
      </div>
      <div id={styles['mode-select-line-mobile']} style={drawMode ?  {transform: 'translate(8vw, -35px)'} : {transform: 'translate(55vw, -35px)'}}></div>
      <div id={styles['mode-select-line-desktop']} style={drawMode ?  {transform: 'translate(40.1vw, 5px)'} : {transform: 'translate(51vw, 5px)'}}></div>
      <img src='./icons/trash-icon.png' id={styles['trash']} onClick={turnOff}/>
        {!isLoading ?
        <div id={styles['eraser-save-column']}>
          <img src='./icons/eraser-icon.png' id={styles['eraser']} onClick={() => handleColor('#000000')}/>
          {drawMode && !saving ?
          <button id={styles['save-button']} onClick={() => setSaving(true)}>
            Save
            <img src='./icons/save-icon.png' id={styles['save-icon']} />
          </button>
          : null}
          {!drawMode ?
          <div id={styles['add-section']}>
            <button id={styles['add-button']} onClick={handleAddAnimFrame}>Add</button>
            <div>{frameCount}</div>
          </div>
          : null}
          {!drawMode && frameCount < 1 && !playClicked ?
          <button id={styles['start-stop-button']} onClick={(e) => {handleFrameChoice(e, currentAnimFrame); setPlayClicked(true)}}>
            Play
            <img src='./icons/animation-icon.png' id={styles['start-stop-icon']} />
            </button>
          : null }
          {playClicked ?
          <button id={styles['start-stop-button']}  onClick={(e) => {turnOff(e); setPlayClicked(false)}}>
            Stop
            <div />
          </button>
          : null}
          {saving ?
          <div id={styles['save-form']}>
            <input  id='frameName' type='text' maxLength='7' placeholder='name...'/>
            <div id={styles['checkmark']} onClick={handleSaveFrame}/>
          </div>
          : null}
                        {/* <input id="drawName" type="text" placeholder="drawing..." maxLength="7" />
          <button onClick={(e) => callSave(e, true)}>Save Frame</button>
          <input id="animName" type="text" placeholder="animation name..." maxLength="7"/>
          {animPlaying ? <button onClick={turnOff}>STOP</button>: null} */}
          </div> /* end of eraser-save colum ============== */
        : null}
      <div id={styles['matrix-color-section']}>
        <div id={styles['preset-color-picker']}>
          {colorButtons}
          <img src='./icons/color-picker.png' id={styles['color-picker']} onClick={() => setSelectColor(true)}/>
        </div>
        <MatrixButtons mouseDown={mouseDown} sendRequests={sendRequests} selectedColor={selectedColor}/>
      </div>
      <a href="https://www.flaticon.com/free-icons/color-picker" title="color picker icons" id={styles['credit']}>Color picker icons created by Design Circle - Flaticon</a>
		</div>
	);
};

export default CreateMode;