import react, {useEffect, useState} from 'react';

var waiting = false;

const MatrixButtons = function({mouseDown, sendData, successfulSend, color}) {
	const [buttons, setButtons]= useState([]);
	const [waitingPixels, setWaitingPixels] = useState([]);

	const handleDataSend = () => {
		if (successfulSend) {
			waiting = true;
			var value = waitingPixels.shift();
			if (value) {
				sendData(value);
			} else {
				waiting = false;
			}
		}
	};

	useEffect(handleDataSend, [successfulSend]);

	function handleDraw(e, clicked) {
		if (mouseDown || clicked) {
			var value = e.target.id;
			document.getElementById(value).style.backgroundColor = color;
			waitingPixels.push('POS' + value);
			if (!waiting) {
				handleDataSend();
			}
		}
	}

	const createButtons = () => {
		var y = 0;
		var x = 0;
		var divMatrix = [];
		var curButtons = [];
		while (y < 16) {
			if (x === 16) {
				x = 0;
				y++;
				divMatrix.push(<div className={`${y} buttonColumn`}>{curButtons}</div>)
				curButtons = [];
				if (y === 16) {
					break;
				}
			}
			curButtons.push(<button id={`${x},${y}`} onMouseDown={(e) => {handleDraw(e, true)}} onMouseEnter={handleDraw}></button>);
			x++;
		}
		setButtons(divMatrix);
	};

	useEffect(createButtons, [mouseDown]);

	return (
		<div>
			{buttons}
		</div>
	)
}

export default MatrixButtons;