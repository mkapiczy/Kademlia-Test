
function WoTManager() {
    this.wotNodes = [];
}

WoTManager.prototype.addWoTDevice = function (endpoint) {
    this.wotNodes.push(endpoint);

    console.log(this.wotNodes);
};



module.exports = WoTManager;