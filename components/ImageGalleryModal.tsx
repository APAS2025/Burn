import React from 'react';
import { XIcon, TrashIcon, CameraIcon } from './Icons';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  onSelectImage: (imageData: string) => void;
  onDeleteImage: (index: number) => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ isOpen, onClose, images, onSelectImage, onDeleteImage }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-2xl bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-amber-400">Analysis History</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-all transform hover:scale-110"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={image}
                    alt={`Analyzed food ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => onSelectImage(image)}
                      className="text-white p-3 bg-white/20 rounded-full hover:bg-amber-400 hover:text-zinc-900 transition-colors"
                      title="Re-analyze this image"
                    >
                      <CameraIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteImage(index);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 transform hover:scale-110"
                    title="Delete image"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-zinc-400">
              <CameraIcon className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
              <h3 className="text-xl font-semibold text-zinc-300">No History Yet</h3>
              <p>Images you analyze with the AI camera will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryModal;
