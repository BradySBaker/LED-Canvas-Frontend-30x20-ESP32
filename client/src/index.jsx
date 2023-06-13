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

window.rainColorsSent = 0;

window.color = "#FF0000";

window.ledConnected = false;

window.isRaining = true;

window.framePlayed = false;

window.turnedOn = false;

const App = function() {
	const [isConnected, setIsConnected] = useState(false);
	const [mouseDown, setMouseDown] = useState(false);
	const [pixelSending, setPixelSending] = useState(false);
	const [rainSending, setRainSending] = useState(false);
	const [frames, setFrames] = useState([]);
	const [curFrame, setCurFrame] = useState([]);
	const [drawMode, setDrawMode] = useState(false);
	const [gameMode, setGameMode] = useState(false);
	const [rainMode, setRainMode] = useState(false);
	const [prevFrameNames, setPrevFrameNames] = useState(null);
	const [inputError, setInputError] = useState(false);
	const [anims, setAnims] = useState([]);
	const [animPlaying, setAnimPlaying] = useState(false);

	useEffect(() => handleSendRequests(setPixelSending, pixelSending), []); //On start
	useEffect(() => {if (isConnected === true) {handleRain()}}, [isConnected]) //On connect

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
			setRainSending(true);
			sendData(`F${frameName}`);
			setTimeout(() => {handleFrameChoice(frameName)}, 400);
			return;
		} else if (isRaining) {
			framePlayed = false;
			setRainSending(false);
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
	};


	const callSave = (e, animation, animName = document.getElementById('animName').value) => {
		handleSave(sendData, setFrames, frames, anims, setAnims, setInputError, e, animation, animName);
	};

	const callDelete = (frameName, idx, type) => {
		handleDelete(setFrames, frames, setPrevFrameNames, anims, setAnims, sendData, frameName, idx, type);
	};

	//Rain handler for off and on
	const handleRain = (e, startRain, amount) => {
		if (isRaining && !startRain) {
			sendData("SR");
			setTimeout(handleRain, 400);
		} else if (e) {
			if (!isRaining) {
				if (!amount) {
					amount = document.getElementById('rainAmount').value
				}
				if (isNaN(Number(amount)) || amount.length < 1 || rainColorsSent === 0) {
					setInputError("Please input a number value and a color");
					return;
				}
				sendData("R" + amount);
				setTimeout(() => {handleRain(true, true, amount)}, 400);
			}
		}
	};

	return (
		<div id='colorApp'>
			<div>Version 2.0</div>
			{isConnected ? <h1 style={{'color': 'blue', 'fontSize': '15px'}}>Connected</h1> : <h1 style={{'color': 'red', 'fontSize': '20px'}}>Not connected</h1>}
			{!isConnected ? <button onClick={() => connectToBle(setIsConnected, turnOn, setAnims, setPrevFrameNames, setRainSending)}>Connect</button> : null}
			<h1 id='title'>
			<div id='title-line'></div>
				LED Canvas
			</h1>
			{drawMode || gameMode || rainMode ? <button style={{'position': 'absolute', 'right': '10%', 'fontSize': '20px'}} onClick={() => {setDrawMode(false); setGameMode(false); setRainMode(false);}}>Back</button> : null}
			{pixelSending || rainSending ? <img id='loading' src='./icons/loading.gif'></img> : null}
			<div id='app' onMouseDown={() => {setMouseDown(true);}} onMouseUp={() => setMouseDown(false)}>
			{!drawMode && !gameMode && !rainMode && isConnected && !pixelSending ?
			<div id='modeChoices'>
				<button onClick={() => setDrawMode(true)}>Draw Mode</button>
				<button onClick={() => {setGameMode(true); sendData('GAME')}}>Game Mode</button>
				<button onClick={() => {setRainMode(true);}}>Rain Mode</button>
			</div> : null}
			{drawMode ? <DrawMode inputError={inputError} turnOff={turnOff} callSave={callSave} handleStop={handleStop} animPlaying={animPlaying} pixelSending={pixelSending}/> : null}
			{drawMode || rainMode && !rainSending ? <FrameChoices handleSave={callSave} anims={anims} prevFrameNames={prevFrameNames} frames={frames} handleFrameChoice={handleFrameChoice} handleDelete={callDelete}/> : null}
			{rainMode ? <RainController sendData={sendData} setRainSending={setRainSending} rainSending={rainSending} setInputError={setInputError} handleRain={handleRain}/> : null}
			{/* <RainController sendData={sendData} handleRain={handleRain}/> */}
			{drawMode ? <MatrixButtons mouseDown={mouseDown} sendRequests={sendRequests}/> : null}
			{gameMode ? <PongController sendData={sendData}/> : null}
			{inputError ? <div style={{"color": "red"}}>{inputError}</div>: null}
		</div>
		</div>
	)
}

const container = document.getElementById('root');
const root = createRoot(container);

  root.render(
    <App />
  );
