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

const kademliaApiPath = "/api/kademlia/";
const apiPath = "/api/";

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
app.get(kademliaApiPath + "info/ping", (request, response) => {
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
app.get(kademliaApiPath + "nodes/:id", (request, response) => {
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
app.post(kademliaApiPath + "nodes/data", (request, response) => {
    let key = request.body.name;
    let value = request.body.value;

    kademlia.storeValue(key, value, (closestNode) => {
        // notify
        response.status(HttpStatus.OK);
        response.send("post received!");
    });

});

app.get(kademliaApiPath + "data", (request, response) => {
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


app.post(apiPath + "store/data", (request, response) => {
    console.log("Store value request received!");
    global.DataManager.storeValue(request.body.key, request.body.value);
    response.status(HttpStatus.OK);
    response.send("post received!");
});


app.get(apiPath + "store/value", (request, response) => {
    value = global.DataManager.findValueByHashedKey(request.body.key);
    response.json({value: value});
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
