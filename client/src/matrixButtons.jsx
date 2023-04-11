import react, {useEffect, useState} from 'react';


const MatrixButtons = function({mouseDown}) {
	const [buttons, setButtons]= useState([]);

	const handleDataSend = (value) => {
		window.sendRequests["P" + value] = true;
	};


	function handleDraw(e, clicked) {
		if (mouseDown || clicked) {
			var value = e.target.id;
			document.getElementById(value).style.backgroundColor = window.color;
			handleDataSend(value);
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