const constants = require('./../js/constants');

function KBucket(index, rpc) {
	this.index = index;
	this.rpc = rpc;
	this.nodeBucket = [];
}

KBucket.prototype.update = function (node) {
	var index = this.getNodeIndex(node);
	console.log('Update func index: '  + index); 
	if(index === -1) {
		if(this.nodeBucket.length === constants.k) {
			this.rpc.ping(node, (error, response, body) => {
				console.log(body);
			});
			
		}
	} else {
		this.nodeBucket.splice(index, 1);
		this.nodeBucket.push(node);
		console.log('push hsdfksfd: ' + this.nodeBucket.length)
	}
	this.nodeBucket.push(node);
};



KBucket.prototype.getNodeIndex = function (node) {
	console.log('NB lenght: ' + this.nodeBucket);
	for(var i = 0; i < this.nodeBucket.length; i++) {
		if (this.nodeBucket[i].id === node.id) {
			return i;
		}
	} 
	return -1;
}

module.exports = KBucket;
