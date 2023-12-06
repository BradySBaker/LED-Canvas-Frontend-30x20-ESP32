import React, { useState, useRef } from 'react';

import styles from './cssModules/createMode.module.css';

import { HexColorPicker } from "react-colorful";
import MatrixButtons from "./MatrixButtons.jsx";
import Slider from './Slider.jsx';


const colorOptions = ['#FF0000', '#A020F0', '#FFC0CB', '#0000FF', '#FFFF00', '#00FF00', '#FFA500', '#FFFFFF'];

const CreateMode = ({callSave, animPlaying, turnOff, pixelSending, mouseDown, sendRequests, selectedColor, setSelectedColor, handleFrameChoice}) => {
  const [frameCount, setFrameCount] = useState(0);
  const [selectColor, setSelectColor] = useState(false);
  const [drawMode, setDrawMode] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentAnimFrame, setCurrentAnimFrame] = useState(false);
  const [playClicked, setPlayClicked] = useState(false);
  const [error, setError] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(5);

  const animationSpeedChange = (e) => {
    const speed = e.target.value;
    setAnimationSpeed(speed);
  };



	const handleColor = (newColor) => {
    if (newColor.target) {
      newColor = colorOptions[newColor.target.id];
    }
		setSelectedColor(newColor); //For visual elements
    window.color = newColor; //For color buttons
		window.sendRequests['color'] = `C${newColor.slice(1)}`;
	}

  const colorButtons = colorOptions.map ((curColor, idx) => {
    return <button className={styles['color-buttons']} id={idx} style={{'background-color': curColor}} onClick={handleColor}></button>
  });

  const handleSaveFrame = (e) => {
    setSaving(false);
    setError(false);
    if (pixelSending) {
      return;
    }
    var frameName = document.getElementById('frameName').value;
    if (drawMode) {
      var inputError = callSave(e, false, frameName);
      if (inputError) {
        setError(inputError);
        return;
      }
    } else {
      var inputError = callSave(e, true, frameName);
      if (inputError) {
        setError(inputError);
        return;
      }
      setFrameCount(frameCount+1);
      setCurrentAnimFrame(frameName);
    }
  };

  const handleAddAnimFrame = (e) => {
    if (pixelSending) {
      return;
    }
    if (frameCount === 0) {
      setSaving(true)
    } else {
      setFrameCount(frameCount + 1);
      callSave(e, true, currentAnimFrame)
    }
  };

	return (
		<div id={styles['widget']}>
        {selectColor || saving || error ? <div id='popup-closer' onClick={() => {setSelectColor(false); setSaving(false); setError(false);}} /> : null}
				{selectColor ?
          <div id={styles['color-picker-container']} >
            <HexColorPicker style={{height: '80vw', width: '80vw', maxHeight: '70vh', maxWidth: '700px'}} color={color} onChange={handleColor} />
          </div>
        : null}
      <div id={styles['mode-picker']}>
        <button style={!drawMode ? {'background-color': '#4CC2FF'} : {'background-color': '#7D7D7D'}} onClick={() => setDrawMode(true)}>Drawing Mode</button>
        <button style={drawMode ? {'background-color': '#4CC2FF'} : {'background-color': '#7D7D7D'}} onClick={() => setDrawMode(false)}>Animate Mode</button>
      </div>
      <div id={styles['mode-select-line-mobile']} style={drawMode ?  {transform: 'translate(7vw, -35px)'} : {transform: 'translate(55vw, -35px)'}}></div>
      <div id={styles['mode-select-line-desktop']} style={drawMode ?  {transform: 'translate(40.1vw, 5px)'} : {transform: 'translate(51vw, 5px)'}}></div>
      <img src='./icons/trash-icon.png' id={styles['trash']} onClick={turnOff}/>
        <div id={styles['eraser-save-column']}>
          <img src='./icons/eraser-icon.png' id={styles['eraser']} onClick={() => handleColor('#000000')}/>
          {error ? <div id={styles['error-pupup']}>! {error} !</div> : null}
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
          {!drawMode && frameCount > 1 && !playClicked ?
          <>
            <button id={styles['start-stop-button']} onClick={() => {if(!pixelSending) {handleFrameChoice(currentAnimFrame, true, animationSpeed); setPlayClicked(true)}}}>
            Play
            <img src='./icons/animation-icon.png' id={styles['start-stop-icon']} />
          </button>
          <div id={styles['slider-container']}>
            {!playClicked ? <Slider max={5} min={1} handleChange={animationSpeedChange} defaultValue={5}/> : null}
          </div>
          </>
          : null }
          {playClicked ?
          <button id={styles['start-stop-button']}  onClick={(e) => {if(!pixelSending) {turnOff(e); setPlayClicked(false)}}}>
            Stop
            <div />
          </button>

          : null}
          {!drawMode && !playClicked && frameCount >= 1 ?
          <button id={styles['start-stop-button']} onClick={() => {setCurrentAnimFrame(false); setFrameCount(0);}}>
            Done✓
          </button>
          : null}
          {saving ?
          <div id={styles['save-form']}>
            <input  id='frameName' type='text' maxLength='7' placeholder='name...'/>
            <div id='checkmark' onClick={handleSaveFrame}/>
          </div>
          : null}
          </div>
      <div id={styles['matrix-color-section']}>
        <div id={styles['preset-color-picker']}>
          {colorButtons}
          <img src='./icons/color-picker.png' id={styles['color-picker']} onClick={() => setSelectColor(true)}/>
        </div>
        <MatrixButtons mouseDown={mouseDown} selectedColor={selectedColor}/>
      </div>
      <a href="https://www.flaticon.com/free-icons/color-picker" title="color picker icons" id={styles['credit']}>Color picker icons created by Design Circle - Flaticon</a>
		</div>
	);
};

export default CreateMode;