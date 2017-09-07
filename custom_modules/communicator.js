const request = require("request");
const HttpStatus = require("http-status-codes");
const util = require("./util");

const NodeState = require("./../enum/nodeStateEnum")

exports.sendPing = function(senderNode, nodeToPing, callBack) {
  var rpcId = util.createRandomAlphaNumericIdentifier(20);
  console.log("send ping");

  var requestOptions = {
    method: "GET",
    uri: nodeToPing.ipAddr + ":" + nodeToPing.port + "/api/kademlia/ping",
    body: {
      nodeId: senderNode.id,
      nodeIP: senderNode.ipAddr,
      port: senderNode.port,
      rpcId: rpcId
    },
    json: true
  };
  
  request(requestOptions, function(error, response) {
    if (error) {
      console.log(error);
      callBack(NodeState.NOT_ALIVE);
    } else {
      console.log(response.body);
      callBack(NodeState.ALIVE);
    }
  });
};
