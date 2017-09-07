const constants = require("./../config/constants");
const communicator = require("./communicator");

function KBucket(index) {
  this.index = index;
  this.nodesList = [];
}

// Not sure if it should be in bucket or node. For sure I would separate the node pinging and bucket update logic.
KBucket.prototype.update = function(node) {
  var index = this.getNodeIndex(node);
  console.log("Update func index in the bucket: " + index);
  if (index === -1) {
    if (this.nodesList.length === constants.k) {
      oldestNodeInTheBucket = this.nodesList[0];
      communicator.sendPing(oldestNodeInTheBucket, result => {
        // We check if the oldest node in the bucket is still alive if it is not than we remove it otherwise we just don't add a new node to the bucket
        if (result == "DELETE") {
          this.removeNode(oldestNodeInTheBucket);
          this.addNode(node);
        } else if (result == "UPDATE") {
          this.updateNode(oldestNodeInTheBucket);
        }
      });
    } else {
      // if it is not full we should add a new node to the bucket
      this.nodesList.push(node);
    }
  } else {
    this.updateNode(node);
  }
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

KBucket.prototype.getNodeIndex = function(node) {
  console.log("NB lenght: " + this.nodesList.length);
  for (var i = 0; i < this.nodesList.length; i++) {
    if (this.nodesList[i].id === node.id) {
      return i;
    }
  }
  return -1;
};

module.exports = KBucket;
