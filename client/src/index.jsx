import React, {useState, useEffect, useRef} from "react";

import {handleSendRequests, sendData} from './helperFunctions/handleSendGet';
import {handleSave, handleDelete} from './helperFunctions/handleSaveDelete';
import connectToBle from './helperFunctions/setupBluetooth';

import { createRoot } from "react-dom/client";

import Gallery from "./Gallery.jsx";
import RainController from "./rainController.jsx";
import ModeSelector from "./ModeSelector.jsx";
import CreateMode from "./CreateMode.jsx";
import AVController from "./avController.jsx";


import HomePage from "./HomePage.jsx";
import TopBar from "./TopBar.jsx";

window.rainColorsSent = 0;

window.ledConnected = false;

window.modeRunning = true;

window.framePlayed = false;

window.turnedOn = false;

window.color = "#FFFFFF";

const App = function() {
	const [isConnected, setIsConnected] = useState(false);
	const [mouseDown, setMouseDown] = useState(false);
	const [pixelSending, setPixelSending] = useState(false);
	const [modeDataSending, setModeDataSending] = useState(false);
	const [frames, setFrames] = useState([]);
	const [curFrame, setCurFrame] = useState([]);

	const [showCreateMode, setShowCreateMode] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

	const [audioVisualizer, setAudioVisualizer] = useState(false);
	const [rainMode, setRainMode] = useState(false);
	const [prevFrameNames, setPrevFrameNames] = useState([]);
	const [anims, setAnims] = useState([]);
	const [animPlaying, setAnimPlaying] = useState(false);

  const [colorChoices, setColorChoices] = useState([]);
	const [curChosenColor, setCurChosenColor] = useState(color);

  const [selectedColor, setSelectedColor] = useState(color);setShowCreateMode

  const [connectError, setConnectError] = useState(false);

  useEffect(() => { //Mouse up handler
    const handleMouseUp = () => {
      setMouseDown(false);
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

	useEffect(() => handleSendRequests(setPixelSending, pixelSending), []); //On start
	useEffect(() => {if (isConnected === true) {handleModeStartStop()}}, [isConnected]) //On connect

	function turnOn() {
		setTimeout(() => {sendData("names");}, 100);
	}

	function turnOff(e, animation = false) {
    sendRequests["off"] = true;
    setAnimPlaying(false);
    if (animation) {
      return;
    }
		for (var x = 0; x < 16; x++) {
			for (var y = 0; y < 16; y++) {
				document.getElementById(`${x},${y}`).style.backgroundColor = 'black';
			}
		}
	}

	const handleFrameChoice = (frameName, animation) => {
		if (modeRunning && !framePlayed) {
			setModeDataSending(true);
			sendData(`F${frameName}`);
			setTimeout(() => {handleFrameChoice(frameName)}, 400);
			return;
		} else if (modeRunning) {
			framePlayed = false;
			setModeDataSending(false);
			return;
		}
		if (animation) {
			setAnimPlaying(true);
			sendData(`I${frameName}`);
			return;
		}
		sendData(`F${frameName}`);
	};

	const callSave = (e, animation, frameName) => {
		return handleSave(sendData, setFrames, frames, anims, setAnims, e, animation, frameName);
	};

	const callDelete = (frameName, idx, type) => {
		handleDelete(setFrames, frames, setPrevFrameNames, prevFrameNames, anims, setAnims, sendData, frameName, idx, type);
	};

	//Rain/Audio Visaulizer handler for off and on
	const handleModeStartStop = (e, rain, startMode, rainAmount) => {
		if (modeRunning && !startMode) {
      setModeDataSending(true);
			sendData("SM");
			setTimeout(handleModeStartStop, 400);
		} else if (e) {
			if (!modeRunning && rain) {
        setModeDataSending(true);
				if (!rainAmount) {
					rainAmount = document.getElementById('rainAmount').value
				}
				if (isNaN(Number(rainAmount)) || rainAmount.length < 1 || rainColorsSent === 0) {
					return "Please input a number value and a color";
				}
				sendData("R" + rainAmount);
				setTimeout(() => {handleModeStartStop(true, true, true, rainAmount)}, 400);
			} else if(!modeRunning) { //Audio visualizer
        sendData("HAV");
				setTimeout(() => {handleModeStartStop(true, false, true, rainAmount)}, 400);
      }
		} else {
      setModeDataSending(false);
      setColorChoices([]);
    }
    return false;
	};
  const handleModeChooseColor = () => {
		var colors = JSON.parse(JSON.stringify(colorChoices));
		colors.push(curChosenColor);
		setColorChoices(colors);
		sendData("CM" + curChosenColor.slice(1));
		setModeDataSending(true);
		rainColorsSent++;
	};

  const handleConnect = () => {
    connectToBle(setIsConnected, turnOn, setAnims, setPrevFrameNames, setModeDataSending, setConnectError);
  };

  const disableModes = () => {
    setShowCreateMode(false);
    setShowGallery(false);
    turnOff();
  };

	return (
		<div id='colorApp' onMouseDown={() => setMouseDown(true)} >
      {showGallery || showCreateMode ? <TopBar selectedColor={selectedColor} disableModes={disableModes}/> : null}
      {!isConnected ? <HomePage handleConnect={handleConnect} connectError={connectError}/> :  null}
      {isConnected && !showCreateMode && !showGallery ? <ModeSelector setShowGallery ={setShowGallery} setShowCreateMode={setShowCreateMode}/> : null}
      {showGallery ?  <Gallery animPlaying={animPlaying} turnOff={turnOff} handleSave={callSave} modeDataSending={modeDataSending} anims={anims} prevFrameNames={prevFrameNames} frames={frames} handleFrameChoice={handleFrameChoice} handleDelete={callDelete}/> : null}
      {showCreateMode ? <CreateMode turnOff={turnOff} callSave={callSave} animPlaying={animPlaying} pixelSending={pixelSending} mouseDown={mouseDown} handleFrameChoice={handleFrameChoice} sendRequests={sendRequests} selectedColor={selectedColor} setSelectedColor={setSelectedColor}/> : null}
      {(pixelSending || modeDataSending) ? <img id='loading' src='./icons/loading.gif'></img> : null}
			{/* {drawMode || audioVisualizer || rainMode ? <button style={{'position': 'absolute', 'right': '2%', 'fontSize': '20px'}} onClick={() => {setDrawMode(false); setAudioVisualizer(false); setRainMode(false); if (modeRunning) {handleModeStartStop()}; }}>Back</button> : null}
			{(pixelSending || modeDataSending) && isConnected ? <img id='loading' src='./icons/loading.gif'></img> : null}
			<div id='app' onMouseDown={() => setMouseDown(true)}>
			{!drawMode && !audioVisualizer && !rainMode && isConnected && !pixelSending && !modeDataSending ?
			<div id='modeChoices'>
				<button onClick={() => setDrawMode(true)}>Draw Mode</button>
				<button onClick={() => {setAudioVisualizer(true);}}>Audio Visualizer</button>
				<button onClick={() => {setRainMode(true);}}>Rain Mode</button>
			</div> : null}
			{drawMode ? <DrawMode inputError={inputError} turnOff={turnOff} callSave={callSave} animPlaying={animPlaying} pixelSending={pixelSending}/> : null}
			{drawMode || rainMode && !modeDataSending ? <FrameChoices handleSave={callSave} anims={anims} prevFrameNames={prevFrameNames} frames={frames} handleFrameChoice={handleFrameChoice} handleDelete={callDelete}/> : null}
			{rainMode ? <RainController modeRunning={modeRunning} modeDataSending={modeDataSending} curChosenColor={curChosenColor} handleChooseColor={handleModeChooseColor} colorChoices={colorChoices} setCurChosenColor={setCurChosenColor} modeDataSending={modeDataSending} setInputError={setInputError} handleModeStartStop={handleModeStartStop}/> : null}
			{drawMode ? <MatrixButtons mouseDown={mouseDown} sendRequests={sendRequests}/> : null}
      {audioVisualizer ? <AVController modeRunning={modeRunning} handleChooseColor={handleModeChooseColor} curChosenColor={curChosenColor} modeDataSending={modeDataSending} setCurChosenColor={setCurChosenColor} colorChoices={colorChoices} handleModeStartStop={handleModeStartStop}/> : null}
			{inputError ? <div style={{"color": "red"}}>{inputError}</div>: null}
		</div> */}
    {showCreateMode || showGallery ? <button id='bottom-button' onClick={() => {if (showCreateMode) {setShowGallery(true); setShowCreateMode(false);} else {setShowGallery(false); setShowCreateMode(true);}}}>{!showGallery ? 'Gallery' : 'Create'}</button> : null}
		</div>
	)
}

const container = document.getElementById('root');
const root = createRoot(container);

  root.render(
    <App />
  );
