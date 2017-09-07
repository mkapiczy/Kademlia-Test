const constants = require("./../config/constants")
const KBucket = require("./kbucket")

function BucketManager() {
  this.buckets = [];
  this.createBuckets();
}

BucketManager.prototype.updateNodeInBuckets = function(nodeToUpdate) {
  var bucketIndex = this.calculateBucketIndexForANode(nodeToUpdate.id);
  this.buckets[bucketIndex].update(nodeToUpdate);
};

BucketManager.prototype.calculateBucketIndexForANode = function(nodeId) {
  return Math.floor(Math.log2(this.distanceBetweenTwoNodes(nodeId, global.node.id)));
};

BucketManager.prototype.distanceBetweenTwoNodes = function(node1Id, node2Id) {
  return node1Id ^ node2Id;
};

BucketManager.prototype.createBuckets = function() {
  for (var i = 0; i < constants.B; i++) {
    this.buckets.push(new KBucket(i));
  }
};

module.exports = BucketManager;
