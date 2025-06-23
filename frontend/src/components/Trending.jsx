import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MovieCarousel = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "cf79ad9b3dc6fe6f2cd294b1ea756d62";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log('Fetching trending movies...');
        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
        );
        console.log('Trending movies response:', res.data);
        setMovies(res.data.results);
      } catch (err) {
        console.error("Error fetching movies", err);
        console.error("Error response:", err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <section className="px-6 py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-20 text-9xl">🎬</div>
        <div className="absolute bottom-20 right-20 text-9xl">🍿</div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-red-200 to-orange-200 bg-clip-text">
              Trending Movies
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover what everyone's watching this week
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.slice(0, 18).map((movie, index) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Movie Poster */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
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
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-white text-sm font-medium">
                      {movie.vote_average?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Trending Badge */}
                {index < 3 && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 px-2 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <span className="text-white text-xs font-bold">🔥 #{index + 1}</span>
                    </div>
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-white text-2xl ml-1">▶️</span>
                  </div>
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-4">
                <h3 className="font-bold text-white text-sm md:text-base leading-tight mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 group-hover:bg-clip-text transition-all duration-300">
                  {movie.title}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{movie.release_date?.split('-')[0] || "TBA"}</span>
                  <div className="flex items-center space-x-1">
                    <span>📅</span>
                    <span>{new Date(movie.release_date).getFullYear() || "TBA"}</span>
                  </div>
                </div>

                {/* Popularity Indicator */}
                <div className="mt-3 flex items-center space-x-2">
                  <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 group-hover:animate-pulse"
                      style={{ width: `${Math.min(movie.popularity / 100 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {Math.round(movie.popularity)}
                  </span>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/5 group-hover:to-blue-500/10 transition-all duration-500 pointer-events-none"></div>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Link
            to="/explore"
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 hover:border-red-400/50 px-8 py-4 rounded-2xl text-red-300 hover:text-red-200 transition-all duration-300 hover:scale-105"
          >
            <span className="font-medium">Explore All Movies</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">🎬</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MovieCarousel;
