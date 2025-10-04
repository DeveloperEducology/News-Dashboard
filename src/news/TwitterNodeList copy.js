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
// const API_BASE_URL = "https://twitterapi-node.onrender.com/api";
const API_BASE_URL = "http://localhost:4000/api";
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
  const [editingPost, setEditingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [onSaveSuccessCallback, setOnSaveSuccessCallback] = useState(null);

  // ✅ REPLACED: This version opens the modal instantly for a better user experience.
  const handleOpenModal = (post = null, onSaveSuccess = () => {}) => {
    if (post && post._id) {
      // --- For an existing post ---
      // 1. Open the modal immediately with the data we already have.
      setEditingPost({ ...DEFAULT_POST_STATE, ...post });
      setIsModalOpen(true);
      setOnSaveSuccessCallback(() => onSaveSuccess);

      // 2. In the background, fetch the latest, fully-detailed version.
      fetch(`${API_BASE_URL}/post/${post._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            // 3. Silently update the form if the fetched data is different.
            setEditingPost((prevPost) => ({ ...prevPost, ...data.post }));
          } else {
            throw new Error("Failed to refresh post details.");
          }
        })
        .catch((err) => {
          console.error("Background fetch failed:", err);
          toast.error("Could not load latest post details.");
        });
    } else {
      // --- For a new post ---
      setEditingPost(DEFAULT_POST_STATE);
      setOnSaveSuccessCallback(() => onSaveSuccess);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setOnSaveSuccessCallback(null);
  };

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
        if (onSaveSuccessCallback) onSaveSuccessCallback();
        return `Post successfully ${isUpdating ? "updated" : "created"}!`;
      },
      error: (err) => `Error saving post: ${err.message}`,
    });
  };

  const renderView = () => {
    switch (view) {
      case "posts":
        return <PostsListPage onOpenModal={handleOpenModal} />;
      case "sticky-posts":
        return <StickyPostsPage onOpenModal={handleOpenModal} />;
      case "fetch-tweet":
        return <FetchTweetPage onOpenModal={handleOpenModal} />;
      case "json-parser":
        return <JsonParserPage />;
      case "settings":
        return <SettingsPage />;
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

// --- PAGE COMPONENTS ---
const DashboardHomePage = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
      Dashboard
    </h1>
  </div>
);
const JsonParserPage = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
      JSON Parser
    </h1>
  </div>
);
const FetchTweetPage = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
      Fetch from Tweet
    </h1>
  </div>
);
const SettingsPage = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
      Settings
    </h1>
  </div>
);

// --- POSTS LIST PAGE ---
const PostsListPage = ({ onOpenModal }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ source: "", category: "" });
  const [allSources, setAllSources] = useState([]);

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
        throw new Error(data.message || "Failed to fetch posts");
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
  }, [page, filters, fetchPosts]);

  const handleFilterChange = (e) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters({ source: "", category: "" });
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Manage Posts
      </h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-800">
              All Regular Posts
            </h3>
            <button
              onClick={() => onOpenModal(null, () => fetchPosts(page, filters))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
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
            {(filters.source || filters.category) && (
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <PostsTable
          posts={posts}
          loading={loading}
          onOpenModal={onOpenModal}
          onActionSuccess={() => fetchPosts(page, filters)}
          isStickyPage={false}
        />
        <div className="flex justify-between items-center p-4 border-t">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300 hover:bg-gray-100"
          >
            <FiChevronLeft /> Prev
          </button>
          <span className="font-semibold text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300 hover:bg-gray-100"
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- STICKY POSTS PAGE ---
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
        throw new Error(data.message || "Failed to fetch sticky posts");
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
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Sticky Posts
      </h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg text-gray-800">
            All Pinned Items
          </h3>
          <p className="text-sm text-gray-500">
            Posts fixed to the top of the feed, sorted by position.
          </p>
        </div>
        <PostsTable
          posts={posts}
          loading={loading}
          onOpenModal={onOpenModal}
          onActionSuccess={fetchStickyPosts}
          isStickyPage={true}
        />
      </div>
    </div>
  );
};

// --- REUSABLE POSTS TABLE COMPONENT ---
const PostsTable = ({
  posts,
  loading,
  onOpenModal,
  onActionSuccess,
  isStickyPage,
}) => {
  const handlePinToggle = (post) => {
    const isCurrentlyPinned =
      post.pinnedIndex !== null && post.pinnedIndex > -1;
    if (isCurrentlyPinned) {
      if (window.confirm(`Are you sure you want to unpin "${post.title}"?`)) {
        performUpdate({ ...post, pinnedIndex: null });
      }
    } else {
      const positionStr = window.prompt(
        "Enter pin position (e.g., 1, 2, 3...)."
      );
      if (positionStr) {
        const position = parseInt(positionStr, 10);
        if (!isNaN(position) && position > 0) {
          performUpdate({ ...post, pinnedIndex: position - 1 });
        } else {
          toast.error("Invalid position. Please enter a positive number.");
        }
      }
    }
  };

  const performUpdate = (updatedPost) => {
    const promise = fetch(`${API_BASE_URL}/post/${updatedPost._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    }).then((res) => {
      if (!res.ok) throw new Error("Update failed.");
    });
    toast.promise(promise, {
      loading: "Updating pin status...",
      success: () => {
        onActionSuccess();
        return "Post pin status updated!";
      },
      error: (err) => `Error: ${err.message}`,
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
        onActionSuccess();
        return "Post deleted.";
      },
      error: (err) => err.message,
    });
  };

  const handleSendGlobalNotification = async (postId, postTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to send a GLOBAL notification for "${postTitle}"?`
      )
    )
      return;
    const promise = fetch(`${API_BASE_URL}/admin/notify/post/${postId}`, {
      method: "POST",
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Failed.");
        return data;
      });
    toast.promise(promise, {
      loading: "Sending global notification...",
      success: (data) =>
        `Alert sent successfully! Success: ${data.successCount}, Failed: ${data.failureCount}.`,
      error: (err) => err.message,
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            {isStickyPage && <th className="px-4 py-3 w-16">Pos</th>}
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Categories</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={isStickyPage ? 6 : 5}
                className="text-center p-8 text-gray-500"
              >
                Loading...
              </td>
            </tr>
          ) : posts.length === 0 ? (
            <tr>
              <td
                colSpan={isStickyPage ? 6 : 5}
                className="text-center p-8 text-gray-500"
              >
                No posts found.
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post._id} className="border-t hover:bg-gray-50">
                {isStickyPage && (
                  <td className="px-4 py-3 font-bold text-lg text-blue-600">
                    #{post.pinnedIndex + 1}
                  </td>
                )}
                <td className="px-4 py-3 max-w-sm">
                  <p className="font-medium text-gray-800 truncate">
                    {post.title}
                  </p>
                </td>
                <td className="px-4 py-3 max-w-xs truncate">
                  {post.categories?.join(", ") || "-"}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {post.source}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {formatTimeAgo(post.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
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
                    )}
                    <button
                      onClick={() => onOpenModal(post, onActionSuccess)}
                      className="p-2 rounded-md border font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      onClick={() =>
                        handleSendGlobalNotification(post._id, post.title)
                      }
                      className="p-2 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
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
  );
};

// --- REUSABLE MODAL & FORM COMPONENTS ---

function PostFormModal({ post, onSave, onClose, onOpenGallery }) {
  const [formData, setFormData] = useState(post);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setFormData(post || DEFAULT_POST_STATE);
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

  const handleTagChange = (e) => setTagInput(e.target.value);

  const handleAddTag = (e) => {
    if ((e.key === "Enter" || e.type === "blur") && tagInput.trim()) {
      e.preventDefault();
      const newTags = new Set([
        ...(formData.tags || []),
        tagInput.trim().toLowerCase(),
      ]);
      setFormData((prev) => ({ ...prev, tags: Array.from(newTags) }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }));
  };

  // ✅ NEW: Handler to remove a related story
  const handleRemoveRelatedStory = (storyIdToRemove) => {
    setFormData((prev) => ({
      ...prev,
      relatedStories: (prev.relatedStories || []).filter(
        (story) => story._id !== storyIdToRemove
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

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
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <FormTextarea
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={3}
          />
          <FormTextarea
            label="Full Text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            rows={5}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUrlInput
              value={formData.imageUrl}
              onChange={handleChange}
              onOpenGallery={onOpenGallery}
            />
            <FormInput
              label="Video URL"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
            />
            <FormInput
              label="Source URL"
              name="url"
              value={formData.url}
              onChange={handleChange}
            />
            <FormInput
              label="Twitter URL"
              name="twitterUrl"
              value={formData.twitterUrl}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Source Name"
              name="source"
              value={formData.source}
              onChange={handleChange}
            />
            <FormSelect
              label="Language"
              name="lang"
              value={formData.lang}
              onChange={handleChange}
              options={["te", "en"]}
            />
            <FormSelect
              label="Source Type"
              name="sourceType"
              value={formData.sourceType}
              onChange={handleChange}
              options={["manual", "rss", "tweet_api"]}
            />
            <FormSelect
              label="Post Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={POST_TYPES}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tags
            </label>
            <div className="p-2 bg-gray-50 rounded-lg border flex flex-wrap gap-2 items-center">
              {(formData.tags || []).map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full"
                >
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>
                    <FiX size={14} />
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={handleTagChange}
                onKeyDown={handleAddTag}
                onBlur={handleAddTag}
                placeholder="Add a tag and press Enter"
                className="flex-1 bg-transparent focus:outline-none p-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use 'link:your-topic' for manual linking of related stories.
            </p>
          </div>

          {/* ✅ NEW: Related Stories Preview Section */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Related Stories (Include/Exclude)
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border min-h-[60px]">
              {!formData.relatedStories ||
              formData.relatedStories.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No related stories linked yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {formData.relatedStories.map((story) => (
                    <div
                      key={story._id}
                      className="flex items-center justify-between bg-white p-2 border rounded-md"
                    >
                      <p className="text-sm text-gray-800 truncate pr-2">
                        {story.title}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveRelatedStory(story._id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                        title="Exclude Story"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                  className={`px-3 py-1.5 text-sm rounded-full border-2 ${
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <FormInput
              type="datetime-local"
              label="Schedule Publication"
              name="scheduledFor"
              value={
                formData.scheduledFor ? formData.scheduledFor.slice(0, 16) : ""
              }
              onChange={handleChange}
            />
            <FormInput
              type="number"
              label="Pin to Position"
              name="pinnedIndex"
              placeholder="Leave blank to unpin"
              value={
                formData.pinnedIndex !== null ? formData.pinnedIndex + 1 : ""
              }
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  pinnedIndex:
                    e.target.value === ""
                      ? null
                      : Math.max(0, parseInt(e.target.value, 10) - 1),
                }));
              }}
              min="1"
            />
          </div>

          <div className="flex items-center gap-x-6 pt-2">
            <FormCheckbox
              label="Publish"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            <FormCheckbox
              label="Breaking News"
              name="isBreaking"
              checked={formData.isBreaking}
              onChange={handleChange}
            />
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

const FormInput = memo(({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      {...props}
    />
  </div>
));

const FormTextarea = memo(({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <textarea
      className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      {...props}
    />
  </div>
));

const FormSelect = memo(({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <select
      className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      {...props}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </option>
      ))}
    </select>
  </div>
));

const FormCheckbox = memo(({ label, ...props }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id={props.name}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      {...props}
    />
    <label htmlFor={props.name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
  </div>
));

const ImageUrlInput = ({ value, onChange, onOpenGallery }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Image URL
    </label>
    <div className="flex gap-2">
      <input
        name="imageUrl"
        value={value || ""}
        onChange={onChange}
        className="flex-1 border rounded-lg px-3 py-2 bg-gray-50"
        placeholder="https://..."
      />
      <button
        type="button"
        onClick={onOpenGallery}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-1"
        title="Select from saved images"
      >
        <FiImage size={18} />
        <span className="hidden sm:inline">Gallery</span>
      </button>
    </div>
  </div>
);

function ImageGalleryModal({ onSelectImage, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/images?page=1&limit=100`);
        const data = await res.json();
        if (data.status === "success") setImages(data.images);
      } catch (e) {
        toast.error("Failed to load images.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);
  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Select Image</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl"
          >
            <FiXCircle />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {images.map((img) => (
                <div
                  key={img._id}
                  className="relative w-full aspect-square overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => onSelectImage(img.imageUrl)}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.title || "Gallery Image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <FiCheck
                      size={30}
                      className="text-white bg-blue-600 rounded-full p-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
