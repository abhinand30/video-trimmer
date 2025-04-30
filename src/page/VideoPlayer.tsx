import { useEffect, useRef, useState } from "react";

import ThumbnailComponent from "../components/ThumbnailComponent";
import soundIcon from '../assets/soundIcon.png'
import { useThumbnail } from "../hooks/useThumbnail";
import { useWaveSurfer } from "../hooks/useWaveSurfer";
import InputRange from "../components/InputRange";

const VideoPlayer = () => {
  const videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  const videoRef = useRef<HTMLVideoElement>(null);

  const [volume, setVolume] = useState<number>(0.1);

  const { thumbnails } = useThumbnail(videoUrl);
  const { wavesurfer,
    currentTime,
    duration,
    isPlaying,
    handlePlayback,
    containerRef,
    handleSeek } = useWaveSurfer({ videoUrl, videoRef })

  useEffect(() => {
    if (!wavesurfer) return;
    wavesurfer.setVolume(volume);
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume, wavesurfer]);

  const handleThumbnailClick = (time: number) => {
    wavesurfer?.seekTo(time / duration);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
  }
  const playedPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <div className="flex-1 p-5 w-50 h-50 m-auto align-self-center bg-gray shadow-lg">
      {/* video player */}
      <video ref={videoRef} className="bg-white w-100 h-100 rounded-2 mb-2">
        <source src={videoUrl} />
      </video>
      {/* wave form */}
      <div ref={containerRef} className="mb-2 overflow-hidden" />
      {/* thumbnail */}
      <ThumbnailComponent
        thumbnails={thumbnails}
        onClick={handleThumbnailClick}
      />
      <div className="d-flex align-items-center gap-5 mt-3 ">
        <button onClick={handlePlayback} className="px-2 bg-primary text-white border-0 rounded-2">
          {isPlaying ? "⏸" : "▶"}
        </button>
        {/* play Range  */} 
        <InputRange percent={playedPercent} value={playedPercent} handleSeek={handleSeek} min={0} max={100}/>
        {/* volume range */}
        <div className="d-flex align-items-center gap-2 mw-15">
          <img src={soundIcon} alt="icon" width={25}/>
          <InputRange percent={volumePercent} value={volume} handleSeek={handleVolume}  min={0} max={1}/>
        </div>
      </div>



    </div>
  );
};

export default VideoPlayer;