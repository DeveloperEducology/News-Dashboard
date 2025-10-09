import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// --- Helper Function for Relative Time ---
function timeAgo(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30.44);
  const years = Math.round(days / 365.25);

  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 24) return `${days} days ago`;
  return `${months} mo ago`;
}

// --- Main Component ---
const VideoManagementPage = () => {
  // --- State Management ---
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sources, setSources] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  
  const [predefinedSources, setPredefinedSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState('');

  // const API_BASE_URL = 'http://localhost:4000/api';
  const API_BASE_URL = 'https://twitterapi-node.onrender.com/api';

  // --- Data Fetching ---
  const fetchVideos = useCallback(async (page, sFilter = statusFilter, srcFilter = sourceFilter) => {
    setLoading(true);
    setError(null);
    let url = `${API_BASE_URL}/admin/videos?page=${page}&limit=10`;
    if (sFilter === 'published') url += '&isPublished=true';
    if (sFilter === 'unpublished') url += '&isPublished=false';
    if (srcFilter !== 'all') url += `&source=${encodeURIComponent(srcFilter)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setVideos(data.videos);
      setPagination({ page: data.page, totalPages: data.totalPages });
    } catch (err) {
      setError('Failed to fetch videos. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sourceFilter]);

  const fetchTableSources = useCallback(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/videos/sources`);
        const data = await response.json();
        if (data.status === 'success') setSources(data.sources);
      } catch (err) {
        console.error('Failed to fetch table sources', err);
      }
  }, []);

  // --- Initial Data Load ---
  useEffect(() => {
    const fetchPredefinedSources = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/youtube-sources`);
        const data = await response.json();
        if (data.status === 'success') setPredefinedSources(data.sources);
      } catch (err) {
        console.error('Failed to fetch predefined sources', err);
      }
    };
    fetchPredefinedSources();
    fetchTableSources();
  }, [fetchTableSources]);

  useEffect(() => {
    fetchVideos(1, statusFilter, sourceFilter);
    setSelectedVideos(new Set());
  }, [fetchVideos, statusFilter, sourceFilter]);

  // --- Handlers ---
  const handleRefetchSource = () => {
    if (!selectedSource) {
      toast.error('Please select a source from the dropdown to fetch.');
      return;
    }

    const sourceObject = JSON.parse(selectedSource);
    
    // ✅ FIX: Parse the URL to extract the ID and TYPE that the backend needs
    let id = null;
    let type = null;
    try {
        const url = new URL(sourceObject.url);
        if (url.searchParams.has('channel_id')) {
            id = url.searchParams.get('channel_id');
            type = 'channel';
        } else if (url.searchParams.has('user')) {
            id = url.searchParams.get('user');
            type = 'user';
        }
    } catch (e) {
        toast.error('Invalid source URL format.');
        return;
    }

    if (!id || !type) {
        toast.error('Could not determine Channel ID or Username from the source URL.');
        return;
    }

    // Construct the correct payload for the API
    const payload = {
      id,
      type,
      category: sourceObject.category,
    };

    const promise = fetch(`${API_BASE_URL}/fetch-single-youtube-channel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Send the corrected payload
    }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch channel.');
        return data.message;
    });

    toast.promise(promise, {
        loading: `Fetching videos from ${sourceObject.name}...`,
        success: (message) => {
            fetchVideos(1);
            fetchTableSources();
            return message;
        },
        error: (err) => err.message,
    });
  };

  const handleBulkAction = async (action, videoIds) => {
    if (videoIds.length === 0) {
      toast.error('Please select at least one video.');
      return;
    }
    const promise = fetch(`${API_BASE_URL}/videos/bulk-action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, videoIds }),
    }).then(res => {
      if (!res.ok) throw new Error(`Action '${action}' failed.`);
      return res.json();
    });
    toast.promise(promise, {
      loading: `Performing action: ${action}...`,
      success: () => {
        fetchVideos(pagination.page);
        setSelectedVideos(new Set());
        return `Successfully performed action: ${action}!`;
      },
      error: (err) => err.message,
    });
  };
  
  const handleEdit = async (videoId, currentTitle) => {
    const newTitle = window.prompt('Enter new title:', currentTitle);
    if (newTitle && newTitle.trim() !== '' && newTitle !== currentTitle) {
       const promise = fetch(`${API_BASE_URL}/video/${videoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      }).then(res => {
         if (!res.ok) throw new Error('Failed to update video.');
         return res.json();
      });
      toast.promise(promise, {
          loading: 'Updating title...',
          success: () => {
              fetchVideos(pagination.page);
              return 'Title updated!';
          },
          error: (err) => err.message,
      });
    }
  };
  
  const handleSelectVideo = (videoId) => {
    setSelectedVideos(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(videoId)) newSelected.delete(videoId);
      else newSelected.add(videoId);
      return newSelected;
    });
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedVideos(new Set(videos.map(v => v._id)));
    else setSelectedVideos(new Set());
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchVideos(newPage);
    }
  };
  
  // --- Render Logic ---
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Video Management</h1>
      
      <div style={styles.fetchSection}>
        <h2 style={styles.subHeader}>Re-fetch Predefined YouTube Source</h2>
        <div style={styles.fetchForm}>
          <select 
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            style={styles.input}
          >
            <option value="">-- Select a Source to Fetch --</option>
            {predefinedSources.map((source) => (
              <option key={source.url} value={JSON.stringify(source)}>
                {source.name} ({source.category})
              </option>
            ))}
          </select>
          <button onClick={handleRefetchSource} style={styles.publishButton}>Fetch Source</button>
        </div>
      </div>

      <div style={styles.actionBar}>
        <div>
          <button onClick={() => handleBulkAction('publish', Array.from(selectedVideos))} style={styles.publishButton} disabled={selectedVideos.size === 0}>Publish</button>
          <button onClick={() => handleBulkAction('unpublish', Array.from(selectedVideos))} style={{...styles.button, marginLeft: '10px'}} disabled={selectedVideos.size === 0}>Unpublish</button>
          <button onClick={() => handleBulkAction('delete', Array.from(selectedVideos))} style={{...styles.deleteButton, marginLeft: '10px'}} disabled={selectedVideos.size === 0}>Delete</button>
          <span style={{marginLeft: '10px', color: '#6c757d'}}>({selectedVideos.size} selected)</span>
        </div>
        <div style={styles.filters}>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} style={styles.select}>
            <option value="all">All Sources</option>
            {sources.map(source => <option key={source} value={source}>{source}</option>)}
          </select>
          <button onClick={() => setStatusFilter('all')} style={statusFilter === 'all' ? styles.activeFilter : styles.button}>All</button>
          <button onClick={() => setStatusFilter('published')} style={statusFilter === 'published' ? styles.activeFilter : styles.button}>Published</button>
          <button onClick={() => setStatusFilter('unpublished')} style={statusFilter === 'unpublished' ? styles.activeFilter : styles.button}>Unpublished</button>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}><input type="checkbox" onChange={handleSelectAll} checked={videos.length > 0 && selectedVideos.size === videos.length} /></th>
            <th style={styles.th}>Thumbnail</th>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Author</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Created</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7" style={styles.centered}>Loading...</td></tr>
          ) : error ? (
            <tr><td colSpan="7" style={styles.error}>{error}</td></tr>
          ) : videos.map((video) => (
            <tr key={video._id}>
              <td style={styles.cell}><input type="checkbox" checked={selectedVideos.has(video._id)} onChange={() => handleSelectVideo(video._id)} /></td>
              <td style={styles.cell}><img src={video.thumbnailUrl} alt={video.title} style={styles.thumbnail} /></td>
              <td style={styles.cell}>{video.title}</td>
              <td style={styles.cell}>{video.author}</td>
              <td style={styles.cell}><span style={video.isPublished ? styles.published : styles.draft}>{video.isPublished ? 'Published' : 'Draft'}</span></td>
              <td style={styles.cell}>{timeAgo(video.createdAt)}</td>
              <td style={styles.cell}>
                <button onClick={() => handleBulkAction(video.isPublished ? 'unpublish' : 'publish', [video._id])} style={styles.button}>{video.isPublished ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => handleEdit(video._id, video.title)} style={styles.button}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={styles.pagination}>
        <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1 || loading}>Previous</button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages || loading}>Next</button>
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
  container: { fontFamily: 'Arial, sans-serif', padding: '20px', color: '#333' },
  header: { textAlign: 'center', marginBottom: '10px' },
  subHeader: { fontSize: '1.2em', color: '#495057', marginBottom: '10px' },
  fetchSection: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #dee2e6' },
  fetchForm: { display: 'flex', alignItems: 'center', gap: '10px' },
  input: { flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' },
  actionBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' },
  filters: { display: 'flex', alignItems: 'center', gap: '5px' },
  select: { padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white', height: '37px' },
  publishButton: { padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', height: '37px' },
  table: { width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  th: { backgroundColor: '#f8f9fa', padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' },
  cell: { padding: '10px', borderBottom: '1px solid #dee2e6', verticalAlign: 'middle' },
  thumbnail: { width: '100px', height: '75px', objectFit: 'cover', borderRadius: '4px' },
  button: { padding: '5px 10px', marginRight: '5px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white' },
  activeFilter: { padding: '5px 10px', marginRight: '5px', border: '1px solid #007bff', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white' },
  deleteButton: { padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '15px' },
  centered: { textAlign: 'center', padding: '20px', color: '#777' },
  error: { textAlign: 'center', padding: '20px', color: 'red' },
  published: { backgroundColor: 'rgba(40, 167, 69, 0.2)', color: '#155724', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  draft: { backgroundColor: 'rgba(108, 117, 125, 0.2)', color: '#383d41', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
};

export default VideoManagementPage;
