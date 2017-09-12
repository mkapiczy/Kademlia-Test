const BucketManager = require('./../custom_modules/BucketManager');
const Node = require('./../custom_modules/node');
const constants = require('./../config/constants');
const util = require('./../custom_modules/util');


var bucketManager;

//For running this test, ping was commented out from kbucket (always add node)
function getNodesFromFullBucketTest() {
    bucketManager = new BucketManager();
    global.node = new Node(32, 'http://localhost', 8000);

    for(var i = 0; i < 200; i++) {
        bucketManager.updateNodeInBuckets(new Node(util.createRandomId(1), 'http://localhost', 8000+i+1));
    }


   console.log(bucketManager.buckets[0]);
   console.log(bucketManager.buckets[1]);
   console.log(bucketManager.buckets[2]);
   console.log(bucketManager.buckets[3]);
   console.log(bucketManager.buckets[4]);
   console.log(bucketManager.buckets[5]);
   console.log(bucketManager.buckets[6]);
   console.log(bucketManager.buckets[7]);

   var nodesList = bucketManager.getClosestNodes(30);
   console.log(nodesList);

   nodesList.forEach((node) => {
       console.log(bucketManager.distanceBetweenTwoNodes(30, node.id))
   })


}

function createDummyData() {

}

getNodesFromFullBucketTest();
