import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  FiLoader,
  FiCheck,
  FiX,
  FiSave,
  FiChevronRight,
  FiChevronLeft,
  FiInbox,
  FiCopy,
  FiSearch,
  FiGlobe, // Icon for Published state
} from "react-icons/fi";
import {
  API_BASE_URL,
  ALL_CATEGORIES,
  DEFAULT_POST_STATE,
} from "../constants/config";

// --- Helper Hook (Unchanged) ---
const useAutosizeTextArea = (textAreaRef, value) => {
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
};

// --- Updated PostEditorCard ---
function PostEditorCard({ post, setPost, onSave, onSkip, isSaving }) {
  const titleRef = useRef(null);
  const summaryRef = useRef(null);

  useAutosizeTextArea(titleRef, post.title);
  useAutosizeTextArea(summaryRef, post.summary);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 1. Logic for parsing Title/Summary on Paste
    if (name === "title" && value.includes("\n")) {
      const firstNewLineIndex = value.indexOf("\n");
      
      // Split text: First line is Title, the rest is Summary
      const extractedTitle = value.substring(0, firstNewLineIndex).trim();
      const extractedSummary = value.substring(firstNewLineIndex + 1).trim();

      setPost((prev) => ({
        ...prev,
        title: extractedTitle,
        // Append to existing summary if needed, or replace. Here we replace for clean pasting.
        summary: extractedSummary, 
      }));
      
      toast.success("Auto-formatted Title and Summary!");
      return;
    }

    // 2. Logic for Checkboxes and standard inputs
    const val = type === "checkbox" ? checked : value;
    setPost((prev) => ({ ...prev, [name]: val }));
  };

  const handleCategorySelect = (category) => {
    setPost((prev) => ({ ...prev, topCategory: category }));
  };

  const handleCopyAll = () => {
    const textToCopy = `${post.title}\n\n${post.summary}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(
        () => toast.success("Title and summary copied!"),
        (err) => toast.error("Failed to copy.")
      );
    } else {
      // Fallback
      toast.error("Clipboard API unavailable");
    }
  };

  const handleGoogleSearch = () => {
    if (!post.title && !post.url) {
      toast.error("Please add a title first to search.");
      return;
    }
    const query = post.imageSearchSlug ? post.imageSearchSlug : post.title;
    const encodedQuery = encodeURIComponent(query);
    window.open(
      `https://www.google.com/search?tbm=isch&q=${encodedQuery}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* --- Title Field --- */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-600"
          >
            Title
          </label>
          <button
            onClick={handleCopyAll}
            title="Copy title & summary"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
          >
            <FiCopy size={14} /> Copy All
          </button>
        </div>
        <textarea
          id="title"
          name="title"
          ref={titleRef}
          rows="1"
          value={post.title}
          onChange={handleInputChange}
          className="w-full text-lg font-bold border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 resize-none overflow-hidden"
          placeholder="Paste full text here to auto-split..."
        />
      </div>

      {/* --- Summary Field --- */}
      <div className="p-4">
        <label
          htmlFor="summary"
          className="block text-sm font-semibold text-gray-600 mb-1"
        >
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          ref={summaryRef}
          value={post.summary}
          onChange={handleInputChange}
          className="w-full h-auto border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 resize-none overflow-hidden"
          placeholder="Post Summary..."
          rows="5"
        />
      </div>

      {/* --- Image URL Field --- */}
      <div className="p-4 border-t">
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="imageUrl"
            className="block text-sm font-semibold text-gray-600"
          >
            Image URL
          </label>
          <button
            onClick={handleGoogleSearch}
            title="Search Google Images"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
          >
            <FiSearch size={14} /> Search
          </button>
        </div>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={post.imageUrl || ""}
          onChange={handleInputChange}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          placeholder="Paste image URL here..."
        />
        {post.imageUrl && (
          <div className="mt-3">
            <img
              src={post.imageUrl}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg bg-gray-100 border"
              onError={(e) => (e.target.style.display = "none")}
              onLoad={(e) => (e.target.style.display = "block")}
            />
          </div>
        )}
      </div>

      {/* --- NEW: Publishing Status --- */}
      <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              name="isPublished"
              checked={post.isPublished || false}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </div>
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <FiGlobe /> {post.isPublished ? "Published" : "Draft"}
          </span>
        </label>
      </div>

      {/* --- Category Selector --- */}
      <div className="p-4 border-t bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Category</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1 text-sm font-semibold rounded-full border-2
                ${
                  post.topCategory === cat
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- Admin Actions --- */}
      <div className="p-4 border-t grid grid-cols-2 gap-3 bg-gray-100">
        <button
          onClick={onSkip}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          <FiX /> Skip
        </button>
        <button
          onClick={onSave}
          disabled={isSaving || !post.topCategory}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-300"
        >
          {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
          Save
        </button>
      </div>
    </div>
  );
}

// --- Main Page Component (No logic changes required, kept for context) ---
export default function MobileSwiperPage() {
  const [postsToReview, setPostsToReview] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPost, setCurrentPost] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchPostList = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/posts?&limit=50&fields=_id`);
      const data = await res.json();
      if (data.status === "success" && data.posts.length > 0) {
        setPostsToReview(data.posts);
        setCurrentIndex(0);
        loadPost(data.posts[0]._id);
      } else if (data.status === "success") {
        setPostsToReview([]);
        setCurrentPost(null);
      } else {
        throw new Error(data.message || "Failed to fetch posts list");
      }
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  const loadPost = useCallback(async (postId) => {
    setIsLoadingPost(true);
    try {
      const res = await fetch(`${API_BASE_URL}/post/${postId}`);
      const data = await res.json();
      if (data.status === "success") {
        setCurrentPost({ ...DEFAULT_POST_STATE, ...data.post });
      } else {
        throw new Error(data.message || "Failed to load post");
      }
    } catch (err) {
      toast.error(err.message);
      loadNextPost();
    } finally {
      setIsLoadingPost(false);
    }
  }, []);

  const loadNextPost = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < postsToReview.length) {
      setCurrentIndex(nextIndex);
      loadPost(postsToReview[nextIndex]._id);
    } else {
      toast("End of list. Refetching for more...", { icon: "🔄" });
      fetchPostList();
    }
  }, [currentIndex, postsToReview, loadPost, fetchPostList]);

  const loadPrevPost = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
      loadPost(postsToReview[prevIndex]._id);
    } else {
      toast.error("This is the first post.");
    }
  };

  const handleSave = async () => {
    if (!currentPost) return;
    setIsSaving(true);

    const postData = currentPost;
    const promise = fetch(`${API_BASE_URL}/post/${postData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "An unknown error occurred.");
        return data;
      });

    toast
      .promise(promise, {
        loading: "Saving post...",
        success: () => {
          loadNextPost();
          return "Post saved!";
        },
        error: (err) => `Error: ${err.message}`,
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  useEffect(() => {
    fetchPostList();
  }, [fetchPostList]);

  const renderContent = () => {
    if (isLoadingList || (isLoadingPost && !currentPost)) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
          <FiLoader className="animate-spin text-4xl" />
          <p className="mt-2 font-semibold">Loading posts...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-500">
          <FiX className="text-4xl" />
          <p className="mt-2 font-semibold">Error: {error}</p>
          <button
            onClick={fetchPostList}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!currentPost) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
          <FiInbox className="text-6xl" />
          <p className="mt-4 text-xl font-semibold">All done!</p>
          <p className="text-sm">No uncategorized posts found.</p>
          <button
            onClick={fetchPostList}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Check for New Posts
          </button>
        </div>
      );
    }

    return (
      <PostEditorCard
        post={currentPost}
        setPost={setCurrentPost}
        onSave={handleSave}
        onSkip={loadNextPost}
        isSaving={isSaving}
      />
    );
  };

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        Post Swiper
      </h1>
      <p className="text-gray-600 mb-6">
        Quickly review, edit, and categorize posts.
      </p>

      <div className="flex justify-between items-center max-w-lg lg:max-w-3xl mx-auto mb-2">
        <button
          onClick={loadPrevPost}
          disabled={currentIndex === 0 || isLoadingPost || isSaving}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300"
        >
          <FiChevronLeft /> Prev
        </button>
        <span className="font-semibold text-gray-700">
          {postsToReview.length > 0
            ? `Post ${currentIndex + 1} of ${postsToReview.length}`
            : "No Posts"}
        </span>
        <button
          onClick={loadNextPost}
          disabled={
            currentIndex >= postsToReview.length - 1 ||
            isLoadingPost ||
            isSaving
          }
          className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300"
        >
          Next <FiChevronRight />
        </button>
      </div>

      <div className="max-w-lg lg:max-w-3xl mx-auto bg-gray-800 p-2 sm:p-4 rounded-2xl shadow-2xl">
        <div className="bg-gray-100 rounded-lg min-h-[75vh] flex flex-col">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
