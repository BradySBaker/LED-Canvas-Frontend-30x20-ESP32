import react, {useEffect, useState} from 'react';

import { HexColorPicker } from "react-colorful";

import styles from './cssModules/miscModes.module.css';

const AVController = ({modeRunning,  handleModeChooseColor, modeDataSending,  colorChoices, handleModeStartStop}) => {
  const [startClicked, setStartClicked] = useState(false);
  const [chosenColor, setChosenColor] = useState('#FFFFFF');
  const [error, setError] = useState(false);

  const handleReset = () => {
    handleModeStartStop(false, false, false, false, false, true);
    setError(false);
  };

  const chooseColorPressed = () => {
    if (colorChoices.length < 2) {
      handleModeChooseColor(chosenColor);
    }
  };

  return (
		<div id='avController'>
			{modeDataSending ? /* Fix me */
			<>
				<div className={styles['color-picker-container']}>
					<HexColorPicker style={{height: '50vw', width: '70vw', maxHeight: '70vh', maxWidth: '700px'}} color={color} onChange={(newColor) => setChosenColor(newColor)} />
				</div>
        <div className={styles['settings']}>
          <button style={{'color': chosenColor}} onClick={chooseColorPressed}>Choose Color</button>
				  <button className={styles['start-button']} onClick={(e) => { handleModeStartStop(e, false); setStartClicked(!startClicked) }}>{!startClicked ? "Start" : "Stop"}</button>
        </div>
				<div className={styles['chosen-colors']}>
          <h2>Chosen Colors</h2>
					{colorChoices.map((curChoice) => {
						return(
							<div style={{'backgroundColor': curChoice, 'width': '100px', 'height': '100px'}}></div>
						)
					})}
				</div>
        {colorChoices.length !== 0 && !startClicked ? <button style={{float: 'right', color: 'red'}} onClick={handleReset}>Reset</button> : null}
			</> : null}
		</div>
  )
};

export default AVController;