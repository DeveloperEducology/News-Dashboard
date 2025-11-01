import React from "react";
import { FiHome, FiFileText, FiSettings, FiTrendingUp, FiTwitter, FiCode, FiYoutube } from "react-icons/fi";

const NavItem = ({ viewName, icon, text, currentView, setView, setIsOpen }) => (
  <button
    onClick={() => {
      setView(viewName);
      setIsOpen(false);
    }}
    className={`flex items-center gap-3 px-3 py-2 rounded w-full text-left font-semibold transition-colors ${
      currentView === viewName ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {icon} {text}
  </button>
);

export default function Sidebar({ currentView, setView, isOpen, setIsOpen }) {
  const navItems = [
    { viewName: "dashboard", icon: <FiHome />, text: "Dashboard" },
    { viewName: "posts", icon: <FiFileText />, text: "Posts" },
    { viewName: "videos", icon: <FiFileText />, text: "Videos" },
    { viewName: "sticky-posts", icon: <FiTrendingUp />, text: "Sticky Posts" },
    { viewName: "fetch-tweet", icon: <FiTwitter />, text: "Fetch from Tweet" },
    { viewName: "json-parser", icon: <FiCode />, text: "JSON Parser" },
    { viewName: "youtube", icon: <FiYoutube />, text: "youtube" },
    { viewName: "settings", icon: <FiSettings />, text: "Settings" },
    { viewName: "swiper", icon: <FiSettings />, text: "Swiper Quick Edit" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="text-xl font-bold p-4 border-b">
        <span>NewsAdmin</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.viewName} {...item} currentView={currentView} setView={setView} setIsOpen={setIsOpen} />
        ))}
      </nav>
    </aside>
  );
}
