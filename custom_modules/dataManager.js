const constants = require("./../config/constants");
const util = require("./util");

function DataManager() {
  this.dataStorage = new Map();
}

DataManager.prototype.storeValue = function(key, value) {
  this.dataStorage.set(key, value);
};

DataManager.prototype.storeValueWithKeyHashing = function(key, value) {
  hashedKey = util.createHashFromKey(key, constants.B / 8);
  this.dataStorage.set(hashedKey, value);
};

DataManager.prototype.findValueByNonHashedKey = function(key) {
    hashedKey = util.createHashFromKey(key, constants.B / 8);
    return this.dataStorage.get(Number(hashedKey));
};

DataManager.prototype.findValueByHashedKey = function(hashedKey) {
  return this.dataStorage.get(Number(hashedKey));
};

module.exports = DataManager;
