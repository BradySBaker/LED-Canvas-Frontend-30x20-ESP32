import p5ble from 'p5ble';

import {gotValue} from './handleSendGet';

let blueTooth = new p5ble();
export default function connectToBle(setIsConnected, turnOn, setAnims, setPrevFrameNames, setRainSending) {
	var paramFuncs = {setIsConnected, turnOn, setAnims, setPrevFrameNames, setRainSending};
	blueTooth.connect('0000ffe0-0000-1000-8000-00805f9b34fb', (error, characteristics) => gotCharacteristics(error, characteristics, paramFuncs));
}



function onDisconnected() {
	console.log('Device got disconnected.');
	ledConnected = false;
	setIsConnected(false);
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics, paramFuncs) {
if (error) {
	console.log('error: ', error);
	return;
}

window.blueToothCharacteristic = characteristics[0];
blueTooth.startNotifications(window.blueToothCharacteristic, (value) => gotValue(value, paramFuncs.setAnims, paramFuncs.setPrevFrameNames, paramFuncs.setRainSending, paramFuncs.turnOn), 'string');
blueTooth.onDisconnected(() => onDisconnected(paramFuncs.setIsConnected));
ledConnected = blueTooth.isConnected();
paramFuncs.setIsConnected(blueTooth.isConnected());
// Add a event handler when the device is disconnected
}