import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  // accessing token from req.headers
  const { token } = req.headers;
  // console.log(req.headers)
  // console.log(token)
  // If token is not available login is not authorised
  if (!token) {
    return res.json({ success: false, message: "Not Authorised login" });
  }

  try {
    // decoding the token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    // setting it equal to the req.body.id
    // req.body.userId = token_decode.id;
    req.user = { id: token_decode.id };
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
