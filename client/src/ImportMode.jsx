import React, { useState } from "react";

import ColorThief from 'color-thief-react';

import omggif from 'omggif';


const ImportMode = () => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        extractColors(reader.result, file.type === 'image/gif');
      };
      reader.readAsDataURL(file);
    }
  };

  const extractFrameData = (img) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, window.WIDTH, window.HEIGHT);

    context.drawImage(img, 0, 0, window.WIDTH, window.HEIGHT);

    const frameData = context.getImageData(0, 0, window.WIDTH, window.HEIGHT).data;
    const hexColors = [];

    for (let j = 0; j < frameData.length; j += 4) {
      const hex = rgbToHex(frameData[j], frameData[j + 1], frameData[j + 2]);
      hexColors.push(hex);
    }
    return hexColors;
  };

  const extractGifFrames = async (gifUrl) => {
    try {
      const response = await fetch(gifUrl);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const intArray = new Uint8Array(arrayBuffer);

      const reader = new omggif.GifReader(intArray);

      const frames = new Array(reader.numFrames()).fill(0).map((_, k) => {
        const image = new ImageData(reader.width, reader.height);
        reader.decodeAndBlitFrameRGBA(k, image.data);

        // Convert pixel data to an array of hexadecimal values
        const hexArray = [];
        for (let i = 0; i < image.data.length; i += 4) {
          const hex = rgbToHex(image.data[i], image.data[i + 1], image.data[i + 2]);
          hexArray.push(hex);
        }

        return hexArray;
      });

      return frames;
    } catch (error) {
      console.error('Error loading GIF frames:', error);
      throw error; // Re-throw the error so the caller can handle it if needed
    }
  };


  const extractColors = (imageData, isGif) => {
    window.sendRequests['importName'] = document.getElementById('imageName').value;
    if (!isGif) {
      const img = new Image();
      img.src = imageData;
      img.onload = () => {
        window.sendRequests['import'] = extractFrameData(img);
      }
    } else {
        extractGifFrames(imageData).then((frames) => {
          console.log(frames);
        });
      }
  };

  const rgbToHex = (r, g, b) => {
    return `${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
  };

  return (
    <div>
      <input type="text" placeholder="Input Name" id="imageName"/>
      <input type="file" onChange={handleFileChange} accept="image/*" />
    </div>
  );
};

export default ImportMode;
