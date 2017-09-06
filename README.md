# Kademlia

#### Introduction
Implementation of the Kademlia protocol, made in NodeJS for an IoT course @Aarhus University
Every instance of the index.js file is a node. (Maybe renamed for future use and milestones)

##### Usage
The default port for the bootstrap node is 8000. The next can be randomly assigned.
Run the following
```
$ npm install
$ node index.js 8000
$ node index.js 8001
```
This will fire up two clients that will connect and discover one another.

##### Documentation
On the http://localhost:#port/docs there is a swagger page as documentation of the RESTful services.
