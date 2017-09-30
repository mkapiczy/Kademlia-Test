const communicator = require("./communicator");
const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();

function WoTManager() {
    this.wotNodes = [];
}

WoTManager.prototype.addWoTDevice = function (endpoint) {
    this.wotNodes.push(endpoint);
    setInterval(() => {
        setupNodeCommunication(endpoint)
    }, 5000);
    console.log(this.wotNodes);
};

function setupNodeCommunication(endpoint) {
    //Get data from WoT node http://localhost:8000/test/wotData
    communicator.getMeasurement(endpoint, (result) => {
        kademlia.storeValue(endpoint, result, "MEASUREMENT", global.MeasurementManager, () => {
            console.log("Measurement stored and published to k closest nodes!");
        });
    });
}

module.exports = WoTManager;