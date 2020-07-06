// Implementing Routing Table using Flat Layout from 
// the original paper on Kademlia section 2.2.

// TODO: Switch to a tree based approach as given in 
// section 2.4 for handling hughly unbalanced tree and bucket spliting.

var nodeBits = 160;
var kBucketSize = 20;

// make $(nodeBits) buckets with size $(kBucketSize)
// each bucket is kept sorted according to time last seen
// least recently seen node at the head
// most recently seen node at tail

// if node.existsInBucket == true
//     add node to tail //it is now most recently seen
//     if node in correct bucket && bucket.size < k 
//         add node to tail
//     else if bucket is full
//         ping node at head
//             if head.node.ping == inactive
//                 remove head node from bucket
//                 add node to tail
//             else
//                 move head node to tail
//                 discard the node

