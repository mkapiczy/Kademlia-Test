const request = require('request');
const util = require('./util');

function Node(id, ipAddr, port) {
  this.id = id;
  this.ipAddr = ipAddr;
  this.port = port;
}

module.exports = Node;