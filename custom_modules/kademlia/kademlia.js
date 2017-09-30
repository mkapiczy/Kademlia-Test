const DataPublisher = require("../kademlia/dataPublisher");
const dataPublisher = new DataPublisher();

function Kademlia() {
}

Kademlia.prototype.storeValue = function (key, value) {
    global.DataManager.storeValueWithKeyHashing(key, value);
    dataPublisher.publishToKNodesClosestToTheKey(key, value);
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

module.exports = Kademlia;