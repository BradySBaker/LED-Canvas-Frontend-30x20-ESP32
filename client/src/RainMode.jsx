import React, { useEffect, useState, useMemo } from 'react';

import { HexColorPicker } from "react-colorful";

import styles from './cssModules/miscModes.module.css';

const colorPalettes = {
  redPalette: "rgb(167,0,0) 0% 25%,rgb(255,0,0) 25% 50%,rgb(255,82,82) 50% 75%, rgb(255,186,186) 75% 100%",
  bluePalette: "rgb(0, 0, 255) 0 33%, rgb(0, 122, 255) 33% 68%, rgb(0, 204, 255) 68% 100%",
  purplePalette: "rgb(49,0,74)  0% 25%, rgb(76,0,164) 25% 50%, rgb(131,0,196) 50% 75%, rgb(255, 105, 180) 75% 100%",
  greenPalette: "rgb(0,156,26) 0% 25%, rgb(38,204,0) 25% 50%, rgb(123,227,130) 50% 75%, rgb(210,242,212) 75% 100%"
};

const RainMode = ({handleModeStartStop, setCurChosenColor, modeDataSending, colorChoices, handleChooseColor, curChosenColor, prevFrameNames, frames}) => {
  const [startClicked, setStartClicked] = useState(false);

	const handleRainColor = (newColor, palette) => {
    if (palette) {
      console.log(newColor);
      return;
    }
		setCurChosenColor(newColor);
	};

  const paletteElements = useMemo(() => {
    return Object.keys(colorPalettes).map((curPalette) => (
      <div key={curPalette} className={styles['palette']} style={{background: `linear-gradient(to right, ${colorPalettes[curPalette]})`}} onClick={() => handleRainColor(curPalette, true)} />
    ));
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
					<HexColorPicker style={{height: '50vw', width: '70vw', maxHeight: '70vh', maxWidth: '700px'}} color={color} onChange={handleRainColor} />
				</div>
        <div id={styles['settings']}>
          <button id={styles['choose-color-button']} style={{'color': curChosenColor}} onClick={handleChooseColor}>Choose Color</button>
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
                <div className={styles['chosen-color']} style={{'backgroundColor': curChoice}}></div>
              )
            })}
          </div>
				</div>
			</> : null}
		</div>
	)
};

export default RainMode;