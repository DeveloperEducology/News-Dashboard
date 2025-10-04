import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiTwitter } from 'react-icons/fi';
import { API_BASE_URL } from '../constants/config';

export default function FetchTweetPage({ onOpenModal }) {
  const [tweetId, setTweetId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    const regex = /(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/(\d+)/;
    const match = value.match(regex);
    setTweetId(match ? match[1] : value);
  };

  const handleFetchTweet = () => {
    if (!tweetId) {
      toast.error("Please provide a Tweet ID or URL.");
      return;
    }
    setIsLoading(true);

    const promise = fetch(`${API_BASE_URL}/formatted-tweet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tweet_ids: [tweetId] }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok || data.status !== "success" || !data.successfulPosts || data.successfulPosts.length === 0) {
          throw new Error(data.message || "Tweet could not be processed or already exists.");
        }
        return data.successfulPosts[0];
      });

    toast.promise(promise, {
        loading: "Fetching and creating post...",
        success: (createdPost) => {
          onOpenModal(createdPost);
          return "Tweet processed! You can now edit the post.";
        },
        error: (err) => `Error: ${err.message}`,
      })
      .finally(() => {
        setIsLoading(false);
        setTweetId("");
      });
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Fetch from Tweet
      </h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        <input
          id="tweetId"
          type="text"
          value={tweetId}
          onChange={handleInputChange}
          placeholder="Paste Tweet URL or ID"
          className="w-full px-3 py-2 border rounded-lg mb-4"
        />
        <button
          onClick={handleFetchTweet}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
        >
          {isLoading ? "Processing..." : <> <FiTwitter /> Fetch & Edit </>}
        </button>
      </div>
    </div>
  );
}