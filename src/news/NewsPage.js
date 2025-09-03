import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { toPng } from "html-to-image";

// Import Swiper modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Mousewheel } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- Components ---

const YouTubePlayer = ({ videoId, isActive }) => {
  const playerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  if (!isActive) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center text-white">
        Loading video...
      </div>
    );
  }

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-full">
      <iframe
        ref={playerRef}
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${
          isMuted ? 1 : 0
        }&controls=0&loop=1&mute=0&playlist=${videoId}&enablejsapi=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <button
        onClick={toggleMute}
        className="absolute bottom-2 right-2 z-20 bg-black bg-opacity-50 text-white rounded-full p-2"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>
    </div>
  );
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
    {" "}
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>{" "}
    <polyline points="9 22 9 12 15 12 15 22"></polyline>{" "}
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
    {" "}
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>{" "}
    <polyline points="16 6 12 2 8 6"></polyline>{" "}
    <line x1="12" y1="2" x2="12" y2="15"></line>{" "}
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
    {" "}
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>{" "}
  </svg>
);

// --- Reusable Components ---

const MediaCarousel = ({ media, isActive }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleTouchStart = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="relative w-full h-full"
      onTouchStart={handleTouchStart}
      role="region"
      aria-label="Media carousel"
    >
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ 
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '" style="width: 8px; height: 8px; margin: 0 4px;"></span>';
          }
        }}
        loop={media.length > 1}
        onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
        className="w-full h-full"
        touchRatio={0.5}
        onTouchStart={(swiper, e) => e.stopPropagation()}
        breakpoints={{
          640: {
            pagination: {
              dynamicBullets: true,
            }
          }
        }}
      >
        {media.map((item, index) => (
          <SwiperSlide key={index}>
            {item.type === "video" ? (
              <YouTubePlayer
                videoId={item.videoId}
                isActive={isActive && index === activeSlideIndex}
              />
            ) : (
              <img
                src={item.src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSosMm4I13FJmm7-nYRYYeBnE8lfBhv_ErMlQ&s";
                }}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
const Header = ({ categories, selectedCategory, onSelectCategory }) => (
  <div className="bg-white text-gray-800 absolute top-0 left-0 right-0 z-30 h-14 flex items-center shadow-md">
    <nav
      className="container mx-auto flex items-center justify-start px-2 overflow-x-auto space-x-2"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
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
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
          style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
        >
          {category}
        </button>
      ))}
    </nav>
  </div>
);

const ShareCard = React.forwardRef(({ article }, ref) => {
  if (!article) return null;

  return (
    <div
      ref={ref}
      className="fixed top-0 -left-[9999px] bg-white p-5"
      style={{ width: "375px", fontFamily: "'Noto Sans Telugu', sans-serif" }}
    >
      <div className="flex items-center mb-4">
        <img
          src={article.author.avatar}
          alt={article.author.name}
          className="h-8 w-8 object-cover rounded-full mr-3"
        />
        <span className="font-bold text-gray-800">{article.author.name}</span>
      </div>
      <h2 className="text-2xl font-bold mb-3 leading-tight text-gray-900">
        {article.headline}
      </h2>
      <p className="text-base text-gray-700 leading-relaxed mb-4">
        {article.body.slice(0, 150)}…
      </p>
      <div className="text-right text-sm font-bold text-blue-600">
        <p>Read more on NewsAI</p>
      </div>
    </div>
  );
});

const NewsShort = ({ article, isActive }) => {
  const shareCardRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  if (!article) {
    return null;
  }

  const handleShare = async () => {
    if (!shareCardRef.current || !navigator.share) {
      alert("Sharing is not supported on this browser.");
      return;
    }

    setIsSharing(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "news-card.png", { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: article.headline,
          text: `Check out this news: ${article.headline}`,
        });
      } else {
        alert("Sharing files is not supported on this browser.");
      }
    } catch (error) {
      console.error("Could not share the image.", error);
      alert("Sorry, there was an error creating the share image.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <ShareCard ref={shareCardRef} article={article} />

      <div className="relative h-2/5 w-full">
        <MediaCarousel media={article.media} isActive={isActive} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>

      <div className="flex-grow p-4 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <img
            src={article.author.avatar}
            alt="Author"
            className="h-6 w-6 object-cover rounded-full mr-2"
          />
          <div className="flex items-center space-x-4 text-gray-500">
            <button className="cursor-pointer">
              <BookmarkIcon />
            </button>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="cursor-pointer disabled:opacity-50 disabled:cursor-wait"
              aria-label="Share as image"
            >
              {isSharing ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                <ShareIcon />
              )}
            </button>
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
            year: "numeric",
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

export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const [newsItems, setNewsItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = "https://newsai-8a45.onrender.com/api/articles?limit=50";
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();

      const transformedArticles = data.articles.map((article, index) => {
        const media = [];
        if (article.imageUrl) {
          media.push({ type: "image", src: article.imageUrl });
        }

        const mockVideoIds = ["3JZ_D3ELwOQ", "L_jWHffIx5E", "dQw4w9WgXcQ"];
        if (index < 2) {
          media.push({ type: "video", videoId: mockVideoIds[0] });
          media.push({ type: "video", videoId: mockVideoIds[1] });
        }

        if (media.length === 0) {
          media.push({
            type: "image",
            src: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaFi7FBvuwvIRpGO-gsgfbb-IlQ9e7KHq66w&s`,
          });
          media.push({
            type: "image",
            src: `https://media.istockphoto.com/id/1369150014/vector/breaking-news-with-world-map-background-vector.jpg?s=612x612&w=0&k=20&c=9pR2-nDBhb7cOvvZU_VdgkMmPJXrBQ4rB1AkTXxRIKM=`,
          });
        }

        return {
          id: article._id,
          category: article.topCategory || "జనరల్",
          headline: article.title,
          body: article.summary || article.body || "వివరణ అందుబాటులో లేదు.",
          media: media,
          author: {
            name: article.source || "తెలియదు",
            avatar: "https://www.sakshi.com/favicon.ico",
          },
          date: article.publishedAt,
          sourceUrl: article.url,
        };
      });

      setNewsItems(transformedArticles);
      const uniqueCategories = [
        "All",
        ...new Set(transformedArticles.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);
      setSelectedCategory("All");
    } catch (err) {
      setError(err.message);
      console.error("Fetching articles failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

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

  return (
    <div className="bg-gray-200 h-screen w-screen overflow-hidden relative font-sans">
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <main className="h-full w-full relative pt-14">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            Loading...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            Error: {error}
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="w-full h-screen sm:h-[calc(100vh-80px)]">
            <Swiper
              direction="vertical"
              modules={[Mousewheel, Pagination]}
              className="w-full h-full"
              onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
              key={selectedCategory}
              slidesPerView={1}
              spaceBetween={0}
              mousewheel={true}
              // Hide pagination for vertical swiper
              pagination={false}
              // Improved mobile responsiveness
              touchEventsTarget="container"
              touchRatio={0.8}
              resistanceRatio={0.7}
              threshold={10}
              style={{ height: "100%" }}
              // Prevent interference with horizontal swiper
              onTouchStart={(swiper, e) => {
                // Check if touch is on a horizontal swiper element
                if (e.target.closest('.swiper-horizontal')) {
                  return false; // Prevent vertical swipe if touching horizontal swiper
                }
              }}
            >
              {filteredNews.map((article, index) => (
                <SwiperSlide key={article.id} className="w-full h-full">
                  <NewsShort
                    article={article}
                    isActive={index === currentIndex}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
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
      
      {/* Add custom CSS to hide vertical dots */}
      <style>
        {`
          .swiper-vertical > .swiper-pagination-bullets {
            display: none !important;
          }
          
          /* Improve media carousel for mobile */
          .swiper-horizontal .swiper-pagination-bullets {
            bottom: 10px !important;
          }
          
          .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.8) !important;
            opacity: 0.7 !important;
          }
          
          .swiper-pagination-bullet-active {
            background: #fff !important;
            opacity: 1 !important;
          }
          
          /* Improve navigation buttons for mobile */
          .swiper-button-next, .swiper-button-prev {
            width: 30px !important;
            height: 30px !important;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            color: white !important;
          }
          
          .swiper-button-next:after, .swiper-button-prev:after {
            font-size: 14px !important;
            font-weight: bold;
          }
          
          /* Hide navigation on small screens */
          @media (max-width: 640px) {
            .swiper-button-next, .swiper-button-prev {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}