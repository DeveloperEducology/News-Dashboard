import React, { useState, useEffect } from 'react';

// This component will render the Twitter embed
const TwitterEmbed = ({ embedHtml }) => {
  useEffect(() => {
    // This is necessary to trigger Twitter's script
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, [embedHtml]);

  // We trust the HTML from our own server, but be cautious
  return <div dangerouslySetInnerHTML={{ __html: embedHtml }} />;
};


export default function FetchTweetForm() {
  const [tweetUrl, setTweetUrl] = useState('');
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false); // For fetching
  const [isSaving, setIsSaving] = useState(false); // For saving
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const API_BASE_URL = "https://tweet-server-jd9n.onrender.com";

  /**
   * Extracts the Tweet ID from a full URL.
   */
  const extractTweetId = (url) => {
    try {
      // Matches the string of digits after "/status/"
      const match = url.match(/\/status\/(\d+)/);
      if (match && match[1]) {
        return match[1];
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  /**
   * Step 1: Fetch the tweet data from your server
   */
  const handleFetchTweet = async () => {
    const tweetId = extractTweetId(tweetUrl);

    if (!tweetId) {
      setError("Invalid Tweet URL. Please use a full URL (e.g., https://x.com/user/status/123).");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setFormData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/fetch-tweet-and-save?tweet_ids=${tweetId}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();

      if (data.failedIds && data.failedIds.length > 0) {
        throw new Error(`Server failed to process Tweet ID: ${data.failedIds[0].reason}`);
      }

      if (data.successfulPosts && data.successfulPosts.length > 0) {
        // SUCCESS: Populate the form
        setFormData(data.successfulPosts[0]);
        setMessage(data.message);
      } else {
        throw new Error("API returned success but no post data was found.");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Handle changes to the form fields
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Step 3: Handle tag changes (converts string to array)
   */
  const handleTagsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.split(',').map(tag => tag.trim()), // Split by comma and trim
    }));
  };

  /**
   * Step 4: Handle form submission (NOW SAVES TO DB)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData || !formData._id) {
      setError("No form data to save.");
      return;
    }

    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/update-article/${formData._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.details || result.error || "Failed to save data.");
      }

      // Success
      setMessage(result.message || "Article updated successfully!");
      // Optionally update form data with the returned data, in case db made changes
      setFormData(result.data); 

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to render an input field
  const renderInput = (label, name, value) => (
    <div key={name}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value || ''}
        onChange={handleFormChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  );

  // Helper function to render a textarea
  const renderTextarea = (label, name, value, rows = 4) => (
    <div key={name}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value || ''}
        onChange={handleFormChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* --- SECTION 1: TWEET FETCHER --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Fetch Tweet</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={tweetUrl}
            onChange={(e) => setTweetUrl(e.target.value)}
            placeholder="Paste full Tweet URL (e.g., https://x.com/...)"
            className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            onClick={handleFetchTweet}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Fetching...' : 'Fetch'}
          </button>
        </div>
        {/* Error/Success messages for the TOP section */}
        {error && !formData && <p className="text-red-600 mt-2">{error}</p>}
        {message && !formData && <p className="text-green-600 mt-2">{message}</p>}
      </div>

      {/* --- SECTION 2: EDIT FORM --- */}
      {/* This form only appears after data is fetched */}
      {formData && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Edit Article</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* --- Column 1: Core Content --- */}
            <div className="space-y-4">
              {renderInput("Title (Telugu)", "title", formData.title)}
              {renderTextarea("Summary (Telugu)", "summary", formData.summary)}
              {renderTextarea("Content", "content", formData.content, 6)}
              {renderInput("Featured Image URL", "featuredImage", formData.featuredImage)}
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* --- Column 2: Slugs, Tags & Embed --- */}
            <div className="space-y-4">
              {renderInput("Slug (English)", "slug", formData.slug)}
              {renderInput("Slug (Telugu)", "slug_te", formData.slug_te)}
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (English)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                  onChange={handleTagsChange}
                  placeholder="tag1, tag2, tag3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="tags_te" className="block text-sm font-medium text-gray-700">Tags (Telugu)</label>
                <input
                  type="text"
                  id="tags_te"
                  name="tags_te"
                  value={Array.isArray(formData.tags_te) ? formData.tags_te.join(', ') : ''}
                  onChange={handleTagsChange}
                  placeholder="ట్యాగ్1, ట్యాగ్2, ట్యాగ్3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tweet Preview</label>
                <div className="mt-1 border border-gray-200 rounded-lg p-4">
                  <TwitterEmbed embedHtml={formData.twitterEmbed} />
                </div>
              </div>
            </div>
          </div>

          {/* --- Form Actions --- */}
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            {/* Error/Success messages for the FORM section */}
            {error && <p className="text-red-600 mt-2 text-right">{error}</p>}
            {message && <p className="text-green-600 mt-2 text-right">{message}</p>}
          </div>
        </form>
      )}
    </div>
  );
}
