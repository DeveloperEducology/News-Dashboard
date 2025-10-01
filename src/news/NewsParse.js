// src/NewsParse.js
import React, { useState, useEffect } from "react";

function NewsParse() {
  // State to hold all form data in a single object
  const [article, setArticle] = useState({
    title: "",
    summary: "",
    text: "",
    tags: "", // Tags are stored as a comma-separated string in the state
    sourceUrl: "",
    sourceName: "",
  });

  // State for the JSON paste textarea
  const [jsonPasteContent, setJsonPasteContent] = useState("");

  // State for the final generated JSON output
  const [finalJsonOutput, setFinalJsonOutput] = useState(
    "Click 'Generate Final JSON Object' to see the structure."
  );

  // --- Handlers ---

  // A single handler to update the article state for any input field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  };

  // Handler for the "Parse JSON" button
  const handleParseJson = () => {
    if (!jsonPasteContent.trim()) {
      alert("Please paste a JSON object into the 'Paste JSON Here' box first.");
      return;
    }
    try {
      const data = JSON.parse(jsonPasteContent);
      setArticle({
        title: data.title || "",
        summary: data.summary || "",
        text: data.text || "",
        // Convert tags array back to a comma-separated string for the input field
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
        sourceUrl: data.sourceUrl || "",
        sourceName: data.sourceName || "",
      });
      setJsonPasteContent(""); // Clear the textarea after successful parsing
    } catch (e) {
      alert("Error parsing JSON. Please ensure the pasted text is valid.");
      console.error("JSON Parsing Error:", e);
    }
  };

  // Handler for the form submission to generate the final JSON
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Create a final data object to be stringified
    const finalData = {
      ...article,
      // Convert the tags string into an array of trimmed, non-empty strings
      tags: article.tags
        ? article.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [],
      parsedAt: new Date().toISOString(),
    };

    // Convert the object to a formatted JSON string and update the state
    setFinalJsonOutput(JSON.stringify(finalData, null, 2));
  };

  // --- Live Preview Values (derived from state) ---
  const truncatedText =
    article.text.substring(0, 300) + (article.text.length > 300 ? "..." : "");
  const sourceUrlDisplay =
    article.sourceUrl.length > 40
      ? article.sourceUrl.substring(0, 40) + "..."
      : article.sourceUrl;

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <main className="container max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          News Article JSON Generator
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Form Section */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={article.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
            />

            {/* Summary */}
            <label
              htmlFor="summary"
              className="block text-sm font-semibold text-gray-700 mt-4"
            >
              Summary (Short Description):
            </label>
            <textarea
              id="summary"
              name="summary"
              rows="3"
              value={article.summary}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
            ></textarea>

            {/* Full Text */}
            <label
              htmlFor="text"
              className="block text-sm font-semibold text-gray-700 mt-4"
            >
              Full Text/Description:
            </label>
            <textarea
              id="text"
              name="text"
              rows="8"
              value={article.text}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
            ></textarea>

            {/* Tags */}
            <label
              htmlFor="tags"
              className="block text-sm font-semibold text-gray-700 mt-4"
            >
              Tags (Comma-separated):
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={article.tags}
              onChange={handleInputChange}
              placeholder="politics, economy, india"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
            />

            {/* Source URL */}
            <label
              htmlFor="sourceUrl"
              className="block text-sm font-semibold text-gray-700 mt-4"
            >
              Source URL:
            </label>
            <input
              type="text"
              id="sourceUrl"
              name="sourceUrl"
              value={article.sourceUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/article"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
            />

            {/* Source Name */}
            <label
              htmlFor="sourceName"
              className="block text-sm font-semibold text-gray-700 mt-4"
            >
              Source Name:
            </label>
            <input
              type="text"
              id="sourceName"
              name="sourceName"
              value={article.sourceName}
              onChange={handleInputChange}
              placeholder="NDTV"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
            />

            {/* Paste Area */}
            <label
              htmlFor="jsonPasteArea"
              className="block text-sm font-semibold text-gray-700 mt-4"
            >
              Paste JSON Here (to fill fields):
            </label>
            <textarea
              id="jsonPasteArea"
              rows="4"
              value={jsonPasteContent}
              onChange={(e) => setJsonPasteContent(e.target.value)}
              placeholder="Paste the JSON object here to fill the form..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
            ></textarea>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                type="button"
                onClick={handleParseJson}
                className="flex-1 w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
              >
                Parse JSON into Fields
              </button>
              <button
                type="submit"
                className="flex-1 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Generate Final JSON Object
              </button>
            </div>
          </div>

          {/* Preview & Output Section */}
          <div className="flex-1 min-w-0">
            {/* Live Preview */}
            <h2 className="text-xl font-bold text-gray-800">
              Live Article Preview:
            </h2>
            <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[200px]">
              <div className="text-2xl font-bold text-gray-900 mb-2 break-words">
                {article.title || "[Title will appear here]"}
              </div>
              <div className="italic text-gray-600 border-l-4 border-blue-500 pl-4 py-1 mb-3 break-words">
                {article.summary || "[Summary will appear here]"}
              </div>
              <p className="text-gray-700 break-words">
                {truncatedText || "[Full Text (truncated) will appear here]"}
              </p>
              <div className="text-sm text-gray-500 mt-4 border-t border-gray-200 pt-2 break-words">
                Source: <strong>{article.sourceName || "[Source Name]"}</strong>{" "}
                (
                <a
                  href={article.sourceUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {sourceUrlDisplay || "Link"}
                </a>
                )
              </div>
            </div>

            {/* Final JSON Output */}
            <h2 className="text-xl font-bold text-gray-800 mt-8">
              Final JSON Output:
            </h2>
            <div className="mt-2 p-4 bg-gray-100 border border-gray-200 rounded-md min-h-[200px] overflow-x-auto">
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-gray-800">
                {finalJsonOutput}
              </pre>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default NewsParse;
