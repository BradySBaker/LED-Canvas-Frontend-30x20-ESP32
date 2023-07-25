import react, {useEffect, useState} from 'react';

import { HexColorPicker } from "react-colorful";

const AVController = ({handleChooseColor, setCurChosenColor, modeDataSending, colorChoices, handleModeStartStop, curChosenColor}) => {
  const [startClicked, setStartClicked] = useState(false);
	const handleAVColor = (newColor) => {
    if (colorChoices.length < 2) {
      setCurChosenColor(newColor);
    }
	};

  return (
		<div id='avController'>
			{!modeDataSending ?
			<>
				<div className='picker-container'>
					<HexColorPicker style={{height: 'calc(90vw * 0.5)'}} color={color} onChange={handleAVColor} />
				</div>
				<div>
					{colorChoices.map((curChoice) => {
						return(
							<div style={{'backgroundColor': curChoice, 'width': '100px', 'height': '100px'}}></div>
						)
					})}
				</div>
				<button style={{'color': curChosenColor}} onClick={handleChooseColor}>Choose Color</button>
				<button onClick={(e) => { handleModeStartStop(e, false); setStartClicked(!startClicked) }}>{!startClicked ? "Start" : "Stop"}</button>
			</> : null}
		</div>
  )
};

export default AVController;