#!/usr/bin/env python3
"""
Netflix Clone Backend API Testing
Tests all movie endpoints for proper functionality and data structure
"""

import requests
import json
import sys
from typing import Dict, List, Any

# Backend URL from frontend environment
BACKEND_URL = "https://trailerflix-2341.preview.emergentagent.com"

class NetflixAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_results = []
        self.failed_tests = []
        
    def log_result(self, test_name: str, success: bool, message: str, response_data: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        }
        self.test_results.append(result)
        if not success:
            self.failed_tests.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        
    def validate_movie_structure(self, movie: Dict, test_name: str) -> bool:
        """Validate movie object structure"""
        required_fields = ['id', 'title', 'backdrop_path', 'poster_path', 'overview', 
                          'vote_average', 'release_date', 'trailer_key', 'media_type']
        
        missing_fields = []
        for field in required_fields:
            if field not in movie:
                missing_fields.append(field)
        
        if missing_fields:
            self.log_result(f"{test_name} - Structure", False, 
                          f"Missing required fields: {missing_fields}", movie)
            return False
            
        # Validate data types and values
        if not isinstance(movie['id'], int):
            self.log_result(f"{test_name} - Structure", False, 
                          f"ID should be integer, got {type(movie['id'])}", movie)
            return False
            
        if not isinstance(movie['title'], str) or not movie['title']:
            self.log_result(f"{test_name} - Structure", False, 
                          f"Title should be non-empty string", movie)
            return False
            
        if not isinstance(movie['vote_average'], (int, float)):
            self.log_result(f"{test_name} - Structure", False, 
                          f"Vote average should be number, got {type(movie['vote_average'])}", movie)
            return False
            
        # Check image URLs are valid (not null and contain tmdb.org)
        if movie['backdrop_path'] and 'tmdb.org' not in str(movie['backdrop_path']):
            self.log_result(f"{test_name} - Structure", False, 
                          f"Invalid backdrop_path URL: {movie['backdrop_path']}", movie)
            return False
            
        if movie['poster_path'] and 'tmdb.org' not in str(movie['poster_path']):
            self.log_result(f"{test_name} - Structure", False, 
                          f"Invalid poster_path URL: {movie['poster_path']}", movie)
            return False
            
        # Check trailer_key is present
        if not movie['trailer_key']:
            self.log_result(f"{test_name} - Structure", False, 
                          f"Missing trailer_key", movie)
            return False
            
        return True
        
    def test_endpoint(self, endpoint: str, test_name: str, expected_structure: str = "movies_list") -> bool:
        """Test a single endpoint"""
        try:
            url = f"{self.base_url}{endpoint}"
            print(f"\n🔍 Testing: {url}")
            
            response = requests.get(url, timeout=30)
            
            if response.status_code != 200:
                self.log_result(test_name, False, 
                              f"HTTP {response.status_code}: {response.text}")
                return False
                
            try:
                data = response.json()
            except json.JSONDecodeError:
                self.log_result(test_name, False, 
                              f"Invalid JSON response: {response.text[:200]}")
                return False
                
            # Validate response structure
            if expected_structure == "movies_list":
                if 'movies' not in data:
                    self.log_result(test_name, False, 
                                  f"Response missing 'movies' key", data)
                    return False
                    
                if not isinstance(data['movies'], list):
                    self.log_result(test_name, False, 
                                  f"'movies' should be a list, got {type(data['movies'])}", data)
                    return False
                    
                if len(data['movies']) == 0:
                    self.log_result(test_name, False, 
                                  f"Empty movies list returned", data)
                    return False
                    
                # Validate first few movies structure
                for i, movie in enumerate(data['movies'][:3]):
                    if not self.validate_movie_structure(movie, f"{test_name} - Movie {i+1}"):
                        return False
                        
            elif expected_structure == "single_movie":
                if not self.validate_movie_structure(data, test_name):
                    return False
                    
            elif expected_structure == "trailer":
                if 'trailer_key' not in data:
                    self.log_result(test_name, False, 
                                  f"Response missing 'trailer_key'", data)
                    return False
                    
                if not data['trailer_key']:
                    self.log_result(test_name, False, 
                                  f"Empty trailer_key", data)
                    return False
                    
            self.log_result(test_name, True, 
                          f"Success - {len(data.get('movies', [data]))} items returned")
            return True
            
        except requests.exceptions.Timeout:
            self.log_result(test_name, False, "Request timeout (30s)")
            return False
        except requests.exceptions.ConnectionError:
            self.log_result(test_name, False, "Connection error - backend may be down")
            return False
        except Exception as e:
            self.log_result(test_name, False, f"Unexpected error: {str(e)}")
            return False
            
    def run_all_tests(self):
        """Run all Netflix API tests"""
        print("🎬 Starting Netflix Clone Backend API Tests")
        print(f"🔗 Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test all endpoints from the review request
        tests = [
            ("/api/movies/trending", "Trending Movies", "movies_list"),
            ("/api/movies/popular", "Popular Movies", "movies_list"),
            ("/api/movies/top_rated", "Top Rated Movies", "movies_list"),
            ("/api/movies/action", "Action Movies", "movies_list"),
            ("/api/movies/search?query=Avengers", "Search Movies (Avengers)", "movies_list"),
            ("/api/movies/featured", "Featured Movie", "single_movie"),
        ]
        
        success_count = 0
        for endpoint, test_name, structure in tests:
            if self.test_endpoint(endpoint, test_name, structure):
                success_count += 1
                
        # Test trailer endpoint with a known movie ID
        # First get a movie ID from trending to test trailer endpoint
        try:
            response = requests.get(f"{self.base_url}/api/movies/trending", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('movies') and len(data['movies']) > 0:
                    movie_id = data['movies'][0]['id']
                    trailer_endpoint = f"/api/movies/trailer/{movie_id}?media_type=movie"
                    if self.test_endpoint(trailer_endpoint, "Movie Trailer", "trailer"):
                        success_count += 1
                else:
                    self.log_result("Movie Trailer", False, "No movies available to test trailer endpoint")
            else:
                self.log_result("Movie Trailer", False, "Could not get movie ID for trailer test")
        except Exception as e:
            self.log_result("Movie Trailer", False, f"Error setting up trailer test: {str(e)}")
            
        # Print summary
        print("\n" + "=" * 60)
        print("🎯 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(tests) + 1  # +1 for trailer test
        print(f"✅ Passed: {success_count}/{total_tests}")
        print(f"❌ Failed: {len(self.failed_tests)}/{total_tests}")
        
        if self.failed_tests:
            print("\n🚨 FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"  • {failure['test']}: {failure['message']}")
                
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    tester = NetflixAPITester()
    success = tester.run_all_tests()
    
    if not success:
        print(f"\n❌ Some tests failed. Check the details above.")
        sys.exit(1)
    else:
        print(f"\n🎉 All tests passed! Netflix Clone backend is working correctly.")
        sys.exit(0)