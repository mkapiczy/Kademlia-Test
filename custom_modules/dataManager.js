const constants = require("./../config/constants");
const util = require("./util");
const communicator = require("./communicator");
const async = require("async");

var shortlist = [];

function DataManager() {
  this.dataStorage = [];
  this.dataOriginatedFromNode = []; //The originator is responsible of republishing data
}

DataManager.prototype.storeValue = function (key, value) {
  //READ SECTION 4.5 in Kademlia spec: How to find nodes closest to key!
  hashedKey = util.createHashFromKey(key, constants.B / 8);

  console.log("Name " + key);
  console.log("Value " + value);
  console.log("hashed key: " + hashedKey);

  this.dataOriginatedFromNode.push({
    key: hashedKey,
    value: value
  });

  iterativeFindNode(hashedKey);
};

//Section 4.5.3
iterativeFindNode = function (hashedKey) {
  //Find closest node to key
  var kClosestNodesToTheKey = global.BucketManager.getClosestNodes(hashedKey);

  if (kClosestNodesToTheKey.length === 0) return; // Stop if no nodes!

  var alphaNodes = selectAlphaClosestNodes(kClosestNodesToTheKey);
  console.log(alphaNodes);

  var closestNode = alphaNodes[0];

  sendAsyncFindNode(alphaNodes, hashedKey);
};

sendAsyncFindNode = function (alphaNodes, hashedKey) {
  asyncCallsArray = [];
  alphaNodes.forEach(node => {
    asyncCallsArray.push(function (callback) {
      communicator.sendGetClosestNodesRequest(hashedKey, node, function (result) {
        console.log("Small result" + result);
        callback(null, result)
      });
    });
  });

  console.log("Before async call!");

  async.parallel(
    asyncCallsArray,
    function (err, results) {
      var resultArray = [];
      results.forEach((arr) => {
        resultArray = resultArray.concat(arr);
      });

      console.log("Error", err);
      console.log("Results length" + resultArray.length);

      console.log("shortlist length before add: " + shortlist.length);

      addIfUniqueToShortlist(alphaNodes, true);
      addIfUniqueToShortlist(resultArray, false);

      console.log("shortlist length after add: " + shortlist.length);
    }
  );

  console.log("Finished");
};

selectAlphaClosestNodes = function (closestNodes, hashedKey) {
  closestNodes = global.BucketManager.sortNodesListByDistanceAscending(
    hashedKey,
    closestNodes
  );
  return closestNodes.slice(0, constants.alpha);
};

selectClosestNode = function (nodes, hashedKey) {
  var closestNode = nodes[0];
  for (var i = 1; i < nodes.length; i++) {
    if ((nodes[i] ^ hashedKey) < (closestNode ^ hashedKey)) {
      closestNode = nodes[i];
    }
  }
  return closestNode;
};

removeNodeDuplicates = function (keyFn, array) {
  var mySet = new Set();
  return array.filter(function (x) {
    var key = keyFn(x),
      isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
}

addIfUniqueToShortlist = function (nodes, isContacted) {
  nodes.forEach((node) => {
    var isInShortList = false;

    shortlist.forEach(item => {
      if (item.id === node.id) {
        isInShortList = true;
      }
    });

    if (!isInShortList) {
      node['isContacted'] = isContacted;
      shortlist.push(node);
    }
  });
};



module.exports = DataManager;