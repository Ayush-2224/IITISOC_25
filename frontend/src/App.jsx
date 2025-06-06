import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import "react-toastify/dist/ReactToastify.css";
import ExploreTrending from "./components/Explore";
import SearchBarWithFilters from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import MediaDetails from "./components/MediaDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EventRegistration from "./pages/EventRegistration";

const App = () => {
  return (
    <div >
      <ToastContainer position="bottom-right"/>
      <Navbar/>
      <SearchBarWithFilters/>
        <Routes>
           <Route path="/login" element={<Login/>} />
            <Route path="/" element={<Home/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/explore" element={<ExploreTrending timeWindow="week"/>} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/:mediaType/:id" element={<MediaDetails />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/events/create" element={<EventRegistration />} />
       </Routes>
    </div>
  );
};

export default App;
