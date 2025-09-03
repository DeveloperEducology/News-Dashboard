import { useEffect, useRef } from "react";

const YouTubePlayer = ({ videoId, isActive }) => {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  // Load the YouTube Iframe API and initialize player
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    function createPlayer() {
      if (playerRef.current || !iframeRef.current) return;

      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId,
        events: {
          onReady: (event) => {
            if (isActive) {
              event.target.playVideo();
            }
          },
        },
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
        },
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId]);

  // Handle play/pause based on active status
  useEffect(() => {
    const player = playerRef.current;
    if (!player || typeof player.playVideo !== "function") return;

    if (isActive) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [isActive]);

  return (
    <div className="w-full h-full bg-black">
      <div
        ref={iframeRef}
        id={`youtube-${videoId}`}
        className="w-full h-full"
      ></div>
    </div>
  );
};

export default YouTubePlayer;
