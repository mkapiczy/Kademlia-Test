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

  console.log("Name " + key);
  console.log("Value " + value);
  console.log("hashed key: " + hashedKey);

  this.dataStorage.set(hashedKey, value);
};

DataManager.prototype.findValue = function(key) {};

module.exports = DataManager;
