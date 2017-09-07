const constants = require("./../config/constants");
const communicator = require("./communicator");

const NodeState = require("./../enum/nodeStateEnum");

function KBucket(index) {
  this.index = index;
  this.nodesList = [];
}

KBucket.prototype.update = function(node) {
  if (this.isNodeInTheBucket(node)) {
    this.updateNode(node);
  } else {
    if (this.isBucketFull()) {
      this.updateStateOfTheOldestNodeInTheBucket();
      if (isBucketNotFull) {
        this.addNode(node);
      }
    } else {
      this.nodesList.push(node);
    }
  }
};

KBucket.prototype.isBucketFull = function() {
  if (this.nodesList.length === constants.k) {
    return true;
  }
  return false;
};

KBucket.prototype.isBucketNotFull = function() {
  return !isBucketFull();
};

KBucket.prototype.addNode = function(node) {
  this.nodesList.push(node);
};

KBucket.prototype.removeNode = function(node) {
  var index = this.getNodeIndex(node);
  this.nodesList.splice(index, 1);
};

KBucket.prototype.updateNode = function(node) {
  this.removeNode(node);
  this.addNode(node);
};

KBucket.prototype.isNodeInTheBucket = function(node) {
  if (this.getNodeIndex(node) != -1) {
    return true;
  }
  return false;
};

KBucket.prototype.getNodeIndex = function(node) {
  console.log("NB lenght: " + this.nodesList.length);
  for (var i = 0; i < this.nodesList.length; i++) {
    if (this.nodesList[i].id === node.id) {
      return i;
    }
  }
  return -1;
};

KBucket.prototype.updateStateOfTheOldestNodeInTheBucket = function() {
  oldestNodeInTheBucket = this.nodesList[0];
  communicator.sendPing(global.node, oldestNodeInTheBucket, result => {
    this.updateNodeAccordingToItsState(oldestNodeInTheBucket, result)
    });
};

KBucket.prototype.updateNodeAccordingToItsState = function(nodeToUpdate, nodeState) {
  if (result == NodeState.NOT_ALIVE) {
    this.removeNode(nodeToUpdate);
  } else if (result == NodeState.ALIVE) {
    this.updateNode(nodeToUpdate);
  }
};

module.exports = KBucket;
