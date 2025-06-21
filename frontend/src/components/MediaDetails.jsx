import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_KEY = "cf79ad9b3dc6fe6f2cd294b1ea756d62";

const MediaDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [events, setEvents] = useState([]);
  const [showEventList, setShowEventList] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");

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

  const handleAddToEvent = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add to event");
      return;
    }
    if (!selectedEventId) {
      alert("Please select an event");
      return;
    }
    console.log("Selected Event ID:", selectedEventId);
    try {
      await axios.post(
        "http://localhost:4000/api/events/addMovie",
        {
          movieId: id,
          eventId: selectedEventId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Movie added to the selected event!");
      setShowEventList(false); // Close after success
    } catch (error) {
      console.error("Error adding to event:", error);
      alert("Failed to add to event");
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

    const fetchUserEvents = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get("http://localhost:4000/api/events/getUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data.events||[]);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchDetails();
    fetchUserEvents();
  }, [id]);

  if (!details) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="mx-auto p-4 bg-black text-white">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          alt={details.title || details.name}
          className="w-full md:w-1/3 rounded shadow-lg"
        />
        <div className="md:flex-1">
          <h1 className="text-3xl font-bold mb-2">
            {details.title || details.name}
          </h1>
          <p className="text-gray-400 mb-2">
            {details.release_date || details.first_air_date} |{" "}
            {details.runtime || details.episode_run_time?.[0]} min
          </p>
          <p className="text-sm mb-4">{details.overview}</p>

          <button
            onClick={handleAddToWatchlist}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
          >
            + Add to Watchlist
          </button>

          <button
            onClick={() => setShowEventList(!showEventList)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2"
          >
            + Add to a Event
          </button>

          {/* Toggleable Event List Section */}
          {showEventList && (
            <div className="mt-4 p-4 border border-gray-700 rounded bg-gray-900">
              <h3 className="text-lg font-semibold mb-2">Select an Event</h3>
              {events.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {events.map((event) => (
                    <li
                      key={event._id}
                      onClick={() => setSelectedEventId(event._id)}
                      className={`p-2 rounded cursor-pointer hover:bg-gray-800 ${
                        selectedEventId === event._id ? "bg-gray-700" : ""
                      }`}
                    >
                      {event.name || `Event ${event._id}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No events available</p>
              )}
              <button
                onClick={handleAddToEvent}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cast */}
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

      {/* Trailer */}
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
