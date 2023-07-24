import react, {useEffect, useState} from 'react';

const AVController = (handleChooseColor) => {

  return (
    <div>
      <div className='picker-container'>
        <HexColorPicker style={{height: 'calc(90vw * 0.5)'}} color={color} onChange={handleChooseColor} />
      </div>
    </div>
  )
};

export default AVController;