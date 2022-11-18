const STATUS_CODES = {
  Ok: 200,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

class AppError extends Error {
  constructor(
    name,
    statusCode,
    description,
    isOperational,
    errorStack,
    loginErrorResponse
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    (this.isOperational = isOperational),
      (this.errorStack = errorStack),
      (this.logError = loginErrorResponse),
      Error.captureStackTrace(this);
  }
}

//api Specific errors
class APIError extends AppError {
  constructor(
    name,
    statusCode = STATUS_CODES.INTERNAL_ERROR,
    description = "Internal server Error",
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

//400
class BadRequestError extends AppError {
  constructor(description = "Bad request", loginErrorResponse) {
    super(
      "NOT FOUND",
      STATUS_CODES.BAD_REQUEST,
      description,
      true,
      false,
      loginErrorResponse
    );
  }
}

//400
class ValidationError extends AppError {
  constructor(description = "Validation Error", errorStack) {
    super("BAD REQUEST", STATUS_CODES.BAD_REQUEST),
      description,
      true,
      errorStack;
  }
}

module.exports = {
  AppError,
  APIError,
  BadRequestError,
  ValidationError,
  STATUS_CODES,
};
