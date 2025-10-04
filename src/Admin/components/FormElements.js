import React, { memo } from 'react';
import { FiImage } from 'react-icons/fi';

export const FormInput = memo(({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500"
      {...props}
    />
  </div>
));

export const FormTextarea = memo(({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <textarea
      className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500"
      {...props}
    />
  </div>
));

export const FormSelect = memo(({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <select
      className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500"
      {...props}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </option>
      ))}
    </select>
  </div>
));

export const FormCheckbox = memo(({ label, ...props }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id={props.name}
      className="h-4 w-4 rounded border-gray-300 text-blue-600"
      {...props}
    />
    <label htmlFor={props.name} className="text-sm font-medium">
      {label}
    </label>
  </div>
));

export const ImageUrlInput = ({ value, onChange, onOpenGallery }) => (
  <div>
    <label className="block text-sm font-medium mb-1">Image URL</label>
    <div className="flex gap-2">
      <input
        name="imageUrl"
        value={value || ""}
        onChange={onChange}
        className="flex-1 border rounded-lg px-3 py-2 bg-gray-50"
        placeholder="https://..."
      />
      <button
        type="button"
        onClick={onOpenGallery}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1"
      >
        <FiImage size={18} />
        <span className="hidden sm:inline">Gallery</span>
      </button>
    </div>
  </div>
);