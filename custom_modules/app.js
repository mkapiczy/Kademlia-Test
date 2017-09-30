const util = require("./util");
const Node = require("./kademlia/node");
const constants = require("./../config/constants");
const BucketManager = require("./kademlia/BucketManager");
const DataManager = require("./data/dataManager");
const communicator = require("./kademlia/communicator");

global.baseNode = new Node(
  constants.BASE_NODE_ID,
  constants.BASE_NODE_IP_ADDR,
  constants.BASE_NODE_PORT
);

global.BucketManager = new BucketManager();
global.DataManager = new DataManager();

exports.init = function(nodeIpAddr, nodePort) {
  if (nodePort !== constants.BASE_NODE_PORT) {
    nodeId = util.createRandomId(constants.B / 8);
    console.log(nodeId + " : " + nodeIpAddr + " : " + nodePort);
    global.node = new Node(nodeId, nodeIpAddr, nodePort);
    global.BucketManager.updateNodeInBuckets(global.baseNode);
    
    communicator.sendFindNode(global.node.id, global.baseNode, function(result) {
      console.log("Find_node done");
    });
  } else {
    nodeId = constants.BASE_NODE_ID;
    console.log(nodeId);
    global.node = new Node(nodeId, nodeIpAddr, nodePort);
  }
};
