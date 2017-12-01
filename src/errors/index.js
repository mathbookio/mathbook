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

class ResourceUnavailable extends ResponseError {
  constructor(message = "the name is not available for use") {
    super(message)
    this.code = "ResourceUnavailableError"
    this.status = 401
  }
}

module.exports = {
  ResourceNotFound,
  InternalServerError,
  ResourceUnavailable
}
