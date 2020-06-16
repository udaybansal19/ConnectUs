import {initSignalling} from './Signalling/Signalling';
import dataTransfer from './Signalling/RTCdataChannelSignalling';
import * as RTC from './rtc';
import {logger, log } from './logger';

//---Configuration and settings---//
export const wsUri = "ws://127.0.0.1:8080";
const serverConfig = null;

var constraints = { video: true, audio: false };

//------------------------------//

//---Initialization---//
var localVideo = document.getElementById("localVideo");
var remoteVideos = document.getElementById("video-chat");

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

startButton.disabled = true;
stop.disabled = true;

//startButton.addEventListener('click', startStream);
stopButton.addEventListener('click', disconnect);

export var myUser = {
	id: null,
	name: 'user'
}

//Signalling codes
const signallingMethod = {
	websockets: 1,
	dataChannel: 2,
	routingChannel: 3 
}
Object.freeze(signallingMethod);

export var activePeers = new Set();
var peers = new Map();

//To Start Signalling on load.
window.addEventListener('load', onLoad);

//---------//

function onLoad() {
	initSignalling();
}

function initPeer(id) {

	const peerConnection = new RTCPeerConnection(serverConfig);
	
	var peer = {
		id: id,
		name: 'user',
		peerConnection: peerConnection,
		dataChannel: null,
		signallingMethod: signallingMethod.websockets,
	}
	peers.set(id, peer);

	return peer;
}

export function connectTo(id) {
	logger("Connecting to" + id, log.log);
	
	var peer = initPeer(id);
	peer.dataChannel = peer.peerConnection.createDataChannel("DataChannel");
	
	dataTransfer(peer);
	RTC.createOffer(peer);
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

function disconnect() {
	//TODO
}


