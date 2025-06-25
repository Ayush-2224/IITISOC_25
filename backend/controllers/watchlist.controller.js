import Watchlist from "../models/watchlist.model.js";
import Movie from "../models/movie.model.js"; 

export const addMovieToWatchlist = async (req, res) => {
  const { movieId, title, posterUrl, rating, year, genres } = req.body;
  const userId = req.user.id;

  try {
    let movie = await Movie.findOne({ movieId });
    if (!movie) {
      movie = new Movie({ movieId, title, posterUrl, rating, year, genres });
      await movie.save();
    }

    let watchlist = await Watchlist.findOne({ owner: userId });
    if (!watchlist) {
      watchlist = new Watchlist({ owner: userId, movies: [] });
    }

    const alreadyExists = watchlist.movies.some((m) => m.equals(movie._id));

    if (!alreadyExists) {
      watchlist.movies.push(movie._id);
      await watchlist.save();
    }

    res.status(200).json({ message: "Movie added to watchlist" });
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
    res.status(500).json({ message: "Failed to add to watchlist" });
  }
};


export const getMyWatchlists = async (req, res) => {
  try {
    const userId = req.user.id;

    const watchlists = await Watchlist.find({ owner: userId })
      .populate({
        path: "movies",
        select: "title posterUrl rating year genres movieId",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, watchlists });
  } catch (error) {
    console.error("Error fetching watchlists:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch watchlists" });
  }
};
export const removeMovieFromWatchlist = async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id;

  try {
    const watchlist = await Watchlist.findOne({ owner: userId });
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    const movie = await Movie.findOne({ movieId });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    watchlist.movies = watchlist.movies.filter(
      (m) => !m.equals(movie._id)
    );

    await watchlist.save();
    res.status(200).json({ message: "Movie removed from watchlist" });
  } catch (error) {
    console.log("Error removing movie from watchlist:", error.message);
    res.status(500).json({ message: "Failed to remove movie from watchlist" });
  }
};



export const presentInWatchlist = async (req, res) => {
  try {
    const { movieId } = req.query;
    const userId = req.user.id;

    const watchlist = await Watchlist.findOne({ owner: userId });
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    const movie = await Movie.findOne({ movieId });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    console.log(movie._id)
    const isPresent = watchlist.movies.some(
      (m) => m.toString() === movie._id.toString()
    );
    
    console.log(watchlist.movies)
    res.status(200).json({ isPresent });
  } catch (error) {
    console.log("Error checking if movie is in watchlist:", error.message);
    res.status(500).json({ message: "Failed to check if movie is in watchlist" });
  }
};
