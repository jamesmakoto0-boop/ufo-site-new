# Netflix Clone - Frontend & Backend Integration Contracts

## Current Status
Frontend is complete with mock data. All UI components working including:
- Header with search functionality
- Hero banner with featured movie
- Movie rows with horizontal scrolling
- Movie cards with hover effects
- Trailer modal with YouTube embed
- Search functionality with toast notifications

## Mocked Data (in /app/frontend/src/mock.js)
- `mockMovies` object containing:
  - trending: 5 movies
  - popular: 5 movies
  - topRated: 5 movies
  - action: 5 movies
- `featuredMovie`: First movie from trending array
- Each movie object contains: id, title, backdrop_path, poster_path, overview, vote_average, release_date, trailer_key

## Backend API Contracts

### 1. Get All Movies by Category
**Endpoint:** `GET /api/movies/{category}`
- **Categories:** trending, popular, top_rated, action
- **Response:**
```json
{
  "movies": [
    {
      "id": 550,
      "title": "Fight Club",
      "backdrop_path": "https://image.tmdb.org/t/p/original/...",
      "poster_path": "https://image.tmdb.org/t/p/w500/...",
      "overview": "Movie description...",
      "vote_average": 8.5,
      "release_date": "1999-10-15",
      "trailer_key": "SUXWAEX2jlg"
    }
  ]
}
```

### 2. Search Movies
**Endpoint:** `GET /api/movies/search?query={search_term}`
- **Response:** Same as above

### 3. Get Featured Movie
**Endpoint:** `GET /api/movies/featured`
- **Response:** Single movie object (first from trending)

## TMDB API Integration Details

### TMDB API Keys (rotate on rate limit)
- Key 1: `c8dea14dc917687ac631a52620e4f7ad`
- Key 2: `3cb41ecea3bf606c56552db3d17adefd`

### TMDB Endpoints to Use
1. **Trending Movies:** `https://api.themoviedb.org/3/trending/all/week?api_key={key}`
2. **Popular Movies:** `https://api.themoviedb.org/3/movie/popular?api_key={key}`
3. **Top Rated:** `https://api.themoviedb.org/3/movie/top_rated?api_key={key}`
4. **Search:** `https://api.themoviedb.org/3/search/multi?api_key={key}&query={query}`
5. **Get Trailer:** `https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={key}`
   - Filter for YouTube trailers: `type: "Trailer"`, `site: "YouTube"`
   - Use the `key` field for YouTube embed URL

### Image URLs
- Backdrop: `https://image.tmdb.org/t/p/original/{backdrop_path}`
- Poster: `https://image.tmdb.org/t/p/w500/{poster_path}`

## Backend Implementation Plan

1. **Create TMDB Service** (`/app/backend/services/tmdb_service.py`)
   - Functions to fetch movies from each category
   - Function to search movies
   - Function to get trailer key for a movie
   - Handle rate limiting by rotating API keys
   - Cache responses (optional but recommended)

2. **Create API Routes** (`/app/backend/routes/movies.py`)
   - GET `/api/movies/trending`
   - GET `/api/movies/popular`
   - GET `/api/movies/top_rated`
   - GET `/api/movies/action` (filter by genre_ids: 28)
   - GET `/api/movies/search?query={query}`
   - GET `/api/movies/featured`

3. **Update server.py**
   - Import and include movie routes
   - Add proper error handling

## Frontend Integration Changes

### Files to Update:
1. **src/App.js**
   - Remove mock data imports
   - Add API calls using axios
   - Update useEffect to fetch real data on component mount
   - Update search handler to call backend API

### API Integration Code Pattern:
```javascript
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Fetch movies by category
const fetchMovies = async (category) => {
  const response = await axios.get(`${API}/movies/${category}`);
  return response.data.movies;
};

// Search movies
const searchMovies = async (query) => {
  const response = await axios.get(`${API}/movies/search?query=${query}`);
  return response.data.movies;
};
```

## Testing Checklist
- [ ] All movie categories load correctly
- [ ] Search functionality works
- [ ] Trailer keys are fetched correctly
- [ ] YouTube trailers play in modal
- [ ] No broken images
- [ ] Error handling for API failures
- [ ] Loading states displayed properly

## Notes
- **No broken images:** TMDB provides reliable image URLs
- **Trailers:** All movies should have at least one trailer in TMDB videos endpoint
- **Rate limiting:** Implement key rotation if hitting rate limits
- **Caching:** Consider caching TMDB responses to reduce API calls
