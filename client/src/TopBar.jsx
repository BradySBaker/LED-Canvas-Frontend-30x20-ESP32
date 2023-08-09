import React, { useState } from 'react';

import styles from './cssModules/topBar.module.css'

import Slider from './Slider.jsx';

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
      <div  id={styles['slider']}>
        {allowBrightness ? <Slider id={styles['slider']} defaultValue={ledBrightness} handleChange={handleChange} max={100} min={1}/> : null}
      </div>
    </div>
  )
}

export default TopBar;