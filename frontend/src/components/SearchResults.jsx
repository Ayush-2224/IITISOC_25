import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const API_KEY = "";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const genre = params.get("genre");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;

        if (genre) {
          url += `&with_genres=${genre}`;
        }

        const res = await axios.get(url);
        setResults(res.data.results);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchResults();
  }, [genre]);

  return (
    <div className="p-4 max-w-6xl mx-auto bg-black mt-1">
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((item) => (
            <Link
              key={item.id}
              to={`/movie/${item.id}`}
              className="bg-white shadow hover:shadow-md rounded overflow-hidden"
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={item.title || item.name}
                className="w-full h-[360px] object-cover"
              />
              <div className="p-2 text-xl font-medium text-center text-amber-300">
                {item.title || item.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
