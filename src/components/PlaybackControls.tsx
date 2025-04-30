import React from 'react'

const PlaybackControls = (props) => {
    const {isPlaying,onPlayPause,playedPercent,onSeek}=props;
    
  return (
    <div style={{ flex: 1 }}>
          <input
            type="range"
            min={0}
            max={100}
            value={playedPercent}
            onChange={onSeek}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: `linear-gradient(to right, #4285f4 0%, #4285f4 ${playedPercent}%, #e0e0e0 ${playedPercent}%, #e0e0e0 100%)`,
              outline: 'none',
              WebkitAppearance: 'none',
              
            }}
          />
        </div>
  )
}

export default PlaybackControls