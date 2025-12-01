import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies, onMovieClick }) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const { current } = rowRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      setTimeout(() => {
        const { scrollLeft, scrollWidth, clientWidth } = current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }, 300);
    }
  };

  return (
    <div className="space-y-2 px-4 md:px-12 py-4 group">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft className="text-white" size={40} />
          </button>
        )}
        
        <div
          ref={rowRef}
          className="flex space-x-2 overflow-x-hidden scroll-smooth"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie)} />
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight className="text-white" size={40} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;