const constants = require("./../config/constants");
const util = require("./util");
const communicator = require("./communicator");
const async = require("async");

var currentClosestNode;

function DataPublisher() {}

DataPublisher.prototype.publishToKNodesClosestToTheKey = function(hashedKey, value) {
  var shortlist = [];
  var alphaNodes = global.BucketManager.getAlphaClosestNodes(hashedKey);
  currentClosestNode = alphaNodes[0];
  sendAsyncFindNodes(alphaNodes, hashedKey, shortlist, (resultShortlist) =>{
    sendStoreValueToAllNodesInTheShortlist(resultShortlist, hashedKey, value);
  });
};


sendAsyncFindNodes = function(alphaNodes, hashedKey, shortlist, callback) {
  asyncCallsArray = prepareAsyncCalls(alphaNodes, hashedKey);
 
  async.parallel(asyncCallsArray, function(err, results) {
    if(err){
      console.log("An error occured during async call: ", err);
    }
   
    results = mergeAsyncCallsResultsIntoOneArray(results);
    shortlist = updateShortlistAfterAsyncCalls(shortlist, alphaNodes, results);
  
    if (updateClosestNode(shortlist, hashedKey)) {
      nextCallAlphaNodes = getNextCallAlphaNodesFromShortlist(shortlist);
      sendAsyncFindNodes(nextCallAlphaNodes, hashedKey, shortlist, callback);
    } else {
      shortlist = removeGlobalNodeFromShortlist(shortlist);
      shortlist = shortlist.slice(0, constants.k);
      callback(shortlist);
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

updateShortlistAfterAsyncCalls = function(shortlist, alphaNodes, results){
  shortlist = addIfUniqueToShortlist(shortlist, alphaNodes, true);
  shortlist = addIfUniqueToShortlist(shortlist, results, false);
  return shortlist;
}

updateClosestNode = function(shortlist, hashedKey) {
  shortlist = global.BucketManager.sortNodesListByDistanceAscending(hashedKey, shortlist);
  newClosestNode = shortlist[0];

  if (newClosestNode.id !== currentClosestNode.id) {
    console.log("New closest node!");
    currentClosestNode = newClosestNode;
    return true;
  }

  return false;
};

getNextCallAlphaNodesFromShortlist = function(shortlist){
  nextCallAlphaNodes = []
  shortlist.forEach(node => {
    if (node.isContacted === false && nextCallAlphaNodes.length < constants.alpha) {
      nextCallAlphaNodes.push(node);
    }
  });
  return nextCallAlphaNodes;
}

removeGlobalNodeFromShortlist = function(shortlist){
  shortlist = shortlist.filter(nd => {
    return nd.id !== global.node.id;
  });
  return shortlist;
}

sendStoreValueToAllNodesInTheShortlist = function(shortlist, hashedKey, value){
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

addIfUniqueToShortlist = function(shortlist, nodes, isContacted) {
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
  return shortlist;
};

module.exports = DataPublisher;
