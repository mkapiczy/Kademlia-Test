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

DataManager.prototype.findValue = function(key) {
  return this.dataStorage.get(Number(key));
};

module.exports = DataManager;
