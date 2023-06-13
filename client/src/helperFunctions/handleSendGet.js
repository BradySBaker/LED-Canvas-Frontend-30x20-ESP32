window.sending = false;
window.sendRequests = {'off': true};
window.waitingForFrames = true;

var sendingTimer = 0;

var names = "";

export const handleSendRequests = (setPixelSending, pixelSending) => { //Occurs every 20ms
	sendingTimer++;
	if (sendingTimer >= 550) {
		sending = false;
	}
	if (Object.keys(sendRequests).length === 0) {
		setPixelSending(false);
	} else if (!pixelSending && ledConnected) {
		setPixelSending(true);
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
	setTimeout(() => handleSendRequests(setPixelSending, pixelSending), 20);
};


export function gotValue(value, setAnims, setPrevFrameNames, setRainSending, handleRain) {
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
	if (value === 'OFF') {
		console.log(value);
		handleRain();
	}
	if (value === 'sRAIN' || value === 'cRAIN') {
		setRainSending(false);
		isRaining = false;
	} else if (value === "RAIN") {
		setRainSending(false);
		isRaining = true;
	}
	if (value === "FRAME") {
		framePlayed = true;
	}
	sending = false;
};

export function sendData(command) {
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