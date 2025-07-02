import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_KEY = "cf79ad9b3dc6fe6f2cd294b1ea756d62";

const Recommend = ({ movieIds }) => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const movieDetails = await Promise.all(
                    movieIds.map(async (movieId) => {
                        const response = await axios.get(
                            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
                        );
                        const data = response.data;
                        return {
                            id: data.id,
                            title: data.title,
                            poster: data.poster_path
                                ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                                : null,
                            rating: data.vote_average,
                            year: data.release_date ? data.release_date.split('-')[0] : 'Unknown',
                        };
                    })
                );
                setRecommendations(movieDetails);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        if (movieIds && movieIds.length > 0) {
            fetchRecommendations();
        }
    }, [movieIds]);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {recommendations.map((movie) => (
                <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="group block bg-white/5 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300"
                >
                    <img
                        src={movie.poster || "https://via.placeholder.com/300x450?text=No+Image"}
                        alt={movie.title}
                        className="w-full h-60 object-cover object-center group-hover:opacity-90 transition-all duration-300"
                    />
                    <div className="p-3">
                        <h4 className="text-sm font-semibold text-white truncate" title={movie.title}>
                            {movie.title}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-400 text-xs">{movie.year}</span>
                            {movie.rating && (
                                <div className="flex items-center space-x-1">
                                    <span className="text-yellow-400 text-xs">⭐</span>
                                    <span className="text-yellow-300 text-xs">{movie.rating.toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Recommend;
