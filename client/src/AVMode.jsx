import react, {useEffect, useState} from 'react';

import { HexColorPicker } from "react-colorful";

import styles from './cssModules/miscModes.module.css';

const AVMode = ({modeRunning,  handleModeChooseColor, modeDataSending,  colorChoices, handleModeStartStop}) => {
  const [startClicked, setStartClicked] = useState(false);
  const [chosenColor, setChosenColor] = useState('#FFFFFF');
  const [pixelFall, setPixelFall] = useState(false);
  const [error, setError] = useState(false);

  const handleReset = () => {
    handleModeStartStop({reset: true});
    setError(false);
  };

  const chooseColorPressed = () => {
    if ((colorChoices.length < 2) || (colorChoices.length < 3 && pixelFall)) {
      handleModeChooseColor(chosenColor);
      return;
    }
    setError(colorChoices.length + " colors max!");
  };


  return (
		<div id='AVMode'>
			{!modeDataSending ? /* Fix me */
			<>
				<div className={styles['color-picker-container']}>
					<HexColorPicker style={{height: '50vw', width: '70vw', maxHeight: '70vh', maxWidth: '700px'}} color={chosenColor} onChange={(newColor) => setChosenColor(newColor)} />
				</div>
        <div className={styles['settings']}>
          <button style={{'color': chosenColor}} onClick={chooseColorPressed}>Choose Color</button>
          <button style={pixelFall ? {backgroundColor: 'blue'} : {}} onClick={() => setPixelFall(!pixelFall)}>PixelFall</button>
				  <button className={styles['start-button']} onClick={(e) => { handleModeStartStop({e: true, pixelFall}); setStartClicked(!startClicked) }}>{!startClicked ? "Start" : "Stop"}</button>
        </div>
				<div className={styles['chosen-colors']}>
          <h2>Chosen Colors</h2>
					{colorChoices.map((curChoice,  idx) => {
            if (!pixelFall && idx > 1) {
              return;
            }
						return(
							<div style={{'backgroundColor': curChoice, 'width': '100px', 'height': '100px'}}></div>
						)
					})}
				</div>
        {colorChoices.length !== 0 && !startClicked ? <button style={{float: 'right', color: 'red'}} onClick={handleReset}>Reset</button> : null}
			</> : null}
      {error ? <div style={{color: 'red'}}>{error}</div> : null}
		</div>
  )
};

export default AVMode;