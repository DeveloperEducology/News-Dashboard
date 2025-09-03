import React, { useState, useEffect, useRef, useCallback } from "react";

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
const PlusIcon = () => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const SpinnerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className="animate-spin"
  >
    <path
      d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
      opacity=".25"
    />
    <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
  </svg>
);

// --- Components ---

const Header = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onShowForm,
}) => (
  <header className="bg-white text-gray-800 shadow-md absolute top-0 left-0 right-0 z-30 h-14 flex items-center">
    <nav className="container mx-auto flex items-center justify-between px-2 overflow-x-auto">
      <div className="flex items-center">
        <button
          onClick={() => onSelectCategory("All")}
          className="p-2 text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Home"
        >
          <HomeIcon />
        </button>
        <div className="flex items-center space-x-1 ml-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-3 py-1.5 text-sm font-bold whitespace-nowrap rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={onShowForm}
        className="p-2 text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Create News"
      >
        <PlusIcon />
      </button>
    </nav>
  </header>
);

const YouTubePlayer = ({ videoId, isVisible }) => (
  <div className="w-full h-full bg-black">
    {/* Only render iframe when it's visible to prevent unnecessary loading and autoplay issues */}
    {isVisible && (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&loop=1&playlist=${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        className="w-full h-full"
      />
    )}
  </div>
);

const MediaCarousel = ({ media, isActive }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Reset carousel to the first slide when the parent NewsShort becomes inactive
  useEffect(() => {
    if (!isActive) {
      setCurrentIndex(0);
    }
  }, [isActive]);

  // Touch handlers for swiping
  const handleTouchStart = (e) => {
    e.stopPropagation();
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e) => {
    e.stopPropagation();
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    e.stopPropagation();
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }
    if (touchStartX.current - touchEndX.current < -50) {
      // Swiped right
      setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    }
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-300 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {media.map((item, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            {item.type === "video" ? (
              <YouTubePlayer
                videoId={item.videoId}
                isVisible={isActive && index === currentIndex}
              />
            ) : (
              <img
                src={
                  item.src ||
                  "https://img.freepik.com/free-vector/gradient-breaking-news-logo-design_23-2151128806.jpg?semt=ais_hybrid&w=740&q=80"
                }
                alt="News media"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/800x600/ccc/ffffff?text=Image+Error";
                }}
              />
            )}
          </div>
        ))}
      </div>
      {/* Navigation dots for the carousel */}
      {media.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {media.map((_, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

const NewsShort = ({ article, isActive }) => {
  if (!article) return null;
  return (
    <div
      className={`absolute inset-0 w-full h-full bg-white transition-transform duration-500 ease-in-out flex flex-col ${
        isActive ? "translate-y-0 z-10" : "translate-y-full z-0"
      }`}
    >
      <div className="relative h-2/5 w-full">
        <MediaCarousel media={article.media} isActive={isActive} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
      <div className="flex-grow p-4 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <img
              src="https://www.eenadu.net/images/logo.png"
              alt="Eenadu"
              className="h-6 mr-2"
            />
          </div>
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
          {article.body}
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
        className="bg-gray-100 text-center p-4 text-sm font-bold text-blue-600 hover:bg-gray-200 transition-colors"
      >
        పూర్తి వార్త కోసం ఇక్కడ నొక్కండి
      </a>
    </div>
  );
};

const NewsForm = ({ onAddNews, onCancel }) => {
  const [formData, setFormData] = useState({
    category: "సినిమా",
    headline: "",
    body: "",
    mediaUrls: "",
    authorName: "ఈనాడు",
    sourceUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Parse comma-separated URLs
    const mediaUrls = formData.mediaUrls
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url);

    // Determine if URL is a YouTube video or an image
    const media = mediaUrls.map((url) => {
      try {
        const urlObj = new URL(url);
        if (
          urlObj.hostname.includes("youtube.com") ||
          urlObj.hostname.includes("youtu.be")
        ) {
          const videoId =
            urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
          return { type: "video", id: videoId };
        }
      } catch (error) {
        // If not a valid URL, treat as image src. This is a simplification.
      }
      return { type: "image", src: url };
    });

    // Construct the new article object
    const newArticle = {
      id: Date.now(),
      category: formData.category,
      headline: formData.headline,
      body: formData.body,
      media:
        media.length > 0
          ? media
          : [
              {
                type: "image",
                src: `https://placehold.co/800x600/eee/333?text=${formData.headline}`,
              },
            ],
      author: {
        name: formData.authorName,
        imageUrl: "https://placehold.co/100x100/ccc/ffffff?text=Author",
      },
      date: new Date().toISOString().split("T")[0],
      sourceUrl: formData.sourceUrl,
    };
    onAddNews(newArticle);
  };

  const categories = ["ఆంధ్రప్రదేశ్", "తెలంగాణ", "జాతీయం", "సినిమా", "క్రీడలు"];

  return (
    <div className="absolute inset-0 bg-gray-100 z-40 p-4 pt-16 overflow-y-auto">
      <h2
        className="text-2xl font-bold mb-4 text-center"
        style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
      >
        కొత్త వార్తను సృష్టించండి
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label
            htmlFor="category"
            className="block text-gray-700 font-bold mb-1"
          >
            వర్గం
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="headline"
            className="block text-gray-700 font-bold mb-1"
          >
            శీర్షిక
          </label>
          <input
            type="text"
            name="headline"
            id="headline"
            value={formData.headline}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-gray-700 font-bold mb-1">
            వార్త
          </label>
          <textarea
            name="body"
            id="body"
            value={formData.body}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded-md"
            required
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="mediaUrls"
            className="block text-gray-700 font-bold mb-1"
          >
            Media URLs (comma-separated)
          </label>
          <textarea
            name="mediaUrls"
            id="mediaUrls"
            value={formData.mediaUrls}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded-md"
            placeholder="e.g., https://image.url/1.jpg, https://youtube.com/watch?v=VIDEO_ID"
            required
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="sourceUrl"
            className="block text-gray-700 font-bold mb-1"
          >
            మూలం URL
          </label>
          <input
            type="url"
            name="sourceUrl"
            id="sourceUrl"
            value={formData.sourceUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="authorName"
            className="block text-gray-700 font-bold mb-1"
          >
            రచయిత పేరు
          </label>
          <input
            type="text"
            name="authorName"
            id="authorName"
            value={formData.authorName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="flex justify-end space-x-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            రద్దు చేయండి
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            జోడించండి
          </button>
        </div>
      </form>
    </div>
  );
};

const NewsFeed = ({ newsItems, selectedCategory, isLoading, error }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const filteredNews =
    selectedCategory === "All"
      ? newsItems
      : newsItems.filter((item) => item.category === selectedCategory);

  // Reset index when category or news items change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, newsItems]);

  // Vertical swipe handler to navigate between news shorts
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleTouchStart = (e) => {
      if (e.target.closest(".yt-player")) return; // Prevent swiping over youtube player
      touchStartY.current = e.targetTouches[0].clientY;
    };
    const handleTouchMove = (e) => {
      e.preventDefault(); // Prevent page scroll while swiping
      touchEndY.current = e.targetTouches[0].clientY;
    };
    const handleTouchEnd = () => {
      if (touchStartY.current === 0) return;
      const deltaY = touchStartY.current - touchEndY.current;
      if (deltaY > 75) {
        // Swiped up
        setCurrentIndex((prev) => Math.min(prev + 1, filteredNews.length - 1));
      } else if (deltaY < -75) {
        // Swiped down
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
      touchStartY.current = 0;
      touchEndY.current = 0;
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

  if (isLoading) {
    return (
      <main className="h-full w-full relative pt-14 flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center text-gray-600">
          <SpinnerIcon />
          <p
            className="mt-2 text-lg font-semibold"
            style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
          >
            వార్తలు లోడ్ అవుతున్నాయి...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="h-full w-full relative pt-14 flex items-center justify-center bg-red-50 p-4">
        <div className="text-center text-red-700">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
          >
            లోపం
          </h2>
          <p
            className="mt-2"
            style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
          >
            వార్తలను తిరిగి పొందడంలో విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.
          </p>
          <p className="mt-2 text-sm font-mono bg-red-100 p-2 rounded">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main ref={mainRef} className="h-full w-full relative pt-14">
      {filteredNews.length > 0 ? (
        filteredNews.map((article, index) => (
          <NewsShort
            key={article.id}
            article={article}
            isActive={index === currentIndex}
          />
        ))
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
  );
};

export default function NewsPage() {
  // Add Telugu font from Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const [view, setView] = useState("feed"); // 'feed' or 'form'
  const [newsItems, setNewsItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch articles from the API
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = "https://newsai-8a45.onrender.com/api/articles?limit=50";
      // The previous proxy was returning a 403 Forbidden error.
      // Switched to a different proxy service (AllOrigins) which is a common alternative.
      const proxyUrl = "https://api.allorigins.win/raw?url=";

      // The target URL must be encoded to be safely passed as a query parameter to the proxy.
      const response = await fetch(`${proxyUrl}${encodeURIComponent(apiUrl)}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();

      // Transform API data to match the component's expected structure
      const transformedArticles = data.articles.map((article) => ({
        id: article._id,
        category: article.topCategory || "జనరల్", // Fallback category
        headline: article.title,
        body: article.summary || article.body || "వివరణ అందుబాటులో లేదు.", // Fallback body
        media: article.imageUrl
          ? [{ type: "image", src: article.imageUrl }]
          : [
              {
                type: "image",
                src: `https://placehold.co/800x600/eee/333?text=${encodeURIComponent(
                  article.title
                )}`,
              },
            ],
        author: {
          name: article.source || "తెలియదు",
          imageUrl: "https://placehold.co/100x100",
        },
        date: article.publishedAt,
        sourceUrl: article.url,
      }));

      setNewsItems(transformedArticles);

      // Dynamically create category list from fetched data
      const uniqueCategories = [
        ...new Set(transformedArticles.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);
      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]); // Select the first category by default
      }
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

  // Handler to add a new article from the form
  const handleAddNews = (newArticle) => {
    setNewsItems((prevItems) => [newArticle, ...prevItems]);
    // Also add the new category to the list if it's not already there
    if (!categories.includes(newArticle.category)) {
      setCategories((prev) => [...prev, newArticle.category]);
    }
    setSelectedCategory(newArticle.category);
    setView("feed");
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setView("feed");
  };

  return (
    <div className="bg-gray-200 h-screen w-screen overflow-hidden relative">
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onShowForm={() => setView("form")}
      />
      {view === "form" ? (
        <NewsForm onAddNews={handleAddNews} onCancel={() => setView("feed")} />
      ) : (
        <NewsFeed
          newsItems={newsItems}
          selectedCategory={selectedCategory}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}
