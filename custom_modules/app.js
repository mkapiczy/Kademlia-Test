const util = require("./util");
const KBucket = require("./kbucket");
const Node = require("./node");
const constants = require("./../config/constants")

var buckets = [];

global.baseNode = new Node(
  constants.BASE_NODE_ID,
  constants.BASE_NODE_IP_ADDR,
  constants.BASE_NODE_PORT
);

exports.init = function(nodeIpAddr, nodePort) {
  createBuckets();

  if (nodePort != constants.BASE_NODE_PORT) {
    nodeId = util.createRandomId(constants.B / 8);
    global.node = new Node(nodeId, nodeIpAddr, nodePort);
   
    var bucketIndex = util.calculateBucketIndexForANode(
      nodeId,
      constants.BASE_NODE_ID
    );

    // buckets[bucketIndex].update({
    //   id: constants.BASE_NODE_ID,
    //   ip: "http://localhost",
    //   port: 8000
    // });

    // request("http://localhost:8000/api/kademlia/find_node/" + nodeId, function(
    //   error,
    //   reponse,
    //   body
    // ) {
    //   console.log("Body: " + body);
    // });
  } else {
    nodeId = constants.BASE_NODE_ID; 
    global.node = new Node(nodeId, nodeIpAddr, nodePort);
  }
};

function createBuckets() {
  for (var i = 0; i < constants.B; i++) {
    buckets.push(new KBucket(i));
  }
}
