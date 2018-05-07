var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

server.listen(process.env.post || 3000);
console.log('server running');

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Conneted: %s sockets connected', connections.length);

    socket.on('disconnect', function(data) {
        if(!socket.username)  {
           
            users.splice(users.indexOf(socket.username), 1);
        }
        

        // Disconnect
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('send message', function(data){
        console.log(data);
        io.sockets.emit('new message', {msg: data})
    });

    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });

    function updateUserNames() {
        io.sockets.emit('get users', users);
    }
    
});