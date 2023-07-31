import React, {useState, useEffect} from 'react';

import styles from './cssModules/gallery.module.css';

const Gallery = ({frames, handleFrameChoice, prevFrameNames, handleDelete, anims, handleSave, modeDataSending, animPlaying, turnOff}) => {
  const [playClicked, setPlayClicked] = useState(false);
	const [frameElements, setFrameElements] = useState([]);

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
	}

  const deletePressed = (frameName, idx, type) => {
    if (!animPlaying && !modeDataSending) {
      handleDelete(frameName, idx, type);
    };
  };

	useEffect(createFrames,[frames]);

	return (
		<div id={styles['widget']}>
			<h1 className={styles['title']}>Drawings</h1>
      <div className={styles['line']} />
      {frameElements.length > 0 ? <h2 className={styles['title']}>Current</h2> : null}
      <div className={styles['saved-item-list']}>
        {frameElements.map((curElem, idx) => {
          return(
          <div>
            <canvas className={styles['frame']} onClick={() => {handleFrameChoice(frames[idx][16])/* 16 contains name */}}  ref={(canvas) => {canvas && canvas.getContext("2d").drawImage(curElem, 0, 0);}} width={128} height={128}></canvas>
            <button className={styles['delete']} onClick={() => {deletePressed(frames[idx][16], idx);}}>delete</button>
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
          <button className={styles['delete']} onClick={() => {deletePressed(curName, idx, 'prev');}}>delete</button>
        </div>
        )
        })}
      </div>
      <div className={styles['line']} />
      <h1 className={styles['title']} style={{marginTop: '80px'}}>Animations</h1>
      <div className={styles['line']} />
      <div className={styles['saved-item-list']}>
      {anims.map((curName, idx) => {
				return(
					<div className={styles['animation-item']}>
            <button className={styles['saved-item']} onClick={() => {if (!modeDataSending && !animPlaying) {setPlayClicked(true); handleFrameChoice(curName, true);}}}>{curName}</button>
            <div>
              <button className={styles['delete']} onClick={() => deletePressed(curName, idx, 'animation')}>delete</button>
              {!playClicked ? <img onClick={() => {if (!modeDataSending) {setPlayClicked(true); handleFrameChoice(curName, true);}}} src='./icons/play-icon.png'/> : <p onClick={(e) => {setPlayClicked(false); turnOff(e, true);}}/>}
            </div>
					</div>
				)
			})}
      </div>
		</div>
	)
}

export default Gallery;