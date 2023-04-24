import React, {useState, useEffect, useRef} from "react";

import { createRoot } from "react-dom/client";
import MatrixButtons from "./matrixButtons.jsx";
import FrameChoices from "./frameChoices.jsx";

import p5ble from 'p5ble';
import { HexColorPicker } from "react-colorful";
let blueToothCharacteristic;

var sending = false;
window.sendRequests = {'off': true};
window.color = "#FF0000";

window.ledConnected = false;
var sendingTimer = 0;

const App = function() {
	const [isConnected, setIsConnected] = useState(false);
	const [mouseDown, setMouseDown] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [frames, setFrames] = useState([]);
	const [curFrame, setCurFrame] = useState([]);

let blueTooth = new p5ble();
function connectToBle() {
	blueTooth.connect('0000ffe0-0000-1000-8000-00805f9b34fb', gotCharacteristics);
}

var handleSendRequests = () => { //Occurs every 500ms
	sendingTimer++;
	if (sendingTimer >= 20) {
		sending = false;
	}
	if (Object.keys(sendRequests).length === 0) {
		setIsLoading(false);
	} else if (!isLoading && ledConnected) {
		setIsLoading(true);
		console.log('Set to true')
	}
	if ((!sending && ledConnected)) {
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
	setTimeout(handleSendRequests, 500);
};


useEffect(handleSendRequests, []) //On start

function onDisconnected() {
	console.log('Device got disconnected.');
	ledConnected = false;
	setIsConnected(false);
}

function gotValue(value) {
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
  sendData("COLORff0000");
}
function turnOff(e, save = false) {
	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 16; y++) {
			document.getElementById(`${x},${y}`).style.backgroundColor = 'black';
		}
	}
	if (!save) {
		sendRequests["off"] = true;
	}
}
function sendData(command) {
	sending = true;
  const inputValue = command;
  if (!("TextEncoder" in window)) {
    console.log("Sorry, this browser does not support TextEncoder...");
  }
  var enc = new TextEncoder(); // always utf-8
	try {
		console.log('Sending' , command);
		blueToothCharacteristic.writeValue(enc.encode(inputValue));
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
const handleSave = () => {
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
	var newFrames = JSON.parse(JSON.stringify(frames));
	newFrames.push(curFrame);
	setFrames(newFrames);
	turnOff(null, true);

	sendData('save');
};

var handleFrameChoice = (frame) => {
	sendData(`F${frame}`);
};

	return (
		<div id='colorApp'>
			<h1 id='title'>LED Canvas</h1>
			{isLoading ? <img id='loading' src='./icons/loading.gif'></img> : null}
		<div className="picker-container">
			<HexColorPicker style={{height: 'calc(90vw * 0.5)'}} color={color} onChange={handleColor} />
		</div>
		{isConnected ? <h1 >Connected</h1> : <h1 >Not connected</h1>}
			<div id='app' onMouseDown={() => {setMouseDown(true);}} onMouseUp={() => setMouseDown(false)}>
			{isConnected ? <button onClick={turnOff}>Turn Off</button> : null}
			{!isConnected ? <button onClick={connectToBle}>Connect</button> : null}
			{isConnected && !isLoading ? <button onClick={handleSave}>SAVE</button> : null}
			<FrameChoices frames={frames} handleFrameChoice={handleFrameChoice}/>
			{isConnected ? <MatrixButtons mouseDown={mouseDown} sendRequests={sendRequests}/> : null}
		</div>
		</div>
	)
}

const container = document.getElementById('root');
const root = createRoot(container);

  root.render(
    <App />
  );
