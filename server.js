const http = require('http');
const url = require('url');
const WebSocketServer = require('websocket').server;
const uuid = require('uuid/v1');
const MessageTypes = require('./message-types.js');
// Constants
const SERVER_PORT = 3000;

/////////////////////////////// ERROR LOGGING //////////////////////////////////
function logError(error) {
  console.error('SERVER: ' + error);
}

function log(error) {
  console.log('SERVER: ' + error);
}
////////////////////////////////////////////////////////////////////////////////

class Server {
  constructor() {
    // Map of Peer IDs to websocket connections
    this.connectionArray = new Map();
  }

  start() {
    const httpServer = http.createServer((req, res) => {
      log('Received request for ' + request.url);
      res.writeHead(404);
      res.end()
    });

    httpServer.listen(SERVER_PORT, () => {
      log('Server is listening on port ' + SERVER_PORT)
    });

    // Convert HTTP server into WebSocket server
    const wsServer = new WebSocketServer({
      httpServer: httpServer,
      autoAcceptConnections: false
    });

    wsServer.on('request', (req) => {
      if (!originIsAllowed(req.origin)) {
        req.reject();
        log('Connection from ' + req.origin + ' rejected');
        return;
      }

      // Accept request and get a connection
      const connection = req.accept('json', req.origin);
      log('Connection accepted from ' + connection.remoteAddress);

      // Create a unique peer ID for the connecting peer. The ID remains the
      // same for the entire session of connection to the server.
      const peerId = uuid();
      this.connectionArray.set(peerId, connection);

      // Inform the connecting peer of its new ID and wait for acknowledgement.
      let msg = {
        type: MessageTypes.ASSIGN_PEER_ID,
        createdByServer: true,
        assignedPeerId: peerId,
      };
      connection.sendUTF(JSON.stringify(msg));

      // Setup handler for messages received from the peer over the connection
      // `connection`
      connection.on('message', (data) => {
        if (data.type === 'utf8') {
          log('Received message: ' + data.utf8Data);

          let msg = JSON.parse(data.utf8Data);

          switch (msg.type) {
            case MessageTypes.ACCEPTED_PEER_ID:
              break;
            default:
              logError('Unrecognized message type: ' + msg.type);
              logError('Full message: ' + msg);
              break;
          }
          if (msg.targetPeerId) {
            let msgString = JSON.stringify(msg);
            this.sendMessage(msg.targetPeerId, msgString);
          }
        }
      });
    });
  }

  originIsAllowed(origin) {
    return true;
  }

  sendMessage(targetPeerId, msgString) {
    let connection = this.connectionArray.get(targetPeerId);
    if (!connection) {
      logError('Unknown Peer ID: ' + targetPeerId);
      return;
    }
    connection.sendUTF(msgString);
  }
}
module.exports = Server
