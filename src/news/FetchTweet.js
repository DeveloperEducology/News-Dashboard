import React, { useState } from 'react';

// A constant array of all available categories
const ALL_CATEGORIES = [
  "Sports",
  "Entertainment",
  "Politics",
  "National",
  "International",
  "Telangana"
];

// Main App Component
export default function FetchTweet() {
  // State variables to manage input, data, loading, and errors
  const [tweetId, setTweetId] = useState([]);
  const [type, setType] = useState('normal_post');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tweetData, setTweetData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories(prev => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter(cat => cat !== value);
      }
    });
  };


  console.log(type, tweetData, tweetId)

  // >>> UPDATED: This function now uses the POST method
   const fetchTweet = async () => {
    if (!tweetId || !type || selectedCategories.length === 0) {
      setError('Please enter a Tweet ID, select a type, and at least one category.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTweetData(null);
const apiUrl = 'https://twitterapi-node.onrender.com/api/formatted-tweet';
    // const apiUrl = 'http://localhost:4000/api/formatted-tweet';

    // 👉 log request payload before API call
    const requestPayload = {
      tweet_ids: [tweetId],
      categories: selectedCategories,
      type: type,
    };
    console.log("📤 Sending payload:", requestPayload);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      // 👉 log response after API call
      console.log("📥 API Response:", data);

      setTweetData(data);
    } catch (err) {
      setError(`Failed to fetch data. Error: ${err.message}`);
      console.error("❌ Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };


  // --- Render JSX (No changes needed below this line) ---
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
          <div className="space-y-6">
            <div>
              <label htmlFor="tweetId" className="block text-sm font-medium text-gray-300 mb-2">Tweet ID</label>
              <input
                id="tweetId"
                type="text"
                value={tweetId}
                onChange={(e) => setTweetId(e.target.value)}
                placeholder="e.g., 1966174656316268791"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categories (Select one or more)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                {ALL_CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer text-gray-200 hover:text-cyan-400 transition-colors">
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={handleCategoryChange}
                      className="form-checkbox h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200"
              >
                <option value="full_post">Full Post</option>
                <option value="normal_post">Normal Post</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center mt-8">
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
