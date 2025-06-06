"use client";

import { useEffect, useState } from "react";

export default function VideoPlayer({ videoId }) {  
  const [videoUrl, setVideoUrl] = useState("");   
  const [error, setError] = useState(null);

  const [videoInfo, setVideoInfo] = useState({
    name: "",
    description: "",
    subscription: "",
    likes: 0,
    publicity: "",
    created_at: "",
  });

  useEffect(() => {
    const fetchUrl = async () => {
      const response = await fetch(`/api/videos/view/${videoId}`);
      const { success, message, videoUrl, videoInfo } = await response.json();

      if (!response.ok) return;

        if(success) {
          setVideoUrl(videoUrl); 
          setVideoInfo(videoInfo);
        } else {
          setError(message);
        }
    }

    fetchUrl();
  }, [videoId]);

  return (
    <div className="relative flex w-3/4 h-auto flex-col items-center">
      {error && (
        <p className="absolute top-1/2 left-1/2 text-red-500">{error}</p>
      )}

      { !videoUrl && (
      
        <p className="absolute top-1/2 left-1/2">
          Loading video...
        </p>
      
      ) || (

        <div>
          <video className="rounded" controls src={videoUrl}>
          Your browser does not support videos.
          </video>
          <div className="flex flex-col justify-between items-start w-full mt-4 bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-gray-800">{videoInfo.name}</h2>
            <p className="text-gray-600">{videoInfo.description}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-500">
                Author: <a href={"/profile/" + videoInfo.authorid} className="font-bold">{videoInfo.author}</a>
              </span>
              <span className="text-sm text-gray-500">
                Subscription: <span className="font-bold">{videoInfo.subscription}</span>
              </span>
              <span className="text-sm text-gray-500">
                Likes: <span className="font-bold">{videoInfo.likes}</span>
              </span>
              <span className="text-sm text-gray-500">
                Publicity: <span className="font-bold">{videoInfo.publicity}</span>
              </span>
              <span className="text-sm text-gray-500">
                Created at: <span className="font-bold">{new Date(videoInfo.created_at).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}