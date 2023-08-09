import React, { useEffect, useState, useMemo } from 'react';

import { HexColorPicker } from "react-colorful";

import styles from './cssModules/miscModes.module.css';

const colorPalettes = {
  red: ["rgb(82, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 150, 150)"],
  blue: ["rgb(0, 0, 102)", "rgb(0, 0, 255)", "rgb(0, 153, 255)"],
  green: ["rgb(0, 82, 0)", "rgb(0, 255, 0)", "rgb(102, 255, 102)"],
  purple: ["rgb(60, 0, 90)", "rgb(150, 0, 200)", "rgb(255, 105, 180)"]
};

var chosenFrame = false;
var colorsSent = 0;
var rain = false;

const raindropSelections = [];

for (var i = 1; i <= 20; i++) {
  raindropSelections.push(<option value={i}>{i}</option>);
};

const RainMode = ({handleModeStartStop, modeDataSending, colorChoices, handleModeChooseColor, prevFrameNames, frames, handleFrameChoice}) => {
  const [startClicked, setStartClicked] = useState(false);
  const [chosenColor, setChosenColor] = useState('#FFFFFF');
  const [error, setError] = useState(false);

  const handleChooseColor = (color, palette) => {
    if (modeRunning) {
      setError("Stop to select color!");
      return;
    }
    if (colorsSent >= 6) {
      setError("6 colors or 1 palette max");
      return;
    } else {
      setError("");
    }
    colorsSent++;
    if (palette) {
      colorsSent = 6;
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

  const handleBackgroundChoice = (e, curFrame) => {
    var backgroundChoices = e.target.parentNode.children;

    for (var i = 0; i < backgroundChoices.length; i++) {
      backgroundChoices[i].style.backgroundColor = 'rgba(95, 158, 160, 0.548)';
    }
    e.target.style.backgroundColor = 'blue';
    chosenFrame = curFrame;
    if (modeRunning) {
      handleFrameChoice(curFrame);
    }
  };

  const handleReset = () => {
    handleModeStartStop({reset: true});
    setError(false);
    colorsSent = 0;
  };

  const startStopClicked = (e, chosenFrame) => {
    const error = handleModeStartStop({e: true, rain: true, chosenFrame});
    if (error) {
      setError(error);
      return;
    }
    setStartClicked(!startClicked);
    colorsSent = 0;
    setError(false);
  };

	return (
		<div id={styles['widget']}>
			{!modeDataSending ?
			<>
      <div id={styles['paletteSelector']}>
        Palettes
        <div className={styles['line']}/>
        <div id={styles['palettes']}>
            {paletteElements}
          </div>
      </div>
				<div className={styles['color-picker-container']}>
					<HexColorPicker style={{height: '50vw', width: '70vw', maxHeight: '70vh', maxWidth: '700px'}} color={chosenColor} onChange={(color) => setChosenColor(color)} />
				</div>
        <div className={styles['settings']}>
          <button id={styles['choose-color-button']} style={{'color': chosenColor}} onClick={() => handleChooseColor(chosenColor)}>Choose Color</button>
          <div className={styles['stacked']} id={styles['background-choices-container']}>
            <p id={styles['background-text']}>Choose a background</p>
            <div id={styles['background-choices']}>
              {prevFrameNames.map((curFrame) =>
                <div className={styles['background-choice']} onClick={(e) => handleBackgroundChoice(e, curFrame)}>{curFrame}</div>
              )}
              {frames.map((curFrame) =>
                <div className={styles['background-choice']} onClick={(e) => handleBackgroundChoice(e, curFrame[16])}>{curFrame[16]}</div>
              )}
            </div>
          </div>
           <div className={styles['stacked']}>
            <p>Raindrops</p>
            <select className={styles['amount']}  id='rainAmount' size="3">
              {raindropSelections}
            </select>
            <button className={styles['start-button']} onClick={(e) => {startStopClicked(e, chosenFrame); }}>{!startClicked ? "Start" : "Stop"}</button>
          </div>
        </div>
        <div>
          <div className={styles['chosen-colors']}>
          <h2>Chosen Colors</h2>
            {colorChoices.map((curChoice) => {
              return(
                <div key={curChoice} className={styles['chosen-color']} style={{'backgroundColor': curChoice}}></div>
              )
            })}
          </div>
          {colorChoices.length !== 0 && !startClicked ? <button style={{float: 'right', color: 'red'}} onClick={handleReset}>Reset</button> : null}
				</div>
			</> : null}
      {error ? <div style={{color: 'red'}}>{error}</div> : null}
		</div>
	)
};

export default RainMode;