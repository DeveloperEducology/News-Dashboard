import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X, Plus, CheckCheck, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import useArticles from "../service/useArticles";
import { API_BASE } from "../service/config";

export default function NewDashboard() {
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState(["All", "N/A"]);
  const [sources, setSources] = useState(["All"]);
  const [category, setCategory] = useState("All");
  const [source, setSource] = useState("All");
  const [type, setType] = useState("All");

  const { articles, loading, error, totalPages, totalArticles, refetch } = useArticles({
    page,
    category,
    source,
    type,
  });

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [newArticle, setNewArticle] = useState({
    title: "",
    source: "",
    summary: "",
    body: "",
    imageUrl: "",
    url: "",
    isPublished: true,
  });

  // Load filters once
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/articles?limit=200`);
        const data = await res.json();
        const cats = [...new Set(data.articles.map((a) => a.topCategory).filter(Boolean))].sort();
        const srcs = [...new Set(data.articles.map((a) => a.source).filter(Boolean))].sort();
        setCategories(["All", ...cats, "N/A"]);
        setSources(["All", ...srcs]);
      } catch (err) {
        console.error("Filter fetch failed:", err);
      }
    };
    fetchFilters();
  }, []);

  // Handlers
  const handleSaveEdit = async () => {
    try {
      await fetch(`${API_BASE}/api/articles/${editArticle._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editArticle),
      });
      toast.success("Article updated!");
      setIsModalOpen(false);
      refetch();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await fetch(`${API_BASE}/api/articles/${id}`, { method: "DELETE" });
      toast.success("Article deleted");
      refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/articles/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticle),
      });
      if (!res.ok) throw new Error("Create failed");
      toast.success("Article created!");
      setIsCreateOpen(false);
      setNewArticle({
        title: "",
        source: "",
        summary: "",
        body: "",
        imageUrl: "",
        url: "",
        isPublished: true,
      });
      setPage(1);
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePublish = async (article) => {
    const newStatus = !article.isPublished;
    try {
      await fetch(`${API_BASE}/api/articles/${article._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      toast.success(newStatus ? "Published!" : "Unpublished!");
      refetch();
    } catch {
      toast.error("Publish action failed");
    }
  };

  const sourceMap = {
    "Telugu News | Latest Telugu News and Live Updates | Telugu Breaking News |Telugu Top Stories | తెలుగు వార్తలు - NTV Telugu":
      "NTV",
    Eenadu: "Eenadu",
    Sakshi: "Sakshi",
    "Great Andhra": "Great Andhra",
    Andhrajyothy: "Andhrajyothy",
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-cyan-400 flex items-center gap-2">
            Latest News Articles
            <span className="px-2 py-1 bg-gray-700 text-xs rounded-md">
              {totalArticles}
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <select value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }} className="bg-gray-700 px-3 py-2 rounded-lg">
              {sources.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="bg-gray-700 px-3 py-2 rounded-lg">
              <option>All</option>
              <option>Manual</option>
              <option>Fetched</option>
            </select>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="bg-gray-700 px-3 py-2 rounded-lg">
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 rounded-lg">
              <Plus size={18} /> New
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center h-64 items-center">Loading...</div>
        ) : error ? (
          <div className="text-red-400">Error: {error}</div>
        ) : (
          <>
            <div className="overflow-x-auto bg-gray-800 rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-cyan-300">Thumb</th>
                    <th className="px-6 py-3 text-left text-xs text-cyan-300">Title</th>
                    <th className="px-6 py-3 text-left text-xs text-cyan-300">Category</th>
                    <th className="px-6 py-3 text-left text-xs text-cyan-300">Status</th>
                    <th className="px-6 py-3 text-left text-xs text-cyan-300">Date</th>
                    <th className="px-6 py-3 text-center text-xs text-cyan-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <img src={a.imageUrl || (a.media?.[0]?.src)} alt="thumb" className="w-12 h-12 object-cover rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <a href={a.url} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-cyan-400">
                          {a.title}
                        </a>
                        <span className="text-xs text-gray-400 ml-1">
                          ({sourceMap[a.source] || a.source})
                        </span>
                      </td>
                      <td className="px-6 py-4">{a.topCategory || "N/A"}</td>
                      <td className="px-6 py-4">
                        {a.isPublished ? (
                          <span className="px-2 py-1 text-xs bg-green-900 text-green-300 rounded">Published</span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-yellow-900 text-yellow-300 rounded">Draft</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{dayjs(a.publishedAt).format("MMM D, YYYY h:mm A")}</td>
                      <td className="px-6 py-4 text-center space-x-3">
                        <button onClick={() => handlePublish(a)} className="text-green-400 hover:text-green-600">
                          <CheckCheck size={18} />
                        </button>
                        <button onClick={() => { setEditArticle(a); setIsModalOpen(true); }} className="text-blue-400 hover:text-blue-600">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(a._id)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={18} />
                        </button>
                        <a href={a.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-600">
                          <Eye size={18} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between mt-6">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">
                Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">
                Next
              </button>
            </div>
          </>
        )}

        {/* Edit Modal */}
        {isModalOpen && editArticle && (
          <Modal title="Edit Article" onClose={() => setIsModalOpen(false)} onSave={handleSaveEdit}>
            <FormInputs data={editArticle} setData={setEditArticle} categories={categories} />
          </Modal>
        )}

        {/* Create Modal */}
        {isCreateOpen && (
          <Modal title="Create New Article" onClose={() => setIsCreateOpen(false)} onSave={handleCreate}>
            <FormInputs data={newArticle} setData={setNewArticle} isCreateMode />
          </Modal>
        )}
      </div>
    </div>
  );
}

function Modal({ title, children, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-cyan-400 mb-4">{title}</h2>
        <div className="max-h-[70vh] overflow-y-auto pr-2">{children}</div>
        <div className="flex justify-end space-x-3 mt-5 pt-4 border-t border-gray-700">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 bg-cyan-600 rounded">Save</button>
        </div>
      </div>
    </div>
  );
}

function FormInputs({ data, setData, isCreateMode = false, categories = [] }) {
  const handleImageChange = (e) => {
    const src = e.target.value;
    if (isCreateMode) setData({ ...data, imageUrl: src });
    else setData({ ...data, media: [{ type: "image", src }] });
  };
  const getImage = () => (isCreateMode ? data.imageUrl || "" : data.media?.[0]?.src || "");
  return (
    <>
      <label className="block mb-3">
        <span className="text-gray-300 text-sm">Title</span>
        <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="mt-1 w-full px-3 py-2 rounded bg-gray-700" />
      </label>
      <label className="block mb-3">
        <span className="text-gray-300 text-sm">Source</span>
        <input value={data.source} onChange={(e) => setData({ ...data, source: e.target.value })} className="mt-1 w-full px-3 py-2 rounded bg-gray-700" />
      </label>
      {!isCreateMode && (
        <label className="block mb-3">
          <span className="text-gray-300 text-sm">Category</span>
          <select value={data.topCategory || "N/A"} onChange={(e) => setData({ ...data, topCategory: e.target.value === "N/A" ? "" : e.target.value })} className="mt-1 w-full px-3 py-2 rounded bg-gray-700">
            {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      )}
      <label className="block mb-3">
        <span className="text-gray-300 text-sm">URL</span>
        <input value={data.url || ""} onChange={(e) => setData({ ...data, url: e.target.value })} className="mt-1 w-full px-3 py-2 rounded bg-gray-700" />
      </label>
      <label className="block mb-3">
        <span className="text-gray-300 text-sm">Image URL</span>
        <input value={getImage()} onChange={handleImageChange} className="mt-1 w-full px-3 py-2 rounded bg-gray-700" />
      </label>
      <label className="block mb-3">
        <span className="text-gray-300 text-sm">Summary</span>
        <textarea value={data.summary || ""} onChange={(e) => setData({ ...data, summary: e.target.value })} className="mt-1 w-full px-3 py-2 rounded bg-gray-700 h-24" />
      </label>
      <label className="block mb-3">
        <span className="text-gray-300 text-sm">Body</span>
        <textarea value={data.body || ""} onChange={(e) => setData({ ...data, body: e.target.value })} className="mt-1 w-full px-3 py-2 rounded bg-gray-700 h-40" />
      </label>
    </>
  );
}
