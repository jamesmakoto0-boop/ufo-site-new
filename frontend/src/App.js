import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import MovieRow from './components/MovieRow';
import TrailerModal from './components/TrailerModal';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      const [featured, trending, popular, topRated, action] = await Promise.all([
        axios.get(`${API}/movies/featured`),
        axios.get(`${API}/movies/trending`),
        axios.get(`${API}/movies/popular`),
        axios.get(`${API}/movies/top_rated`),
        axios.get(`${API}/movies/action`),
      ]);

      setFeaturedMovie(featured.data);
      setTrendingMovies(trending.data.movies);
      setPopularMovies(popular.data.movies);
      setTopRatedMovies(topRated.data.movies);
      setActionMovies(action.data.movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast({
        title: 'Error loading movies',
        description: 'Please refresh the page to try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrailer = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(`${API}/movies/search?query=${query}`);
      const results = response.data.movies;
      
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
    } catch (error) {
      console.error('Error searching movies:', error);
      toast({
        title: 'Search failed',
        description: 'Please try again',
        variant: 'destructive',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading Netflix...</div>
      </div>
    );
  }

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
                movies={trendingMovies}
                onMovieClick={handlePlayTrailer}
              />
              <MovieRow
                title="Popular on Netflix"
                movies={popularMovies}
                onMovieClick={handlePlayTrailer}
              />
              <MovieRow
                title="Top Rated"
                movies={topRatedMovies}
                onMovieClick={handlePlayTrailer}
              />
              <MovieRow
                title="Action & Adventure"
                movies={actionMovies}
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