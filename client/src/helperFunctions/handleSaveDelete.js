export const handleSave = (sendData, setFrames, frames, anims, setAnims, e, animation, frameName) => {

	if (frameName.length > 0) { //Returns string if error otherwise false
		const regex = /^[a-zA-Z0-9_\-]+$/; // valid characters are letters, numbers, underscores, and dashes
		if ((!regex.test(frameName))) {
			// the name is invalid
			return "Invalid character";
		}
		if (animation) {
			if (!anims.includes(frameName)) {
				var newAnims = JSON.parse(JSON.stringify(anims));
				newAnims.push(frameName);
				setAnims(newAnims);
			}
			sendData('A' + frameName);
			return false;
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
		curFrame[16] = frameName; //Set 16th column to name of frame
		var newFrames = JSON.parse(JSON.stringify(frames));
		newFrames.push(curFrame);
		setFrames(newFrames);
		sendData('S' + frameName);
    return false;
	} else {
		return "Please input a name for your drawing";
	}
};

export const handleDelete = (setFrames, frames, setPrevFrameNames, prevFrameNames, anims, setAnims, sendData, frameName, idx, type) => {
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
