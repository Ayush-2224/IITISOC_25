import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Context = createContext();

const ContextProvider = (props) => {
  const backendUrl = "http://localhost:4000";
  const [token, settoken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if session has expired (3 days)
  const isSessionExpired = (loginTimestamp) => {
    if (!loginTimestamp) return true;
    
    try {
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
      const currentTime = new Date().getTime();
      const loginTime = new Date(loginTimestamp).getTime();
      return (currentTime - loginTime) > threeDaysInMs;
    } catch (error) {
      console.error('Error parsing login timestamp:', error);
      return true; // If we can't parse the timestamp, consider it expired
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const loginTimestamp = localStorage.getItem("loginTimestamp");
      
      if (storedToken) {
        // If no loginTimestamp exists, try to validate the token anyway
        // This handles cases where users logged in before loginTimestamp was implemented
        if (!loginTimestamp) {
          console.log('No loginTimestamp found, validating token directly...');
          try {
            const response = await axios.get(`${backendUrl}/api/user/profile`, {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });
            settoken(storedToken);
            setUser(response.data.user);
            // Set a new loginTimestamp for future sessions
            const loginTime = new Date().toISOString();
            localStorage.setItem("loginTimestamp", loginTime);
          } catch (error) {
            console.error('Token validation failed:', error);
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("loginTimestamp");
            settoken("");
            setUser(null);
            toast.error('Session expired. Please login again.');
          }
        } else {
          // Check if session has expired
          if (isSessionExpired(loginTimestamp)) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("loginTimestamp");
            settoken("");
            setUser(null);
            toast.error('Session expired. Please login again.');
            setLoading(false);
            return;
          }

          try {
            // Verify token with backend
            const response = await axios.get(`${backendUrl}/api/user/profile`, {
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
            localStorage.removeItem("loginTimestamp");
            settoken("");
            setUser(null);
            toast.error('Session expired. Please login again.');
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken, userData) => {
    const loginTime = new Date().toISOString();
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", userData._id);
    localStorage.setItem("loginTimestamp", loginTime);
    settoken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("loginTimestamp");
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

export { Context };
export default ContextProvider;