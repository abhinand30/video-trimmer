import React from 'react'
import { ThumbnailProps } from '../common/types'

const ThumbnailComponent:React.FC<ThumbnailProps> = (props) => {
    const {thumbnails,onClick}=props
  return (
    <div style={{ display: 'flex',  marginTop: '20px' }}>
        {thumbnails?.map((thumbnail, index:number) => (
          <img
          key={index}
          src={thumbnail.url}
          onClick={() => onClick(thumbnail.time)}
            alt={`Thumbnail ${index}`}
            style={{
              cursor: 'pointer',
              width: 'auto',
              overflow:'hidden',
              height: '70px',
              objectFit: 'cover',
            }}
          />
        ))}
      </div> 
  )
}

export default ThumbnailComponent