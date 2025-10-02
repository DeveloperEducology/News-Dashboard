import React, { useState, useEffect, useCallback } from "react";

// --- API SETUP ---
const API_BASE_URL = "https://twitterapi-node.onrender.com/api";
const POSTS_PER_PAGE = 10; 

// --- MOCK TOAST ---
const toast = {
  error: (message) => console.error(`Toast Error: ${message}`),
};

// --- SVG ICONS ---
// (All SVG components remain the same as in your original code)
const NewspaperIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4M4 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2M8 6h8M8 10h8M8 14h4" /></svg>);
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const BoltIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>);
const SunIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>);
const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" /></svg>);
const TwitterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" /></svg>);
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 8 0zm0 1.442c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.282.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.231 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.843-.038 1.096-.047 3.232-.047zM8 4.908a3.092 3.092 0 1 0 0 6.184 3.092 3.092 0 0 0 0-6.184zm0 5.075a1.983 1.983 0 1 1 0-3.966 1.983 1.983 0 0 1 0 3.966zm6.533-6.601a.636.636 0 1 0 0 1.272.636.636 0 0 0 0-1.272z" /></svg>);
const YoutubeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.022.26-.01.104c-.048.519-.119 1.023-.22 1.402a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" /></svg>);

// --- DATA MAPPING & UTILITIES ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const actualDate = typeof dateString === "object" && dateString.$date ? dateString.$date : dateString;
  const date = new Date(actualDate);
  if (isNaN(date)) return "Invalid Date";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

// --- REUSABLE COMPONENTS ---

const NewsListItem = ({ article }) => {
  const formatSourceName = (source) => {
    if (!source) return 'the source';
    return source.charAt(0).toUpperCase() + source.slice(1);
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col sm:flex-row items-start gap-5 p-4 transition-shadow hover:shadow-md">
      <div className="flex-shrink-0 w-full sm:w-48">
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          <img src={article.imageUrl || "https://placehold.co/400x300/e2e8f0/e2e8f0?text=."} alt={article.title} loading="lazy" className="w-full h-40 sm:h-32 object-cover rounded-md" />
        </a>
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="mb-1 text-xl font-bold leading-tight text-gray-900">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors duration-300">{article.title}</a>
        </h3>
        <div className="text-xs text-gray-500 mb-3">
          <span>short by / </span><time>{formatDate(article.publishedAt)}</time>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow">{article.summary}</p>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-700 hover:underline self-start">
          read more at {formatSourceName(article.source)}
        </a>
      </div>
    </article>
  );
};

const TwitterEmbedCard = ({ article }) => {
  useEffect(() => {
    // This ensures that when new tweet embeds are added to the DOM,
    // the Twitter script processes them.
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, [article.twitterUrl]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-center">
      <blockquote className="twitter-tweet" data-media-max-width="560">
        <a href={article.twitterUrl}>Loading Tweet...</a>
      </blockquote>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ source: "", category: "" });
  const [allSources, setAllSources] = useState([]);

  useEffect(() => {
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(now.toLocaleDateString("en-US", options));

    // Load Twitter's widget script once
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sources`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.status === "success") setAllSources(data.sources || []);
        else throw new Error(data.message || "Failed to parse sources");
      } catch (err) {
        console.error("Failed to fetch sources:", err);
        toast.error("Could not load news sources.");
      }
    };
    fetchSources();
  }, []);

  const fetchPosts = useCallback(async (pageNum, currentFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pageNum, limit: POSTS_PER_PAGE });
      if (currentFilters.source) params.append("source", currentFilters.source);
      if (currentFilters.category) params.append("category", currentFilters.category);

      const res = await fetch(`${API_BASE_URL}/posts?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.status === "success") {
        setTotalPages(data.totalPages || 1);
        if (pageNum === 1) {
          setPosts(data.posts || []);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...(data.posts || [])]);
        }
      } else {
        throw new Error(data.message || "Failed to fetch posts");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error("Error fetching posts.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page, filters);
  }, [page, filters, fetchPosts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setPage(1);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters({ source: "", category: "" });
  };
  
  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const navLinks = ["Home", "Politics", "Technology", "Sports", "Business", "Health", "Entertainment", "World"];
  const tickerItems = ["Major breakthrough...", "Global climate summit...", "Tech giants announce..."];
  const ALL_CATEGORIES = ["General", "Politics", "Astrology", "Sports", "Entertainment", "Technology", "Business", "Education", "Health", "Science", "International", "National", "Crime", "Telangana", "AndhraPradesh", "Viral", "Photos", "Videos", "LifeStyle"];

  return (
    <div className="bg-gray-100 font-sans text-gray-800">
      <style>{`.animate-ticker { animation: ticker 60s linear infinite; } @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-150%); } }`}</style>

      <header className="bg-white shadow-sm top-0 z-50" role="banner">
        {/* Header content remains the same */}
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>{currentDate}</span>
              <span className="flex items-center gap-1"><SunIcon /> 22°C</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <a href="#" aria-label="Facebook" className="p-2 rounded-full hover:bg-gray-100"><FacebookIcon /></a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-full hover:bg-gray-100"><TwitterIcon /></a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-full hover:bg-gray-100"><InstagramIcon /></a>
              <a href="#" aria-label="YouTube" className="p-2 rounded-full hover:bg-gray-100"><YoutubeIcon /></a>
            </div>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col">
              <h1 className="font-serif text-3xl font-bold text-blue-900 flex items-center gap-2"><NewspaperIcon /> NewsHub</h1>
              <p className="text-xs text-gray-500 italic -mt-1">Truth in Every Story</p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 font-medium text-center w-[728px] h-[90px]">
                <span>Advertisement</span>
                <p className="text-sm">728 x 90</p>
              </div>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden z-20" aria-label="Toggle navigation" aria-expanded={isMenuOpen}>
              <div className="space-y-1.5">
                <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                <span className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
                <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
              </div>
            </button>
          </div>
        </div>
        <nav className={`bg-blue-900 lg:rounded-t-lg w-full ${isMenuOpen ? "block" : "hidden"} lg:block`}>
          <div className="container mx-auto sticky px-4">
            <ul className="flex flex-col lg:flex-row items-center">
              {navLinks.map((link, index) => (<li key={link} className="w-full lg:w-auto"><a href="#" className={`block px-5 py-4 text-white font-medium whitespace-nowrap transition-colors duration-200 hover:bg-white/10 hover:text-amber-300 ${index === 0 ? "bg-white/10 text-amber-300" : ""}`}>{link}</a></li>))}
              <li className="ml-auto p-2 my-2 lg:my-0 w-full lg:w-auto"><div className="relative flex items-center"><input type="search" className="bg-white/10 text-white placeholder-white/70 rounded-full py-2 pl-4 pr-10 w-full lg:w-52 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="Search news..." /><button className="absolute right-0 top-0 h-full px-3 text-white" aria-label="Search"><SearchIcon /></button></div></li>
            </ul>
          </div>
        </nav>
      </header>
      
      <div className="bg-gradient-to-r from-red-700 to-red-800 text-white py-3 overflow-hidden" role="marquee">
          <div className="container mx-auto px-4 flex items-center gap-4">
              <span className="bg-white text-red-700 px-4 py-1.5 rounded-full font-bold text-sm whitespace-nowrap flex items-center gap-2"><BoltIcon /> Breaking</span>
              <div className="flex-1 overflow-hidden"><div className="flex whitespace-nowrap animate-ticker">{tickerItems.map((item, i) => (<span key={i} className="mx-6 font-medium">{item}</span>))}{tickerItems.map((item, i) => (<span key={`dup-${i}`} className="mx-6 font-medium">{item}</span>))}</div></div>
          </div>
      </div>

      <main id="main-content" className="py-8 md:py-12" role="main">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2">
              {loading && page === 1 ? (
                <div className="flex justify-center items-center h-96">
                  <svg className="animate-spin h-10 w-10 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
              ) : posts.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {posts.map((article) => {
                      if (article.twitterUrl) {
                        return <TwitterEmbedCard key={article.twitterUrl} article={article} />;
                      } else {
                        return <NewsListItem key={article._id?.$oid || article.url} article={article} />;
                      }
                    })}
                  </div>
                  {page < totalPages && (
                     <div className="mt-8 text-center">
                        <button onClick={handleLoadMore} disabled={loading} className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                           {loading ? "Loading..." : "Load More"}
                        </button>
                     </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold">No articles found.</h3>
                  <p>Try adjusting your filters or checking back later.</p>
                </div>
              )}
            </section>

            <aside className="space-y-8 lg:sticky lg:top-8 self-start">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="font-serif text-xl font-bold text-blue-900 flex items-center gap-2 mb-4 pb-2 border-b-2 border-amber-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="22 3 2 3 10 12.46V19l4 2v-8.54L22 3z"></polygon></svg> Filters</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                            <select id="source" name="source" value={filters.source} onChange={handleFilterChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"><option value="">All Sources</option>{allSources.map((s) => (<option key={s} value={s}>{s}</option>))}</select>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select id="category" name="category" value={filters.category} onChange={handleFilterChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"><option value="">All Categories</option>{ALL_CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}</select>
                        </div>
                        <button onClick={clearFilters} className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Clear Filters</button>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 font-medium text-center w-full h-[600px]">
                        <span>Advertisement</span>
                        <p className="text-sm">300 x 600</p>
                    </div>
                </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-300 pt-12 mt-16" role="contentinfo">
         {/* Footer content remains the same */}
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
               <div className="md:col-span-2 lg:col-span-1">
                  <h3 className="font-serif text-2xl font-bold text-amber-400 flex items-center gap-2 mb-4"><NewspaperIcon /> NewsHub</h3>
                  <p className="text-sm mb-4">Your trusted source for breaking news and in-depth analysis from around the world.</p>
                  <div className="flex items-center gap-3">
                     <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-gray-700 hover:bg-amber-400 hover:text-gray-900 transition-colors duration-200"><FacebookIcon /></a>
                     <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-gray-700 hover:bg-amber-400 hover:text-gray-900 transition-colors duration-200"><TwitterIcon /></a>
                     <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-gray-700 hover:bg-amber-400 hover:text-gray-900 transition-colors duration-200"><InstagramIcon /></a>
                     <a href="#" aria-label="YouTube" className="p-2 rounded-full bg-gray-700 hover:bg-amber-400 hover:text-gray-900 transition-colors duration-200"><YoutubeIcon /></a>
                  </div>
               </div>
               <div><h4 className="font-bold text-white mb-4">News Categories</h4><ul className="space-y-2 text-sm">{["Politics", "Technology", "Sports", "Business", "Health"].map((cat) => (<li key={cat}><a href="#" className="hover:text-amber-400">{cat}</a></li>))}</ul></div>
               <div><h4 className="font-bold text-white mb-4">About Us</h4><ul className="space-y-2 text-sm">{["Our Team", "Contact Us", "Careers", "Advertise"].map((link) => (<li key={link}><a href="#" className="hover:text-amber-400">{link}</a></li>))}</ul></div>
               <div><h4 className="font-bold text-white mb-4">Legal</h4><ul className="space-y-2 text-sm">{["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (<li key={link}><a href="#" className="hover:text-amber-400">{link}</a></li>))}</ul></div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center text-sm py-6 border-t border-gray-700">
               <p className="text-gray-400 mb-4 md:mb-0">&copy; {new Date().getFullYear()} NewsHub. All rights reserved.</p>
               <div className="flex items-center gap-4">
                  <a href="#" className="hover:text-amber-400">Sitemap</a>
                  <a href="#" className="hover:text-amber-400">RSS Feed</a>
                  <a href="#" className="hover:text-amber-400">Newsletter</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
