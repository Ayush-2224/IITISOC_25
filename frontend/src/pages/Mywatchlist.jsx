import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyWatchlists = () => {
  const [watchlists, setWatchlists] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlists = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/watchlist/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // console.log(res)
        // console.log(res.data.watchlists.movies.movieId)
        setWatchlists(res.data.watchlists);
      } catch (error) {
        console.error("Failed to fetch watchlists:", error);
      }
    };

    fetchWatchlists();
  }, []);

  const handleclick = async (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">🎬 My Watchlists</h2>
      {watchlists.length === 0 ? (
        <p>No watchlists found.</p>
      ) : (
        watchlists.map((list) => (
          <div
            key={list._id}
            className="mb-6 p-4 bg-gray-800 rounded shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">{list.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {list.movies.map((movie) => (
                <div
                  key={movie._id}
                  className="bg-gray-700 rounded p-2 cursor-pointer"
                  onClick={() => handleclick(movie.movieId)}
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <h4 className="text-lg font-semibold">{movie.title}</h4>
                  <p className="text-sm text-gray-400">⭐ {movie.rating}</p>
                  <p className="text-sm text-gray-400">{movie.year}</p>
                  <p className="text-sm text-gray-500">
                    {movie.genres.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyWatchlists;
