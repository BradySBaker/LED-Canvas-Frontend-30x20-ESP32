import React from 'react';

import styles from './cssModules/homePage.module.css';

const HomePage = ({handleConnect, isConnected}) => {
  return (
    <div>
        <div className={`${styles['rgb-line']}`} id={`${styles['top']}`} />
        <div id={`${styles['main']}`}>
          <h1 className={`${styles['title']}`}>LED Canvas</h1>
          <h2 className={`${styles['title']}`}>Welcome</h2>
          <button id={`${styles['blue-button']}`} onClick={handleConnect}>
            <img className={`${styles['button-icon']}`} src='./icons/blu.png'></img>
            <img className={`${styles['button-icon']}`} src='./icons/arrow.png'></img>
          </button>
          <p className={`${styles['title']}`}>Not Connected</p>
          <h3></h3>
        </div>
        <div className={`${styles['rgb-line']}`} id={`${styles['bottom']}`} />
    </div>
  )
}

export default HomePage;