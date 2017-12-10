"use strict"

const logger = require("../src/server/logger")
const convict = require("convict")
let config = null

const getConfiguration = () => {
  if (config !== null) {
    return config
  }

  config = convict({
    env: {
      doc: "The application environment.",
      format: ["production", "development", "local"],
      default: "local",
      env: "NODE_ENV"
    },
    github: {
      clientSecret: {
        doc: "The client secret key for Mathbook",
        format: "String",
        default: "client-secret",
        env: "CLIENT_SECRET",
        sensitive: true
      },
      clientId: {
        doc: "The client id key for Mathbook",
        format: "String",
        default: "client-id",
        env: "CLIENT_ID",
        sensitive: true
      }
    },
    redis: {
      host: {
        doc: "The hostname used to connect to redis server",
        format: "String",
        default: "127.0.0.1",
        env: "REDIS_HOST"
      },
      port: {
        doc: "The port used to connect to redis server",
        format: "port",
        default: 6379,
        env: "REDIS_PORT"
      },
      password: {
        doc: "The password needed to authenticate",
        format: "String",
        default: "",
        env: "REDIS_PASSWORD",
        sensitive: true
      }
    },
    bin: {
      host: {
        doc: "The IP address to bind.",
        format: "ipaddress",
        default: "127.0.0.1",
        env: "IP_ADDRESS"
      },
      port: {
        doc: "The port to bind.",
        format: "port",
        default: 4000,
        env: "PORT"
      }
    }
  })

  const env = config.get("env")
  config.loadFile(`./config/${env}.json`)
  logger.info(`Successfully loaded ${env} Environment.`)
  return config
}

module.exports = getConfiguration
