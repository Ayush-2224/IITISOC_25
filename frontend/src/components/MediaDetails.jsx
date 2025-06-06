import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_KEY = ""; // Replace with your key

const MediaDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

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

  const handleAddToWatchlist = () => {};

  if (!details) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className=" mx-auto p-4 bg-black">
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
          <h2 className="text-xl font-semibold mb-2">Top Cast</h2>
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
