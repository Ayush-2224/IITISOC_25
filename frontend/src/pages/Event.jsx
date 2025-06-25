import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCalendar, FaClock, FaEdit, FaUser, FaUsers, FaFilm, FaBell, FaSave, FaTimes, FaStar, FaSearch, FaPlus, FaTrash } from "react-icons/fa";
import debounce from "lodash.debounce";

const API_KEY = "cf79ad9b3dc6fe6f2cd294b1ea756d62";

const Event = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    dateTime: "",
    notes: "",
    sendReminder: false,
    reminderTime: "",
  });
  const [allowedToEdit, setAllowedToEdit] = useState(false);
  
  // New state for movie search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  // State for movie details
  const [movieDetails, setMovieDetails] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `http://localhost:4000/api/events/get/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvent(response.data.event);
        setAllowedToEdit(response.data.allowEditing);
        setFormData({
          title: response.data.event.title,
          dateTime: response.data.event.dateTime.slice(0, 16),
          notes: response.data.event.notes,
          sendReminder: response.data.event.reminder?.sendReminder || false,
          reminderTime: response.data.event.reminder?.reminderTime
            ? response.data.event.reminder.reminderTime.slice(0, 16)
            : "",
        });
        
        // Fetch movie details if there are suggested movies
        if (response.data.event.suggestedMovies && response.data.event.suggestedMovies.length > 0) {
          fetchMovieDetails(response.data.event.suggestedMovies);
        }
      } catch (err) {
        setError("Failed to fetch event details");
        toast.error(
          err.response?.data?.message || "Failed to fetch event details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Function to fetch movie details from TMDB API
  const fetchMovieDetails = async (movieIds) => {
    setLoadingMovies(true);
    try {
      const moviePromises = movieIds.map(async (movieId) => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
          );
          return {
            ...response.data,
            movieId: movieId // Keep the original movie ID for removal
          };
        } catch (err) {
          console.error(`Error fetching movie ${movieId}:`, err);
          return null;
        }
      });

      const movies = await Promise.all(moviePromises);
      const validMovies = movies.filter(movie => movie !== null);
      setMovieDetails(validMovies);
    } catch (err) {
      console.error("Error fetching movie details:", err);
    } finally {
      setLoadingMovies(false);
    }
  };

  // Function to navigate to movie details page
  const navigateToMovieDetails = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = {
        title: formData.title.trim(),
        dateTime: new Date(formData.dateTime).toISOString(),
        notes: formData.notes.trim(),
        reminder: {
          sendReminder: formData.sendReminder,
          reminderTime: formData.sendReminder
            ? new Date(formData.reminderTime).toISOString()
            : null,
        },
      };

      await axios.put(
        `http://localhost:4000/api/events/update/${eventId}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Event updated successfully");
      setIsEditing(false);
      setEvent((prev) => ({ ...prev, ...updatedEvent }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update event");
    }
  };

  // Search movies function
  const searchMovies = debounce(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
      );
      setSearchResults(res.data.results.slice(0, 5));
    } catch (err) {
      console.error("Error searching movies:", err);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchMovies(query);
  };

  const addMovieToEvent = async (movieId, movieData) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/events/addMovie",
        {
          movieId: parseInt(movieId),
          eventId: eventId
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Movie added to event successfully!");
      
      // Refresh event data to show updated movie list
      const eventResponse = await axios.get(
        `http://localhost:4000/api/events/get/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEvent(eventResponse.data.event);
      
      // Fetch updated movie details
      if (eventResponse.data.event.suggestedMovies && eventResponse.data.event.suggestedMovies.length > 0) {
        fetchMovieDetails(eventResponse.data.event.suggestedMovies);
      }
      
      // Clear search
      setSearchQuery("");
      setSearchResults([]);
    } catch (err) {
      console.error("Error adding movie to event:", err);
      toast.error("Failed to add movie to event");
    }
  };

  const removeMovieFromEvent = async (movieId) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/events/removeMovie",
        {
          movieId: movieId,
          eventId: eventId
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Movie removed from event successfully!");
      
      // Refresh event data to show updated movie list
      const eventResponse = await axios.get(
        `http://localhost:4000/api/events/get/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEvent(eventResponse.data.event);
      
      // Fetch updated movie details
      if (eventResponse.data.event.suggestedMovies && eventResponse.data.event.suggestedMovies.length > 0) {
        fetchMovieDetails(eventResponse.data.event.suggestedMovies);
      } else {
        setMovieDetails([]);
      }
    } catch (err) {
      console.error("Error removing movie from event:", err);
      toast.error("Failed to remove movie from event");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
          <p className="text-gray-400">Sorry, we couldn't find the event you're looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">🎪</div>
        <div className="absolute bottom-20 right-20 text-9xl">🎬</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">📅</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {!isEditing ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FaCalendar className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text">
                  {event.title}
                </h1>
              </div>
              
              {new Date(event.dateTime) > new Date() && allowedToEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2 mx-auto"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Edit Event</span>
                </button>
              )}
            </div>

            {/* Event Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Creator Info */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <FaUser className="w-5 h-5 text-purple-400" />
                  <span>Event Creator</span>
                </h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={event.createdBy.profilePic}
                    alt="creator"
                    className="w-16 h-16 rounded-full border-2 border-purple-500/30"
                  />
                  <div>
                    <p className="text-white font-semibold text-lg">{event.createdBy.name}</p>
                    <p className="text-gray-400 text-sm">Event Organizer</p>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <FaClock className="w-5 h-5 text-blue-400" />
                  <span>Event Details</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaCalendar className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">
                      {new Date(event.dateTime).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaClock className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">
                      {new Date(event.dateTime).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaBell className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-300">
                      {event.reminder?.sendReminder
                        ? `Reminder set for ${new Date(event.reminder.reminderTime).toLocaleString()}`
                        : "No reminder set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {event.notes && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">📝 Event Notes</h3>
                <p className="text-gray-300 leading-relaxed">{event.notes}</p>
              </div>
            )}

            {/* Participants */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <FaUsers className="w-6 h-6 text-indigo-400" />
                <span>Participants ({event.participants.length})</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {event.participants.map((p) => (
                  <div
                    key={p._id}
                    className="group text-center bg-white/5 hover:bg-white/10 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <img
                      src={p.profilePic}
                      alt={p.name}
                      className="w-20 h-20 mx-auto rounded-full mb-3 border-2 border-purple-500/30 group-hover:border-purple-500/50 transition-all duration-300"
                    />
                    <p className="text-white font-medium">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Movies */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <FaFilm className="w-6 h-6 text-red-400" />
                  <span>Suggested Movies ({event.suggestedMovies.length})</span>
                </h3>
                
                {/* Add Movie Button */}
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add Movie</span>
                </button>
              </div>

              {/* Search Bar */}
              {showSearch && (
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {isSearching ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                      ) : (
                        <FaSearch className="w-4 h-4" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search movies to add to this event..."
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 bg-black/40 border border-white/20 rounded-xl overflow-hidden">
                      {searchResults.map((movie) => (
                        <div key={movie.id} className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-200">
                          <img
                            src={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                : "https://via.placeholder.com/50x75?text=🎬&bg=1a1a1a&color=666666"
                            }
                            alt={movie.title}
                            className="w-12 h-16 object-cover rounded-lg border border-white/20"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/50x75?text=🎬&bg=1a1a1a&color=666666";
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm">{movie.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-gray-400 text-xs">{movie.release_date?.split('-')[0] || "TBA"}</span>
                              {movie.vote_average > 0 && (
                                <div className="flex items-center space-x-1">
                                  <FaStar className="w-3 h-3 text-yellow-400" />
                                  <span className="text-yellow-300 text-xs">{movie.vote_average.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => addMovieToEvent(movie.id, movie)}
                            className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-all duration-300"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Movie Details Display */}
              {loadingMovies ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading movie details...</p>
                </div>
              ) : movieDetails.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {movieDetails.map((movie) => (
                    <div key={movie.movieId} className="group bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 overflow-hidden relative cursor-pointer">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "https://via.placeholder.com/300x400?text=🎬&bg=1a1a1a&color=666666"
                        }
                        alt={movie.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x400?text=🎬&bg=1a1a1a&color=666666";
                        }}
                        onClick={() => navigateToMovieDetails(movie.movieId)}
                      />
                      
                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMovieFromEvent(movie.movieId);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                      
                      <div className="p-4" onClick={() => navigateToMovieDetails(movie.movieId)}>
                        <h4 className="font-bold text-white text-sm mb-2 line-clamp-2">
                          {movie.title} {movie.release_date ? `(${movie.release_date.split('-')[0]})` : ""}
                        </h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <FaStar className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-300 text-sm">{movie.vote_average?.toFixed(1) || "N/A"}</span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {movie.genres ? movie.genres.map(genre => genre.name).join(", ") : "No genres"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : event.suggestedMovies.length > 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading movie details...</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaFilm className="w-12 h-12 text-gray-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-300 mb-2">No movies suggested yet</h4>
                  <p className="text-gray-500">Click "Add Movie" to suggest movies for this event</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Edit Form
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Edit Event</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Add any additional notes for this event"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="sendReminder"
                    id="sendReminder"
                    checked={formData.sendReminder}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label htmlFor="sendReminder" className="text-gray-300">
                    Send reminder notification
                  </label>
                </div>

                {formData.sendReminder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reminder Time
                    </label>
                    <input
                      type="datetime-local"
                      name="reminderTime"
                      value={formData.reminderTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-2"
                  >
                    <FaSave className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 flex items-center justify-center space-x-2"
                  >
                    <FaTimes className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
