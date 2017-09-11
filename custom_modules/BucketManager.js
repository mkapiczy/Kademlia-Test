const constants = require("./../config/constants");
const KBucket = require("./kbucket");

function BucketManager() {
  this.buckets = [];
  this.createBuckets();
}

BucketManager.prototype.updateNodeInBuckets = function(nodeToUpdate) {

  if (nodeToUpdate.isValid() && nodeToUpdate.id !== global.node.id) {
    var bucketIndex = this.calculateBucketIndexForANode(nodeToUpdate.id);
    this.buckets[bucketIndex].update(nodeToUpdate);
  }
};

BucketManager.prototype.calculateBucketIndexForANode = function(nodeId) {
  return Math.floor(
    Math.log2(this.distanceBetweenTwoNodes(nodeId, global.node.id))
  );
};

BucketManager.prototype.distanceBetweenTwoNodes = function(node1Id, node2Id) {
  return node1Id ^ node2Id;
};

BucketManager.prototype.createBuckets = function() {
  for (var i = 0; i < constants.B; i++) {
    this.buckets.push(new KBucket(i));
  }
};

// method returns the requesting node as well we need to filter that
BucketManager.prototype.getClosestNodes = function(nodeId) {
  var closestNodes = [];
  var bucketIndex = this.calculateBucketIndexForANode(nodeId);
  
  this.buckets[bucketIndex].nodesList.forEach((node) => {
    closestNodes.push(node);
  });

  if (closestNodes.length !== constants.k) {
    var allBucketsChecked = false;
    var bucketIndexInc = bucketIndex;
    var bucketIndexDec = bucketIndex;

    while (closestNodes.length < constants.k && !allBucketsChecked) {
      var candidateNodes = [];
      bucketIndexInc = (bucketIndexInc + 1) % (constants.B - 1);
      bucketIndexDec--;

      
      if (bucketIndexDec < 0) {
        bucketIndexDec = constants.B - 1;
      }

      if (bucketIndexInc === bucketIndexDec) {
        allBucketsChecked = true;
      } else {
        this.buckets[bucketIndexInc].nodesList.forEach((node) => {
          candidateNodes.push(node);
        });
      }

      this.buckets[bucketIndexDec].nodesList.forEach((node) => {
        candidateNodes.push(node);
      });

      var sortList = this.findClosestNodesFromList(
        candidateNodes,
        nodeId,
        constants.k - closestNodes.length
      );

      sortList.forEach((node) => {
        closestNodes.push(node);
      });
    }
  }

  return closestNodes;
};

BucketManager.prototype.findClosestNodesFromList = function(
  candidateNodes,
  nodeId,
  numberOfNodesNeeded
) {
  var closestNodes = [];

  console.log("Number of nodes needed " + numberOfNodesNeeded);

  //TODO: sort array after which id is closest!
  //candidateNodes.sort(function(a, b){
  //  return Math.abs(nodeId - BucketManager.prototype.distanceBetweenTwoNodes(a, nodeId) - Math.abs(nodeId - BucketManager.prototype.distanceBetweenTwoNodes(b, nodeId)));
  //});

  //console.log("Before: " + candidateNodes);
  //printList(candidateNodes)
  //sortList(nodeId, candidateNodes);
  //console.log("after: " + candidateNodes);
  //printList(candidateNodes)

  
  candidateNodes.forEach((node) => {
    closestNodes.push(node);
  });
  
  if (numberOfNodesNeeded < candidateNodes.length) {
    closestNodes = candidateNodes.slice(0, numberOfNodesNeeded);
  } else {
    closestNodes = candidateNodes;
  }

  return closestNodes;
};

function printList (list) {
  for (var i = 0; i < list.length; i++) {
    console.log(list[i])
  }
}

function sortList(id, list) {
	list.sort(function(a, b){
    return Math.abs(id - BucketManager.prototype.distanceBetweenTwoNodes(a, id) - Math.abs(id - BucketManager.prototype.distanceBetweenTwoNodes(b, id)));
  });
}

module.exports = BucketManager;
