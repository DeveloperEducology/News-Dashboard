import React from "react";
import { FiMenu, FiBell } from "react-icons/fi";

export default function Header({ onMenuClick }) {
  return (
    <header className="flex-shrink-0 bg-white shadow-sm p-4 flex justify-between items-center md:justify-end">
      <button onClick={onMenuClick} className="sm:hidden p-2 text-gray-600">
        <FiMenu size={24} />
      </button>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg px-3 py-2 hidden sm:block"
        />
        <FiBell className="text-2xl text-gray-500" />
      </div>
    </header>
  );
}