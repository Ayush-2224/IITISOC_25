import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Context } from '../context/Context';

// Protected Route for Login Required
export const RequireAuth = ({ children }) => {
  const { token, loading: contextLoading } = useContext(Context);
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('RequireAuth: Context loading:', contextLoading, 'Token from context:', token);
    
    const verifyToken = async () => {
      // Wait for context to finish loading
      if (contextLoading) {
        return;
      }

      // Check both context token and localStorage as fallback
      const currentToken = token || localStorage.getItem("token");
      
      if (!currentToken) {
        console.log('RequireAuth: No token found');
        setIsValidToken(false);
        setLoading(false);
        return;
      }

      try {
        console.log('RequireAuth: Verifying token with backend...');
        await axios.get('http://localhost:4000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        console.log('RequireAuth: Token verified successfully');
        setIsValidToken(true);
      } catch (error) {
        console.error('RequireAuth: Token verification failed:', error);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsValidToken(false);
        toast.error('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, contextLoading]);

  console.log('RequireAuth: Loading:', loading, 'isValidToken:', isValidToken, 'Context loading:', contextLoading);

  // Show loading while context is still loading
  if (contextLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    console.log('RequireAuth: Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('RequireAuth: Rendering protected content');
  return children;
};

// Protected Route for Group Membership
export const RequireGroupMembership = ({ children }) => {
  const { groupId } = useParams();
  const { token, loading: contextLoading } = useContext(Context);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for context to finish loading
    if (contextLoading) {
      return;
    }

    const currentToken = token || localStorage.getItem("token");
    
    if (!currentToken) {
      setLoading(false);
      return;
    }

    const checkGroupMembership = async () => {
      try {
        await axios.get(`http://localhost:4000/api/group/${groupId}`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        setIsMember(true);
      } catch (error) {
        console.error('Group membership check failed:', error);
        setIsMember(false);
        toast.error('You are not a member of this group or the group does not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      checkGroupMembership();
    }
  }, [groupId, token, contextLoading]);

  if (contextLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking group membership...</p>
        </div>
      </div>
    );
  }

  if (!isMember) {
    return <Navigate to="/groups" replace />;
  }

  return children;
};

// Protected Route for Event Access (requires group membership)
export const RequireEventAccess = ({ children }) => {
  const { eventId } = useParams();
  const { token, loading: contextLoading } = useContext(Context);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for context to finish loading
    if (contextLoading) {
      return;
    }

    const currentToken = token || localStorage.getItem("token");
    
    if (!currentToken) {
      setLoading(false);
      return;
    }

    const checkEventAccess = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/events/get/${eventId}`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        
        // If event exists and user has access, allow
        setHasAccess(true);
      } catch (error) {
        console.error('Event access check failed:', error);
        setHasAccess(false);
        toast.error('You do not have access to this event or it does not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      checkEventAccess();
    }
  }, [eventId, token, contextLoading]);

  if (contextLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking event access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return <Navigate to="/groups" replace />;
  }

  return children;
};

// Protected Route for Group Creation (requires login)
export const RequireGroupCreation = ({ children }) => {
  const { token, loading: contextLoading } = useContext(Context);
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for context to finish loading
    if (contextLoading) {
      return;
    }

    const currentToken = token || localStorage.getItem("token");

    const verifyToken = async () => {
      if (!currentToken) {
        setIsValidToken(false);
        setLoading(false);
        return;
      }

      try {
        await axios.get('http://localhost:4000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        setIsValidToken(true);
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsValidToken(false);
        toast.error('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, contextLoading]);

  if (contextLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}; 