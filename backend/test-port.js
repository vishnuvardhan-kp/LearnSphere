const net = require('net');
const server = net.createServer();
server.listen(5001, () => {
  console.log('Port 5001 is free!');
  server.close();
});
server.on('error', (err) => {
  console.log('Port 5001 is BUSY: ' + err.message);
});
