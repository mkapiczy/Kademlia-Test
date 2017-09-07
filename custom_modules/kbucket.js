const constants = require('./../config/constants');

function KBucket(index) {
	this.index = index;
	this.nodesList = [];
}

// Not sure if it should be in bucket or node. For sure I would separate the node pinging and bucket update logic.
KBucket.prototype.update = function (node) {
	var index = this.getNodeIndex(node);
	console.log('Update func index: '  + index); 
	if(index === -1) {
		if(this.nodesList.length === constants.k) {
			// what to pass in ping function
			this.node.ping(node, (error, response, body) => {
				console.log(body);
			});
			
		}
	} else {
		this.nodesList.splice(index, 1);
		this.nodesList.push(node);
		console.log('push hsdfksfd: ' + this.nodesList.length)
	}
	this.nodesList.push(node);
};

KBucket.prototype.getNodeIndex = function (node) {
	console.log('NB lenght: ' + this.nodesList);
	for(var i = 0; i < this.nodesList.length; i++) {
		if (this.nodesList[i].id === node.id) {
			return i;
		}
	} 
	return -1;
}

module.exports = KBucket;
