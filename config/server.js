const express = require("express");
const HttpStatus = require("http-status-codes");
const bodyParser = require("body-parser");

const communicator = require("./../custom_modules/communicator");

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var args = process.argv.slice(2);
const port = args[0];

app.get("/", (request, response) => {
  response.send("Hello from Express!");
});

//PING ENDPOINT
app.get("/api/kademlia/ping", (request, response) => {
  // verify update provide response
  console.log("Request body: ", request.body);
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

//Endpoint for testing ping operation
app.get("/test_ping", (request, response) => {
   communicator.sendPing(global.node, global.baseNode, function(result) {
    console.log(result);
    response.status(HttpStatus.OK);
    response.setHeader("Content-Type", "application/json");
    response.json(JSON.stringify(result));
  });
});

app.listen(port, err => {
    if (err) {
      return console.log("Error: ", err);
    }
  
    console.log(`Server is listening on port ${port}`);
  });
  

module.exports = app;
