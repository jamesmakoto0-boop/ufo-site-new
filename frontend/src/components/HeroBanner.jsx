import React from 'react';
import { Play, Info } from 'lucide-react';
import { Button } from './ui/button';

const HeroBanner = ({ movie, onPlayTrailer }) => {
  if (!movie) return null;

  return (
    <div className="relative h-[80vh] w-full">
      <div className="absolute inset-0">
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-4 md:px-12">
        <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
            {movie.title}
          </h1>
          <p className="text-base md:text-lg text-white/90 line-clamp-3 drop-shadow-lg">
            {movie.overview}
          </p>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => onPlayTrailer(movie)}
              className="bg-white text-black hover:bg-white/80 font-semibold px-8 py-6 text-lg rounded transition-all duration-200 hover:scale-105"
            >
              <Play className="mr-2" size={24} fill="black" />
              Play
            </Button>
            <Button
              onClick={() => onPlayTrailer(movie)}
              className="bg-gray-500/70 text-white hover:bg-gray-500/50 font-semibold px-8 py-6 text-lg rounded transition-all duration-200 hover:scale-105"
            >
              <Info className="mr-2" size={24} />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;