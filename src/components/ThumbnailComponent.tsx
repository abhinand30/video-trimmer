import React from 'react'

const ThumbnailComponent = (props) => {
    const {thumbnails}=props
  return (
    <div style={{ display: 'flex',  marginTop: '20px' }}>
        {thumbnails?.map((thumbnail, index:number) => (
          <img
            key={index}
            src={thumbnail}
            alt={`Thumbnail ${index}`}
            style={{
              cursor: 'pointer',
              width: '150px',
              height: '100px',
              objectFit: 'cover',
            }}
          />
        ))}
      </div> 
  )
}

export default ThumbnailComponent