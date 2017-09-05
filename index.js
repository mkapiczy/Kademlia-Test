const express = require('express')  
const app = express()  
const dotenv = require('dotenv');
var HttpStatus = require('http-status-codes');

dotenv.load()
const port = process.env.PORT

//Html Index
app.get('/', (request, response) => {  
  response.send('Hello from Express!')
})

//PING
app.get('/api/kademlia/ping', (request, response) => {    
  response.status(HttpStatus.OK)
  response.send("PONG")
})

//FIND_NODE
app.get('/api/kademlia/find_node', (request, response) => {    
  response.status(HttpStatus.OK)
  response.setHeader('Content-Type', 'application/json')
  //findClosestNodes
  closestNodes = {}
  response.json(JSON.stringify({closestNodes}))
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('Error: ', err)
  }

  console.log(`Server is listening on port ${port}`)
})