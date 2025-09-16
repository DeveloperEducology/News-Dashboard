import React, { useState } from 'react';

// Main App Component
export default function App() {
  // State variables to manage input, data, loading, and errors
  const [tweetId, setTweetId] = useState(''); // Default ID
  const [type, setType] = useState('full_post'); // Default type
  const [category, setCategory] = useState('Sports'); // Default category
  const [tweetData, setTweetData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- API Fetch Function ---
  const fetchTweet = async () => {
    // Basic validation to ensure ID and category are selected
    if (!tweetId || !type || !category) {
      setError('Please fill all fields.');
      return;
    }

    // Reset state before new fetch
    setIsLoading(true);
    setError(null);
    setTweetData(null);

    // Construct the API URL
    const apiUrl = `https://twitterapi-7313.onrender.com/api/formatted-tweet/?id=${tweetId}&type=${type}&category=${category}`;

    try {
      const response = await fetch(apiUrl);

      // Check for non-2xx HTTP responses
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setTweetData(data);

    } catch (err) {
      // Handle fetch errors (network issues, API errors, etc.)
      setError(`Failed to fetch data. Please check the console for more details or try again. Error: ${err.message}`);
      console.error("Fetch Error:", err);
    } finally {
      // Stop loading indicator
      setIsLoading(false);
    }
  };

  // --- Render JSX ---
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Tweet Data Fetcher</h1>
            <p className="text-gray-400 mt-2">Enter a Tweet ID to preview the formatted JSON response.</p>
          </div>

          {/* Input Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="sm:col-span-3">
              <label htmlFor="tweetId" className="block text-sm font-medium text-gray-300 mb-2">Tweet ID</label>
              <input
                id="tweetId"
                type="text"
                value={tweetId}
                onChange={(e) => setTweetId(e.target.value)}
                placeholder="e.g., 1788812443868614917"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200 h-[42px]"
              >
                <option value="Sports">Sports</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Politics">Politics</option>
                <option value="National">National</option>
                <option value="International">International</option>
                <option value="Telangana">Telangana</option>
              </select>
            </div>
             <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200 h-[42px]"
              >
                <option value="full_post">Full Post</option>
                <option value="normal_post">Normal Post</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={fetchTweet}
              disabled={isLoading}
              className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-8 rounded-lg transition-transform transform hover:scale-105 duration-300"
            >
              {isLoading ? 'Fetching...' : 'Fetch Tweet'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-6">
          {isLoading && (
            <div className="flex justify-center items-center bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              <span className="ml-4 text-gray-300">Loading data...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-2xl" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {tweetData && (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
               <h2 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">API Response</h2>
              <pre className="text-sm bg-gray-900 p-4 rounded-lg overflow-x-auto max-h-[50vh]">
                <code>
                  {JSON.stringify(tweetData, null, 2)}
                </code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

