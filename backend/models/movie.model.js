import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
movieId: { type: String, required: true, unique: true }, // external API ID
title: String,
genres: [String],
rating: Number,
year: Number,
platforms: [String],
posterUrl: String,
overview: String,
});

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);
export default Movie;