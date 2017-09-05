const express = require('express')  
const request = require('request')
const app = express()  
const dotenv = require('dotenv');
var HttpStatus = require('http-status-codes');

dotenv.load()
const port = process.env.PORT


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
app.get('/api/kademlia/find_node', (request, response) => {    
  response.status(HttpStatus.OK)
  response.setHeader('Content-Type', 'application/json')
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

app.listen(port, (err) => {  
  if (err) {
    return console.log('Error: ', err)
  }

  console.log(`Server is listening on port ${port}`)
})