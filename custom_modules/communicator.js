const request = require("request");
const HttpStatus = require("http-status-codes");
const util = require("./util");

const NodeState = require("./../enum/nodeStateEnum");
const Node = require("./node")

exports.sendPing = function(senderNode, nodeToPing, callBack) {
  var requestRpcId = util.createRandomAlphaNumericIdentifier(20);

  var requestOptions = {
    method: "GET",
    uri: nodeToPing.ipAddr + ":" + nodeToPing.port + "/api/kademlia/ping",
    body: {
      nodeId: senderNode.id,
      nodeIP: senderNode.ipAddr,
      nodePort: senderNode.port,
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
      responseRpcId = response.body.rpcId;
      if (responseRpcId == requestRpcId) {
        global.BucketManager.updateNodeInBuckets(nodeToPing);
        callBack(NodeState.ALIVE);
      }
    }
  });
};

exports.sendFindNode = function(senderNode, recipientNode, callBack) {
  console.log("Buckets before find node", global.BucketManager.buckets);
  var requestRpcId = util.createRandomAlphaNumericIdentifier(20);

  var requestOptions = {
    method: "GET",
    uri:
      recipientNode.ipAddr +
      ":" +
      recipientNode.port +
      "/api/kademlia/find_node",
    body: {
      nodeId: senderNode.id,
      nodeIP: senderNode.ipAddr,
      nodePort: senderNode.port,
      rpcId: requestRpcId
    },
    json: true
  };

  request(requestOptions, function(error, response) {
    if (error) {
      console.log(error);
      callBack(NodeState.NOT_ALIVE);
    } else {
      console.log("Received closest nodes:", response.body.closestNodes);
      if (response.body.rpcId == requestRpcId) {
        global.BucketManager.updateNodeInBuckets(recipientNode);
        closestNodes = response.body.closestNodes;

        closestNodes.forEach(function(node) {
          nodeToUpdate = new Node(node.id, node.ipAddr, node.port)
          global.BucketManager.updateNodeInBuckets(nodeToUpdate);
        }, this); 
        console.log("Buckets after find node", global.BucketManager.buckets);
        callBack(NodeState.ALIVE);
      }
    }
  });
 
};
