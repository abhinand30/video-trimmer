import React from 'react';

import { RangeProps } from '../common/types';


const InputRange:React.FC<RangeProps>= (props) => {
    const { percent,value, handleSeek,min,max } = props;
    return (
        <input type="range" min={min} max={max} value={value?value:percent} onChange={handleSeek}
            style={{
                width: '100%', height: '6px',
                borderRadius: '3px',
                background: `linear-gradient(to right, #4285f4 0%, #4285f4 ${percent}%, #e0e0e0 ${percent}%, #e0e0e0 100%)`,
                outline: 'none',
                WebkitAppearance: 'none',
            }}
        />
    )
}

export default InputRange