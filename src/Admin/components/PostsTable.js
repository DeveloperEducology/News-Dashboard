import React from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit, FiTrash2, FiBell, FiBookmark } from 'react-icons/fi';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import { API_BASE_URL } from '../constants/config';

export default function PostsTable({
  posts,
  loading,
  onOpenModal,
  onActionSuccess,
  isStickyPage,
  selectedPosts,
  onToggleSelect,
  onToggleSelectAll,
}) {
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
  
  const handlePinToggle = (p) => {
    const isPinned = p.pinnedIndex != null;
    if (isPinned) {
      if (window.confirm(`Unpin "${p.title}"?`))
        performUpdate({ ...p, pinnedIndex: null });
    } else {
      const pos = window.prompt("Enter pin position (1, 2, 3...):");
      if (pos) {
        const idx = parseInt(pos, 10) - 1;
        if (!isNaN(idx) && idx >= 0) performUpdate({ ...p, pinnedIndex: idx });
        else toast.error("Invalid position.");
      }
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center p-8">No posts found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            {!isStickyPage && (
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedPosts?.size === posts.length && posts.length > 0}
                  onChange={onToggleSelectAll}
                />
              </th>
            )}
            {isStickyPage && <th className="px-4 py-3 w-16">Pos</th>}
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Categories</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post._id}
              className={`border-t hover:bg-gray-50 ${selectedPosts?.has(post._id) ? "!bg-blue-50" : ""}`}
            >
              {!isStickyPage && (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedPosts.has(post._id)}
                    onChange={() => onToggleSelect(post._id)}
                  />
                </td>
              )}
              {isStickyPage && (
                <td className="px-4 py-3 font-bold text-lg text-blue-600">#{post.pinnedIndex + 1}</td>
              )}
              <td className="px-4 py-3 max-w-sm">
                <p className="font-medium truncate flex items-center gap-2">
                  {post.pinnedIndex != null && <FiBookmark className="text-yellow-600" />}
                  {post.title}
                </p>
              </td>
              <td className="px-4 py-3 max-w-xs truncate">{post.categories?.join(", ") || "-"}</td>
              <td className="px-4 py-3">
                <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">{post.source}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{formatTimeAgo(post.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handlePinToggle(post)}
                    title={post.pinnedIndex != null ? "Unpin Post" : "Pin Post"}
                    className={`p-2 rounded-md border font-semibold ${
                      post.pinnedIndex != null
                        ? "border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {isStickyPage ? "Unpin" : <FiBookmark />}
                  </button>
                  <button onClick={() => onOpenModal(post, onActionSuccess)} className="p-2 rounded-md border text-gray-700 hover:bg-gray-100">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(post._id)} className="p-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50">
                    <FiTrash2 />
                  </button>
                  <button onClick={() => handleNotify(post._id, post.title)} className="p-2 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50" title="Send Alert">
                    <FiBell />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}