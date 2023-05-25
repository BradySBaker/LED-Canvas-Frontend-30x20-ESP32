import React, {useState, useEffect, useRef} from "react";

import { createRoot } from "react-dom/client";
import MatrixButtons from "./matrixButtons.jsx";
import FrameChoices from "./frameChoices.jsx";
import PongController from "./pongController.jsx";

import p5ble from 'p5ble';
import { HexColorPicker } from "react-colorful";
let blueToothCharacteristic;

var sending = false;
window.sendRequests = {'off': true};
window.color = "#FF0000";

window.ledConnected = false;
var sendingTimer = 0;

var waitingForFrames = true;

var names = "";

const App = function() {
	const [isConnected, setIsConnected] = useState(false);
	const [mouseDown, setMouseDown] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [frames, setFrames] = useState([]);
	const [curFrame, setCurFrame] = useState([]);
	const [drawMode, setDrawMode] = useState(false);
	const [gameMode, setGameMode] = useState(false);
	const [prevFrameNames, setPrevFrameNames] = useState(null);
	const [inputError, setInputError] = useState(false);
	const [anims, setAnims] = useState([]);
	const [animPlaying, setAnimPlaying] = useState(false);

let blueTooth = new p5ble();
function connectToBle() {
	blueTooth.connect('0000ffe0-0000-1000-8000-00805f9b34fb', gotCharacteristics);
}

var handleSendRequests = () => { //Occurs every 20ms
	sendingTimer++;
	if (sendingTimer >= 550) {
		sending = false;
	}
	if (Object.keys(sendRequests).length === 0) {
		setIsLoading(false);
	} else if (!isLoading && ledConnected) {
		setIsLoading(true);
	}
	if ((!sending && ledConnected && !waitingForFrames)) {
		sendingTimer = 0;
		var toBeSent = '';
		var positions = 0;
		if (sendRequests["off"]) {
			sendData("OFF\n");
			window.sendRequests = {};
		} else {
			for (var key in sendRequests) {
				if (key === 'color' && positions === 0) {
					sendData(sendRequests[key]);
					delete sendRequests['color'];
					break;
				} else if (key === 'color') {
					sendData(toBeSent);
					toBeSent = '';
					break;
				} else if (positions < 3){
					toBeSent += key;
					positions++;
					delete sendRequests[key];
				} else {
					sendData(toBeSent);
					toBeSent = '';
					break;
				}
			}
			if (toBeSent.length > 0) {
				sendData(toBeSent);
			}
		}
	}
	setTimeout(handleSendRequests, 20);
};


useEffect(handleSendRequests, []); //On start

function onDisconnected() {
	console.log('Device got disconnected.');
	ledConnected = false;
	setIsConnected(false);
}

function gotValue(value) {
	if (waitingForFrames) {
		names += value;
		if (value.includes('~')) {
			waitingForFrames = false;
			var correctFrameNames = [];
			var correctAnimNames = [];
			names.split(',').forEach((curName) => { //Cleanup weird name values
				if (curName[0] === '.') {
					correctAnimNames.push(curName.slice(1));
				} else if (curName !== "~" && curName.length > 0) {
					correctFrameNames.push(curName);
				}
			});
		setAnims(correctAnimNames);
		setPrevFrameNames(correctFrameNames);
		}
	}
	sending = false;
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
if (error) {
	console.log('error: ', error);
	return;
}

blueToothCharacteristic = characteristics[0];
blueTooth.startNotifications(blueToothCharacteristic, gotValue, 'string');
blueTooth.onDisconnected(onDisconnected);
turnOn();
ledConnected = blueTooth.isConnected();
setIsConnected(blueTooth.isConnected());
// Add a event handler when the device is disconnected
}

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
function sendData(command) {
	sending = true;
  const inputValue = command + '\r';
  if (!("TextEncoder" in window)) {
    console.log("Sorry, this browser does not support TextEncoder...");
  }
  var enc = new TextEncoder(); // always utf-8
	try {
		console.log('Sending' , command);
		blueToothCharacteristic.writeValue(enc.encode(inputValue))
	} catch (error) {
		sending = false;
		console.log('Error sendData ', error);
	}
}

const handleColor = (newColor) => {
	document.getElementById('title').style.color = newColor;
	color = newColor;
	sendRequests['color'] = `COLOR${newColor.slice(1, newColor.length)}`;
}

const handleSave = (e, animation, animName = document.getElementById('animName').value) => {
	setInputError(false);
	var drawName = document.getElementById('drawName').value;

	if (drawName.length > 0 || animName.length > 0) {
		const regex = /^[a-zA-Z0-9_\-]+$/; // valid characters are letters, numbers, underscores, and dashes
		if ((!regex.test(drawName) && !animation) || (!regex.test(animName) && animation)) {
			// the name is invalid
			setInputError("Invalid character");
			return;
		}
		if (animation) {
			if (!anims.includes(animName)) {
				var newAnims = JSON.parse(JSON.stringify(anims));
				newAnims.push(animName);
				setAnims(newAnims);
			}
			sendData('A' + animName);
			return;
		}
		//Retrieves all matrix colors and adds them to matrix array
		var columnElements = document.getElementById('buttons').children;
		var curFrame = [];
		for (var y = 0; y < 16; y++) {
			curFrame.push([]);
			var curColumn = curFrame[y];
			for (var x = 0; x < 16; x++) {
				var curSquare = columnElements[y].children[x];
				var curColor = window.getComputedStyle(curSquare).getPropertyValue("background-color");
				curColumn.push(curColor);
			}
		}
		curFrame[16] = drawName; //Set 16th column to name of frame
		var newFrames = JSON.parse(JSON.stringify(frames));
		newFrames.push(curFrame);
		setFrames(newFrames);
		turnOff(null, true);
		sendData('S' + drawName);
	} else {
		setInputError("Please input a name for your drawing");
	}
};

const handleFrameChoice = (frameName, animation) => {
	if (animation) {
		setAnimPlaying(true);
		sendData(`I${frameName}`);
		return;
	}
	sendData(`F${frameName}`);
};

const handleDelete = (frameName, idx, type) => {
	if (type === 'prev') {
		setPrevFrameNames(prevFrameNames.slice(0, idx).concat(prevFrameNames.slice(idx+1)))
	} else if (type === 'animation'){
		setAnims(anims.slice(0, idx).concat(anims.slice(idx+1)));
		sendData(`Z${frameName}`);
		return;
	} else {
		setFrames(frames.slice(0, idx).concat(frames.slice(idx+1)));
	}
	sendData(`D${frameName}`);
}

const handleStop = () => {
	setAnimPlaying(false);
	sendData('STOP');
}

	return (
		<div id='colorApp'>
			<div>Version 2.0</div>
			{isConnected ? <h1 style={{'color': 'blue', 'fontSize': '15px'}}>Connected</h1> : <h1 style={{'color': 'red', 'fontSize': '20px'}}>Not connected</h1>}
			{!isConnected ? <button onClick={connectToBle}>Connect</button> : null}
			<h1 id='title'>
			<div id='title-line'></div>
				LED Canvas
			</h1>
			{drawMode || gameMode ? <button style={{'position': 'absolute', 'right': '10%', 'fontSize': '20px'}} onClick={() => {setDrawMode(false); setGameMode(false);}}>Back</button> : null}
			{isLoading ? <img id='loading' src='./icons/loading.gif'></img> : null}
		{drawMode ? <div className="picker-container">
			<HexColorPicker style={{height: 'calc(90vw * 0.5)'}} color={color} onChange={handleColor} />
		</div> : null}
			<div id='app' onMouseDown={() => {setMouseDown(true);}} onMouseUp={() => setMouseDown(false)}>
			{drawMode ? <button onClick={turnOff}>Turn Off</button> : null}
			{!drawMode && !gameMode && isConnected ?
			<div id='modeChoices'>
				<button onClick={() => setDrawMode(true)}>Draw Mode</button>
				<button onClick={() => {setGameMode(true); sendData('GAME')}}>Game Mode</button>
			</div> : null}
			{inputError ? <div style={{"color": "red"}}>{inputError}</div>: null}
			{drawMode && !isLoading ?
			<>
			<button onClick={handleSave}>Save Drawing</button>
			<input id="drawName" type="text" placeholder="drawing..." maxLength="7" />
			<button onClick={(e) => handleSave(e, true)}>Save Frame</button>
			<input id="animName" type="text" placeholder="animation name..." maxLength="7"/>
			<button onClick={() => sendData("RAIN")}>rain</button>
			{animPlaying ? <button onClick={handleStop}>STOP</button>: null }
			</>: null}
			{drawMode ? <FrameChoices handleSave={handleSave} anims={anims} prevFrameNames={prevFrameNames} frames={frames} handleFrameChoice={handleFrameChoice} handleDelete={handleDelete}/> : null}
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
