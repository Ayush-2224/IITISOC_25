# 🎬 Movie Night Planner

Movie Night Planner is a modern web application to organize and coordinate movie watch parties with your friends. Plan events, manage groups, create watchlists, and enjoy movie nights together!

![Movie Night Planner Screenshot](frontend/src/public/img1.png) <!-- Add your screenshot image here -->

---

## 🚀 Features

✅ **Authentication & Authorization**
- Secure login/signup with JWT
- Google OAuth

✅ **Groups**
- Create and join groups
- Invite members via links
- Manage group details
- Recommended movies in your Group Based on the Watch History

✅ **Real time Chat**
- Make discussion in your groups

✅ **Events**
- Schedule movie events
- Add notes and reminders
- Edit and delete your events
- Personalised watchlist for each event

✅ **Watchlists**
- Create personal watchlists
- Save movies directly from TMDB
- View all saved movies with poster, rating, and genres

✅ **Movie Search**
- Search movies using The Movie Database (TMDB) API
- View detailed movie information
- Add movies to your watchlist in one click


✅ **Responsive Design**
- Fully responsive Tailwind CSS layout


## 🎯 AI-Powered Recommendations

This project includes an intelligent movie recommender system that suggests movies tailored to each Groups watch history.

---

### ✨ How It Works

- **NLP & Cosine Similarity:**  
  Uses TF-IDF vectorization of movie genres, keywords, and taglines to find similar movies.
  
- **Dynamic Metadata Fetching:**  
  Automatically pulls movie data and keywords from the TMDB API.
  
- **Parallel Processing:**  
  Fetches metadata and posters concurrently for fast response times.

- **In-Memory Caching:**  
  Caches results to avoid repeated API calls and improve performance.


---


## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT,Google Oauth
- **External APIs:** TMDB API for movie data

---



## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayush-2224/IITISOC_25.git
   cd IITISOC_25


