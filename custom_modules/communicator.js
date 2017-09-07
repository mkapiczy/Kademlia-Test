const request = require("request");
const HttpStatus = require("http-status-codes");
const util = require("./util");

exports.sendPing = function(senderNode, nodeToPing, callBack) {
  var rpcId = util.createRandomAlphaNumericIdentifier(20);
  console.log("send ping");

  var requestOptions = {
    method: "GET",
    uri: nodeToPing.ipAddr + ":" + nodeToPing.port + "/api/kademlia/ping",
    body: {
      nodeId: senderNode.id,
      nodeIP: senderNode.ipAddr,
      port: senderNode.port,
      rpcId: rpcId
    },
    json: true
  };
  
  request(requestOptions, function(error, response) {
    if (error) {
      console.log(error);
      callBack("DELETE");
    } else {
      console.log(response.body);
      callBack("UPDATE");
    }
  });
};
