import React from 'react';

import styles from './cssModules/topBar.module.css'

const TopBar = ({selectedColor}) => {
  return (
    <div id={styles['widget']}>
      <button id={styles['back-button']}>
        <img id={styles['button-icon']} src='./icons/arrowThick.png'></img>
      </button>
      <div id={styles['title']} style={{color: selectedColor}}>LED Canvas</div>
    </div>
  )
}

export default TopBar;