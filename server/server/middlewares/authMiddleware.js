const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || process.env.jwt_secret;

    if (!secret) {
      throw new Error("JWT secret not configured");
    }

    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId; // safer than modifying req.body

    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Authentication failed: " + error.message,
    });
  }
};
