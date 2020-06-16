import { logger, log } from './logger';
import sendTo from './Signalling/Signalling';

const offerOptions = {
	offerToReceiveVideo: 1,
};

export function createOffer(peer) {
	const peerConnection = peer.peerConnection;
    peerConnection.createOffer(offerOptions)
		.then((offer) => {
			peerConnection.setLocalDescription(offer).then(() => {
			}).catch(error => {
				logger("Peer connection local description error " + error, log.error);
			});
			sendTo('sessionDescriptionOffer', offer, peer.id);
		});
}

export function createAnswer(peer, offer) {
	const peerConnection = peer.peerConnection;
    peerConnection.setRemoteDescription(offer);
	peerConnection.createAnswer()
		.then((answer) => {
			peerConnection.setLocalDescription(answer).then(() => {
			}).catch(error => {
				logger("Peer connection local description error " + error, log.error);
			});
			sendTo('sessionDescriptionAnswer', answer, peer.id);
		});
}

export function acceptAnswer(peer, answer) {
	peer.peerConnection.setRemoteDescription(answer);
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
		logger("Negotiation Needed", log.debug);
	});

	//WebRTC connection status
	peerConnection.addEventListener('connectionstatechange', event => {
		switch(peerConnection.connectionState) {
			case 'connected':
				logger("WebRTC Connected with " + peer.id, log.info);
				break;
			case 'disconnected':
				logger("WebRTC Disonnected with " + peer.id, log.info);
				break;
			default:
				break;			
		}
	});

}

