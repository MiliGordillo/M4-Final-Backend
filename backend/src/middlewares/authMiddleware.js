const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authMiddleware: Authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("authMiddleware: No token enviado");
    return res.status(403).json({ message: "Token no enviado" });
  }

  const token = authHeader.split(" ")[1];
  console.log("authMiddleware: Token extraído:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    console.log("authMiddleware: Token inválido:", err.message);
    return res.status(403).json({ message: "Token inválido" });
  }
};
