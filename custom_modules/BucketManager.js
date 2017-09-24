const constants = require("./../config/constants");
const KBucket = require("./kbucket");

function BucketManager() {
  this.buckets = [];
  this.createBuckets();
}

BucketManager.prototype.printBuckets = function(){
  this.buckets.forEach(bucket =>{
    console.log(bucket);
  })
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

BucketManager.prototype.getClosestNodes = function(nodeId) {
  var nodesNeighbours = this.getNodesNeighboursFromTheSameBucket(nodeId);

  var bucketIndex = this.calculateBucketIndexForANode(nodeId);
  var bucketIndexInc = bucketIndex;
  var bucketIndexDec = bucketIndex;

  while (nodesNeighbours.length < constants.k && thereAreStillBucketsToCheck(bucketIndexInc, bucketIndexDec)) {
    if (bucketIndexDec > 0) {
      bucketIndexDec--;
      nodesNeighbours = nodesNeighbours.concat(this.buckets[bucketIndexDec].nodesList);
    }

    if (bucketIndexInc < constants.B - 1) {
      bucketIndexInc++;
      nodesNeighbours = nodesNeighbours.concat(this.buckets[bucketIndexInc].nodesList);
    }
  }
  return this.getkClosestNodesFromNeighboursList(nodesNeighbours, nodeId);
};

BucketManager.prototype.getAlphaClosestNodes = function(key) {
  var kClosestNodesToTheKey = this.getClosestNodes(key);
  
  if (kClosestNodesToTheKey.length === 0) {
    console.log("No close nodes found for the key: "+ key);
    return []; 
  }

  kClosestNodesToTheKey = this.sortNodesListByDistanceAscending(key, kClosestNodesToTheKey);

  return kClosestNodesToTheKey.slice(0, constants.alpha);
};

BucketManager.prototype.getNodesNeighboursFromTheSameBucket = function(nodeId) {
  nodesFromTheNodeBucket = [];
  console.log("NodeId: " + nodeId)
  var bucketIndex = this.calculateBucketIndexForANode(nodeId);
  console.log("BucketINdex: " + bucketIndex)
  this.buckets[bucketIndex].nodesList.forEach(node => {
    if (node.id !== nodeId) {
      nodesFromTheNodeBucket.push(node);
    }
  });

  return nodesFromTheNodeBucket;
};

thereAreStillBucketsToCheck = function (bucketIndexInc, bucketIndexDec){
  if(bucketIndexDec > 0 || bucketIndexInc < constants.B-1){
    return true;
  }
  return false;
}

BucketManager.prototype.getkClosestNodesFromNeighboursList = function(nodesNeighbours, nodeId) {
  nodesNeighbours = this.sortNodesListByDistanceAscending(nodeId, nodesNeighbours);
  return nodesNeighbours.slice(0, constants.k);
};

BucketManager.prototype.sortNodesListByDistanceAscending=function(id, list) {
  list.sort(function(a, b) {
    return BucketManager.prototype.distanceBetweenTwoNodes(a.id, id) - BucketManager.prototype.distanceBetweenTwoNodes(b.id, id);
  });
  return list;
}

module.exports = BucketManager;
