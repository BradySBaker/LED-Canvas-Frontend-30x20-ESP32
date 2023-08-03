import React, { useEffect, useState } from 'react';

import { HexColorPicker } from "react-colorful";

import styles from './cssModules/miscModes.module.css';

const colorPalettes = {
  redPalette: "rgb(167,0,0) 0% 25%,rgb(255,0,0) 25% 50%,rgb(255,82,82) 50% 75%, rgb(255,186,186) 75% 100%",
  bluePalette: "rgb(0, 0, 255) 0 33%, rgb(0, 122, 255) 33% 68%, rgb(0, 204, 255) 68% 100%",
  purplePalette: "rgb(49,0,74)  0% 25%, rgb(76,0,164) 25% 50%, rgb(131,0,196) 50% 75%, rgb(255, 105, 180) 75% 100%",
  greenPalette: "rgb(0,156,26) 0% 25%, rgb(38,204,0) 25% 50%, rgb(123,227,130) 50% 75%, rgb(210,242,212) 75% 100%"
};

const paletteElements = Object.keys(colorPalettes).map((curPalette) => {
  return (
    <div className={styles['palette']} style={{background: `linear-gradient(to right, ${colorPalettes[curPalette]})`}} />
  );
});

const RainMode = ({handleModeStartStop, setCurChosenColor, modeDataSending, colorChoices, handleChooseColor, curChosenColor}) => {
  const [startClicked, setStartClicked] = useState(false);
	const handleRainColor = (newColor) => {
		setCurChosenColor(newColor);
	};

	return (
		<div id='rainController'>
			{modeDataSending ? /* Fix me!!!! */
			<>
      <div id={styles['paletteSelector']}>
        Palettes
        <div className={styles['line']}/>
        <div id={styles['palettes']}>
            {paletteElements}
          </div>
      </div>
				<div id={styles['color-picker-container']}>
					<HexColorPicker style={{height: '50vw', width: '50vw', maxHeight: '70vh', maxWidth: '700px'}} color={color} onChange={handleRainColor} />
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
				<button onClick={(e) => { handleModeStartStop(e, true); setStartClicked(!startClicked); }}>{!startClicked ? "Start" : "Stop"}</button>
			</> : null}
		</div>
	)
};

export default RainMode;