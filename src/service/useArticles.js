// hooks/useArticles.js
import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "./config";

export default function useArticles({ page, category, source, type }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE}/api/articles?page=${page}&limit=10`;
      if (category && category !== "All") url += `&category=${encodeURIComponent(category)}`;
      if (source && source !== "All") url += `&source=${encodeURIComponent(source)}`;
      if (type && type !== "All") url += `&type=${type}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();

      setArticles(data.articles);
      setTotalPages(data.totalPages);
      setTotalArticles(data.totalArticles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, category, source, type]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, error, totalPages, totalArticles, refetch: fetchArticles };
}
