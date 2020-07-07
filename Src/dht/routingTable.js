// Implementing Routing Table using Flat Layout from 
// the original paper on Kademlia section 2.2.

// TODO: Switch to a tree based approach as given in 
// section 2.4 for handling hughly unbalanced tree and bucket spliting.

import { myUser } from '../index';
import * as protocol from './protocol';

var nodeBits = 160;
var kBucketSize = 20;

// make $(nodeBits) buckets with size $(kBucketSize)
// each bucket is kept sorted according to time last seen
// least recently seen node at the head
// most recently seen node at tail

// if node.existsInBucket == true
//     move node to tail //it is now most recently seen
// else 
//      if bucket.size < k 
//          add node to tail
//      else 
//          if head.node.ping == active
//             move head node to tail
//             discard the node
//          else
//             remove head node from bucket
//             add node to tail

var id = myUser.id;

var routingTable = new Array(nodeBits);

function updateTable( nodeId ) {
    var bucket = id ^ nodeId;
    var index = routingTable[bucket].indexOf(nodeId);

    if( index != -1) {
        
        routingTable[bucket].splice(index, 1);
        routingTable[bucket].push(nodeId);

    } else {

        if( routingTable[bucket].length < kBucketSize) {

            routingTable[bucket].push(nodeId);

        } else {
         
            var headNode = routingTable[bucket][0];

            if( isActive(headNode) ) {

                routingTable[bucket].shift();
                routingTable[bucket].push(headNode);

            } else {

                routingTable[bucket].shift();
                routingTable[bucket].push(nodeId);

            }

        }

    }

}

function isActive( nodeId ) {
    return protocol.ping(nodeId);
}

