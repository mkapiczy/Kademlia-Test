const constants = require("./../config/constants");
const communicator = require("./communicator");

const NodeState = require("./../enum/nodeStateEnum");

function KBucket(index) {
    this.index = index;
    this.nodesList = [];
}

KBucket.prototype.update = function (node) {
    if (this.isNodeInTheBucket(node)) {
        this.updateNode(node);
    } else {
        if (this.isBucketFull()) {
            this.updateStateOfTheOldestNodeInTheBucket();
            if (this.isBucketNotFull()) {
                this.addNode(node);
            }
        } else {
            this.nodesList.push(node);
        }
    }
};

KBucket.prototype.isBucketFull = function () {
    return this.nodesList.length === constants.k;
};

KBucket.prototype.isBucketNotFull = function () {
    return !this.isBucketFull();
};

KBucket.prototype.addNode = function (node) {
    this.nodesList.push(node);
};

KBucket.prototype.removeNode = function (node) {
    let index = this.getNodeIndex(node);
    this.nodesList.splice(index, 1);
};

KBucket.prototype.updateNode = function (node) {
    this.removeNode(node);
    this.addNode(node);
};

KBucket.prototype.isNodeInTheBucket = function (node) {
    return this.getNodeIndex(node) !== -1;
};

KBucket.prototype.getNodeIndex = function (node) {
    console.log("NB lenght: " + this.nodesList.length);
    for (let i = 0; i < this.nodesList.length; i++) {
        if (this.nodesList[i].id === node.id) {
            return i;
        }
    }
    return -1;
};

KBucket.prototype.updateStateOfTheOldestNodeInTheBucket = function () {
    oldestNodeInTheBucket = this.nodesList[0];
    communicator.sendPing(global.node, oldestNodeInTheBucket, result => {
        this.updateNodeAccordingToItsState(oldestNodeInTheBucket, result)
    });
};

KBucket.prototype.updateNodeAccordingToItsState = function (nodeToUpdate, nodeState) {
    if (nodeState === NodeState.NOT_ALIVE) {
        this.removeNode(nodeToUpdate);
    } else if (nodeState === NodeState.ALIVE) {
        this.updateNode(nodeToUpdate);
    }
};

module.exports = KBucket;
