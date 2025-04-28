import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions'

import ThumbnailComponent from "../components/ThumbnailComponent";

// const formatTime = (seconds:number) => [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')
const VideoPlayer = () => {
  const videoUrl = 'https://staljazeerapocwe01.blob.core.windows.net/uploadedfiles/3725b0e8-c42e-4e63-a7d7-7cda25cb7a6c/a8a5cf21-877c-4e19-b740-708ffe28130a/uploads/video.mp4';
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[] | undefined>([]);

  const regionsPlugin = RegionsPlugin.create()
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      url: videoUrl,
      waveColor: "gray",
      progressColor: "blue",
      height: 80,
      dragToSeek: true,
      barHeight: 2,
      barAlign: 'bottom',
      barWidth: 5,
      plugins: [
        RegionsPlugin.create(),
        TimelinePlugin.create({ height: 20 })
      ]
    });

    setWavesurfer(ws);


    ws.on('ready', () => {
      const totalDuration = ws.getDuration();
      setDuration(totalDuration);


      // const markerWidth = 0.01;
      const startRegion=regions.addRegion({
        id: "start",
        start: 0,
        end: markerWidth,
        color: "rgba(0, 255, 0, 0.8)",
        drag: true,
        resize: true,
      });
      const endRegion=regions.addRegion({
        id: "end",
        start: totalDuration-markerWidth,
        end: markerWidth,
        color: "rgba(255, 0, 0, 0.8)",
        drag: true,
        resize: true,
      });
      regions.enableDragSelection({
        color: 'rgba(255, 0, 0, 0.1)',
      })
      setSelectedRegions([startRegion,endRegion])
    })


    // ws.on('region-created', (region) => {
    //     // setDuration()
    // });

    regionsPlugin.enableDragSelection({
      color: 'rgba(79, 74, 133, 0.3)',
      handleStyle: {
        left: {
          backgroundColor: '#4F4A85'
        },
        right: {
          backgroundColor: '#4F4A85'
        }
      }
    });

    // Region event listeners
    regionsPlugin.on('region-created', region => {
      console.log('Region created:', region);
    });

    regionsPlugin.on('region-updated', region => {
      console.log('Region updated:', region);
    });


    ws.on('timeupdate', (time) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
      setCurrentTime(time);
    });
    return () => {
      ws.destroy();
    };
  }, [videoUrl]);

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


  useEffect(() => {
    fetchThumbnails();
  }, [thumbnails]);

  const fetchThumbnails = async () => {
    try {
      const thumbs = await generateThumbnail();
      setThumbnails(thumbs);
    } catch (error) {
      console.log(error);
    }
  }


  const generateThumbnail = async () => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous'
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext("2d");
      await new Promise((resolve, reject) => (
        video.addEventListener('loadedmetadata', resolve),
        video.addEventListener('error', reject)
      ))
      const duration = video.duration;
      const count = 10;

      const times = Array.from({ length: count }, (_, i) =>
        (i + 1) * (duration / count)
      );

      const frames: string[] = []
      const captureFrameAt = (time: number) => {
        return new Promise<void>((resolve, reject) => {
          const onSeeked = () => {
            try {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataURL = canvas.toDataURL('image/png');
              frames.push(dataURL);
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          video.currentTime = time;
          video.addEventListener('seeked', onSeeked, { once: true });
        })
      };
      for (const time of times) {
        await captureFrameAt(time);
      }
      return frames
    } catch (error) {
      console.log(error)
    }
  };


  const played = (currentTime / duration) * 100
  return (
    <div>
      {/* Video Player */}
      <div>
        <video ref={videoRef} src={videoUrl} width="100%" height="600px" />
        <div ref={containerRef} />
        <div className="d-flex align-items-center">
          <button onClick={handlePlayback}>
            {wavesurfer?.isPlaying() ? 'Pause' : 'Play'}
          </button>
          <h6>{currentTime.toFixed(0)}.00</h6>
          <div className="w-100 px-2">
            <input type="range" value={played} className="form-range" id="customRange1" />
          </div>
          <h6>{duration.toFixed(0)}.00</h6>
          <p>sound</p>
          <div>
            <input type="range" className="form-range" id="customRange1" />
          </div>


        </div>

      </div>



      <ThumbnailComponent thumbnails={thumbnails} />
    </div>
  );
};

export default VideoPlayer;
