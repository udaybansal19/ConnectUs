# p2p Internet Implementations

-	Distributing work to a network to improve processing time
    1.	Does not require a peer to know about its peers

    2.	Structured topography can be used

    3.	Needs to know about capabilities of its peers or would have to selectively place itself

-	Share data with peers without central authority
    1.	DHT needed
    2.	Content based indexing would be helpful
    3.	Unstructured topography might be good
    4.	Eg. IPFS

-	Better communication between peers for effective comms.
    1.	Unstructured topography
    2.	DHT for peer identity

### Kademila Implementation:

#### Add Peer:
1.	Peer is added when its first opens up the website
2.	A peer id is assigned by the website
3.	Peer id can be assigned according to username entered by the user or randomly
4.	It starts creating its routing table

#### Routing table:
1.	Stores the connection information of the peers with longest common prefix
2.	A node from every subtree is stored in the routing table

    #### Types:
    ##### Flat Layout (Section 2.2) - Used for version 1.2.0
    Fixed K buckets in linear fashion
    Easy implementation of Routing Table

    ##### Tree Layout (Section 2.4) - For version 1.3.0
    For handling unbalanced trees
    For Bucket Splitting
    Enhanced version of routing table 
