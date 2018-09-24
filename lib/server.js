const http = require('http');

// Create server
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');

module.exports =
class Server {
  constructor(options) {
    this.databaseURL = options.databaseURL
  }

  async start() {
    const model
  }
}
