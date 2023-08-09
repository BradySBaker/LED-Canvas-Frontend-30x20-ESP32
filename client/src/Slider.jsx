import React from 'react';

const Slider = ({handleChange, defaultValue, min, max}) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      defaultValue={defaultValue}
      onMouseUp={handleChange}
      onTouchEnd={handleChange}
    />
  )
}

export default Slider;