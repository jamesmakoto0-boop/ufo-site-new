from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional
from pydantic import BaseModel
from services.tmdb_service import tmdb_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/movies", tags=["movies"])

class Movie(BaseModel):
    id: int
    title: str
    backdrop_path: Optional[str]
    poster_path: Optional[str]
    overview: str
    vote_average: float
    release_date: str
    trailer_key: str
    media_type: str = "movie"

class MoviesResponse(BaseModel):
    movies: List[Movie]

@router.get("/trending", response_model=MoviesResponse)
async def get_trending():
    """Get trending movies and shows"""
    try:
        movies = tmdb_service.get_trending()
        return {"movies": movies}
    except Exception as e:
        logger.error(f"Error fetching trending: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch trending movies")

@router.get("/popular", response_model=MoviesResponse)
async def get_popular():
    """Get popular movies"""
    try:
        movies = tmdb_service.get_popular()
        return {"movies": movies}
    except Exception as e:
        logger.error(f"Error fetching popular: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch popular movies")

@router.get("/top_rated", response_model=MoviesResponse)
async def get_top_rated():
    """Get top rated movies"""
    try:
        movies = tmdb_service.get_top_rated()
        return {"movies": movies}
    except Exception as e:
        logger.error(f"Error fetching top rated: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch top rated movies")

@router.get("/action", response_model=MoviesResponse)
async def get_action():
    """Get action movies"""
    try:
        movies = tmdb_service.get_action()
        return {"movies": movies}
    except Exception as e:
        logger.error(f"Error fetching action: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch action movies")

@router.get("/search", response_model=MoviesResponse)
async def search_movies(query: str = Query(..., min_length=1)):
    """Search for movies and shows"""
    try:
        movies = tmdb_service.search_movies(query)
        return {"movies": movies}
    except Exception as e:
        logger.error(f"Error searching movies: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to search movies")

@router.get("/featured", response_model=Movie)
async def get_featured():
    """Get featured movie"""
    try:
        movie = tmdb_service.get_featured()
        if not movie:
            raise HTTPException(status_code=404, detail="No featured movie found")
        return movie
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching featured: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured movie")