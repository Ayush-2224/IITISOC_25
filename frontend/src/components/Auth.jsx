import { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { toast } from "react-toastify";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { settoken } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");

    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      settoken(token);
      toast.success("Google login successful!");
      navigate("/");
    } else {
      toast.error("Login failed or token not provided.");
      navigate("/login");
    }
  }, []);

  return null; // or a loading spinner
};

export default Auth;
