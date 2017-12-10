"use strict"

const bunyan = require("bunyan")
const logger = bunyan.createLogger({
  name: "Mathbook",
  streams: [
    {
      level: "info",
      stream: process.stdout // log INFO and above to stdout
    },
    {
      level: "error",
      path: "src/logs/error-logs.json" // log ERROR and above to a file
    }
  ],
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err
  }
})
module.exports = logger
