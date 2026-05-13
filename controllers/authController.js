const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { validateEmail, validatePassword } = require("../utils/validators");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return sendError(res, "Name, email, and password are required", 400);
    }

    if (!validateEmail(email)) {
      return sendError(res, "Invalid email format", 400);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return sendError(res, passwordValidation.message, 400);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, "Email already in use", 409);
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    // Generate tokens
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return response
    return sendSuccess(
      res,
      {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
        refreshToken,
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    console.error("Registration error:", error);
    return sendError(res, error.message || "Registration failed", 500);
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return sendError(res, "Email and password are required", 400);
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, "Invalid credentials", 401);
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid credentials", 401);
    }

    // Generate tokens
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendSuccess(res, {
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, error.message || "Login failed", 500);
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, "Refresh token required", 400);
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (err) {
      return sendError(res, "Invalid refresh token", 401);
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    // Generate new token
    const newToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return sendSuccess(res, {
      token: newToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return sendError(res, error.message || "Token refresh failed", 500);
  }
};

// Logout (client-side handled, but endpoint for completeness)
exports.logout = async (req, res) => {
  return sendSuccess(res, null, "Logged out successfully");
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, user);
  } catch (error) {
    console.error("Get user error:", error);
    return sendError(res, error.message || "Failed to get user", 500);
  }
};
