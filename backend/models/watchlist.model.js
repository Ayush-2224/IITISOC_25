import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
  name: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user2" },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  createdAt: { type: Date, default: Date.now },
});

const Watchlist =
  mongoose.models.Watchlist || mongoose.model("Watchlist", watchlistSchema);
export default Watchlist;
