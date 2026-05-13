// Standard API Response Format

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

const sendError = (res, message = "Error", statusCode = 500, data = null) => {
  return res.status(statusCode).json({
    statusCode,
    message,
    success: false,
    ...(data && { data }),
  });
};

module.exports = {
  ApiResponse,
  sendSuccess,
  sendError,
};
