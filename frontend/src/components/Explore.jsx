import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ExploreTrending = ({ timeWindow = "day" }) => {
  const [items, setItems] = useState([]);

  const API_KEY = "";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/all/${timeWindow}?api_key=${API_KEY}`
        );
        setItems(res.data.results);
      } catch (error) {
        console.error("Failed to fetch trending items", error);
      }
    };

    fetchTrending();
  }, [timeWindow]);

  return (
    <section className="bg-black text-white px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          🔥 Trending {timeWindow === "day" ? "Today" : "This Week"}
        </h2>
        {/* Toggle button */}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="min-w-[200px] bg-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
          >
            <img
              src={
                movie.poster_path || movie.backdrop_path
                  ? `${IMAGE_BASE_URL}${
                      movie.poster_path || movie.backdrop_path
                    }`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title || movie.name}
              className="rounded-t-lg w-full h-[300px] object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold truncate">
                {movie.title || movie.name}
              </h3>
              <p className="text-sm text-gray-400 capitalize">
                {movie.media_type} •{" "}
                {movie.release_date || movie.first_air_date || "TBA"}
              </p>
              <p className="text-sm text-yellow-400">
                ⭐ {movie.vote_average || "N/A"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ExploreTrending;
