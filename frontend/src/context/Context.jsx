import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const Context = createContext();

const ContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACK_END_URL;
  const [token, settoken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // Verify token with backend
          const response = await axios.get('http://localhost:4000/api/user/profile', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          settoken(storedToken);
          setUser(response.data.user);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          settoken("");
          setUser(null);
          toast.error('Session expired. Please login again.');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", userData._id);
    settoken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    settoken("");
    setUser(null);
    toast.success('Logged out successfully');
  };

  const val = {
    backendUrl,
    token,
    settoken,
    user,
    setUser,
    login,
    logout,
    loading
  };

  return (
    <Context.Provider value={val}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;