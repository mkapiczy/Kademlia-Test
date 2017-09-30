const communicator = require("./communicator");

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
        global.MeasurementsDataManager.addMeasurement(result);
    });
    //when return

}

module.exports = WoTManager;