import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiX, FiSearch, FiPlus, FiTrash2 } from "react-icons/fi";
import {
  DEFAULT_POST_STATE,
  ALL_CATEGORIES,
  POST_TYPES,
  API_BASE_URL,
} from "../constants/config";
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
} from "./FormElements";
import useDebounce from "../hooks/useDebounce";

export default function PostFormModal({
  post,
  onSave,
  onClose,
  onOpenGallery,
}) {
  const [formData, setFormData] = useState(DEFAULT_POST_STATE);
  const [tagInput, setTagInput] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tags`);
        const data = await response.json();
        if (data.status === "success") {
          setAllTags(data.tags.map((t) => t.name));
        }
      } catch (error) {
        toast.error("Could not load tags.");
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (!post) {
      setFormData(DEFAULT_POST_STATE);
      return;
    }

    const normalizedPost = { ...post };

    // Normalize _id
    if (normalizedPost._id?.$oid) {
      normalizedPost._id = normalizedPost._id.$oid;
    }

    // Normalize date fields
    const dateFields = [
      "scheduledFor",
      "createdAt",
      "publishedAt",
      "updatedAt",
    ];
    dateFields.forEach((field) => {
      if (normalizedPost[field]?.$date) {
        normalizedPost[field] = normalizedPost[field].$date;
      }
    });

    // Ensure media is always an array
    if (!normalizedPost.media) {
      normalizedPost.media = [];
    }

    // Normalize tags
    const normalizedTags =
      post.tags
        ?.map((t) => (typeof t === "object" ? t.name : t))
        .filter(Boolean) || [];

    const initialData = {
      ...DEFAULT_POST_STATE,
      ...normalizedPost,
      tags: normalizedTags,
    };

    setFormData(initialData);
  }, [post]);

  useEffect(() => {
    if (debouncedSearchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const searchPosts = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/posts/search?q=${debouncedSearchQuery}`
        );
        const data = await res.json();
        if (data.status === "success") {
          const currentRelatedIds = new Set(
            formData.relatedStories.map((s) => s._id)
          );
          const filteredResults = data.posts.filter(
            (p) => p._id !== formData._id && !currentRelatedIds.has(p._id)
          );
          setSearchResults(filteredResults);
        }
      } catch (error) {
        toast.error("Failed to search for posts.");
      } finally {
        setIsSearching(false);
      }
    };
    searchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, formData._id]);

  const handleChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleMediaChange = (index, field, value) => {
    setFormData((prev) => {
      const newMedia = [...(prev.media || [])];
      newMedia[index] = { ...newMedia[index], [field]: value };
      return { ...prev, media: newMedia };
    });
  };

  const addMediaItem = () => {
    setFormData((prev) => ({
      ...prev,
      media: [
        ...(prev.media || []),
        { type: "photo", url: "", altText: "", overlayPosition: "middle" },
      ],
    }));
  };

  const removeMediaItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      media: (prev.media || []).filter((_, i) => i !== index),
    }));
  };

  // --- UPDATED: handleSubmit logic ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFormData = { ...formData };

    // If imageUrl is blank AND the media array has items, use the first media item's url as a fallback.
    // Otherwise, the manually entered imageUrl is preserved.
    if (
      !finalFormData.imageUrl &&
      finalFormData.media &&
      finalFormData.media.length > 0
    ) {
      finalFormData.imageUrl = finalFormData.media[0].url;
    }

    onSave(finalFormData);
  };

  const handleCategoriesChange = (category) => {
    const current = formData.categories || [];
    const newCategories = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setFormData((prev) => ({ ...prev, categories: newCategories }));
  };

  const handleRemoveRelated = (storyId) => {
    setFormData((prev) => ({
      ...prev,
      relatedStories: (prev.relatedStories || []).filter(
        (s) => s._id !== storyId
      ),
    }));
  };

  const handleAddRelated = (story) => {
    setFormData((prev) => ({
      ...prev,
      relatedStories: [...(prev.relatedStories || []), story],
    }));
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    if (value.trim()) {
      setSuggestions(
        allTags
          .filter(
            (t) =>
              t.toLowerCase().startsWith(value.toLowerCase()) &&
              !formData.tags.includes(t)
          )
          .slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
    }
    setTagInput("");
    setSuggestions([]);
  };

  const handleAddTagOnEnter = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl max-h-[95vh] rounded-xl flex flex-col"
      >
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {formData._id ? "Edit Post" : "Create Post"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <FormTextarea
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={3}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="relative">
              <div className="p-2 bg-gray-50 rounded-lg border flex flex-wrap gap-2 items-center">
                {(formData.tags || []).map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleAddTagOnEnter}
                  placeholder="Add a tag..."
                  className="flex-1 bg-transparent focus:outline-none p-1"
                />
              </div>
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                  {suggestions.map((s) => (
                    <div
                      key={s}
                      onClick={() => addTag(s)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- NEW: Dedicated imageUrl Input --- */}
          <FormInput
            label="Featured Image URL"
            name="imageUrl"
            value={formData.imageUrl || ""}
            onChange={handleChange}
            placeholder="https://... (from RSS or manual entry)"
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Media Gallery
            </label>
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              {(formData.media || []).map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-white border rounded-md shadow-sm relative"
                >
                  <button
                    type="button"
                    onClick={() => removeMediaItem(index)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"
                    title="Remove Media Item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label={`Media URL #${index + 1}`}
                      placeholder="https://..."
                      value={item.url}
                      onChange={(e) =>
                        handleMediaChange(index, "url", e.target.value)
                      }
                    />
                    <FormInput
                      label="Alt Text"
                      placeholder="Describe the image"
                      value={item.altText}
                      onChange={(e) =>
                        handleMediaChange(index, "altText", e.target.value)
                      }
                    />
                    <FormSelect
                      label="Overlay Position"
                      value={item.overlayPosition}
                      onChange={(e) =>
                        handleMediaChange(
                          index,
                          "overlayPosition",
                          e.target.value
                        )
                      }
                      options={["top", "middle", "bottom"]}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addMediaItem}
                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg text-blue-600 hover:bg-blue-50"
              >
                <FiPlus /> Add Media Item
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Related Stories
            </label>
            <div className="relative">
              <div className="flex items-center border rounded-lg bg-gray-50">
                <FiSearch className="text-gray-400 mx-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search to add related stories..."
                  className="w-full bg-transparent focus:outline-none p-2"
                />
              </div>
              {(isSearching || searchResults.length > 0) && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {isSearching && (
                    <div className="px-4 py-2 text-gray-500">Searching...</div>
                  )}
                  {!isSearching &&
                    searchResults.map((result) => (
                      <div
                        key={result._id}
                        onClick={() => handleAddRelated(result)}
                        className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                      >
                        <span className="truncate">{result.title}</span>
                        <FiPlus className="text-blue-500" />
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border min-h-[60px]">
              {(formData.relatedStories?.length || 0) === 0 ? (
                <p className="text-sm text-gray-500">
                  No related stories added.
                </p>
              ) : (
                <div className="space-y-2">
                  {formData.relatedStories.map((s) => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between bg-white p-2 border rounded-md"
                    >
                      <p className="text-sm truncate pr-2">{s.title}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveRelated(s._id)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                        title="Exclude"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <FormTextarea
            label="Full Text"
            name="text"
            value={formData.text || ""}
            onChange={handleChange}
            rows={5}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label="Video URL"
              name="videoUrl"
              value={formData.videoUrl || ""}
              onChange={handleChange}
            />
            <FormInput
              label="Source URL"
              name="url"
              value={formData.url || ""}
              onChange={handleChange}
            />
            <FormInput
              label="Twitter URL"
              name="twitterUrl"
              value={formData.twitterUrl || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label="Source Name"
              name="source"
              value={formData.source}
              onChange={handleChange}
            />
            <FormSelect
              label="Language"
              name="lang"
              value={formData.lang}
              onChange={handleChange}
              options={["te", "en"]}
            />
            <FormSelect
              label="Source Type"
              name="sourceType"
              value={formData.sourceType}
              onChange={handleChange}
              options={["manual", "rss", "tweet_api"]}
            />
            <FormSelect
              label="Post Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={POST_TYPES}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categories</label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoriesChange(cat)}
                  className={`px-3 py-1.5 text-sm rounded-full border-2 ${
                    formData.categories?.includes(cat)
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
            <FormInput
              type="datetime-local"
              label="Schedule Publication"
              name="scheduledFor"
              value={
                formData.scheduledFor ? formData.scheduledFor.slice(0, 16) : ""
              }
              onChange={handleChange}
            />
            <FormInput
              type="number"
              label="Pin to Position"
              name="pinnedIndex"
              placeholder="Leave blank to unpin"
              value={
                formData.pinnedIndex !== null ? formData.pinnedIndex + 1 : ""
              }
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  pinnedIndex:
                    e.target.value === ""
                      ? null
                      : Math.max(0, parseInt(e.target.value, 10) - 1),
                }));
              }}
              min="1"
            />
          </div>

          <div className="flex items-center gap-x-6 pt-2">
            <FormCheckbox
              label="Publish"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            <FormCheckbox
              label="Breaking News"
              name="isBreaking"
              checked={formData.isBreaking}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-auto p-5 bg-gray-50 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold"
          >
            Save Post
          </button>
        </div>
      </form>
    </div>
  );
}
