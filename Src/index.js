import {initSignalling} from './networking/Signalling';
import dataTransfer from './networking/RTCdataChannelSignalling';
import * as RTC from './rtc';
import {logger, log } from './logger';
import * as table from './dht/routingTable';

//---Configuration and settings---//
export var wsUri = "ws://127.0.0.1:8080";
const serverConfig = 
{iceServers:[ {url:'stun:stun01.sipphone.com'},
//  {url:'stun:stun.ekiga.net'},
//  {url:'stun:stun.fwdnet.net'},
// {url:'stun:stun.ideasip.com'},
// {url:'stun:stun.iptel.org'},
// {url:'stun:stun.rixtelecom.se'},
// {url:'stun:stun.schlund.de'},
// {url:'stun:stun.l.google.com:19302'},
// {url:'stun:stun1.l.google.com:19302'},
// {url:'stun:stun2.l.google.com:19302'},
// {url:'stun:stun3.l.google.com:19302'},
// {url:'stun:stun4.l.google.com:19302'},
// {url:'stun:stunserver.org'},
// {url:'stun:stun.softjoys.com'},
// {url:'stun:stun.voiparound.com'},
// {url:'stun:stun.voipbuster.com'},
// {url:'stun:stun.voipstunt.com'},
// {url:'stun:stun.voxgratia.org'},
// {url:'stun:stun.xten.com'},
{
		url: 'turn:numb.viagenie.ca',
		credential: 'muazkh',
		username: 'webrtc@live.com'
},
{
		url: 'turn:192.158.29.39:3478?transport=udp',
		credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
		username: '28224511:1379330808'
},
{
		url: 'turn:192.158.29.39:3478?transport=tcp',
		credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
		username: '28224511:1379330808'
}]};

//------------------------------//

//---Initialization---//


export var myUser = {
	id: null,
	name: 'user',
	localStream: null,
	localTracks: null,
	remoteVideos: null
}

export var activePeers = new Set();

//---------//

//Signalling codes
const signallingMethod = {
	websockets: 1,
	dataChannel: 2,
	routingChannel: 3 
}
Object.freeze(signallingMethod);

export var defaultSignallingMethod = signallingMethod.websockets;

export function start(wsUri) {
	initSignalling(wsUri);
}

function initPeer(id) {

	const peerConnection = new RTCPeerConnection(serverConfig);

	if(myUser.localStream){
		peerConnection.addTrack(myUser.localTracks[0],myUser.localStream);
	}
	
	var peer = {
		id: id,
		name: 'user',
		peerConnection: peerConnection,
		dataChannel: null,
		signallingMethod: defaultSignallingMethod,
		remoteStream: new MediaStream(),
		remoteVideoElement: null
	}
	table.updateTable(peer);

	return peer;
}

export function connectTo(id) {
	logger("Connecting to " + id, log.log);
	
	var peer = initPeer(id);
	peer.dataChannel = peer.peerConnection.createDataChannel("DataChannel");
	
	dataTransfer(peer);
	RTC.manageConnection(peer);
}

export function acceptOffer(id, offer) {
	logger("Accepting connection from " + id, log.log);

	if(table.getPeerIndex(id) != -1) {

		RTC.createAnswer(table.getPeer(id), offer);

	} else {

		var peer = initPeer(id);

		peer.peerConnection.addEventListener('datachannel', event => {
			peer.dataChannel = event.channel;
			dataTransfer(peer);
		});

		RTC.createAnswer(peer, offer);
		RTC.manageConnection(peer);

	}	
}

export function acceptAnswer(id, answer) {
	RTC.acceptAnswer(table.getPeer(id), answer);
}

export function addIceCandidateToPeer(id, iceCandidate) {
	RTC.addIceCandidate(table.getPeer(id), iceCandidate);
}

export function setRemoteVideosContainer(remoteVideosContainer) {
	myUser.remoteVideos = remoteVideosContainer;
}

export function getUserId() {
	// return myUser.id;
	return new Promise((resolve) => {
		while(myUser == null){

		}
		resolve(myUser.id);
	})
}

//Refactor later to add p2p connection layer.
//Data transfer Layer
export function addLocalStream(tracks,localStream) {
	myUser.localStream = localStream;
	myUser.localTracks = tracks;
	activePeers.forEach( id => {
		var peer = table.getPeer(id);
		peer.peerConnection.addTrack(tracks[0],localStream);
	});
}
