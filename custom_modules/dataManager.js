const constants = require("./../config/constants");
const util = require("./util");
const communicator = require("./communicator");
const async = require("async");

function DataManager() {
  this.dataStorage = [];
  this.dataOriginatedFromNode = []; //The originator is responsible of republishing data
}

DataManager.prototype.storeValue = function(key, value) {
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
iterativeFindNode = function(hashedKey) {
  //Find closest node to key
  var kClosestNodesToTheKey = global.BucketManager.getClosestNodes(hashedKey);

  if (kClosestNodesToTheKey.length === 0) return; // Stop if no nodes!

  var shortlist = selectAlphaClosestNodes(kClosestNodesToTheKey);
  console.log(shortlist);

  var closestNode = shortlist[0];

  sendAsyncFindNode(shortlist, hashedKey);
};

sendAsyncFindNode = function(nodes, hashedKey) {
  //   asyncCallsArray = [];
  //   nodes.forEach(node => {
  //     asyncCallsArray.push(function(callback) {
  //       communicator.sendFindNode(hashedKey, node, function(result) {
  //         console.log("Small result" + result);
  //         callback(null, result)
  //       });
  //     });
  //   });

  console.log("Before async call!");

  async.series(
    [
      function(callback) {
        communicator.sendFindNode(hashedKey, nodes[0], function(result) {
          console.log("Small result" + result);
          callback(null, result);
        });
      }
    ],
    function(err, results) {
      console.log("Error", err);
      console.log("Results" + results);
      work = false;
    }
  );

  console.log("Finished");
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

module.exports = DataManager;
