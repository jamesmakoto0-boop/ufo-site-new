import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import MovieRow from './components/MovieRow';
import TrailerModal from './components/TrailerModal';
import { mockMovies, featuredMovie } from './mock';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const { toast } = useToast();

  const handlePlayTrailer = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleSearch = (query) => {
    const allMovies = [
      ...mockMovies.trending,
      ...mockMovies.popular,
      ...mockMovies.topRated,
      ...mockMovies.action,
    ];
    
    const results = allMovies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    
    if (results.length > 0) {
      setSearchResults(results);
      toast({
        title: `Found ${results.length} result${results.length > 1 ? 's' : ''}`,
        description: `Showing results for "${query}"`,
      });
    } else {
      setSearchResults([]);
      toast({
        title: "No results found",
        description: `No movies match "${query}"`,
        variant: "destructive",
      });
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  useEffect(() => {
    if (searchResults !== null) {
      window.scrollTo({ top: 800, behavior: 'smooth' });
    }
  }, [searchResults]);

  return (
    <div className="min-h-screen bg-black">
      <Header onSearch={handleSearch} />
      
      <main>
        <HeroBanner movie={featuredMovie} onPlayTrailer={handlePlayTrailer} />
        
        <div className="relative z-10 -mt-32 space-y-8 pb-20">
          {searchResults !== null ? (
            <div className="space-y-4">
              <div className="px-4 md:px-12 flex items-center justify-between">
                <h2 className="text-white text-2xl font-semibold">Search Results</h2>
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Clear Search
                </button>
              </div>
              {searchResults.length > 0 ? (
                <MovieRow
                  title=""
                  movies={searchResults}
                  onMovieClick={handlePlayTrailer}
                />
              ) : (
                <div className="px-4 md:px-12">
                  <p className="text-gray-400 text-center py-12">No movies found. Try another search.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <MovieRow
                title="Trending Now"
                movies={mockMovies.trending}
                onMovieClick={handlePlayTrailer}
              />
              <MovieRow
                title="Popular on Netflix"
                movies={mockMovies.popular}
                onMovieClick={handlePlayTrailer}
              />
              <MovieRow
                title="Top Rated"
                movies={mockMovies.topRated}
                onMovieClick={handlePlayTrailer}
              />
              <MovieRow
                title="Action & Adventure"
                movies={mockMovies.action}
                onMovieClick={handlePlayTrailer}
              />
            </>
          )}
        </div>
      </main>

      <TrailerModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      <Toaster />
    </div>
  );
}

export default App;