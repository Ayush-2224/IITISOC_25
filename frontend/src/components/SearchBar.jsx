import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

const API_KEY = "";

const SearchBarWithSuggestions = () => {
  const [query, setQuery] = useState("");
  const [mediaType, setMediaType] = useState("all");
  const [genre, setGenre] = useState("all");
  const [genresList, setGenresList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetching genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        );
        setGenresList(res.data.genres);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchGenres();
  });

  // Fetch suggestions
  const fetchSuggestions = debounce(async (searchText) => {
    if (!searchText.trim()) return;

    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchText}`;

      const res = await axios.get(url);
      let filtered = res.data.results;

      setSuggestions(filtered.slice(0, 6)); // showing top 6
    } catch (err) {
      console.log("Error fetching suggestions:", err);
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
    navigate(`/movie/${item.id}`);
    setQuery("");
    setSuggestions([]);
  };

  // Manual search button
  const handleSearch = () => {
    const params = new URLSearchParams({ media: "movie", genre });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="relative w-full md:w-full mx-auto bg-black text-white mt-1 ml-1 ">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <input
          type="text"
          value={query}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          onChange={handleInputChange}
          placeholder="Search movies or shows..."
          className="flex-1 border px-3 py-2"
        />

        {/* option for only movies */}
        <option
          value="movie"
          className="border px-2 py-1 rounded text-sm bg-black"
        >
          Movies
        </option>

        {/* select the genre type for movies */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border px-2 py-1 rounded text-sm bg-black"
        >
          {genresList.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* handling search */}
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute bg-black border shadow-lg mt-1 w-full z-10 max-h-60 overflow-y-auto rounded">
          {suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSuggestionClick(item)}
              className="px-4 py-2 hover: cursor-pointer flex items-center gap-2"
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                    : "https://via.placeholder.com/50x75?text=?"
                }
                alt={item.title || item.name}
                className="w-10 h-14 object-cover rounded"
              />
              <div>
                <p className="text-sm font-semibold">
                  {item.title || item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.release_date || item.first_air_date || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBarWithSuggestions;
