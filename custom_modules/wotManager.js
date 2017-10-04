const communicator = require("./communicator");
const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();
const StoredValueType = require("../enum/storedValueType");

function WoTManager() {
    this.wotNodes = [];
}

WoTManager.prototype.addWoTDevice = function (endpoint) {
    let node = getWoTNodeByEndpoint(endpoint, this.wotNodes);
    if (!node) {
        let intervalId = setInterval(() => {
            setupNodeCommunication(endpoint)
        }, 5000);
        this.wotNodes.push({endpoint: endpoint, interval: intervalId});
    }
    console.log(this.wotNodes);
};

WoTManager.prototype.removeWoTDevice = function (endpoint) {
    let deviceToRemove = getWoTNodeByEndpoint(endpoint, this.wotNodes);
    if (deviceToRemove) {
        let index = this.wotNodes.indexOf(deviceToRemove);
        if (index > -1) {
            clearInterval(deviceToRemove.interval);
            this.wotNodes.splice(index, 1);
        }
    }
};

getWoTNodeByEndpoint = function (endpoint, wotNodes) {
    wotNodes.forEach(node => {
        if (node.endpoint === endpoint) {
            return node;
        }
    })
};

function setupNodeCommunication(endpoint) {
    //Get data from WoT node http://localhost:8000/test/wotData
    communicator.getMeasurement(endpoint, (result) => {
        kademlia.storeValue(endpoint, result, StoredValueType.MEASUREMENT, global.MeasurementManager, () => {
            console.log("Measurement stored and published to k closest nodes!");
        });
    });
}

module.exports = WoTManager;