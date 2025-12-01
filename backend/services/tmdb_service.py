import requests
import logging
from typing import List, Dict, Optional
import random

logger = logging.getLogger(__name__)

class TMDBService:
    def __init__(self):
        self.api_keys = [
            "c8dea14dc917687ac631a52620e4f7ad",
            "3cb41ecea3bf606c56552db3d17adefd"
        ]
        self.current_key_index = 0
        self.base_url = "https://api.themoviedb.org/3"
        self.image_base_url = "https://image.tmdb.org/t/p"
    
    def get_api_key(self) -> str:
        """Get current API key and rotate if needed"""
        return self.api_keys[self.current_key_index]
    
    def rotate_key(self):
        """Rotate to next API key"""
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        logger.info(f"Rotated to API key index: {self.current_key_index}")
    
    def make_request(self, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """Make request to TMDB API with key rotation on failure"""
        if params is None:
            params = {}
        
        for attempt in range(len(self.api_keys)):
            params['api_key'] = self.get_api_key()
            url = f"{self.base_url}{endpoint}"
            
            try:
                response = requests.get(url, params=params, timeout=10)
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 429:  # Rate limit
                    logger.warning(f"Rate limit hit on key {self.current_key_index}")
                    self.rotate_key()
                else:
                    logger.error(f"TMDB API error: {response.status_code}")
                    return None
            except Exception as e:
                logger.error(f"Request failed: {str(e)}")
                self.rotate_key()
        
        return None
    
    def get_trailer_key(self, movie_id: int, media_type: str = "movie") -> Optional[str]:
        """Get YouTube trailer key for a movie/show"""
        endpoint = f"/{media_type}/{movie_id}/videos"
        data = self.make_request(endpoint)
        
        if data and 'results' in data:
            # Find YouTube trailer
            for video in data['results']:
                if video.get('site') == 'YouTube' and video.get('type') == 'Trailer':
                    return video.get('key')
            # If no trailer, try teaser
            for video in data['results']:
                if video.get('site') == 'YouTube' and video.get('type') == 'Teaser':
                    return video.get('key')
        return None
    
    def format_movie(self, item: Dict, fetch_trailer: bool = False) -> Dict:
        """Format TMDB movie/show data to our format"""
        media_type = item.get('media_type', 'movie')
        movie_id = item.get('id')
        title = item.get('title') or item.get('name', 'Unknown Title')
        
        # Get trailer key only if explicitly requested
        trailer_key = "dQw4w9WgXcQ"  # Default fallback trailer
        if fetch_trailer:
            trailer_key = self.get_trailer_key(movie_id, media_type) or "dQw4w9WgXcQ"
        
        return {
            'id': movie_id,
            'title': title,
            'backdrop_path': f"{self.image_base_url}/original{item.get('backdrop_path')}" if item.get('backdrop_path') else None,
            'poster_path': f"{self.image_base_url}/w500{item.get('poster_path')}" if item.get('poster_path') else None,
            'overview': item.get('overview', ''),
            'vote_average': item.get('vote_average', 0),
            'release_date': item.get('release_date') or item.get('first_air_date', ''),
            'trailer_key': trailer_key,
            'media_type': media_type
        }
    
    def get_trending(self, limit: int = 20) -> List[Dict]:
        """Get trending movies and shows"""
        data = self.make_request('/trending/all/week')
        if data and 'results' in data:
            movies = [self.format_movie(item) for item in data['results'][:limit]]
            return [m for m in movies if m['backdrop_path'] and m['poster_path']]
        return []
    
    def get_popular(self, limit: int = 20) -> List[Dict]:
        """Get popular movies"""
        data = self.make_request('/movie/popular')
        if data and 'results' in data:
            movies = [self.format_movie(item) for item in data['results'][:limit]]
            return [m for m in movies if m['backdrop_path'] and m['poster_path']]
        return []
    
    def get_top_rated(self, limit: int = 20) -> List[Dict]:
        """Get top rated movies"""
        data = self.make_request('/movie/top_rated')
        if data and 'results' in data:
            movies = [self.format_movie(item) for item in data['results'][:limit]]
            return [m for m in movies if m['backdrop_path'] and m['poster_path']]
        return []
    
    def get_action(self, limit: int = 20) -> List[Dict]:
        """Get action movies (genre 28)"""
        data = self.make_request('/discover/movie', {'with_genres': '28', 'sort_by': 'popularity.desc'})
        if data and 'results' in data:
            movies = [self.format_movie(item) for item in data['results'][:limit]]
            return [m for m in movies if m['backdrop_path'] and m['poster_path']]
        return []
    
    def search_movies(self, query: str, limit: int = 20) -> List[Dict]:
        """Search for movies and shows"""
        data = self.make_request('/search/multi', {'query': query})
        if data and 'results' in data:
            # Filter only movies and tv shows
            items = [item for item in data['results'] if item.get('media_type') in ['movie', 'tv']]
            movies = [self.format_movie(item) for item in items[:limit]]
            return [m for m in movies if m['backdrop_path'] and m['poster_path']]
        return []
    
    def get_featured(self) -> Optional[Dict]:
        """Get a featured movie (first from trending)"""
        trending = self.get_trending(limit=1)
        return trending[0] if trending else None

# Singleton instance
tmdb_service = TMDBService()