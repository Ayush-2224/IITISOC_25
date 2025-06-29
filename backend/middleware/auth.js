import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ success: false, message: "Not Authorized, token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the full user object including googleRefreshToken
    const user = await userModel.findById(decoded.id).select('+googleRefreshToken');
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    
    req.user = user; // Now accessible via req.user with all fields including googleRefreshToken
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalid" });
  }
};

export { authUser as verifyToken };
export default authUser;
