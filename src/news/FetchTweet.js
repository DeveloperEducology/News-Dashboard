import React, { useState, useCallback, useRef, useEffect } from "react";

// ==================================================================================
// 1. CONSTANTS & DEFAULTS
// ==================================================================================

const ALL_CATEGORIES = [
  "Sports",
  "Entertainment",
  "Politics",
  "National",
  "International",
  "Telangana",
  "AndhraPradesh",
  "Viral",
  "Video",
];

const DEFAULT_POST_TEMPLATE = {
  title: "",
  summary: "",
  text: "",
  imageUrl: "",
  url: "",
  twitterUrl: "",
  categories: [],
  isPublished: true,
  source: "manual",
  sourceType: "manual",
  lang: "en",
  type: "normal_post",
  isStory: false,
  isShowReadButton: false,
  isBookmarked: false,
  tweetId: "",
  media: [],
  videoUrl: "",
};

// ==================================================================================
// 2. CHILD COMPONENTS (MultiSelectDropdown, FormField)
// ==================================================================================

const MultiSelectDropdown = ({ options, selectedOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionToggle = (option) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    onChange(newSelection);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-left flex justify-between items-center"
      >
        <span className="text-gray-200">
          {selectedOptions.length > 0
            ? `${selectedOptions.length} selected`
            : "Select Categories"}
        </span>
        <span className="text-gray-400">▼</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionToggle(option)}
                className="form-checkbox h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-gray-200">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const FormField = ({
  path,
  fieldKey,
  fieldValue,
  onFieldChange,
  onItemRemove,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const currentPath = [...path, fieldKey];
  const fieldId = currentPath.join(".");

  if (fieldKey === "categories" && Array.isArray(fieldValue)) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
          Categories
        </label>
        <MultiSelectDropdown
          options={ALL_CATEGORIES}
          selectedOptions={fieldValue}
          onChange={(newSelection) => onFieldChange(currentPath, newSelection)}
        />
      </div>
    );
  }

  if (fieldKey === "type") {
    return (
      <div className="mb-4">
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-300 mb-1 capitalize"
        >
          Type
        </label>
        <select
          id={fieldId}
          value={fieldValue}
          onChange={(e) => onFieldChange(currentPath, e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200"
        >
          <option value="normal_post">Normal Post</option>
          <option value="full_post">Full Post</option>
        </select>
      </div>
    );
  }

  if (
    ["isPublished", "isBookmarked", "isStory", "isShowReadButton"].includes(
      fieldKey
    )
  ) {
    return (
      <div className="mb-4 flex items-center space-x-3 pl-1">
        <input
          id={fieldId}
          type="checkbox"
          checked={!!fieldValue}
          onChange={(e) => onFieldChange(currentPath, e.target.checked)}
          className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-cyan-600 focus:ring-cyan-500"
        />
        <label htmlFor={fieldId} className="text-sm text-gray-300 capitalize">
          {fieldKey.replace(/([A-Z])/g, " $1").replace("is ", "")}
        </label>
      </div>
    );
  }

  if (Array.isArray(fieldValue)) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="text-md font-semibold text-cyan-400 capitalize mb-2">
          {fieldKey.replace(/_/g, " ")}
        </h4>
        {fieldValue.map((item, index) => (
          <div
            key={index}
            className="relative bg-gray-700/50 p-4 rounded-lg mb-4 border border-gray-600"
          >
            <button
              type="button"
              onClick={() => onItemRemove(currentPath, index)}
              title="Remove this item"
              className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {Object.entries(item).map(([key, value]) => (
              <FormField
                key={key}
                path={[...currentPath, index]}
                fieldKey={key}
                fieldValue={value}
                onFieldChange={onFieldChange}
                onItemRemove={onItemRemove}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (typeof fieldValue === "object" && fieldValue !== null) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="text-md font-semibold text-cyan-400 capitalize mb-2">
          {fieldKey.replace(/_/g, " ")}
        </h4>
        {Object.entries(fieldValue).map(([key, value]) => (
          <FormField
            key={key}
            path={currentPath}
            fieldKey={key}
            fieldValue={value}
            onFieldChange={onFieldChange}
            onItemRemove={onItemRemove}
          />
        ))}
      </div>
    );
  }

  const isLongText = typeof fieldValue === "string" && fieldValue.length > 100;
  const InputComponent = isLongText ? "textarea" : "input";
  const fieldsWithCopyIcon = [
    "title",
    "summary",
    "text",
    "imageUrl",
    "url",
    "twitterUrl",
  ];
  const canCopy =
    fieldsWithCopyIcon.includes(fieldKey) &&
    typeof fieldValue === "string" &&
    fieldValue.length > 0;

  const handleCopy = () => {
    if (!fieldValue) return;
    navigator.clipboard.writeText(fieldValue).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-300 mb-1 capitalize"
      >
        {fieldKey.replace(/_/g, " ")}
      </label>
      <div className="relative flex items-center">
        <InputComponent
          id={fieldId}
          type="text"
          rows={isLongText ? 4 : undefined}
          value={fieldValue || ""}
          onChange={(e) => onFieldChange(currentPath, e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200 pr-10"
        />
        {canCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            title="Copy"
          >
            {isCopied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// ==================================================================================
// 3. GENERIC FORM COMPONENT (WITH CRITICAL FIX)
// ==================================================================================

const GenericForm = ({
  initialData,
  onSave,
  onCancel,
  isSaving,
  title,
  submitButtonText,
  submitButtonColor = "bg-green-600 hover:bg-green-700",
}) => {
  const [formData, setFormData] = useState(initialData);

  // ✅ FINAL FIX #1: This is the most critical change.
  // This `useEffect` hook ensures that if the `initialData` prop changes
  // (e.g., after a tweet is fetched), the form's internal state is reset
  // to show that new data.
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleFieldChange = useCallback((path, newValue) => {
    setFormData((currentData) => {
      const newData = JSON.parse(JSON.stringify(currentData));
      let temp = newData;
      for (let i = 0; i < path.length - 1; i++) {
        temp = temp[path[i]];
      }
      temp[path[path.length - 1]] = newValue;
      return newData;
    });
  }, []);

  const handleItemRemove = useCallback((path, indexToRemove) => {
    setFormData((currentData) => {
      const newData = JSON.parse(JSON.stringify(currentData));
      let targetArray = newData;
      for (const key of path) {
        targetArray = targetArray[key];
      }
      if (Array.isArray(targetArray)) {
        targetArray.splice(indexToRemove, 1);
      }
      return newData;
    });
  }, []);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Cancel
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}
      >
        {Object.entries(formData).map(([key, value]) => (
          <FormField
            key={key}
            path={[]}
            fieldKey={key}
            fieldValue={value}
            onFieldChange={handleFieldChange}
            onItemRemove={handleItemRemove}
          />
        ))}
        <div className="text-center mt-8">
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full sm:w-auto ${submitButtonColor} disabled:bg-gray-500 text-white font-bold py-2 px-8 rounded-lg`}
          >
            {isSaving ? "Saving..." : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==================================================================================
// 4. MAIN APP COMPONENT (WITH SIMPLIFIED LOGIC)
// ==================================================================================

export default function FetchTweetApp() {
  const API_BASE_URL = "http://localhost:4000/api";
  // const API_BASE_URL = 'https://twitterapi-node.onrender.com/api';

  // ✅ FINAL FIX #2: Simplified state. `activePost` now holds the data for ANY form, create or edit.
  const [activePost, setActivePost] = useState(null);
  const [viewMode, setViewMode] = useState("fetch"); // "fetch", "form"

  const [tweetId, setTweetId] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const handleReturnToFetch = () => {
    setActivePost(null);
    setTweetId("");
    setSelectedCategories([]);
    setError(null);
    setSaveSuccess(null);
    setViewMode("fetch");
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    const regex = /(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/(\d+)/;
    const match = value.match(regex);
    setTweetId(match ? match[1] : value);
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((cat) => cat !== value)
    );
  };

  const fetchTweet = async () => {
    if (!tweetId) {
      setError("Please provide a Tweet ID or URL.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSaveSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/formatted-tweet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tweet_ids: [tweetId],
          categories: selectedCategories,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (data?.tweets?.length > 0) {
        const fetchedPost = data.tweets[0];
        // ✅ FINAL FIX #3: The ONLY state updates needed. Set the data and change the view.
        setActivePost(fetchedPost);
        setViewMode("form");
      } else {
        throw new Error("No tweet data found in the response.");
      }
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FINAL FIX #4: Unified save handler for both creating and updating.
  const handleSave = async (postData) => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(null);

    const isUpdating = !!postData._id;
    const apiUrl = isUpdating
      ? `${API_BASE_URL}/post/${postData._id}`
      : `${API_BASE_URL}/post`;
    const method = isUpdating ? "PUT" : "POST";

    // The backend schema is the source of truth, so we create a clean payload.
    const payload = { ...DEFAULT_POST_TEMPLATE, ...postData };

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to save the post.");

      setSaveSuccess(
        `Post ${isUpdating ? "updated" : "created"} successfully!`
      );
      handleReturnToFetch();
    } catch (err) {
      setError(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNew = () => {
    setActivePost(DEFAULT_POST_TEMPLATE);
    setViewMode("form");
  };

  const renderContent = () => {
    if (viewMode === "form") {
      const isUpdating = !!activePost?._id;
      return (
        <GenericForm
          key={activePost?._id || "new-post"} // Key forces re-mount when post changes
          initialData={activePost}
          onSave={handleSave}
          onCancel={handleReturnToFetch}
          isSaving={isSaving}
          title={isUpdating ? "Edit Post Data" : "Create New Post"}
          submitButtonText={isUpdating ? "Update Post" : "Create Post"}
          submitButtonColor={
            isUpdating
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }
        />
      );
    }

    // Default view is "fetch"
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
            Content Manager
          </h1>
          <p className="text-gray-400 mt-2">
            Fetch tweet data to edit or create a new post from scratch.
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="tweetId"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Tweet ID or URL
            </label>
            <input
              id="tweetId"
              type="text"
              value={tweetId}
              onChange={handleInputChange}
              placeholder="e.g., 1968713335798390839 or paste URL"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Assign Initial Categories
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              {ALL_CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2 cursor-pointer text-gray-200 hover:text-cyan-400"
                >
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
        </div>
        <div className="text-center mt-8 space-y-4">
          <button
            onClick={fetchTweet}
            disabled={isLoading}
            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-bold py-2 px-8 rounded-lg"
          >
            {isLoading ? "Fetching..." : "Fetch & Edit"}
          </button>
          <div className="text-gray-400">or</div>
          <button
            onClick={handleCreateNew}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-lg"
          >
            Create Blank Post
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {renderContent()}
        <div className="mt-6 text-center">
          {error && (
            <div
              className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-2xl"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {saveSuccess && (
            <div
              className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-2xl"
              role="alert"
            >
              <strong className="font-bold">Success: </strong>
              <span className="block sm:inline">{saveSuccess}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
