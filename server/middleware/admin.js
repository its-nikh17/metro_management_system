const User = require("../models/Users");

async function adminMiddleware(req, res, next) {
  const user = await User.findById(req.userId).select("role");
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
}

module.exports = adminMiddleware;
