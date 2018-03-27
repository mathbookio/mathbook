console.log("DOMAIN", location.hostname, location.protocol, location.port)
const wsProtocol = location.protocol
const wsDomain = location.hostname
const wsPort = location.port
const wsUrl = `${wsProtocol}//${wsDomain}:${wsPort}`
const webSocket = io(wsUrl)
webSocket.on("connect", function() {
  console.log("Websocket Connected")
})

webSocket.on("disconnect", function() {
  console.log("Websocket Disconnected")
})

webSocket.on("reconnect", attemptNumber => {
  console.log("Websocket Reconnected")
})

webSocket.on("reconnecting", attemptNumber => {
  console.log("Websocket Reconnecting::attemptNumber", attemptNumber)
})

webSocket.on("reconnect_failed", () => {
  console.log("Websocket failed to reconnect. Exhausted all reconnect attempts.")
})

webSocket.on("reconnect_error", error => {
  console.error("Websocket - ReconnectError", error)
})

function cacheTutorial(data) {
  data["hashToken"] = Cookies.get("hashToken")
  webSocket.emit(WebSocketTopics.CacheTutorial, data)
}

const WebSocketTopics = {
  CacheTutorial: "cacheTutorial",
  Saved: "saved",
  SaveFailed: "saveFailed"
}
