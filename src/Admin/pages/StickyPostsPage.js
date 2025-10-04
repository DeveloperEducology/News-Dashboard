import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import PostsTable from '../components/PostsTable';
import { API_BASE_URL } from '../constants/config';

export default function StickyPostsPage({ onOpenModal }) {
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
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Sticky Posts
      </h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">All Pinned Items</h3>
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
}