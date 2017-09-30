const express = require("express");
const HttpStatus = require("http-status-codes");
const bodyParser = require("body-parser");
const path = require("path");
let swaggerTools = require("swagger-tools");
let YAML = require("yamljs");

const app = express();
const Node = require("../custom_modules/kademlia/node");
const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();

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

let args = process.argv.slice(2);
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
    let dataForView = [];
    global.DataManager.dataStorage.forEach(function (value, key) {
        dataForView.push({key: key, value: value});
    });

    response.render("dataView", {
        title: "Hey!",
        message: "This works :-)",
        node: global.node,
        dataStorage: dataForView
    });
});

//Find Value view
app.get("/find", (request, response) => {

    response.render("findView", {
        title: "Hey!",
        message: "This works :-)",
        node: global.node,
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

    kademlia.handlePing(requestNode, () => {
        response.status(HttpStatus.OK);
        response.json({
            nodeId: global.node.id,
            rpcId: request.body.rpcId,
            msg: "PONG"
        });
        console.log("Buckets", global.BucketManager.buckets);
    });
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

    kademlia.getKClosestNodes(request.params.id, requestNode, (closestNodes) => {
        response.status(HttpStatus.OK);
        response.setHeader("Content-Type", "application/json");
        response.json({
            nodeId: global.node.id,
            rpcId: request.body.rpcId,
            closestNodes: closestNodes
        });
    });
});

//STORE VALUE ENDPOINT
app.post(apiPath + "nodes/data", (request, response) => {
    let key = request.body.name;
    let value = request.body.value;

    kademlia.storeValue(key, value);
    // notify the closest node

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

app.get(apiPath + "data", (request, response) => {
    console.log("Find value request received: " + request.query.key);
    key = request.query.key;
    value = global.DataManager.findValueByNonHashedKey(key);
    if (value) {
        response.send({value: value, node: global.node.id});
    } else {
        kademlia.findValue(key, (value, nodeId) => {
            response.send({value: value, node: nodeId});
        });
    }
});


app.get(apiPath + "local_value", (request, response) => {
    value = global.DataManager.findValueByHashedKey(request.body.key);
    response.json({value: value});
});


//Endpoint for testing ping operation
app.get("/test/ping", (request, response) => {
    communicator.sendPing(global.node, global.baseNode, function (result) {
        response.status(HttpStatus.OK);
        response.setHeader("Content-Type", "application/json");
        response.json(JSON.stringify(result));
    });
});

//Endpoint for testing ping operation
app.get("/test/find_node", (request, response) => {
    communicator.sendFindNode(global.node.id, global.baseNode, function (result) {
        console.log(result);
        response.status(HttpStatus.OK);
        response.setHeader("Content-Type", "application/json");
        response.json(JSON.stringify(result));
    });
});

let swaggerDoc = YAML.load("openapi.yaml");
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    app.use(middleware.swaggerUi());
});

app.listen(port, err => {
    if (err) {
        return console.log("Error: ", err);
    }

    console.log(`Server is listening on port ${port}`);
});

module.exports = app;
