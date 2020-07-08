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

var id;

var routingTable = new Array(nodeBits);

export function updateTable( peer ) {
    id = myUser.id;
    var bucket = id ^ peer.id;
    var index = getPeerIndex(peer.id);

    if( index != -1) {
        
        routingTable[bucket].splice(index, 1);
        routingTable[bucket].push(peer);

    } else {

        if( routingTable[bucket] == null || routingTable[bucket].length < kBucketSize ) {

            routingTable[bucket] = new Array();
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
    if(!routingTable[bucket])
        return -1;
    return routingTable[bucket].findIndex( (p) => p.id === peerId);

}

export function getPeer( peerId ) {

    var bucket = id ^ peerId;
    if(!routingTable[bucket])
        return -1;
    return routingTable[bucket].find( (p) => p.id === peerId);
}

export function getClosestPeer( peerId ) {

    var bucket = id ^ peerId;
    if(!routingTable[bucket])
        return -1;
    return routingTable[bucket][0];

}

function isActive( peer ) {

    return protocol.ping(peer);

}

