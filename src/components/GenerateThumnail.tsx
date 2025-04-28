import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

const VideoPlayer = () => {
  const videoUrl = 'https://staljazeerapocwe01.blob.core.windows.net/uploadedfiles/3725b0e8-c42e-4e63-a7d7-7cda25cb7a6c/a8a5cf21-877c-4e19-b740-708ffe28130a/uploads/video.mp4';
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [wavesurferObj, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const regions = RegionsPlugin.create()
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      url: videoUrl,
      waveColor: "gray",
      progressColor: "blue",
      height: 50,
      dragToSeek: true,
      plugins: [
        RegionsPlugin.create(),
        TimelinePlugin.create({ height: 20 })
      ]
    });
  console.log(typeof(ws))
    setWavesurfer(ws);

    // ws.on('ready', () => {
    //   setDuration(ws.getDuration());

    //   const markerWidth = 0.01;
    //   ws.addRegion({
    //     id: "start",
    //     start: 0,
    //     end: markerWidth,
    //     color: "rgba(0, 255, 0, 0.8)",
    //     drag: true,
    //     resize: true,
    //   });
    //   ws.addRegion({
    //     id: "end",
    //     start: ws.getDuration() - markerWidth,
    //     end: ws.getDuration(),
    //     color: "rgba(255, 0, 0, 0.8)",
    //     drag: true,
    //     resize: true,
    //   });
    // });

    // ws.on('seek', (time) => {
    //   if (videoRef.current) {
    //     videoRef.current.currentTime = time;
    //   }
    // });
   
  }, []);

  useEffect(() => {
    waveSurfer.on('decode',()=>{
      regions.addRegion({
        start: 0,
        end: 8,
        content: 'Resize me',
        color: 'yellow',
        drag: false,
        resize: true,
      })
      regions.addRegion({
        start: 9,
        end: 10,
        content: 'Cramped region',
        color: 'red',
        minLength: 1,
        maxLength: 10,
      })
      regions.addRegion({
        start: 12,
        end: 17,
        content: 'Drag me',
        color: 'green',
        resize: false,
      })
    })

    waveSurfer.on('timeupdate', (time) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
      setCurrentTime(time);
    });

    
  }, [WaveSurfer])
  

  const handlePlayback = () => {
    if (!wavesurfer) return;
    if (wavesurfer.isPlaying()) {
      wavesurfer.pause();
      videoRef.current?.pause();
    } else {
      wavesurfer.play();
      videoRef.current?.play();
    }
  };

  const played = (currentTime / duration) * 100;

  return (
    <div>
      <video ref={videoRef} src={videoUrl} width="100%" height="600px" onClick={handlePlayback} />
      <div ref={containerRef}></div>
      <div className="d-flex">
        <button onClick={handlePlayback}>Play</button>
        <text>{currentTime.toFixed(0)}.00</text>
        <div className="w-100 px-2">
          <input type="range" value={played} className="form-range" id="customRange1" />
        </div>
        <text>{duration.toFixed(0)}.00</text>
      </div>
    </div>
  );
};

export default VideoPlayer;