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
const DataPublisher = require("./../custom_modules/dataPublisher");
const dataPublisher = new DataPublisher();

const app = express();

const apiPath = "/api/kademlia/";

//public purposes
app.set("views", path.join(__dirname, ".././views/"));
app.use("/views", express.static(path.join(__dirname, ".././views")));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./../views/"));

var args = process.argv.slice(2);
const port = args[0];

//For presentation
app.get("/", (request, response) => {
  response.render("index", {
    title: "Hey!",
    message: "This works :-)",
    node: global.node,
    buckets: global.BucketManager.buckets
  });
});

//Data view
app.get("/data", (request, response) => {
  var dataForView = [];
  global.DataManager.dataStorage.forEach(function(value, key) {
    dataForView.push({ key: key, value: value });
  });

  response.render("dataView", {
    title: "Hey!",
    message: "This works :-)",
    node: global.node,
    dataStorage: dataForView
  });
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
  console.log("closest to ", request.params.id);
  console.log("Buckets", global.BucketManager.buckets);
  requestNode = new Node(
    request.body.nodeId,
    request.body.nodeIP,
    request.body.nodePort
  );

  global.BucketManager.updateNodeInBuckets(requestNode);
  closestNodes = global.BucketManager.getClosestNodes(request.params.id);
  response.status(HttpStatus.OK);
  response.setHeader("Content-Type", "application/json");
  response.json({
    nodeId: global.node.id,
    rpcId: request.body.rpcId,
    closestNodes: closestNodes
  });
});

//STORE VALUE ENDPOINT
app.post(apiPath + "nodes/data", (request, response) => {
  var key = request.body.name;
  var value = request.body.value;
  global.DataManager.storeValueWithKeyHashing(key, value);
  dataPublisher.publishToKNodesClosestToTheKey(key, value);
  response.status(HttpStatus.OK);
  response.send("post received!");
});

// TODO Naming endpoints better for two different store value calls!!!
app.post(apiPath + "data", (request, response) => {
  console.log("Store value request received!");
  global.DataManager.storeValue(request.body.key, request.body.value);
  response.status(HttpStatus.OK);
  response.send("post received!");
});

app.get(apiPath + "value", (request, response) => {
  console.log("Find value request received: " + request.query.key);
  key =  request.query.key;
  value = undefined;
  if (value) {
    console.log("Local value: " + value);
  } else {
    dataPublisher.findValue(key, (nodeId, value) => {
      if(value){
        console.log("Value for the key " + key + " found in node " + nodeId);
        console.log("Value: " + value);
        // render view
        response.send(value)
      } else{
        console.log("Value for the key " + key + " not found!");
        //render view
        response.send(value)
      }
    });
  }
});


app.get(apiPath + "local_value", (request, response) => {
  value = global.DataManager.findValue(request.body.key);
  response.json({ value: value });
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
  communicator.sendFindNode(global.node.id, global.baseNode, function(result) {
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
