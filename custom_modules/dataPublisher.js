const constants = require("./../config/constants");
const util = require("./util");
const communicator = require("./communicator");
const async = require("async");

var currentClosestNode;
var shortlist = [];

function DataPublisher() {}

DataPublisher.prototype.publishToKNodesClosestToTheKey = function(hashedKey, value) {
  var alphaNodes = global.BucketManager.getAlphaClosestNodes(hashedKey);
  currentClosestNode = alphaNodes[0];
  sendAsyncFindNode(alphaNodes, value, hashedKey);
};

sendAsyncFindNode = function(alphaNodes, value, hashedKey) {
  asyncCallsArray = prepareAsyncCalls(alphaNodes, hashedKey);
 
  async.parallel(asyncCallsArray, function(err, results) {
    if(err){
      console.log("An error occured during async call: ", err);
    }
    console.log("Results length: " + results.length)
    results = mergeAsyncCallsResultsIntoOneArray(results);
    console.log("Results length: " + results.length)

    updateShortlistAfterAsyncCalls(alphaNodes, results);
  
    if (updateClosestNode(hashedKey)) {
      nextCallAlphaNodes = getNextCallAlphaNodesFromShortlist();
      sendAsyncFindNode(nextCallAlphaNodes, hashedKey);
    } else {
      shortlist = removeGlobalNodeFromShortlist();
      shortlist = shortlist.slice(0, constants.k);
      console.log("Shrotlist length before sending store value: " + shortlist.length)
      sendStoreValueToAllNodesInTheShortlist(hashedKey, value);
    }
  });
};

prepareAsyncCalls = function(alphaNodes, hashedKey){
  asyncCallsArray = [];
  alphaNodes.forEach(node => {
    asyncCallsArray.push(function(callback) {
      communicator.sendGetClosestNodesRequest(hashedKey, node, function(result){
        callback(null, result);
      });
    });
  });
  return asyncCallsArray;
}

mergeAsyncCallsResultsIntoOneArray = function(unMergedResults){
  var mergedResults = [];
  unMergedResults.forEach(result => {
    mergedResults = mergedResults.concat(result);
  });
  return mergedResults;
}

updateShortlistAfterAsyncCalls = function(alphaNodes, results){
  addIfUniqueToShortlist(alphaNodes, true);
  addIfUniqueToShortlist(results, false);
}

updateClosestNode = function(hashedKey) {
  shortlist = global.BucketManager.sortNodesListByDistanceAscending(hashedKey, shortlist);
  newClosestNode = shortlist[0];

  if (newClosestNode.id !== currentClosestNode.id) {
    console.log("New closest node!");
    currentClosestNode = newClosestNode;
    return true;
  }

  return false;
};

getNextCallAlphaNodesFromShortlist = function(){
  nextCallAlphaNodes = []
  shortlist.forEach(node => {
    if (node.isContacted === false && nextCallAlphaNodes.length < constants.alpha) {
      nextCallAlphaNodes.push(node);
    }
  });
  return nextCallAlphaNodes;
}

removeGlobalNodeFromShortlist = function(){
  shortlist = shortlist.filter(nd => {
    return nd.id !== global.node.id;
  });
  return shortlist;
}

sendStoreValueToAllNodesInTheShortlist = function(hashedKey, value){
  shortlist.forEach(node => {
    communicator.sendStoreValue(node, hashedKey, value, result => {
      console.log("Send store value result in data manager: " + result);
    });
  });
}

selectAlphaClosestNodes = function(closestNodes, hashedKey) {
  closestNodes = global.BucketManager.sortNodesListByDistanceAscending(
    hashedKey,
    closestNodes
  );
  return closestNodes.slice(0, constants.alpha);
};

selectClosestNode = function(nodes, hashedKey) {
  var closestNode = nodes[0];
  for (var i = 1; i < nodes.length; i++) {
    if ((nodes[i] ^ hashedKey) < (closestNode ^ hashedKey)) {
      closestNode = nodes[i];
    }
  }
  return closestNode;
};

removeNodeDuplicates = function(keyFn, array) {
  var mySet = new Set();
  return array.filter(function(x) {
    var key = keyFn(x),
      isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
};

addIfUniqueToShortlist = function(nodes, isContacted) {
  nodes.forEach(node => {
    var isInShortList = false;

    shortlist.forEach(item => {
      if (item.id === node.id) {
        isInShortList = true;
      }
    });

    if (!isInShortList) {
      node["isContacted"] = isContacted;
      shortlist.push(node);
    }
  });
};

module.exports = DataPublisher;
