window.sending = false;
window.sendRequests = {};
window.waitingForFrames = false;

var sendingTimer = 0;

var names = "";

var justSent;

let importHexSent = 0;
let curImportFrame = 0;

export const handleSendRequests = (setPixelSending, pixelSending) => { //Occurs every 20ms
	sendingTimer++;
	if (sendingTimer >= 550) {
    console.log("occured");
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
			sendData("OFF");
			window.sendRequests = {};
		} else if (sendRequests['importName']) { // --- Handle import request ----
      sendData('XN' + sendRequests['importName']);
      delete sendRequests['importName'];
    } else if (sendRequests['import']) {
      if (Array.isArray(sendRequests['import'][0])) {
        sendData('XG' + sendRequests['import'][curImportFrame][importHexSent] + ',' + sendRequests['import'][curImportFrame][importHexSent+1]);
        if (importHexSent === sendRequests['import'][curImportFrame].length - 2) {
          console.log(importHexSent+1);
          importHexSent = 0;
          curImportFrame++;
          if (curImportFrame === sendRequests['import'].length) {
            curImportFrame = 0;
            importHexSent = 0;
            delete sendRequests['import'];
          }
        } else {
          importHexSent += 2;
        }
      } else {
        sendData('X' + sendRequests['import'][importHexSent] + ',' + sendRequests['import'][importHexSent+1]);
        if (importHexSent === sendRequests['import'].length - 2) {
          delete sendRequests['import'];
          importHexSent = 0;
        } else {
          importHexSent += 2;
        }
      }
    } else { // ------------------------------------------
			for (var key in sendRequests) {
				if ((key === 'color' || key === 'brightness') && positions === 0) {
					sendData(sendRequests[key]);
					delete sendRequests[key];
					break;
				} else if (key === 'color' === 'brightness') {
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


export function gotValue(value, setAnims, setPrevFrameNames, setModeDataSending, turnOn, blueTooth) {
  console.log('recieved', value);
	if (waitingForFrames) {
    if (value.includes('�')) {
      names = '';
      sendData('names');
      return;
    }
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
		if (!window.turnedOn) {
			window.turnedOn = true;
			setModeDataSending(false);
		}
		setAnims(correctAnimNames);
		setPrevFrameNames(correctFrameNames);
		}
	}
	if (value === 'OFF') {
		if (!window.turnedOn) {
			turnOn();
			waitingForFrames = true;
		}
	}
	if (value === 'SM' || value === 'CM') {
		modeRunning = false;
		if (!window.turnedOn) {
			setTimeout(() => sendData("OFF"), 100);
		} else {
			setModeDataSending(false);
		}
	} else if (value.includes("RAIN") || value === "HAV") {
		setModeDataSending(false);
		modeRunning = true;
	}
	if (value === "FRAME") {
		framePlayed = true;
	}
  if (value === "INVALID") {
    sendData(justSent);
    return;
  }
	sending = false;
};

export function sendData(command) {
  justSent = command;
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