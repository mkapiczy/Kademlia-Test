const constants = require("./../config/constants");
const util = require("./util");
const DataPublisher = require("./dataPublisher");

const dataPublisher = new DataPublisher();

function DataManager() {
  this.dataStorage = [];
}

DataManager.prototype.storeValue = function(key, value) {
  hashedKey = util.createHashFromKey(key, constants.B / 8);

  console.log("Name " + key);
  console.log("Value " + value);
  console.log("hashed key: " + hashedKey);

  this.dataStorage.push({
    key: hashedKey,
    value: value
  });

  dataPublisher.publishToKNodesClosestToTheKey(hashedKey, value);
};

module.exports = DataManager;
