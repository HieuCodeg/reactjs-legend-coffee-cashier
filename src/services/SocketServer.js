var express = require('express');
const http = require('http');
var app = express();
const server = http.createServer(app);

const socketIo = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});

socketIo.on('connection', (socket) => {
    console.log('New client connected' + socket.id);

    socket.emit('getId', socket.id);

    socket.on('sendDataClient', function (data) {
        console.log(data);
        socketIo.emit('sendDataServer', { data });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    // socket.on('create-room', (roomId, senderId, recipientId) => {
    //     console.log(roomId, senderId, recipientId);
    // });

    socket.on('newMsg', (id, msg) => {
        console.log(id, msg);
    });

    // socket.on('create-room', (roomId, senderId, recipientId) => {
    //     console.log('object');
    // });
});

// socketIo.on('create-room', (roomId, senderId, recipientId) => {
//     console.log(roomId, senderId, recipientId);
// });

server.listen(3000, () => {
    console.log('Server đang chay tren cong 3000');
});
