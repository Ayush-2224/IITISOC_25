import express from "express";

import { addMovieToWatchlist } from "../controllers/watchlist.controller.js";
import authUser from "../middleware/auth.js";
import { getMyWatchlists } from "../controllers/watchlist.controller.js";

const Watchlistrouter = express.Router();

Watchlistrouter.post("/add", authUser, addMovieToWatchlist);
Watchlistrouter.get("/my", authUser, getMyWatchlists);

export default Watchlistrouter;
