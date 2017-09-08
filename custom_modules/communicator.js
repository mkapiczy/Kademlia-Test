const request = require("request");
const HttpStatus = require("http-status-codes");
const util = require("./util");

const NodeState = require("./../enum/nodeStateEnum")

exports.sendPing = function(senderNode, nodeToPing, callBack) {
  console.log("Buckets before sending ping: ", global.BucketManager.buckets);
  var requestRpcId = util.createRandomAlphaNumericIdentifier(20);

  var requestOptions = {
    method: "GET",
    uri: nodeToPing.ipAddr + ":" + nodeToPing.port + "/api/kademlia/ping",
    body: {
      nodeId: senderNode.id,
      nodeIP: senderNode.ipAddr,
      port: senderNode.port,
      rpcId: requestRpcId
    },
    json: true
  };
  
  request(requestOptions, function(error, response) {
    if (error) {
      console.log(error);
      callBack(NodeState.NOT_ALIVE);
    } else {
      console.log(response.body);
      responseRpcId = response.body.rpcId
      if(responseRpcId == rpcId)
      global.BucketManager.updateNodeInBuckets(nodeToPing)
      callBack(NodeState.ALIVE);
    }
  });
  console.log("Buckets after ping", global.BucketManager.buckets);
};
