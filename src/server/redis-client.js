"use strict"

const Promise = require("bluebird")
const redis = require("redis")
const errors = require("./errors")
const log = require("./logger")

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

const config = require("../../config/local.json")
const redisHost = config["redisHost"]
const redisPort = config["redisPort"]
const redisPassword = config["redisPassword"]
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  retry_strategy: retryStrategy
})

function retryStrategy({ total_retry_time, error }) {
  if (error && error.code === "ECONNREFUSED") {
    // End reconnecting on a specific error and flush all commands with
    // an individual error
    error.message +=
      " [ Failed to connect to Redis Server. Is your Redis server running ? If it is, check to see if your config values are correct. ]"
    throw error // crash the app.
  }
  const retryTime = 1000 * 50 // 50 seconds to retry
  if (total_retry_time > retryTime) {
    // End reconnecting after a specific timeout and flush all commands
    // with an individual error
    if (error) {
      return error
    }
    const err = {
      message: "All retry attempts were exhausted.",
      code: "RedisRetryConnectionError",
      name: "RetryError"
    }
    return err
  }
  // if its not a connection refused error try and reconnect after
  const tenSeconds = 10000 // this should give us 5 retry attempts
  return tenSeconds
}

redisClient.on("error", function(err) {
  const dbError = new errors.DbError(err)
  log.error(dbError, "Redis Client Error Occurred")
})

redisClient.on("ready", function() {
  log.info("Redis is now ready and operational.")
})
redisClient.on("connect", function(msg) {
  log.info("Redis stream is now connected to the server.", msg)
})
redisClient.on("reconnecting", function() {
  log.warn("Redis is attempting to reconnect, please standby.")
})

module.exports = redisClient
