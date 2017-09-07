const request = require('request');
const util = require('./util');

function Node(id, ipAddr, port) {
  this.id = id;
  this.ipAddr = ipAddr;
  this.port = port;
}

Node.prototype.ping = function (cb) {
    var rpcId = util.createRandomId(20);
    console.log('send ping');
    request(node.ipAddr + ':' + node.port + '/api/kademlia/ping', cb);
}


module.exports = Node;