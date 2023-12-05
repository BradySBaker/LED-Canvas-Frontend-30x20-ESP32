import p5ble from 'p5ble';

import {gotValue} from './handleSendGet';

let blueTooth = new p5ble();
export default function connectToBle(setIsConnected, turnOn, setAnims, setPrevFrameNames, setModeDataSending, setConnectError) {
  setConnectError(false);
  setModeDataSending(true);
	var paramFuncs = {setIsConnected, turnOn, setAnims, setPrevFrameNames, setModeDataSending, setConnectError};
	blueTooth.connect('0000ffe0-0000-1000-8000-00805f9b34fb', (error, characteristics) => gotCharacteristics(error, characteristics, paramFuncs));
}



function onDisconnected() {
	ledConnected = false;
	setIsConnected(false);
}

window.addEventListener('beforeunload', function (event) {
  if (isConnected) {
    blueTooth.disconnect();
  }
});

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics, paramFuncs) {
  console.log('Discovered characteristic: ',characteristics);

paramFuncs.setModeDataSending(false);
  if (error) {
    console.log('error: ', error);
    paramFuncs.setConnectError(true);
    return;
  }

  window.blueToothCharacteristic = characteristics[0];

  blueTooth.startNotifications(window.blueToothCharacteristic, (value) => gotValue(value, paramFuncs.setAnims, paramFuncs.setPrevFrameNames, paramFuncs.setModeDataSending, paramFuncs.turnOn, blueTooth), 'string').catch((err) => console.log('error = ', err))
  blueTooth.onDisconnected(() => onDisconnected(paramFuncs.setIsConnected));
  ledConnected = blueTooth.isConnected();
  paramFuncs.setIsConnected(blueTooth.isConnected());
  // Add a event handler when the device is disconnected
}
//