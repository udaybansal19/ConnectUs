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

export function updateTable( peer ) {
    var bucket = id ^ peer.id;
    var index = findPeer(peer.id);

    if( index != -1) {
        
        routingTable[bucket].splice(index, 1);
        routingTable[bucket].push(peer);

    } else {

        if( routingTable[bucket].length < kBucketSize) {

            routingTable[bucket].push(peer);

        } else {
         
            var headNode = routingTable[bucket][0];

            if( isActive(headNode) ) {

                routingTable[bucket].shift();
                routingTable[bucket].push(headNode);

            } else {

                routingTable[bucket].shift();
                routingTable[bucket].push(peer);

            }

        }

    }

}

export function getPeerIndex( peerId ) {

    var bucket = id ^ peerId;
    return routingTable[bucket].findIndex( (p) => p.id === peerId);

}

export function getPeer( peerId ) {

    var bucket = id ^ peerId;
    return routingTable[bucket].find( (p) => p.id === peerId);
}

function isActive( peer ) {

    return protocol.ping(peer);

}

