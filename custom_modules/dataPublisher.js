const constants = require("./../config/constants");
const util = require("./util");
const communicator = require("./communicator");
const async = require("async");

var shortlist = [];
var closestNode;
var globalValue;

function DataPublisher() {}

DataPublisher.prototype.publishToKNodesClosestToTheKey = function(hashedKey, value) {
  //Find closest node to key
  globalValue = value;
  var kClosestNodesToTheKey = global.BucketManager.getClosestNodes(hashedKey);

  if (kClosestNodesToTheKey.length === 0) return; // Stop if no nodes!

  var alphaNodes = selectAlphaClosestNodes(kClosestNodesToTheKey);
  closestNode = alphaNodes[0];
  sendAsyncFindNode(alphaNodes, hashedKey);
};

sendAsyncFindNode = function(alphaNodes, hashedKey) {
  asyncCallsArray = [];
  alphaNodes.forEach(node => {
    asyncCallsArray.push(function(callback) {
      communicator.sendGetClosestNodesRequest(hashedKey, node, function(
        result
      ) {
        console.log("Small result" + result);
        callback(null, result);
      });
    });
  });

  console.log("Before async call!");

  async.parallel(asyncCallsArray, function(err, results) {
    var resultArray = [];
    results.forEach(arr => {
      resultArray = resultArray.concat(arr);
    });

    console.log("Error", err);
    console.log("Results length" + resultArray.length);

    console.log("shortlist length before add: " + shortlist.length);

    addIfUniqueToShortlist(alphaNodes, true);
    addIfUniqueToShortlist(resultArray, false);
    console.log("shortlist length after add: " + shortlist.length);

    if (updateClosestNode(hashedKey)) {
      alphaNodes = [];
      shortlist.forEach(node => {
        if (node.isContacted === false && alphaNodes.length < constants.alpha) {
          alphaNodes.push(node);
        }
      });
      console.log("Alpha: " + alphaNodes);
      sendAsyncFindNode(alphaNodes, hashedKey);
    } else {
      //remove ourselves from the shortlist
      console.log("Shortlist size before filter: " + shortlist.length);
      shortlist = shortlist.filter(nd => {
        return nd.id !== global.node.id;
      });
      console.log("Shortlist size after filter: " + shortlist.length);
      shortlist = shortlist.slice(0, constants.k);
      console.log("Shortlist size after slice: " + shortlist.length);

      shortlist.forEach(node => {
        communicator.sendStoreValue(node, hashedKey, globalValue, result => {
          console.log("Send store value result in data manager: " + result);
        });
      });
    }
  });

  console.log("Finished");
};

updateClosestNode = function(hashedKey) {
  shortlist = global.BucketManager.sortNodesListByDistanceAscending(
    hashedKey,
    shortlist
  );
  newClosestNode = shortlist[0];

  if (newClosestNode.id !== closestNode.id) {
    console.log("New closest node!");
    closestNode = newClosestNode;
    return true;
  }

  return false;
};

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
