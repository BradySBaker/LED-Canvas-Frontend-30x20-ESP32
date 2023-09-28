import react, {useEffect, useState} from 'react';

import styles from './cssModules/createMode.module.css';

const MatrixButtons = function({mouseDown}) {
	const [buttons, setButtons]= useState([]);

	const handleDataSend = (value) => {
		window.sendRequests["P" + value] = true;
	};


	function handleDraw(e, clicked, value) {
    value = e ? e.target.id : value;
		if (mouseDown || clicked) {
      if (value.includes(',')) { //think about more efficient solutions
        document.getElementById(value).style.backgroundColor = window.color;
        handleDataSend(value);
      }
		}
	}

	const createButtons = () => {
		var x = 0;
		var y = 0;
		var divMatrix = [];
		var curButtons = [];
		while (x < window.WIDTH) {
			if (y === window.HEIGHT) {
				y = 0;
				x++;
				divMatrix.push(<div key={x} className={`${x} ${styles['button-column']}`} >{curButtons}</div>)
				curButtons = [];
			}
			curButtons.push(<button id={`${y},${x}`} className={styles['matrix-button']} key={y} onMouseDown={(e) => {handleDraw(e, true)}} onMouseEnter={handleDraw}></button>);
			y++;
		}
		setButtons(divMatrix);
	};

	useEffect(createButtons, [mouseDown]);

	function handleTouchMove(e) {
		e.preventDefault();
		const touch = e.touches[0];
		const y = touch.clientX;
		const x = touch.clientY;
		const button = document.elementFromPoint(y, x);
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
    <div id={styles['matrix-widget']}>
      <div id='buttons' className={styles['buttons']}>
			{buttons}
      </div>
    </div>
	)
}

export default MatrixButtons;