import React, {useState, useEffect, useRef} from "react";
import { createRoot } from "react-dom/client";
import MatrixButtons from "./matrixButtons.jsx";
import p5ble from 'p5ble';
import { PhotoshopPicker } from 'react-color';
let blueToothCharacteristic;

var sending = false;
window.sendRequests = {'off': true};
window.color = "#FF0000";

window.ledConnected = false;

//p1,1p2,2p3,3p4,4,p,4,4
const App = function() {
	const [isConnected, setIsConnected] = useState(false);
	const [mouseDown, setMouseDown] = useState(false);
	const [recieved, setRecieved] = useState([]);

let blueTooth = new p5ble();
function connectToBle() {
	blueTooth.connect('0000ffe0-0000-1000-8000-00805f9b34fb', gotCharacteristics);
}

var handleSendRequests = () => { //Occurs every 500ms
	console.log(sending);
	if (!sending && ledConnected) {
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
					toBeSent = '';
					sendData(toBeSent);
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

useEffect(handleSendRequests, [])

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
function turnOff() {
	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 16; y++) {
			document.getElementById(`${x},${y}`).style.backgroundColor = 'black';
		}
	}
	sendRequests["off"] = true;
}
async function sendData(command) {
	sending = true;
  const inputValue = command;
  if (!("TextEncoder" in window)) {
    console.log("Sorry, this browser does not support TextEncoder...");
  }
  var enc = new TextEncoder(); // always utf-8
	try {
		console.log('Sending' , command);
		await blueToothCharacteristic.writeValue(enc.encode(inputValue));
	} catch (error) {
		sending = false;
		console.log('Error sendData ', error);
	}
}

var handleColor = (newColor) => {
	color = newColor.hex;
	sendRequests['color'] = `COLOR${newColor.hex.slice(1, newColor.hex.length)}`;
}

	return (
		<>
		<PhotoshopPicker width='400px' color={color} onChangeComplete={handleColor}/>
			<div id='app' onMouseDown={() => {setMouseDown(true);}} onMouseUp={() => setMouseDown(false)}>
			{isConnected ? <h1>Connected</h1> : <h1>Not connected</h1>}
			{isConnected ? <button onClick={turnOff}>Turn Off</button> : null}
			{!isConnected ? <button onClick={connectToBle}>Connect</button> : null}
			{isConnected ? <MatrixButtons mouseDown={mouseDown}  recieved={recieved} sendRequests={sendRequests}/> : null}
		</div>
		</>
	)
}

const container = document.getElementById('root');
const root = createRoot(container);

  root.render(
    <App />
  );
