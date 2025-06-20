import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_KEY = "cf79ad9b3dc6fe6f2cd294b1ea756d62";

const MediaDetails = () => {
  const { id } = useParams();
  console.log(id);
  const [details, setDetails] = useState([]);

  const handleAddToWatchlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add to watchlist");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/watchlist/add",
        {
          movieId: id,
          title: details.title,
          posterUrl: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
          rating: details.vote_average,
          year: details.release_date?.split("-")[0],
          genres: details.genres.map((g) => g.name),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Movie added to your watchlist!");
    } catch (err) {
      console.error("Error adding to watchlist:", err);
      alert("Failed to add to watchlist");
    }
  };
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
        );
        setDetails(res.data);
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };

    fetchDetails();
  }, [id]);

  if (!details) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className=" mx-auto p-4 bg-black text-white">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          alt={details.title || details.name}
          className="w-full md:w-1/3 rounded shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {details.title || details.name}
          </h1>
          <p className="text-gray-600 mb-2">
            {details.release_date || details.first_air_date} |{" "}
            {details.runtime || details.episode_run_time?.[0]} min
          </p>
          <p className="text-sm mb-4">{details.overview}</p>
          <button
            onClick={handleAddToWatchlist}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add to Watchlist
          </button>
        </div>
      </div>

      {/*  Casting and trailer */}
      {details.credits?.cast?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-white">Top Cast</h2>
          <div className="flex gap-4 overflow-x-auto">
            {details.credits.cast.slice(0, 10).map((actor) => (
              <div key={actor.id} className="text-center min-w-[80px]">
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto"
                />
                <p className="text-xs mt-1">{actor.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {details.videos?.results?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Trailer</h2>
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${details.videos.results[0].key}`}
            title="Trailer"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default MediaDetails;
