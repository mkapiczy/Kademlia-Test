const request = require('request');
const util = require('./util');

function Rpc(nodeId) {
	this.nodeId = nodeId;
}

Rpc.prototype.ping = function (node, cb) {
    var rpcId = util.createRandomId(20);
    console.log('send ping');
    request(node.ip + ':' + node.port + '/api/kademlia/ping', cb);
}

module.exports = Rpc;