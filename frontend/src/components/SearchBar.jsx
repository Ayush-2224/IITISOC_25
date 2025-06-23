import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

const API_KEY = "cf79ad9b3dc6fe6f2cd294b1ea756d62";

const SearchBarWithSuggestions = () => {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [genresList, setGenresList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Fetching genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        );
        setGenresList([{ id: "all", name: "All Genres" }, ...res.data.genres]);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchGenres();
  }, []);

  // Fetch suggestions
  const fetchSuggestions = debounce(async (searchText) => {
    if (!searchText.trim()) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchText}`;
      console.log('Fetching suggestions from:', url);
      const res = await axios.get(url);
      console.log('Suggestions response:', res.data);
      setSuggestions(res.data.results.slice(0, 6));
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      console.error("Error response:", err.response?.data);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  // Handling query typing
  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    fetchSuggestions(text);
  };

  // Handling clicking suggestion
  const handleSuggestionClick = (item) => {
    console.log('Clicking on movie:', item);
    console.log('Navigating to:', `/movie/${item.id}`);
    navigate(`/movie/${item.id}`);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Manual search button
  const handleSearch = () => {
    if (query.trim()) {
      const params = new URLSearchParams({ 
        query: query.trim(),
        media: "movie", 
        genre: genre !== "all" ? genre : "" 
      });
      navigate(`/search?${params.toString()}`);
    } else {
      const params = new URLSearchParams({ media: "movie", genre });
      navigate(`/search?${params.toString()}`);
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-6">
      <div className="relative">
        {/* Main Search Container */}
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-4 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                {isSearching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => query && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for movies, shows, or anything..."
                className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-400 border-none outline-none text-lg font-medium"
              />
            </div>

            {/* Genre Selector */}
            <div className="relative">
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="appearance-none bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-medium cursor-pointer hover:bg-white/20 transition-all duration-300 outline-none min-w-[160px]"
              >
                {genresList.map((g) => (
                  <option key={g.id} value={g.id} className="bg-gray-900 text-white">
                    {g.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
            >
              <span>Search</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-black/40 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-2">
              <div className="text-xs text-gray-400 px-4 py-2 border-b border-white/10">
                Search Results
              </div>
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/10 rounded-xl transition-all duration-200 text-left"
                >
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                        : "https://via.placeholder.com/50x75?text=🎬&bg=1a1a1a&color=666666"
                    }
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded-lg border border-white/20"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50x75?text=🎬&bg=1a1a1a&color=666666";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-gray-400">
                        {item.release_date?.split('-')[0] || "TBA"}
                      </span>
                      {item.vote_average > 0 && (
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400 text-xs">⭐</span>
                          <span className="text-xs text-gray-400">
                            {item.vote_average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-white transition-colors duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Filters */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {["Action", "Comedy", "Horror", "Romance", "Sci-Fi"].map((quickGenre) => (
            <button
              key={quickGenre}
              onClick={() => {
                const genreId = genresList.find(g => g.name === quickGenre)?.id;
                if (genreId) {
                  setGenre(genreId);
                  const params = new URLSearchParams({ media: "movie", genre: genreId });
                  navigate(`/search?${params.toString()}`);
                }
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-full text-gray-300 hover:text-white text-sm transition-all duration-300 hover:scale-105"
            >
              {quickGenre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBarWithSuggestions;
