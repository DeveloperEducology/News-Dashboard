import React, { useEffect, useState, useCallback, memo } from "react";
import {
  FiHome,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
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
  FiCode, // New Icon
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

// --- CONFIGURATION ---
// const API_BASE_URL = "http://localhost:4000/api";
const API_BASE_URL = "https://twitterapi-node.onrender.com/api";
const POSTS_PER_PAGE = 10;
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
  "LifeStyle",
  // Added tags from the sample JSON for consistency
  "చైతన్యానంద సరస్వతి",
  "లైంగిక వేధింపులు",
  "స్వామీజీ",
  "ఢిల్లీ పోలీస్",
  "ఆగ్రా అరెస్టు",
  "మోసం",
];

const DEFAULT_POST_STATE = {
  title: "",
  summary: "",
  text: "",
  url: "",
  imageUrl: "",
  videoUrl: "",
  source: "Manual",
  sourceType: "manual",
  categories: [],
  isPublished: true,
  type: "normal_post",
  twitterUrl: "",
  relatedStories: [],
  scheduledFor: null,
  isBreaking: false,
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

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- MAIN DASHBOARD COMPONENT ---
export default function AdminDashboard() {
  const [view, setView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (view) {
      case "posts":
        return <PostsListPage />;
      case "settings":
        return <SettingsPage />;
      // --- NEW VIEW CASE ---
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
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="p-2 md:p-6 flex-1">{renderView()}</div>
        </main>
      </div>
    </>
  );
}

// --- LAYOUT COMPONENTS ---
const Sidebar = ({ currentView, setView, isOpen, setIsOpen }) => {
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
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 z-20 sm:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="text-xl font-bold p-4 border-b flex items-center justify-between">
          <span>NewsAdmin</span>
          <button
            onClick={() => setIsOpen(false)}
            className="sm:hidden text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem viewName="dashboard" icon={<FiHome />} text="Dashboard" />
          <NavItem viewName="posts" icon={<FiFileText />} text="Posts" />
          {/* --- NEW NAV ITEM --- */}
          <NavItem
            viewName="json-parser"
            icon={<FiCode />}
            text="JSON Parser"
          />
          <NavItem viewName="settings" icon={<FiSettings />} text="Settings" />
        </nav>
        <div className="p-4 border-t">
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 w-full text-gray-600">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

const Header = ({ onMenuClick }) => (
  <header className="flex-shrink-0 bg-white shadow-sm p-4 flex justify-between items-center md:justify-end">
    <button onClick={onMenuClick} className="sm:hidden p-2 text-gray-600">
      <FiMenu size={24} />
    </button>
    <div className="flex items-center gap-4">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded-lg px-3 py-2 hidden sm:block"
      />
      <FiBell className="text-2xl text-gray-500" />
    </div>
  </header>
);

// --- 🚀🚀 NEW COMPONENT: JSON PARSER PAGE 🚀🚀 ---
const JsonParserPage = () => {
  // Default JSON provided in the prompt for easy testing
//   const defaultJsonString = `{
//   "title": "ఢిల్లీ స్వామీజీ కేసులో కొత్త విషయాలు: మహిళలతో వాట్సాప్‌ చాట్‌లు బహిర్గతం, దర్యాప్తుకు సహకరించని నిందితుడు",
//   "summary": "ఢిల్లీ ఆశ్రమంలో మహిళలను లైంగికంగా వేధించిన ఆరోపణలు ఎదుర్కొంటున్న చైతన్యానంద సరస్వతి (పార్థసారథి)ని ఆగ్రాలో అరెస్టు చేశారు. అతని మొబైల్‌లో మహిళలను లోబరుచుకునే ప్రయత్నాలను వెల్లడించే వాట్సాప్‌ చాట్‌లు, ఫోటోలు దొరికాయి. విచారణలో నిందితుడు సహకరించడం లేదని, నకిలీ UN, BRICS రాయబారి కార్డులు కూడా అతని వద్ద లభించాయని పోలీసులు తెలిపారు. బాధితుల్లో ఒకరి తండ్రిని బెదిరించినందుకు అతని అనుచరుడిని కూడా అరెస్టు చేశారు.",
//   "text": "స్వయం ప్రకటిత దేవుడు చైతన్యానంద సరస్వతి (అలియాస్ పార్థసారథి)పై దర్యాప్తులో కీలక ఆధారాలు వెలుగులోకి వచ్చాయి. ఢిల్లీ ఆశ్రమంలో డజనుకు పైగా మహిళలను లైంగికంగా వేధించిన కేసులో నిందితుడైన ఇతని మొబైల్ ఫోన్ నుండి పోలీసులు అభ్యంతరకరమైన వాట్సాప్ చాట్‌లను సేకరించారు. ఆ చాట్‌లలో మహిళలను పలు ఆశలు చూపించి లోబరుచుకునే ప్రయత్నాలు చేసినట్లు తేలింది. పోలీసులు అతని ఫోన్‌లో పలువురు మహిళా క్యాబిన్ సిబ్బందితో దిగిన ఫోటోలు, అనేక మంది మహిళల సోషల్ మీడియా ప్రొఫైల్ పిక్చర్‌ల స్క్రీన్‌షాట్‌లను కూడా గుర్తించారు... (Full text would go here)",
//   "tags": [
//     "చైతన్యానంద సరస్వతి",
//     "లైంగిక వేధింపులు",
//     "స్వామీజీ",
//     "ఢిల్లీ పోలీస్",
//     "ఆగ్రా అరెస్టు",
//     "మోసం"
//   ],
//   "sourceUrl": "https://ndtv.com/latest-news/new-details-have-surfaced-in-the-probe-against-the-self-styled-godman-accused-of-sexual-harassing-over-a-dozen-women-at-an-ashram-in-delhi-police-have-recovered-several-chats-with-women-from-chaitanyananda-saraswatis-mobile-phone-exposing-his-predatory-nature",
//   "sourceName": "NDTV",
//   "parsedAt": "2025-09-30T06:52:25.000Z"
// }`;

  const [jsonInput, setJsonInput] = useState("");
  const [parsedData, setParsedData] = useState(null);

  const handleSave = () => {
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonInput);
      setParsedData(parsedJson); // Store for display
    } catch (error) {
      toast.error("Invalid JSON format. Please check your input.");
      console.error("JSON Parse Error:", error);
      return;
    }

    // Map fields from the parsed JSON to the expected backend schema
    const newPostPayload = {
      ...DEFAULT_POST_STATE,
      title: parsedJson.title || "",
      summary: parsedJson.summary || "",
      text: parsedJson.text || "",
      url: parsedJson.sourceUrl || "", // Map sourceUrl -> url
      source: parsedJson.sourceName || "Unknown", // Map sourceName -> source
      // categories: parsedJson.tags || [], // Map tags -> categories
      sourceType: parsedJson.sourceName ? "scraped" : "manual",
      // You can add more field mappings here if needed
    };

    const promise = fetch(`${API_BASE_URL}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPostPayload),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "An unknown error occurred.");
        return data;
      });

    toast.promise(promise, {
      loading: "Saving parsed post...",
      success: () => {
        setJsonInput(""); // Clear input on success
        setParsedData(null);
        return `Post "${newPostPayload.title}" created successfully!`;
      },
      error: (err) => `Error saving post: ${err.message}`,
    });
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        JSON Object Parser
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Paste a valid JSON object below. The tool will parse it and save it as
          a new post. Ensure the JSON structure matches the required fields
          (title, summary, text, etc.).
        </p>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows="15"
          className="w-full border rounded-lg p-3 font-mono text-sm bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Paste your JSON here..."
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={!jsonInput.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiZap size={16} /> Parse & Save Post
          </button>
        </div>
        {parsedData && (
          <div className="mt-6">
            <h2 className="font-semibold text-lg text-gray-800 mb-2">
              Last Parsed Data Preview
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
// --- END OF NEW COMPONENT ---

// --- PAGE COMPONENTS ---
const DashboardHomePage = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
      Dashboard Overview
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 font-semibold">Total Posts</h3>
        <p className="text-3xl font-bold">1,258</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 font-semibold">Published Today</h3>
        <p className="text-3xl font-bold">32</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 font-semibold">Scheduled</h3>
        <p className="text-3xl font-bold">4</p>
      </div>
    </div>
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">
        Posts per Day (Last 7 Days)
      </h3>
      <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Chart data would be displayed here.</p>
      </div>
    </div>
  </div>
);

const PostsListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingPost, setEditingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); // New state for gallery
  const [quickPostText, setQuickPostText] = useState("");
  const [isPublishingQuick, setIsPublishingQuick] = useState(false);
  const [filters, setFilters] = useState({ source: "", category: "" });
  const [allSources, setAllSources] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState(new Set());

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

  const fetchPosts = useCallback(async (pageNum, currentFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: POSTS_PER_PAGE,
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
        throw new Error(data.message || "Failed to fetch posts");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error("Error fetching posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page, filters);
    setSelectedPosts(new Set());
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

  const handleOpenModal = (post = null) => {
    setEditingPost(post || DEFAULT_POST_STATE);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  // New handler for setting image URL from the gallery
  const handleSetImageUrl = (url) => {
    setEditingPost((prev) => ({ ...prev, imageUrl: url }));
    setIsGalleryOpen(false);
  };

  const handleSave = async (postData) => {
    const isUpdating = !!postData._id;
    const url = isUpdating
      ? `${API_BASE_URL}/post/${postData._id}`
      : `${API_BASE_URL}/post`;
    const method = isUpdating ? "PUT" : "POST";
    const payload = {
      ...postData,
      relatedStories: postData.relatedStories?.map((story) => story._id) || [],
    };
    const promise = fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "An unknown error occurred.");
        return data;
      });
    toast.promise(promise, {
      loading: "Saving post...",
      success: () => {
        handleCloseModal();
        fetchPosts(page, filters);
        return `Post successfully ${isUpdating ? "updated" : "created"}!`;
      },
      error: (err) => `Error saving post: ${err.message}`,
    });
  };

  const handleDelete = async (postId) => {
    if (
      !window.confirm("Are you sure you want to delete this post permanently?")
    )
      return;
    const promise = fetch(`${API_BASE_URL}/post/${postId}`, {
      method: "DELETE",
    }).then((res) => {
      if (!res.ok) throw new Error("Delete failed");
    });
    toast.promise(promise, {
      loading: "Deleting post...",
      success: () => {
        fetchPosts(page, filters);
        return "Post deleted.";
      },
      error: (err) => err.message,
    });
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return toast.error("No posts selected.");
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedPosts.size} posts permanently?`
      )
    )
      return;
    const deletePromises = Array.from(selectedPosts).map((id) =>
      fetch(`${API_BASE_URL}/post/${id}`, { method: "DELETE" })
    );
    const promise = Promise.all(deletePromises);
    toast.promise(promise, {
      loading: "Deleting posts...",
      success: () => {
        fetchPosts(page, filters);
        return `${selectedPosts.size} posts deleted.`;
      },
      error: "Failed to delete some posts.",
    });
  };

  const handleToggleSelect = (postId) => {
    setSelectedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };
  const handleToggleSelectAll = () => {
    if (selectedPosts.size === posts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts.map((p) => p._id)));
    }
  };

  const handleQuickCreate = () => {
    if (!quickPostText.trim()) {
      toast.error("Please paste some text.");
      return;
    }
    const lines = quickPostText.trim().split("\n");
    const title = lines[0] || "";
    const summary = lines.slice(1).join("\n").trim();
    const newPost = {
      ...DEFAULT_POST_STATE,
      title,
      summary,
      text: summary,
      categories: ["Viral"],
    };
    handleOpenModal(newPost);
    setQuickPostText("");
  };

  const handleQuickPublish = () => {
    if (!quickPostText.trim()) {
      toast.error("Please paste some text to publish.");
      return;
    }
    setIsPublishingQuick(true);

    const lines = quickPostText.trim().split("\n");
    const title = lines[0] || "";
    const summary = lines.slice(1).join("\n").trim();

    const newPost = {
      ...DEFAULT_POST_STATE,
      title,
      summary,
      text: summary,
      categories: ["General"], // Default category
      isBreaking: true, // To signal the backend for a random image
      imageUrl: `https://m.media-amazon.com/images/I/71GHfGRuWJL._UF1000,1000_QL80_.jpg`, // Random image with timestamp to avoid caching
      type: "normal_post",
    };

    const promise = fetch(`${API_BASE_URL}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Publish failed.");
        return data;
      });

    toast
      .promise(promise, {
        loading: "Publishing post...",
        success: () => {
          setQuickPostText("");
          fetchPosts(page, filters);
          return `Post successfully published!`;
        },
        error: (err) => `Error: ${err.message}`,
      })
      .finally(() => setIsPublishingQuick(false));
  };

  // ✅ --- NEW: HANDLER FOR SENDING GLOBAL NOTIFICATION ---
  const handleSendGlobalNotification = async (postId, postTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to send a GLOBAL notification for "${postTitle}"?\n\nThis will alert ALL users.`
      )
    )
      return;

    const promise = fetch(`${API_BASE_URL}/admin/notify/post/${postId}`, {
      method: "POST",
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Failed to send notification.");
        return data;
      });

    toast.promise(promise, {
      loading: "Sending global notification...",
      success: (data) =>
        `Global alert for "${postTitle}" sent! Success: ${data.successCount}, Failed: ${data.failureCount}.`,
      error: (err) => err.message,
    });
  };

  const isFiltersApplied = filters.source || filters.category;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 hidden sm:block">
        Manage Posts
      </h1>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Quick Post Creator</h2>
        <p className="text-sm text-gray-500 mb-3">
          Paste text below (title on the first line). Then choose to edit before
          publishing or publish directly with default settings.
        </p>
        <textarea
          value={quickPostText}
          onChange={(e) => setQuickPostText(e.target.value)}
          rows="4"
          className="w-full border rounded-lg p-2 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="వైరల్ వీడియో: దంగల్ సీన్‌తో పాక్ జట్టుపై సెటైర్..."
        />
        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={handleQuickCreate}
            className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition-colors disabled:bg-gray-400"
            disabled={!quickPostText.trim() || isPublishingQuick}
          >
            Parse & Edit
          </button>
          <button
            onClick={handleQuickPublish}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors disabled:bg-indigo-400 flex items-center gap-2"
            disabled={!quickPostText.trim() || isPublishingQuick}
          >
            {isPublishingQuick ? (
              "Publishing..."
            ) : (
              <>
                <FiZap size={16} /> Publish Directly
              </>
            )}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-lg text-gray-800">All Posts</h3>
              {selectedPosts.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800"
                >
                  <FiTrash2 /> Delete ({selectedPosts.size})
                </button>
              )}
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              + Create Post
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <FiFilter className="text-gray-500" />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="border-gray-300 rounded-lg shadow-sm text-sm"
            >
              <option value="">All Categories</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              className="border-gray-300 rounded-lg shadow-sm text-sm"
            >
              <option value="">All Sources</option>
              {allSources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
            {isFiltersApplied && (
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="md:hidden">
            {loading ? (
              <div className="text-center p-8 text-gray-500">Loading...</div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="border-b p-4 space-y-2">
                  <p className="font-semibold text-gray-800">{post.title}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full font-medium">
                      {post.source}
                    </span>
                    <span className="font-medium">
                      {post.isPublished ? (
                        <span className="text-green-600">Published</span>
                      ) : (
                        <span className="text-red-600">Draft</span>
                      )}
                    </span>
                    <span className="text-gray-500">
                      {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {post.categories?.join(", ") || "No categories"}
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleOpenModal(post)}
                      className="px-3 py-1 rounded-md border font-semibold text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() =>
                        handleSendGlobalNotification(post._id, post.title)
                      }
                      className="px-3 py-1 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold text-sm flex items-center gap-1"
                      title="Send Global Alert"
                    >
                      <FiBell />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-3 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm"
                    >
                      <FiTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <table className="w-full text-left text-sm hidden md:table">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedPosts.size === posts.length && posts.length > 0
                    }
                    onChange={handleToggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Categories</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post._id}
                    className={`border-t hover:bg-gray-50 ${
                      selectedPosts.has(post._id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedPosts.has(post._id)}
                        onChange={() => handleToggleSelect(post._id)}
                      />
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      <p className="font-medium text-gray-800 truncate">
                        {post.title}
                      </p>
                      <p className="text-gray-500 truncate">{post.summary}</p>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      <span className="text-gray-600">
                        {post.categories?.join(", ") || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {post.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {post.isPublished ? (
                        <span className="text-green-600 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatTimeAgo(post.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(post)}
                          className="px-3 py-1 rounded-md border font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          {/* Edit */}
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="px-3 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          onClick={() =>
                            handleSendGlobalNotification(post._id, post.title)
                          }
                          className="px-3 py-1 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold"
                          title="Send Global Alert"
                        >
                          <FiBell />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center p-4 border-t">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <FiChevronLeft /> Prev
          </button>
          <span className="font-semibold text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <PostFormModal
          post={editingPost}
          onSave={handleSave}
          onClose={handleCloseModal}
          onOpenGallery={() => setIsGalleryOpen(true)} // Pass handler to open gallery
        />
      )}
      {isGalleryOpen && (
        <ImageGalleryModal
          onSelectImage={handleSetImageUrl}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </div>
  );
};

const SettingsPage = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
      Settings
    </h1>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">
        Manage Categories
      </h3>
      <p className="text-gray-600">
        Configuration management UI would be here.
      </p>
    </div>
  </div>
);

// --- IMAGE GALLERY MODAL COMPONENT ---
function ImageGalleryModal({ onSelectImage, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search
  const debouncedSearchQuery = useDebounce(searchQuery, 400); // Debounce search
  const IMAGES_PER_PAGE = 24;

  const fetchImages = useCallback(async (pageNum, query) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: IMAGES_PER_PAGE,
      });
      if (query) params.append("q", query); // Add search query

      const res = await fetch(`${API_BASE_URL}/images?${params.toString()}`);
      const data = await res.json();

      if (data.status === "success" && Array.isArray(data.images)) {
        setImages(data.images);
        setTotalPages(data.totalPages || 1);
      } else {
        setImages([]);
        setTotalPages(1);
        if (query) {
          toast.error(`No images found for "${query}"`);
        } else {
          toast.error("Image gallery data not available. Check backend API.");
        }
      }
    } catch (err) {
      console.error("Error fetching images for gallery:", err);
      toast.error("Failed to load image gallery.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to handle page changes OR debounced search query changes
  useEffect(() => {
    // If search query changes, reset to page 1 for new search results
    if (page === 1) {
      fetchImages(1, debouncedSearchQuery);
    } else {
      setPage(1);
    }
  }, [debouncedSearchQuery, fetchImages]);

  // Effect to handle page changes after search (if page != 1)
  useEffect(() => {
    fetchImages(page, debouncedSearchQuery);
  }, [page, fetchImages]);

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Select Image from Gallery
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl"
          >
            <FiXCircle />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by URL or title..."
              className="w-full border rounded-lg pl-10 pr-3 py-2"
            />
          </div>
        </div>
        {/* End Search Bar */}

        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading Images...
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {images.map((img) => (
                <div
                  key={img._id || img.imageUrl}
                  className="relative w-full aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer group"
                  onClick={() => onSelectImage(img.imageUrl)}
                  title={img.title || "Image"}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.title || "Gallery Image"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150?text=Error";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiCheck
                      size={30}
                      className="text-white bg-blue-600 rounded-full p-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No saved images found. Try adjusting your search or check the
              backend API '/api/images'.
            </div>
          )}
        </div>
        <div className="flex justify-between items-center p-4 border-t">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <FiChevronLeft /> Prev
          </button>
          <span className="font-semibold text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MODAL & FORM COMPONENT ---
function PostFormModal({ post, onSave, onClose, onOpenGallery }) {
  const [formData, setFormData] = useState(post);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    // Ensure post object is fully populated if coming from DB (relatedStories need titles)
    setFormData(post || DEFAULT_POST_STATE);
  }, [post]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (debouncedSearchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/posts/search?q=${debouncedSearchQuery}`
        );
        const data = await res.json();
        const currentRelatedIds = (formData.relatedStories || []).map(
          (s) => s._id
        );
        setSearchResults(
          data.filter(
            (p) => p._id !== formData._id && !currentRelatedIds.includes(p._id)
          )
        );
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    };
    fetchSearch();
  }, [debouncedSearchQuery, formData._id, formData.relatedStories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoriesChange = (category) => {
    const current = formData.categories || [];
    const newCategories = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setFormData((prev) => ({ ...prev, categories: newCategories }));
  };

  const handleAddRelated = (story) => {
    const updatedRelated = [...(formData.relatedStories || []), story];
    setFormData((prev) => ({ ...prev, relatedStories: updatedRelated }));
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveRelated = (storyId) => {
    const updatedRelated = (formData.relatedStories || []).filter(
      (s) => s._id !== storyId
    );
    setFormData((prev) => ({ ...prev, relatedStories: updatedRelated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const FormInput = memo(({ label, name, value, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        name={name}
        value={value || ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        {...props}
      />
    </div>
  ));

  const FormTextarea = memo(({ label, name, value, rows = 3 }) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        value={value || ""}
        onChange={handleChange}
        rows={rows}
        className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  ));

  const FormInputWithCopy = memo(
    ({ label, name, value, rows = 1, ...props }) => {
      const [isCopied, setIsCopied] = useState(false);
      const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        });
      };
      const InputComponent = rows > 1 ? "textarea" : "input";
      return (
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {label}
          </label>
          <div className="relative">
            <InputComponent
              name={name}
              value={value || ""}
              onChange={handleChange}
              rows={rows}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
              {...props}
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600"
            >
              {isCopied ? <FiCheck className="text-green-500" /> : <FiCopy />}
            </button>
          </div>
        </div>
      );
    }
  );

  const ImageUrlInput = () => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Image URL
      </label>
      <div className="flex gap-2">
        <input
          name="imageUrl"
          value={formData.imageUrl || ""}
          onChange={handleChange}
          className="flex-1 border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="https://..."
        />
        <button
          type="button"
          onClick={onOpenGallery}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-1"
          title="Select from saved images"
        >
          <FiImage size={18} />
          <span className="hidden sm:inline">Gallery</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full h-full max-w-4xl max-h-[95vh] rounded-xl shadow-2xl flex flex-col"
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {formData._id ? "Edit Post" : "Create New Post"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-5 overflow-y-auto">
          <FormInputWithCopy
            label="Title"
            name="title"
            value={formData.title}
            required
          />
          <FormInputWithCopy
            label="Summary"
            name="summary"
            value={formData.summary}
            rows={3}
          />
          <FormInputWithCopy
            label="Full Text / Content"
            name="text"
            value={formData.text}
            rows={6}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUrlInput /> {/* Replaced FormInput with new component */}
            <FormInput
              label="Video URL"
              name="videoUrl"
              value={formData.videoUrl}
              placeholder="https://..."
            />
            <FormInput
              label="Source URL"
              name="url"
              value={formData.url}
              placeholder="https://..."
            />
            <FormInput
              label="Twitter URL"
              name="twitterUrl"
              value={formData.twitterUrl}
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Source Name"
              name="source"
              value={formData.source}
              placeholder="e.g., NTV, Manual"
            />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Post Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              >
                <option value="full_post">Full Post</option>
                <option value="normal_post">Normal Post</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Categories
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoriesChange(cat)}
                  className={`px-3 py-1.5 text-sm rounded-full border-2 transition-colors ${
                    formData.categories?.includes(cat)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-gray-200 border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Schedule Publication
            </label>
            <input
              type="datetime-local"
              name="scheduledFor"
              value={
                formData.scheduledFor ? formData.scheduledFor.slice(0, 16) : ""
              }
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to publish immediately. Requires backend cron job to
              work.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-medium text-gray-600">
              Related Stories
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border space-y-2">
              {formData.relatedStories?.length > 0 ? (
                formData.relatedStories.map((story) => (
                  <div
                    key={story._id}
                    className="flex justify-between items-center bg-white p-2 rounded-md border"
                  >
                    <p className="text-sm text-gray-700 truncate">
                      {story.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveRelated(story._id)}
                    >
                      <FiXCircle className="text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center">
                  No related stories added yet.
                </p>
              )}
            </div>
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for posts to add..."
                className="w-full border rounded-lg pl-10 pr-3 py-2"
              />
            </div>
            {isSearching && (
              <p className="text-sm text-gray-500">Searching...</p>
            )}
            {searchResults.length > 0 && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result._id}
                    className="flex justify-between items-center p-2 border-b last:border-b-0"
                  >
                    <p className="text-sm text-gray-800 truncate">
                      {result.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddRelated(result)}
                    >
                      <FiPlusCircle className="text-green-600 hover:text-green-800 text-lg" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPublished" className="font-medium text-gray-700">
              Publish this post immediately
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-auto p-5 bg-gray-50 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border font-semibold text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
          >
            Save Post
          </button>
        </div>
      </form>
    </div>
  );
}
