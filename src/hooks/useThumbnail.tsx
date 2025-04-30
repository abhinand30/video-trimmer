import { useState, useEffect } from "react";


export const useThumbnail = (videoUrl:string) => {
  
  const [thumbnails, setThumbnails] = useState<{url: string, time: number}[]>([]);

  useEffect(() => {
    generateThumbnails();
  }, [videoUrl]);

  
  const generateThumbnails = async () => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    const thumbnailCount=10

    await new Promise((resolve) => video.addEventListener("loadedmetadata", resolve));

    const frames = [];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const interval = video.duration / thumbnailCount;

    for (let time = 0; time < video.duration; time += interval) {
      video.currentTime = time;
      await new Promise((resolve) => video.addEventListener("seeked", resolve));
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      frames.push({ url: canvas.toDataURL("image/jpeg"), time });
    }

    setThumbnails(frames);
  };

  return { thumbnails };
};
