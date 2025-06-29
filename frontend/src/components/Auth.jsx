import { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import axios from "axios";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { login, backendUrl } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const token = searchParams.get("token");
      const userId = searchParams.get("userId");

      if (token && userId) {
        try {
          // Get user profile to get complete user data
          const userResponse = await axios.get(`${backendUrl}/api/user/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          // Use the login function from context which properly sets loginTimestamp
          login(token, userResponse.data.user);
          toast.success("Google login successful!");
          navigate("/");
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          toast.error("Login failed. Please try again.");
          navigate("/login");
        }
      } else {
        toast.error("Login failed or token not provided.");
        navigate("/login");
      }
    };

    handleGoogleAuth();
  }, [searchParams, login, navigate, backendUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Completing Google login...</p>
      </div>
    </div>
  );
};

export default Auth;
