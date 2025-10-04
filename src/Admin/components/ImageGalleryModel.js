import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiXCircle, FiCheck } from 'react-icons/fi';
import { API_BASE_URL } from '../constants/config';

export default function ImageGalleryModal({ onSelectImage, onClose }) {
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`${API_BASE_URL}/images?limit=100`);
        const data = await res.json();
        if (data.status === "success") setImages(data.images);
      } catch (e) {
        toast.error("Failed to load images.");
      }
    }
    fetchImages();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl flex flex-col">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Select Image</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiXCircle size={24} />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {images.map((img) => (
              <div
                key={img._id}
                className="relative w-full aspect-square rounded-lg cursor-pointer group overflow-hidden"
                onClick={() => onSelectImage(img.imageUrl)}
              >
                <img
                  src={img.imageUrl}
                  alt={img.title || ""}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiCheck size={30} className="text-white bg-blue-600 rounded-full p-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}