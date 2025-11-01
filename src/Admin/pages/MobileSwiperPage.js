import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { FiLoader, FiCheck, FiX, FiSave, FiChevronRight, FiChevronLeft, FiInbox } from 'react-icons/fi';
import { API_BASE_URL, ALL_CATEGORIES, DEFAULT_POST_STATE } from '../constants/config';

// This component will hold the editable post card
function PostEditorCard({ post, setPost, onSave, onSkip, isSaving }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category) => {
    setPost((prev) => ({ ...prev, category }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-full overflow-hidden">
      {/* --- Title Field --- */}
      <div className="p-4 border-b">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-600 mb-1">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={post.title}
          onChange={handleInputChange}
          className="w-full text-lg font-bold border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          placeholder="Post Title"
        />
      </div>

      {/* --- Summary Field --- */}
      <div className="p-4 flex-1 flex flex-col overflow-y-auto">
        <label htmlFor="summary" className="block text-sm font-semibold text-gray-600 mb-1">Summary</label>
        <textarea
          id="summary"
          name="summary"
          value={post.summary}
          onChange={handleInputChange}
          className="w-full h-full flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Post Summary..."
        />
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
                ${post.category === cat
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
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
          disabled={isSaving || !post.category}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-300"
        >
          {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
          Save
        </button>
      </div>
    </div>
  );
}

// Main page component
export default function MobileSwiperPage() {
  const [postsToReview, setPostsToReview] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPost, setCurrentPost] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the list of posts that need review (e.g., uncategorized)
  const fetchPostList = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      // Fetches posts that have category "Uncategorized" or empty
      const res = await fetch(`${API_BASE_URL}/posts?&limit=50&fields=_id`);
      const data = await res.json();
      if (data.status === 'success' && data.posts.length > 0) {
        setPostsToReview(data.posts);
        setCurrentIndex(0);
        loadPost(data.posts[0]._id);
      } else if (data.status === 'success') {
        setPostsToReview([]);
        setCurrentPost(null);
      } else {
        throw new Error(data.message || 'Failed to fetch posts list');
      }
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  // Load the full details for a specific post
  const loadPost = useCallback(async (postId) => {
    setIsLoadingPost(true);
    try {
      const res = await fetch(`${API_BASE_URL}/post/${postId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setCurrentPost({ ...DEFAULT_POST_STATE, ...data.post });
      } else {
        throw new Error(data.message || 'Failed to load post');
      }
    } catch (err) {
      toast.error(err.message);
      loadNextPost(); // Skip if it fails to load
    } finally {
      setIsLoadingPost(false);
    }
  }, []); // 'loadNextPost' is not stable, but it's okay for this logic

  // Move to the next post in the list
  const loadNextPost = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < postsToReview.length) {
      setCurrentIndex(nextIndex);
      loadPost(postsToReview[nextIndex]._id);
    } else {
      // Reached the end, check for more
      toast('End of list. Refetching for more...', { icon: '🔄' });
      fetchPostList();
    }
  }, [currentIndex, postsToReview, loadPost, fetchPostList]);
  
  // Move to the previous post
  const loadPrevPost = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
      loadPost(postsToReview[prevIndex]._id);
    } else {
      toast.error("This is the first post.");
    }
  };

  // Save changes to the current post
  const handleSave = async () => {
    if (!currentPost) return;
    setIsSaving(true);

    const postData = currentPost;
    const promise = fetch(`${API_BASE_URL}/post/${postData._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'An unknown error occurred.');
        return data;
      });

    toast.promise(promise, {
      loading: 'Saving post...',
      success: () => {
        loadNextPost();
        return 'Post saved!';
      },
      error: (err) => `Error: ${err.message}`,
    }).finally(() => {
      setIsSaving(false);
    });
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchPostList();
  }, [fetchPostList]);

  // Render logic
  const renderContent = () => {
    if (isLoadingList || (isLoadingPost && !currentPost)) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <FiLoader className="animate-spin text-4xl" />
          <p className="mt-2 font-semibold">Loading posts...</p>
        </div>
      );
    }
    
    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
          <FiX className="text-4xl" />
          <p className="mt-2 font-semibold">Error: {error}</p>
          <button onClick={fetchPostList} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Try Again
          </button>
        </div>
      );
    }

    if (!currentPost) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <FiInbox className="text-6xl" />
          <p className="mt-4 text-xl font-semibold">All done!</p>
          <p className="text-sm">No uncategorized posts found.</p>
          <button onClick={fetchPostList} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Check for New Posts
          </button>
        </div>
      );
    }

    // Pass `setCurrentPost` to the editor to allow direct state updates
    return <PostEditorCard post={currentPost} setPost={setCurrentPost} onSave={handleSave} onSkip={loadNextPost} isSaving={isSaving} />;
  };

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Post Swiper</h1>
      <p className="text-gray-600 mb-6">Quickly review, edit, and categorize posts.</p>
      
      {/* Navigation */}
      <div className="flex justify-between items-center max-w-lg mx-auto mb-2">
         <button 
           onClick={loadPrevPost}
           disabled={currentIndex === 0 || isLoadingPost || isSaving}
           className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300"
         >
           <FiChevronLeft /> Prev
         </button>
         <span className="font-semibold text-gray-700">
          {postsToReview.length > 0 ? `Post ${currentIndex + 1} of ${postsToReview.length}` : "No Posts"}
         </span>
         <button 
           onClick={loadNextPost}
           disabled={currentIndex >= postsToReview.length - 1 || isLoadingPost || isSaving}
           className="flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-gray-600 disabled:text-gray-300"
         >
           Next <FiChevronRight />
         </button>
      </div>
      
      {/* Mobile-like container */}
      <div className="max-w-lg mx-auto bg-gray-800 p-2 sm:p-4 rounded-2xl shadow-2xl">
        <div className="bg-gray-100 rounded-lg h-[95vh] min-h-[600px] flex flex-col">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
