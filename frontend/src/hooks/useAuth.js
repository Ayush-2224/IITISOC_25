import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:4000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setIsAuthenticated(true);
      setUser(response.data.user);
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      toast.error('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userData._id);
    setIsAuthenticated(true);
    setUser(userData);
  };

  return {
    isAuthenticated,
    user,
    loading,
    logout,
    login,
    checkAuthStatus,
  };
}; 