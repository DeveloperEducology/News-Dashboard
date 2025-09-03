import React, { useState, useEffect, useRef, useMemo } from "react";
// 1. Import your raw JSON data
import rawNewsData from "./newsData.json";
import YouTubePlayer from "./YouTubePlayer";

// 2. Create a function to transform the raw data
const transformNewsData = (rawData) => {
  return rawData.map((item) => ({
    id: item["వార్త URL"],
    headline: item["వార్త శీర్షిక"],
    body: item["వార్త సారాంశం"],
    imageUrl: item["వార్త చిత్రం"],
    sourceUrl: item["వార్త URL"],
    category: item["వార్త వర్గం"],
    videoId: item["videoId"],
    date: new Date().toISOString(),
    author: {
      name: "సాక్షి",
      avatar: "https://www.sakshi.com/favicon.ico",
    },
  }));
};

// --- SVG Icons ---
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);
const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
);
const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

// --- Components ---

const Header = ({ categories, selectedCategory, onSelectCategory }) => (
  <div className="bg-white text-gray-800 absolute top-0 left-0 right-0 z-30 h-14 flex items-center">
    <nav className="container mx-auto flex items-center justify-start px-2 overflow-x-auto space-x-2">
      <button
        onClick={() => onSelectCategory("All")}
        className="p-2 text-blue-600 rounded-md transition-colors"
        aria-label="Home"
      >
        <HomeIcon />
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-3 py-1.5 text-sm font-bold whitespace-nowrap rounded-full transition-colors ${
            selectedCategory === category ? "bg-blue-600 text-white" : null
          }`}
          style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
        >
          {category}
        </button>
      ))}
    </nav>
  </div>
);

const NewsShort = ({ article, isActive, isPrevious, swipeDirection }) => {
  if (!article) return null;

  // Function to determine the correct animation class
  const getAnimationClass = () => {
    if (!isActive && !isPrevious) return "translate-y-full z-0"; // Hidden card

    if (isActive) {
      // Card animating IN
      if (swipeDirection === "up") return "animate-slide-in-up z-20";
      if (swipeDirection === "down") return "animate-slide-in-down z-20";
      return "translate-y-0 z-20"; // Active card, no animation
    }

    if (isPrevious) {
      // Card animating OUT
      if (swipeDirection === "up") return "animate-slide-out-up z-10";
      if (swipeDirection === "down") return "animate-slide-out-down z-10";
    }

    return "translate-y-full z-0"; // Default hidden state
  };

  return (
    <div
      className={`absolute inset-0 w-full h-full bg-white flex flex-col ${getAnimationClass()}`}
    >
      <div className="relative h-2/5 w-full">
        {article.videoId ? (
          <YouTubePlayer videoId={article.videoId} isActive={isActive} />
        ) : (
          <img
            src={article.imageUrl}
            alt={article.headline}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/800x600/ccc/ffffff?text=Image+Error";
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
      <div className="flex-grow p-4 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <img src={article.author.avatar} alt="Author" className="h-6 mr-2" />
          <div className="flex items-center space-x-4 text-gray-500">
            <BookmarkIcon />
            <ShareIcon />
          </div>
        </div>
        <h2
          className="text-xl font-bold mb-2 leading-tight text-gray-900"
          style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
        >
          {article.headline}
        </h2>
        <p
          className="text-base leading-relaxed text-gray-700 flex-grow"
          style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
        >
          {article.body.length > 380
            ? article.body.slice(0, 380) + "…"
            : article.body}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(article.date).toLocaleDateString("te-IN", {
            month: "long",
            day: "numeric",
          })}{" "}
          / {article.author.name}
        </p>
      </div>
      <a
        href={article.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-center p-4 text-sm font-bold text-white hover:bg-blue-700 transition-colors cursor-pointer block z-30"
      >
        పూర్తి వార్త కోసం ఇక్కడ నొక్కండి
      </a>
    </div>
  );
};

export default function NewsPage() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const newsItems = useMemo(() => transformNewsData(rawNewsData), []);
  const categories = useMemo(
    () => [...new Set(newsItems.map((item) => item.category))],
    [newsItems]
  );

  const [selectedCategory, setSelectedCategory] = useState(
    categories[0] || "All"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState("none");

  const mainRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const prevIndexRef = useRef(currentIndex);

  useEffect(() => {
    prevIndexRef.current = currentIndex;
  }, [currentIndex]);

  const filteredNews = useMemo(
    () =>
      selectedCategory === "All"
        ? newsItems
        : newsItems.filter((item) => item.category === selectedCategory),
    [selectedCategory, newsItems]
  );

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleTouchStart = (e) => {
      if (e.target.closest("a[href]") || e.target.tagName === "IFRAME") {
        touchStartY.current = 0;
        return;
      }
      touchStartY.current = e.targetTouches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const isInteractive = ["A", "BUTTON"].includes(e.target.tagName);
      if (!isInteractive) {
        e.preventDefault();
      }
      touchEndY.current = e.targetTouches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (touchStartY.current === 0) return;
      const deltaY = touchStartY.current - touchEndY.current;

      if (deltaY > 75) {
        setSwipeDirection("up");
        setCurrentIndex((prev) => (prev + 1) % filteredNews.length);
      } else if (deltaY < -75) {
        setSwipeDirection("down");
        setCurrentIndex(
          (prev) => (prev - 1 + filteredNews.length) % filteredNews.length
        );
      }

      touchStartY.current = 0;
      touchEndY.current = 0;

      setTimeout(() => setSwipeDirection("none"), 500);
    };

    mainEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    mainEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    mainEl.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      mainEl.removeEventListener("touchstart", handleTouchStart);
      mainEl.removeEventListener("touchmove", handleTouchMove);
      mainEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [filteredNews]);

  return (
    <div className="bg-gray-200 h-screen w-screen overflow-hidden relative">
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <main ref={mainRef} className="h-full w-full relative pt-14">
        {filteredNews.length > 0 ? (
          <>
            {filteredNews[currentIndex] && (
              <NewsShort
                key={filteredNews[currentIndex].id}
                article={filteredNews[currentIndex]}
                isActive={true}
                isPrevious={false}
                swipeDirection={swipeDirection}
              />
            )}
            {filteredNews[prevIndexRef.current] &&
              currentIndex !== prevIndexRef.current && (
                <NewsShort
                  key={filteredNews[prevIndexRef.current].id}
                  article={filteredNews[prevIndexRef.current]}
                  isActive={false}
                  isPrevious={true}
                  swipeDirection={swipeDirection}
                />
              )}
          </>
        ) : (
          <div className="text-gray-800 text-center p-10 bg-white m-auto flex flex-col items-center justify-center h-full">
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
            >
              ఈ వర్గంలో కథనాలు లేవు.
            </h2>
            <p
              className="mt-2"
              style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
            >
              దయచేసి మరొక వర్గాన్ని ఎంచుకోండి.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
