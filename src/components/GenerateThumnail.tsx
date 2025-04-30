useEffect(() => {
  if (!wavesurfer) return;

  const handleRegionLoop = () => {
    if (currentRegion) {
      wavesurfer.play(currentRegion.start, currentRegion.end); // Restart playback within the region
      if (videoRef.current) {
        videoRef.current.currentTime = currentRegion.start; // Sync video player
        videoRef.current.play();
      }
    }
  };

  wavesurfer.on("finish", handleRegionLoop); // Listen for finish event

  return () => {
    wavesurfer.un("finish", handleRegionLoop); // Cleanup listener on unmount
  };
}, [wavesurfer, currentRegion]);
