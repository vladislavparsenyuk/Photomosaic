var express = require('express');
var server = express();
var port = 3000;

server.use(express.static(__dirname));
server.listen(port, function () {
    console.log('Listening on port ', port);
});