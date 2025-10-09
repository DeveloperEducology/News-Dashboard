import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

// Layout Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PostFormModal from "./components/PostFormModal";
import ImageGalleryModal from "./components/ImageGalleryModel";

// Page Components
import DashboardHomePage from "./pages/DashboardHomePage";
import PostsListPage from "./pages/PostsListPage";
import StickyPostsPage from "./pages/StickyPostsPage";
import FetchTweetPage from "./pages/FetchTweetPage";
import JsonParserPage from "./pages/JsonParserPage";
import SettingsPage from "./pages/SettingsPage";
import VideoManagementPage from "./pages/VideoManagementPage";
// Constants
import { API_BASE_URL, DEFAULT_POST_STATE } from "./constants/config";

export default function AdminDashboard() {
  const [view, setView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [onSaveSuccessCallback, setOnSaveSuccessCallback] = useState(null);

  const handleOpenModal = (post = null, onSaveSuccess = () => {}) => {
    // If editing, fetch the latest version of the post in the background
    // to ensure the data is fresh, but open the modal immediately.
    if (post && post._id) {
      setEditingPost({ ...DEFAULT_POST_STATE, ...post });
      setIsModalOpen(true);
      setOnSaveSuccessCallback(() => onSaveSuccess);

      fetch(`${API_BASE_URL}/post/${post._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setEditingPost((prevPost) => ({ ...prevPost, ...data.post }));
          } else {
            throw new Error("Failed to refresh post details.");
          }
        })
        .catch((err) => {
          console.error("Background fetch failed:", err);
          toast.error("Could not load latest post details.");
        });
    } else {
      // For new posts, just use the default state or any provided data.
      setEditingPost(post ? { ...DEFAULT_POST_STATE, ...post } : DEFAULT_POST_STATE);
      setOnSaveSuccessCallback(() => onSaveSuccess);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setOnSaveSuccessCallback(null);
  };

  const handleSetImageUrl = (url) => {
    setEditingPost((prev) => ({ ...prev, imageUrl: url }));
    setIsGalleryOpen(false);
  };

  const handleSave = async (postData) => {
    const isUpdating = !!postData._id;
    const url = isUpdating ? `${API_BASE_URL}/post/${postData._id}` : `${API_BASE_URL}/post`;
    const method = isUpdating ? "PUT" : "POST";

    // Ensure tags and relatedStories are correctly formatted as arrays of strings/IDs
    const payload = {
      ...postData,
      tags: postData.tags?.map((tag) => (typeof tag === "object" ? tag.name : tag)) || [],
      relatedStories: postData.relatedStories?.map((story) => story._id) || [],
    };

    const promise = fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "An unknown error occurred.");
        return data;
      });

    toast.promise(promise, {
      loading: "Saving post...",
      success: () => {
        handleCloseModal();
        if (onSaveSuccessCallback) onSaveSuccessCallback();
        return `Post successfully ${isUpdating ? "updated" : "created"}!`;
      },
      error: (err) => `Error saving post: ${err.message}`,
    });
  };

  const renderView = () => {
    switch (view) {
      case "posts":
        return <PostsListPage onOpenModal={handleOpenModal} />;
      case "videos":
        return <VideoManagementPage />;
      case "sticky-posts":
        return <StickyPostsPage onOpenModal={handleOpenModal} />;
      case "fetch-tweet":
        return <FetchTweetPage onOpenModal={handleOpenModal} />;
      case "json-parser":
        return <JsonParserPage />;
      case "settings":
        return <SettingsPage />;
      case "dashboard":
      default:
        return <DashboardHomePage />;
    }
  };

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar currentView={view} setView={setView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="p-2 md:p-6 flex-1">{renderView()}</div>
        </main>
      </div>
      {isModalOpen && (
        <PostFormModal
          post={editingPost}
          onSave={handleSave}
          onClose={handleCloseModal}
          onOpenGallery={() => setIsGalleryOpen(true)}
        />
      )}
      {isGalleryOpen && (
        <ImageGalleryModal onSelectImage={handleSetImageUrl} onClose={() => setIsGalleryOpen(false)} />
      )}
    </>
  );
}