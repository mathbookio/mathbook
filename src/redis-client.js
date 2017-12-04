"use strict"

const Promise = require("bluebird")
const redis = require("redis")

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

const config = require("../config/local.json")
const redisHost = config["redisHost"]
const redisPort = config["redisPort"]
const redisPassword = config["redisPassword"]
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  password: redisPassword
})

module.exports = redisClient
