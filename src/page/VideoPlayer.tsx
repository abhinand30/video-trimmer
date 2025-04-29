import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";

import ThumbnailComponent from "../components/ThumbnailComponent";
import soundIcon from '../assets/soundIcon.png'

const VideoPlayer = () => {
  const videoUrl = 'https://staljazeerapocwe01.blob.core.windows.net/uploadedfiles/3725b0e8-c42e-4e63-a7d7-7cda25cb7a6c/a8a5cf21-877c-4e19-b740-708ffe28130a/uploads/video.mp4';
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnails, setThumbnails] = useState<{url: string, time: number}[]>([]);
  const [currentRegion, setCurrentRegion] = useState<any>(null);

  const regionsPlugin = useRef(RegionsPlugin.create()).current;
  const topTimeline = TimelinePlugin.create({
    height: 15,
    insertPosition: 'beforebegin',
    timeInterval: 1,
    // primaryLabelInterval: 5,
    // secondaryLabelInterval: 1,
    style: {
      fontSize: '8px',
      color: '#2D5B88',
      // marginBottom:'10px',
    },
  })

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      url: videoUrl,
      waveColor: "rgba(100, 100, 100, 0.5)",
      progressColor: "rgba(66, 133, 244, 0.8)",
      height: 80,
      barHeight: 2,
      barAlign: "bottom",
      barWidth: 4,
      cursorWidth: 4,
      cursorColor: "#4285f4",
      dragToSeek: true,
      plugins: [regionsPlugin, topTimeline],
      // volume: volume
    });

    setWavesurfer(ws);

    ws.on("ready", () => {
      const getDuration=ws.getDuration()
      setDuration(getDuration);
      
      // regionsPlugin.enableDragSelection({
      //   color: "transparent",
      //   drag: true,
      //   resize: true,
      // });
     
      regionsPlugin.addRegion({
        start: 0,
        end: getDuration,
        // content: '',
        // color: "rgb(246,237,195)",
        drag: false,
        resize: true,
      })
    });

    ws.on("timeupdate", (time) => {
      setCurrentTime(time);
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));

    return () => ws.destroy();
  }, [videoUrl]);

  // console.log('curr',currentRegion)
  useEffect(() => {
    if (!wavesurfer) return;

    const handleRegionCreated = (region: any) => {
      if (currentRegion) {
        // currentRegion.remove();
        // currentRegion.clearRegions()
      // regionsPlugin.destroy()
      
        setCurrentRegion(null)
      }
      
      setCurrentRegion(region);
    
      wavesurfer.play(region.start, region.end);
      if (videoRef.current) {
        videoRef.current.currentTime = region.start;
        videoRef.current.play();
      }
    };

    const handleRegionOut = (region: any) => {
      if (region.id === currentRegion?.id) {
        wavesurfer.pause();
        videoRef.current?.pause();
      }
    };

    regionsPlugin.on("region-created", handleRegionCreated);
    regionsPlugin.on("region-out", handleRegionOut);

    // return () => {
    //   regionsPlugin.un("region-created", handleRegionCreated);
    //   regionsPlugin.un("region-out", handleRegionOut);
    // };
  }, [wavesurfer, currentRegion]);

  
  useEffect(() => {
    if (!wavesurfer) return;
    wavesurfer.setVolume(volume);
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume, wavesurfer]);

  
  useEffect(() => {
    const generateThumbs = async () => {
      const thumbs = await generateThumbnails();
      setThumbnails(thumbs);
    };
    generateThumbs();
  }, []);

  const generateThumbnails = async () => {
    const count = 10;
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      video.addEventListener('loadedmetadata', resolve, { once: true });
      video.addEventListener('error', reject, { once: true });
    });

    const frames: {url: string, time: number}[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
   
    const times = Array.from({length: count}, (_, i) => (i * video.duration) / count);

    for (const time of times) {
      await new Promise<void>((resolve) => {
        video.currentTime = time;
        video.addEventListener('seeked', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          frames.push({url: canvas.toDataURL('image/jpeg'), time});
          resolve();
        }, {once: true});
      });
    }

    return frames;
  };

  const handlePlayback = () => {
    if (!wavesurfer) return;

    if (isPlaying) {
      wavesurfer.pause();
      videoRef.current?.pause();
    } else {
      
      if (currentRegion) {
        wavesurfer.play(
          Math.max(currentRegion.start, currentTime),
          currentRegion.end
        );
        videoRef.current?.play();
      } else{
        wavesurfer.play();
        videoRef.current?.play();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value) / 100;
    wavesurfer?.seekTo(seekTo);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTo * duration;
    }
  };

  const handleThumbnailClick = (time: number) => {
    wavesurfer?.seekTo(time / duration);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const playedPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <div 
    style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <video ref={videoRef} src={videoUrl} autoPlay  className="bg-white w-100 h-75 rounded-2 mb-2">
        {/* <source src={videoUrl}/> */}
      </video>
      
      <div ref={containerRef} className="mb-2 overflow-hidden"/>
      <ThumbnailComponent 
        thumbnails={thumbnails} 
        onClick={handleThumbnailClick} 
      />
      <div className="d-flex align-items-center gap-5 mt-3 ">
        <button onClick={handlePlayback} className="padding bg-primary text-white"
          style={{
            padding: '10px 25px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            // fontSize: '16px',
            // fontWeight: 'bold',
            transition: 'background-color 0.2s',
          }}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        
        <div style={{ flex: 1 }}>
          <input
            type="range"
            min={0}
            max={100}
            value={playedPercent}
            onChange={handleSeek}
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
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '120px'
        }}>
          <img src={soundIcon} alt="icon" className="w-1"/>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: `linear-gradient(to right, #4285f4 0%, #4285f4 ${volumePercent}%, #e0e0e0 ${volumePercent}%, #e0e0e0 100%)`,
              outline: 'none',
              WebkitAppearance: 'none',
              
            }}
          />
        </div>
      </div>

     
      
    </div>
  );
};

export default VideoPlayer;