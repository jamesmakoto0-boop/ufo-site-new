import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';

const MovieCard = ({ movie, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 w-48 md:w-56 cursor-pointer transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className={`relative rounded overflow-hidden transition-all duration-300 ${
          isHovered ? 'scale-110 z-50 shadow-2xl' : 'scale-100'
        }`}
      >
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-full h-72 object-cover"
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <button className="bg-white hover:bg-gray-200 text-black rounded-full p-2 transition-colors">
                  <Play size={16} fill="black" />
                </button>
                <button className="bg-transparent border-2 border-white hover:border-gray-300 text-white rounded-full p-2 transition-colors">
                  <Plus size={16} />
                </button>
                <button className="bg-transparent border-2 border-white hover:border-gray-300 text-white rounded-full p-2 transition-colors">
                  <ThumbsUp size={16} />
                </button>
                <button className="bg-transparent border-2 border-white hover:border-gray-300 text-white rounded-full p-2 ml-auto transition-colors">
                  <ChevronDown size={16} />
                </button>
              </div>
              <h3 className="text-white font-semibold text-sm line-clamp-1">{movie.title}</h3>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-green-500 font-semibold">{movie.vote_average * 10}% Match</span>
                <span className="text-gray-400">{movie.release_date?.split('-')[0]}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;