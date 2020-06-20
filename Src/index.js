import {initSignalling} from './Signalling/Signalling';
import dataTransfer from './Signalling/RTCdataChannelSignalling';
import * as RTC from './rtc';
import {logger, log } from './logger';

//---Configuration and settings---//
//export var wsUri = "ws://127.0.0.1:8080";
const serverConfig = null;

//------------------------------//

//---Initialization---//


export var myUser = {
	id: null,
	name: 'user',
	localStream: null,
	remoteVideos: null
}

export var activePeers = new Set();
var peers = new Map();

//---------//

//Signalling codes
const signallingMethod = {
	websockets: 1,
	dataChannel: 2,
	routingChannel: 3 
}
Object.freeze(signallingMethod);

export function start(wsUri) {
	initSignalling(wsUri);
}

function initPeer(id) {

	const peerConnection = new RTCPeerConnection(serverConfig);

	if(myUser.localStream){
		peerConnection.addTrack(myUser.localStream.getTracks().get(0),localStream);
	}
	
	var peer = {
		id: id,
		name: 'user',
		peerConnection: peerConnection,
		dataChannel: null,
		signallingMethod: signallingMethod.websockets,
		remoteStream: new MediaStream(),
		remoteVideoElement: null
	}
	peers.set(id, peer);

	return peer;
}

export function connectTo(id) {
	logger("Connecting to " + id, log.log);
	
	var peer = initPeer(id);
	peer.dataChannel = peer.peerConnection.createDataChannel("DataChannel");
	
	dataTransfer(peer);
	//RTC.createOffer(peer);
	RTC.manageConnection(peer);
}

export function acceptOffer(id, offer) {
	logger("Accepting connection from" + id, log.log);
	
	var peer = initPeer(id);
	
	peer.peerConnection.addEventListener('datachannel', event => {
		peer.dataChannel = event.channel;
		dataTransfer(peer);
	});

	RTC.createAnswer(peer, offer);
	RTC.manageConnection(peer);
}

export function acceptAnswer(id, answer) {
	RTC.acceptAnswer(peers.get(id), answer);
}

export function addIceCandidateToPeer(id, iceCandidate) {
	RTC.addIceCandidate(peers.get(id), iceCandidate);
}

export function getPeer(id) {
	return peers.get(id);
}

export function addLocalStream(tracks,localStream) {
	myUser.localStream = localStream;
	peers.forEach( peer => {
		peer.peerConnection.addTrack(tracks[0],localStream);
	});
}

export function setRemoteVideosContainer(remoteVideosContainer) {
	myUser.remoteVideos = remoteVideosContainer;
}
