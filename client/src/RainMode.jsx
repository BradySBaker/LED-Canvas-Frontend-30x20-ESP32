import React, { useEffect, useState, useMemo } from 'react';

import { HexColorPicker } from "react-colorful";

import styles from './cssModules/miscModes.module.css';

const colorPalettes = {
  red: ["rgb(167,0,0)" ,"rgb(255,0,0)","rgb(255,82,82)", "rgb(255,186,186)"],
  blue: ["rgb(0, 0, 255)", "rgb(0, 122, 255)", "rgb(0, 204, 255)"],
  purple: ["rgb(49,0,74)", "rgb(76,0,164)", "rgb(131,0,196)", "rgb(255, 105, 180)"],
  green: ["rgb(0,156,26)", "rgb(38,204,0)", "rgb(123,227,130)", "rgb(210,242,212)"]
};

var paletteSent = false;

const RainMode = ({handleModeStartStop, modeDataSending, colorChoices, handleModeChooseColor, prevFrameNames, frames}) => {
  const [startClicked, setStartClicked] = useState(false);
  const [chosenColor, setChosenColor] = useState('#FFFFFF');
  const [error, setError] = useState(false);

  const handleChooseColor = (color, palette) => {
    if (colorChoices.length >= 6 || paletteSent) {
      setError("6 colors or one palette max!");
      return;
    }
    if (palette) {
      paletteSent = true;
    }
    handleModeChooseColor(color, palette);
  };

  const paletteElements = useMemo(() => {
    return Object.keys(colorPalettes).map((curPaletteKey) => { //Color Palette Style Creator
      var curPalette = colorPalettes[curPaletteKey];
      var percent = 100/curPalette.length;
      curPalette = curPalette.map((curColor, idx) => {
        return (curColor + (idx * percent) + '% '+ ((idx + 1)* percent + '%'));
      });
      curPalette = curPalette.join(',');
      return (
        <div key={curPaletteKey} className={styles['palette']} style={{background: `linear-gradient(to right, ${curPalette})`}} onClick={() => handleChooseColor(colorPalettes[curPaletteKey], curPaletteKey)} />
      )
    });
  }, [colorPalettes]);

	return (
		<div id={styles['widget']}>
			{modeDataSending ? /* Fix me! */
			<>
      <div id={styles['paletteSelector']}>
        Palettes
        <div className={styles['line']}/>
        <div id={styles['palettes']}>
            {paletteElements}
          </div>
      </div>
				<div id={styles['color-picker-container']}>
					<HexColorPicker style={{height: '50vw', width: '70vw', maxHeight: '70vh', maxWidth: '700px'}} color={color} onChange={(color) => setChosenColor(color)} />
				</div>
        <div id={styles['settings']}>
          <button id={styles['choose-color-button']} style={{'color': chosenColor}} onClick={() => handleChooseColor(chosenColor)}>Choose Color</button>
          <div className={styles['stacked']} id={styles['background-choices-container']}>
            <p id={styles['background-text']}>Choose a background</p>
            <div id={styles['background-choices']}>Temp Temp Temp</div>
          </div>
          <div className={styles['stacked']}>
            <p>Raindrops</p>
            <input className={styles['amount']}  id='rainAmount' type='text' placeholder='1-15...'/>
            <button id={styles['start-button']} onClick={(e) => { handleModeStartStop(e, true); setStartClicked(!startClicked); }}>{!startClicked ? "Start" : "Stop"}</button>
          </div>
        </div>
        <div>
          <div id={styles['chosen-colors']}>
          <h2>Chosen Colors</h2>
            {colorChoices.map((curChoice) => {
              return(
                <div key={curChoice} className={styles['chosen-color']} style={{'backgroundColor': curChoice}}></div>
              )
            })}
          </div>
				</div>
			</> : null}
      {error ? <div style={{color: 'red'}}>{error}</div> : null}
		</div>
	)
};

export default RainMode;