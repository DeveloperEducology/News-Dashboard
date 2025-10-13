import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL, DEFAULT_POST_STATE } from '../constants/config';

export default function YouTubePostForm() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState(""); // 1. New state for the URL

  const handleSave = () => {
    // 2. Add the URL to the object being sent
    const postData = {
      title,
      summary,
      videoUrl: youtubeUrl, // Added youtube_url field
      type: 'youtube_video',
    };

    const promise = fetch(`${API_BASE_URL}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...DEFAULT_POST_STATE, ...postData }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text || "Server error") });
        }
        return res.json().then((data) => ({ ok: res.ok, data }));
      })
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Error saving post.");
        return data;
      });

    toast.promise(promise, {
      loading: "Saving YouTube post...",
      success: () => {
        // 4. Clear the new URL field on success
        setTitle("");
        setSummary("");
        setYoutubeUrl("");
        return "Post created successfully!";
      },
      error: (err) => `Error: ${err.message}`,
    });
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Create YouTube Video Post
      </h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {/* Input for Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm"
            placeholder="Enter the post title"
          />
        </div>
        
        {/* Textarea for Summary */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Summary
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows="5"
            className="w-full border rounded-lg p-3 text-sm"
            placeholder="Enter a short summary or description..."
          />
        </div>

        {/* 3. New Input for YouTube URL */}
        <div>
          <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">
            YouTube URL
          </label>
          <input
            id="youtubeUrl"
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            // 5. Update disabled check to require both title and URL
            disabled={!title.trim() || !youtubeUrl.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-blue-300"
          >
            Save Post
          </button>
        </div>
      </div>
    </div>
  );
}