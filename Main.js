import {initSignalling, sendTo } from './Signalling/Signalling';
import dataTransfer from './Signalling/RTCdataChannelSignalling';
import {createOffer, createAnswer, manageConnection} from './rtc';
import logger from './logger';

//---Configuration and settings---//
var wsUri = "ws://127.0.0.1:8080";
const serverConfig = null;

var constraints = { video: true, audio: false };

const offerOptions = {
	offerToReceiveVideo: 1,
};
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

var myUser = {
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

var localStream;
var activePeers = new Set();
var peers = new Map();
var localStreamReady = new Event('localStreamReady');

//To Start Signalling on load.
window.addEventListener('load', onLoad);

//---------//


// function startStream() {
// 	startButton.disabled = true;
// 	navigator.mediaDevices.getUserMedia(constraints)
// 		.then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
// }
// function gotLocalMediaStream(mediaStream) {
// 	localStream = mediaStream;
// 	localVideo.srcObject = mediaStream;
// 	localVideo.dispatchEvent(localStreamReady);
// 	//TODO: Add stream to the all the rtc connection and renegotiate offers
// }
// function handleLocalMediaStreamError(error) {
// 	logger('navigator.getUserMedia error: ' + error, log.error);
// }

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
		// remoteStream: remoteStream,
		// remoteVideo: remoteVideo
	}
	peers.set(id, peer);
}

export function connectTo(id) {
	logger("Connecting to" + id, log.log);
	
	initPeer(id);
	peers.get(id).dataChannel = peers.get(id).peerConnection.createDataChannel("DataChannel");
	dataTransfer(id);
	createOffer(id);
	manageConnection(id);
}

export function acceptConnection(id, offer) {
	logger("Accepting connection from" + id, log.log);
	
	initPeer(id);
	
	peers.get(id).peerConnection.addEventListener('datachannel', event => {
		peers.get(id).dataChannel = event.channel;
		dataTransfer(id);
	});

	createAnswer(id, offer);
	manageConnection(id,);
}

function disconnect() {
	//TODO
}


