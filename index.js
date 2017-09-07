// node_modules
const express = require("express");
const dotenv = require("dotenv");
var swaggerTools = require("swagger-tools");
var YAML = require("yamljs");

// custom config modules
const constants = require("./config/constants");
const httpApp = require("./config/server")

// custom modules
const app = require("./custom_modules/app")

const webApp = express();
webApp.use(httpApp)

var swaggerDoc = YAML.load("openapi.yaml");
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
  webApp.use(middleware.swaggerUi());
});

// necessary to read environment parameters from .env file
dotenv.load();

const nodeIpAddr = process.env.NODE_IP;
const nodePort = process.argv.slice(2)[0]

app.init(nodeIpAddr, nodePort);
