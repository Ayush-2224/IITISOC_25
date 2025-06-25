import express from "express";

import { addMovieToWatchlist } from "../controllers/watchlist.controller.js";
import authUser from "../middleware/auth.js";
import { getMyWatchlists } from "../controllers/watchlist.controller.js";
import { removeMovieFromWatchlist } from "../controllers/watchlist.controller.js";
import { presentInWatchlist } from "../controllers/watchlist.controller.js";
const Watchlistrouter = express.Router();

Watchlistrouter.post("/add", authUser, addMovieToWatchlist);
Watchlistrouter.get("/my", authUser, getMyWatchlists);
Watchlistrouter.delete("/remove", authUser, removeMovieFromWatchlist);
Watchlistrouter.get("/check", authUser, presentInWatchlist);

export default Watchlistrouter;
