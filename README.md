# Kademlia

#### Introduction
Implementation of the Kademlia protocol, made in NodeJS for an IoT course @Aarhus University
Every instance of the index.js file is a node. (Maybe renamed for future use and milestones)

##### Usage
The default port for the bootstrap node is 8000. The next can be randomly assigned.
Run the following (bash commands)
```
$ npm install
$ ./start.sh
```
This will run 100 instances of nodes. They can be killed with:
```
$ sudo killall node
```
##### Documentation
On the http://localhost:#port/docs there is a swagger page as documentation of the RESTful services.

