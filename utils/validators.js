// Input Validators

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }
  return { valid: true };
};

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phoneNumber.replace(/\s/g, ""));
};

const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return input.trim().replace(/[<>]/g, "");
  }
  return input;
};

const validateUserInput = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required");
  }

  if (data.name && data.name.length > 100) {
    errors.push("Name must not exceed 100 characters");
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push("Valid email is required");
  }

  if (data.password) {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      errors.push(passwordValidation.error);
    }
  }

  return { valid: errors.length === 0, errors };
};

const validateBusinessInput = (data) => {
  const errors = [];

  if (!data.businessName || data.businessName.trim() === "") {
    errors.push("Business name is required");
  }

  if (data.businessName && data.businessName.length > 200) {
    errors.push("Business name must not exceed 200 characters");
  }

  if (data.description && data.description.length > 5000) {
    errors.push("Description must not exceed 5000 characters");
  }

  if (data.phoneNumber && !validatePhoneNumber(data.phoneNumber)) {
    errors.push("Invalid phone number format");
  }

  if (data.website && !validateUrl(data.website)) {
    errors.push("Invalid website URL");
  }

  if (data.latitude && (data.latitude < -90 || data.latitude > 90)) {
    errors.push("Invalid latitude coordinate");
  }

  if (data.longitude && (data.longitude < -180 || data.longitude > 180)) {
    errors.push("Invalid longitude coordinate");
  }

  return { valid: errors.length === 0, errors };
};

const validateReviewInput = (data) => {
  const errors = [];

  if (!data.feedback || data.feedback.trim().length < 10) {
    errors.push("Feedback must be at least 10 characters");
  }

  if (data.feedback && data.feedback.length > 1000) {
    errors.push("Feedback must be less than 1000 characters");
  }

  if (!data.businessId) {
    errors.push("Business ID is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUrl,
  validatePhoneNumber,
  sanitizeInput,
  validateUserInput,
  validateBusinessInput,
  validateReviewInput,
};
