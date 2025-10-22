const express = require("express");
const userRouter = express.Router();
const User = require("../models/user.model");
const { generateToken } = require("../services/token.services");
const moment = require("moment");
const {
  checkAuthentication,
  checkAuthorization,
  checkOwnershipOrAdmin,
} = require("../middleware/check-auth");

// --------------------- REGISTER ---------------------
userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (await User.isEmailTaken(email)) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --------------------- LOGIN ---------------------
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.isPasswordMatch(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if suspended
    if (user.isSuspended) {
      return res
        .status(403)
        .json({ message: "Account suspended. Contact admin." });
    }

    const accessTokenExpires = moment().add(
      process.env.JWT_ACCESS_EXPIRATION_MINUTES,
      "minutes"
    );

    const accessToken = await generateToken(
      user._id,
      user.role,
      accessTokenExpires,
      "access",
      user.tokenVersion // include tokenVersion
    );

    res.status(200).json({
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        access: {
          token: accessToken,
          expires: accessTokenExpires.toDate(),
          expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES * 60,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --------------------- LOGOUT ---------------------
userRouter.post("/logout", checkAuthentication, async (req, res) => {
  try {
    // Optional: invalidate all existing tokens
    await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });

    res.status(200).json({
      message:
        "Logout successful. Access tokens invalidated. Please remove token from client.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --------------------- GET ALL USERS (ADMIN ONLY) ---------------------
userRouter.get(
  "/",
  checkAuthentication,
  checkAuthorization,
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json({
        message: "Users fetched successfully",
        count: users.length,
        data: users,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// --------------------- GET SINGLE USER (OWNER OR ADMIN) ---------------------
userRouter.get(
  "/:userId",
  checkAuthentication,
  checkOwnershipOrAdmin((req) => req.params.userId),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User fetched successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isSuspended: user.isSuspended,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// --------------------- UPDATE USER (OWNER OR ADMIN) ---------------------
userRouter.patch(
  "/:userId",
  checkAuthentication,
  checkOwnershipOrAdmin((req) => req.params.userId),
  async (req, res) => {
    const updateBody = { ...req.body };
    const { userId } = req.params;

    try {
      // Prevent role update
      if ("role" in updateBody) delete updateBody.role;

      // Email uniqueness check
      if (updateBody.email) {
        const existingUser = await User.findOne({ email: updateBody.email });
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({ message: "Email already taken" });
        }
      }

      const user = await User.findByIdAndUpdate(userId, updateBody, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User updated successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isSuspended: user.isSuspended,
          profileImageUrl: user.profileImageUrl,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// --------------------- DELETE USER (OWNER OR ADMIN) ---------------------
userRouter.delete(
  "/:userId",
  checkAuthentication,
  checkOwnershipOrAdmin((req) => req.params.userId),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User deleted successfully",
        data: { id: user._id, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// --------------------- PROFILE ---------------------
userRouter.get("/profile", checkAuthentication, async (req, res) => {
  const user = req.user;
  res.status(200).json({
    message: "User profile fetched",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isSuspended: user.isSuspended,
    },
  });
});

// --------------------- ADMIN ONLY ROUTE ---------------------
userRouter.get(
  "/admin",
  checkAuthentication,
  checkAuthorization,
  async (req, res) => {
    res.status(200).json({ message: "Admin only access" });
  }
);

module.exports = userRouter;
