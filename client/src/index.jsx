import React, {useState, useEffect, useRef} from "react";

import {handleSendRequests, sendData} from './helperFunctions/handleSendGet';
import {handleSave, handleDelete} from './helperFunctions/handleSaveDelete';
import connectToBle from './helperFunctions/setupBluetooth';

import { createRoot } from "react-dom/client";
import MatrixButtons from "./matrixButtons.jsx";
import FrameChoices from "./frameChoices.jsx";
import PongController from "./pongController.jsx";
import RainController from "./rainController.jsx";
import DrawMode from "./drawMode.jsx";

window.color = "#FF0000";

window.ledConnected = false;

window.isRaining = false;

window.framePlayed = false;

const App = function() {
	const [isConnected, setIsConnected] = useState(false);
	const [mouseDown, setMouseDown] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [rainLoading, setRainLoading] = useState(false);
	const [frames, setFrames] = useState([]);
	const [curFrame, setCurFrame] = useState([]);
	const [drawMode, setDrawMode] = useState(false);
	const [gameMode, setGameMode] = useState(false);
	const[rainMode, setRainMode] = useState(false);
	const [prevFrameNames, setPrevFrameNames] = useState(null);
	const [inputError, setInputError] = useState(false);
	const [anims, setAnims] = useState([]);
	const [animPlaying, setAnimPlaying] = useState(false);

useEffect(() => handleSendRequests(setIsLoading, isLoading), []); //On start

function turnOn() {
	setTimeout(() => {sendData("names");}, 100);
}

function turnOff(e, save = false) {
	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 16; y++) {
			document.getElementById(`${x},${y}`).style.backgroundColor = 'black';
		}
	}
	sendRequests["off"] = true;
}


const handleFrameChoice = (frameName, animation) => {
	if (isRaining && !framePlayed) {
		setRainLoading(true);
		sendData(`F${frameName}`);
		setTimeout(() => {handleFrameChoice(frameName)}, 400);
		return;
	} else if (isRaining) {
		framePlayed = false;
		setRainLoading(false);
		return;
	}
	if (animation) {
		setAnimPlaying(true);
		sendData(`I${frameName}`);
		return;
	}
	sendData(`F${frameName}`);
};


const handleStop = () => {
	sendData('STOP');
	setAnimPlaying(false);
}

const handleRain = (e, startRain, amount) => {
	if (isRaining && !startRain) {
		sendData("SR");
		setTimeout(handleRain, 400);
		setRainLoading(true);
	} else if (e) {
		if (!isRaining) {
			if (!amount) {
				amount = document.getElementById('rainAmount').value;
			}
			sendData("R" + amount);
			setTimeout(() => {handleRain(true, true, amount)}, 400);
			setRainLoading(true);
		} else {
			setRainLoading(false);
		}
	} else {
		setRainLoading(false);
	}
};

const callSave = (e, animation, animName = document.getElementById('animName').value) => {
	handleSave(sendData, setFrames, frames, anims, setAnims, setInputError, e, animation, animName);
}

const callDelete = (frameName, idx, type) => {
	handleDelete(setFrames, frames, setPrevFrameNames, anims, setAnims, sendData, frameName, idx, type);
}

	return (
		<div id='colorApp'>
			<div>Version 2.0</div>
			{isConnected ? <h1 style={{'color': 'blue', 'fontSize': '15px'}}>Connected</h1> : <h1 style={{'color': 'red', 'fontSize': '20px'}}>Not connected</h1>}
			{!isConnected ? <button onClick={() => connectToBle(setIsConnected, turnOn, setAnims, setPrevFrameNames)}>Connect</button> : null}
			<h1 id='title'>
			<div id='title-line'></div>
				LED Canvas
			</h1>
			{drawMode || gameMode || rainMode ? <button style={{'position': 'absolute', 'right': '10%', 'fontSize': '20px'}} onClick={() => {setDrawMode(false); setGameMode(false); setRainMode(false);}}>Back</button> : null}
			{isLoading || rainLoading ? <img id='loading' src='./icons/loading.gif'></img> : null}
			<div id='app' onMouseDown={() => {setMouseDown(true);}} onMouseUp={() => setMouseDown(false)}>
			{!drawMode && !gameMode && !rainMode && isConnected && !isLoading ?
			<div id='modeChoices'>
				<button onClick={() => setDrawMode(true)}>Draw Mode</button>
				<button onClick={() => {setGameMode(true); sendData('GAME')}}>Game Mode</button>
				<button onClick={() => {setRainMode(true);}}>Rain Mode</button>
			</div> : null}
			{drawMode ? <DrawMode turnOff={turnOff} callSave={callSave} handleStop={handleStop} animPlaying={animPlaying} isLoading={isLoading}/> : null}
			{inputError ? <div style={{"color": "red"}}>{inputError}</div>: null}
			{drawMode || rainMode && !rainLoading ? <FrameChoices handleSave={callSave} anims={anims} prevFrameNames={prevFrameNames} frames={frames} handleFrameChoice={handleFrameChoice} handleDelete={callDelete}/> : null}
			{rainMode && !rainLoading ? <RainController sendData={sendData} handleRain={handleRain}/> : null}
			{/* <RainController sendData={sendData} handleRain={handleRain}/> */}
			{drawMode ? <MatrixButtons mouseDown={mouseDown} sendRequests={sendRequests}/> : null}
			{gameMode ? <PongController sendData={sendData}/> : null}
		</div>
		</div>
	)
}

const container = document.getElementById('root');
const root = createRoot(container);

  root.render(
    <App />
  );
