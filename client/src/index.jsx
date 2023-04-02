import React, {useState, useEffect, useRef} from "react";
import { createRoot } from "react-dom/client";
import MatrixButtons from "./matrixButtons.jsx";
import p5ble from 'p5ble';
import { PhotoshopPicker } from 'react-color';
let blueToothCharacteristic;

//p1,1p2,2p3,3p4,4,p,4,4
const App = function() {
	const [isConnected, setIsConnected] = useState(false);
	const [mouseDown, setMouseDown] = useState(false);
	const [color, setColor] = useState('#FF0000');
let blueTooth = new p5ble();
function connectToBle() {
	blueTooth.connect('0000ffe0-0000-1000-8000-00805f9b34fb', gotCharacteristics);
}

function onDisconnected() {
	console.log('Device got disconnected.');
	setIsConnected(false);
}

function gotValue(value) {
	console.log(value);
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


setIsConnected(blueTooth.isConnected());
// Add a event handler when the device is disconnected
}

function turnOn() {
  sendData("COLOR" + ledColorPicker.value()+ "\n");
}
function turnOff() {
	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 16; y++) {
			document.getElementById(`${x},${y}`).style.backgroundColor = 'white';
		}
	}
  sendData("OFF\n");
}
function sendData(command) {
  const inputValue = command;
  if (!("TextEncoder" in window)) {
    console.log("Sorry, this browser does not support TextEncoder...");
  }
  var enc = new TextEncoder(); // always utf-8
  blueToothCharacteristic.writeValue(enc.encode(inputValue));
}

var handleColor = (color) => {
	setColor(color.hex);
	sendData(`COLOR${color.hex.slice(1, color.hex.length)}`) //Send color change to arduino
}

	return (
		<>
		<PhotoshopPicker width='400px' color={color} onChangeComplete={handleColor}/>
			<div id='app' onMouseDown={() => {setMouseDown(true);}} onMouseUp={() => setMouseDown(false)}>
			{isConnected ? <h1>Connected</h1> : <h1>Not connected</h1>}
			{isConnected ? <button onClick={turnOff}>Turn Off</button> : null}
			{!isConnected ? <button onClick={connectToBle}>Connect</button> : null}
			<MatrixButtons color={color} mouseDown={mouseDown} sendData={sendData} />
		</div>
		</>
	)
}

const container = document.getElementById('root');
const root = createRoot(container);

  root.render(
    <App />
  );
