const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token)
    return res.status(401).json({ message: "You need to Login first" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.uid = decoded.id;
    req.body.email = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
