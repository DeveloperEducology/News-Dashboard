// src/news/NewArticle.js
import React from "react";

const initialFormData = {
  tweetId: "",
  categories: [],
  imageUrl: "",
  isBookmarked: false,
  isPublished: true,
  lang: "te", // default Telugu
  media: [],
  summary: "",
  text: "",
  title: "",
  twitterUrl: "",
  type: "normal_post",
  url: "",
};

export default function NewArticle() {
  const [formData, setFormData] = React.useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState("");

  // 🔹 Handle text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  // 🔹 Handle checkboxes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // 🔹 Handle categories
  const handleCategoriesChange = (e) => {
    const { value } = e.target;
    const categoriesArray = value
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat);
    setFormData((prev) => ({ ...prev, categories: categoriesArray }));
  };

  // 🔹 Handle media fields
  const handleMediaChange = (index, field, value) => {
    const updatedMedia = [...formData.media];
    updatedMedia[index] = { ...updatedMedia[index], [field]: value ?? "" };
    setFormData((prev) => ({ ...prev, media: updatedMedia }));
  };

  const addMediaItem = () => {
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, { type: "photo", url: "", width: "", height: "" }],
    }));
  };

  const removeMediaItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("Posting article to the database...");

    try {
      console.log(
        "Submitting the following data:",
        JSON.stringify(formData, null, 2)
      );

      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate API call

      setMessage("Article posted successfully!");
      setFormData(initialFormData); // reset form
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  // 🔹 Reusable form field
  const FormField = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = false,
    component = "input",
  }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        {label}
      </label>
      {component === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          rows="3"
          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required={required}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={type === "number" ? value || "" : value || ""}
          onChange={onChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required={required}
        />
      )}
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-blue-400">
          Create New Article (కొత్త కథనం)
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Fill in the details below to publish a new article.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Title (శీర్షిక)"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            component="textarea"
            required={true}
          />
          <FormField
            label="Summary (సారాంశం)"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            component="textarea"
            required={true}
          />
          <FormField
            label="Text Content (వ్యాసం)"
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            component="textarea"
          />

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              type="url"
            />
            <FormField
              label="Twitter URL"
              name="twitterUrl"
              value={formData.twitterUrl}
              onChange={handleInputChange}
              type="url"
            />
            <FormField
              label="Source URL"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              type="url"
            />
            <FormField
              label="Tweet ID"
              name="tweetId"
              value={formData.tweetId}
              onChange={handleInputChange}
            />
          </div>

          {/* Language + Type + Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              label="Language (e.g., te, en)"
              name="lang"
              value={formData.lang}
              onChange={handleInputChange}
            />
            <FormField
              label="Post Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            />

            <div>
              <label
                htmlFor="categories"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Categories (comma-separated)
              </label>
              <input
                id="categories"
                name="categories"
                value={formData.categories.join(", ")}
                onChange={handleCategoriesChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Media Items */}
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              Media Items
            </h3>
            {formData.media.map((mediaItem, index) => (
              <div
                key={index}
                className="p-4 border border-gray-700 rounded-lg mb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 🔹 Dropdown for media type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Media Type
                    </label>
                    <select
                      value={mediaItem.type}
                      onChange={(e) =>
                        handleMediaChange(index, "type", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                      <option value="gif">GIF</option>
                    </select>
                  </div>

                  <FormField
                    label="Media URL"
                    name="url"
                    value={mediaItem.url}
                    onChange={(e) =>
                      handleMediaChange(index, "url", e.target.value)
                    }
                    type="url"
                  />
                  <FormField
                    label="Width"
                    name="width"
                    value={mediaItem.width}
                    onChange={(e) =>
                      handleMediaChange(index, "width", e.target.value)
                    }
                    type="number"
                  />
                  <FormField
                    label="Height"
                    name="height"
                    value={mediaItem.height}
                    onChange={(e) =>
                      handleMediaChange(index, "height", e.target.value)
                    }
                    type="number"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeMediaItem(index)}
                  className="mt-3 text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMediaItem}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              + Add Media Item
            </button>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center">
              <input
                id="isPublished"
                name="isPublished"
                type="checkbox"
                checked={formData.isPublished}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-600"
              />
              <label
                htmlFor="isPublished"
                className="ml-2 block text-sm text-gray-300"
              >
                Publish Immediately
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="isBookmarked"
                name="isBookmarked"
                type="checkbox"
                checked={formData.isBookmarked}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-600"
              />
              <label
                htmlFor="isBookmarked"
                className="ml-2 block text-sm text-gray-300"
              >
                Bookmark
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 text-center">
            {message && (
              <p
                className={`mb-4 text-sm ${
                  message.includes("error")
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto inline-flex justify-center py-3 px-12 border border-transparent shadow-lg text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:bg-blue-900 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? "Posting..." : "Post Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
