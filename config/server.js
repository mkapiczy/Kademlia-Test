const express = require("express");
const HttpStatus = require("http-status-codes");
const bodyParser = require("body-parser");
const pug = require("pug");
const path = require("path");
var swaggerTools = require("swagger-tools");
var YAML = require("yamljs");

const communicator = require("./../custom_modules/communicator");
const Node = require("./../custom_modules/node");
const util = require("./../custom_modules/util");

const app = express();

const apiPath = "/api/kademlia/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./../views/"));

var args = process.argv.slice(2);
const port = args[0];

app.get(apiPath + "node", (request, response) => {
  
    if (request.accepts('html')) {
      response.render('index', {title: 'Hey!', message: 'This works :-)', node: global.node, buckets: global.BucketManager.buckets})
      return;
    }
  
    if (request.accepts('json')) {
      response.json({ buckets: global.BucketManager.buckets });
      return;
    }

});

//PING ENDPOINT
app.get(apiPath + "info/ping", (request, response) => {
  console.log("Ping message from node ", request.body.nodeId);
  console.log("Buckets", global.BucketManager.buckets);
  requestNode = new Node(
    request.body.nodeId,
    request.body.nodeIP,
    request.body.nodePort
  );

  global.BucketManager.updateNodeInBuckets(requestNode);

  response.status(HttpStatus.OK);
  response.json({
    nodeId: global.node.id,
    rpcId: request.body.rpcId,
    msg: "PONG"
  });
  console.log("Buckets", global.BucketManager.buckets);
});

//FIND NODE ENDPOINT
app.get(apiPath + "nodes/:id", (request, response) => {
  console.log("Find node message from node ", request.body.nodeId);
  console.log("Buckets", global.BucketManager.buckets);
  requestNode = new Node(
    request.params.id,
    request.body.nodeIP,
    request.body.nodePort
  );

  global.BucketManager.updateNodeInBuckets(requestNode);
  closestNodes = global.BucketManager.getClosestNodes(requestNode.id);
  response.status(HttpStatus.OK);
  response.setHeader("Content-Type", "application/json");
  response.json({
    nodeId: global.node.id,
    rpcId: request.body.rpcId,
    closestNodes: closestNodes
  });
});

//Endpoint for testing ping operation
app.get("/test/ping", (request, response) => {
  communicator.sendPing(global.node, global.baseNode, function(result) {
    response.status(HttpStatus.OK);
    response.setHeader("Content-Type", "application/json");
    response.json(JSON.stringify(result));
  });
});

//Endpoint for testing ping operation
app.get("/test/find_node", (request, response) => {
  communicator.sendFindNode(global.node, global.baseNode, function(result) {
    console.log(result);
    response.status(HttpStatus.OK);
    response.setHeader("Content-Type", "application/json");
    response.json(JSON.stringify(result));
  });
});

var swaggerDoc = YAML.load("openapi.yaml");
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
  app.use(middleware.swaggerUi());
});

app.listen(port, err => {
  if (err) {
    return console.log("Error: ", err);
  }

  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
