import React, { useEffect, useState } from "react";
import axios from "axios";

const MovieCarousel = () => {
  const [movies, setMovies] = useState([]);

  const API_KEY = "cf79ad9b3dc6fe6f2cd294b1ea756d62"; // Replace with your key
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
        );
        console.log(res)
        setMovies(res.data.results);
      } catch (err) {
        console.error("Error fetching movies", err);
      }
    };
    fetchMovies();
  }, []);

  return (
    <section className="px-6 py-12 bg-gray-950 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">🎬 Trending Movies</h2>
      <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[200px] bg-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
          >
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="rounded-t-lg w-full h-[300px] object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
              <p className="text-sm text-gray-400">⭐ {movie.vote_average}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieCarousel;
