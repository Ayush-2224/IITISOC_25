import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import { FaStar, FaHeart, FaPlay, FaClock, FaCalendar, FaGlobe, FaDollarSign, FaBookmark, FaPlus } from "react-icons/fa";
import ReactPlayer from 'react-player/youtube';

const MediaDetails = () => {
  const { mediaType: paramMediaType, id } = useParams();
  const location = useLocation();
  let mediaType = paramMediaType;
  if (!mediaType && location.pathname.startsWith('/movie/')) {
    mediaType = 'movie';
  }
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { token } = useContext(Context);
  
  // Get userId from localStorage instead
  const userId = localStorage.getItem("userId");

  const API_KEY = "cf79ad9b3dc6fe6f2cd294b1ea756d62";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

  console.log('MediaDetails component - mediaType:', mediaType, 'id:', id);

  useEffect(() => {
    fetchMediaDetails();
    fetchCast();
    fetchVideos();
    if (userId) fetchWatchlistStatus();
  }, [id, mediaType]);
  const fetchWatchlistStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/watchlist/check?movieId=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsInWatchlist(res.data.isPresent);
      console.log("Watchlist status:", res.data.isPresent);
    } catch (err) {
      console.error("Error checking watchlist status:", err);
    }
  };
  const fetchMediaDetails = async () => {
    try {
      setLoading(true);
      console.log(`Fetching ${mediaType} with ID: ${id}`);
      const res = await axios.get(
        `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}`
      );
      console.log('Media details response:', res.data);
      setMedia(res.data);
    } catch (err) {
      console.error("Error fetching media details:", err);
      console.error("Error response:", err.response?.data);
      toast.error(`Failed to load ${mediaType} details: ${err.response?.status || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCast = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${API_KEY}`
      );
      console.log('Cast response:', res.data.cast);
      setCast(res.data.cast.slice(0, 8));
    } catch (err) {
      console.error("Error fetching cast:", err);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${API_KEY}`
      );
      setVideos(res.data.results.filter(video => video.type === "Trailer").slice(0, 3));
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  const toggleWatchlist = async () => {
    if (!userId) {
      toast.error("Please login to add to watchlist");
      return;
    }

    try {
      if (isInWatchlist) {
        await axios.delete(
          `http://localhost:4000/api/watchlist/remove`,
          {
            data: { movieId: id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchWatchlistStatus();
        setIsInWatchlist(false);
        toast.success("Removed from watchlist");
      } else {
        await axios.post(
          `http://localhost:4000/api/watchlist/add`,
          {
            movieId: parseInt(id),
            title: media.title || media.name,
            mediaType,
            posterUrl: media.poster_path,
            rating: media.vote_average,
            year: new Date(media.release_date || media.first_air_date).getFullYear(),
            genres: media.genres.map((genre) => genre.name)
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsInWatchlist(true);
        fetchWatchlistStatus();
        toast.success("Added to watchlist");
      }
    } catch (err) {
      console.error("Error updating watchlist:", err);
      toast.error("Failed to update watchlist");
    }
  };

  const createEvent = () => {
    if (!userId) {
      toast.error("Please login to create an event");
      return;
    }
    
    // Navigate to event creation page with movie details
    navigate('/event-registration', {
      state: {
        movieId: id,
        movieTitle: media.title || media.name,
        moviePoster: media.poster_path,
        movieType: mediaType
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <p className="text-gray-400">Sorry, we couldn't find the movie you're looking for.</p>
        </div>
      </div>
    );
  }

  const title = media.title || media.name;
  const releaseDate = media.release_date || media.first_air_date;
  const runtime = media.runtime || (media.episode_run_time && media.episode_run_time[0]);
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Backdrop Image */}
      {media.backdrop_path && (
        <div className="absolute inset-0">
          <img
            src={`${BACKDROP_URL}${media.backdrop_path}`}
            alt={title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
        </div>
      )}

      <div className="relative z-10">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="relative group animate-scale-in">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-75 group-hover:opacity-100 blur transition duration-500"></div>
                  <img
                    src={`${IMAGE_BASE_URL}${media.poster_path}`}
                    alt={title}
                    className="relative w-full rounded-2xl shadow-2xl border border-white/20"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/500x750?text=🎬&bg=1a1a1a&color=666666";
                    }}
                  />
                  
                  {/* Watchlist Button */}
          <button
                    onClick={toggleWatchlist}
                    className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 ${
                      isInWatchlist
                        ? 'bg-red-500/20 border-red-500/30 text-red-400'
                        : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                    }`}
                  >
                    {isInWatchlist ? <FaHeart className="w-5 h-5" /> : <FaBookmark className="w-5 h-5" />}
          </button>

                  {/* Add to Event Button
                  <button
                    onClick={createEvent}
                    className="absolute bottom-4 right-4 p-3 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-400 transition-all duration-300 hover:scale-110 hover:bg-purple-500/30"
                  >
                    <FaPlus className="w-5 h-5" />
                  </button> */}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={toggleWatchlist}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isInWatchlist
                        ? 'bg-red-500/20 border-2 border-red-500/30 text-red-400 hover:bg-red-500/30'
                        : 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    {isInWatchlist ? <FaHeart className="w-5 h-5" /> : <FaBookmark className="w-5 h-5" />}
                    <span>{isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                  </button>

                  {/* <button
                    onClick={createEvent}
                    className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <FaPlus className="w-5 h-5" />
                    <span>Create Event</span>
                  </button> */}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-8 animate-fade-in">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text mb-4">
                  {title}
                </h1>
                
                {media.tagline && (
                  <p className="text-xl text-gray-300 italic mb-6">"{media.tagline}"</p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 mb-8">
                  {media.vote_average > 0 && (
                    <div className="flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-500/30">
                      <FaStar className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 font-medium">
                        {media.vote_average?.toFixed(1)} / 10
                      </span>
                    </div>
                  )}

                  {year && !isNaN(year) && (
                    <div className="flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/30">
                      <FaCalendar className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 font-medium">
                        {year}
                      </span>
                    </div>
                  )}

                  {runtime > 0 && (
                    <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
                      <FaClock className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 font-medium">
                        {runtime} min
                      </span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {media.genres && media.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {media.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-gray-300 text-sm hover:bg-white/20 transition-all duration-300"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              {media.overview && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Overview</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {media.overview}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-6">
                {media.budget > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaDollarSign className="w-5 h-5 text-green-400" />
                      <h4 className="text-lg font-semibold text-white">Budget</h4>
                    </div>
                    <p className="text-gray-300">
                      ${media.budget.toLocaleString()}
                    </p>
                  </div>
                )}

                {media.revenue > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaDollarSign className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-lg font-semibold text-white">Revenue</h4>
                    </div>
                    <p className="text-gray-300">
                      ${media.revenue.toLocaleString()}
                    </p>
                  </div>
                )}

                {media.original_language && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaGlobe className="w-5 h-5 text-blue-400" />
                      <h4 className="text-lg font-semibold text-white">Language</h4>
                    </div>
                    <p className="text-gray-300">
                      {media.original_language.toUpperCase()}
                    </p>
                  </div>
                )}

                {media.status && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">📊</span>
                      <h4 className="text-lg font-semibold text-white">Status</h4>
                    </div>
                    <p className="text-gray-300">
                      {media.status}
                    </p>
                  </div>
                )}

                {media.production_companies && media.production_companies.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">🏢</span>
                      <h4 className="text-lg font-semibold text-white">Studio</h4>
                    </div>
                    <p className="text-gray-300">
                      {media.production_companies[0].name}
                    </p>
                  </div>
                )}

                {media.production_countries && media.production_countries.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">🌍</span>
                      <h4 className="text-lg font-semibold text-white">Country</h4>
                    </div>
                    <p className="text-gray-300">
                      {media.production_countries[0].name}
                    </p>
                  </div>
                )}
              </div>

              {/* Main Trailer */}
              {videos && videos.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Trailer</h3>
                  <div className='player-wrapper w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/20'>
                    <ReactPlayer
                      className='react-player'
                      url={`https://www.youtube.com/watch?v=${videos[0].key}`}
                      width='100%'
                      height='100%'
                      controls={true}
                      pip={true}
                      light={`https://img.youtube.com/vi/${videos[0].key}/hqdefault.jpg`}
                      playing
                    />
                  </div>
                </div>
              )}

              {/* Other Trailers */}
              {videos && videos.length > 1 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">More Trailers</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.slice(1).map((video) => (
                      <a
                        key={video.id}
                        href={`https://www.youtube.com/watch?v=${video.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-black/50 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                          alt={video.name}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-all duration-300">
                          <FaPlay className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-sm font-medium truncate">{video.name}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Cast */}
              {cast && cast.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Cast</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {cast.map((actor) => (
                      <div key={actor.id} className="text-center group">
                        <div className="relative mb-3">
                          <img
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                : "https://via.placeholder.com/200x300?text=👤&bg=1a1a1a&color=666666"
                            }
                            alt={actor.name}
                            className="w-full aspect-[3/4] object-cover rounded-xl border border-white/20 group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              console.log('Cast image failed to load for:', actor.name);
                              e.target.src = "https://via.placeholder.com/200x300?text=👤&bg=1a1a1a&color=666666";
                            }}
                            onLoad={() => {
                              console.log('Cast image loaded successfully for:', actor.name);
                            }}
                          />
                        </div>
                        <h4 className="text-white font-medium text-sm leading-tight">{actor.name}</h4>
                        <p className="text-gray-400 text-xs leading-tight mt-1">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetails;
