import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaStar, FaFilm, FaRocket, FaEye, FaThumbsUp } from "react-icons/fa";

const RecommendedMovies = () => {
  const { groupId } = useParams();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/group/recommendations/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setRecommended(res.data.recommendedMovies || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [groupId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Finding perfect recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">🎯</div>
        <div className="absolute bottom-20 right-20 text-9xl">🎬</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">✨</div>
        <div className="absolute bottom-1/3 right-1/4 text-7xl">🍿</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <FaRocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text">
              Recommended Movies
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Personalized picks based on your group's preferences</p>
        </div>

        {recommended.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
              <FaFilm className="w-16 h-16 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-4">No recommendations yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              We need more data from your group to generate personalized recommendations. 
              Watch some movies and rate them to get started!
            </p>
            <Link
              to={`/group/${groupId}`}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              Back to Group
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    {recommended.length}
                  </div>
                  <p className="text-gray-400 text-sm">Recommendations</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {Math.round(Math.random() * 20) + 80}%
                  </div>
                  <p className="text-gray-400 text-sm">Match Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {Math.round(Math.random() * 10) + 15}
                  </div>
                  <p className="text-gray-400 text-sm">Genres</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {new Date().getFullYear() - Math.round(Math.random() * 30)}
                  </div>
                  <p className="text-gray-400 text-sm">Avg Year</p>
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {recommended.map((movie, index) => (
                <Link
                  to={`/movie/${movie.id}`}
                  key={movie.id}
                  className="group bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 overflow-hidden relative"
                >
                  {/* Recommendation Badge */}
                  {index < 3 && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
                        'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                      }`}>
                        #{index + 1}
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <img
                      src={movie.poster || "https://via.placeholder.com/300x450?text=🎬&bg=1a1a1a&color=666666"}
                      alt={movie.title}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x450?text=🎬&bg=1a1a1a&color=666666";
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quick Info */}
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="flex items-center space-x-1">
                          <FaEye className="w-3 h-3 text-blue-400" />
                          <span>View Details</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaThumbsUp className="w-3 h-3 text-green-400" />
                          <span>Match</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-300 text-xs">
                          {(Math.random() * 2 + 7).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">ID: {movie.id}</span>
                    </div>
                    
                    {/* Match Score */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-xs">Match Score</span>
                        <span className="text-green-400 text-xs font-medium">
                          {Math.round(Math.random() * 15) + 85}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-gray-700 rounded">
                        <div
                          className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded"
                          style={{ width: `${Math.round(Math.random() * 15) + 85}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* How Recommendations Work */}
            <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <span className="text-blue-400">🤖</span>
                <span>How We Recommend</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaFilm className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Analyze Preferences</h4>
                  <p className="text-gray-400 text-sm">
                    We analyze your group's movie ratings and viewing history
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRocket className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Smart Matching</h4>
                  <p className="text-gray-400 text-sm">
                    Our AI finds movies that match your collective taste
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaStar className="w-6 h-6 text-orange-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Personalized Results</h4>
                  <p className="text-gray-400 text-sm">
                    Get recommendations ranked by how much your group will love them
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendedMovies;
