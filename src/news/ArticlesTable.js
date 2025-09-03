import React, { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, X, Plus, CheckCheck } from "lucide-react";

export default function ArticlesTable() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);

  // Filters
  const [categories, setCategories] = useState(["All", "N/A"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sources, setSources] = useState(["All"]);
  const [selectedSource, setSelectedSource] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newArticle, setNewArticle] = useState({
    title: "",
    source: "",
    summary: "",
    body: "",
    imageUrl: "",
    isPublished: true,
    url: "",
  });

  // Fetch categories + sources once
  useEffect(() => {
    const fetchInitialFilters = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/articles?limit=200`);
        if (!response.ok) throw new Error("Failed to fetch articles for filters");
        const data = await response.json();

        const allCategories = data.articles.map((a) => a.topCategory).filter(Boolean);
        const uniqueCategories = [...new Set(allCategories)].sort();
        setCategories(["All", ...uniqueCategories, "N/A"]);

        const allSources = data.articles.map((a) => a.source).filter(Boolean);
        const uniqueSources = [...new Set(allSources)].sort();
        setSources(["All", ...uniqueSources]);
      } catch (e) {
        console.error("Could not derive filters from fetched data:", e.message);
      }
    };
    fetchInitialFilters();
  }, []);

  // Define fetchArticles using useCallback so it can be reused
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost:8000/api/articles?page=${currentPage}&limit=10`;

      if (selectedCategory && selectedCategory !== "All") url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (selectedSource && selectedSource !== "All") url += `&source=${encodeURIComponent(selectedSource)}`;
      if (filterType && filterType !== "All") url += `&type=${filterType}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setArticles(data.articles);
      setTotalPages(data.totalPages);
      setTotalArticles(data.totalArticles);
      setCurrentPage(data.currentPage);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, selectedSource, filterType]);

  // useEffect now calls the memoized fetchArticles function
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Handlers
  const handleSourceChange = (e) => {
    setSelectedSource(e.target.value);
    setCurrentPage(1);
  };
  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleEdit = (article) => {
    setEditArticle(article);
    setIsModalOpen(true);
  };
  const handleSaveEdit = async () => {
    try {
      await fetch(`http://localhost:8000/api/articles/${editArticle._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editArticle),
      });
      setIsModalOpen(false);
      fetchArticles(); // Refetch the list to show changes
    } catch {
      alert("Failed to update article");
    }
  };
  const handleDelete = async (articleId) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await fetch(`http://localhost:8000/api/articles/${articleId}`, { method: "DELETE" });
      fetchArticles(); // Refetch the list to reflect deletion
    } catch {
      alert("Failed to delete article");
    }
  };
  const handleCreate = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/articles/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticle),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create article");
      }
      setIsCreateOpen(false);
      setNewArticle({
        title: "",
        source: "",
        summary: "",
        body: "",
        url: "",
        imageUrl: "",
        isPublished: true,
      });
      // Reset filters and go to page 1 to see the new article
      setSelectedCategory("All");
      setSelectedSource("All");
      setFilterType("All");
      setCurrentPage(1); // This will trigger the useEffect to refetch
    } catch (err) {
      alert(err.message);
    }
  };
  const handlePublish = async (article) => {
    const newStatus = !article.isPublished;
    const action = newStatus ? "publish" : "unpublish";
    if (!window.confirm(`Are you sure you want to ${action} this article?`)) return;
    try {
      const response = await fetch(`http://localhost:8000/api/articles/${article._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      if (!response.ok) throw new Error(`Failed to ${action} the article.`);
      setArticles((prev) =>
        prev.map((a) => (a._id === article._id ? { ...a, isPublished: newStatus } : a))
      );
    } catch (err) {
      alert(err.message || `An error occurred while trying to ${action} the article.`);
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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-tight">
              Latest News Articles
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedSource}
              onChange={handleSourceChange}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
            >
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={handleFilterTypeChange}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
            >
              <option value="All">All Types</option>
              <option value="Manual">Manual Posts</option>
              <option value="Fetched">Fetched Articles</option>
            </select>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium"
            >
              <Plus size={18} /> New Article
            </button>
          </div>
        </header>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg text-center">
            <strong className="font-bold">Error:</strong>{" "}
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-2xl">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                      Published At
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-cyan-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {articles.map((article) => (
                    <tr
                      key={article._id}
                      className="hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-normal">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-white hover:text-cyan-400 transition-colors"
                        >
                          {article.title}
                          <span className="text-[10px] ml-1 text-gray-400">
                            ({sourceMap[article.source] || article.source})
                          </span>
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                        {article.topCategory || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {article.isPublished ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(article.publishedAt)}
                      </td>
                      <td className="px-6 py-4 text-center space-x-4">
                        <button
                          onClick={() => handlePublish(article)}
                          className={`transition ${
                            article.isPublished
                              ? "text-yellow-400 hover:text-yellow-600"
                              : "text-green-400 hover:text-green-600"
                          }`}
                          title={article.isPublished ? "Unpublish" : "Publish"}
                        >
                          <CheckCheck size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-blue-400 hover:text-blue-600 transition"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="text-red-400 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-400">
                Showing {articles.length} of{" "}
                <span className="font-medium text-white">{totalArticles}</span>{" "}
                articles
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-cyan-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-300">
                  Page{" "}
                  <span className="font-bold text-white">{currentPage}</span> of{" "}
                  <span className="font-bold text-white">{totalPages}</span>
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-cyan-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
        {isModalOpen && editArticle && (
          <Modal
            title="Edit Article"
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEdit}
          >
            <FormInputs data={editArticle} setData={setEditArticle} categories={categories} />
          </Modal>
        )}
        {isCreateOpen && (
          <Modal
            title="Create New Article"
            onClose={() => setIsCreateOpen(false)}
            onSave={handleCreate}
          >
            <FormInputs data={newArticle} setData={setNewArticle} isCreateMode />
          </Modal>
        )}
      </div>
    </div>
  );
}

function Modal({ title, children, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-cyan-400 mb-4">{title}</h2>
        <div className="max-h-[70vh] overflow-y-auto pr-2">{children}</div>
        <div className="flex justify-end space-x-3 mt-5 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-cyan-600 rounded-md text-white hover:bg-cyan-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function FormInputs({ data, setData, isCreateMode = false, categories = [] }) {
  const handleImageChange = (e) => {
    const newSrc = e.target.value;
    if (isCreateMode) {
      setData({ ...data, imageUrl: newSrc });
    } else {
      setData({ ...data, media: [{ type: "image", src: newSrc }] });
    }
  };
  const getImageUrl = () => {
    if (isCreateMode) return data.imageUrl || "";
    return data.media && data.media[0] ? data.media[0].src : "";
  };
  return (
    <>
      <label className="block mb-3"> <span className="text-gray-300 text-sm">Title</span> <input type="text" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"/> </label>
      <label className="block mb-3"> <span className="text-gray-300 text-sm">Source</span> <input type="text" value={data.source} onChange={(e) => setData({ ...data, source: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"/> </label>
      
      {!isCreateMode && (
        <label className="block mb-3">
          <span className="text-gray-300 text-sm">Category</span>
          <select
            value={data.topCategory || "N/A"}
            onChange={(e) => {
              const value = e.target.value === "N/A" ? "" : e.target.value;
              setData({ ...data, topCategory: value });
            }}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
          >
            {categories.filter(c => c !== "All").map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
      )}

      <label className="block mb-3"> <span className="text-gray-300 text-sm">URL</span> <input type="text" value={data.url || ""} onChange={(e) => setData({ ...data, url: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"/> </label>
      <label className="block mb-3"> <span className="text-gray-300 text-sm">Image URL</span> <input type="text" value={getImageUrl()} onChange={handleImageChange} className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"/> </label>
      <label className="block mb-3"> <span className="text-gray-300 text-sm">Summary</span> <textarea value={data.summary || ""} onChange={(e) => setData({ ...data, summary: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 h-24 resize-y"/> </label>
      <label className="block mb-3"> <span className="text-gray-300 text-sm">Body</span> <textarea value={data.body || ""} onChange={(e) => setData({ ...data, body: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 h-40 resize-y"/> </label>
    </>
  );
}