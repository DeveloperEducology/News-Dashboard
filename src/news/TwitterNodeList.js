import React, { useEffect, useState, useCallback, memo } from "react";
import {
  FiHome,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiColumns,
  FiPlusCircle,
  FiXCircle,
  FiFilter,
  FiCopy,
  FiCheck,
  FiTrash2,
  FiZap,
  FiMenu,
  FiImage,
  FiEdit,
  FiTrash,
  FiCode,
  FiBookmark,
  FiTrendingUp,
  FiTwitter,
  FiTag,
  FiX,
  FiAlertTriangle,
  FiLink,
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

// --- CONFIGURATION ---
// const API_BASE_URL = "http://localhost:4000/api";
const API_BASE_URL = "https://twitterapi-node.onrender.com/api";
const POSTS_PER_PAGE = 10;
const POSTS_PER_SOURCE_COLUMN = 15; // How many posts to load initially and per "Load More" click
const ALL_CATEGORIES = [
  "General",
  "Politics",
  "Astrology",
  "Sports",
  "Entertainment",
  "Technology",
  "Business",
  "Education",
  "Health",
  "Science",
  "International",
  "National",
  "Crime",
  "Telangana",
  "AndhraPradesh",
  "Viral",
  "Photos",
  "Videos",
  "Lifestyle",
];
const POST_TYPES = ["normal_post", "full_post", "youtube_video"];
const DEFAULT_POST_STATE = {
  title: "",
  summary: "",
  text: "",
  url: "",
  imageUrl: "",
  videoUrl: "",
  source: "Manual",
  lang: "te",
  sourceType: "manual",
  categories: [],
  tags: [],
  isPublished: true,
  isBreaking: false,
  type: "normal_post",
  twitterUrl: "",
  relatedStories: [],
  scheduledFor: null,
  pinnedIndex: null,
};

// --- HELPER & HOOKS ---
const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now - past) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// --- MAIN DASHBOARD COMPONENT ---
export default function AdminDashboard() {
  const [view, setView] = useState("source-columns");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [onSaveSuccessCallback, setOnSaveSuccessCallback] = useState(null);

  // State for selected sources, lifted up to be shared between Settings and Columns view
  const [selectedSources, setSelectedSources] = useState(() => {
    try {
      const saved = localStorage.getItem("selectedNewsSources");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  // Effect to save selected sources to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "selectedNewsSources",
      JSON.stringify(selectedSources)
    );
  }, [selectedSources]);

  const handleOpenModal = (post = null, onSaveSuccess = () => {}) => {
    /* ... (unchanged) ... */
    if (post && post._id) {
      setEditingPost({ ...DEFAULT_POST_STATE, ...post });
      setIsModalOpen(true);
      setOnSaveSuccessCallback(() => onSaveSuccess);
      fetch(`${API_BASE_URL}/post/${post._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success")
            setEditingPost((p) => ({ ...p, ...data.post }));
        })
        .catch((err) => toast.error("Could not load latest post details."));
    } else {
      setEditingPost(
        post ? { ...DEFAULT_POST_STATE, ...post } : DEFAULT_POST_STATE
      );
      setOnSaveSuccessCallback(() => onSaveSuccess);
      setIsModalOpen(true);
    }
  };
  const handleCloseModal = () => {
    /* ... (unchanged) ... */
    setIsModalOpen(false);
    setEditingPost(null);
    setOnSaveSuccessCallback(null);
  };
  const handleSetImageUrl = (url) => {
    /* ... (unchanged) ... */
    setEditingPost((prev) => ({ ...prev, imageUrl: url }));
    setIsGalleryOpen(false);
  };
  const handleSave = async (postData) => {
    /* ... (unchanged) ... */
    const isUpdating = !!postData._id;
    const url = isUpdating
      ? `${API_BASE_URL}/post/${postData._id}`
      : `${API_BASE_URL}/post`;
    const method = isUpdating ? "PUT" : "POST";
    const payload = {
      ...postData,
      tags:
        postData.tags?.map((tag) =>
          typeof tag === "object" ? tag.name : tag
        ) || [],
      relatedStories: postData.relatedStories?.map((story) => story._id) || [],
    };
    const promise = fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "An error occurred.");
        return data;
      });
    toast.promise(promise, {
      loading: "Saving post...",
      success: () => {
        handleCloseModal();
        if (onSaveSuccessCallback) onSaveSuccessCallback();
        return `Post successfully ${isUpdating ? "updated" : "created"}!`;
      },
      error: (err) => `Error: ${err.message}`,
    });
  };

  const renderView = () => {
    switch (view) {
      case "source-columns":
        return (
          <SourceColumnView
            onOpenModal={handleOpenModal}
            selectedSources={selectedSources}
          />
        );
      case "settings":
        return (
          <SettingsPage
            selectedSources={selectedSources}
            setSelectedSources={setSelectedSources}
          />
        );
      case "posts":
        return <PostsListPage onOpenModal={handleOpenModal} />;
      // ... other cases remain the same
      case "sticky-posts":
        return <StickyPostsPage onOpenModal={handleOpenModal} />;
      case "fetch-tweet":
        return <FetchTweetPage onOpenModal={handleOpenModal} />;
      case "json-parser":
        return <JsonParserPage />;
      case "dashboard":
      default:
        return <DashboardHomePage />;
    }
  };

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar
          currentView={view}
          setView={setView}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header
            onMenuClick={() => setIsSidebarOpen(true)}
            onOpenModal={handleOpenModal}
          />
          <div className="flex-1 overflow-hidden p-2 md:p-4">
            {renderView()}
          </div>
        </main>
      </div>
      {isModalOpen && (
        <PostFormModal
          post={editingPost}
          onSave={handleSave}
          onClose={handleCloseModal}
          onOpenGallery={() => setIsGalleryOpen(true)}
        />
      )}
      {isGalleryOpen && (
        <ImageGalleryModal
          onSelectImage={handleSetImageUrl}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </>
  );
}

// --- LAYOUT COMPONENTS ---
const Sidebar = ({ currentView, setView, isOpen, setIsOpen }) => {
  /* ... (unchanged) ... */
  const NavItem = ({ viewName, icon, text }) => (
    <button
      onClick={() => {
        setView(viewName);
        setIsOpen(false);
      }}
      className={`flex items-center gap-3 px-3 py-2 rounded w-full text-left font-semibold transition-colors ${
        currentView === viewName
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon} {text}
    </button>
  );
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="text-xl font-bold p-4 border-b">
        <span>NewsAdmin</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavItem
          viewName="source-columns"
          icon={<FiColumns />}
          text="Source Columns"
        />
        <NavItem
          viewName="posts"
          icon={<FiFileText />}
          text="All Posts (List)"
        />
        <NavItem viewName="dashboard" icon={<FiHome />} text="Dashboard" />
        <NavItem
          viewName="sticky-posts"
          icon={<FiTrendingUp />}
          text="Sticky Posts"
        />
        <NavItem
          viewName="fetch-tweet"
          icon={<FiTwitter />}
          text="Fetch from Tweet"
        />
        <NavItem viewName="json-parser" icon={<FiCode />} text="JSON Parser" />
        <NavItem viewName="settings" icon={<FiSettings />} text="Settings" />
      </nav>
    </aside>
  );
};
const Header = ({ onMenuClick, onOpenModal }) => (
  <header className="flex-shrink-0 bg-white shadow-sm p-4 flex justify-between items-center md:justify-end">
    <button onClick={onMenuClick} className="sm:hidden p-2 text-gray-600">
      <FiMenu size={24} />
    </button>
    <div className="flex items-center gap-4">
      <button
        onClick={() => onOpenModal()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2"
      >
        <FiPlusCircle /> Create Post
      </button>
    </div>
  </header>
);

// --- UPDATED COLUMN VIEW & SETTINGS COMPONENTS ---

const SettingsPage = ({ selectedSources, setSelectedSources }) => {
  const [allSources, setAllSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSources = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sources`);
        const data = await res.json();
        if (data.status === "success") {
          setAllSources(data.sources.sort()); // Sort alphabetically
        } else {
          throw new Error(data.message || "Failed to fetch sources");
        }
      } catch (err) {
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSources();
  }, []);

  const handleSourceToggle = (sourceName) => {
    setSelectedSources((prev) =>
      prev.includes(sourceName)
        ? prev.filter((s) => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  if (loading) {
    return <div className="p-4">Loading settings...</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Settings
      </h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Display Sources
        </h2>
        <p className="text-gray-600 mb-6">
          Select the news sources you want to see in the "Source Columns" view.
          Your choices are saved automatically.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allSources.map((source) => (
            <label
              key={source}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selectedSources.includes(source)}
                onChange={() => handleSourceToggle(source)}
              />
              <span className="text-gray-700 font-medium">{source}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const SourceColumnView = ({ onOpenModal, selectedSources }) => {
  // Data fetching logic is now delegated to each individual SourceColumn.
  // This view is now only responsible for laying out the selected columns.

  if (selectedSources.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow m-auto">
        <h3 className="text-xl font-bold text-gray-700">No sources selected</h3>
        <p className="text-gray-500 mt-2">
          Go to the Settings page to choose which sources to display.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full gap-4 overflow-x-auto pb-4">
      {selectedSources.map((source) => (
        <SourceColumn
          key={source}
          sourceName={source}
          onOpenModal={onOpenModal}
        />
      ))}
    </div>
  );
};

const SourceColumn = ({ sourceName, onOpenModal }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(
    async (pageNum) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/posts/source/${encodeURIComponent(
            sourceName
          )}?page=${pageNum}&limit=${POSTS_PER_SOURCE_COLUMN}`
        );
        const data = await res.json();
        if (data.status === "success") {
          setPosts((prev) =>
            pageNum === 1 ? data.posts : [...prev, ...data.posts]
          );
          setHasMore(data.hasMore);
        } else {
          throw new Error(data.message || "Failed to fetch posts");
        }
      } catch (err) {
        toast.error(`Error fetching from ${sourceName}: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [sourceName]
  );

  useEffect(() => {
    // Reset and fetch data when sourceName changes
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchData(1);
  }, [fetchData]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  };

  const onActionSuccess = () => fetchData(1); // On save/delete, refresh the column from page 1

  return (
    <div className="flex flex-col flex-shrink-0 w-80 h-full bg-white rounded-lg shadow">
      <h2 className="p-3 text-lg font-bold text-gray-800 border-b flex-shrink-0">
        {sourceName}
      </h2>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {posts.map((post) => (
          <button
            key={post._id}
            onClick={() => onOpenModal(post, onActionSuccess)}
            className="w-full text-left p-2.5 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-blue-100 focus:ring-2 focus:ring-blue-500"
          >
            <p className="font-medium text-gray-700 leading-snug">
              {post.title}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatTimeAgo(post.createdAt)}
            </p>
          </button>
        ))}
        {isLoading && page > 1 && (
          <p className="text-center text-sm text-gray-500 p-2">Loading...</p>
        )}
      </div>
      {hasMore && (
        <div className="p-2 border-t">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

// ... ALL OTHER COMPONENTS (Dashboard, PostsList, Modals, etc.) remain unchanged ...
// NOTE: I've included them here for a complete, runnable file.
const DashboardHomePage = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
      Dashboard
    </h1>
  </div>
);
const FetchTweetPage = ({ onOpenModal }) => {
  const [tweetId, setTweetId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (event) => {
    const value = event.target.value;
    const regex = /(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/(\d+)/;
    const match = value.match(regex);
    setTweetId(match ? match[1] : value);
  };
  const handleFetchTweet = () => {
    if (!tweetId) {
      toast.error("Please provide a Tweet ID or URL.");
      return;
    }
    setIsLoading(true);
    const promise = fetch(`${API_BASE_URL}/formatted-tweet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tweet_ids: [tweetId] }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (
          !ok ||
          data.status !== "success" ||
          !data.successfulPosts ||
          data.successfulPosts.length === 0
        ) {
          throw new Error(data.message || "Tweet could not be processed.");
        }
        return data.successfulPosts[0];
      });
    toast
      .promise(promise, {
        loading: "Fetching and creating post...",
        success: (createdPost) => {
          onOpenModal(createdPost);
          return "Tweet processed! You can now edit the post.";
        },
        error: (err) => `Error: ${err.message}`,
      })
      .finally(() => {
        setIsLoading(false);
        setTweetId("");
      });
  };
  return (
    <div className="p-4">
      {" "}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Fetch from Tweet
      </h1>{" "}
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        {" "}
        <input
          id="tweetId"
          type="text"
          value={tweetId}
          onChange={handleInputChange}
          placeholder="Paste Tweet URL or ID"
          className="w-full px-3 py-2 border rounded-lg mb-4"
        />{" "}
        <button
          onClick={handleFetchTweet}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
        >
          {" "}
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              <FiTwitter /> Fetch & Edit
            </>
          )}{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
};
const JsonParserPage = () => {
  const [jsonInput, setJsonInput] = useState("");
  const handleSave = () => {
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonInput);
    } catch (error) {
      toast.error("Invalid JSON format.");
      return;
    }
    const promise = fetch(`${API_BASE_URL}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...DEFAULT_POST_STATE, ...parsedJson }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Error.");
        return data;
      });
    toast.promise(promise, {
      loading: "Saving parsed post...",
      success: () => {
        setJsonInput("");
        return "Post created successfully!";
      },
      error: (err) => `Error: ${err.message}`,
    });
  };
  return (
    <div className="p-4">
      {" "}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        JSON Object Parser
      </h1>{" "}
      <div className="bg-white rounded-lg shadow p-6">
        {" "}
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows="15"
          className="w-full border rounded-lg p-3 font-mono text-sm"
          placeholder="Paste a valid post JSON object here..."
        />{" "}
        <div className="flex justify-end mt-4">
          {" "}
          <button
            onClick={handleSave}
            disabled={!jsonInput.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-blue-300"
          >
            {" "}
            Parse & Save Post{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
const PostsListPage = ({ onOpenModal }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quickPostText, setQuickPostText] = useState("");
  const [isPublishingQuick, setIsPublishingQuick] = useState(false);
  const [filters, setFilters] = useState({ source: "", category: "" });
  const [allSources, setAllSources] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const fetchPosts = useCallback(async (pageNum, currentFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: POSTS_PER_PAGE,
        pinned: "false",
      });
      if (currentFilters.source) params.append("source", currentFilters.source);
      if (currentFilters.category)
        params.append("category", currentFilters.category);
      const res = await fetch(`${API_BASE_URL}/posts?${params.toString()}`);
      const data = await res.json();
      if (data.status === "success") {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error("Error fetching posts.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sources`);
        const data = await res.json();
        if (data.status === "success") setAllSources(data.sources);
      } catch (err) {
        console.error("Failed to fetch sources:", err);
      }
    };
    fetchSources();
  }, []);
  useEffect(() => {
    fetchPosts(page, filters);
    setSelectedPosts(new Set());
  }, [page, filters, fetchPosts]);
  const handleFilterChange = (e) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const clearFilters = () => {
    setPage(1);
    setFilters({ source: "", category: "" });
  };
  const handleQuickCreate = () => {
    if (!quickPostText.trim()) {
      toast.error("Please paste some text.");
      return;
    }
    const lines = quickPostText.trim().split("\n");
    const newPost = {
      ...DEFAULT_POST_STATE,
      title: lines[0] || "",
      summary: lines.slice(1).join("\n").trim(),
    };
    onOpenModal(newPost, () => fetchPosts(page, filters));
    setQuickPostText("");
  };
  const handleBulkDelete = () => {
    if (selectedPosts.size === 0) return toast.error("No posts selected.");
    if (!window.confirm(`Delete ${selectedPosts.size} posts permanently?`))
      return;
    const promise = Promise.all(
      Array.from(selectedPosts).map((id) =>
        fetch(`${API_BASE_URL}/post/${id}`, { method: "DELETE" })
      )
    );
    toast.promise(promise, {
      loading: "Deleting posts...",
      success: () => {
        fetchPosts(page, filters);
        return `${selectedPosts.size} posts deleted.`;
      },
      error: "Failed to delete some posts.",
    });
  };
  const handleToggleSelect = (id) => {
    setSelectedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };
  const handleToggleSelectAll = () => {
    if (selectedPosts.size === posts.length) setSelectedPosts(new Set());
    else setSelectedPosts(new Set(posts.map((p) => p._id)));
  };
  return (
    <div className="overflow-y-auto h-full">
      {" "}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Manage Posts
      </h1>{" "}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        {" "}
        <h2 className="font-semibold text-gray-700 mb-3">
          Quick Post Creator
        </h2>{" "}
        <textarea
          value={quickPostText}
          onChange={(e) => setQuickPostText(e.target.value)}
          rows="4"
          className="w-full border rounded-lg p-2 bg-gray-50"
          placeholder="Paste text here... Title on the first line."
        />{" "}
        <div className="flex justify-end gap-3 mt-3">
          {" "}
          <button
            onClick={handleQuickCreate}
            disabled={!quickPostText.trim()}
            className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold disabled:bg-gray-400"
          >
            {" "}
            Parse & Edit{" "}
          </button>{" "}
          <button
            disabled={!quickPostText.trim() || isPublishingQuick}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-indigo-400 flex items-center gap-2"
          >
            {" "}
            {isPublishingQuick ? (
              "Publishing..."
            ) : (
              <>
                <FiZap size={16} /> Publish Directly
              </>
            )}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div className="bg-white rounded-lg shadow">
        {" "}
        <div className="p-4 border-b space-y-4">
          {" "}
          <div className="flex justify-between items-center">
            {" "}
            <div className="flex items-center gap-4">
              {" "}
              <h3 className="font-semibold text-lg">All Posts</h3>{" "}
              {selectedPosts.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800"
                >
                  {" "}
                  <FiTrash2 /> Delete ({selectedPosts.size}){" "}
                </button>
              )}{" "}
            </div>{" "}
            <button
              onClick={() => onOpenModal(null, () => fetchPosts(page, filters))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
            >
              {" "}
              + Create Post{" "}
            </button>{" "}
          </div>{" "}
          <div className="flex flex-wrap items-center gap-4">
            {" "}
            <FiFilter className="text-gray-500" />{" "}
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="border-gray-300 rounded-lg text-sm"
            >
              {" "}
              <option value="">All Categories</option>{" "}
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}{" "}
            </select>{" "}
            <select
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              className="border-gray-300 rounded-lg text-sm"
            >
              {" "}
              <option value="">All Sources</option>{" "}
              {allSources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}{" "}
            </select>{" "}
            {(filters.source || filters.category) && (
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-600"
              >
                {" "}
                Clear{" "}
              </button>
            )}{" "}
          </div>{" "}
        </div>{" "}
        <PostsTable
          posts={posts}
          loading={loading}
          onOpenModal={onOpenModal}
          onActionSuccess={() => fetchPosts(page, filters)}
          isStickyPage={false}
          selectedPosts={selectedPosts}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
        />{" "}
        <div className="flex justify-between items-center p-4 border-t">
          {" "}
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300"
          >
            {" "}
            <FiChevronLeft /> Prev{" "}
          </button>{" "}
          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>{" "}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300"
          >
            {" "}
            Next <FiChevronRight />{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
const StickyPostsPage = ({ onOpenModal }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchStickyPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/posts?pinned=true`);
      const data = await res.json();
      if (data.status === "success") {
        setPosts(data.posts || []);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error("Error fetching sticky posts.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchStickyPosts();
  }, [fetchStickyPosts]);
  return (
    <div className="overflow-y-auto h-full">
      {" "}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Sticky Posts
      </h1>{" "}
      <div className="bg-white rounded-lg shadow">
        {" "}
        <div className="p-4 border-b">
          {" "}
          <h3 className="font-semibold text-lg">All Pinned Items</h3>{" "}
        </div>{" "}
        <PostsTable
          posts={posts}
          loading={loading}
          onOpenModal={onOpenModal}
          onActionSuccess={fetchStickyPosts}
          isStickyPage={true}
        />{" "}
      </div>{" "}
    </div>
  );
};
const PostsTable = ({
  posts,
  loading,
  onOpenModal,
  onActionSuccess,
  isStickyPage,
  selectedPosts,
  onToggleSelect,
  onToggleSelectAll,
}) => {
  const performUpdate = (p) =>
    toast.promise(
      fetch(`${API_BASE_URL}/post/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      }).then((r) => {
        if (!r.ok) throw new Error("Update failed");
      }),
      {
        loading: "Updating...",
        success: () => {
          onActionSuccess();
          return "Updated!";
        },
        error: (e) => e.message,
      }
    );
  const handlePinToggle = (p) => {
    const isPinned = p.pinnedIndex != null;
    if (isPinned) {
      if (window.confirm(`Unpin "${p.title}"?`))
        performUpdate({ ...p, pinnedIndex: null });
    } else {
      const pos = window.prompt("Enter pin position...");
      if (pos) {
        const idx = parseInt(pos, 10) - 1;
        if (!isNaN(idx) && idx >= 0) performUpdate({ ...p, pinnedIndex: idx });
        else toast.error("Invalid position.");
      }
    }
  };
  const handleDelete = (id) => {
    if (!window.confirm("Delete post?")) return;
    toast.promise(
      fetch(`${API_BASE_URL}/post/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("Delete failed");
      }),
      {
        loading: "Deleting...",
        success: () => {
          onActionSuccess();
          return "Deleted!";
        },
        error: (e) => e.message,
      }
    );
  };
  const handleNotify = (id, title) => {
    if (!window.confirm(`Send notification for "${title}"?`)) return;
    toast.promise(
      fetch(`${API_BASE_URL}/admin/notify/post/${id}`, { method: "POST" })
        .then((r) => r.json())
        .then((d) => {
          if (!d.successCount) throw new Error(d.message || "Failed");
        }),
      { loading: "Sending...", success: "Notified!", error: (e) => e.message }
    );
  };
  return (
    <div className="overflow-x-auto">
      {" "}
      <table className="w-full text-left text-sm">
        {" "}
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          {" "}
          <tr>
            {" "}
            {!isStickyPage && (
              <th className="px-4 py-3">
                {" "}
                <input
                  type="checkbox"
                  checked={
                    selectedPosts?.size === posts.length && posts.length > 0
                  }
                  onChange={onToggleSelectAll}
                />{" "}
              </th>
            )}{" "}
            {isStickyPage && <th className="px-4 py-3 w-16">Pos</th>}{" "}
            <th className="px-4 py-3">Title</th>{" "}
            <th className="px-4 py-3">Categories</th>{" "}
            <th className="px-4 py-3">Source</th>{" "}
            <th className="px-4 py-3">Created</th>{" "}
            <th className="px-4 py-3 text-right">Actions</th>{" "}
          </tr>{" "}
        </thead>{" "}
        <tbody>
          {" "}
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center p-8">
                Loading...
              </td>
            </tr>
          ) : posts.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-8">
                No posts found.
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr
                key={post._id}
                className={`border-t hover:bg-gray-50 ${
                  selectedPosts?.has(post._id) ? "!bg-blue-50" : ""
                }`}
              >
                {" "}
                {!isStickyPage && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedPosts.has(post._id)}
                      onChange={() => onToggleSelect(post._id)}
                    />
                  </td>
                )}{" "}
                {isStickyPage && (
                  <td className="px-4 py-3 font-bold text-lg text-blue-600">
                    #{post.pinnedIndex + 1}
                  </td>
                )}{" "}
                <td className="px-4 py-3 max-w-sm">
                  <p className="font-medium truncate flex items-center gap-2">
                    {post.pinnedIndex != null && (
                      <FiBookmark className="text-yellow-600" />
                    )}
                    {post.title}
                  </p>
                </td>{" "}
                <td className="px-4 py-3 max-w-xs truncate">
                  {post.categories?.join(", ") || "-"}
                </td>{" "}
                <td className="px-4 py-3">
                  <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                    {post.source}
                  </span>
                </td>{" "}
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatTimeAgo(post.createdAt)}
                </td>{" "}
                <td className="px-4 py-3">
                  {" "}
                  <div className="flex justify-end gap-2">
                    {" "}
                    {isStickyPage ? (
                      <button
                        onClick={() => handlePinToggle(post)}
                        title="Unpin Post"
                        className="p-2 rounded-md border font-semibold border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
                      >
                        Unpin
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePinToggle(post)}
                        title="Pin Post"
                        className="p-2 rounded-md border text-gray-700 hover:bg-gray-100"
                      >
                        <FiBookmark />
                      </button>
                    )}{" "}
                    <button
                      onClick={() => onOpenModal(post, onActionSuccess)}
                      className="p-2 rounded-md border font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      <FiEdit />
                    </button>{" "}
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <FiTrash2 />
                    </button>{" "}
                    <button
                      onClick={() => handleNotify(post._id, post.title)}
                      className="p-2 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      title="Send Alert"
                    >
                      <FiBell />
                    </button>{" "}
                  </div>{" "}
                </td>{" "}
              </tr>
            ))
          )}{" "}
        </tbody>{" "}
      </table>{" "}
    </div>
  );
};
function PostFormModal({ post, onSave, onClose, onOpenGallery }) {
  const [formData, setFormData] = useState(DEFAULT_POST_STATE);
  const [tagInput, setTagInput] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tags`);
        const data = await response.json();
        if (data.status === "success") {
          setAllTags(data.tags.map((t) => t.name));
        }
      } catch (error) {
        toast.error("Could not load tags.");
      }
    };
    fetchTags();
  }, []);
  useEffect(() => {
    const initialData = post
      ? {
          ...DEFAULT_POST_STATE,
          ...post,
          tags:
            post.tags
              ?.map((t) => (typeof t === "object" ? t.name : t))
              .filter(Boolean) || [],
        }
      : DEFAULT_POST_STATE;
    setFormData(initialData);
  }, [post]);
  const handleChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  const handleCategoriesChange = (category) => {
    const current = formData.categories || [];
    const newCategories = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setFormData((prev) => ({ ...prev, categories: newCategories }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    if (value.trim()) {
      setSuggestions(
        allTags
          .filter(
            (t) =>
              t.toLowerCase().startsWith(value.toLowerCase()) &&
              !formData.tags.includes(t)
          )
          .slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      tags: Array.from(new Set([...prev.tags, suggestion])),
    }));
    setTagInput("");
    setSuggestions([]);
  };
  const handleAddTagOnEnter = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleSuggestionClick(tagInput.trim().toLowerCase());
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      {" "}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl max-h-[95vh] rounded-xl flex flex-col"
      >
        {" "}
        <div className="p-5 border-b flex justify-between items-center">
          {" "}
          <h2 className="text-2xl font-bold">
            {formData._id ? "Edit Post" : "Create Post"}
          </h2>{" "}
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>{" "}
        </div>{" "}
        <div className="p-6 space-y-5 overflow-y-auto">
          {" "}
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />{" "}
          <FormTextarea
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={3}
          />{" "}
          <div>
            {" "}
            <label className="block text-sm font-medium mb-1">Tags</label>{" "}
            <div className="relative">
              {" "}
              <div className="p-2 bg-gray-50 rounded-lg border flex flex-wrap gap-2 items-center">
                {" "}
                {(formData.tags || []).map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {" "}
                    {tag}{" "}
                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                      <FiX size={14} />
                    </button>{" "}
                  </div>
                ))}{" "}
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleAddTagOnEnter}
                  placeholder="Add a tag..."
                  className="flex-1 bg-transparent focus:outline-none p-1"
                />{" "}
              </div>{" "}
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                  {" "}
                  {suggestions.map((s) => (
                    <div
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {s}
                    </div>
                  ))}{" "}
                </div>
              )}{" "}
            </div>{" "}
          </div>{" "}
           <ImageUrlInput value={formData.imageUrl || ""} onChange={handleChange} onOpenGallery={onOpenGallery} />
            <FormInput label="Video URL" name="videoUrl" value={formData.videoUrl || ""} onChange={handleChange} />
            
            {/* 👇 UPDATED SECTION HERE 👇 */}
            <UrlInputWithLink
              label="Source URL"
              name="url"
              value={formData.url || ""}
              onChange={handleChange}
            />
          {/* ... other form fields ... */}
          <div className="flex justify-end gap-3 mt-auto p-5 bg-gray-50 border-t">
            {" "}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border font-semibold"
            >
              Cancel
            </button>{" "}
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold"
            >
              Save Post
            </button>{" "}
          </div>
        </div>
      </form>{" "}
    </div>
  );
}
const FormInput = memo(({ label, ...props }) => (
  <div>
    {" "}
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>{" "}
    <input
      className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500"
      {...props}
    />{" "}
  </div>
));
const FormTextarea = memo(({ label, ...props }) => (
  <div>
    {" "}
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>{" "}
    <textarea
      className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500"
      {...props}
    />{" "}
  </div>
));

// 👇 NEW COMPONENT FOR THE URL INPUT 👇
const UrlInputWithLink = memo(({ label, value, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className="flex items-center gap-2">
      <input
        value={value}
        className="flex-1 w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500"
        {...props}
      />
      {/* This link only appears if 'value' (the URL) is not empty */}
      {value && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          title="Open link in new tab"
          className="p-2.5 text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-100 rounded-lg"
        >
          <FiLink />
        </a>
      )}
    </div>
  </div>
));
const ImageUrlInput = ({ value, onChange, onOpenGallery }) => (
  <div>
    {" "}
    <label className="block text-sm font-medium mb-1">Image URL</label>{" "}
    <div className="flex gap-2">
      {" "}
      <input
        name="imageUrl"
        value={value || ""}
        onChange={onChange}
        className="flex-1 border rounded-lg px-3 py-2 bg-gray-50"
        placeholder="https://..."
      />{" "}
      <button
        type="button"
        onClick={onOpenGallery}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1"
      >
        {" "}
        <FiImage size={18} /> <span className="hidden sm:inline">Gallery</span>{" "}
      </button>{" "}
    </div>{" "}
  </div>
);
function ImageGalleryModal({ onSelectImage, onClose }) {
  const [images, setImages] = useState([]);
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`${API_BASE_URL}/images?limit=100`);
        const data = await res.json();
        if (data.status === "success") setImages(data.images);
      } catch (e) {
        toast.error("Failed to load images.");
      }
    }
    fetchImages();
  }, []);
  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
      {" "}
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl flex flex-col">
        {" "}
        <div className="p-5 border-b flex justify-between items-center">
          {" "}
          <h2 className="text-2xl font-bold">Select Image</h2>{" "}
          <button type="button" onClick={onClose}>
            <FiXCircle />
          </button>{" "}
        </div>{" "}
        <div className="flex-1 p-4 overflow-y-auto">
          {" "}
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {" "}
            {images.map((img) => (
              <div
                key={img._id}
                className="relative w-full aspect-square rounded-lg cursor-pointer group"
                onClick={() => onSelectImage(img.imageUrl)}
              >
                {" "}
                <img
                  src={img.imageUrl}
                  alt={img.title || ""}
                  className="w-full h-full object-cover group-hover:scale-105"
                />{" "}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  {" "}
                  <FiCheck
                    size={30}
                    className="text-white bg-blue-600 rounded-full p-1"
                  />{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}


