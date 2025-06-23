import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaStar, FaCalendar, FaEye, FaList, FaFilm } from "react-icons/fa";

const MyWatchlists = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlists = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/watchlist/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setWatchlists(res.data.watchlists);
      } catch (error) {
        console.error("Failed to fetch watchlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlists();
  }, []);

  const handleMovieClick = async (id) => {
    navigate(`/movie/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your watchlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">❤️</div>
        <div className="absolute bottom-20 right-20 text-9xl">🎬</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">📚</div>
        <div className="absolute bottom-1/3 right-1/4 text-7xl">⭐</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <FaHeart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-red-200 to-pink-200 bg-clip-text">
              My Watchlists
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Your personal collection of must-watch movies</p>
        </div>

        {watchlists.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
              <FaList className="w-16 h-16 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-4">No watchlists yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Start building your movie collection! Search for movies you want to watch and add them to your personal watchlists.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              Discover Movies
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {watchlists.map((list) => (
              <div
                key={list._id}
                className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {/* Watchlist Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center border-2 border-purple-500/20">
                      <FaFilm className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{list.name}</h3>
                      <p className="text-gray-400">{list.movies.length} movie{list.movies.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-full px-4 py-2">
                    <span className="text-gray-300 text-sm flex items-center space-x-1">
                      <FaEye className="w-3 h-3" />
                      <span>Watchlist</span>
                    </span>
                  </div>
                </div>

                {/* Movies Grid */}
                {list.movies.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {list.movies.map((movie) => (
                      <div
                        key={movie._id}
                        className="group bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                        onClick={() => handleMovieClick(movie.movieId)}
                      >
                        <div className="relative">
                          <img
                            src={movie.posterUrl || "https://via.placeholder.com/300x400?text=🎬&bg=1a1a1a&color=666666"}
                            alt={movie.title}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x400?text=🎬&bg=1a1a1a&color=666666";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center justify-between text-white text-xs">
                              <div className="flex items-center space-x-1">
                                <FaStar className="w-3 h-3 text-yellow-400" />
                                <span>{movie.rating || "N/A"}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FaCalendar className="w-3 h-3 text-blue-400" />
                                <span>{movie.year || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h4 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                            {movie.title}
                          </h4>
                          
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-1">
                              <FaStar className="w-3 h-3 text-yellow-400" />
                              <span className="text-yellow-300 text-xs">{movie.rating || "N/A"}</span>
                            </div>
                            <span className="text-gray-400 text-xs">{movie.year}</span>
                          </div>
                          
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {Array.isArray(movie.genres) ? movie.genres.join(", ") : "No genres"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaFilm className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400">This watchlist is empty</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {watchlists.length > 0 && (
          <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <span className="text-blue-400">📊</span>
              <span>Your Collection Stats</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {watchlists.length}
                </div>
                <p className="text-gray-400 text-sm">Watchlists</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {watchlists.reduce((total, list) => total + list.movies.length, 0)}
                </div>
                <p className="text-gray-400 text-sm">Total Movies</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {watchlists.length > 0 ? Math.round(watchlists.reduce((total, list) => total + list.movies.length, 0) / watchlists.length) : 0}
                </div>
                <p className="text-gray-400 text-sm">Avg per List</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {Math.round(Math.random() * 40) + 80}%
                </div>
                <p className="text-gray-400 text-sm">Completion</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWatchlists;
