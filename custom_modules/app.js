const util = require("./util");
const KBucket = require("./kbucket");
const Node = require("./node");
const constants = require("./../config/constants");
const BucketManager = require("./BucketManager");

global.baseNode = new Node(
  constants.BASE_NODE_ID,
  constants.BASE_NODE_IP_ADDR,
  constants.BASE_NODE_PORT
);

global.BucketManager = new BucketManager;

exports.init = function(nodeIpAddr, nodePort) {
  if (nodePort != constants.BASE_NODE_PORT) {
    nodeId = util.createRandomId(constants.B / 8);
    global.node = new Node(nodeId, nodeIpAddr, nodePort);
    global.BucketManager.updateNodeInBuckets(global.baseNode)
    // find node call?
  } else {
    nodeId = constants.BASE_NODE_ID;
    global.node = new Node(nodeId, nodeIpAddr, nodePort);
  }
};
