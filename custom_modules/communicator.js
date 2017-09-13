const request = require("request");
const HttpStatus = require("http-status-codes");
const util = require("./util");

const NodeState = require("./../enum/nodeStateEnum");
const Node = require("./node")

exports.sendPing = function(senderNode, nodeToPing, callBack) {
  var requestRpcId = util.createRandomAlphaNumericIdentifier(20);

  var requestOptions = {
    method: "GET",
    uri: nodeToPing.ipAddr + ":" + nodeToPing.port + "/api/kademlia/info/ping",
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
        console.log("Now I ping: " + nodeToPing.port);
        var nodeToUpdate = new Node(nodeToPing.id, nodeToPing.ipAddr, nodeToPing.port);
        global.BucketManager.updateNodeInBuckets(nodeToUpdate);
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
      "/api/kademlia/nodes/" + senderNode.id,
    body: {
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
          if(node.id !== global.node.id) {
            exports.sendPing(global.node, node, function (result) {
              //Adding is handled in ping function
            });
          }
        
        }, this); 
        console.log("Buckets after find node", global.BucketManager.buckets);
        callBack(NodeState.ALIVE);
      }
    }
  });
 
};
