import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import "react-toastify/dist/ReactToastify.css";
import ExploreTrending from "./components/Explore";

const App = () => {
  return (
    <div >
      <ToastContainer position="bottom-right"/>
      <Navbar/>
        <Routes>
           <Route path="/login" element={<Login/>} />
           <Route path="/" element={<Home/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/explore" element={<ExploreTrending timeWindow="week"/>} />
        </Routes>
    </div>
  );
};

export default App;
