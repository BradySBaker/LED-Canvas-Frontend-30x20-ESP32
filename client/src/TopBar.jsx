import React, { useState } from 'react';

import styles from './cssModules/topBar.module.css'

const TopBar = ({selectedColor, disableModes, sendData, allowBrightness}) => {
  const [brightness, setBrightness] = useState(100);
  const handleChange = (e) => {
    ledBrightness = e.target.value;
    setBrightness(ledBrightness);
    window.sendRequests["brightness"] = "B" + ledBrightness;
  };

  return (
    <div id={styles['widget']}>
      <button id={styles['back-button']} onClick={disableModes}>
        <img id={styles['button-icon']} src='./icons/arrowThick.png'></img>
      </button>
      <div id={styles['title']} style={{color: selectedColor, opacity: brightness/100}}>LED Canvas</div>
      {allowBrightness ? <input id={styles['slider']}
        type="range"
        min={1}
        max={100}
        defaultValue={brightness}
        onMouseUp={handleChange}
        onTouchEnd={handleChange}
      />: null}
    </div>
  )
}

export default TopBar;