import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { FiChevronLeft, FiChevronRight, FiFilter, FiTrash2, FiZap } from 'react-icons/fi';
import PostsTable from '../components/PostsTable';
import { API_BASE_URL, POSTS_PER_PAGE, ALL_CATEGORIES, DEFAULT_POST_STATE } from '../constants/config';

export default function PostsListPage({ onOpenModal }) {
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
      if (currentFilters.category) params.append("category", currentFilters.category);
      
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
    setSelectedPosts(new Set()); // Clear selection on page/filter change
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
    if (!quickPostText.trim()) return toast.error("Please paste some text.");
    const lines = quickPostText.trim().split("\n");
    const newPost = {
      ...DEFAULT_POST_STATE,
      title: lines[0] || "",
      summary: lines.slice(1).join("\n").trim(),
    };
    onOpenModal(newPost, () => fetchPosts(page, filters));
    setQuickPostText("");
  };
  
  const handleQuickPublish = () => {
     // TODO: Implement direct publish logic
     toast.error("Direct publish not yet implemented.");
  };

  const handleBulkDelete = () => {
    if (selectedPosts.size === 0) return toast.error("No posts selected.");
    if (!window.confirm(`Delete ${selectedPosts.size} posts permanently?`)) return;
    
    const deletePromises = Array.from(selectedPosts).map((id) =>
      fetch(`${API_BASE_URL}/post/${id}`, { method: "DELETE" })
    );

    toast.promise(Promise.all(deletePromises), {
      loading: "Deleting posts...",
      success: () => {
        fetchPosts(page, filters); // Refreshes the list
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
    if (selectedPosts.size === posts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts.map((p) => p._id)));
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Manage Posts</h1>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Quick Post Creator</h2>
        <textarea
          value={quickPostText}
          onChange={(e) => setQuickPostText(e.target.value)}
          rows="4"
          className="w-full border rounded-lg p-2 bg-gray-50"
          placeholder="Paste text here... Title on the first line."
        />
        <div className="flex justify-end gap-3 mt-3">
          <button onClick={handleQuickCreate} disabled={!quickPostText.trim()} className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold disabled:bg-gray-400">
            Parse & Edit
          </button>
          <button onClick={handleQuickPublish} disabled={!quickPostText.trim() || isPublishingQuick} className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-indigo-400 flex items-center gap-2">
            {isPublishingQuick ? "Publishing..." : <> <FiZap size={16} /> Publish Directly </>}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-lg">All Posts</h3>
              {selectedPosts.size > 0 && (
                <button onClick={handleBulkDelete} className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800">
                  <FiTrash2 /> Delete ({selectedPosts.size})
                </button>
              )}
            </div>
            <button onClick={() => onOpenModal(null, () => fetchPosts(page, filters))} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
              + Create Post
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <FiFilter className="text-gray-500" />
            <select name="category" value={filters.category} onChange={handleFilterChange} className="border-gray-300 rounded-lg text-sm">
              <option value="">All Categories</option>
              {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select name="source" value={filters.source} onChange={handleFilterChange} className="border-gray-300 rounded-lg text-sm">
              <option value="">All Sources</option>
              {allSources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {(filters.source || filters.category) && (
              <button onClick={clearFilters} className="text-sm font-semibold text-blue-600">Clear</button>
            )}
          </div>
        </div>
        <PostsTable posts={posts} loading={loading} onOpenModal={onOpenModal} onActionSuccess={() => fetchPosts(page, filters)} isStickyPage={false} selectedPosts={selectedPosts} onToggleSelect={handleToggleSelect} onToggleSelectAll={handleToggleSelectAll} />
        <div className="flex justify-between items-center p-4 border-t">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300">
            <FiChevronLeft /> Prev
          </button>
          <span className="font-semibold">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300">
            Next <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}