import React, {useState, useEffect} from 'react';

import styles from './cssModules/gallery.module.css';

import Slider from './Slider.jsx';

const Gallery = ({frames, handleFrameChoice, prevFrameNames, handleDelete, anims, handleSave, modeDataSending, animPlaying, turnOff}) => {
  const [playClicked, setPlayClicked] = useState(false);
	const [frameElements, setFrameElements] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(5);

  const animationSpeedChange = (e) => {
    const speed = e.target.value;
    setAnimationSpeed(speed);
  };

	const createFrames = () => {
		var newFrames = [];
		frames.forEach((curFrame, idx) => {
			var canvas = document.createElement('canvas');
			canvas.width = 128;
			canvas.height = 128;
			var c = canvas.getContext("2d");
			for (var y = 0; y < 16; y++) {
				var curColumn = curFrame[y];
				for (var x = 0; x < 16; x++) {
					var yPos = x * canvas.width/16;
					var xPos = y * canvas.height/16;

					var curSquare = curColumn[x];
					c.fillStyle = curSquare;
					c.fillRect(xPos, yPos, 16, 16);
				}
			}
			newFrames.push(canvas);
		});
		setFrameElements(newFrames)
	};

  const deleteItem = () => {
    if (!animPlaying && !modeDataSending) {
      handleDelete(itemToDelete[0], itemToDelete[1], itemToDelete[2]);
    };
    setItemToDelete(false);
  };

	useEffect(createFrames,[frames]);

	return (
		<div id={styles['widget']}>
			<h1 className={styles['title']}>Drawings</h1>
      <div className={styles['line']} />
      {itemToDelete ? <div id='popup-closer' onClick={() => {setItemToDelete(false);}} /> : null}
      {itemToDelete ? <div id={styles['delete-popup']}>
        Are you sure?
        <button  onClick={deleteItem}>Yes</button>
      </div> : null}
      {frameElements.length > 0 ? <h2 className={styles['title']}>Current</h2> : null}
      <div className={styles['saved-item-list']}>
        {frameElements.map((curElem, idx) => {
          return(
          <div>
            <canvas className={styles['frame']} onClick={() => {handleFrameChoice(frames[idx][16])/* 16 contains name */}}  ref={(canvas) => {canvas && canvas.getContext("2d").drawImage(curElem, 0, 0);}} width={128} height={128}></canvas>
            <button className={styles['delete']} onClick={() => {setItemToDelete([frames[idx][16], idx]);}}>delete</button>
          </div>
          )
        })}
      </div>
      <h2 className={styles['title']}>Saved</h2>
      <div className={styles['saved-item-list']}>
        {prevFrameNames.map((curName, idx) => {
        return(
        <div>
          <button className={styles['saved-item']} onClick={() => {handleFrameChoice(curName)}}>{curName}</button>
          <button className={styles['delete']} onClick={() => {setItemToDelete([curName, idx, 'prev']);}}>delete</button>
        </div>
        )
        })}
      </div>
      <div className={styles['line']} />
      <h1 className={styles['title']} style={{marginTop: '80px'}}>Animations</h1>
      <div className={styles['line']} />
      <div id={styles['slider-container']}>
        {!playClicked ? <Slider max={5} min={1} handleChange={animationSpeedChange} defaultValue={5}/> : null}
      </div>
      <div className={styles['saved-item-list']}>
      {anims.map((curName, idx) => {
				return(
					<div className={styles['animation-item']}>
            <button className={styles['saved-item']} onClick={() => {if (!modeDataSending && !animPlaying) {setPlayClicked(true); handleFrameChoice(curName, true, animationSpeed);}}}>{curName}</button>
            <div>
              <button className={styles['delete']} onClick={() => setItemToDelete([curName, idx, 'animation'])}>delete</button>
              {!playClicked ? <img onClick={() => {if (!modeDataSending) {setPlayClicked(true); handleFrameChoice(curName, true, animationSpeed);}}} src='./icons/play-icon.png'/> : <p onClick={(e) => {setPlayClicked(false); turnOff(e, true); setAnimationSpeed(5);}}/>}
            </div>
					</div>
				)
			})}
      </div>
		</div>
	)
}

export default Gallery;