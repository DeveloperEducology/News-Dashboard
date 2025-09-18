import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiFileText,
  FiSettings,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({});
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [postType, setPostType] = useState("normal_post");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    "Politics",
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
    "Andhrapradesh"
  ];

  const fetchPosts = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://twitterapi-node.onrender.com/api/saved-tweets?page=${pageNum}&limit=${limit}`
      );
      const data = await res.json();
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(
        `https://twitterapi-node.onrender.com/api/saved-tweets/${id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting post");
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    const url = editingPost
      ? `https://twitterapi-node.onrender.com/api/saved-tweets/${editingPost._id}`
      : `https://twitterapi-node.onrender.com/api/saved-tweets/`;

    try {
      const res = await fetch(url, {
        method: editingPost ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: postType }),
      });
      const data = await res.json();
      if (res.ok) {
        if (editingPost) {
          setPosts((prev) =>
            prev.map((p) => (p._id === editingPost._id ? data.post : p))
          );
        } else {
          setPosts([data.post, ...posts]);
        }
        setEditingPost(null);
        setFormData({});
        setIsModalOpen(false);
      } else {
        alert("Error saving post: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving post");
    }
  };

  const handlePublish = async (id, currentStatus) => {
    try {
      const res = await fetch(`https://twitterapi-node.onrender.com/api/saved-tweets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p._id === id ? data.post : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setPostType(post.type || "full_post");
    setFormData({
      title: post.title || "",
      summary: post.summary || "",
      text: post.text || "",
      url: post.url || "",
      twitterUrl: post.twitterUrl || "",
      source: post.source || "Twitter",
      media: post.media || [],
      categories: post.categories || [],
    });
    setIsModalOpen(true);
  };

  const handleCategoryToggle = (category) => {
    const current = formData.categories || [];
    if (current.includes(category)) {
      setFormData({
        ...formData,
        categories: current.filter((c) => c !== category),
      });
    } else {
      setFormData({ ...formData, categories: [...current, category] });
    }
  };

  const renderFormFields = () => {
    switch (postType) {
      case "normal_post":
      case "short_news":
        return (
          <textarea
            value={formData.text || ""}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter text..."
          />
        );
      case "full_post":
        return (
          <>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Title"
            />
            <textarea
              value={formData.summary || ""}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Summary"
            />
            <textarea
              value={formData.text || ""}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              placeholder="Full content"
            />
            <button
              onClick={() => setCategoriesModalOpen(true)}
              className="px-3 py-1 border rounded mt-2"
            >
              {formData.categories?.length
                ? formData.categories.join(", ")
                : "Select Categories"}
            </button>
          </>
        );
      case "image_gallery":
        return (
          <>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const newImages = files.map((file) => ({
                  type: "photo",
                  url: URL.createObjectURL(file),
                  file,
                }));
                setFormData({
                  ...formData,
                  media: [...(formData.media || []), ...newImages],
                });
              }}
            />
            <div className="flex gap-2 mt-2">
              {formData.media?.map((m, idx) => (
                <img
                  key={idx}
                  src={m.url}
                  alt="gallery"
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          </>
        );
      case "video_post":
        return (
          <>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setFormData({
                  ...formData,
                  media: [{ type: "video", url: URL.createObjectURL(file), file }],
                });
              }}
            />
            {formData.media?.[0] && (
              <video
                src={formData.media[0].url}
                controls
                className="w-64 mt-2 rounded"
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  // Analytics Data
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: posts.filter((p) => p.categories?.includes(cat)).length,
  }));

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.isPublished).length,
    drafts: posts.filter((p) => !p.isPublished).length,
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow flex flex-col">
        <div className="text-2xl font-bold p-4 border-b">NewsAdmin</div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 w-full">
            <FiHome /> Dashboard
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 w-full">
            <FiFileText /> Posts
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 w-full">
            <FiSettings /> Categories
          </button>
        </nav>
        <div className="p-4 border-t">
          <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 w-full">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search posts..."
              className="border rounded px-3 py-1"
            />
            <FiBell className="text-xl" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded shadow p-4 text-center">
            <div className="text-gray-500">Total Posts</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <div className="text-gray-500">Published</div>
            <div className="text-2xl font-bold">{stats.published}</div>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <div className="text-gray-500">Drafts</div>
            <div className="text-2xl font-bold">{stats.drafts}</div>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="font-semibold mb-4">Posts by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryCounts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded shadow overflow-x-auto mb-6">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold text-lg">Posts</h3>
            <button
              onClick={() => {
                setEditingPost(null);
                setFormData({});
                setPostType("normal_post");
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Create Post
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Title / Text</th>
                <th className="px-4 py-2">Categories</th>
                <th className="px-4 py-2">Media</th>
                <th className="px-4 py-2">Published</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-4 text-gray-500"
                  >
                    No posts found.
                  </td>
                </tr>
              ) : (
                posts.map((post, index) => (
                  <tr
                    key={post._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-2 max-w-xs truncate">
                      {post.title || post.text}
                    </td>
                    <td className="px-4 py-2">
                      {post.categories?.join(", ") || "-"}
                    </td>
                    <td className="px-4 py-2">
                      {post.media?.[0] ? (
                        post.media[0].type === "video" ? (
                          <video
                            src={post.media[0].url}
                            className="w-24 h-16 object-cover"
                          />
                        ) : (
                          <img
                            src={post.media[0].url}
                            alt="media"
                            className="w-24 h-16 object-cover rounded"
                          />
                        )
                      ) : (
                        <span className="text-gray-400">No Media</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {post.isPublished ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="px-3 py-1 rounded border hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            handlePublish(post._id, post.isPublished)
                          }
                          className={`px-3 py-1 rounded ${
                            post.isPublished
                              ? "bg-gray-300 hover:bg-gray-400"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {post.isPublished ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-3 py-1 rounded border ${
                page === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-3 py-1 rounded border ${
                page === totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Create / Edit Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    {/* Modal container */}
    <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-xl shadow-xl p-8 relative flex flex-col md:flex-row gap-6 overflow-hidden">
      {/* Left: Form */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        <h2 className="text-2xl font-semibold mb-4">
          {editingPost ? "Edit Post" : "Create Post"}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">Post Type</label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="normal_post">Normal Post</option>
            <option value="short_news">Short News</option>
            <option value="full_post">Full Post</option>
            <option value="image_gallery">Image Gallery</option>
            <option value="video_post">Video Post</option>
          </select>
        </div>

        {renderFormFields()}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => {
              setEditingPost(null);
              setFormData({});
              setIsModalOpen(false);
            }}
            className="px-5 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>

      {/* Right: Media Preview */}
      <div className="w-full md:w-80 flex-shrink-0 overflow-y-auto max-h-[80vh]">
        <h3 className="font-semibold mb-2">Media Preview</h3>
        {formData.media?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {formData.media.map((m, idx) => (
              <div key={idx} className="relative group">
                {m.type === "video" ? (
                  <video
                    src={m.url}
                    controls
                    className="w-full h-48 object-cover rounded"
                  />
                ) : (
                  <img
                    src={m.url}
                    alt="media"
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <button
                  onClick={() => {
                    const updated = formData.media.filter((_, i) => i !== idx);
                    setFormData({ ...formData, media: updated });
                  }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No media selected</p>
        )}
      </div>
    </div>
  </div>
)}

        {/* Categories Modal */}
        {categoriesModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Select Categories</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-4 py-2 rounded-md border ${
                      formData.categories?.includes(cat)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setCategoriesModalOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
