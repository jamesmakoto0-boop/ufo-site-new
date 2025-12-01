import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const TrailerModal = ({ movie, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full bg-black border-gray-800 p-0 overflow-hidden">
        <DialogHeader className="absolute top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="bg-black/50 hover:bg-black rounded-full p-2 transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </DialogHeader>
        
        <div className="relative">
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1&modestbranding=1&rel=0`}
              title={movie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="p-8 space-y-4 bg-gradient-to-t from-black to-transparent">
            <DialogTitle className="text-white text-3xl font-bold">{movie.title}</DialogTitle>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-green-500 font-semibold text-lg">
                {Math.round(movie.vote_average * 10)}% Match
              </span>
              <span className="text-gray-400">{movie.release_date?.split('-')[0]}</span>
              <span className="border border-gray-400 px-2 py-0.5 text-gray-400 text-xs">
                HD
              </span>
            </div>
            
            <p className="text-gray-300 text-base leading-relaxed">{movie.overview}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;