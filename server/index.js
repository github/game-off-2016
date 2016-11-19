#!/usr/bin/env nodejs
var http = require('http');
var ms = require('./minesweeper.js');
var map = new ms(10,0.1);
var WebSocketServer = require('websocket').server;

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(9501, function() {
    console.log((new Date()) + ' Server is listening on port 9501');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var connections = [];

var cmds = {
    getMap:function(req){
        return map.getMap();
    },
    clickBox:function(req){
        return map.clickBox(req);
    },
};

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    connections.push(connection);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            //connection.sendUTF(message.utf8Data);
            var messageData = message.utf8Data.split(' ');
            var command = [messageData.shift(), messageData.join('')];
            console.log(command);
            if (command[0] in cmds) {
                console.log((new Date()) + ' '+command[0]+' ran');
                console.log(JSON.parse(command[1]));
                var sending = JSON.stringify(cmds[command[0]](JSON.parse(command[1])));
                console.log('Server sent: '+ sending);
                connection.send(sending);
            }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            //connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
