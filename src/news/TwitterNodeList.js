import React, { useEffect, useState, useCallback, useRef } from "react";
import { FiHome, FiFileText, FiSettings, FiLogOut, FiBell, FiChevronLeft, FiChevronRight, FiSearch, FiPlusCircle, FiXCircle } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// --- CONFIGURATION ---
// const API_BASE_URL = "http://localhost:4000/api";
const API_BASE_URL = "https://twitterapi-node.onrender.com/api";
const POSTS_PER_PAGE = 10;
const ALL_CATEGORIES = [ "Politics", "Astrology", "Sports", "Entertainment", "Technology", "Business", "Education", "Health", "Science", "International", "National", "Crime", "Telangana", "AndhraPradesh", "Viral" ];

const DEFAULT_POST_STATE = {
    title: "", summary: "", text: "", url: "", imageUrl: "", videoUrl: "",
    source: "Manual", sourceType: "manual", categories: [], isPublished: true,
    type: "full_post", twitterUrl: "", relatedStories: [],
};


function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingPost, setEditingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickPostText, setQuickPostText] = useState("");

  const fetchPosts = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/posts?page=${pageNum}&limit=${POSTS_PER_PAGE}`);
      const data = await res.json();
      if (data.status === 'success') {
          setPosts(data.posts || []);
          setTotalPages(data.totalPages || 1);
      } else {
          throw new Error(data.message || "Failed to fetch posts");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingPost(post);
    } else {
      setEditingPost(DEFAULT_POST_STATE);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleSave = async (postData) => {
    const isUpdating = !!postData._id;
    const url = isUpdating ? `${API_BASE_URL}/post/${postData._id}` : `${API_BASE_URL}/post`;
    const method = isUpdating ? "PUT" : "POST";

    // ✅ Ensure relatedStories are sent as an array of IDs
    const payload = {
      ...postData,
      relatedStories: postData.relatedStories?.map(story => story._id) || []
    };

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.status === 'success') {
        alert(`Post successfully ${isUpdating ? 'updated' : 'created'}!`);
        handleCloseModal();
        fetchPosts(page);
      } else {
        throw new Error(result.error || "An unknown error occurred.");
      }
    } catch (err) {
      console.error("Error saving post:", err);
      alert("Error saving post: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post permanently?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/post/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.status === 'success') {
        alert("Post deleted.");
        fetchPosts(page);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting post: " + err.message);
    }
  };

  const handleQuickCreate = () => {
    if (!quickPostText.trim()) {
      alert("Please paste some text to create a post.");
      return;
    }
    const lines = quickPostText.trim().split('\n');
    const title = lines[0] || "";
    const summary = lines.slice(1).join('\n').trim();

    const newPost = { ...DEFAULT_POST_STATE, title, summary, text: summary, categories: ["Viral"] };
    handleOpenModal(newPost);
    setQuickPostText("");
  };
  
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-white shadow flex-col hidden md:flex">
        <div className="text-2xl font-bold p-4 border-b">NewsAdmin</div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded bg-blue-100 text-blue-700 font-semibold"><FiHome /> Dashboard</a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 w-full text-gray-600"><FiFileText /> Posts</a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 w-full text-gray-600"><FiSettings /> Settings</a>
        </nav>
        <div className="p-4 border-t">
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 w-full text-gray-600"><FiLogOut /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <input type="text" placeholder="Search..." className="border rounded-lg px-3 py-2 hidden sm:block" />
            <FiBell className="text-2xl text-gray-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="font-semibold text-gray-700 mb-3">Quick Post Creator</h2>
            <p className="text-sm text-gray-500 mb-3">Paste a news snippet below (title on the first line, summary after) and click "Create" to quickly open the post editor.</p>
            <textarea
                value={quickPostText}
                onChange={(e) => setQuickPostText(e.target.value)}
                rows="4"
                className="w-full border rounded-lg p-2 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="వైరల్ వీడియో: దంగల్ సీన్‌తో పాక్ జట్టుపై సెటైర్
ఇంటర్నెట్‌లో ఒక వీడియో తెగ వైరల్ అవుతోంది..."
            />
            <div className="text-right mt-3">
                <button
                    onClick={handleQuickCreate}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors disabled:bg-gray-400"
                    disabled={!quickPostText.trim()}
                >
                    Parse & Create Post
                </button>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold text-lg text-gray-800">Manage Posts</h3>
            <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
              + Create Post
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Categories</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? ( <tr><td colSpan="5" className="text-center p-8 text-gray-500">Loading...</td></tr> ) : 
                posts.map((post) => (
                  <tr key={post._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 max-w-sm"><p className="font-medium text-gray-800 truncate">{post.title}</p><p className="text-gray-500 truncate">{post.summary}</p></td>
                    <td className="px-4 py-3"><span className="text-gray-600">{post.categories?.join(", ") || "-"}</span></td>
                    <td className="px-4 py-3"><span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{post.source}</span></td>
                    <td className="px-4 py-3">{post.isPublished ? <span className="text-green-600 font-semibold">Yes</span> : <span className="text-red-600 font-semibold">No</span>}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(post)} className="px-3 py-1 rounded-md border font-semibold text-gray-700 hover:bg-gray-100">Edit</button>
                        <button onClick={() => handleDelete(post._id)} className="px-3 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 font-semibold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4 border-t">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-100"><FiChevronLeft /> Prev</button>
            <span className="font-semibold text-gray-700">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-100">Next <FiChevronRight /></button>
          </div>
        </div>
      </main>
      {isModalOpen && <PostFormModal post={editingPost} onSave={handleSave} onClose={handleCloseModal} />}
    </div>
  );
}

// --- HOOK FOR DEBOUNCING ---
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- MODAL & FORM COMPONENT ---
function PostFormModal({ post, onSave, onClose }) {
  const [formData, setFormData] = useState(post);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    // Ensure the form data is initialized correctly, especially for a new post
    setFormData(post || DEFAULT_POST_STATE);
  }, [post]);
  
  // Effect for fetching search results
  useEffect(() => {
    const fetchSearch = async () => {
      if (debouncedSearchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`${API_BASE_URL}/posts/search?q=${debouncedSearchQuery}`);
        const data = await res.json();
        // Filter out stories that are already related
        const currentRelatedIds = (formData.relatedStories || []).map(s => s._id);
        setSearchResults(data.filter(p => p._id !== formData._id && !currentRelatedIds.includes(p._id)));
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
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCategoriesChange = (category) => {
    const current = formData.categories || [];
    const newCategories = current.includes(category) ? current.filter(c => c !== category) : [...current, category];
    setFormData(prev => ({ ...prev, categories: newCategories }));
  };

  const handleAddRelated = (story) => {
    const updatedRelated = [...(formData.relatedStories || []), story];
    setFormData(prev => ({...prev, relatedStories: updatedRelated}));
    setSearchQuery(""); // Clear search
    setSearchResults([]); // Clear results
  };

  const handleRemoveRelated = (storyId) => {
    const updatedRelated = (formData.relatedStories || []).filter(s => s._id !== storyId);
    setFormData(prev => ({...prev, relatedStories: updatedRelated}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const FormInput = ({ label, name, value, ...props }) => (
    <div><label className="block text-sm font-medium text-gray-600 mb-1">{label}</label><input name={name} value={value || ''} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" {...props} /></div>
  );
  const FormTextarea = ({ label, name, value, rows = 3 }) => (
    <div><label className="block text-sm font-medium text-gray-600 mb-1">{label}</label><textarea name={name} value={value || ''} onChange={handleChange} rows={rows} className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white w-full h-full max-w-4xl max-h-[95vh] rounded-xl shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-5 border-b"><h2 className="text-2xl font-bold text-gray-800">{formData._id ? "Edit Post" : "Create New Post"}</h2><button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button></div>
        <div className="p-6 space-y-5 overflow-y-auto">
          <FormInput label="Title" name="title" value={formData.title} required />
          <FormTextarea label="Summary" name="summary" value={formData.summary} rows={3} />
          <FormTextarea label="Full Text / Content" name="text" value={formData.text} rows={6} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Image URL" name="imageUrl" value={formData.imageUrl} placeholder="https://..." /><FormInput label="Video URL" name="videoUrl" value={formData.videoUrl} placeholder="https://..." /><FormInput label="Source URL" name="url" value={formData.url} placeholder="https://..." /><FormInput label="Twitter URL" name="twitterUrl" value={formData.twitterUrl} placeholder="https://..." /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Source Name" name="source" value={formData.source} placeholder="e.g., NTV, Manual" /><div><label className="block text-sm font-medium text-gray-600 mb-1">Post Type</label><select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-gray-50"><option value="full_post">Full Post</option><option value="normal_post">Normal Post</option></select></div></div>
          <div><label className="block text-sm font-medium text-gray-600 mb-2">Categories</label><div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">{ALL_CATEGORIES.map(cat => (<button type="button" key={cat} onClick={() => handleCategoriesChange(cat)} className={`px-3 py-1.5 text-sm rounded-full border-2 transition-colors ${formData.categories?.includes(cat) ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-200 border-gray-300"}`}>{cat}</button>))}</div></div>
          
          {/* ✅ NEW: Related Stories Section */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-medium text-gray-600">Related Stories</label>
            <div className="p-3 bg-gray-50 rounded-lg border space-y-2">
              {formData.relatedStories?.length > 0 ? (
                formData.relatedStories.map(story => (
                  <div key={story._id} className="flex justify-between items-center bg-white p-2 rounded-md border">
                    <p className="text-sm text-gray-700 truncate">{story.title}</p>
                    <button type="button" onClick={() => handleRemoveRelated(story._id)}><FiXCircle className="text-red-500 hover:text-red-700"/></button>
                  </div>
                ))
              ) : <p className="text-sm text-gray-400 text-center">No related stories added yet.</p>}
            </div>
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for posts to add..." className="w-full border rounded-lg pl-10 pr-3 py-2" />
            </div>
            {isSearching && <p className="text-sm text-gray-500">Searching...</p>}
            {searchResults.length > 0 && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {searchResults.map(result => (
                  <div key={result._id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                    <p className="text-sm text-gray-800 truncate">{result.title}</p>
                    <button type="button" onClick={() => handleAddRelated(result)}><FiPlusCircle className="text-green-600 hover:text-green-800 text-lg"/></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2"><input type="checkbox" id="isPublished" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><label htmlFor="isPublished" className="font-medium text-gray-700">Publish this post immediately</label></div>
        </div>
        <div className="flex justify-end gap-3 mt-auto p-5 bg-gray-50 border-t"><button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border font-semibold text-gray-700 hover:bg-gray-200">Cancel</button><button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold">Save Post</button></div>
      </form>
    </div>
  );
}

export default AdminDashboard;