import React from 'react';

import styles from './cssModules/homePage.module.css';

const HomePage = ({handleConnect, isConnected}) => {
  return (
    <div>
      <div>Version 2.0</div>
        {isConnected ? <h1 style={{'color': 'blue', 'fontSize': '15px'}}>Connected</h1> : <h1 style={{'color': 'red', 'fontSize': '20px'}}>Not connected</h1>}
        {!isConnected ? <button onClick={handleConnect}>Connect</button> : null}
        <h1 id={`${styles['title']}`}>
        <div id={`${styles['title-line']}`} />
          LED Canvas
        </h1>
    </div>
  )
}

export default HomePage;