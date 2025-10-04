import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL, DEFAULT_POST_STATE } from '../constants/config';

export default function JsonParserPage() {
  const [jsonInput, setJsonInput] = useState("");

  const handleSave = () => {
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonInput);
    } catch (error) {
      toast.error("Invalid JSON format.");
      return;
    }

    const promise = fetch(`${API_BASE_URL}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...DEFAULT_POST_STATE, ...parsedJson }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Error saving post.");
        return data;
      });

    toast.promise(promise, {
      loading: "Saving parsed post...",
      success: () => {
        setJsonInput("");
        return "Post created successfully!";
      },
      error: (err) => `Error: ${err.message}`,
    });
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        JSON Object Parser
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows="15"
          className="w-full border rounded-lg p-3 font-mono text-sm"
          placeholder="Paste a valid post JSON object here..."
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={!jsonInput.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-blue-300"
          >
            Parse & Save Post
          </button>
        </div>
      </div>
    </div>
  );
}