const crypto = require("crypto");
const bigInt = require("big-integer");
var sha1 = require("sha1");

// What does it do?
function extractFromHex(hexValue) {
  return parseInt(hexValue.substr(1, 4), 16);
}

// Create random Big Integer
exports.createRandomId = function(nrOfBytes) {
  var randomNumber = crypto.randomBytes(nrOfBytes); // Is this the right way?
  var sha = crypto
    .createHash("sha1")
    .update(randomNumber)
    .digest("hex");
  var parsedInt = parseInt(sha.substr(0,10), 16);
  return parsedInt % Math.pow(2, nrOfBytes * 8);
};

exports.createRandomAlphaNumericIdentifier = function(nrOfBytes) {
  var randomNumber = crypto.randomBytes(nrOfBytes); // Is this the right way?
  return crypto
    .createHash("sha1")
    .update(randomNumber)
    .digest("hex");
};

// Return the ondex of a bucket in which a node should be placed
exports.calculateBucketIndexForANode = function(node1Id, node2Id) {
  return Math.floor(Math.log2(distanceBetweenTwoNodes(node1Id, node2Id)));
};

distanceBetweenTwoNodes = function(node1Id, node2Id) {
  return node1Id ^ node2Id;
};
