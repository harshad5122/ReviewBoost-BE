const { validateEmail, validateUserInput, sanitizeInput } = require("../utils/validators");
const { sendError } = require("../utils/apiResponse");

const validateUserRegistration = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check required fields
  if (!name || !email || !password || !confirmPassword) {
    return sendError(res, "All fields are required", 400);
  }

  // Validate input
  const validation = validateUserInput({ name, email, password });
  if (!validation.valid) {
    return sendError(res, "Validation failed", 400, validation.errors);
  }

  // Check password match
  if (password !== confirmPassword) {
    return sendError(res, "Passwords do not match", 400);
  }

  // Sanitize inputs
  req.body.name = sanitizeInput(name);
  req.body.email = email.toLowerCase().trim();

  next();
};

const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, "Email and password are required", 400);
  }

  if (!validateEmail(email)) {
    return sendError(res, "Invalid email format", 400);
  }

  req.body.email = email.toLowerCase().trim();

  next();
};

const validateBusinessCreation = (req, res, next) => {
  const { businessName, category, city } = req.body;

  if (!businessName || !category || !city) {
    return sendError(res, "Business name, category, and city are required", 400);
  }

  req.body.businessName = sanitizeInput(businessName);
  if (req.body.description) {
    req.body.description = sanitizeInput(req.body.description);
  }

  next();
};

const validateBusinessUpdate = (req, res, next) => {
  // Sanitize input fields
  if (req.body.businessName) {
    req.body.businessName = sanitizeInput(req.body.businessName);
  }
  if (req.body.description) {
    req.body.description = sanitizeInput(req.body.description);
  }

  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateBusinessCreation,
  validateBusinessUpdate,
};
