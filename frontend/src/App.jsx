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
import DiscussionPage from "./pages/DiscussionPage";
import CreateGroupForm from "./pages/createGroup";
import JoinGroupForm from "./pages/JoinGroupForm";
import GroupDetails from "./pages/GroupDetails";
import Groups from "./pages/Groups";
import Auth from "./components/Auth"; // Google Auth component

const App = () => {
  return (
    <div>
      <ToastContainer position="bottom-right" />
      <Navbar />
      <SearchBarWithFilters />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/explore" element={<ExploreTrending timeWindow="week" />}/>
        <Route path="/search" element={<SearchResults />} />
        <Route path="/:mediaType/:id" element={<MediaDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/events/create" element={<EventRegistration />} />
        <Route path="/discussion/:groupId" element={<DiscussionPage />} />
        <Route path="/create-group" element={<CreateGroupForm />}></Route>
        <Route path="/join-group" element={<JoinGroupForm />} />
        <Route path="/group/:groupId" element={<GroupDetails />} />
        <Route path="/groups" element={<Groups />}></Route>
        
            <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
};

export default App;
