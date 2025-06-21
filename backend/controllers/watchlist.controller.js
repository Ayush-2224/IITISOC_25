import Watchlist from "../models/watchlist.model.js";
import Movie from "../models/movie.model.js"; 

export const addMovieToWatchlist = async (req, res) => {
  const { movieId, title, posterUrl, rating, year, genres } = req.body;
  const userId = req.user.id;
  console.log(movieId);

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

   
    if (!watchlist.movies.some((m) => m.toString() === movie._id.toString())) {
      watchlist.movies.push(movie._id);
      await watchlist.save();
    }

    res.status(200).json({ message: "Movie added to watchlist" });
  } catch (error) {
    console.error(error);
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


