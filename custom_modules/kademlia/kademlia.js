const DataPublisher = require("../kademlia/dataPublisher");
const dataPublisher = new DataPublisher();

function Kademlia() {
}

Kademlia.prototype.storeValue = function (key, value, callback) {
    global.DataManager.storeValueWithKeyHashing(key, value);
    dataPublisher.publishToKNodesClosestToTheKey(key, value, closestNodes => {
        closestNodes = global.BucketManager.sortNodesListByDistanceAscending(key, closestNodes);
        callback(closestNodes[0]);
    });
};

Kademlia.prototype.findValue = function (key, callback) {
    dataPublisher.findValue(key, (nodeId, value) => {
        if (value) {
            console.log("Value for the key " + key + " found in node " + nodeId);
            console.log("Value: " + value);
            callback(value, nodeId);
        } else {
            console.log("Value for the key " + key + " not found!");
            callback("", "");
        }
    });
};

Kademlia.prototype.getKClosestNodes = function (id, requestNode, callback) {
    global.BucketManager.updateNodeInBuckets(requestNode);
    let closestNodes = global.BucketManager.getClosestNodes(id);
    callback(closestNodes);
};

Kademlia.prototype.handlePing = function (node, callback) {
    global.BucketManager.updateNodeInBuckets(node);
    callback();
};

Kademlia.notifyTheClosestNode = function (key, callback) {

};

module.exports = Kademlia;