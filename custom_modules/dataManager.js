const constants = require("./../config/constants");
const util = require("./util");
const communicator = require("./communicator");

function DataManager() {
    this.dataStorage = [];
    this.dataOriginatedFromNode = []; //The originator is responsible of republishing data
}

DataManager.prototype.storeValue = function (key, value) {
    //READ SECTION 4.5 in Kademlia spec: How to find nodes closest to key!
    hashedKey = util.createHashFromKey(key, constants.B / 8);
    this.dataOriginatedFromNode.push({
        key: hashedKey,
        value: value
    });

    //Find closest node to key
    var closestNodes = global.BucketManager.getClosestNodes(hashedKey);

    if (getClosestNodes.length === 0) return; // Stop if no nodes!

    var shortlist = selectAlphaClosestNodes(closestNodes);
    var closestNode = selectClosestNode(shortlist, hashedKey);

    sendAsyncFindNode(shortlist, hashedKey);


    console.log('Name ' + key);
    console.log('Value ' + value);
    console.log('hashed key: ' + hashedKey);
};

sendAsyncFindNode = function (nodes, hashedKey) {
    for(var i = 0; i < nodes.length; i++) {
        //communicator.sendFindNode()
    }
};

selectAlphaClosestNodes = function (closestNodes) {
    var alphaClosestNodes = [];
    var maxIterator = (closestNodes > constants.ALPHA ? constants.ALPHA : closest.length)

    for (var i = 0; i < maxIterator; i++) {
        alphaClosestNodes.push({node: closestNodes[i], isContacted: false});
    }

    return alphaClosestNodes;
};

selectClosestNode = function (nodes, hashedKey) {
    var closestNode = nodes[0];
    for(var i = 1; i < nodes.length; i++) {
        if((nodes[i] ^ hashedKey) < (closestNode ^ hashedKey)) {
            closestNode = nodes[i];
        }
    }
    return closestNode;
};



module.exports = DataManager;