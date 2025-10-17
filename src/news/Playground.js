import React, { useState, useEffect, memo, useRef } from "react";

// Mock data simulating a news post object
const mockPost = {
  id: "123",
  title: "High Court Remarks Become Center of Political Debate",
  createdAt: new Date().toISOString(),
  source: "National News Network",
  videoUrl: "https://videos.pexels.com/video-files/3209828/3209828-sd_640_360_30fps.mp4",
  headlines: [
    "Key political figures react to the recent judicial statements.",
    "Media outlets provide extensive coverage and analysis.",
    "Public opinion appears divided on the matter.",
    "Legal experts weigh in on the implications of the court's comments.",
  ],
  media: [
    { 
      url: "https://images.pexels.com/photos/3944308/pexels-photo-3944308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", 
      type: "image",
    },
    { 
      url: "https://videos.pexels.com/video-files/3209828/3209828-sd_640_360_30fps.mp4", 
      type: "video" 
    },
     { 
      url: "https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", 
      type: "image",
    },
  ],
};


// --- Helper Components & Icons ---
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 ml-2 text-white/80">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);
const TvIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75-3.75v3.75m-3.75-3.75h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 004.5 16.5z" />
    </svg>
);
const MuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.99a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);
const UnmuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

// --- Custom Hook for Post Viewing Logic ---
const usePostViewer = (isActive) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [paused, setPaused] = useState(!isActive);
  useEffect(() => setPaused(!isActive), [isActive]);
  return { currentPage, setCurrentPage, paused, setPaused };
};

// --- Utility Functions ---
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Child Component for Animated Headlines ---
const AnimatedHeadlines = memo(({ headlines, isVisible }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!isVisible || !headlines || headlines.length === 0) {
            setCurrentIndex(0); // Reset when not visible
            return;
        };
        
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % headlines.length);
        }, 4000); // Change headline every 4 seconds

        return () => clearInterval(interval);
    }, [isVisible, headlines]);

    if (!headlines || headlines.length === 0) return null;

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 text-center pointer-events-none">
            <div className="relative w-full h-48 max-w-4xl">
                {headlines.map((headline, index) => (
                    <h1
                        key={index}
                        className={`absolute inset-0 flex items-center justify-center w-full h-full text-3xl md:text-5xl font-extrabold text-white transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ textShadow: '3px 3px 8px rgba(0,0,0,0.8)' }}
                    >
                        {headline}
                    </h1>
                ))}
            </div>
        </div>
    );
});


// --- The Main News Headline Component ---
const NewsHeadlineViewer = memo(({ post, isActive }) => {
  const allMedia = post.media || [];
  const { currentPage, setCurrentPage, paused, setPaused } = usePostViewer(isActive);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const isVideoPage = allMedia[currentPage]?.type === 'video';
    if (isVideoPage && isActive && !paused) {
      videoElement.play().catch(e => console.error("Video play failed:", e));
    } else {
      videoElement.pause();
    }
  }, [currentPage, isActive, paused, allMedia]);

  const handleMediaAreaTap = () => {
    if (allMedia[currentPage]?.type === 'video') setPaused(p => !p);
  };
  
  const handleWatchOnPress = () => console.log("Watch button pressed. URL:", post.videoUrl);

  const renderDots = () => {
    if (allMedia.length <= 1) return null;
    return (
      <div className="absolute top-0 left-0 right-0 z-30 flex w-full gap-2 px-4 pt-5">
        {allMedia.map((_, index) => (
          <button key={index} onClick={() => setCurrentPage(index)} className="w-full h-1 p-0 bg-transparent border-0 outline-none cursor-pointer">
              <div className={`h-full rounded-full transition-colors duration-300 ${currentPage >= index ? 'bg-white/90' : 'bg-white/40'}`} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Media Pager */}
      <div className="w-full h-full">
        {allMedia.map((media, i) => (
          <div
            key={i}
            className="absolute inset-0 w-full h-full transition-opacity duration-500"
            style={{ opacity: i === currentPage ? 1 : 0, zIndex: i === currentPage ? 1 : 0 }}
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            {media.type === "image" ? (
              <>
                <img src={media.url} className="object-cover w-full h-full" alt="News background" />
                <AnimatedHeadlines headlines={post.headlines} isVisible={i === currentPage && isActive} />
              </>
            ) : (
              <div onClick={handleMediaAreaTap} className="w-full h-full cursor-pointer">
                <video
                  ref={videoRef}
                  src={media.url}
                  className="object-contain w-full h-full"
                  loop muted={muted} playsInline
                  onCanPlay={() => setLoading(false)}
                  onWaiting={() => setLoading(true)}
                />
                <div className={`absolute inset-0 z-20 flex items-center justify-center bg-black/20 transition-opacity duration-300 pointer-events-none ${loading || paused ? 'opacity-100' : 'opacity-0'}`}>
                  {loading && <div className="w-16 h-16 border-4 border-white rounded-full border-t-transparent animate-spin" />}
                  {!loading && paused && <PlayIcon />}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {renderDots()}

      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6 text-white pointer-events-none">
        <div className="max-w-full pr-16">
          <h2 className="text-2xl font-bold leading-tight md:text-3xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            {post.title}
          </h2>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-300">
            <span>{formatDate(post.createdAt)}</span>
            <span className="truncate">Source: {post.source}</span>
          </div>
        </div>
      </div>
      
      <div className="absolute z-30 flex flex-col gap-5 right-4 bottom-24">
        {post.videoUrl && (
          <button onClick={handleWatchOnPress} className="flex flex-col items-center justify-center gap-1 text-center">
            <TvIcon />
            <span className="text-xs font-medium text-white">Watch</span>
          </button>
        )}
        <button onClick={() => setMuted((m) => !m)} className="flex flex-col items-center justify-center gap-1 text-center">
          {muted ? <MuteIcon /> : <UnmuteIcon />}
          <span className="text-xs font-medium text-white">{muted ? 'Unmute' : 'Mute'}</span>
        </button>
      </div>
    </div>
  );
});

// --- Main App Component ---
export default function Playground() {
  return (
    <main className="h-screen font-sans bg-black antialiased">
       <NewsHeadlineViewer post={mockPost} isActive={true} />
    </main>
  );
}

