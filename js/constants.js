/* 
* Constants for the network, by req spec
*/

module.constants = {
    'alpha': 3, //the degree of parallelism - INIT 3, can be changed later
    'B': 8,//the size of the ID space [0, 2B-1], as well as the number of buckets - can be 16 as well
    'k': 10, //the maximum number of nodes allowed in a bucket - INIT 10, can be changed later
    'timeout': 200, //time before errors
}