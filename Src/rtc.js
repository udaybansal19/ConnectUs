import { logger, log } from './logger';
import sendTo from './networking/Signalling';
import { myUser, defaultSignallingMethod } from './index';
import { stopWebSocket } from "./networking/socketSignalling";

const offerOptions = {
	offerToReceiveVideo: 1,
};

var activeConnections = 0;

export function createOffer(peer) {
	const peerConnection = peer.peerConnection;
    peerConnection.createOffer(offerOptions)
		.then((offer) => {
			peerConnection.setLocalDescription(offer).then(() => {
				logger("Offer created for " + peer.id, log.log);
			}).catch(error => {
				logger("Peer connection local description error " + error, log.error);
			});
			sendTo('sessionDescriptionOffer', offer, peer.id);
		});
}

export function createAnswer(peer, offer) {
	const peerConnection = peer.peerConnection;
	peerConnection.setRemoteDescription(offer)
		.then(() => {
			peerConnection.createAnswer()
				.then((answer) => {
					peerConnection.setLocalDescription(answer).then(() => {
					}).catch(error => {
						logger("Failed to set local description: error " + error, log.error);
					});
					sendTo('sessionDescriptionAnswer', answer, peer.id);
				}).catch( error => {
					logger("Failed to create Answer" + error, log.error);
				});
			logger("Remote Description set", log.log);
		}).catch((error) => {
			logger("Failed to set remote description of " + peer.id + "with error " + error, log.error);
		});
	
}

export function acceptAnswer(peer, answer) {
	peer.peerConnection.setRemoteDescription(answer)
			.then(() => {
				logger("Remote Description Set", log.log);
			}).catch( error => {
				logger("Failed to set remote description: error " + error, log.error);
			});
}

export function addIceCandidate(peer,iceCandidate) {
	peer.peerConnection.addIceCandidate(iceCandidate)
		.then(() => {
			logger("ICE candidate added", log.log);
		}).catch(error => {
			logger("Ice candidate error " + error, log.error);
		});
}

export function manageConnection(peer) {

	const peerConnection = peer.peerConnection;

	//Ice Candidate
	//sending iceCandidate data
	peerConnection.onicecandidate = event => {
		if (event.candidate) {
			sendTo('iceCandidate', event.candidate, peer.id);
		}
	};

	peerConnection.addEventListener("negotiationneeded", ev => {
		logger("Negotiation Needed", log.log);
		createOffer(peer);
	});



	//WebRTC connection status
	peerConnection.addEventListener('connectionstatechange', event => {
		switch(peerConnection.connectionState) {
			case 'connected':
				logger("WebRTC Connected with " + peer.id, log.info);
				activeConnections++;

				if(activeConnections > 2) {
					defaultSignallingMethod = 2;
					stopWebSocket();
				}
				break;
			case 'disconnected':
				logger("WebRTC Disonnected with " + peer.id, log.info);
				activeConnections--;
				break;
			default:
				logger("WebRTC " + peerConnection.connectionState + " with id " + peer.id, log.log );
				break;			
		}
	});

	//Add remote stream to DOM object at sender's side
	peerConnection.addEventListener('track', async (event) => {
		logger("Stream received", log.log);
		peer.remoteStream.addTrack(event.track, peer.remoteStream);
		event.track.onunmute = () => {
			logger('track unmuted', log.log);
			peer.remoteVideo = document.createElement("video");
			myUser.remoteVideos.appendChild(peer.remoteVideo);
			peer.remoteVideo.srcObject = peer.remoteStream;
			peer.remoteVideo.autoplay = true;
		    peer.remoteVideo.playsInline = true;
			peer.remoteVideo.muted = true;

    	}
	});

	peerConnection.addEventListener("iceconnectionstatechange", ev => {
		logger("IceConnection State changed to: " + peerConnection.iceConnectionState, log.log);
	});
	logger("IceConnection initial state: " + peerConnection.iceConnectionState,log.log);


	peerConnection.addEventListener("icegatheringstatechange", ev => {
		logger("Ice Gathering State changed to: " + peerConnection.iceGatheringState, log.log);
	});
	logger("Ice Gathering inital state: " + peerConnection.iceGatheringState, log.log);


}