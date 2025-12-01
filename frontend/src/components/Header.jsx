import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import { Input } from './ui/input';

const Header = ({ onSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 text-2xl md:text-3xl font-bold tracking-wider cursor-pointer">
            NETFLIX
          </h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors text-sm">
              Home
            </a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors text-sm">
              TV Shows
            </a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors text-sm">
              Movies
            </a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors text-sm">
              New & Popular
            </a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors text-sm">
              My List
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center">
              {searchOpen ? (
                <Input
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 md:w-64 bg-black/70 border-white text-white placeholder:text-gray-400 pr-8 transition-all duration-300"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                />
              ) : null}
              <Search
                className="text-white cursor-pointer hover:text-gray-300 transition-colors absolute right-2"
                size={20}
                onClick={() => setSearchOpen(!searchOpen)}
              />
            </div>
          </form>
          <Bell className="text-white cursor-pointer hover:text-gray-300 transition-colors" size={20} />
          <div className="w-8 h-8 bg-red-600 rounded cursor-pointer"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;