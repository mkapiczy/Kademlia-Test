const crypto = require('crypto');
var sha1 = require('sha1');
//const math = require('mathjs');


function extractFromHex(hexValue) {
	return parseInt(hexValue.substr(1,4), 16)
}

exports.createRandomId = function (nrOfBytes) {
	var randomNumber = crypto.randomBytes(nrOfBytes); // Is this the right way?
	var sha = crypto.createHash('sha1').update(randomNumber).digest('hex');
	var parsedInt = parseInt(sha.substr(0,10), 16); // Maybe not good enough, consider BigInt or similar 
	return parsedInt % Math.pow(2, nrOfBytes*8);
}

exports.calculateIndex = function (nodeId, contactId) {
	return Math.floor(Math.log2(nodeId ^ contactId));
}

