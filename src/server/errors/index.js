"use strict"

class ResponseError {
  constructor(message = "") {
    this.message = message
  }
}

class ResourceNotFound extends ResponseError {
  constructor(message = "cannot find resource") {
    super(message)
    this.code = "ResourceNotFound"
    this.status = 404
  }
}

class InternalServerError extends ResponseError {
  constructor(message = "Uh-oh, something broke server-side") {
    super(message)
    this.code = "InternalServerError"
    this.status = 500
  }
}

class ConflictError extends ResponseError {
  constructor(message = "Unable to complete your request due to some conflict with an existing resource") {
    super(message)
    this.code = "ConflictError"
    this.status = 409
  }
}

class BadRequestError extends ResponseError {
  constructor(message = "The user made a bad response") {
    super(message)
    this.code = "BadRequestError"
    this.status = 400
  }
}

class UnauthorizedError extends ResponseError {
  constructor(message = "you are unauthorized to access this resource") {
    super(message)
    this.code = "UnauthorizedError"
    this.status = 401
  }
}

class DbError {
  constructor(err) {
    this.message = err.message
    this.code = `DbError::${err.code}`
    this.stack = err.stack
    this.name = err.name
  }
}

module.exports = {
  ResourceNotFound,
  InternalServerError,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
  DbError
}
