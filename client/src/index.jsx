import React, {useState, useEffect, useRef} from "react";

import {handleSendRequests, sendData} from './helperFunctions/handleSendGet';
import {handleSave, handleDelete} from './helperFunctions/handleSaveDelete';
import connectToBle from './helperFunctions/setupBluetooth';

import { createRoot } from "react-dom/client";

import Gallery from "./Gallery.jsx";
import RainMode from "./RainMode.jsx";
import ModeSelector from "./ModeSelector.jsx";
import CreateMode from "./CreateMode.jsx";
import AVMode from "./AVMode.jsx";


import HomePage from "./HomePage.jsx";
import TopBar from "./TopBar.jsx";
window.ledConnected = false;

window.modeRunning = true;

window.framePlayed = false;

window.turnedOn = false;

window.color = "#FFFFFF";

window.ledBrightness = 100;

window.WIDTH = 30;
window.HEIGHT = 20;

window.colorPalettes = {
  red: ["rgb(82, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 150, 150)"],
  blue: ["rgb(0, 0, 102)", "rgb(0, 0, 255)", "rgb(0, 153, 255)"],
  green: ["rgb(0, 82, 0)", "rgb(0, 255, 0)", "rgb(102, 255, 102)"],
  purple: ["rgb(60, 0, 90)", "rgb(150, 0, 200)", "rgb(255, 105, 180)"]
};

const App = function() {
	const [isConnected, setIsConnected] = useState(false);
	const [mouseDown, setMouseDown] = useState(false);
	const [pixelSending, setPixelSending] = useState(false);
	const [modeDataSending, setModeDataSending] = useState(false);
	const [frames, setFrames] = useState([]);
	const [curFrame, setCurFrame] = useState([]);

	const [showCreateMode, setShowCreateMode] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
	const [showAVMode, setShowAVMode] = useState(false);
	const [showRainMode, setShowRainMode] = useState(false);

  const [allowBrightness, setAllowBrightness] = useState(true);

	const [prevFrameNames, setPrevFrameNames] = useState([]);
	const [anims, setAnims] = useState([]);
	const [animPlaying, setAnimPlaying] = useState(false);

  const [colorChoices, setColorChoices] = useState([]);

  const [selectedColor, setSelectedColor] = useState(color);

  const [connectError, setConnectError] = useState(false);


  useEffect(() => { //Mouse up handler
    const handleMouseUp = () => {
      setMouseDown(false);
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

	useEffect(() => handleSendRequests(setPixelSending, pixelSending), []); //On start
	useEffect(() => {if (isConnected === true) {handleModeStartStop({})}}, [isConnected]) //On connect

	function turnOn() {
		setTimeout(() => {sendData("names");}, 100);
	}

	function turnOff(e, animation = false) {
    sendRequests["off"] = true;
    setAnimPlaying(false);
    if (animation) {
      return;
    }
		for (var x = 0; x < WIDTH; x++) {
			for (var y = 0; y < HEIGHT; y++) {
				document.getElementById(`${y},${x}`).style.backgroundColor = 'black';
			}
		}
	}

	const handleFrameChoice = (frameName, animation, speed) => {
		if (modeRunning && !framePlayed) {
			setModeDataSending(true);
			sendData(`F${frameName}`);
			setTimeout(() => {handleFrameChoice(frameName)}, 400);
			return;
		} else if (modeRunning) {
			framePlayed = false;
			setModeDataSending(false);
			return;
		}
		if (animation) {
			setAnimPlaying(true);
			sendData('I' + speed + frameName);
			return;
		}
		sendData(`F${frameName}`);
	};

	const callSave = (e, animation, frameName) => {
		return handleSave(sendData, setFrames, frames, anims, setAnims, e, animation, frameName);
	};

	const callDelete = (frameName, idx, type) => {
		handleDelete(setFrames, frames, setPrevFrameNames, prevFrameNames, anims, setAnims, sendData, frameName, idx, type);
	};

	//Rain/Audio Visaulizer handler for off and on
	const handleModeStartStop = ({e, rain, chosenFrame, startMode, rainAmount, reset, pixelFall}) => {
    setAllowBrightness(false);
		if ((modeRunning && !startMode) || reset) {
      setColorChoices([]);
      setModeDataSending(true);
			sendData("SM");
			setTimeout(() => handleModeStartStop({}), 400);
		} else if (e) {
			if (!modeRunning && rain) {
        if (colorChoices.length === 0) {
          return "Please input a color";
        }
				if (!rainAmount) {
					rainAmount = document.getElementById('rainAmount').value;
          if (rainAmount.length === 0) {
            return "Please input a raindrop amount";
          } else if (isNaN(Number(rainAmount))) {
            return "Please input a number";
          };
          rainAmount = rainAmount.length === 1 ? '0' + rainAmount : rainAmount;
				}
				if (isNaN(Number(rainAmount)) || rainAmount.length < 1 || colorChoices.length === 0) {
					return "Please input a number value and a color";
				}
        let signal = chosenFrame ? "R" + rainAmount + chosenFrame : "R" + rainAmount;
        sendData(signal);
        setModeDataSending(true);
				setTimeout(() => {handleModeStartStop({e: true, rain: true, chosenFrame, startMode: true, rainAmount})}, 400);
			} else if(!modeRunning) { //Audio visualizer
        let signal = pixelFall ? "HAV1" : "HAV";
        sendData(signal);
				setTimeout(() => {handleModeStartStop({e: true, chosenFrame, startMode: true, rainAmount})}, 400);
      }
		} else {
      setAllowBrightness(true);
      setModeDataSending(false);
      setColorChoices([]);
    }
    return false;
	};

  const handleModeChooseColor = (chosenColor, palette) => {
    if (palette) {
      setColorChoices(chosenColor);
      sendData("CMP" + palette);
      return;
    }
		var colors = JSON.parse(JSON.stringify(colorChoices));
		colors.push(chosenColor);
		setColorChoices(colors);
		sendData("CM" + chosenColor.slice(1));
		setModeDataSending(true);
	};

  const handleConnect = () => {
    connectToBle(setIsConnected, turnOn, setAnims, setPrevFrameNames, setModeDataSending, setConnectError);
  };

  const disableModes = () => {
    setShowCreateMode(false);
    setShowGallery(false);
    setShowRainMode(false);
    setShowAVMode(false);
    handleModeStartStop({});
    turnOff();
  };

	return (
		<div id='colorApp' onMouseDown={() => setMouseDown(true)} >
      {showGallery || showCreateMode || showRainMode || showAVMode ? <TopBar allowBrightness={allowBrightness} sendData={sendData} selectedColor={selectedColor} disableModes={disableModes}/> : null}
      {!isConnected ? <HomePage handleConnect={handleConnect} connectError={connectError}/> :  null}
      {isConnected && !showCreateMode && !showGallery && !showRainMode && !showAVMode ? <ModeSelector setShowAVMode={setShowAVMode} setShowGallery={setShowGallery} setShowCreateMode={setShowCreateMode} setShowRainMode={setShowRainMode}/> : null}
      {showGallery ?  <Gallery animPlaying={animPlaying} turnOff={turnOff} handleSave={callSave} modeDataSending={modeDataSending} anims={anims} prevFrameNames={prevFrameNames} frames={frames} handleFrameChoice={handleFrameChoice} handleDelete={callDelete}/> : null}
      {showCreateMode ? <CreateMode turnOff={turnOff} callSave={callSave} animPlaying={animPlaying} pixelSending={pixelSending} mouseDown={mouseDown} handleFrameChoice={handleFrameChoice} sendRequests={sendRequests} selectedColor={selectedColor} setSelectedColor={setSelectedColor}/> : null}
      {(pixelSending || modeDataSending) ? <img id='loading' src='./icons/loading.gif'></img> : null}

			{showRainMode ? <RainMode prevFrameNames={prevFrameNames} frames={frames} handleFrameChoice={handleFrameChoice} modeRunning={modeRunning} handleModeChooseColor={handleModeChooseColor} colorChoices={colorChoices} modeDataSending={modeDataSending} handleModeStartStop={handleModeStartStop}/> : null}
      {showAVMode ? <AVMode modeRunning={modeRunning} handleModeChooseColor={handleModeChooseColor} modeDataSending={modeDataSending} colorChoices={colorChoices} handleModeStartStop={handleModeStartStop}/> : null}

    {showCreateMode || showGallery || showRainMode || showAVMode ? <button id='bottom-button' onClick={() => {if (showCreateMode) {setShowCreateMode(false); setShowGallery(true);} else {setShowAVMode(false); setShowGallery(false); setShowRainMode(false); setShowCreateMode(true);}}}>{showCreateMode ? 'Gallery' : 'Create'}</button> : null}
		</div>
	)
}

const container = document.getElementById('root');
const root = createRoot(container);

  root.render(
    <App />
  );
