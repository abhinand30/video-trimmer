

import React, { useEffect, useRef, useState } from 'react'
import { RegionProps, WaveProps } from '../common/types';
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';

export const useWaveSurfer= (props:WaveProps) => {
  const { videoUrl,videoRef } = props;

  // const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const regionsPlugin = useRef(RegionsPlugin.create()).current;

  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
 
  const [currentRegion, setCurrentRegion] = useState<RegionProps | null>(null);



  const topTimeline = TimelinePlugin.create({
    height: 15,
    insertPosition: 'beforebegin',
    timeInterval: 1,
    style: {
      fontSize: '8px',
      color: '#2D5B88'
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
    });

    setWavesurfer(ws);

    ws.on("ready", () => {
      const getDuration = ws.getDuration()
      setDuration(getDuration);

      regionsPlugin.addRegion({
        start: 0,
        end: getDuration,
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


  useEffect(() => {
    if (!wavesurfer) return;

    const handleRegionCreated = (region) => {
      setCurrentRegion(region);
      if (videoRef.current) {
        videoRef.current.currentTime = region.start;
      }
    };

    const handleRegionOut = (region) => {
      if (region.id === currentRegion?.id) {
        wavesurfer.pause();
        videoRef.current?.pause();
        handleRegionLoop()
      }
    };
    const handleRegionLoop = () => {
      if (currentRegion) {
        wavesurfer.play(currentRegion.start, currentRegion.end);
      }
    };

    regionsPlugin.on("region-created", handleRegionCreated);
    regionsPlugin.on("region-out", handleRegionOut);


  }, [wavesurfer, currentRegion, regionsPlugin,videoRef]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value) / 100;
    wavesurfer?.seekTo(seekTo);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTo * duration;
    }
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
      } else {
        wavesurfer.play();
        videoRef.current?.play();
      }
    }
  };
  
  return {
    wavesurfer,
    currentTime,
    duration,
    isPlaying,
    currentRegion,
    handlePlayback,
    handleSeek,
    containerRef
  };

}

