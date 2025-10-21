const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// ✅ Authentication middleware
async function checkAuthentication(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fetch full user
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Check if token version matches
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res
        .status(401)
        .json({ message: "Token invalidated. Please login again." });
    }

    // Check if account is suspended
    if (user.isSuspended) {
      return res
        .status(403)
        .json({ message: "Account suspended. Contact support." });
    }

    req.user = user; // attach full user object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

// ✅ Authorization middleware (Admin only)
function checkAuthorization(req, res, next) {
  if (req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized: Admins only." });
  }
}

// ✅ Optional: Authorization middleware for owner or admin
function checkOwnershipOrAdmin(getResourceUserId) {
  return (req, res, next) => {
    const resourceUserId = getResourceUserId(req);
    if (
      req.user._id.toString() === resourceUserId.toString() ||
      req.user.role === "admin"
    ) {
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized: Not allowed." });
    }
  };
}

module.exports = {
  checkAuthentication,
  checkAuthorization,
  checkOwnershipOrAdmin,
};
