/* 
* Constants for the network, by req spec
*/
module.exports = {
    'alpha': 3, //the degree of parallelism - INIT 3, can be changed later
    'B': 8,//the size of the ID space [0, 2B-1], as well as the number of buckets - can be 16 as well
    'k': 10, //the maximum number of nodes allowed in a bucket - INIT 10, can be changed later
    'timeout': 200, //time before errors
    'tExpire': 86400, //the time after which a key/value pair expires in s
    'tRefresh': 3600, //time after which an otherwise unaccessed bucket must be refreshed
    'tReplicate': 3600, //the interval between Kademlia replication events, when a node is required to publish its entire database
    'tRepublish': 86400, // the time after which the original publisher must republish a key/value pair
}