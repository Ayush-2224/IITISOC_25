import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const RecommendedMovies = () => {
  const { groupId } = useParams();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/group/recommendations/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setRecommended(res.data.recommendedMovies || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [groupId]);

  if (loading) return <p className="text-center mt-10 text-red-600">Loading...</p>;

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">🎯 Recommended Movies</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {recommended.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={movie.poster || "https://via.placeholder.com/300x450?text=No+Poster"}
              alt={movie.title}
              className="w-full h-72 object-cover"
            />
            <div className="p-2">
              <h3 className="text-md font-semibold">{movie.title}</h3>
              <p className="text-sm text-gray-400">ID: {movie.id}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedMovies;
