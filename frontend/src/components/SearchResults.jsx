import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaStar, FaCalendar, FaEye } from "react-icons/fa";

const API_KEY = "cf79ad9b3dc6fe6f2cd294b1ea756d62";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const query = params.get("query");
  const genre = params.get("genre");
  const media = params.get("media") || "movie";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        let url;
        
        if (query) {
          // Search by query
          url = `https://api.themoviedb.org/3/search/${media}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
        } else {
          // Discover movies by genre
          url = `https://api.themoviedb.org/3/discover/${media}?api_key=${API_KEY}`;
          if (genre) {
            url += `&with_genres=${genre}`;
          }
        }

        console.log('Fetching search results from:', url);
        const res = await axios.get(url);
        console.log('Search results:', res.data);
        setResults(res.data.results);
      } catch (err) {
        console.error("Search error:", err);
        console.error("Error response:", err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, genre, media]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Searching for movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">🔍</div>
        <div className="absolute bottom-20 right-20 text-9xl">🎬</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">🍿</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <FaSearch className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text">
              Search Results
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {query ? `Found ${results.length} results for "${query}"` : `Showing ${results.length} movies`}
          </p>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
              <FaSearch className="w-16 h-16 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-4">No results found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              {query ? `No movies found for "${query}". Try a different search term.` : 'No movies found for the selected criteria.'}
            </p>
            <Link
              to="/"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {results.map((item, index) => (
              <Link
                key={item.id}
                to={`/movie/${item.id}`}
                onClick={() => console.log('SearchResults - Clicking on movie:', item)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Movie Poster */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "https://via.placeholder.com/500x750?text=🎬&bg=1a1a1a&color=666666"
                    }
                    alt={item.title || item.name}
                    className="w-full h-64 sm:h-72 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/500x750?text=🎬&bg=1a1a1a&color=666666";
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                    <div className="flex items-center space-x-1">
                      <FaStar className="w-3 h-3 text-yellow-400" />
                      <span className="text-white text-sm font-medium">
                        {item.vote_average?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <FaEye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm md:text-base leading-tight mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 group-hover:bg-clip-text transition-all duration-300">
                    {item.title || item.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FaCalendar className="w-3 h-3" />
                      <span>{item.release_date?.split('-')[0] || "TBA"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaStar className="w-3 h-3 text-yellow-400" />
                      <span>{item.vote_average?.toFixed(1) || "N/A"}</span>
                    </div>
                  </div>

                  {/* Popularity Indicator */}
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 group-hover:animate-pulse"
                        style={{ width: `${Math.min((item.popularity || 0) / 100 * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(item.popularity || 0)}
                    </span>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/5 group-hover:to-blue-500/10 transition-all duration-500 pointer-events-none"></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
