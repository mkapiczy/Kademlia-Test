const express = require("express");
const request = require("request");
const dotenv = require("dotenv");
const HttpStatus = require("http-status-codes");
const constants = require("./config/constants");

const util = require("./custom_modules/util");
const KBucket = require("./custom_modules/kbucket");

var swaggerTools = require("swagger-tools");
var YAML = require("yamljs");

const app = express();
var swaggerDoc = YAML.load("openapi.yaml");

swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
});

dotenv.load();

var args = process.argv.slice(2);
const port = args[0]; // is this for sure args[0]??
var buckets = [];

init();

//Html Index
app.get("/", (request, response) => {
  response.send("Hello from Express!");
});

//PING ENDPOINT
app.get("/api/kademlia/ping", (request, response) => {
  response.status(HttpStatus.OK);
  response.send("PONG");
});

//FIND_NODE ENDPOINT
app.get("/api/kademlia/find_node/:id", (request, response) => {
  response.status(HttpStatus.OK);
  response.setHeader("Content-Type", "application/json");
  console.log(request.params.id);
  //findClosestNodes
  closestNodes = {};
  response.json(JSON.stringify({ closestNodes }));
});

//FIND_NODE ENDPOINT
app.get("/test_ping", (request, response) => {
  sendPingRequest(0);
});

function sendPingRequest(nodeId) {
  //find node from buckets basedOn nodeId and based on that get request endpoint
  nodeAddress = "http://127.0.0.1:3000";
  pingRequestEndpoint = nodeAddress + "/api/kademlia/ping";
  request(pingRequestEndpoint, function(error, response, body) {
    if (error) {
      console.log(error);
    } else {
      //addNode to the bucket
      console.log(response.body);
    }
  });
}

function init() {
  if (port != 8000) {
    // 8000 is a base node
    nodeId = util.createRandomId(constants.B / 8);
    createBuckets();
    
    var bucketIndex = util.calculateBucketIndexForANode(
      nodeId,
      constants.BASE_NODE_ID
    );

    buckets[bucketIndex].update({
      id: constants.BASE_NODE_ID,
      ip: "http://localhost",
      port: 8000
    });

    request("http://localhost:8000/api/kademlia/find_node/" + nodeId, function(
      error,
      reponse,
      body
    ) {
      console.log("Body: " + body);
    });
  } else {
    nodeId = constants.BASE_NODE_ID; // What we should do with this id
    createBuckets();
  }
}

function createBuckets() {
  for (var i = 0; i < constants.B; i++) {
    buckets.push(new KBucket(i));
  }
}

app.listen(port, err => {
  if (err) {
    return console.log("Error: ", err);
  }

  console.log(`Server is listening on port ${port}`);
});
