import React, { useEffect, useState, useCallback, memo } from "react";
import {
  FiColumns, FiPlusCircle, FiXCircle, FiCheck, FiMenu, FiImage,
  FiEdit, FiBookmark, FiLink, FiLoader, FiSettings
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

// --- CONFIGURATION ---
// const API_BASE_URL = "http://localhost:4000/api";
const API_BASE_URL = "https://twitterapi-node.onrender.com/api";
const POSTS_PER_SOURCE_COLUMN = 15;
const RECENT_POST_MINUTES = 59; // Articles newer than this (in minutes) get a "Latest" tag
const DEFAULT_POST_STATE = {
  title: "", summary: "", text: "", url: "", imageUrl: "", videoUrl: "", source: "Manual",
  lang: "te", sourceType: "manual", categories: [], tags: [], isPublished: true, isBreaking: false,
  type: "normal_post", twitterUrl: "", relatedStories: [], scheduledFor: null, pinnedIndex: null,
};

// --- HELPERS ---
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

// 👇 NEW HELPER FUNCTION TO CHECK IF POST IS RECENT 👇
const isRecent = (dateString) => {
    if (!dateString) return false;
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);
    return diffInMinutes < RECENT_POST_MINUTES;
};
// 👆 END OF NEW HELPER FUNCTION 👆


// --- MAIN PAGE COMPONENT ---
export default function SourceColumnsPage() {
  const [allSources, setAllSources] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [onSaveSuccessCallback, setOnSaveSuccessCallback] = useState(null);

  const [selectedSources, setSelectedSources] = useState(() => {
    try {
      const saved = localStorage.getItem("selectedNewsSources");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse selected sources from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("selectedNewsSources", JSON.stringify(selectedSources));
  }, [selectedSources]);
  
  useEffect(() => {
    const fetchAllSources = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sources`);
        const data = await res.json();
        if (data.status === 'success') {
          setAllSources(data.sources.sort());
        } else {
          throw new Error(data.message || 'Failed to fetch sources');
        }
      } catch (err) {
        toast.error(`Error: ${err.message}`);
      }
    };
    fetchAllSources();
  }, []);

  const handleSourceToggle = (sourceName) => {
    setSelectedSources(prev =>
      prev.includes(sourceName)
        ? prev.filter(s => s !== sourceName)
        : [...prev, sourceName]
    );
  };
  
  const handleOpenModal = (post = null, onSaveSuccess = () => {}) => {
    if (post && post._id) {
      setEditingPost({ ...DEFAULT_POST_STATE, ...post });
      setIsModalOpen(true);
      setOnSaveSuccessCallback(() => onSaveSuccess);
      fetch(`${API_BASE_URL}/post/${post._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") setEditingPost((p) => ({ ...p, ...data.post }));
        })
        .catch((err) => toast.error("Could not load latest post details."));
    } else {
      setEditingPost(post ? { ...DEFAULT_POST_STATE, ...post } : DEFAULT_POST_STATE);
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
    const url = isUpdating ? `${API_BASE_URL}/post/${postData._id}` : `${API_BASE_URL}/post`;
    const method = isUpdating ? "PUT" : "POST";
    const promise = fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(postData) })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => { if (!ok) throw new Error(data.error || "An error occurred."); return data; });
      
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

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
      <div className="flex h-screen bg-gray-100 font-sans">
        <SourceSelectorSidebar
          allSources={allSources}
          selectedSources={selectedSources}
          onSourceToggle={handleSourceToggle}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header onOpenModal={handleOpenModal} />
          <div className="flex-1 overflow-hidden p-2 md:p-4">
            <SourceColumnView onOpenModal={handleOpenModal} selectedSources={selectedSources} />
          </div>
        </main>
      </div>
      {isModalOpen && <PostFormModal post={editingPost} onSave={handleSave} onClose={handleCloseModal} onOpenGallery={() => setIsGalleryOpen(true)}/>}
      {isGalleryOpen && <ImageGalleryModal onSelectImage={handleSetImageUrl} onClose={() => setIsGalleryOpen(false)}/>}
    </>
  );
}

// --- PAGE SUB-COMPONENTS ---

const Header = ({ onOpenModal }) => (
  <header className="flex-shrink-0 bg-white shadow-sm p-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <FiColumns className="text-xl text-gray-700" />
      <h1 className="text-xl font-bold text-gray-800">Source Feed</h1>
    </div>
    <button onClick={() => onOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
      <FiPlusCircle /> Create Post
    </button>
  </header>
);

const SourceSelectorSidebar = ({ allSources, selectedSources, onSourceToggle }) => {
  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col flex-shrink-0 h-screen">
      <div className="text-lg font-bold p-4 border-b flex items-center gap-3">
        <FiSettings />
        <span>Display Sources</span>
      </div>
      <div className="overflow-y-auto flex-1">
        {allSources.length > 0 ? (
          allSources.map(source => (
            <label key={source} className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selectedSources.includes(source)}
                onChange={() => onSourceToggle(source)}
              />
              <span className="text-gray-700 font-medium select-none">{source}</span>
            </label>
          ))
        ) : (
          <div className="p-4 text-sm text-gray-500">Loading sources...</div>
        )}
      </div>
    </aside>
  );
};

const SourceColumnView = ({ onOpenModal, selectedSources }) => {
  if (selectedSources.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow m-auto">
        <h3 className="text-xl font-bold text-gray-700">No sources selected</h3>
        <p className="text-gray-500 mt-2">Select one or more sources from the sidebar to begin.</p>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full gap-4 overflow-x-auto pb-4">
      {selectedSources.map(source => (
        <SourceColumn key={source} sourceName={source} onOpenModal={onOpenModal} />
      ))}
    </div>
  );
};

const SourceColumn = ({ sourceName, onOpenModal }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchData = useCallback(async (pageNum) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/posts/source/${encodeURIComponent(sourceName)}?page=${pageNum}&limit=${POSTS_PER_SOURCE_COLUMN}`);
      const data = await res.json();
      if (data.status === 'success') {
        setPosts(prev => pageNum === 1 ? data.posts : [...prev, ...data.posts]);
        setHasMore(data.hasMore);
      } else { throw new Error(data.message); }
    } catch (err) {
      toast.error(`Error for ${sourceName}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [sourceName]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  };
  
  const onActionSuccess = () => {
    setPage(1);
    fetchData(1);
  };

  return (
    <div className="flex flex-col flex-shrink-0 w-80 h-full bg-white rounded-lg shadow">
      <h2 className="p-3 text-lg font-bold text-gray-800 border-b flex-shrink-0">{sourceName}</h2>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading && page === 1 ? (
          <div className="flex justify-center items-center h-full"><FiLoader className="animate-spin text-gray-400" size={24}/></div>
        ) : posts.map(post => (
          <button key={post._id} onClick={() => onOpenModal(post, onActionSuccess)}
              className="w-full text-left p-2.5 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-blue-100 focus:ring-2 focus:ring-blue-500">
              
              {/* 👇 UPDATED SECTION WITH LATEST TAG 👇 */}
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-gray-700 leading-snug flex-1">{post.title}</p>
                {isRecent(post.createdAt) && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        LATEST
                    </span>
                )}
              </div>
              <p className="text-xs text-gray-400">{formatTimeAgo(post.createdAt)}</p>
              {/* 👆 END OF UPDATED SECTION 👆 */}

          </button>
        ))}
        {isLoading && page > 1 && <p className="text-center text-sm text-gray-500 p-2">Loading...</p>}
      </div>
      {hasMore && (
        <div className="p-2 border-t">
          <button onClick={handleLoadMore} disabled={isLoading}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50">
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

// --- MODAL & FORM COMPONENTS ---
function PostFormModal({ post, onSave, onClose, onOpenGallery }) {
  const [formData, setFormData] = useState(DEFAULT_POST_STATE);
  
  useEffect(() => {
    const initialData = post ? { ...DEFAULT_POST_STATE, ...post } : DEFAULT_POST_STATE;
    setFormData(initialData);
  }, [post]);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-4xl max-h-[95vh] rounded-xl flex flex-col">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">{formData._id ? "Edit Post" : "Create Post"}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl"><FiXCircle /></button>
        </div>
        <div className="p-6 space-y-5 overflow-y-auto">
          <FormInput label="Title" name="title" value={formData.title} onChange={handleChange} required />
          <FormTextarea label="Summary" name="summary" value={formData.summary} onChange={handleChange} rows={3} />
          <div className="grid md:grid-cols-2 gap-4">
            <ImageUrlInput value={formData.imageUrl || ""} onChange={handleChange} onOpenGallery={onOpenGallery} />
            <UrlInputWithLink label="Source URL" name="url" value={formData.url || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-auto p-5 bg-gray-50 border-t">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border font-semibold">Cancel</button>
          <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold">Save Post</button>
        </div>
      </form>
    </div>
  );
}
const FormInput = memo(({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500" {...props} />
  </div>
));
const FormTextarea = memo(({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <textarea className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500" {...props} />
  </div>
));
const UrlInputWithLink = memo(({ label, value, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className="flex items-center gap-2">
      <input value={value} className="flex-1 w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500" {...props} />
      {value && (
        <a href={value} target="_blank" rel="noopener noreferrer" title="Open link in new tab" className="p-2.5 text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-100 rounded-lg">
          <FiLink />
        </a>
      )}
    </div>
  </div>
));
const ImageUrlInput = ({ value, onChange, onOpenGallery }) => (
  <div>
    <label className="block text-sm font-medium mb-1">Image URL</label>
    <div className="flex gap-2">
      <input name="imageUrl" value={value || ""} onChange={onChange} className="flex-1 border rounded-lg px-3 py-2 bg-gray-50" placeholder="https://..." />
      <button type="button" onClick={onOpenGallery} className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1">
        <FiImage size={18} />
        <span className="hidden sm:inline">Gallery</span>
      </button>
    </div>
  </div>
);
function ImageGalleryModal({ onSelectImage, onClose }) {
  const [images, setImages] = useState([]);
  useEffect(() => { async function fetchImages() { try { const res = await fetch(`${API_BASE_URL}/images?limit=100`); const data = await res.json(); if (data.status === "success") setImages(data.images); } catch (e) { toast.error("Failed to load images."); } } fetchImages(); }, []);
  return ( <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"> <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl flex flex-col"> <div className="p-5 border-b flex justify-between items-center"> <h2 className="text-2xl font-bold">Select Image</h2> <button type="button" onClick={onClose}><FiXCircle /></button> </div> <div className="flex-1 p-4 overflow-y-auto"> <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3"> {images.map((img) => ( <div key={img._id} className="relative w-full aspect-square rounded-lg cursor-pointer group" onClick={() => onSelectImage(img.imageUrl)} > <img src={img.imageUrl} alt={img.title || ""} className="w-full h-full object-cover group-hover:scale-105" /> <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100"> <FiCheck size={30} className="text-white bg-blue-600 rounded-full p-1" /> </div> </div> ))} </div> </div> </div> </div> );
}
