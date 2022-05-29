const { Server } = require("socket.io");

let io
let analyzerStatus = 'ready'

exports.init = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('analyzer-status-event', {analyzerStatus} )
  });
}

exports.updateAnalyzerStatus = (newStatus) => {
  analyzerStatus = newStatus
  io.emit('analyzer-status-event', {analyzerStatus: newStatus})
}
