import react, {useEffect, useState} from 'react';

const MatrixButtons = function({mouseDown}) {
	const [buttons, setButtons]= useState([]);

	const handleDataSend = (value) => {
		window.sendRequests["P" + value] = true;
	};


	function handleDraw(e, clicked, value) {
    value = e ? e.target.id : value;
		if (mouseDown || clicked) {
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

	function handleTouchMove(e) {
		e.preventDefault();
		const touch = e.touches[0];
		const x = touch.clientX;
		const y = touch.clientY;
		const button = document.elementFromPoint(x, y);
    if (!button || !button.id) {
      return;
    }
		handleDraw(null, true, button.id);
		// update state based on the touch position
	}

	useEffect(() => {
		const element = document.getElementById('buttons');
		element.addEventListener('touchmove', handleTouchMove, { passive: false });

		return () => {
			element.removeEventListener('touchmove', handleTouchMove);
		};
	}, []);

	return (
		<div id='buttons'>
			{buttons}
		</div>
	)
}

export default MatrixButtons;