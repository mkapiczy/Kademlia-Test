const express = require('express') ; 
const request = require('request');
const app = express()  
const dotenv = require('dotenv');
const HttpStatus = require('http-status-codes');
const constants = require('./js/constants');

const util = require('./lib/util');
const KBucket = require('./lib/kbucket');
const Rpc = require('./lib/rpc');

dotenv.load()

var args = process.argv.slice(2);

const port = args[0];
var nodeId;
var buckets = [];

init();

//Html Index
app.get('/', (request, response) => {  
  response.send('Hello from Express!')
})

//PING ENDPOINT
app.get('/api/kademlia/ping', (request, response) => {    
  response.status(HttpStatus.OK)
  response.send("PONG")
})


//FIND_NODE ENDPOINT
app.get('/api/kademlia/find_node/:id', (request, response) => {    
  response.status(HttpStatus.OK)
  response.setHeader('Content-Type', 'application/json')
  console.log(request.params.id);
  //findClosestNodes
  closestNodes = {}
  response.json(JSON.stringify({closestNodes}))

})

//FIND_NODE ENDPOINT
app.get('/test_ping', (request, response) => {    
  sendPingRequest(0)
})

function sendPingRequest(nodeId){
  //find node from buckets basedOn nodeId and based on that get request endpoint
  nodeAddress = 'http://127.0.0.1:3000'
  pingRequestEndpoint = nodeAddress + '/api/kademlia/ping'
  request(pingRequestEndpoint, function(error, response, body){
    if (error) {
      console.log(error)
    } else{
      //addNode to the bucket
      console.log(response.body)
    }
  })
}

function init() {
	if (port != 8000) {
    nodeId = util.createRandomId(constants.B/8);
    createBuckets(nodeId);
    var bucketIndex = util.calculateIndex(nodeId, 0);
    buckets[bucketIndex].update({id: 0, ip: 'http://localhost', port: 8000});

		request('http://localhost:8000/api/kademlia/find_node/' + nodeId, function (error, reponse, body) {
			console.log('Body: ' + body);
		});
	} else {
    nodeId = 0;
    createBuckets();
  }
}

function createBuckets() {
  var rpc = new Rpc(nodeId);
  for(var i = 0; i < constants.B; i++) {
    buckets.push(new KBucket(i, rpc));
  }
}

app.listen(port, (err) => {  
  if (err) {
    return console.log('Error: ', err)
  }

  console.log(`Server is listening on port ${port}`)
})